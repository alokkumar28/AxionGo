import React, { useEffect, useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import {
  FaStore,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaCheckCircle,
} from "react-icons/fa";
import DeliveryBoyNav from "./DeliveryBoyNav";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";

function DeliveryBoy() {
  const { userData } = useSelector((state) => state.user);

  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOtpBox , setShowOtpBox] = useState(false)

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });
      setAvailableAssignments(result.data.assignments || []);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        {},
        {
          withCredentials: true,
        },
      );
      setAvailableAssignments((prev) =>
        prev.filter((assignment) => assignment.assignmentId !== assignmentId),
      );
      await getCurrentOrder();
    } catch (error) {
      console.log("ACCEPT ORDER ERROR:", error.response?.data || error.message);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        {
          withCredentials: true,
        },
      );
      setCurrentOrder(result.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("NO CURRENT ORDER");
        setCurrentOrder(null);
        return;
      }
      console.log(
        "GET CURRENT ORDER ERROR:",
        error.response?.data?.message || error.message,
      );
    }
  };

  useEffect(() => {
    if (userData?.role === "Delivery Boy") {
      getAssignments();
      getCurrentOrder();
    }
  }, [userData]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <DeliveryBoyNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                <HiOutlineLocationMarker
                  className="text-orange-500"
                  size={30}
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#172b4d]">
                  Delivery Dashboard
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage your deliveries and keep your location updated.
                </p>
              </div>
            </div>
            <div className="mt-6 bg-orange-50 border border-orange-100 rounded-xl px-4 py-4">
              <p className="text-sm sm:text-base text-[#172b4d]">
                Your current location helps AxionGo find nearby delivery orders
                and assign them to you.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="border border-gray-200 rounded-xl p-5">
                <p className="text-sm text-gray-500">Current Latitude</p>
                <p className="text-xl sm:text-2xl font-bold text-[#172b4d] mt-2">
                  20.294378
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <p className="text-sm text-gray-500">Current Longitude</p>
                <p className="text-xl sm:text-2xl font-bold text-[#172b4d] mt-2">
                  85.744668
                </p>
              </div>
            </div>
            <div className="mt-5 border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <p className="text-[#172b4d] font-medium">
                Your location is being tracked
              </p>
            </div>
          </div>
        </div>
        {currentOrder ? (
          // ACCEPTED ORDER
          <DeliveryBoyTracking currentOrder={currentOrder} />
        ) : (
          // AVAILABLE ORDERS
          <div className="mt-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#172b4d]">
                  Available Delivery Orders
                </h2>
                <p className="text-gray-500 mt-1">
                  Nearby orders waiting for delivery.
                </p>
              </div>
              {availableAssignments.length > 0 && (
                <div className="hidden sm:flex items-center gap-2 bg-orange-50 border border-orange-100 px-4 py-2 rounded-full">
                  <span className="text-orange-500 font-semibold">
                    {availableAssignments.length}
                  </span>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
              )}
            </div>    
            {/* NO AVAILABLE ORDERS */}
            {availableAssignments.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 flex items-center justify-center">
                  <FaBoxOpen className="text-orange-500" size={30} />
                </div>
                <h3 className="text-xl font-semibold text-[#172b4d] mt-5">
                  No available orders
                </h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  There are no nearby delivery orders right now. Stay online and
                  wait for your next delivery.
                </p>
              </div>
            ) : (
              // AVAILABLE ORDERS LIST
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {availableAssignments.map((assignment, index) => (
                  <div key={assignment.assignmentId} className="p-5 sm:p-7">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                          <FaStore className="text-orange-500" size={21} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Delivery from</p>
                          <h3 className="text-xl font-bold text-[#172b4d]">
                            {assignment.shopName}
                          </h3>
                        </div>
                      </div>
                      <div className="self-start sm:self-auto bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                        New Delivery
                      </div>
                    </div>
                    {/*DELIVERY ADDRESS*/}
                    <div className="mt-6 bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt
                          className="text-orange-500 mt-1 shrink-0"
                          size={18}
                        />
                        <div>
                          <p className="text-sm text-gray-500">
                            Delivery Address
                          </p>
                          <p className="text-[#172b4d] font-medium mt-1 leading-relaxed">
                            {assignment.deliveryAddress?.text ||
                              "Address not available"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/*  ORDER ITEMS */}
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FaBoxOpen className="text-orange-500" size={17} />
                        <h4 className="font-semibold text-[#172b4d]">
                          Order Items
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {assignment.items?.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="min-w-0">
                              <p className="font-medium text-[#172b4d] truncate">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                ₹{item.price} × {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-[#172b4d] shrink-0">
                              ₹{item.price * item.quantity}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* SUBTOTAL  */}
                    <div className="mt-5 pt-5 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-gray-600 font-medium">
                        Subtotal
                      </span>
                      <span className="text-xl font-bold text-[#172b4d]">
                        ₹{assignment.subTotal}
                      </span>
                    </div>
                    {/*ACCEPT BUTTON*/}
                    <button
                      onClick={() => acceptOrder(assignment.assignmentId)}
                      className="mt-6 w-full bg-[#ff6b00] hover:bg-[#e85f00] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
                    >
                      <FaCheckCircle size={18} />
                      Accept Order for Delivery
                    </button>
                    {index !== availableAssignments.length - 1 && (
                      <div className="mt-7 border-b border-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryBoy;
