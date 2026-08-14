import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaUtensils } from "react-icons/fa";

function ShopCard({ shop }) {
  const navigate = useNavigate();

  return (
    <div className="min-w-[210px] sm:min-w-[220px] md:min-w-[230px] max-w-[230px] bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="h-28 sm:h-30 md:h-32 overflow-hidden">
        <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>

      <div className="p-2.5 sm:p-3">
        <h3 className="text-sm sm:text-base font-bold text-[#172b4d] truncate">{shop.name}</h3>

        <div className="flex items-center gap-1.5 mt-2 text-gray-500">
          <FaMapMarkerAlt className="text-orange-500 text-xs shrink-0" />
          <span className="text-[10px] sm:text-xs truncate">{shop.city}</span>
        </div>

        <div className="flex items-center gap-1.5 mt-1.5 text-gray-500">
          <FaUtensils className="text-orange-500 text-xs shrink-0" />
          <span className="text-[10px] sm:text-xs">{shop.items?.length || 0} Items</span>
        </div>

        <button onClick={() => navigate(`/shop/${shop._id}`)} className="w-full mt-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1.5 rounded-lg text-[10px] sm:text-xs transition">
          View Menu
        </button>
      </div>
    </div>
  );
}

export default ShopCard;