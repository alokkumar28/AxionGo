import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaSearch,
  FaCrosshairs,
  FaPlus,
  FaMinus,
  FaMoneyBillWave,
  FaCreditCard,
} from "react-icons/fa";
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { setLocation, setAddress } from "../redux/mapSlice";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { serverUrl } from "../App";
import { addMyOrder } from "../redux/userSlice";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ZoomControls() {
  const map = useMap();
  return (
    <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.zoomIn()}
        className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition"
      >
        <FaPlus />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition"
      >
        <FaMinus />
      </button>
    </div>
  );
}

function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), {
      animate: true,
      duration: 0.6,
    });
  }, [center, map]);
  return null;
}

function CheckOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [searchAddress, setSearchAddress] = useState("");
  const markerRef = useRef(null);
  const mapCenter = [
    location?.latitude || 20.2961,
    location?.longitude || 85.8245,
  ];
  useEffect(() => {
    setSearchAddress(address || "");
  }, [address]);

  const gstRate = 18;
  const gstAmount = (totalAmount * gstRate) / 100;
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const totalAmountWithDelivery = totalAmount + deliveryFee + gstAmount;

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const apiKey = import.meta.env.VITE_GEO_API_KEY;
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`,
      );
      dispatch(
        setLocation({
          latitude: lat,
          longitude: lng,
        }),
      );
      dispatch(setAddress(result.data.features[0].properties.address_line2));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchLocation = async () => {
    if (!searchAddress.trim()) return;
    try {
      const apiKey = import.meta.env.VITE_GEO_API_KEY;
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          searchAddress,
        )}&apiKey=${apiKey}`,
      );
      if (!result.data.features.length) {
        alert("Location not found");
        return;
      }
      const place = result.data.features[0];
      dispatch(
        setLocation({
          latitude: place.properties.lat,
          longitude: place.properties.lon,
        }),
      );
      dispatch(setAddress(place.properties.address_line2));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await getAddressByLatLng(
          position.coords.latitude,
          position.coords.longitude,
        );
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
      },
    );
  };

  const handlePlaceOrder = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: address,
            latitude: location.latitude,
            longitude: location.longitude,
          },
          totalAmount: totalAmountWithDelivery,
          cartItems,
        },
        {
          withCredentials: true,
        },
      );
      dispatch(addMyOrder(result.data.order))
      navigate("/order-placed")

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to place order.");
    }
  };

  const eventHandlers = useMemo(
    () => ({
      async dragend(e) {
        const marker = e.target;
        const { lat, lng } = marker.getLatLng();
        await getAddressByLatLng(lat, lng);
      },
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-6"
        >
          <FaArrowLeft />
          Back to Cart
        </button>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
              <p className="text-gray-500 mt-2">
                Complete your order by confirming your delivery details.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <FaMapMarkerAlt className="text-orange-500" />
                <h2 className="font-semibold text-lg">Delivery Location</h2>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  placeholder="Search city, area or complete address..."
                  className="w-full border border-gray-300 rounded-xl py-4 pl-5 pr-24 outline-none focus:ring-2 focus:ring-orange-400"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                  <button
                    onClick={handleSearchLocation}
                    className="w-10 h-10 rounded-full bg-orange-100 hover:bg-orange-200 transition flex items-center justify-center"
                  >
                    <FaSearch className="text-orange-600" />
                  </button>
                  <button
                    onClick={handleCurrentLocation}
                    className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 transition flex items-center justify-center"
                  >
                    <FaCrosshairs className="text-white" />
                  </button>
                </div>
              </div>
              <div className="relative mt-6 h-[420px] rounded-2xl overflow-hidden border">
                <MapContainer
                  center={mapCenter}
                  zoom={16}
                  zoomControl={false}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                >
                  <ChangeMapView center={mapCenter} />
                  <ZoomControls />
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    ref={markerRef}
                    position={mapCenter}
                    draggable={true}
                    eventHandlers={eventHandlers}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong>Delivery Location</strong>
                        <br />
                        {address || "Drag marker or search location"}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-5">Payment Method</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Cash on Delivery */}
                <button
                  onClick={() => setPaymentMethod("Cash on Delivery")}
                  className={`rounded-xl border-2 p-5 transition text-center ${
                    paymentMethod === "Cash on Delivery"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-orange-400"
                  }`}
                >
                  <FaMoneyBillWave className="text-3xl text-green-600 mb-3 mx-auto" />
                  <h3 className="font-semibold text-lg">Cash on Delivery</h3>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    Pay only after your food arrives at your doorstep.
                  </p>
                </button>
                {/* Online Payment */}
                <button
                  onClick={() => setPaymentMethod("Online Payment")}
                  className={`rounded-xl border-2 p-5 transition text-center ${
                    paymentMethod === "Online Payment"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-orange-400"
                  }`}
                >
                  <FaCreditCard className="text-3xl text-blue-600 mb-3 mx-auto" />
                  <h3 className="font-semibold text-lg">Online Payment</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Pay securely using UPI, Debit Card or Credit Card and simply
                    collect your order from the delivery partner.
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-4 text-2xl text-gray-700">
                    <SiGooglepay title="Google Pay" />
                    <SiPhonepe title="PhonePe" />
                    <SiPaytm title="Paytm" />
                    <FaCreditCard title="Debit / Credit Card" />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold mb-5">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-gray-700"
                  >
                    <p>
                      {item.name} × {item.quantity}
                    </p>
                    <span>₹{item.price}</span>
                  </div>
                ))}
              </div>
              <hr className="my-6" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-green-600">
                    {" "}
                    {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Charges</span>
                  <span> {gstAmount.toFixed(2)}</span>
                </div>
              </div>
              <hr className="my-6" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-orange-600">
                  ₹{totalAmountWithDelivery}
                </span>
              </div>
              <button
                onClick={() => handlePlaceOrder()}
                className="mt-8 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition"
              >
                {paymentMethod === "Cash on Delivery"
                  ? "Place Order"
                  : "Continue to Pay"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CheckOut;
