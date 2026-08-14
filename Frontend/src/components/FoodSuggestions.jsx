import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { categories } from "../foodSuggestions.js";

function FoodSuggestions({ selectedCategory, onCategorySelect }) {
  const foodScrollRef = useRef(null);
  const [foodScrollLeft, setFoodScrollLeft] = useState(false);
  const [foodScrollRight, setFoodScrollRight] = useState(false);
  const updateButton = () => {
    const element = foodScrollRef.current;
    if (!element) return;
    setFoodScrollLeft(element.scrollLeft > 0);
    setFoodScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 5,
    );
  };

  const scroll = (direction) => {
    if (!foodScrollRef.current) return;
    foodScrollRef.current.scrollBy({
      left:
        direction === "left"
          ? -foodScrollRef.current.clientWidth
          : foodScrollRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const element = foodScrollRef.current;
    if (!element) return;
    updateButton();
    element.addEventListener("scroll", updateButton);
    window.addEventListener("resize", updateButton);
    return () => {
      element.removeEventListener("scroll", updateButton);
      window.removeEventListener("resize", updateButton);
    };
  }, []);

  return (
    <section className="relative">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Popular Near You</h2>
        <p className="text-gray-500 mt-1">Explore food by category</p>
      </div>
      <div className="relative">
        {foodScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20
            w-12 h-12 rounded-full bg-white border shadow-lg
            items-center justify-center
            hover:bg-orange-500 hover:text-white transition"
          >
            <FaChevronLeft />
          </button>
        )}
        {foodScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20
            w-12 h-12 rounded-full bg-white border shadow-lg
            items-center justify-center
            hover:bg-orange-500 hover:text-white transition"
          >
            <FaChevronRight />
          </button>
        )}

        <div
          ref={foodScrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-3"
        >
          {categories.map((item) => {
            const isActive = selectedCategory === item.category;
            return (
              <button
                key={item.category}
                onClick={() => onCategorySelect(item.category)}
                className={`relative min-w-[250px] sm:min-w-[270px]
                  h-44 rounded-2xl overflow-hidden
                  border-2 transition-all duration-300
                  ${
                    isActive
                      ? "border-orange-500 shadow-xl scale-[1.02]"
                      : "border-transparent shadow-sm hover:shadow-xl"
                  }`}
              >
                <img
                  src={item.image}
                  alt={item.category}
                  className="w-full h-full object-cover
                  hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-xl font-bold text-white">
                    {item.category}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FoodSuggestions;
