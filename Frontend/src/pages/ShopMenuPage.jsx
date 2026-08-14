import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { serverUrl } from "../App";
import ShowItemCard from "../components/ShowItemCard";
import UserNav from "../components/UserNav";

function ShopMenuPage() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getShopItems = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`${serverUrl}/api/item/get-items-by-shop/${shopId}`, { withCredentials: true });
      console.log("SHOP MENU:", result.data);
      setShop(result.data.shop);
      setItems(result.data.items || []);
    } catch (error) {
      console.log("GET SHOP MENU ERROR:", error.response?.data?.message || error.message);
      setShop(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getShopItems();
  }, [shopId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNav />
        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-5 sm:py-7">
          <div className="animate-pulse">
            <div className="h-9 w-20 bg-gray-200 rounded-xl mb-5" />
            <section className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="lg:flex">
                <div className="w-full h-40 sm:h-48 lg:w-[45%] lg:h-52 bg-gray-200" />
                <div className="flex-1 p-4 sm:p-5 lg:p-6">
                  <div className="h-7 bg-gray-200 rounded w-48 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-full max-w-md mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>
            </section>
            <section className="mt-8">
              <div className="mb-5">
                <div className="h-8 bg-gray-200 rounded w-28 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-64" />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-white rounded-xl overflow-hidden border border-gray-200">
                    <div className="h-24 sm:h-28 lg:h-32 bg-gray-200" />
                    <div className="p-2.5 space-y-2">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-10" />
                        <div className="h-6 bg-gray-200 rounded w-12" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNav />
        <main className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 sm:px-7 py-8 text-center bg-orange-50">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <GiKnifeFork className="text-orange-500 text-3xl" />
                </div>
                <h2 className="mt-5 text-2xl font-bold text-[#172b4d]">Restaurant Not Found</h2>
                <p className="mt-2 text-sm text-gray-500 leading-6">This restaurant may no longer be available or the link you followed may be incorrect.</p>
              </div>
              <div className="p-5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => navigate(-1)} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-orange-200 bg-white text-gray-700 text-sm font-semibold hover:bg-orange-50 hover:text-orange-500 transition">
                    <FaArrowLeft className="text-xs" />
                    Go Back
                  </button>
                  <button onClick={() => navigate("/")} className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition">
                    Explore Restaurants
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNav />
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-5 sm:py-7">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 mb-5 px-3.5 py-2 rounded-xl border border-orange-200 bg-white text-gray-700 text-sm font-semibold hover:bg-orange-50 hover:text-orange-500 transition">
          <FaArrowLeft className="text-xs" />
          Back
        </button>

        <section className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="lg:flex">
            <div className="relative w-full h-40 sm:h-48 md:h-52 lg:w-[45%] lg:h-56 shrink-0 overflow-hidden">
              <img src={shop.image} alt={shop.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>

            <div className="flex flex-col justify-center p-4 sm:p-5 lg:p-6 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#172b4d] truncate">{shop.name}</h1>

              <div className="flex items-start gap-2 mt-3 text-gray-500">
                <FaMapMarkerAlt className="text-orange-500 text-sm mt-1 shrink-0" />
                <span className="text-xs sm:text-sm leading-5 line-clamp-2">{shop.address || shop.city}</span>
              </div>

              <div className="flex items-center gap-2 mt-2 text-gray-500">
                <GiKnifeFork className="text-orange-500 text-sm shrink-0" />
                <span className="text-xs sm:text-sm">{items.length} Items</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 sm:mt-10">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172b4d]">Menu</h2>
            <p className="mt-1 text-sm sm:text-base text-gray-500">Explore delicious food from {shop.name}</p>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 px-5 py-12 text-center">
              <GiKnifeFork className="mx-auto text-gray-300 text-4xl" />
              <h3 className="text-lg font-semibold text-gray-700 mt-4">No food items available</h3>
              <p className="text-gray-500 text-sm mt-2">This restaurant has no available items right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {items.map((item) => (
                <ShowItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ShopMenuPage;