import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
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

export default placeOrder;
