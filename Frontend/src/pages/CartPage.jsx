import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import CartItemCard from "./CartItemCard";

function CartPage() {
  const navigate = useNavigate();

  const { cartItems, totalAmount } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-11 h-11 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 flex items-center justify-center transition"
          >
            <FaArrowLeft />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Cart</h1>
            <p className="text-gray-500 text-sm">
              Review your selected delicious meals.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-7 text-white mb-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <GiKnifeFork size={36} />
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                Welcome to AxionGo
              </h2>

              <p className="text-orange-100 mt-2 max-w-3xl">
                Fresh food, lightning-fast delivery and your favourite
                restaurants—all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800">
            Your Shopping Cart
          </h2>

          <p className="mt-2 text-gray-500">
            {cartItems.length === 0
              ? "Looks like your cart is waiting for its first delicious meal."
              : `You have ${cartItems.length} ${
                  cartItems.length === 1 ? "item" : "items"
                } ready for checkout.`}
          </p>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-orange-100 flex items-center justify-center mb-6">
              <FaShoppingCart className="text-5xl text-orange-500" />
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              Your Cart is Empty
            </h2>

            <p className="text-gray-500 mt-4 max-w-md text-center">
              Explore delicious meals and add your favourites to the cart.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Browse Food
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item._id}
                  item={item}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-28 h-fit">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-orange-500 px-6 py-5">
                  <h2 className="text-2xl font-bold text-white">
                    Order Summary
                  </h2>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="space-y-5">
                    <div className="flex justify-between text-gray-600">
                      <span>Items</span>
                      <span>{cartItems.length}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{totalAmount}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span className="font-semibold text-green-600">
                        FREE
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Taxes & Charges</span>
                      <span>₹0</span>
                    </div>

                    <hr />

                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total</span>

                      <span className="text-orange-600">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl text-lg font-bold transition"
                  >
                    Proceed to Checkout
                  </button>

                  <div className="mt-6 bg-orange-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">
                      ✅ Secure Payment
                    </p>

                    <p className="text-sm text-gray-600 mt-2">
                      🚚 Free Delivery
                    </p>

                    <p className="text-sm text-gray-600 mt-2">
                      🍽️ Freshly Prepared Food
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;