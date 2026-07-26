import React from "react";
import { Link } from "react-router-dom";
import { FaStore, FaArrowRight } from "react-icons/fa";

function RegisterShopCard() {
  return (
    <div className="w-full flex justify-center px-4 py-10">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl">

        {/* Background Glow */}
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-orange-200 blur-3xl opacity-30"></div>
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-red-200 blur-3xl opacity-30"></div>

        <div className="relative flex flex-col items-center px-8 py-14 text-center">

          {/* Icon */}

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 shadow-xl">
            <FaStore className="text-4xl text-white" />
          </div>

          {/* Heading */}

          <h1 className="mt-8 text-3xl md:text-4xl font-extrabold text-gray-800">
            Start Selling with
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {" "}AxionGo
            </span>
          </h1>

          {/* Description */}

          <p className="mt-5 max-w-3xl text-gray-600 text-base md:text-lg leading-8">
            Register your shop today and become part of a growing food
            delivery network trusted by thousands of hungry customers.
            Showcase your delicious menu, receive orders in real time,
            increase your daily sales, and grow your business with the
            power of AxionGo.
          </p>

          {/* Features */}

          <div className="mt-8 flex flex-wrap justify-center gap-3">

            <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
              🚀 Reach More Customers
            </span>

            <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
              📦 Real-Time Orders
            </span>

            <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
              💰 Increase Revenue
            </span>

            <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
              ⭐ Build Your Brand
            </span>

          </div>

          {/* Button */}

          <Link
            to="/owner/register-shop"
            className="group mt-10 flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Get Started

            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Bottom Text */}

          <p className="mt-5 text-sm text-gray-500">
            It only takes a few minutes to register your shop.
          </p>

        </div>
      </div>
    </div>
  );
}

export default RegisterShopCard;