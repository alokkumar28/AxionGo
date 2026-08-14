import React from "react";
import { useSelector } from "react-redux";
import ShowItemCard from "./ShowItemCard";

function ShowItemsFromCity({ selectedCategory, onClearCategory }) {
  const { itemsInMyCity } = useSelector((state) => state.user);

  if (!itemsInMyCity || itemsInMyCity.length === 0) {
    return null;
  }

  const filteredItems = !selectedCategory || selectedCategory === "All" ? itemsInMyCity : itemsInMyCity.filter((item) => item.category === selectedCategory);

  return (
    <section className="mt-8 sm:mt-10 lg:mt-12">
      <div className="mb-5 sm:mb-6 lg:mb-7 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate">
            {selectedCategory && selectedCategory !== "All" ? `${selectedCategory} Near You` : "Discover More Near You"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm lg:text-base text-gray-500 truncate">
            {selectedCategory && selectedCategory !== "All" ? `Showing ${selectedCategory.toLowerCase()} available near you.` : "Explore delicious dishes from restaurants in your city."}
          </p>
        </div>

        {selectedCategory && selectedCategory !== "All" && (
          <button onClick={onClearCategory} className="shrink-0 text-xs sm:text-sm font-semibold text-orange-500 hover:text-orange-600">
            Clear
          </button>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">No {selectedCategory} items found</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">There are no {selectedCategory.toLowerCase()} items available near you right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-5">
          {filteredItems.map((item) => (
            <ShowItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ShowItemsFromCity;