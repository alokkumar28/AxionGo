import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";
function OwnerMyOrderCard({ order, shopOrder }) {
  const [status, setStatus] = useState(shopOrder.status);
  const [availableBoys, setAvailableBoys] = useState([]);
  const dispatch = useDispatch();
  const statusColor =
    status === "Pending"
      ? "border-yellow-300 bg-yellow-50 text-yellow-700"
      : status === "Accepted"
        ? "border-blue-300 bg-blue-50 text-blue-700"
        : status === "Preparing"
          ? "border-orange-300 bg-orange-50 text-orange-700"
          : status === "Out for Delivery"
            ? "border-purple-300 bg-purple-50 text-purple-700"
            : status === "Delivered"
              ? "border-green-300 bg-green-50 text-green-700"
              : status === "Cancelled"
                ? "border-red-300 bg-red-50 text-red-700"
                : "border-gray-300 bg-gray-50 text-gray-700";
  const orderDate = new Date(order.createdAt);
  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        {
          withCredentials: true,
        },
      );
      dispatch(
        updateOrderStatus({
          orderId,
          shopId,
          status,
        }),
      );
      setAvailableBoys(result.data.availableBoys || []);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };
  useEffect(() => {
    setStatus(shopOrder.status);
  }, [shopOrder.status]);

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
              onChange={(e) => {
                setStatus(e.target.value);
                handleUpdateStatus(
                  order._id,
                  shopOrder.shop._id,
                  e.target.value,
                );
              }}
              className={`px-4 py-3 rounded-xl font-semibold outline-none border transition ${statusColor}`}
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Preparing">Preparing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
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
                {order.user?.fullName}
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
                {order.user?.email}
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
                  {order.user?.mobile}
                </h4>
                <a
                  href={`tel:${order.user?.mobile}`}
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
        {shopOrder.status === "Out for Delivery" && (
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-2xl p-5">
            {shopOrder.assignedDeliveryBoy ? (
              //ACCEPTED DELIVERY BOY
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">
                  Delivery Boy
                </h3>
                <div className="bg-white border rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {shopOrder.assignedDeliveryBoy.fullName}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {shopOrder.assignedDeliveryBoy.mobile}
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold">
                    Accepted
                  </div>
                </div>
              </div>
            ) : availableBoys.length === 0 ? (
              <p className="text-purple-700 font-medium">
                No delivery boy is available nearby.
              </p>
            ) : (
              // AVAILABLE DELIVERY BOYS 
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">
                  Available Delivery Boys
                </h3>
                <div className="space-y-3">
                  {availableBoys.map((boy) => (
                    <div
                      key={boy.id}
                      className="bg-white border rounded-xl p-4 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {boy.fullName}
                        </h4>
                        <p className="text-sm text-gray-500">{boy.mobile}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerMyOrderCard;
