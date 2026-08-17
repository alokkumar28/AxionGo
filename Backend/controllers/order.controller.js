import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY_ID,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }
    if (
      !deliveryAddress ||
      !deliveryAddress.text ||
      deliveryAddress.latitude === undefined ||
      deliveryAddress.latitude === null ||
      deliveryAddress.longitude === undefined ||
      deliveryAddress.longitude === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is incomplete",
      });
    }
    if (!totalAmount || Number(totalAmount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount",
      });
    }
    const groupItemsByShop = {};
    for (const item of cartItems) {
      if (!item._id) {
        return res.status(400).json({
          success: false,
          message: "Invalid food item",
        });
      }
      if (!item.shop) {
        return res.status(400).json({
          success: false,
          message: `Shop information missing for ${item.name || "item"}`,
        });
      }
      if (!item.quantity || Number(item.quantity) <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${item.name || "item"}`,
        });
      }
      const shopId =
        typeof item.shop === "object"
          ? item.shop._id?.toString()
          : item.shop.toString();
      if (!shopId) {
        return res.status(400).json({
          success: false,
          message: `Invalid shop information for ${item.name || "item"}`,
        });
      }
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    }
    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          throw new Error(`Shop with ID ${shopId} not found`);
        }
        if (!shop.owner) {
          throw new Error(`Owner not found for shop ${shop.name}`);
        }
        const items = groupItemsByShop[shopId];
        const subTotal = items.reduce(
          (total, item) => total + Number(item.price) * Number(item.quantity),
          0,
        );
        return {
          shop: shop._id,
          owner: shop.owner._id,
          subTotalAmount: subTotal,
          shopOrderItems: items.map((item) => ({
            item: item._id,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
          })),
        };
      }),
    );

    if (paymentMethod === "Online Payment") {
      const razorpayOrder = await instance.orders.create({
        amount: Math.round(Number(totalAmount) * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
      const newOrder = await Order.create({
        user: req.userId,
        paymentMethod: "Online Payment",
        deliveryAddress,
        totalAmount: Number(totalAmount),
        shopOrders,
        razorpayOrderId: razorpayOrder.id,
        paymentFlag: false,
      });
      await newOrder.populate(
        "shopOrders.shopOrderItems.item",
        "name image price",
      );
      await newOrder.populate("shopOrders.shop", "name");
      return res.status(201).json({
        success: true,
        message: "Order created. Complete payment.",
        order: newOrder,
        razorpayOrder,
      });
    }

    if (paymentMethod === "Cash on Delivery") {
      const newOrder = await Order.create({
        user: req.userId,
        paymentMethod: "Cash on Delivery",
        deliveryAddress,
        totalAmount: Number(totalAmount),
        shopOrders,
        paymentFlag: false,
      });
      await newOrder.populate(
        "shopOrders.shopOrderItems.item",
        "name image price",
      );
      await newOrder.populate("shopOrders.shop", "name");
      await newOrder.populate("shopOrders.owner", "name socketId");
      await newOrder.populate("user", "name email mobile");
      const io = req.app.get("io");

      if (io) {
        newOrder.shopOrders.forEach((shopOrder) => {
          const ownerSocketId = shopOrder.owner?.socketId;
          if (ownerSocketId) {
            io.to(ownerSocketId).emit("newOrder", {
              _id: newOrder._id,
              paymentMethod: newOrder.paymentMethod,
              user: newOrder.user,
              shopOrder: shopOrder,
              deliveryAddress: newOrder.deliveryAddress,
              totalAmount: newOrder.totalAmount,
              createdAt: newOrder.createdAt,
            });
            console.log(
              `New order sent to owner ${shopOrder.owner._id} through socket ${ownerSocketId}`,
            );
          } else {
            console.log(
              `Owner ${shopOrder.owner._id} is offline. Order notification not sent through socket.`,
            );
          }
        });
      }

      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order: newOrder,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Invalid payment method",
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to place order",
    });
  }
};

export const verifyOnlinePayment = async (req, res) => {
  try {
    const { razorpay_payment_id, orderId } = req.body;
    if (!razorpay_payment_id || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID and Order ID are required",
      });
    }
    const payment = await instance.payments.fetch(razorpay_payment_id);
    if (!payment) {
      return res.status(400).json({
        success: false,
        message: "Payment details not found",
      });
    }
    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: "Payment was not captured",
      });
    }
    const order = await Order.findOne({
      _id: orderId,
      user: req.userId,
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    if (order.paymentMethod !== "Online Payment") {
      return res.status(400).json({
        success: false,
        message: "This order does not require online payment",
      });
    }
    if (order.paymentFlag === true) {
      return res.status(200).json({
        success: false,
        message: "Payment already verified",
        order,
      });
    }
    if (order.razorpayOrderId && payment.order_id !== order.razorpayOrderId) {
      return res.status(400).json({
        success: false,
        message: "Payment does not belong to this order",
      });
    }
    const expectedAmount = Math.round(Number(order.totalAmount) * 100);
    if (Number(payment.amount) !== expectedAmount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount does not match order amount",
      });
    }
    order.paymentFlag = true;
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();
    await order.populate(
      "shopOrders.shopOrderItems.item",
      "name image price"
    );
    await order.populate(
      "shopOrders.shop",
      "name"
    );
    await order.populate(
      "shopOrders.owner",
      "name socketId"
    );
    await order.populate(
      "user",
      "fullName email mobile"
    );

    const io = req.app.get("io");
    if (io) {
      order.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner?.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: order._id,
            paymentMethod: order.paymentMethod,
            user: order.user,
            shopOrder: shopOrder,
            deliveryAddress: order.deliveryAddress,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
          });
          console.log(
            `Online payment order sent to owner ${shopOrder.owner._id} through socket ${ownerSocketId}`
          );
        } else {
          console.log(
            `Owner ${shopOrder.owner?._id} is offline. Online order notification not sent through socket.`
          );
        }
      });
    }
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.role === "User") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name image")
        .populate("shopOrders.owner", "fullName email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");
      return res.status(200).json({
        success: true,
        orders,
      });
    }
    if (user.role === "Owner") {
      const orders = await Order.find({
        "shopOrders.owner": req.userId,
      })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name image")
        .populate("user", "fullName email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("shopOrders.assignedDeliveryBoy", "fullName mobile");

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrder: order.shopOrders.find(
          (o) => o.owner._id.toString() === req.userId,
        ),
        deliveryAddress: order.deliveryAddress,
        createdAt: order.createdAt,
      }));
      return res.status(200).json({
        success: true,
        orders: filteredOrders,
      });
    }
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    const shopOrder = order.shopOrders.find(
      (o) => o.shop.toString() === shopId,
    );
    if (!shopOrder) {
      return res.status(404).json({
        success: false,
        message: "Shop order not found",
      });
    }
    shopOrder.status = status;
    let deliveryBoysPayload = [];
    if (status == "Out for Delivery" && !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;
      const nearByDeliveryBoys = await User.find({
        role: "Delivery Boy",
        isOnline: true,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 5000,
          },
        },
      }).select("fullName mobile socketId location");
      const nearByIds = nearByDeliveryBoys.map((b) => b._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["Broadcasted", "Completed"] },
      }).distinct("assignedTo");
      const busyIdSet = new Set(busyIds.map((id) => String(id)));
      const availableBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id)),
      );
      const candidates = availableBoys.map((b) => b._id);
      if (candidates.length == 0) {
        await order.save();
        return res.status(200).json({
          success: true,
          message: "There is no available delivery boys.",
          availableBoys: [],
          shopOrder,
          assignedDeliveryBoy: null,
          assignment: null,
        });
      }
      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        broadCastedTo: candidates,
        status: "Broadcasted",
      });

      const shop = await Shop.findById(shopOrder.shop).select("name");

      const io = req.app.get("io");

      if (io) {
        availableBoys.forEach((boy) => {
          if (boy.socketId) {
            io.to(boy.socketId).emit("newDeliveryRequest", {
              assignmentId: deliveryAssignment._id,
              orderId: order._id,
              shopName: shop?.name,
              deliveryAddress: order.deliveryAddress,
              items: shopOrder.shopOrderItems,
              subTotal: shopOrder.subTotalAmount,
            });

            console.log(
              `Delivery request sent to ${boy.fullName} - ${boy.socketId}`
            );
          }
        });
      }


      shopOrder.assignedDeliveryBoy = deliveryAssignment?.assignedTo; //CHECK
      shopOrder.assignment = deliveryAssignment._id;
      deliveryBoysPayload = availableBoys.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }));
    }
    await order.save();
    await order.populate(
      "user",
      "fullName email mobile socketId"
    );
    const customerSocketId = order.user?.socketId;
    const io = req.app.get("io");
    if (io && customerSocketId) {
      io.to(customerSocketId).emit("orderStatusUpdated", {
        orderId: order._id,
        shopId: shopOrder.shop,
        status: shopOrder.status,
        shopOrderId: shopOrder._id,
        userId:order.user._id
      });
      console.log(
        `Order status "${shopOrder.status}" sent to customer ${order.user._id} through socket ${customerSocketId}`
      );
    } else {
      console.log(
        `Customer ${order.user?._id} is offline. Status update not sent through socket.`
      );
    }
    const updatedShopOrder = order.shopOrders.find(
      (o) => o.shop.toString() === shopId,
    );
    await order.populate("shopOrders.shopOrderItems.item", "name image price");
    await order.populate("shopOrders.shop", "name");
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email mobile",
    );
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy, //CHECK
      availableBoys: deliveryBoysPayload,
      assignment: updatedShopOrder?.assignment, //CHECK
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const assignment = await DeliveryAssignment.find({
      broadCastedTo: deliveryBoyId,
      status: "Broadcasted",
    })
      .populate("order")
      .populate("shop");
    const data = assignment
      .filter((a) => a.order && a.shop)
      .map((a) => {
        const shopOrder = a.order.shopOrders.find(
          (so) => so._id.toString() === a.shopOrderId.toString(),
        );
        return {
          assignmentId: a._id,
          orderId: a.order._id,
          shopName: a.shop.name,
          deliveryAddress: a.order.deliveryAddress,
          items: shopOrder?.shopOrderItems || [],
          subTotal: shopOrder?.subTotalAmount || 0,
        };
      });
    return res.status(200).json({
      success: true,
      assignments: data,
    });
  } catch (error) {
    console.error("GET ASSIGNMENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }
    if (assignment.status !== "Broadcasted") {
      return res.status(400).json({
        success: false,
        message:
          "Assignment expired or already accepted by another delivery boy",
      });
    }
    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: {
        $nin: ["Broadcasted", "Completed"],
      },
    });
    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message:
          "You are already assigned to an order or have accepted another order",
      });
    }
    assignment.assignedTo = req.userId;
    assignment.status = "Assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();
    const order = await Order.findById(assignment.order);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    const shopOrder = order.shopOrders.find(
      (so) => so._id.toString() === assignment.shopOrderId.toString(),
    );
    if (!shopOrder) {
      return res.status(404).json({
        success: false,
        message: "Shop order not found",
      });
    }
    shopOrder.assignedDeliveryBoy = req.userId;
    await order.save();
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email mobile",
    );
    return res.status(200).json({
      success: true,
      message: "Order accepted successfully",
      assignment,
      shopOrder,
      assignedDeliveryBoy: shopOrder.assignedDeliveryBoy,
    });
  } catch (error) {
    console.error("ACCEPT ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: "Assigned",
    })
      .populate("shop", "name address city state")
      .populate("assignedTo", "fullName email mobile location")
      .populate({
        path: "order",
        populate: [
          {
            path: "user",
            select: "fullName email mobile location",
          },
          {
            path: "shopOrders.shopOrderItems.item",
            select: "name image price",
          },
        ],
      });
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "No accepted assignment found",
      });
    }
    if (!assignment.order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    const shopOrder = assignment.order.shopOrders.find(
      (so) => String(so._id) === String(assignment.shopOrderId),
    );
    if (!shopOrder) {
      return res.status(404).json({
        success: false,
        message: "Shop order not found",
      });
    }
    let deliveryBoyLocation = {
      latitude: null,
      longitude: null,
    };
    if (assignment.assignedTo?.location?.coordinates?.length === 2) {
      deliveryBoyLocation.latitude =
        assignment.assignedTo.location.coordinates[1];
      deliveryBoyLocation.longitude =
        assignment.assignedTo.location.coordinates[0];
    }
    let customerLocation = {
      latitude: null,
      longitude: null,
    };
    if (assignment.order.deliveryAddress) {
      customerLocation.latitude = assignment.order.deliveryAddress.latitude;
      customerLocation.longitude = assignment.order.deliveryAddress.longitude;
    }
    return res.status(200).json({
      success: true,
      order: {
        _id: assignment.order._id,
        paymentMethod: assignment.order.paymentMethod,
        totalAmount: assignment.order.totalAmount,
        createdAt: assignment.order.createdAt,
      },
      customer: assignment.order.user,
      shop: {
        _id: assignment.shop?._id,
        name: assignment.shop?.name,
        address: assignment.shop?.address,
        city: assignment.shop?.city,
        state: assignment.shop?.state,
      },
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoy: assignment.assignedTo,
      deliveryBoyLocation,
      customerLocation,
    });
  } catch (error) {
    console.error("GET ACCEPTED ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("user", "fullName email mobile location")
      .populate({
        path: "shopOrders.shop",
        model: "Shop",
        select: "name image address city state",
      })
      .populate({
        path: "shopOrders.assignedDeliveryBoy",
        model: "User",
        select: "fullName email mobile location",
      })
      .populate({
        path: "shopOrders.shopOrderItems.item",
        model: "Item",
        select: "name image price",
      })
      .lean();
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("GET ORDER BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.body;
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!shopOrder) {
      return res.status(404).json({
        success: false,
        message: "Shop order not found",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await order.save();
    await sendDeliveryOtpMail(order.user.email, otp);
    console.log("DELIVERY OTP SENT");
    console.log("Order ID:", orderId);
    console.log("Shop Order ID:", shopOrderId);
    console.log("Customer:", order.user.fullName);
    console.log("OTP:", otp);
    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${order.user.fullName}`,
    });
  } catch (error) {
    console.error("SEND DELIVERY OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send delivery OTP",
      error: error.message,
    });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!shopOrder) {
      return res.status(404).json({
        success: false,
        message: "Shop order not found",
      });
    }
    if (!shopOrder.deliveryOtp) {
      return res.status(400).json({
        success: false,
        message: "No delivery OTP found. Please request a new OTP.",
      });
    }
    if (!shopOrder.otpExpires || shopOrder.otpExpires.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }
    if (shopOrder.deliveryOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }
    shopOrder.status = "Delivered";
    shopOrder.deliveredAt = new Date();
    shopOrder.deliveryOtp = undefined;
    shopOrder.otpExpires = undefined;
    await order.save();
    await DeliveryAssignment.deleteOne({
      shopOrderId: shopOrder._id,
      order: order._id,
      assignedTo: shopOrder.assignedDeliveryBoy,
    });
    console.log("ORDER DELIVERED SUCCESSFULLY");
    console.log("Order ID:", order._id);
    console.log("Shop Order ID:", shopOrder._id);
    console.log("Delivery Boy:", shopOrder.assignedDeliveryBoy);
    return res.status(200).json({
      success: true,
      message: "Order delivered successfully.",
      orderId: order._id,
      shopOrderId: shopOrder._id,
    });
  } catch (error) {
    console.error("VERIFY DELIVERY OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify delivery OTP.",
      error: error.message,
    });
  }
};
