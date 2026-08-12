import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res
        .status(400)
        .json({ message: "Delivery address is incomplete" });
    }
    const groupItemsByShop = {};
    cartItems.forEach((item) => {
      const shopId = item.shop._id.toString();
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });
    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          throw new Error(`Shop with ID ${shopId} not found`);
        }
        const items = groupItemsByShop[shopId];
        const subTotal = items.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
        return {
          shop: shop._id,
          owner: shop.owner._id,
          subTotalAmount: subTotal,
          shopOrderItems: items.map((item) => ({
            item: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        };
      }),
    );

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "name image price ",
    );
    await newOrder.populate("shopOrders.shop", "name");

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 5000,
          },
        },
      });
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