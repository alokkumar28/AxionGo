import React,{useEffect,useMemo,useState} from "react";
import {FaStore,FaMapMarkerAlt,FaUser,FaPhone,FaMoneyBillWave,FaBoxOpen,FaMotorcycle,FaHome,FaCheckCircle,FaKey} from "react-icons/fa";
import {MapContainer,TileLayer,Marker,Popup,Polyline,useMap} from "react-leaflet";
import L from "leaflet";
import {renderToStaticMarkup} from "react-dom/server";
import "leaflet/dist/leaflet.css";
import {serverUrl} from "../App";
import axios from "axios";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const deliveryBoyIcon=L.divIcon({
  className:"custom-map-icon",
  html:renderToStaticMarkup(<div style={{width:"38px",height:"38px",borderRadius:"50%",background:"#ff6b00",display:"flex",alignItems:"center",justifyContent:"center",border:"3px solid white",boxShadow:"0 2px 8px rgba(0,0,0,0.25)"}}><span style={{color:"white",fontSize:"17px",display:"flex"}}><FaMotorcycle/></span></div>),
  iconSize:[38,38],
  iconAnchor:[19,19],
  popupAnchor:[0,-20],
});

const customerIcon=L.divIcon({
  className:"custom-map-icon",
  html:renderToStaticMarkup(<div style={{width:"38px",height:"38px",borderRadius:"50%",background:"#172b4d",display:"flex",alignItems:"center",justifyContent:"center",border:"3px solid white",boxShadow:"0 2px 8px rgba(0,0,0,0.25)"}}><span style={{color:"white",fontSize:"16px",display:"flex"}}><FaHome/></span></div>),
  iconSize:[38,38],
  iconAnchor:[19,19],
  popupAnchor:[0,-20],
});

function FitMapToLocations({deliveryBoyLocation,customerLocation}){
  const map=useMap();
  const timeoutRef=React.useRef(null);
  const isAutoFittingRef=React.useRef(false);

  const fitBothLocations=React.useCallback(()=>{
    if(deliveryBoyLocation?.latitude==null||deliveryBoyLocation?.longitude==null||customerLocation?.latitude==null||customerLocation?.longitude==null)return;

    const deliveryBoyPosition=[Number(deliveryBoyLocation.latitude),Number(deliveryBoyLocation.longitude)];
    const customerPosition=[Number(customerLocation.latitude),Number(customerLocation.longitude)];
    const bounds=L.latLngBounds([deliveryBoyPosition,customerPosition]);

    if(map.getBounds().contains(deliveryBoyPosition)&&map.getBounds().contains(customerPosition))return;

    isAutoFittingRef.current=true;
    map.fitBounds(bounds,{padding:[45,45],animate:true,duration:0.8});
    setTimeout(()=>{isAutoFittingRef.current=false;},1000);
  },[deliveryBoyLocation?.latitude,deliveryBoyLocation?.longitude,customerLocation?.latitude,customerLocation?.longitude,map]);

  useEffect(()=>{
    if(deliveryBoyLocation?.latitude==null||deliveryBoyLocation?.longitude==null||customerLocation?.latitude==null||customerLocation?.longitude==null)return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current=setTimeout(()=>{fitBothLocations();},1800);

    return()=>{clearTimeout(timeoutRef.current);};
  },[deliveryBoyLocation?.latitude,deliveryBoyLocation?.longitude,customerLocation?.latitude,customerLocation?.longitude,fitBothLocations]);

  useEffect(()=>{
    const handleMapMove=()=>{
      if(isAutoFittingRef.current)return;

      clearTimeout(timeoutRef.current);
      timeoutRef.current=setTimeout(()=>{fitBothLocations();},1800);
    };

    map.on("moveend",handleMapMove);

    return()=>{
      map.off("moveend",handleMapMove);
      clearTimeout(timeoutRef.current);
    };
  },[map,fitBothLocations]);

  return null;
}

function DeliveryBoyTracking({currentOrder,currentLocation}){
  const [showOtpBox,setShowOtpBox]=useState(false);
  const [otp,setOtp]=useState("");
  const [sendingOtp,setSendingOtp]=useState(false);
  const [verifyingOtp,setVerifyingOtp]=useState(false);

  if(!currentOrder)return null;

  const {order,customer,shop,shopOrder,deliveryAddress,deliveryBoy,deliveryBoyLocation,customerLocation}=currentOrder;

  const liveDeliveryBoyLocation=currentLocation?.latitude!=null&&currentLocation?.longitude!=null?currentLocation:deliveryBoyLocation;

  const isNearCustomer=()=>{
    if(liveDeliveryBoyLocation?.latitude==null||liveDeliveryBoyLocation?.longitude==null||customerLocation?.latitude==null||customerLocation?.longitude==null){
      return false;
    }

    const R=6371;
    const dLat=((customerLocation.latitude-liveDeliveryBoyLocation.latitude)*Math.PI)/180;
    const dLon=((customerLocation.longitude-liveDeliveryBoyLocation.longitude)*Math.PI)/180;
    const lat1=(liveDeliveryBoyLocation.latitude*Math.PI)/180;
    const lat2=(customerLocation.latitude*Math.PI)/180;
    const a=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
    const distance=R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

    return distance<=0.1;
  };

  const sendOtp=async()=>{
    try{
      setSendingOtp(true);

      const result=await axios.post(`${serverUrl}/api/order/send-delivery-otp`,{orderId:currentOrder.order._id,shopOrderId:currentOrder.shopOrder._id},{withCredentials:true});

      console.log("SEND OTP:",result.data);
      setShowOtpBox(true);
    }catch(error){
      console.log("SEND OTP ERROR:",error.response?.data||error.message);
    }finally{
      setSendingOtp(false);
    }
  };

  const verifyOtp=async()=>{
    try{
      setVerifyingOtp(true);

      const result=await axios.post(`${serverUrl}/api/order/verify-delivery-otp`,{orderId:currentOrder.order._id,shopOrderId:currentOrder.shopOrder._id,otp},{withCredentials:true});

      console.log("VERIFY OTP:",result.data);
      setOtp("");
      setShowOtpBox(false);
      onDeliveryComplete();
    }catch(error){
      console.log("VERIFY OTP ERROR:",error.response?.data||error.message);
    }finally{
      setVerifyingOtp(false);
    }
  };

  const deliveryBoyPosition=useMemo(()=>{
    if(liveDeliveryBoyLocation?.latitude==null||liveDeliveryBoyLocation?.longitude==null){
      return null;
    }

    return[
      Number(liveDeliveryBoyLocation.latitude),
      Number(liveDeliveryBoyLocation.longitude),
    ];
  },[liveDeliveryBoyLocation?.latitude,liveDeliveryBoyLocation?.longitude]);

  const customerPosition=useMemo(()=>{
    if(customerLocation?.latitude==null||customerLocation?.longitude==null)return null;
    return[Number(customerLocation.latitude),Number(customerLocation.longitude)];
  },[customerLocation?.latitude,customerLocation?.longitude]);

  const trackingLine=useMemo(()=>{
    if(!deliveryBoyPosition||!customerPosition)return[];
    return[deliveryBoyPosition,customerPosition];
  },[deliveryBoyPosition,customerPosition]);

  return(
    <div className="mt-5 sm:mt-6 lg:mt-7">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-3.5 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between gap-3 pb-3.5 sm:pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <FaBoxOpen className="text-orange-500 text-base sm:text-lg"/>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-gray-500">Current Delivery</p>
                <h2 className="text-base sm:text-lg font-bold text-[#172b4d] truncate">
                  Order #{order?._id?.slice(-8).toUpperCase()}
                </h2>
              </div>
            </div>
            <span className="shrink-0 px-2.5 sm:px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-[10px] sm:text-xs font-semibold">Out for Delivery</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 sm:gap-3 mt-3.5">
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-3.5">
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <FaStore className="text-orange-500 text-sm"/>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500">Pickup From</p>
                  <h3 className="text-sm font-bold text-[#172b4d] truncate">{shop?.name}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-4">{shop?.address}</p>
                  <p className="text-[11px] text-gray-500">{shop?.city}, {shop?.state}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-3.5">
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <FaUser className="text-orange-500 text-sm"/>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500">Deliver To</p>
                  <h3 className="text-sm font-bold text-[#172b4d] truncate">{customer?.fullName}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-4">{deliveryAddress?.text}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <FaPhone className="text-orange-500" size={10}/>
                    <span className="text-[11px] text-gray-600">{customer?.mobile}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-3.5">
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <FaMotorcycle className="text-orange-500 text-sm"/>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500">Delivery Partner</p>
                  <h3 className="text-sm font-bold text-[#172b4d] truncate">{deliveryBoy?.fullName||"Delivery Partner"}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <FaPhone className="text-orange-500" size={10}/>
                    <p className="text-[11px] text-gray-500">{deliveryBoy?.mobile||"Mobile unavailable"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 mt-3">
            <div className="lg:col-span-2 border border-gray-200 rounded-xl p-3.5 sm:p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaBoxOpen className="text-orange-500 text-sm"/>
                  <h3 className="text-sm sm:text-base font-semibold text-[#172b4d]">Order Items</h3>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500">{shopOrder?.shopOrderItems?.length||0} items</span>
              </div>

              <div className="space-y-1">
                {shopOrder?.shopOrderItems?.map((item)=>(
                  <div key={item._id} className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#172b4d] truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">₹{item.price} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#172b4d] shrink-0">₹{item.price*item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-gray-200 flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Subtotal</span>
                <span className="text-base sm:text-lg font-bold text-orange-500">₹{shopOrder?.subTotalAmount}</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-3.5 sm:p-4 flex items-center lg:items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <FaMoneyBillWave className="text-green-600 text-base"/>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500">Payment Method</p>
                  <p className="text-sm font-semibold text-[#172b4d] mt-0.5">{order?.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-orange-500 text-xs"/>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#172b4d]">Live Tracking</h3>
              </div>

              {deliveryBoyPosition&&customerPosition&&(
                <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-green-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                  Live
                </span>
              )}
            </div>

            <div className="relative z-0 h-[280px] sm:h-[330px] lg:h-[380px] rounded-xl overflow-hidden border border-gray-200">
              {deliveryBoyPosition&&customerPosition?(
                <MapContainer center={deliveryBoyPosition} zoom={15} zoomControl={true} scrollWheelZoom={true} className="h-full w-full">
                  <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                  <FitMapToLocations deliveryBoyLocation={liveDeliveryBoyLocation} customerLocation={customerLocation}/>

                  <Marker position={deliveryBoyPosition} icon={deliveryBoyIcon}>
                    <Popup>
                      <div className="text-xs">
                        <strong>Delivery Partner</strong>
                        <br/>
                        {deliveryBoy?.fullName}
                        <br/>
                        <span className="text-gray-500">Current location</span>
                      </div>
                    </Popup>
                  </Marker>

                  <Marker position={customerPosition} icon={customerIcon}>
                    <Popup>
                      <div className="text-xs">
                        <strong>Customer</strong>
                        <br/>
                        {customer?.fullName}
                        <br/>
                        <span className="text-gray-500">Delivery location</span>
                      </div>
                    </Popup>
                  </Marker>

                  <Polyline positions={trackingLine} pathOptions={{color:"#ff6b00",weight:4,opacity:0.8}}/>
                </MapContainer>
              ):(
                <div className="h-full bg-gray-50 flex items-center justify-center">
                  <div className="text-center px-5">
                    <FaMapMarkerAlt className="text-orange-500 mx-auto mb-2 text-2xl"/>
                    <p className="text-sm font-semibold text-[#172b4d]">Location unavailable</p>
                    <p className="text-[11px] text-gray-500 mt-1">Waiting for delivery location information.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isNearCustomer()&&(
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3.5 sm:p-4">
              {!showOtpBox?(
                <div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <FaCheckCircle className="text-green-600 text-base"/>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#172b4d]">You have reached the delivery location</h3>
                      <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5">You are near {customer?.fullName}'s delivery address.</p>
                    </div>
                  </div>

                  <button onClick={sendOtp} disabled={sendingOtp} className="mt-3.5 w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition">
                    {sendingOtp?(
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                        Sending OTP...
                      </>
                    ):(
                      <>
                        <FaCheckCircle size={15}/>
                        Mark as Delivered
                      </>
                    )}
                  </button>
                </div>
              ):(
                <div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                      <FaKey className="text-orange-500 text-base"/>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#172b4d]">Enter Delivery OTP</h3>
                      <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5">Ask <span className="font-semibold">{customer?.fullName}</span> for the OTP sent to them.</p>
                    </div>
                  </div>

                  <input type="text" inputMode="numeric" value={otp} onChange={(e)=>setOtp(e.target.value.replace(/\D/g,""))} maxLength={6} placeholder="Enter OTP" className="mt-3.5 w-full border border-gray-300 rounded-xl px-3 py-2.5 text-center text-base font-semibold tracking-[0.35em] outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"/>

                  <button onClick={verifyOtp} disabled={otp.length!==6||verifyingOtp} className="mt-2.5 w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition">
                    {verifyingOtp?(
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                        Verifying OTP...
                      </>
                    ):(
                      "Confirm Delivery"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryBoyTracking;