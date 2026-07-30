import React, { useEffect, useRef, useState } from "react";
import FoodCard from "./FoodCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import suggestedFoods from "../foodSuggestions";

function FoodSuggestions() {
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
        <p className="text-gray-500 mt-1">
          Freshly prepared dishes from nearby restaurants
        </p>
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
          {suggestedFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FoodSuggestions;
