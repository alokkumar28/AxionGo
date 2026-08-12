import React from "react";
import { useDispatch } from "react-redux";
import { FaPlus, FaMinus, FaTrash} from "react-icons/fa";
import { removeFromCart, updateQuantity } from "../redux/userSlice";
import { current } from "@reduxjs/toolkit";

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
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        <div className="w-full md:w-36 h-40 md:h-28 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
          <p className="mt-2 text-gray-600 font-medium">
            ₹{item.price} × {item.quantity}
          </p>
          <p className="mt-1 text-lg font-bold text-orange-600">
            ₹{totalPrice}
          </p>
        </div>
        <div className="flex md:flex-col items-center justify-between md:justify-center gap-4">
          <div className="flex items-center bg-orange-50 rounded-xl overflow-hidden border border-orange-200">
            <button
              onClick={() => handleDecrease(item._id, item.quantity)}
              className="w-10 h-10 flex items-center justify-center hover:bg-orange-100 transition"
            >
              <FaMinus className="text-sm text-orange-600" />
            </button>
            <div className="w-12 text-center font-bold text-lg">
              {item.quantity}
            </div>
            <button
                onClick={() =>
                    handleIncrease(item._id, item.quantity)
                }
              className="w-10 h-10 flex items-center justify-center hover:bg-orange-100 transition"
            >
              <FaPlus className="text-sm text-orange-600" />
            </button>
          </div>
          <button
            onClick={() => dispatch(removeFromCart(item._id))}
            className="w-11 h-11 rounded-full bg-red-100 hover:bg-red-500 hover:text-white text-red-600 transition flex items-center justify-center"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItemCard;
