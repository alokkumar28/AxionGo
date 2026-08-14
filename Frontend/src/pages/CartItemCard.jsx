import React from "react";
import { useDispatch } from "react-redux";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { removeFromCart, updateQuantity } from "../redux/userSlice";

function CartItemCard({ item }) {
  const dispatch = useDispatch();
  const totalPrice = item.price * item.quantity;

  const handleIncrease = (id, currentQuantity) => {
    dispatch(updateQuantity({ id, quantity: currentQuantity + 1 }));
  };

  const handleDecrease = (id, currentQuantity) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ id, quantity: currentQuantity - 1 }));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-20 h-20 sm:w-28 sm:h-24 md:w-32 md:h-24 flex-shrink-0 overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 truncate">{item.name}</h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
          <p className="mt-1 text-sm sm:text-base font-bold text-orange-600">₹{totalPrice}</p>
        </div>

        <div className="flex flex-col items-end justify-center gap-2 flex-shrink-0">
          <div className="flex items-center bg-orange-50 rounded-lg overflow-hidden border border-orange-200">
            <button onClick={() => handleDecrease(item._id, item.quantity)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-orange-100 transition">
              <FaMinus className="text-[9px] sm:text-[10px] text-orange-600" />
            </button>
            <div className="w-7 sm:w-8 text-center text-xs sm:text-sm font-bold text-gray-800">{item.quantity}</div>
            <button onClick={() => handleIncrease(item._id, item.quantity)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-orange-100 transition">
              <FaPlus className="text-[9px] sm:text-[10px] text-orange-600" />
            </button>
          </div>

          <button onClick={() => dispatch(removeFromCart(item._id))} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 hover:bg-red-500 hover:text-white text-red-500 transition flex items-center justify-center">
            <FaTrash className="text-[10px] sm:text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItemCard;