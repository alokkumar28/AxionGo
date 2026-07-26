import React from 'react'
import UserDashboard from '../components/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from '../components/DeliveryBoy'
import { useSelector } from 'react-redux'

function Home() {
    const {userData} = useSelector(state=>state.user)
  return (
    <div>
      {userData.role=="User" && <UserDashboard/>}
      {userData.role=="Owner" && <OwnerDashboard/>}
      {userData.role=="Delivery Boy" && <DeliveryBoy/>}
    </div>
  )
}

export default Home
