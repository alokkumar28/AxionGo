import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaStore,
  FaUser,
  FaPhone,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaMotorcycle,
} from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { serverUrl } from "../App";
import LiveTrackingMap from "./LiveTrackingMap";
function TrackOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleGetOrder = async () => {
    try {
      setLoading(true);
      console.log("ORDER ID:", orderId);
      const result = await axios.get(
        `${serverUrl}/api/order/get-order-by-id/${orderId}`,
        {
          withCredentials: true,
        },
      );
      console.log("TRACK ORDER:", result.data);
      const orderData = result.data?.order || result.data;
      setCurrentOrder(orderData);
    } catch (error) {
      console.log(
        "GET ORDER ERROR:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (orderId) {
      handleGetOrder();
    }
  }, [orderId]);
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <h1 className="text-xl font-bold text-[#172b4d]">Track Order</h1>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }
  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <button
              onClick={() => navigate("/my-orders")}
              className="flex items-center gap-2 text-orange-500 font-semibold"
            >
              <FaArrowLeft />
              Back
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <FaBoxOpen className="text-gray-300 mx-auto" size={55} />
          <h2 className="text-xl font-bold text-[#172b4d] mt-4">
            Order not found
          </h2>
          <p className="text-gray-500 mt-2">We couldn't find this order.</p>
        </div>
      </div>
    );
  }

  const {
    _id,
    paymentMethod,
    totalAmount,
    user,
    deliveryAddress,
    shopOrders = [],
  } = currentOrder;

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
            <h1 className="text-2xl font-bold text-orange-500">AxionGo</h1>
          </button>
          <button
            onClick={() => navigate("/my-orders")}
            className="flex items-center gap-2 border border-orange-500 text-orange-500 hover:bg-orange-50 px-4 py-2 rounded-xl transition"
          >
            <FaArrowLeft />
            <span className="hidden sm:block">Back</span>
          </button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-7">
          <p className="text-sm text-gray-500">Track your order</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#172b4d] mt-1">
            Order #{_id?.slice(-8).toUpperCase()}
          </h1>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              <FaUser className="text-orange-500" size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <h3 className="font-bold text-lg text-[#172b4d]">
                {user?.fullName || "Customer"}
              </h3>
              {user?.mobile && (
                <div className="flex items-center gap-2 mt-1">
                  <FaPhone className="text-orange-500" size={13} />
                  <span className="text-sm text-gray-500">{user.mobile}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-7">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              <FaMapMarkerAlt className="text-orange-500" size={19} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="font-semibold text-[#172b4d] mt-1">
                {deliveryAddress?.text || "Delivery address unavailable"}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          {shopOrders.map((shopOrder) => {
            const shop = shopOrder?.shop;
            const deliveryBoy = shopOrder?.assignedDeliveryBoy;
            const customerLocation = {
              latitude: deliveryAddress?.latitude,
              longitude: deliveryAddress?.longitude,
            };
            const deliveryBoyLocation =
              deliveryBoy?.location?.coordinates?.length === 2
                ? {
                    latitude: deliveryBoy.location.coordinates[1],
                    longitude: deliveryBoy.location.coordinates[0],
                  }
                : null;
            return (
              <div
                key={shopOrder._id}
                className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden"
              >
                <div className="p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                        <FaStore className="text-orange-500" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order from</p>
                        <h2 className="text-xl font-bold text-[#172b4d]">
                          {shop?.name}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          {shop?.address}
                        </p>
                        <p className="text-sm text-gray-500">
                          {shop?.city}, {shop?.state}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap
                        ${
                          shopOrder.status === "Out for Delivery"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : shopOrder.status === "Delivered"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-orange-50 text-orange-600 border border-orange-200"
                        }`}
                    >
                      {shopOrder.status}
                    </span>
                  </div>
                  <div className="mt-5 border border-gray-200 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                        <FaMotorcycle className="text-orange-500" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Delivery Partner
                        </p>
                        {deliveryBoy ? (
                          <>
                            <h3 className="font-bold text-[#172b4d] mt-1">
                              {deliveryBoy.fullName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <FaPhone className="text-orange-500" size={13} />
                              <span className="text-sm text-gray-500">
                                {deliveryBoy.mobile}
                              </span>
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-500 mt-1">
                            Delivery partner has not been assigned yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <FaBoxOpen className="text-orange-500" size={17} />
                      <h3 className="font-semibold text-[#172b4d]">
                        Order Items
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {shopOrder?.shopOrderItems?.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                          <div>
                            <p className="font-medium text-[#172b4d]">
                              {item?.item?.name || item?.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              ₹{item.price} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-[#172b4d]">
                            ₹{Number(item.price) * Number(item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                      <span className="font-medium text-gray-600">
                        Subtotal
                      </span>
                      <span className="text-xl font-bold text-[#172b4d]">
                        ₹{shopOrder.subTotalAmount}
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                        <FaMoneyBillWave className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-semibold text-[#172b4d]">
                          {paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-orange-500" size={18} />
                        <h3 className="font-semibold text-[#172b4d]">
                          Live Delivery Tracking
                        </h3>
                      </div>
                      {deliveryBoyLocation ? (
                        <span className="flex items-center gap-2 text-sm text-green-600 font-medium">
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                          Live
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Waiting</span>
                      )}
                    </div>
                    <LiveTrackingMap
                      deliveryBoyLocation={deliveryBoyLocation}
                      customerLocation={customerLocation}
                      deliveryBoy={deliveryBoy}
                      customer={user}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-7 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-600">
              Total Order Amount
            </span>
            <span className="text-2xl font-bold text-orange-500">
              ₹{totalAmount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrderPage;
