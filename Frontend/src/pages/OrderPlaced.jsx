import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaReceipt, FaHome } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";

function OrderPlaced() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
        <div className="flex justify-center">
          <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center">
            <FaCheckCircle className="text-6xl text-green-500" />
          </div>
        </div>
        <h1 className="mt-8 text-4xl font-bold text-gray-800">
          Order Placed Successfully!
        </h1>
        <p className="mt-4 text-gray-500 leading-7 max-w-xl mx-auto">
          Thank you for choosing <span className="font-semibold text-orange-500">AxionGo</span>.
          Your delicious meal is now being prepared by the restaurant.
          We'll notify you as soon as a delivery partner picks up your order.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          <div className="bg-orange-50 rounded-2xl p-5">
            <FaReceipt className="text-3xl text-orange-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">
              Order Confirmed
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Your order has been received.
            </p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-5">
            <MdDeliveryDining className="text-4xl text-orange-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">
              Preparing Food
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              The restaurant is preparing your meal.
            </p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-5">
            <FaHome className="text-3xl text-orange-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">
              Delivery Soon
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Sit back and relax while we deliver.
            </p>
          </div>
        </div>
        <div className="mt-10 bg-gray-50 rounded-2xl p-5 border">
          <p className="text-gray-600">
            You can track your order status anytime from the
            <span className="font-semibold text-orange-500"> My Orders </span>
            section.
          </p>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/my-orders")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold transition"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold transition"
          >
            Continue Ordering
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderPlaced;