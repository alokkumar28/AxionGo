import React, { useEffect, useMemo, useState } from "react";
import {
  FaStore,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaMoneyBillWave,
  FaBoxOpen,
  FaPlus,
  FaMinus,
  FaMotorcycle,
  FaHome,
  FaCheckCircle,
  FaKey,
} from "react-icons/fa";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const deliveryBoyIcon = L.divIcon({
  className: "custom-map-icon",
  html: renderToStaticMarkup(
    <div
      style={{
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        background: "#ff6b00",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "4px solid white",
        boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
      }}
    >
      <span
        style={{
          color: "white",
          fontSize: "21px",
          display: "flex",
        }}
      >
        <FaMotorcycle />
      </span>
    </div>,
  ),
  iconSize: [46, 46],
  iconAnchor: [23, 23],
  popupAnchor: [0, -25],
});

const customerIcon = L.divIcon({
  className: "custom-map-icon",
  html: renderToStaticMarkup(
    <div
      style={{
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        background: "#172b4d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "4px solid white",
        boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
      }}
    >
      <span
        style={{
          color: "white",
          fontSize: "20px",
          display: "flex",
        }}
      >
        <FaHome />
      </span>
    </div>,
  ),

  iconSize: [46, 46],
  iconAnchor: [23, 23],
  popupAnchor: [0, -25],
});

function FitMapToLocations({ deliveryBoyLocation, customerLocation }) {
  const map = useMap();

  const timeoutRef = React.useRef(null);
  const isAutoFittingRef = React.useRef(false);

  const fitBothLocations = React.useCallback(() => {
    if (
      deliveryBoyLocation?.latitude == null ||
      deliveryBoyLocation?.longitude == null ||
      customerLocation?.latitude == null ||
      customerLocation?.longitude == null
    ) {
      return;
    }
    const deliveryBoyPosition = [
      Number(deliveryBoyLocation.latitude),
      Number(deliveryBoyLocation.longitude),
    ];
    const customerPosition = [
      Number(customerLocation.latitude),
      Number(customerLocation.longitude),
    ];
    const bounds = L.latLngBounds([deliveryBoyPosition, customerPosition]);
    if (
      map.getBounds().contains(deliveryBoyPosition) &&
      map.getBounds().contains(customerPosition)
    ) {
      return;
    }
    isAutoFittingRef.current = true;
    map.fitBounds(bounds, {
      padding: [70, 70],
      animate: true,
      duration: 1,
    });
    setTimeout(() => {
      isAutoFittingRef.current = false;
    }, 1200);
  }, [
    deliveryBoyLocation?.latitude,
    deliveryBoyLocation?.longitude,
    customerLocation?.latitude,
    customerLocation?.longitude,
    map,
  ]);

  useEffect(() => {
    if (
      deliveryBoyLocation?.latitude == null ||
      deliveryBoyLocation?.longitude == null ||
      customerLocation?.latitude == null ||
      customerLocation?.longitude == null
    ) {
      return;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fitBothLocations();
    }, 2500);
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [
    deliveryBoyLocation?.latitude,
    deliveryBoyLocation?.longitude,
    customerLocation?.latitude,
    customerLocation?.longitude,
    fitBothLocations,
  ]);

  useEffect(() => {
    const handleMapMove = () => {
      if (isAutoFittingRef.current) {
        return;
      }
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        fitBothLocations();
      }, 2500);
    };
    map.on("moveend", handleMapMove);
    return () => {
      map.off("moveend", handleMapMove);
      clearTimeout(timeoutRef.current);
    };
  }, [map, fitBothLocations]);
  return null;
}

function DeliveryBoyTracking({ currentOrder }) {
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");

  if (!currentOrder) {
    return null;
  }
  const {
    order,
    customer,
    shop,
    shopOrder,
    deliveryAddress,
    deliveryBoy,
    deliveryBoyLocation,
    customerLocation,
  } = currentOrder;

  const isNearCustomer = () => {
    if (
      !deliveryBoyLocation?.latitude ||
      !deliveryBoyLocation?.longitude ||
      !customerLocation?.latitude ||
      !customerLocation?.longitude
    ) {
      return false;
    }
    const R = 6371;
    const dLat =
      ((customerLocation.latitude - deliveryBoyLocation.latitude) * Math.PI) /
      180;
    const dLon =
      ((customerLocation.longitude - deliveryBoyLocation.longitude) * Math.PI) /
      180;
    const lat1 = (deliveryBoyLocation.latitude * Math.PI) / 180;
    const lat2 = (customerLocation.latitude * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return distance <= 0.1;
  };

  const deliveryBoyPosition = useMemo(() => {
    if (
      deliveryBoyLocation?.latitude == null ||
      deliveryBoyLocation?.longitude == null
    ) {
      return null;
    }
    return [
      Number(deliveryBoyLocation.latitude),
      Number(deliveryBoyLocation.longitude),
    ];
  }, [deliveryBoyLocation?.latitude, deliveryBoyLocation?.longitude]);

  const customerPosition = useMemo(() => {
    if (
      customerLocation?.latitude == null ||
      customerLocation?.longitude == null
    ) {
      return null;
    }
    return [
      Number(customerLocation.latitude),
      Number(customerLocation.longitude),
    ];
  }, [customerLocation?.latitude, customerLocation?.longitude]);

  const trackingLine = useMemo(() => {
    if (!deliveryBoyPosition || !customerPosition) {
      return [];
    }
    return [deliveryBoyPosition, customerPosition];
  }, [deliveryBoyPosition, customerPosition]);

  return (
    <div className="mt-8">
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* ORDER HEADER */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                <FaBoxOpen className="text-orange-500" size={26} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Delivery</p>
                <h2 className="text-2xl font-bold text-[#172b4d]">
                  Order #{order?._id?.slice(-8).toUpperCase()}
                </h2>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
              Out for Delivery
            </div>
          </div>
          {/* CUSTOMER DETAILS */}
          <div className="mt-7 border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <FaStore className="text-orange-500" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pickup From</p>
                <h3 className="text-lg font-bold text-[#172b4d] mt-1">
                  {shop?.name}
                </h3>
                <p className="text-gray-500 mt-1">{shop?.address}</p>
                <p className="text-gray-500">
                  {shop?.city}, {shop?.state}
                </p>
              </div>
            </div>
          </div>
          {/* CUSTOMER DETAILS */}
          <div className="mt-5 border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <FaUser className="text-orange-500" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Deliver To</p>
                <h3 className="text-lg font-bold text-[#172b4d] mt-1">
                  {customer?.fullName}
                </h3>
                <p className="text-gray-500 mt-1">{deliveryAddress?.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <FaPhone className="text-orange-500" size={14} />
                  <span className="text-sm text-gray-600">
                    {customer?.mobile}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* DELIVERY PARTNER */}
          <div className="mt-5 border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <FaMotorcycle className="text-orange-500" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Partner</p>
                <h3 className="text-lg font-bold text-[#172b4d] mt-1">
                  {deliveryBoy?.fullName || "Delivery Partner"}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <FaPhone className="text-orange-500" size={13} />
                  <p className="text-gray-500">
                    {deliveryBoy?.mobile || "Mobile unavailable"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* ORDER ITEMS */}
          <div className="mt-5 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <FaBoxOpen className="text-orange-500" size={17} />
              <h3 className="font-semibold text-[#172b4d]">Order Items</h3>
            </div>
            <div className="space-y-3">
              {shopOrder?.shopOrderItems?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-[#172b4d]">{item.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-[#172b4d]">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200 flex justify-between">
              <span className="font-medium text-gray-600">Subtotal</span>

              <span className="text-xl font-bold text-[#172b4d]">
                ₹{shopOrder?.subTotalAmount}
              </span>
            </div>
          </div>
          {/* PAYMENT */}
          <div className="mt-5 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                <FaMoneyBillWave className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-semibold text-[#172b4d]">
                  {order?.paymentMethod}
                </p>
              </div>
            </div>
          </div>
          {/* LIVE TRACKING MAP */}
          <div className="mt-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-500" size={18} />
                <h3 className="font-semibold text-[#172b4d]">
                  Live Delivery Tracking
                </h3>
              </div>
              {deliveryBoyPosition && customerPosition && (
                <span className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              )}
            </div>
            <div className="relative h-[420px] rounded-2xl overflow-hidden border border-gray-200">
              {deliveryBoyPosition && customerPosition ? (
                <MapContainer
                  center={deliveryBoyPosition}
                  zoom={15}
                  zoomControl={false}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FitMapToLocations
                    deliveryBoyLocation={deliveryBoyLocation}
                    customerLocation={customerLocation}
                  />
                  <Marker position={deliveryBoyPosition} icon={deliveryBoyIcon}>
                    <Popup>
                      <div className="text-sm">
                        <strong>Delivery Partner</strong>
                        <br />
                        {deliveryBoy?.fullName}
                        <br />
                        <span className="text-gray-500">Current location</span>
                      </div>
                    </Popup>
                  </Marker>
                  <Marker position={customerPosition} icon={customerIcon}>
                    <Popup>
                      <div className="text-sm">
                        <strong>Customer</strong>
                        <br />
                        {customer?.fullName}
                        <br />
                        <span className="text-gray-500">Delivery location</span>
                      </div>
                    </Popup>
                  </Marker>
                  <Polyline
                    positions={trackingLine}
                    pathOptions={{
                      color: "#ff6b00",
                      weight: 5,
                      opacity: 0.8,
                    }}
                  />
                </MapContainer>
              ) : (
                <div className="h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center px-6">
                    <FaMapMarkerAlt
                      className="text-orange-500 mx-auto mb-3"
                      size={35}
                    />
                    <p className="font-semibold text-[#172b4d]">
                      Location unavailable
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Waiting for delivery location information.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/*DELIVERY COMPLETION*/}
          {isNearCustomer() && (
            <div className="mt-5 bg-green-50 border border-green-200 rounded-2xl p-5">
              {!showOtpBox ? (
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                      <FaCheckCircle className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#172b4d]">
                        You have reached the delivery location
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        You are near {customer?.fullName}'s delivery address.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowOtpBox(true)}
                    className="mt-5 w-full bg-[#ff6b00] hover:bg-[#e85f00] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <FaCheckCircle size={18} />
                    Mark as Delivered
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                      <FaKey className="text-orange-500" size={19} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#172b4d]">
                        Enter Delivery OTP
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Ask{" "}
                        <span className="font-semibold">
                          {customer?.fullName}
                        </span>{" "}
                        for the OTP sent to them.
                      </p>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    placeholder="Enter OTP"
                    className="mt-5 w-full border border-gray-300 rounded-xl px-4 py-3 text-center text-lg font-semibold tracking-[0.4em] outline-none focus:border-orange-500"
                  />
                  <button
                    disabled={otp.length !== 6}
                    className="mt-4 w-full bg-[#ff6b00] disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#e85f00] text-white font-semibold py-3.5 rounded-xl transition"
                  >
                    Confirm Delivery
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
