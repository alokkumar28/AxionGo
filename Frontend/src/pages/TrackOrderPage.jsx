import axios from "axios";
import React,{useEffect,useState} from "react";
import {useNavigate,useParams} from "react-router-dom";
import {FaArrowLeft,FaBoxOpen,FaStore,FaUser,FaPhone,FaMoneyBillWave,FaMapMarkerAlt,FaMotorcycle} from "react-icons/fa";
import {GiKnifeFork} from "react-icons/gi";
import {serverUrl} from "../App";
import LiveTrackingMap from "./LiveTrackingMap";
import {useSocket} from "../context/SocketContext";

function TrackOrderPage(){
  const {orderId}=useParams();
  const socket=useSocket();
  const navigate=useNavigate();
  const [currentOrder,setCurrentOrder]=useState(null);
  const [loading,setLoading]=useState(true);
  const [liveLocation,setLiveLocation]=useState({});

  const handleGetOrder=async()=>{
    try{
      setLoading(true);
      const result=await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`,{withCredentials:true});
      const orderData=result.data?.order||result.data;
      setCurrentOrder(orderData);
    }catch(error){
      console.log("GET ORDER ERROR:",error.response?.data?.message||error.message);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(!socket)return;

    const handleDeliveryLocation=({orderId:incomingOrderId,shopOrderId,deliveryBoyId,latitude,longitude})=>{
      if(incomingOrderId?.toString()!==orderId?.toString())return;

      console.log("Live delivery location received:",{deliveryBoyId,latitude,longitude});

      setLiveLocation((prev)=>({
        ...prev,
        [deliveryBoyId]:{latitude,longitude}
      }));
    };

    socket.on("updateDeliveryLocation",handleDeliveryLocation);

    return()=>{
      socket.off("updateDeliveryLocation",handleDeliveryLocation);
    };
  },[socket,orderId]);

  useEffect(()=>{
    if(orderId)handleGetOrder();
  },[orderId]);

  if(loading){
    return(
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5">
            <h1 className="text-lg sm:text-xl font-bold text-[#172b4d]">Track Order</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-3 sm:px-5 py-12 sm:py-16 text-center">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"/>
          <p className="mt-3 text-xs sm:text-sm text-gray-500">Loading order details...</p>
        </main>
      </div>
    );
  }

  if(!currentOrder){
    return(
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5">
            <button onClick={()=>navigate("/my-orders")} className="flex items-center gap-1.5 text-orange-500 text-xs sm:text-sm font-semibold">
              <FaArrowLeft/> Back
            </button>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-3 sm:px-5 py-12 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
            <FaBoxOpen className="text-2xl text-orange-500"/>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#172b4d] mt-4">Order not found</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">We couldn't find this order.</p>
        </main>
      </div>
    );
  }

  const {_id,paymentMethod,totalAmount,user,deliveryAddress,shopOrders=[]}=currentOrder;

  return(
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3">
          <button onClick={()=>navigate("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-orange-500 flex items-center justify-center">
              <GiKnifeFork className="text-base sm:text-lg text-white"/>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-orange-500">AxionGo</h1>
          </button>
          <button onClick={()=>navigate("/my-orders")} className="flex items-center gap-1.5 border border-orange-200 text-orange-500 hover:bg-orange-50 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition">
            <FaArrowLeft/>
            <span>Back</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-5">
        <section className="mb-4 sm:mb-5">
          <p className="text-[10px] sm:text-xs text-gray-500">Track your order</p>
          <div className="flex items-center justify-between gap-3 mt-0.5">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#172b4d]">Order #{_id?.slice(-8).toUpperCase()}</h1>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                <FaUser className="text-orange-500 text-sm"/>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-gray-500">Customer</p>
                <h3 className="text-sm sm:text-base font-bold text-[#172b4d] truncate">{user?.fullName||"Customer"}</h3>
                {user?.mobile&&(
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <FaPhone className="text-orange-500 text-[10px]"/>
                    <span className="text-[10px] sm:text-xs text-gray-500">{user.mobile}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                <FaMapMarkerAlt className="text-orange-500 text-sm"/>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-gray-500">Delivery Address</p>
                <p className="text-xs sm:text-sm font-semibold text-[#172b4d] mt-0.5 leading-5">{deliveryAddress?.text||"Delivery address unavailable"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {shopOrders.map((shopOrder)=>{
            const shop=shopOrder?.shop;
            const deliveryBoy=shopOrder?.assignedDeliveryBoy;
            const customerLocation={latitude:deliveryAddress?.latitude,longitude:deliveryAddress?.longitude};
            const liveDeliveryBoyLocation=deliveryBoy?._id?liveLocation[deliveryBoy._id]:null;

            const databaseDeliveryBoyLocation=deliveryBoy?.location?.coordinates?.length===2?{
              latitude:deliveryBoy.location.coordinates[1],
              longitude:deliveryBoy.location.coordinates[0]
            }:null;

            const deliveryBoyLocation=liveDeliveryBoyLocation||databaseDeliveryBoyLocation;

            return(
              <section key={shopOrder._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-3 sm:p-4 lg:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                        <FaStore className="text-orange-500 text-sm"/>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-gray-500">Order from</p>
                        <h2 className="text-sm sm:text-base font-bold text-[#172b4d] truncate">{shop?.name}</h2>
                        <p className="text-[10px] sm:text-xs text-gray-500 truncate">{shop?.city}, {shop?.state}</p>
                      </div>
                    </div>

                    <span className={`shrink-0 px-2 sm:px-2.5 py-1 rounded-full text-[9px] sm:text-[11px] font-semibold whitespace-nowrap ${shopOrder.status==="Out for Delivery"?"bg-purple-50 text-purple-700 border border-purple-200":shopOrder.status==="Delivered"?"bg-green-50 text-green-700 border border-green-200":"bg-orange-50 text-orange-600 border border-orange-200"}`}>
                      {shopOrder.status}
                    </span>
                  </div>

                  <div className="mt-3 bg-gray-50 rounded-lg border border-gray-100 p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                        <FaMotorcycle className="text-orange-500 text-sm"/>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-gray-500">Delivery Partner</p>
                        {deliveryBoy?(
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs sm:text-sm font-bold text-[#172b4d]">{deliveryBoy.fullName}</h3>
                            {deliveryBoy.mobile&&<span className="text-[10px] sm:text-xs text-gray-500">{deliveryBoy.mobile}</span>}
                          </div>
                        ):(
                          <p className="text-[10px] sm:text-xs text-gray-500">Delivery partner has not been assigned yet.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaBoxOpen className="text-orange-500 text-sm"/>
                      <h3 className="text-xs sm:text-sm font-semibold text-[#172b4d]">Order Items</h3>
                    </div>

                    <div className="space-y-0">
                      {shopOrder?.shopOrderItems?.map((item)=>(
                        <div key={item._id} className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-[#172b4d] truncate">{item?.item?.name||item?.name}</p>
                            <p className="text-[10px] sm:text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-[#172b4d] shrink-0">₹{Number(item.price)*Number(item.quantity)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-500">Subtotal</span>
                      <span className="text-base sm:text-lg font-bold text-orange-500">₹{shopOrder.subTotalAmount}</span>
                    </div>
                  </div>

                  <div className="mt-3 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                        <FaMoneyBillWave className="text-green-600 text-sm"/>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500">Payment Method</p>
                        <p className="text-xs sm:text-sm font-semibold text-[#172b4d]">{paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-orange-500 text-sm"/>
                        <h3 className="text-xs sm:text-sm font-semibold text-[#172b4d]">Live Delivery Tracking</h3>
                      </div>

                      {deliveryBoyLocation?(
                        <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-green-600 font-medium">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                          Live
                        </span>
                      ):(
                        <span className="text-[10px] sm:text-xs text-gray-400">Waiting</span>
                      )}
                    </div>

                    {shopOrder?.status!=="Delivered"&&(
                      <div className="rounded-xl overflow-hidden border border-gray-200">
                        <LiveTrackingMap deliveryBoyLocation={deliveryBoyLocation} customerLocation={customerLocation} deliveryBoy={deliveryBoy} customer={user}/>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-4 bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-gray-500">Total Order Amount</span>
            <span className="text-lg sm:text-xl font-bold text-orange-500">₹{totalAmount}</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TrackOrderPage;