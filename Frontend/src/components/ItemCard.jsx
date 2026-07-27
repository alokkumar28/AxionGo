import React from "react";
import { FaEdit, FaTrash, FaLeaf } from "react-icons/fa";
import { GiMeat } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

function ItemCard({ item }) {
    const navigate = useNavigate()
  return (
    <div className="group bg-white rounded-3xl border border-orange-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Food Name */}
        <h2 className="absolute bottom-4 left-4 text-white text-2xl font-bold">
          {item.name}
        </h2>
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={()=>navigate(`/edit-item/${item.id}`)}
            className="w-11 h-11 rounded-full bg-white text-orange-500 shadow-lg hover:bg-orange-500 hover:text-white transition"
          >
            <FaEdit className="mx-auto" />
          </button>
          <button
            className="w-11 h-11 rounded-full bg-white text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition"
          >
            <FaTrash className="mx-auto" />
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="p-5 space-y-5">
        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-gray-500 font-medium">Price</span>
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow">
            ₹{item.price}
          </span>
        </div>
        {/* Category */}
        <div className="flex items-center justify-between">
          <span className="text-gray-500 font-medium">Category</span>

          <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-semibold">
            {item.category}
          </span>
        </div>
        {/* Food Type */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Food Type</span>
          {item.foodType === "veg" ? (
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
              <FaLeaf />
              Veg
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
              <GiMeat />
              Non Veg
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ItemCard;
