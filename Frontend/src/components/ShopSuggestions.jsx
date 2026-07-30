import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import ShopCard from "./ShopCard";

function ShopSuggestions() {
  const shopScrollRef = useRef(null);
  const { shopsInMyCity } = useSelector((state) => state.user);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const updateButtons = () => {
    const element = shopScrollRef.current;
    if (!element) return;
    setShowLeftButton(element.scrollLeft > 0);
    setShowRightButton(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 5,
    );
  };

  const scroll = (direction) => {
    const element = shopScrollRef.current;
    if (!element) return;
    element.scrollBy({
      left: direction === "left" ? -element.clientWidth : element.clientWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const element = shopScrollRef.current;
    if (!element) return;
    updateButtons();
    element.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);
    return () => {
      element.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(updateButtons);
  }, [shopsInMyCity]);

  return (
    <section className="relative">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Restaurants Near You
        </h2>
        <p className="mt-1 text-gray-500">
          Discover the best restaurants available in your city.
        </p>
      </div>
      <div className="relative">
        {showLeftButton && (
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20
              w-12 h-12 rounded-full border bg-white shadow-lg
              items-center justify-center
              hover:bg-orange-500 hover:text-white transition"
          >
            <FaChevronLeft />
          </button>
        )}
        {showRightButton && (
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20
              w-12 h-12 rounded-full border bg-white shadow-lg
              items-center justify-center
              hover:bg-orange-500 hover:text-white transition"
          >
            <FaChevronRight />
          </button>
        )}
        <div
          ref={shopScrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar pb-4"
        >
          {shopsInMyCity?.length > 0 ? (
            shopsInMyCity.map((shop) => (
              <ShopCard key={shop._id || shop.id} shop={shop} />
            ))
          ) : (
            <div className="w-full py-10 text-center text-gray-500">
              No restaurants available in your city.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ShopSuggestions;
