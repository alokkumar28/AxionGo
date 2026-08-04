import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setItemsInMyCity } from "../redux/userSlice";
function useGetItemsByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);
  useEffect(() => {
    if (!currentCity) return;
    const fetchItems = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-by-city/${currentCity}`,
          {
            withCredentials: true,
          },
        );
        dispatch(setItemsInMyCity(result.data.items));
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    };
    fetchItems();
  }, [currentCity, dispatch]);
}

export default useGetItemsByCity;
