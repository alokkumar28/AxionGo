import axios from "axios";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaMotorcycle } from "react-icons/fa";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";

function OwnerMyOrderCard({ order, shopOrder }) {
  const [status, setStatus] = useState(shopOrder?.status || "Pending");
  const [availableBoys, setAvailableBoys] = useState([]);
  const dispatch = useDispatch();

  const statusColor = status === "Pending" ? "border-yellow-200 bg-yellow-50 text-yellow-700" : status === "Preparing" ? "border-orange-200 bg-orange-50 text-orange-700" : status === "Out for Delivery" ? "border-purple-200 bg-purple-50 text-purple-700" : status === "Delivered" ? "border-green-200 bg-green-50 text-green-700" : "border-gray-200 bg-gray-50 text-gray-700";

  const orderDate = new Date(order.createdAt);

  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, { status }, { withCredentials: true });
      dispatch(updateOrderStatus({ orderId, shopId, status }));
      setAvailableBoys(result.data.availableBoys || []);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    setStatus(shopOrder.status);
  }, [shopOrder.status]);

  const totalItems = shopOrder.shopOrderItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-3 sm:px-4 lg:px-5 py-3 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-[#172b4d]">Order #<span className="text-orange-500">{order._id.slice(-8).toUpperCase()}</span></h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] sm:text-xs text-gray-500">
              <div className="flex items-center gap-1.5"><FaCalendarAlt className="text-orange-400" />{orderDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
              <div className="flex items-center gap-1.5"><FaClock className="text-orange-400" />{orderDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          </div>
          <select value={status} disabled={status === "Delivered"} onChange={(e) => { setStatus(e.target.value); handleUpdateStatus(order._id, shopOrder.shop._id, e.target.value); }} className={`${statusColor} w-full sm:w-auto min-w-[145px] px-3 py-2 rounded-lg border text-xs sm:text-sm font-semibold outline-none cursor-pointer transition`}>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered" disabled>Delivered</option>
          </select>
        </div>
      </div>

      <div className="px-3 sm:px-4 lg:px-5 py-3 sm:py-4 border-b border-gray-100">
        <h3 className="text-sm sm:text-base font-bold text-[#172b4d] mb-3">Customer Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0"><FaUser className="text-orange-500 text-xs" /></div>
            <div className="min-w-0"><p className="text-[9px] sm:text-[10px] text-gray-400">Customer Name</p><h4 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{order.user?.fullName}</h4></div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0"><FaEnvelope className="text-orange-500 text-xs" /></div>
            <div className="min-w-0"><p className="text-[9px] sm:text-[10px] text-gray-400">Email</p><h4 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{order.user?.email}</h4></div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0"><FaPhoneAlt className="text-orange-500 text-xs" /></div>
            <div className="min-w-0 flex-1"><p className="text-[9px] sm:text-[10px] text-gray-400">Mobile</p><div className="flex items-center justify-between gap-2"><h4 className="text-xs sm:text-sm font-semibold text-gray-800">{order.user?.mobile}</h4><a href={`tel:${order.user?.mobile}`} className="text-[10px] sm:text-xs font-semibold text-orange-500 hover:text-orange-600">Call</a></div></div>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 lg:px-5 py-3 sm:py-4">
        <h3 className="text-sm sm:text-base font-bold text-[#172b4d] mb-3">Ordered Items</h3>

        <div className="space-y-2.5">
          {shopOrder.shopOrderItems.map((food) => (
            <div key={food._id} className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <img src={food.item.image} alt={food.item.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{food.item.name}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">₹{food.price} × {food.quantity}</p>
              </div>
              <p className="text-xs sm:text-sm font-bold text-orange-500 whitespace-nowrap">₹{food.price * food.quantity}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
          <div className="flex justify-between items-center"><span className="text-xs sm:text-sm text-gray-500">Total Items</span><span className="text-xs sm:text-sm font-semibold text-gray-800">{totalItems}</span></div>
          <div className="flex justify-between items-center"><span className="text-xs sm:text-sm text-gray-500">Restaurant Total</span><span className="text-base sm:text-lg font-bold text-orange-500">₹{shopOrder.subTotalAmount}</span></div>
          <div className="flex justify-between items-center"><span className="text-xs sm:text-sm text-gray-500">Payment Method</span><span className="text-xs sm:text-sm font-semibold text-gray-800 text-right">{order.paymentMethod}</span></div>
        </div>

        <div className="mt-4 p-3 sm:p-3.5 rounded-xl bg-orange-50 border border-orange-100">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0"><FaMapMarkerAlt className="text-orange-500 text-sm" /></div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-800">Delivery Address</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 leading-5">{order.deliveryAddress.text}</p>
            </div>
          </div>
        </div>

        {shopOrder.status === "Out for Delivery" && (
          <div className="mt-4 p-3 sm:p-4 rounded-xl bg-purple-50 border border-purple-100">
            {shopOrder.assignedDeliveryBoy ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center"><FaMotorcycle className="text-purple-500 text-sm" /></div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-800">Delivery Boy</h3>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{shopOrder.assignedDeliveryBoy.fullName}</h4>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{shopOrder.assignedDeliveryBoy.mobile}</p>
                  </div>
                  <span className="shrink-0 px-2 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-[9px] sm:text-[10px] font-semibold">Accepted</span>
                </div>
              </div>
            ) : availableBoys.length === 0 ? (
              <div className="flex items-center gap-2"><FaMotorcycle className="text-purple-500 shrink-0" /><p className="text-xs sm:text-sm text-purple-700 font-medium">No delivery boy is available nearby.</p></div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center"><FaMotorcycle className="text-purple-500 text-sm" /></div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-800">Available Delivery Boys</h3>
                </div>

                <div className="space-y-2">
                  {availableBoys.map((boy) => (
                    <div key={boy.id} className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{boy.fullName}</h4>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{boy.mobile}</p>
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