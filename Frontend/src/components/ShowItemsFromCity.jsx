import React from "react";
import { useSelector } from "react-redux";
import ShowItemCard from "./ShowItemCard";

function ShowItemsFromCity() {
  const { itemsInMyCity } = useSelector((state) => state.user);
  if (!itemsInMyCity || itemsInMyCity.length === 0) {
    return null;
  }
  return (
    <section className="mt-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Discover More Near You
        </h2>
        <p className="mt-1 text-gray-500">
          Explore delicious dishes from restaurants in your city.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {itemsInMyCity.map((item) => (
          <ShowItemCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default ShowItemsFromCity;
