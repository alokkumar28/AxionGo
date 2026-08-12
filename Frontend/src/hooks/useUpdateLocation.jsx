import { useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";

function useUpdateLocation() {
  const { userData } = useSelector((state) => state.user);
  const lastLocation = useRef(null);
  const lastUpdateTime = useRef(0);
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  useEffect(() => {
    if (!userData) return;
    const updateLocation = async (latitude, longitude) => {
      try {
        await axios.post(
          `${serverUrl}/api/user/update-location`,
          {
            latitude,
            longitude,
          },
          {
            withCredentials: true,
          },
        );
        console.log(userData.location.coordinates)
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const now = Date.now();
        if (!lastLocation.current) {
          lastLocation.current = { latitude, longitude };
          lastUpdateTime.current = now;
          await updateLocation(latitude, longitude);
          return;
        }
        const distance = getDistance(
          lastLocation.current.latitude,
          lastLocation.current.longitude,
          latitude,
          longitude,
        );
        if (distance >= 30 && now - lastUpdateTime.current >= 15000) {
          lastLocation.current = { latitude, longitude };
          lastUpdateTime.current = now;
          await updateLocation(latitude, longitude);
        }
      },
      (error) => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [userData]);
}

export default useUpdateLocation;
