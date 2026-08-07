import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBoxOpen, FaClipboardList } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import UserMyOrderCard from "../components/UserMyOrderCard";
import OwnerMyOrderCard from "../components/OwnerMyOrderCard";
import useGetMyOrders from "../hooks/useGetMyOrders";

function MyOrders() {
  useGetMyOrders();
  const { userData, myOrders } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shadow-md">
              <GiKnifeFork className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-orange-500">AxionGo</h1>
            </div>
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 border border-orange-500 text-orange-500 hover:bg-orange-50 px-4 py-2 rounded-xl transition"
          >
            <FaArrowLeft />
            <span className="hidden sm:block">Back</span>
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
            {userData?.role === "User" ? (
              <FaClipboardList className="text-orange-500 text-2xl" />
            ) : (
              <FaBoxOpen className="text-orange-500 text-2xl" />
            )}
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              {userData?.role === "User" ? "My Orders" : "Pending Orders"}
            </h2>
            <p className="text-gray-500 mt-2 max-w-3xl leading-7">
              {userData?.role === "User"
                ? "View your complete order history, check payment details and track every order placed through AxionGo."
                : "Manage all incoming customer orders for your restaurant. Prepare meals and keep every order moving smoothly."}
            </p>
          </div>
        </div>
        {myOrders?.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border py-20 px-6 flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-orange-100 flex items-center justify-center">
              <FaBoxOpen className="text-5xl text-orange-500" />
            </div>
            <h2 className="mt-8 text-3xl font-bold text-gray-800">
              No Orders Yet
            </h2>
            <p className="mt-4 text-gray-500 max-w-lg leading-7">
              {userData?.role === "User"
                ? "You haven't placed any orders yet. Discover amazing food from nearby restaurants and enjoy your first order with AxionGo."
                : "No pending orders at the moment. New customer orders will automatically appear here."}
            </p>
            {userData?.role === "User" && (
              <button
                onClick={() => navigate("/")}
                className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold transition"
              >
                Explore Food
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {userData?.role === "User" &&
              myOrders.map((order) =>
                order.shopOrders.map((shopOrder) => (
                  <UserMyOrderCard
                    key={shopOrder._id}
                    order={order}
                    shopOrder={shopOrder}
                  />
                )),
              )}
            {userData?.role === "Owner" &&
              myOrders.map((order) => (
                <OwnerMyOrderCard
                  key={order._id}
                  order={order}
                  shopOrder={order.shopOrder}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
