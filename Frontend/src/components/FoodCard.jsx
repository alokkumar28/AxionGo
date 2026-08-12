import React, { useState } from "react";
import { FaStar, FaLeaf, FaRegStar } from "react-icons/fa";
import { GiMeat } from "react-icons/gi";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/userSlice";
function FoodCard({ food }) {
  const cartItem = useSelector((state) =>
    state.user.cartItems.find((i) => i._id === food.id),
  );
  const quantity = cartItem?.quantity || 0;
  const dispatch = useDispatch();
  
  const renderRatingStars = () => {
    const stars = [];
    const rating = Math.round(food.rating?.average || 0);
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
      dispatch(removeFromCart(food.id));
      return;
    }
    dispatch(
      addToCart({
        _id: food.id,
        name: food.name,
        price: food.price,
        image: food.image,
        shop: food.shop,
        quantity: newQuantity,
        foodType: food.foodType,
      }),
    );
  };
  return (
    <div className="min-w-[250px] sm:min-w-[270px] bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="h-44 w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {renderRatingStars()}
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {food.rating?.average?.toFixed(1) || "0.0"}
            </span>
            <span className="text-sm text-gray-500">
              ({food.rating?.count || 0})
            </span>
          </div>
          <span className="text-sm text-gray-500">{food.time || "20 min"}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {food.name}
        </h3>
        <p className="text-sm text-gray-500 truncate mt-1">
          {food.shop?.name || "Restaurant"}
        </p>
        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-2">
            {food.foodType === "veg" ? (
              <FaLeaf className="text-green-600 text-lg" />
            ) : (
              <GiMeat className="text-red-600 text-lg" />
            )}
            <span className="text-xl font-bold text-gray-900">
              ₹{food.price}
            </span>
          </div>
          {quantity === 0 ? (
            <button
              onClick={() => {
                handleAddToCart(1);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
            >
              Add
              <FiPlus className="text-lg" />
            </button>
          ) : (
            <div className="flex items-center rounded-xl bg-orange-500 text-white overflow-hidden">
              <button
                onClick={() => {
                  const newQuantity = Math.max(quantity - 1, 0);
                  handleAddToCart(newQuantity);
                }}
                className="px-3 py-2 hover:bg-orange-600 transition"
              >
                <FiMinus className="text-lg" />
              </button>
              <span className="min-w-[40px] text-center font-semibold">
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

export default FoodCard;
