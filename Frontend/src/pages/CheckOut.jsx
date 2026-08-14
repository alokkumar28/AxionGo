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
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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
  const { cartItems, totalAmount, userData } = useSelector((state) => state.user);
  const [paymentMethod, setPaymentMethod] =useState("Cash on Delivery");
  const [searchAddress, setSearchAddress] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const markerRef = useRef(null);

  const mapCenter = [
    location?.latitude || 20.2961,
    location?.longitude || 85.8245,
  ];

  useEffect(() => {
    setSearchAddress(address || "");
  }, [address]);

  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const totalAmountWithDelivery =Number(totalAmount || 0) + deliveryFee;

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const apiKey = import.meta.env.VITE_GEO_API_KEY;
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`
      );
      const newAddress =
        result.data.features?.[0]?.properties?.address_line2 ||
        result.data.features?.[0]?.properties?.formatted ||
        "";
      dispatch(
        setLocation({
          latitude: lat,
          longitude: lng,
        })
      );
      dispatch(setAddress(newAddress));
    } catch (error) {
      console.log("Reverse geocoding error:", error);
    }
  };

  const handleSearchLocation = async () => {
    if (!searchAddress.trim()) return;
    try {
      const apiKey = import.meta.env.VITE_GEO_API_KEY;
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          searchAddress
        )}&apiKey=${apiKey}`
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
        })
      );
      dispatch(
        setAddress(
          place.properties.address_line2 ||
            place.properties.formatted ||
            ""
        )
      );
    } catch (error) {
      console.log("Search location error:", error);
      alert("Unable to search location.");
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
          position.coords.longitude
        );
      },
      (error) => {
        console.log(error);
        alert(
          "Unable to get your current location. Please allow location access."
        );
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(true));
        existingScript.addEventListener("error", () => resolve(false));
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrder || paymentLoading) return;
    try {
      setIsPlacingOrder(true);
      if (!cartItems || cartItems.length === 0) {
        alert("Your cart is empty.");
        setIsPlacingOrder(false);
        return;
      }
      if (
        !address ||
        location?.latitude === undefined ||
        location?.latitude === null ||
        location?.longitude === undefined ||
        location?.longitude === null
      ) {
        alert("Please select a valid delivery address.");
        setIsPlacingOrder(false);
        return;
      }
      if (!paymentMethod) {
        alert("Please select a payment method.");
        setIsPlacingOrder(false);
        return;
      }
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
        }
      );
      if (!result.data?.success) {
        throw new Error(
          result.data?.message || "Unable to place the order."
        );
      }
      if (paymentMethod === "Cash on Delivery") {
        if (!result.data.order) {
          throw new Error("Order details were not received.");
        }
        dispatch(addMyOrder(result.data.order));
        navigate("/order-placed");
        return;
      }
      if (paymentMethod === "Online Payment") {
        const orderId = result.data?.order?._id;
        const razorpayOrder = result.data?.razorpayOrder;
        if (!orderId) {
          throw new Error(
            "Order ID was not received from server."
          );
        }
        if (!razorpayOrder?.id) {
          throw new Error(
            "Razorpay order was not created."
          );
        }
        const razorpayLoaded = await loadRazorpay();
        if (!razorpayLoaded) {
          throw new Error(
            "Razorpay failed to load. Please check your internet connection."
          );
        }
        openRazorpayWindow(orderId, razorpayOrder);
        return;
      }
      throw new Error("Invalid payment method.");
    } catch (error) {
      console.error("Place Order Error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to place order."
      );
      setIsPlacingOrder(false);
      setPaymentLoading(false);
    }
  };

  const openRazorpayWindow = (orderId, razorpayOrder) => {
    if (!window.Razorpay) {
      alert("Razorpay is not available. Please try again.");
      setIsPlacingOrder(false);
      return;
    }
    const razorpayKey = import.meta.env.VITE_RAZORPAY_API_KEY_ID;
    if (!razorpayKey) {
      alert("Razorpay configuration is missing.");
      setIsPlacingOrder(false);
      return;
    }
    if (!orderId || !razorpayOrder?.id) {
      alert("Invalid Razorpay order details.");
      setIsPlacingOrder(false);
      return;
    }

    const options = {
    key: razorpayKey,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency || "INR",
    name: "AxionGo",
    description: "Food delivery order",
    order_id: razorpayOrder.id,
    prefill: {
      name: userData?.fullName || "",
      email: userData?.email || "",
      contact: userData?.mobile || userData?.phone || "",
    },
    notes: {
      orderId,
    },
    theme: {
      color: "#f97316",
    },
    handler: async function (response) {
      try {
        setPaymentLoading(true);
        const paymentId = response?.razorpay_payment_id;
        if (!paymentId) {
          throw new Error("Razorpay payment ID was not received.");
        }
        const result = await axios.post(
          `${serverUrl}/api/order/verify-payment`,
          {
            razorpay_payment_id: paymentId,
            orderId,
          },
          {
            withCredentials: true,
          }
        );
        if (!result.data?.success) {
          throw new Error(
            result.data?.message || "Payment verification failed."
          );
        }
        dispatch(addMyOrder(result.data.order));
        navigate("/order-placed");
      } catch (error) {
        console.error("Payment Verification Error:", error);

        alert(
          error.response?.data?.message ||
            error.message ||
            "Payment verification failed."
        );
      } finally {
        setPaymentLoading(false);
        setIsPlacingOrder(false);
      }
    },
    modal: {
      ondismiss: function () {
        setPaymentLoading(false);
        setIsPlacingOrder(false);
      },
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.on("payment.failed", function (response) {
    console.error("Razorpay Payment Failed:", response);
    alert(
      response?.error?.description ||
        "Payment failed. Please try again."
    );
    setPaymentLoading(false);
    setIsPlacingOrder(false);
  });

  razorpay.open();
  };

  const eventHandlers = useMemo(
    () => ({
      async dragend(e) {
        const marker = e.target;
        const { lat, lng } =
          marker.getLatLng();
        await getAddressByLatLng(lat, lng);
      },
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            disabled={isPlacingOrder || paymentLoading}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 flex items-center justify-center shrink-0 transition disabled:opacity-50"
          >
            <FaArrowLeft className="text-sm" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-[#172b4d] leading-tight">
              Checkout
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              Complete your order securely.
            </p>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="mb-5 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#172b4d]">
            Complete Your Order
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Confirm your delivery location and payment method.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-start">
          <div className="lg:col-span-2 space-y-5">
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-orange-500 text-sm" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#172b4d]">
                      Delivery Location
                    </h2>
                    <p className="text-[11px] sm:text-xs text-gray-500">
                      Search or drag the marker to select your address.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="relative">
                  <input
                    type="text"
                    value={searchAddress}
                    onChange={(e) =>
                      setSearchAddress(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearchLocation();
                      }
                    }}
                    placeholder="Search city, area or address..."
                    className="w-full border border-gray-300 rounded-xl py-2.5 sm:py-3 pl-3.5 pr-24 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={handleSearchLocation}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 flex items-center justify-center transition"
                    >
                      <FaSearch className="text-xs sm:text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={handleCurrentLocation}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition"
                    >
                      <FaCrosshairs className="text-xs sm:text-sm" />
                    </button>
                  </div>
                </div>
                {address && (
                  <div className="mt-3 px-3 py-2.5 rounded-xl bg-orange-50 border border-orange-100">
                    <p className="text-[11px] sm:text-xs text-gray-500">
                      Delivery address
                    </p>

                    <p className="text-xs sm:text-sm font-medium text-gray-700 mt-0.5">
                      {address}
                    </p>
                  </div>
                )}
                <div className="relative mt-4 h-[250px] sm:h-[300px] md:h-[340px] lg:h-[360px] rounded-xl overflow-hidden border border-gray-200">
                  <MapContainer
                    center={mapCenter}
                    zoom={16}
                    zoomControl={false}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                  >
                    <ChangeMapView center={mapCenter} />
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
                        <div className="text-xs sm:text-sm">
                          <strong>
                            Delivery Location
                          </strong>
                          <br />
                          {address ||
                            "Drag marker or search location"}
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </section>
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
                <h2 className="text-base sm:text-lg font-bold text-[#172b4d]">
                  Payment Method
                </h2>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                  Choose how you want to pay for your order.
                </p>
              </div>
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod(
                        "Cash on Delivery"
                      )
                    }
                    disabled={
                      isPlacingOrder ||
                      paymentLoading
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      paymentMethod ===
                      "Cash on Delivery"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    } disabled:opacity-60`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <FaMoneyBillWave className="text-green-600 text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                          Cash on Delivery
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-5">
                          Pay after your food arrives at your doorstep.
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod(
                        "Online Payment"
                      )
                    }
                    disabled={
                      isPlacingOrder ||
                      paymentLoading
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      paymentMethod ===
                      "Online Payment"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    } disabled:opacity-60`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <FaCreditCard className="text-blue-600 text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                          Online Payment
                        </h3>

                        <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-5">
                          Pay securely using UPI or Debit/Credit Card.
                        </p>
                        <div className="flex items-center gap-3 mt-3 text-lg text-gray-700">
                          <SiGooglepay title="Google Pay" />
                          <SiPhonepe title="PhonePe" />
                          <SiPaytm title="Paytm" />
                          <FaCreditCard title="Debit / Credit Card" />
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </section>
          </div>
          <aside className="lg:sticky lg:top-20 h-fit">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-orange-500 px-4 sm:px-5 py-3.5">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Order Summary
                </h2>
              </div>
              <div className="p-4 sm:p-5">
                <div className="space-y-2.5">
                  {cartItems?.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-start justify-between gap-3 text-xs sm:text-sm text-gray-600"
                    >
                      <p className="min-w-0">
                        <span className="text-gray-800 font-medium">
                          {item.name}
                        </span>

                        <span className="text-gray-400">
                          {" "}
                          × {item.quantity}
                        </span>
                      </p>
                      <span className="shrink-0 font-medium text-gray-700">
                        ₹
                        {Number(item.price) *
                          Number(item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 my-4" />
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>
                      ₹{Number(totalAmount || 0)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>Delivery Fee</span>

                    <span className="font-semibold text-green-600">
                      {deliveryFee === 0
                        ? "Free"
                        : `₹${deliveryFee}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-4" />

                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-bold text-gray-800">
                    Total
                  </span>

                  <span className="text-lg sm:text-xl font-bold text-orange-600">
                    ₹
                    {totalAmountWithDelivery.toFixed(
                      2
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={
                    isPlacingOrder ||
                    paymentLoading
                  }
                  className={`mt-5 w-full text-white py-2.5 sm:py-3 rounded-xl text-sm font-bold transition ${
                    isPlacingOrder ||
                    paymentLoading
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {paymentLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Verifying Payment...
                    </span>
                  ) : isPlacingOrder ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />

                      {paymentMethod ===
                      "Cash on Delivery"
                        ? "Placing Order..."
                        : "Opening Payment..."}
                    </span>
                  ) : paymentMethod ===
                    "Cash on Delivery" ? (
                    "Place Order"
                  ) : (
                    "Continue to Pay"
                  )}
                </button>
                <div className="mt-4 bg-orange-50 rounded-xl px-3 py-3 space-y-1.5">
                  <p className="text-[11px] sm:text-xs text-gray-600">
                    ✓ Secure Payment
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-600">
                    ✓ Free Delivery above ₹500
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-600">
                    ✓ Freshly Prepared Food
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default CheckOut;