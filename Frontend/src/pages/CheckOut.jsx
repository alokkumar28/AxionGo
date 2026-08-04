import React, { useState, useMemo, useRef } from "react";
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
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { setLocation, setAddress } from "../redux/mapSlice";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
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
  React.useEffect(() => {
    map.setView(center, map.getZoom(), {
      animate: true,
    });
  }, [center, map]);
  return null;
}

function CheckOut() {
  const navigate = useNavigate();
  const { location, address } = useSelector((state) => state.map);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const mapCenter = [
    location?.latitude || 20.2961,
    location?.longitude || 85.8245,
  ];
  const dispatch = useDispatch();
  const markerRef = useRef(null);
  const orderItems = [
    {
      name: "Chicken Burger",
      quantity: 2,
      price: 300,
    },
    {
      name: "French Fries",
      quantity: 1,
      price: 120,
    },
    {
      name: "Cold Drink",
      quantity: 2,
      price: 80,
    },
  ];
  const subtotal = 500;
  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  const eventHandlers = useMemo(
    () => ({
      async dragend() {
        const marker = markerRef.current;
        if (!marker) return;
        const { lat, lng } = marker.getLatLng();
        console.log("Dragged:", lat, lng);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
          );
          const data = await response.json();
          console.log(data);
          dispatch(
            setLocation({
              latitude: lat,
              longitude: lng,
            }),
          );
          dispatch(setAddress(data.display_name));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    [dispatch],
  );

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
          );
          const data = await response.json();
          dispatch(
            setLocation({
              latitude: lat,
              longitude: lng,
            }),
          );
          dispatch(setAddress(data.display_name));
        } catch (err) {
          console.log(err);
        }
      },
      (error) => {
        console.log(error);
        alert("Unable to fetch your current location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-6"
        >
          <FaArrowLeft />
          Back to Cart
        </button>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Heading */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
              <p className="text-gray-500 mt-2">
                Complete your order by confirming your delivery details.
              </p>
            </div>
            {/* Delivery Location */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <FaMapMarkerAlt className="text-orange-500" />
                <h2 className="font-semibold text-lg">Delivery Location</h2>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={address || ""}
                  readOnly
                  placeholder="Enter your delivery address..."
                  className="w-full border border-gray-300 rounded-xl py-4 pl-5 pr-24 outline-none focus:ring-2 focus:ring-orange-400"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-orange-100 hover:bg-orange-200 flex items-center justify-center">
                    <FaSearch className="text-orange-600" />
                  </button>
                  <button
                    onClick={handleCurrentLocation}
                    className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center"
                  >
                    <FaCrosshairs className="text-white" />
                  </button>
                </div>
              </div>
              {/* Map */}
              <div className="relative mt-6 h-[420px] rounded-2xl overflow-hidden border">
                <MapContainer
                  center={mapCenter}
                  zoom={16}
                  zoomControl={false}
                  scrollWheelZoom
                  className="h-full w-full"
                >
                  <ChangeMapView center={mapCenter} />
                  <ZoomControls />
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    draggable
                    eventHandlers={eventHandlers}
                    position={mapCenter}
                    ref={markerRef}
                  >
                    <Popup>{address || "Selected Location"}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-5">Payment Method</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("Cash on Delivery")}
                  className={`rounded-xl border-2 p-5 transition ${
                    paymentMethod === "Cash on Delivery"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-orange-400"
                  }`}
                >
                  <FaMoneyBillWave className="text-3xl text-green-600 mb-3 mx-auto" />
                  <p className="font-semibold">Cash on Delivery</p>
                </button>
                <button
                  onClick={() => setPaymentMethod("online")}
                  className={`rounded-xl border-2 p-5 transition ${
                    paymentMethod === "online"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-orange-400"
                  }`}
                >
                  <FaCreditCard className="text-3xl text-blue-600 mb-3 mx-auto" />
                  <p className="font-semibold">UPI / Card / Wallet</p>
                </button>
              </div>
            </div>
          </div>
          {/* Right Side */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold mb-5">Order Summary</h2>
              <div className="space-y-4">
                {orderItems.map((item, index) => (
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
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
              </div>
              <hr className="my-6" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-orange-600">₹{total}</span>
              </div>
              <button className="mt-8 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
