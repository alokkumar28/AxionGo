import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaReceipt, FaHome, FaArrowRight } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";

function OrderPlaced() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-3 sm:px-5 py-6 sm:py-10">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-orange-50 px-5 sm:px-8 py-8 sm:py-10 text-center border-b border-orange-100">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center">
              <FaCheckCircle className="text-4xl sm:text-5xl text-green-500" />
            </div>

            <h1 className="mt-5 text-2xl sm:text-3xl font-bold text-[#172b4d]">
              Order Placed Successfully!
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-5 max-w-xl mx-auto">
              Thank you for choosing <span className="font-semibold text-orange-500">AxionGo</span>. Your order has been received and the restaurant is preparing your delicious meal.
            </p>
          </div>

          <div className="p-4 sm:p-6 lg:p-7">
          
            <div className="mt-4 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3.5">
              <div className="flex items-start gap-3">
                <MdDeliveryDining className="text-orange-500 text-xl mt-0.5 shrink-0" />
                <p className="text-xs sm:text-sm text-gray-600 leading-5">
                  You can check your order status and track your delivery anytime from <span className="font-semibold text-orange-500">My Orders</span>.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={() => navigate("/my-orders")} className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
                View My Orders
                <FaArrowRight className="text-xs" />
              </button>

              <button onClick={() => navigate("/")} className="flex items-center justify-center gap-2 border border-orange-300 text-orange-500 hover:bg-orange-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition">
                Continue Ordering
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] sm:text-xs text-gray-400 mt-4">
          Thank you for ordering with AxionGo.
        </p>
      </div>
    </div>
  );
}

export default OrderPlaced;