import React from 'react'
import UserNav from './UserNav';
import FoodSuggestions from './FoodSuggestions';
import ShopSuggestions from './ShopSuggestions';
import ShowItemsFromCity from './ShowItemsFromCity';

function UserDashboard() {
  return (
    <div>
      <UserNav/>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <FoodSuggestions />
        <ShopSuggestions/>
        <ShowItemsFromCity/>
      </div>
    </div>
  )
}

export default UserDashboard
