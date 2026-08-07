import React from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaStore,
  FaMoneyBillWave,
} from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
function UserMyOrderCard({ order, shopOrder }) {
  const orderStatus = shopOrder.status || "Pending";
  const orderStatusColor =
    orderStatus === "Delivered"
      ? "bg-green-100 text-green-700"
      : orderStatus === "Preparing"
        ? "bg-orange-100 text-orange-700"
        : orderStatus === "Picked Up"
          ? "bg-blue-100 text-blue-700"
          : "bg-yellow-100 text-yellow-700";

  const orderDate = new Date(order.createdAt);

  return (
    <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition">
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Order #
              <span className="text-orange-500">
                {order._id.slice(-8).toUpperCase()}
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-5 mt-3 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                {orderDate.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <FaClock />
                {orderDate.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${orderStatusColor}`}
            >
              {orderStatus}
            </span>
          </div>
        </div>
      </div>
      <div className="px-6 py-5 border-b">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
            <FaStore className="text-orange-500 text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {shopOrder.shop.name}
            </h3>
            <p className="text-gray-500 text-sm mt-1">Restaurant Partner</p>
          </div>
        </div>
      </div>
      <div className="px-6 py-5">
        <div className="space-y-5">
          {shopOrder.shopOrderItems.map((food) => (
            <div key={food._id} className="flex gap-4 items-center">
              <img
                src={food.item.image}
                alt={food.item.name}
                className="w-20 h-20 rounded-2xl object-cover border"
              />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800">
                  {food.item.name}
                </h4>
                <p className="text-gray-500 mt-1">
                  ₹{food.price} × {food.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-orange-500">
                  ₹{food.price * food.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Total Items</span>
            <span className="font-semibold">
              {shopOrder.shopOrderItems.reduce(
                (total, item) => total + item.quantity,
                0,
              )}
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Restaurant Total</span>
            <span className="text-2xl font-bold text-orange-500">
              ₹{shopOrder.subTotalAmount}
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium flex items-center gap-2">
              <FaMoneyBillWave />
              Payment Method
            </span>
            <span className="font-semibold">{order.paymentMethod}</span>
          </div>
        </div>
        <div className="mt-8 bg-orange-50 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <MdDeliveryDining className="text-2xl text-orange-500 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-800">Delivery Address</h4>
              <p className="text-gray-600 mt-2 leading-6">
                {order.deliveryAddress.text}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => console.log(shopOrder)}
          className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-2xl transition"
        >
          Track Order
        </button>
      </div>
    </div>
  );
}

export default UserMyOrderCard;
