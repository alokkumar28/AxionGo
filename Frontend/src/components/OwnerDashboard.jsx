import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaStore, FaMapMarkerAlt } from "react-icons/fa";
import OwnerNav from "./OwnerNav";
import RegisterShopCard from "./RegisterShopCard";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import axios from "axios";
import ItemCard from "./ItemCard";

function OwnerDashboard() {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();
  useEffect(() => {
    if (myShopData !== undefined) return;
    const fetchMyShop = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/shop/get-my-shop`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(res.data.shop));
      } catch (error) {
        if (error.response?.status === 404) {
          dispatch(setMyShopData(null));
        } else {
          console.error(error);
        }
      }
    };
    fetchMyShop();
  }, [dispatch, myShopData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <OwnerNav />

      {/* Loading */}
      {myShopData === undefined && (
        <div className="flex justify-center items-center h-[70vh]">
          Loading...
        </div>
      )}

      {/* Shop not registered */}
      {myShopData === null && (
        <div className="py-10">
          <RegisterShopCard />
        </div>
      )}

      {myShopData && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {/* Shop Card */}

          <div className="relative overflow-hidden rounded-3xl bg-white border border-orange-100 shadow-xl">
            {/* Edit Button */}
            <button
              onClick={() => navigate("/create-edit-shop")}
              className="absolute top-5 right-5 z-20 h-12 w-12 rounded-full bg-orange-500 hover:bg-orange-600 transition flex items-center justify-center shadow-lg"
            >
              <FaEdit className="text-white text-lg" />
            </button>
            <div className="grid lg:grid-cols-2 gap-8 p-6 md:p-8">
              {/* LEFT IMAGE */}
              <div className="relative">
                <img
                  src={myShopData.image}
                  alt={myShopData.name}
                  className="w-full h-64 md:h-80 lg:h-[340px] rounded-3xl object-cover"
                />
                {/* Name Overlay */}
                <div className="absolute inset-x-0 bottom-0 rounded-b-3xl bg-gradient-to-t from-black/80 via-black/30 to-transparent px-6 py-5">
                  <h1 className="text-white text-2xl md:text-3xl font-bold">
                    {myShopData.name}
                  </h1>
                </div>
              </div>
              {/* RIGHT DETAILS */}
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-3 w-fit rounded-full bg-orange-100 text-orange-600 px-5 py-2 font-semibold">
                  <FaStore />
                  Registered Shop
                </div>
                <h2 className="mt-6 text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                  Welcome Back!
                </h2>
                <p className="mt-4 text-gray-500 text-lg leading-8">
                  Your restaurant is now visible on AxionGo. Customers can
                  discover your shop and browse your menu.
                </p>
                {/* Address */}
                <div className="mt-8 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-orange-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      Shop Address
                    </h3>
                    <p className="mt-2 text-gray-600 leading-7">
                      {myShopData.address}
                      <br />
                      {myShopData.city}, {myShopData.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
            {/* Food Items */}
            <div className="rounded-3xl bg-white border border-orange-100 shadow-lg p-6 hover:-translate-y-1 transition">
              <div className="text-4xl">🍔</div>
              <h3 className="mt-4 text-gray-500 font-medium">Food Items</h3>
              <h2 className="mt-2 text-4xl font-bold text-orange-500">0</h2>
            </div>
            {/* Orders */}
            <div className="rounded-3xl bg-white border border-orange-100 shadow-lg p-6 hover:-translate-y-1 transition">
              <div className="text-4xl">📦</div>
              <h3 className="mt-4 text-gray-500 font-medium">Orders</h3>
              <h2 className="mt-2 text-4xl font-bold text-orange-500">0</h2>
            </div>
            {/* Rating */}
            <div className="rounded-3xl bg-white border border-orange-100 shadow-lg p-6 hover:-translate-y-1 transition">
              <div className="text-4xl">⭐</div>
              <h3 className="mt-4 text-gray-500 font-medium">Rating</h3>
              <h2 className="mt-2 text-4xl font-bold text-orange-500">0.0</h2>
            </div>
          </div>
          {/* Add Food CTA */}
          {myShopData?.items?.length === 0 && (
            <div className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 shadow-2xl">
              <div className="px-6 md:px-12 py-10 text-center text-white">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                  <span className="text-5xl">🍽️</span>
                </div>
                <h2 className="mt-6 text-3xl md:text-4xl font-bold">
                  Start Building Your Menu
                </h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg leading-8 text-orange-100">
                  Your shop is now live on AxionGo. Add delicious food items
                  with attractive images and pricing so customers can discover
                  your menu and start placing orders.
                </p>
                <button
                  onClick={() => navigate("/add-item")}
                  className="mt-8 rounded-full bg-white px-10 py-4 text-lg font-bold text-orange-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  + Add Food Item
                </button>
              </div>
            </div>
          )}

          {myShopData?.items?.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Your Menu</h2>
                <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-semibold">
                  {myShopData.items.length}{" "}
                  {myShopData.items.length === 1 ? "Item" : "Items"}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-7">
                {myShopData.items.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;
