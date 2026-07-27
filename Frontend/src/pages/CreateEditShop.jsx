import React, { useState } from "react";
import { GiKnifeFork } from "react-icons/gi";
import { FaArrowLeft } from "react-icons/fa";
import { FaStore, FaImage, FaCamera, FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";

import { setMyShopData } from "../redux/ownerSlice";
import { useNavigate } from "react-router-dom";

function CreateEditShop() {
  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user,
  );
  const dispatch = useDispatch();
  const [shopName, setShopName] = useState(myShopData?.name || "");
  const [city, setCity] = useState(myShopData?.city || currentCity);
  const [state, setState] = useState(myShopData?.state || currentState);
  const [address, setAddress] = useState(myShopData?.address || currentAddress);
  const [shopImage, setShopImage] = useState(myShopData?.image || null);
  const [backendImage, setBackendImage] = useState(null);
  const navigate = useNavigate()
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShopImage(URL.createObjectURL(file)); //Frontend Image
      setBackendImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", shopName);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/shop/create-edit-shop`,
        formData,
        { withCredentials: true },
      );
      dispatch(setMyShopData(result.data.shop));
      console.log("Shop from backend:", result.data.shop);
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-orange-100 min-h-[calc(100vh-80px)] flex items-center justify-center px-3 sm:px-6 py-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden"
      >
        {/* Header Create or Edit Shop*/}
        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 px-6 md:px-10 py-6">
          <button
  type="button"
  onClick={() => navigate(-1)}
  className="absolute top-6 left-6 z-20 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:bg-white hover:text-orange-500 hover:scale-105"
>
  <FaArrowLeft className="text-lg" />
</button>
          <div className="flex items-center gap-4 pl-20">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg">
              <GiKnifeFork className="text-4xl text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                {!myShopData ? "Create Shop" : "Edit Shop"}
              </h1>
              <p className="text-orange-100 mt-1 text-sm md:text-base">
                Register your restaurant with AxionGo and start serving
                thousands of happy customers every day.
              </p>
            </div>
          </div>
        </div>
        {/* Body */}
        <div className="grid lg:grid-cols-2 gap-8 p-6 md:p-10">
          {/* LEFT SECTION */}
          <div className="space-y-6">
            {/* Shop Name */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Shop Name
              </label>
              <div className="relative">
                <FaStore className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500 text-lg" />
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Enter your shop name"
                  className="w-full h-14 rounded-2xl border-2 border-orange-200 bg-orange-50 pl-14 pr-4 text-lg outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>
            {/* City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  City
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full h-14 rounded-2xl border-2 border-orange-200 bg-orange-50 pl-14 pr-4 text-lg outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="w-full h-14 rounded-2xl border-2 border-orange-200 bg-orange-50 px-5 text-lg outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>
            {/* Address */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Complete Address
              </label>
              <textarea
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete shop address..."
                className="w-full rounded-2xl border-2 border-orange-200 bg-orange-50 p-5 text-lg resize-none outline-none focus:border-orange-500 transition"
              />
            </div>
          </div>
          {/* RIGHT SECTION */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold text-gray-700 mb-3">
              Shop Image
            </label>
            <label
              htmlFor="shopImage"
              className="cursor-pointer border-2 border-dashed border-orange-300 rounded-3xl bg-orange-50 hover:bg-orange-100 transition flex flex-col items-center justify-center h-[360px] lg:h-full"
            >
              <input
                id="shopImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {shopImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={shopImage}
                    alt="Shop Preview"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                  {/* Change Image Button */}
                  <div className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md rounded-full p-4 shadow-lg">
                    <FaCamera className="text-orange-500 text-2xl" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center px-6">
                  <div className="w-28 h-28 rounded-full bg-orange-100 flex items-center justify-center">
                    <FaImage className="text-5xl text-orange-400" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-gray-800">
                    Upload Shop Image
                  </h2>
                  <p className="mt-3 text-gray-500 max-w-sm leading-7">
                    Upload a high quality image of your restaurant. Customers
                    are more likely to order from shops with attractive photos.
                  </p>
                  <div className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg">
                    Choose Image
                  </div>
                </div>
              )}
            </label>
            {/* Tips */}
            <div className="mt-5 rounded-2xl bg-orange-50 border border-orange-200 p-4">
              <h3 className="font-semibold text-orange-600">
                Tips for better visibility
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600 text-sm">
                <li>• Use a clear front view of your restaurant.</li>
                <li>• Recommended size: 1200 × 800 px.</li>
                <li>• JPG, PNG or WEBP formats are supported.</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="border-t border-orange-100 bg-orange-50 px-6 md:px-10 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <p className="text-gray-500 text-center sm:text-left">
              Your shop details can be edited anytime from your dashboard.
            </p>
            <button className="w-full sm:w-auto px-12 h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              Save Shop
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default CreateEditShop;
