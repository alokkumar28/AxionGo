import React from "react";
import { FaStar, FaLeaf } from "react-icons/fa";
import { GiMeat } from "react-icons/gi";

function FoodCard({ food }) {
  return (
    <div className="min-w-[250px] sm:min-w-[270px] bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="h-44 w-full object-cover group-hover:scale-110 transition duration-500"
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1 font-medium">
            <FaStar className="text-yellow-400" />
            {food.rating}
          </span>
          <span className="text-gray-500">{food.time}</span>
        </div>
        <div>
          <h3 className="font-bold text-lg truncate">{food.name}</h3>
          <p className="text-sm text-gray-500 truncate">{food.restaurant}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {food.veg ? (
              <FaLeaf className="text-green-600" />
            ) : (
              <GiMeat className="text-red-600" />
            )}
            <span className="font-semibold">₹{food.price}</span>
          </div>
          <button className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
