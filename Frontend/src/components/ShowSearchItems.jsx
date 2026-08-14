import React from "react";
import SearchItemCard from "./SearchItemCard";
import { FaSearch } from "react-icons/fa";

function ShowSearchItems({ query, items }) {
  return (
    <section className="mb-10">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
            <FaSearch className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172b4d]">
              Search Results
            </h2>
            <p className="text-gray-500 mt-1">Showing results for "{query}"</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <FaSearch className="mx-auto text-gray-300" size={35} />
          <h3 className="text-xl font-semibold text-gray-700 mt-4">
            No food found
          </h3>
          <p className="text-gray-500 mt-2">
            Try searching for another food or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {items.map((item) => (
            <SearchItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ShowSearchItems;
