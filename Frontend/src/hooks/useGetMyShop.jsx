import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

function useGetMyShop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-my-shop`,
          { withCredentials: true }
        );
        dispatch(setMyShopData(result.data.user));
      } catch (error) {
        console.log(
          error.response?.data?.message || error.message
        );
      }
    };
    fetchShop();
  }, [userData, dispatch]);
}

export default useGetMyShop;