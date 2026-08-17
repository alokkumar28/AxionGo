import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword';
import useGetCurrentUser from './hooks/useGetCurrentUser';
import {  useSelector } from 'react-redux';
import Home from './pages/Home';
import useGetCity from './hooks/useGetCity';
import useGetMyShop from './hooks/useGetMyShop';
import CreateEditShop from './pages/CreateEditShop';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import useGetShopByCity from './hooks/useGetShopsByCity';
import useGetItemsByCity from './hooks/useGetItemsByCity';
import CartPage from './pages/CartPage';
import CheckOut from './pages/CheckOut';
import OrderPlaced from './pages/OrderPlaced';
import MyOrders from './pages/MyOrders';
import useGetMyOrders from './hooks/useGetMyOrders';
import useUpdateLocation from './hooks/useUpdateLocation';
import TrackOrderPage from './pages/TrackOrderPage';
import ShopMenuPage from './pages/ShopMenuPage';
export const serverUrl="http://localhost:8000"
function App() {
  const {userData} = useSelector(state=>state.user)
  useGetCurrentUser();
  useGetCity()
  useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders();
  useUpdateLocation();

  return (
    <Routes>
      <Route path="/" element={userData?<Home/>:<Navigate to={"/signin"}/>} />
      <Route path="/signup" element={!userData?<SignUp/>:<Navigate to={"/"}/>} />
      <Route path="/signin" element={!userData?<SignIn/>:<Navigate to={"/"}/>} />
      <Route path="/forgot-password" element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>} />
      <Route path="/create-edit-shop" element={userData?<CreateEditShop/>:<Navigate to={"/signin"}/>}/>
      <Route path="/add-item" element={userData?<AddItem/>:<Navigate to={"/signin"}/>}/>
      <Route path="/edit-item/:itemId" element={userData?<EditItem/>:<Navigate to={"/signin"}/>}/>
      <Route path="/cart" element={userData?<CartPage/>:<Navigate to={"/signin"}/>}/>
      <Route path="/checkout" element={userData?<CheckOut/>:<Navigate to={"/signin"}/>}/>
      <Route path="/order-placed" element={userData?<OrderPlaced/>:<Navigate to={"/signin"}/>}/>
      <Route path="/my-orders" element={userData?<MyOrders/>:<Navigate to={"/signin"}/>}/>
      <Route path="/track-order/:orderId" element={userData?<TrackOrderPage/>:<Navigate to={"/signin"}/>}/>
      <Route path="/shop/:shopId" element={userData?<ShopMenuPage/>:<Navigate to={"/signin"}/>}/>
    </Routes>
  )
}

export default App
