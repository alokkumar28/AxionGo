import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import CartItemCard from "./CartItemCard";

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const totalAmountWithDelivery = totalAmount + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 flex items-center justify-center shrink-0 transition">
            <FaArrowLeft className="text-sm" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-[#172b4d] leading-tight">My Cart</h1>
            <p className="text-xs sm:text-sm text-gray-500 truncate">Review your selected delicious meals.</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl px-4 py-4 sm:px-5 sm:py-5 mb-6 sm:mb-7">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <GiKnifeFork className="text-xl sm:text-2xl text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white">Welcome to AxionGo</h2>
              <p className="text-xs sm:text-sm text-orange-100 mt-0.5 leading-5">Fresh food, fast delivery and your favourite restaurants—all in one place.</p>
            </div>
          </div>
        </section>

        <section className="mb-5 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#172b4d]">Your Shopping Cart</h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">{cartItems.length === 0 ? "Looks like your cart is waiting for its first delicious meal." : `You have ${cartItems.length} ${cartItems.length === 1 ? "item" : "items"} ready for checkout.`}</p>
        </section>

        {cartItems.length === 0 ? (
          <section className="bg-white border border-gray-200 rounded-2xl p-7 sm:p-9 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <FaShoppingCart className="text-2xl sm:text-3xl text-orange-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-sm mx-auto">Explore delicious meals and add your favourites to the cart.</p>
            <button onClick={() => navigate("/")} className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">Browse Food</button>
          </section>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-start">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cartItems.map((item) => <CartItemCard key={item._id} item={item} />)}
            </div>

            <div className="lg:sticky lg:top-20 h-fit">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-orange-500 px-4 py-3">
                  <h2 className="text-lg sm:text-xl font-bold text-white">Order Summary</h2>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm text-gray-600"><span>Items</span><span>{cartItems.length}</span></div>
                    <div className="flex justify-between items-center text-sm text-gray-600"><span>Subtotal</span><span>₹{totalAmount}</span></div>
                    <div className="flex justify-between items-center text-sm text-gray-600"><span>Delivery Fee</span><span className="font-semibold text-green-600">{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span></div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Total</span>
                        <span className="text-xl font-bold text-orange-600">₹{totalAmountWithDelivery.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => navigate("/checkout")} className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm sm:text-base font-bold transition">Proceed to Checkout</button>

                  <div className="mt-4 bg-orange-50 rounded-xl px-3 py-3">
                    <p className="text-xs sm:text-sm text-gray-600">✓ Secure Payment</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1.5">✓ Free Delivery</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1.5">✓ Freshly Prepared Food</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default CartPage;