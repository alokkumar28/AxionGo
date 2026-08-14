import React, { useState } from "react";
import axios from "axios";
import { GiKnifeFork } from "react-icons/gi";
import { FaImage, FaCamera, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

function AddItem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setItemImage(URL.createObjectURL(file));
    setBackendImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("foodType", foodType);
      if (backendImage) formData.append("image", backendImage);
      const result = await axios.post(`${serverUrl}/api/item/add-item`, formData, { withCredentials: true });
      dispatch(setMyShopData(result.data.shop));
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] px-3 sm:px-5 lg:px-8 py-4 sm:py-6">
      <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto bg-white border border-orange-100 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 hover:bg-white hover:text-orange-500 text-white flex items-center justify-center transition">
            <FaArrowLeft className="text-sm" />
          </button>
          <div className="flex items-center gap-3 pl-12 sm:pl-14">
            <div className="hidden xs:flex w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white items-center justify-center shrink-0 shadow-sm">
              <GiKnifeFork className="text-xl sm:text-2xl text-orange-500" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">Add Food Item</h1>
              <p className="mt-0.5 text-[11px] sm:text-xs lg:text-sm text-orange-100">Add a delicious dish to your restaurant menu.</p>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-5 sm:gap-6 lg:gap-8">
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Food Name</label>
                <input type="text" placeholder="e.g. Chicken Biryani" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition">
                    <option value="">Choose Category</option>
                    <option>Snacks</option>
                    <option>Main Course</option>
                    <option>Desserts</option>
                    <option>Pizza</option>
                    <option>Burgers</option>
                    <option>Sandwiches</option>
                    <option>South Indian</option>
                    <option>North Indian</option>
                    <option>Chinese</option>
                    <option>Fast Food</option>
                    <option>Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Price</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-500 font-semibold text-sm">₹</span>
                    <input type="number" min="0" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full h-11 sm:h-12 pl-8 pr-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Food Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setFoodType("veg")} className={`h-11 sm:h-12 rounded-xl border text-xs sm:text-sm font-semibold transition ${foodType === "veg" ? "bg-green-50 border-green-500 text-green-600 shadow-sm" : "bg-white border-gray-200 text-gray-600 hover:border-green-300"}`}>
                    <span className="mr-1">🥗</span>Veg
                  </button>
                  <button type="button" onClick={() => setFoodType("non veg")} className={`h-11 sm:h-12 rounded-xl border text-xs sm:text-sm font-semibold transition ${foodType === "non veg" ? "bg-red-50 border-red-500 text-red-600 shadow-sm" : "bg-white border-gray-200 text-gray-600 hover:border-red-300"}`}>
                    <span className="mr-1">🍗</span>Non Veg
                  </button>
                </div>
              </div>
              <div className="hidden sm:block rounded-xl bg-orange-50 border border-orange-100 px-4 py-3">
                <p className="text-xs font-semibold text-orange-600">Menu tip</p>
                <p className="mt-1 text-xs text-gray-500 leading-5">Use a clear food name, correct category and attractive image to make your menu easier for customers to explore.</p>
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Food Image</label>
              <label htmlFor="foodImage" className="relative block w-full h-56 sm:h-64 lg:h-[310px] rounded-2xl border border-dashed border-orange-300 bg-orange-50 overflow-hidden cursor-pointer hover:bg-orange-100 transition">
                <input id="foodImage" type="file" accept="image/*" hidden onChange={handleImageChange} />
                {itemImage ? (
                  <div className="relative w-full h-full">
                    <img src={itemImage} alt="Food Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent h-24" />
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/95 rounded-full px-3 py-2 shadow-md">
                      <FaCamera className="text-orange-500 text-sm" />
                      <span className="text-xs font-semibold text-gray-700">Change</span>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-orange-100 flex items-center justify-center">
                      <FaImage className="text-2xl sm:text-3xl text-orange-400" />
                    </div>
                    <h2 className="mt-3 text-sm sm:text-base font-bold text-gray-800">Upload Food Image</h2>
                    <p className="mt-1.5 max-w-xs text-[11px] sm:text-xs text-gray-500 leading-5">Add a clear and attractive photo of your food.</p>
                    <span className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-semibold">Choose Image</span>
                  </div>
                )}
              </label>
              <div className="mt-3 rounded-xl bg-orange-50 border border-orange-100 px-3.5 py-3">
                <h3 className="text-xs font-bold text-orange-600">Tips for better sales</h3>
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] sm:text-xs text-gray-500">
                  <span>• Clear food photo</span>
                  <span>• Short name</span>
                  <span>• Correct category</span>
                  <span>• Good pricing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-orange-100 bg-orange-50 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-[10px] sm:text-xs text-gray-500 text-center sm:text-left">You can edit this food item anytime from your dashboard.</p>
            <button type="submit" disabled={loading} className="w-full sm:w-auto min-w-[145px] h-11 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md hover:from-orange-600 hover:to-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Saving..." : "Save Food Item"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddItem;