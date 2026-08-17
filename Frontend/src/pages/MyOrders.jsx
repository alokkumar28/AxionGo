import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBoxOpen, FaClipboardList } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import UserMyOrderCard from "../components/UserMyOrderCard";
import OwnerMyOrderCard from "../components/OwnerMyOrderCard";
import useGetMyOrders from "../hooks/useGetMyOrders";
import { useSocket } from "../context/SocketContext";
import { addMyOrder, updateRealTimeOrderStatus } from "../redux/userSlice";
import { useEffect } from "react";

function MyOrders() {
  useGetMyOrders();
  const { userData, myOrders } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !userData?._id) return;
    if (userData.role !== "Owner") return;
    const handleNewOrder = (data) => {
      console.log("NEW ORDER RECEIVED:", data);
      const ownerId = data.shopOrder?.owner?._id?.toString();
      const currentUserId = userData._id?.toString();
      if (ownerId !== currentUserId) {
        return;
      }
      dispatch(addMyOrder(data));
    };
    socket.on("newOrder", handleNewOrder);
    return () => {
      socket.off("newOrder", handleNewOrder);
    };
  }, [socket, userData?._id, userData?.role, dispatch]);
  
  useEffect(() => {
    if (!socket) return;
    const handleOrderStatusUpdated = (data) => {
      console.log("ORDER STATUS UPDATED:", data);
      if (data.userId?.toString() === userData?._id?.toString()) {
        dispatch(
          updateRealTimeOrderStatus({
            orderId: data.orderId,
            shopId: data.shopId,
            status: data.status,
          })
        );
      }
    };
    socket.on("orderStatusUpdated", handleOrderStatusUpdated);
    return () => {
      socket.off("orderStatusUpdated", handleOrderStatusUpdated);
    };
  }, [socket, userData?._id, dispatch]);
 
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
              <GiKnifeFork className="text-lg sm:text-xl text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-orange-500">AxionGo</h1>
          </button>
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 border border-orange-200 text-orange-500 hover:bg-orange-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition shrink-0">
            <FaArrowLeft className="text-xs" />
            <span className="hidden sm:block">Back</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-5 sm:py-6">
        <section className="mb-6 sm:mb-7">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              {userData?.role === "User" ? <FaClipboardList className="text-orange-500 text-lg sm:text-xl" /> : <FaBoxOpen className="text-orange-500 text-lg sm:text-xl" />}
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172b4d] leading-tight">{userData?.role === "User" ? "My Orders" : "Pending Orders"}</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-5 max-w-3xl">{userData?.role === "User" ? "View your order history, payment details and track every order placed through AxionGo." : "Manage incoming customer orders and keep every order moving smoothly."}</p>
            </div>
          </div>
        </section>

        {myOrders?.length === 0 ? (
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-10 sm:py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-100 flex items-center justify-center">
              <FaBoxOpen className="text-2xl sm:text-3xl text-orange-500" />
            </div>

            <h2 className="mt-5 text-xl sm:text-2xl font-bold text-gray-800">No Orders Yet</h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-md leading-5">{userData?.role === "User" ? "You haven't placed any orders yet. Discover amazing food from nearby restaurants and enjoy your first order with AxionGo." : "No pending orders at the moment. New customer orders will automatically appear here."}</p>

            {userData?.role === "User" && (
              <button onClick={() => navigate("/")} className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">
                Explore Food
              </button>
            )}
          </section>
        ) : (
          <section className="space-y-4 sm:space-y-5">
            {userData?.role === "User" && myOrders.map((order) => order.shopOrders.map((shopOrder) => <UserMyOrderCard key={shopOrder._id} order={order} shopOrder={shopOrder} />))}
            {userData?.role === "Owner" && myOrders.map((order) => <OwnerMyOrderCard key={order._id} order={order} shopOrder={order.shopOrder} />)}
          </section>
        )}
      </main>
    </div>
  );
}

export default MyOrders;