import React from "react";
import { FaCalendarAlt, FaClock, FaStore, FaMoneyBillWave } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function UserMyOrderCard({ order, shopOrder }) {
  const navigate = useNavigate();
  const orderStatus = shopOrder.status || "Pending";
  const orderStatusColor = orderStatus === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : orderStatus === "Accepted" ? "bg-blue-50 text-blue-700 border-blue-200" : orderStatus === "Preparing" ? "bg-orange-50 text-orange-700 border-orange-200" : orderStatus === "Out for Delivery" ? "bg-purple-50 text-purple-700 border-purple-200" : orderStatus === "Delivered" ? "bg-green-50 text-green-700 border-green-200" : orderStatus === "Cancelled" ? "bg-red-50 text-red-700 border-red-200" : "bg-gray-50 text-gray-700 border-gray-200";
  const orderDate = new Date(order.createdAt);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-gray-800 truncate">Order #<span className="text-orange-500">{order._id.slice(-8).toUpperCase()}</span></h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] sm:text-xs text-gray-500">
              <div className="flex items-center gap-1"><FaCalendarAlt className="text-orange-400" />{orderDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
              <div className="flex items-center gap-1"><FaClock className="text-orange-400" />{orderDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          </div>
          <span className={`shrink-0 px-2.5 py-1 rounded-full border text-[10px] sm:text-xs font-semibold ${orderStatusColor}`}>{orderStatus}</span>
        </div>
      </div>

      <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
            <FaStore className="text-orange-500 text-sm sm:text-base" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-gray-800 truncate">{shopOrder.shop.name}</h3>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Restaurant Partner</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 sm:px-5 sm:py-4">
        <div className="space-y-3">
          {shopOrder.shopOrderItems.map((food) => (
            <div key={food._id} className="flex items-center gap-3">
              <img src={food.item.image} alt={food.item.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-gray-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{food.item.name}</h4>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">₹{food.price} × {food.quantity}</p>
              </div>
              <p className="text-xs sm:text-sm font-bold text-orange-500 shrink-0">₹{food.price * food.quantity}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-500">Total Items</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-800">{shopOrder.shopOrderItems.reduce((total, item) => total + item.quantity, 0)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-500">Restaurant Total</span>
            <span className="text-base sm:text-lg font-bold text-orange-500">₹{shopOrder.subTotalAmount}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5"><FaMoneyBillWave className="text-orange-400" />Payment Method</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 text-right">{order.paymentMethod}</span>
          </div>
        </div>

        <div className="mt-4 bg-orange-50 border border-orange-100 rounded-xl p-3 sm:p-3.5">
          <div className="flex items-start gap-2.5">
            <MdDeliveryDining className="text-lg sm:text-xl text-orange-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-800">Delivery Address</h4>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-1 leading-4">{order.deliveryAddress.text}</p>
            </div>
          </div>
        </div>

        <button onClick={() => navigate(`/track-order/${order._id}`)} className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm py-2.5 sm:py-3 rounded-xl transition">Track Order</button>
      </div>
    </div>
  );
}

export default UserMyOrderCard;