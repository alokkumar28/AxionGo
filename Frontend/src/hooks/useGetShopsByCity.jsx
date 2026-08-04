import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setShopsInMyCity } from "../redux/userSlice";

function useGetShopByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);
  useEffect(() => {
    if (!currentCity) return;
    const fetchShops = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-by-city/${currentCity}`,
          { withCredentials: true },
        );
        dispatch(setShopsInMyCity(result.data.shops));
        console.log(result.data.shops);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };
    fetchShops();
  }, [currentCity, dispatch]);
}

export default useGetShopByCity;
