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
        console.log(shopId);
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

    await newOrder.populate("shopOrders.shopOrderItems.item" ,"name image price ")
    await newOrder.populate("shopOrders.shop" ,"name")

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
    // ================= USER =================
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
    // ================= OWNER =================
    if (user.role === "Owner") {
      const orders = await Order.find({
        "shopOrders.owner": req.userId,
      })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name image")
        .populate("user", "fullName email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

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
      console.log(filteredOrders);
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
