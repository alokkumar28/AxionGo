import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from "../redux/userSlice";

function useGetCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const apiKey = import.meta.env.VITE_GEO_API_KEY;
      const lattitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lattitude}&lon=${longitude}&apiKey=${apiKey}`,
      );
      dispatch(setCurrentCity(result.data.features[0].properties.city));
      dispatch(setCurrentState(result.data.features[0].properties.state));
      dispatch(setCurrentAddress(result.data.features[0].properties.address_line2 || result.data.features[0].properties.address_line1));
    });
  }, [userData]);
}

export default useGetCity;