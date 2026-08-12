import React, { useState } from "react";
import { FaStar, FaLeaf, FaRegStar } from "react-icons/fa";
import { GiMeat } from "react-icons/gi";
import { FiPlus, FiMinus } from "react-icons/fi";
import { addToCart, removeFromCart } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
function ShowItemCard({ item }) {
  const cartItem = useSelector((state) =>
  state.user.cartItems.find((i) => i._id === item._id)
);
const quantity = cartItem?.quantity || 0;
  const dispatch = useDispatch();
  const renderRatingStars = () => {
    const stars = [];
    const rating = Math.round(item.rating?.average || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400 text-sm" />
        ) : (
          <FaRegStar key={i} className="text-yellow-400 text-sm" />
        ),
      );
    }
    return stars;
  };

  const handleAddToCart = (newQuantity) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(item._id));
      return;
    }
    dispatch(
      addToCart({
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        shop: item.shop,
        quantity: newQuantity,
        foodType: item.foodType,
      }),
    );
  };
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
            {item.foodType === "veg" ? (
              <>
                <FaLeaf className="text-green-600" />
                Veg
              </>
            ) : (
              <>
                <GiMeat className="text-red-600" />
                Non Veg
              </>
            )}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {renderRatingStars()}
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {item.rating?.average?.toFixed(1) || "0.0"}
            </span>
            <span className="text-sm text-gray-500">
              ({item.rating?.count || 0})
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {item.time || "20 mins"}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 truncate">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 truncate mt-1">{item.shop?.name}</p>
        <div className="flex justify-between items-center mt-5">
          <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
          {quantity === 0 ? (
            <button
              onClick={() => {
                handleAddToCart(1);
              }}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-semibold transition"
            >
              Add
              <FiPlus className="text-lg" />
            </button>
          ) : (
            <div className="flex items-center bg-orange-500 rounded-full overflow-hidden text-white">
              <button
                onClick={() => {
                  const newQuantity = Math.max(quantity - 1, 0);
                  handleAddToCart(newQuantity);
                }}
                className="px-3 py-2 hover:bg-orange-600 transition"
              >
                <FiMinus className="text-lg" />
              </button>
              <span className="min-w-10 text-center font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => {
                  const newQuantity = quantity + 1;
                  handleAddToCart(newQuantity);
                }}
                className="px-3 py-2 hover:bg-orange-600 transition"
              >
                <FiPlus className="text-lg" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ShowItemCard;
