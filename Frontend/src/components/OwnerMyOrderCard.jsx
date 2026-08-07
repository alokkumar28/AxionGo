import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
function OwnerMyOrderCard({ order, shopOrder }) {
  const [status, setStatus] = useState("Pending");
  const statusColor =
    status === "Delivered"
      ? "bg-green-100 text-green-700"
      : status === "Accepted"
        ? "bg-blue-100 text-blue-700"
        : status === "Preparing"
          ? "bg-orange-100 text-orange-700"
            : status === "Out for Delivery"
              ? "bg-cyan-100 text-cyan-700"
              : status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700";

  const orderDate = new Date(order.createdAt);

  return (
    <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition">
      <div className="p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">
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
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`px-4 py-3 rounded-xl font-semibold outline-none border ${statusColor}`}
            >
              <option>Pending</option>
              <option>Accepted</option>
              <option>Preparing</option>
              <option>Out for Delivery</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      <div className="p-6 border-b">
        <h3 className="text-lg font-bold text-gray-800 mb-5">
          Customer Details
        </h3>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center">
              <FaUser className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Customer Name</p>
              <h4 className="font-semibold text-gray-800">
                {order.user.fullName}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center">
              <FaEnvelope className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <h4 className="font-semibold text-gray-800 break-all">
                {order.user.email}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center">
              <FaPhoneAlt className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Mobile</p>
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-gray-800">
                  {order.user.mobile}
                </h4>
                <a
                  href={`tel:${order.user.mobile}`}
                  className="text-orange-500 font-semibold text-sm"
                >
                  Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-5">
          {shopOrder.shopOrderItems.map((food) => (
            <div key={food._id} className="flex items-center gap-4">
              <img
                src={food.item.image}
                alt={food.item.name}
                className="w-20 h-20 rounded-2xl object-cover border"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">
                  {food.item.name}
                </h3>
                <p className="text-gray-500 mt-1">
                  ₹{food.price} × {food.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-500 text-lg">
                  ₹{food.price * food.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t pt-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Items</span>

            <span className="font-semibold">
              {shopOrder.shopOrderItems.reduce(
                (total, item) => total + item.quantity,
                0,
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Restaurant Total</span>
            <span className="text-2xl font-bold text-orange-500">
              ₹{shopOrder.subTotalAmount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-semibold">{order.paymentMethod}</span>
          </div>
        </div>
        <div className="mt-8 bg-orange-50 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-800 mb-2">Delivery Address</h3>
          <p className="text-gray-600 leading-6">
            {order.deliveryAddress.text}
          </p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => console.log("Assign Delivery Boy", order)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-2xl transition"
          >
            Assign Delivery Boy
          </button>
          <button
            onClick={() => console.log("Update Status", status, order._id)}
            className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-4 rounded-2xl transition"
          >
            Save Status
          </button>
        </div>
      </div>
    </div>
  );
}

export default OwnerMyOrderCard;
