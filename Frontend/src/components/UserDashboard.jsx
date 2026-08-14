import React, { useState } from "react";
import UserNav from "./UserNav";
import FoodSuggestions from "./FoodSuggestions";
import ShopSuggestions from "./ShopSuggestions";
import ShowItemsFromCity from "./ShowItemsFromCity";
import ShowSearchItems from "./ShowSearchItems";


function UserDashboard() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div>
      <UserNav
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSearchResults={setSearchResults}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {searchQuery.trim() && (
          <ShowSearchItems
            query={searchQuery}
            items={searchResults}
          />
        )}
        {!searchQuery.trim() && (
          <FoodSuggestions
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        )}
        <ShopSuggestions />
        <ShowItemsFromCity
          selectedCategory={selectedCategory}
          onClearCategory={() => setSelectedCategory(null)}
        />
      </div>
    </div>
  );
}

export default UserDashboard;
