import axios from "axios";
import React from "react";
import { FaEdit, FaTrash, FaLeaf } from "react-icons/fa";
import { GiMeat } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";

function ItemCard({ item, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${serverUrl}/api/item/delete-item/${item._id}`,
        {
          withCredentials: true,
        },
      );

      onDelete(data.shop);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300">

      <div className="relative h-40 sm:h-44 md:h-48 lg:h-52 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        <h2 className="absolute bottom-3 left-3 right-3 text-white text-base sm:text-lg lg:text-xl font-bold leading-tight line-clamp-2">
          {item.name}
        </h2>

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/edit-item/${item._id}`)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-orange-500 shadow-sm hover:bg-orange-500 hover:text-white flex items-center justify-center transition-all duration-200"
            aria-label="Edit item"
          >
            <FaEdit className="text-xs sm:text-sm" />
          </button>

          <button
            onClick={handleDelete}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-red-500 shadow-sm hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-200"
            aria-label="Delete item"
          >
            <FaTrash className="text-xs sm:text-sm" />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-3.5">

        <div className="flex items-center justify-between gap-2 py-1.5">
          <span className="text-[11px] sm:text-xs text-gray-500">
            Price
          </span>

          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 sm:px-3 py-1 rounded-lg font-bold text-xs sm:text-sm">
            ₹{item.price}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 py-1.5">
          <span className="text-[11px] sm:text-xs text-gray-500">
            Category
          </span>

          <span className="bg-orange-50 border border-orange-100 text-orange-600 px-2.5 sm:px-3 py-1 rounded-lg font-semibold text-[10px] sm:text-xs max-w-[65%] truncate">
            {item.category}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 py-1.5">
          <span className="text-[11px] sm:text-xs text-gray-500">
            Food Type
          </span>

          {item.foodType === "veg" ? (
            <div className="flex items-center gap-1 bg-green-50 border border-green-100 text-green-700 px-2.5 sm:px-3 py-1 rounded-full font-semibold text-[10px] sm:text-xs">
              <FaLeaf className="text-[9px] sm:text-[10px]" />
              Veg
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-red-50 border border-red-100 text-red-600 px-2.5 sm:px-3 py-1 rounded-full font-semibold text-[10px] sm:text-xs">
              <GiMeat className="text-[9px] sm:text-[10px]" />
              Non Veg
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ItemCard;