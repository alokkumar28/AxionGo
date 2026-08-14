import React, { useState } from "react";
import { GiKnifeFork } from "react-icons/gi";
import { FaArrowLeft, FaStore, FaImage, FaCamera, FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { useNavigate } from "react-router-dom";

function CreateEditShop() {
  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shopName, setShopName] = useState(myShopData?.name || "");
  const [city, setCity] = useState(myShopData?.city || currentCity || "");
  const [state, setState] = useState(myShopData?.state || currentState || "");
  const [address, setAddress] = useState(myShopData?.address || currentAddress || "");
  const [shopImage, setShopImage] = useState(myShopData?.image || null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setShopImage(URL.createObjectURL(file));
    setBackendImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", shopName);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);
      if (backendImage) formData.append("image", backendImage);
      const result = await axios.post(`${serverUrl}/api/shop/create-edit-shop`, formData, { withCredentials: true });
      dispatch(setMyShopData(result.data.shop));
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-orange-50 via-white to-orange-100 px-3 sm:px-5 lg:px-8 py-4 sm:py-6">
      <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-orange-100 shadow-md overflow-hidden">
        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 px-4 sm:px-6 py-4 sm:py-5">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-3 sm:left-5 top-4 sm:top-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white hover:text-orange-500 transition">
            <FaArrowLeft className="text-sm" />
          </button>
          <div className="flex items-center gap-3 pl-12 sm:pl-14">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white flex items-center justify-center shrink-0">
              <GiKnifeFork className="text-xl sm:text-2xl text-orange-500" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">{myShopData ? "Edit Shop" : "Create Shop"}</h1>
              <p className="text-[11px] sm:text-xs lg:text-sm text-orange-100 mt-0.5 leading-5">{myShopData ? "Update your restaurant information." : "Register your restaurant on AxionGo."}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-7">
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Shop Name</label>
              <div className="relative">
                <FaStore className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-500 text-sm" />
                <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="Enter your shop name" className="w-full h-11 sm:h-12 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">City</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-500 text-sm" />
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full h-11 sm:h-12 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">State</label>
                <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="w-full h-11 sm:h-12 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition" />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Complete Address</label>
              <textarea rows={5} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter complete shop address..." className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm resize-none outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition" />
            </div>

            <div className="rounded-xl border border-orange-100 bg-orange-50 px-3.5 py-3">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <FaStore className="text-orange-500 text-xs" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-orange-600">Shop Information</h3>
                  <p className="mt-1 text-[11px] sm:text-xs text-gray-500 leading-4">Keep your restaurant name and address accurate so customers can easily find your shop.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Shop Image</label>
            <label htmlFor="shopImage" className="relative block cursor-pointer h-64 sm:h-72 lg:h-[310px] overflow-hidden rounded-2xl border border-dashed border-orange-300 bg-orange-50 hover:bg-orange-100 transition">
              <input id="shopImage" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {shopImage ? (
                <div className="relative w-full h-full">
                  <img src={shopImage} alt="Shop Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                    <FaCamera className="text-orange-500 text-sm" />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center px-5 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-100 flex items-center justify-center">
                    <FaImage className="text-2xl sm:text-3xl text-orange-400" />
                  </div>
                  <h2 className="mt-4 text-base sm:text-lg font-bold text-gray-800">Upload Shop Image</h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-xs leading-5">Use a clear and attractive image of your restaurant.</p>
                  <span className="mt-4 px-4 py-2 rounded-lg bg-orange-500 text-white text-xs sm:text-sm font-semibold">Choose Image</span>
                </div>
              )}
            </label>

            <div className="mt-3 sm:mt-4 rounded-xl border border-orange-100 bg-orange-50 px-3.5 sm:px-4 py-3">
              <h3 className="text-xs sm:text-sm font-bold text-orange-600">Tips for better visibility</h3>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] sm:text-xs text-gray-600">
                <p>• Use a clear restaurant photo.</p>
                <p>• Recommended: 1200 × 800 px.</p>
                <p>• JPG, PNG or WEBP supported.</p>
                <p>• Bright photos attract customers.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-100 bg-orange-50 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] sm:text-xs text-gray-500 text-center sm:text-left">Your shop details can be edited anytime from your dashboard.</p>
            <button type="submit" disabled={loading} className="w-full sm:w-auto min-w-[140px] h-11 sm:h-12 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Saving..." : "Save Shop"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateEditShop;