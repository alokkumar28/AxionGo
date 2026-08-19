import React,{useEffect,useState} from "react";
import {HiOutlineLocationMarker} from "react-icons/hi";
import {FaStore,FaMapMarkerAlt,FaBoxOpen,FaCheckCircle} from "react-icons/fa";
import DeliveryBoyNav from "./DeliveryBoyNav";
import {useDispatch,useSelector} from "react-redux";
import axios from "axios";
import {serverUrl} from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import {useSocket} from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

function DeliveryBoy(){
  const {userData}=useSelector((state)=>state.user);
  const [availableAssignments,setAvailableAssignments]=useState([]);
  const [currentOrder,setCurrentOrder]=useState(null);
  const [currentLocation,setCurrentLocation]=useState({latitude:null,longitude:null});
  const navigate = useNavigate();
  const socket=useSocket();
  const dispatch=useDispatch();

  const getAssignments=async()=>{
    try{
      const result=await axios.get(`${serverUrl}/api/order/get-assignments`,{withCredentials:true});
      setAvailableAssignments(result.data.assignments||[]);
    }catch(error){
      console.log(error.response?.data?.message||error.message);
    }
  };

  const acceptOrder=async(assignmentId)=>{
    try{
      await axios.post(`${serverUrl}/api/order/accept-order/${assignmentId}`,{},{withCredentials:true});
      setAvailableAssignments((prev)=>prev.filter((assignment)=>assignment.assignmentId!==assignmentId));
      await getCurrentOrder();
    }catch(error){
      console.log("ACCEPT ORDER ERROR:",error.response?.data||error.message);
    }
  };

  const getCurrentOrder=async()=>{
    try{
      const result=await axios.get(`${serverUrl}/api/order/get-current-order`,{withCredentials:true});
      setCurrentOrder(result.data);
    }catch(error){
      if(error.response?.status===404){
        setCurrentOrder(null);
        return;
      }
      console.log("GET CURRENT ORDER ERROR:",error.response?.data?.message||error.message);
    }
  };

  const handleDeliveryComplete = async () => {
    setCurrentOrder(null);

    setCurrentLocation({
      latitude: null,
      longitude: null,
    });

    await getAssignments();
  };


  useEffect(()=>{
    if(!socket||!userData?._id||userData.role!=="Delivery Boy"){
      return;
    }

    if(!currentOrder?.shopOrder?._id){
      return;
    }

    let watchId;

    if(navigator.geolocation){
      watchId=navigator.geolocation.watchPosition(
        (position)=>{
          const latitude=position.coords.latitude;
          const longitude=position.coords.longitude;

          setCurrentLocation({
            latitude,
            longitude
          });

          socket.emit("updateLocation",{
            latitude,
            longitude,
            userId:userData._id,
            shopOrderId:currentOrder.shopOrder._id
          });

          console.log("Location sent:",{
            latitude,
            longitude,
            shopOrderId:currentOrder.shopOrder._id
          });
        },
        (error)=>{
          console.log("Location error:",error);
        },
        {
          enableHighAccuracy:true,
          maximumAge:5000,
          timeout:10000
        }
      );
    }

    return()=>{
      if(watchId!==undefined){
        navigator.geolocation.clearWatch(watchId);
      }
    };
  },[socket,userData?._id,userData?.role,currentOrder?.shopOrder?._id]);

  useEffect(()=>{
    if(!socket||userData?.role!=="Delivery Boy")return;

    const handleNewDeliveryRequest=(data)=>{
      console.log("NEW DELIVERY REQUEST:",data);

      setAvailableAssignments((prev)=>{
        const exists=prev.some(
          (assignment)=>
            assignment.assignmentId?.toString()===data.assignmentId?.toString()
        );

        if(exists)return prev;
        return[data,...prev];
      });
    };

    socket.on("newDeliveryRequest",handleNewDeliveryRequest);

    return()=>{
      socket.off("newDeliveryRequest",handleNewDeliveryRequest);
    };
  },[socket,userData?.role]);

  useEffect(()=>{
    if(userData?.role==="Delivery Boy"){
      getAssignments();
      getCurrentOrder();
    }
  },[userData]);

  return(
    <div className="min-h-screen bg-gray-50">
      <DeliveryBoyNav/>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <HiOutlineLocationMarker className="text-orange-500" size={22}/>
              </div>

              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#172b4d]">Delivery Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Manage your deliveries and location.</p>
              </div>
            </div>

            <div className="mt-4 sm:mt-5 bg-orange-50 border border-orange-100 rounded-xl px-3 py-3 sm:px-4 sm:py-3.5">
              <p className="text-xs sm:text-sm text-[#172b4d] leading-5">Your current location helps AxionGo find nearby delivery orders and assign them to you.</p>
            </div>
            <button
              onClick={() => navigate("/today-deliveries")}
              className="mt-3 w-full bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 font-semibold text-xs sm:text-sm py-2.5 sm:py-3 rounded-xl transition"
            >
              View Today's Deliveries
            </button>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3">
              <div className="border border-gray-200 rounded-xl px-3 py-3 sm:px-4 sm:py-3.5">
                <p className="text-[10px] sm:text-xs text-gray-500">Latitude</p>
                <p className="text-sm sm:text-base lg:text-lg font-bold text-[#172b4d] mt-1">
                  {currentLocation.latitude!==null?currentLocation.latitude.toFixed(6):"--"}
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl px-3 py-3 sm:px-4 sm:py-3.5">
                <p className="text-[10px] sm:text-xs text-gray-500">Longitude</p>
                <p className="text-sm sm:text-base lg:text-lg font-bold text-[#172b4d] mt-1">
                  {currentLocation.longitude!==null?currentLocation.longitude.toFixed(6):"--"}
                </p>
              </div>
            </div>

            <div className="mt-3 border border-green-100 bg-green-50 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-2.5">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 shrink-0"/>
              <p className="text-xs sm:text-sm text-green-700 font-medium">Your location is being tracked</p>
            </div>
          </div>
        </section>

        {currentOrder?(
          <div className="mt-5 sm:mt-6 lg:mt-7">
            <DeliveryBoyTracking currentOrder={currentOrder} currentLocation={currentLocation}  onDeliveryComplete={handleDeliveryComplete}/>
          </div>
        ):(
          <section className="mt-6 sm:mt-7 lg:mt-8">
            <div className="flex items-end justify-between gap-3 mb-4 sm:mb-5">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#172b4d]">Available Delivery Orders</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Nearby orders waiting for delivery.</p>
              </div>

              {availableAssignments.length>0&&(
                <div className="shrink-0 flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full">
                  <span className="text-orange-500 text-xs sm:text-sm font-bold">{availableAssignments.length}</span>
                  <span className="text-[10px] sm:text-xs text-gray-600">Available</span>
                </div>
              )}
            </div>

            {availableAssignments.length===0?(
              <div className="bg-white border border-gray-200 rounded-2xl px-5 py-10 sm:py-12 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-xl bg-orange-50 flex items-center justify-center">
                  <FaBoxOpen className="text-orange-500" size={26}/>
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-[#172b4d] mt-4">No available orders</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-sm mx-auto leading-5">There are no nearby delivery orders right now. Stay online and wait for your next delivery.</p>
              </div>
            ):(
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {availableAssignments.map((assignment)=>(
                  <div key={assignment.assignmentId} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                            <FaStore className="text-orange-500" size={18}/>
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] sm:text-xs text-gray-500">Delivery from</p>
                            <h3 className="text-base sm:text-lg font-bold text-[#172b4d] truncate">{assignment.shopName}</h3>
                          </div>
                        </div>

                        <span className="shrink-0 bg-purple-50 border border-purple-100 text-purple-700 px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-semibold">New</span>
                      </div>

                      <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl p-3">
                        <div className="flex items-start gap-2.5">
                          <FaMapMarkerAlt className="text-orange-500 mt-0.5 shrink-0" size={15}/>

                          <div className="min-w-0">
                            <p className="text-[10px] sm:text-xs text-gray-500">Delivery Address</p>
                            <p className="text-xs sm:text-sm text-[#172b4d] font-medium mt-0.5 leading-5">{assignment.deliveryAddress?.text||"Address not available"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaBoxOpen className="text-orange-500" size={14}/>
                          <h4 className="text-xs sm:text-sm font-semibold text-[#172b4d]">Order Items</h4>
                        </div>

                        <div className="border border-gray-100 rounded-xl overflow-hidden">
                          {assignment.items?.map((item,index)=>(
                            <div key={item._id} className={`flex items-center justify-between gap-3 px-3 py-2.5 ${index!==assignment.items.length-1?"border-b border-gray-100":""}`}>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-[#172b4d] truncate">{item.name}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">₹{item.price} × {item.quantity}</p>
                              </div>

                              <p className="text-xs sm:text-sm font-semibold text-[#172b4d] shrink-0">₹{item.price*item.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">Subtotal</span>
                        <span className="text-base sm:text-lg font-bold text-[#172b4d]">₹{assignment.subTotal}</span>
                      </div>

                      <button onClick={()=>acceptOrder(assignment.assignmentId)} className="mt-4 w-full bg-[#ff6b00] hover:bg-[#e85f00] text-white font-semibold text-xs sm:text-sm py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 transition">
                        <FaCheckCircle size={15}/>
                        Accept Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default DeliveryBoy;