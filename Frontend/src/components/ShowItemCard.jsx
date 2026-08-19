import React, { useState } from "react";
import { FaStar, FaLeaf, FaRegStar } from "react-icons/fa";
import { GiMeat } from "react-icons/gi";
import { FiPlus, FiMinus } from "react-icons/fi";
import { addToCart, removeFromCart } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

function ShowItemCard({ item }) {
  const cartItem = useSelector((state) => state.user.cartItems.find((i) => i._id === item._id));
  const quantity = cartItem?.quantity || 0;
  const dispatch = useDispatch();

  const renderRatingStars = () => {
    const stars = [];
    const rating = Math.round(Number(item.rating?.average) || 0);
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <FaStar
            key={i}
            className="text-yellow-400 text-[9px] sm:text-[10px]"
          />
        );
      } else {
        stars.push(
          <FaRegStar
            key={i}
            className="text-gray-300 text-[9px] sm:text-[10px]"
          />
        );
      }
    }
    return stars;
  };

  const handleAddToCart = (newQuantity) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(item._id));
      return;
    }
    dispatch(addToCart({ _id: item._id, name: item.name, price: item.price, image: item.image, shop: item.shop, quantity: newQuantity, foodType: item.foodType }));
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
      <div className="relative overflow-hidden">
        <img src={item.image} alt={item.name} loading="lazy" className="w-full h-24 sm:h-28 md:h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2 left-2">
          <span className="bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 text-[9px] sm:text-[10px] font-semibold flex items-center gap-1 shadow-sm">
            {item.foodType === "veg" ? (
              <><FaLeaf className="text-green-600" /> Veg</>
            ) : (
              <><GiMeat className="text-red-600" /> Non Veg</>
            )}
          </span>
        </div>
      </div>

      <div className="p-2.5 sm:p-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-[1px]">{renderRatingStars()}</div>
            <span className="text-[10px] sm:text-xs font-semibold text-gray-700">{item.rating?.average?.toFixed(1) || "0.0"}</span>
            <span className="text-[9px] sm:text-[10px] text-gray-500">({item.rating?.count || 0})</span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-gray-500">{item.time || "20 min"}</span>
        </div>

        <h3 className="font-bold text-sm sm:text-base text-gray-800 truncate">{item.name}</h3>
        <p className="text-[10px] sm:text-xs text-gray-500 truncate mt-0.5">{item.shop?.name || "Restaurant"}</p>

        <div className="flex items-center justify-between gap-2 mt-2.5">
          <span className="font-bold text-sm sm:text-base text-gray-900">₹{item.price}</span>

          {quantity === 0 ? (
            <button onClick={() => { handleAddToCart(1); }} className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition">
              Add <FiPlus className="text-xs" />
            </button>
          ) : (
            <div className="flex items-center bg-orange-500 rounded-lg overflow-hidden text-white">
              <button onClick={() => { const newQuantity = Math.max(quantity - 1, 0); handleAddToCart(newQuantity); }} className="px-2 py-1.5 hover:bg-orange-600 transition">
                <FiMinus className="text-[11px]" />
              </button>
              <span className="min-w-[22px] text-center text-xs font-semibold">{quantity}</span>
              <button onClick={() => { const newQuantity = quantity + 1; handleAddToCart(newQuantity); }} className="px-2 py-1.5 hover:bg-orange-600 transition">
                <FiPlus className="text-[11px]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowItemCard;