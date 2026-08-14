import React, { useEffect, useState } from "react";
import axios from "axios";
import { GiKnifeFork } from "react-icons/gi";
import { FaImage, FaCamera, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

function EditItem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const [currentItem, setCurrentItem] = useState(null);
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
      const result = await axios.post(`${serverUrl}/api/item/edit-item/${itemId}`, formData, { withCredentials: true });
      dispatch(setMyShopData(result.data.shop));
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGetItemById = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`, { withCredentials: true });
        setCurrentItem(result.data.item);
      } catch (error) {
        console.log(error);
      }
    };
    handleGetItemById();
  }, [itemId]);

  useEffect(() => {
    if (!currentItem) return;
    setName(currentItem.name || "");
    setCategory(currentItem.category || "");
    setFoodType(currentItem.foodType || "");
    setPrice(currentItem.price || "");
    setItemImage(currentItem.image || null);
  }, [currentItem]);

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
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">Edit Food Item</h1>
              <p className="text-[11px] sm:text-xs lg:text-sm text-orange-100 mt-0.5 leading-5">Update your food item details and keep your menu fresh.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-7">
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Food Name</label>
              <input type="text" placeholder="Ex. Chicken Biryani" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-11 sm:h-12 rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition" />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-11 sm:h-12 rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition">
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
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Price (₹)</label>
              <input type="number" min="0" placeholder="Enter Price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full h-11 sm:h-12 rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition" />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Food Type</label>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <button type="button" onClick={() => setFoodType("veg")} className={`h-12 sm:h-14 rounded-xl text-sm font-semibold border transition ${foodType === "veg" ? "bg-green-50 border-green-500 text-green-600" : "bg-white border-gray-200 text-gray-600 hover:border-green-300"}`}>🥗 Veg</button>
                <button type="button" onClick={() => setFoodType("non veg")} className={`h-12 sm:h-14 rounded-xl text-sm font-semibold border transition ${foodType === "non veg" ? "bg-red-50 border-red-500 text-red-600" : "bg-white border-gray-200 text-gray-600 hover:border-red-300"}`}>🍗 Non Veg</button>
              </div>
            </div>

            {currentItem && (
              <div className="rounded-xl border border-orange-100 bg-orange-50 px-3.5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-500">Currently editing</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{currentItem.name}</p>
                  </div>
                  <span className="shrink-0 bg-white px-2.5 py-1 rounded-lg text-xs font-semibold text-orange-600">₹{currentItem.price}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Food Image</label>
            <label htmlFor="foodImage" className="relative block cursor-pointer h-64 sm:h-72 lg:h-[310px] overflow-hidden rounded-2xl border border-dashed border-orange-300 bg-orange-50 hover:bg-orange-100 transition">
              <input id="foodImage" type="file" accept="image/*" hidden onChange={handleImageChange} />
              {itemImage ? (
                <div className="relative w-full h-full">
                  <img src={itemImage} alt="Food Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs sm:text-sm font-semibold">Change food image</span>
                      <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                        <FaCamera className="text-orange-500 text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center px-5 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-100 flex items-center justify-center">
                    <FaImage className="text-2xl sm:text-3xl text-orange-400" />
                  </div>
                  <h2 className="mt-4 text-base sm:text-lg font-bold text-gray-800">Upload Food Image</h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-xs leading-5">Upload a clear and attractive photo of your food.</p>
                  <span className="mt-4 px-4 py-2 rounded-lg bg-orange-500 text-white text-xs sm:text-sm font-semibold">Choose Image</span>
                </div>
              )}
            </label>

            <div className="mt-3 sm:mt-4 rounded-xl border border-orange-100 bg-orange-50 px-3.5 sm:px-4 py-3">
              <h3 className="text-xs sm:text-sm font-bold text-orange-600">Tips for better sales</h3>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] sm:text-xs text-gray-600">
                <p>• Use clear food photos.</p>
                <p>• Keep names short.</p>
                <p>• Select the correct category.</p>
                <p>• Use competitive pricing.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-100 bg-orange-50 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] sm:text-xs text-gray-500 text-center sm:text-left">You can update this food item anytime from your dashboard.</p>
            <button type="submit" disabled={loading} className="w-full sm:w-auto min-w-[150px] h-11 sm:h-12 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditItem;