import React from "react";
import { FaMapMarkerAlt, FaUtensils } from "react-icons/fa";
function ShopCard({ shop }) {
  return (
    <div className="min-w-[320px] max-w-[320px] bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="h-52 overflow-hidden">
        <img
          src={shop.image}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 truncate">
          {shop.name}
        </h3>
        <div className="flex items-center mt-3 text-gray-500 text-sm">
          <FaMapMarkerAlt className="text-orange-500 mr-2" />
          <span className="truncate">{shop.city}</span>
        </div>
        <div className="flex items-center mt-2 text-gray-500 text-sm">
          <FaUtensils className="text-orange-500 mr-2" />
          <span>{shop.items?.length || 0} Items</span>
        </div>
        <button className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition">
          View Menu
        </button>
      </div>
    </div>
  );
}

export default ShopCard;
