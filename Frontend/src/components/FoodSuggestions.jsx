import React, { useRef } from "react";
import FoodCard from "./FoodCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import suggestedFoods from "../category";
function FoodSuggestions() {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Popular Near You</h2>
          <p className="text-gray-500 mt-1">
            Freshly prepared dishes from nearby restaurants
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scroll("left")}
            className="w-11 h-11 rounded-full border bg-white hover:bg-orange-500 hover:text-white transition shadow"
          >
            <FaChevronLeft className="mx-auto" />
          </button>
          <button
            onClick={() => scroll("right")}
           className="w-11 h-11 rounded-full border bg-white hover:bg-orange-500 hover:text-white transition shadow"
          >
            <FaChevronRight className="mx-auto" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-3 no-scrollbar"
      >
        {suggestedFoods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </section>
  );
}

export default FoodSuggestions;
