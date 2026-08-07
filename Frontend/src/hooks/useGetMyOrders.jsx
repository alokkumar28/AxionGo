import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/userSlice";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/order/my-orders`,
          {
            withCredentials: true,
          }
        );
        console.log(result.data);
        dispatch(setMyOrders(result.data.orders));
      } catch (error) {
        console.log(
          error.response?.data?.message || error.message
        );
      }
    };
    
    if (userData) {
      fetchOrders();
    }
  }, [dispatch, userData]);
}

export default useGetMyOrders;