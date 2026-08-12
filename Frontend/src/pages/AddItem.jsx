import React, { useState } from "react";
import axios from "axios";
import { GiKnifeFork } from "react-icons/gi";
import { FaImage, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
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
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/item/add-item`,
        formData,
        {
          withCredentials: true,
        },
      );
      dispatch(setMyShopData(result.data.shop));
      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-orange-50 via-white to-orange-100 flex justify-center items-center px-4 py-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl rounded-3xl overflow-hidden bg-white shadow-2xl border border-orange-100"
      >
        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:bg-white hover:text-orange-500 hover:scale-105 shadow-lg"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <div className="flex items-center gap-4 pl-20">
            <div className="w-16 h-16 rounded-2xl bg-white flex justify-center items-center">
              <GiKnifeFork className="text-4xl text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Add Food Item
              </h1>
              <p className="text-orange-100 mt-1">
                Add delicious dishes to your restaurant menu.
              </p>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-10 p-6 md:p-10">
          <div className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-2 text-lg">
                Food Name
              </label>
              <input
                type="text"
                placeholder="Ex. Chicken Biryani"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 rounded-2xl border-2 border-orange-200 bg-orange-50 px-5 text-lg outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2 text-lg">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-14 rounded-2xl border-2 border-orange-200 bg-orange-50 px-5 text-lg outline-none focus:border-orange-500"
              >
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
              <label className="block font-semibold text-gray-700 mb-2 text-lg">
                Price (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-14 rounded-2xl border-2 border-orange-200 bg-orange-50 px-5 text-lg outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-4 text-lg">
                Food Type
              </label>
              <div className="grid grid-cols-2 gap-5">
                <button
                  type="button"
                  onClick={() => setFoodType("veg")}
                  className={`rounded-2xl h-20 font-bold text-lg transition border-2 ${
                    foodType === "veg"
                      ? "bg-green-50 border-green-500 text-green-600"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  🥗 Veg
                </button>
                <button
                  type="button"
                  onClick={() => setFoodType("non veg")}
                  className={`rounded-2xl h-20 font-bold text-lg transition border-2 ${
                    foodType === "non veg"
                      ? "bg-red-50 border-red-500 text-red-600"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  🍗 Non Veg
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 text-lg mb-3">
              Food Image
            </label>
            <label
              htmlFor="foodImage"
              className="cursor-pointer border-2 border-dashed border-orange-300 rounded-3xl bg-orange-50 hover:bg-orange-100 transition h-[380px] flex justify-center items-center"
            >
              <input
                id="foodImage"
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
              {itemImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={itemImage}
                    alt="Food Preview"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                  <div className="absolute bottom-5 right-5 h-14 w-14 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center">
                    <FaCamera className="text-orange-500 text-2xl" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-8 text-center">
                  <div className="h-28 w-28 rounded-full bg-orange-100 flex items-center justify-center">
                    <FaImage className="text-5xl text-orange-400" />
                  </div>

                  <h2 className="mt-6 text-2xl font-bold text-gray-800">
                    Upload Food Image
                  </h2>
                  <p className="mt-3 text-gray-500 leading-7 max-w-sm">
                    Upload a delicious and high-quality image of your food.
                    Attractive photos increase customer engagement and boost
                    your chances of receiving more orders.
                  </p>
                  <div className="mt-6 px-7 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow-lg">
                    Choose Image
                  </div>
                </div>
              )}
            </label>
            <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-5">
              <h3 className="font-bold text-orange-600">
                Tips for better sales
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600">
                <li>• Upload clear and bright food photos.</li>
                <li>• Keep the item name short and attractive.</li>
                <li>• Set the correct category and food type.</li>
                <li>• Competitive pricing attracts more customers.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-orange-100 bg-orange-50 px-6 md:px-10 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <p className="text-gray-500 text-center sm:text-left">
              You can edit this food item anytime from your dashboard.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto h-14 px-12 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-bold shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Food Item"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default AddItem;
