import { createSlice } from "@reduxjs/toolkit";
import { set } from "firebase/database";
import { add } from "firebase/firestore/pipelines";
export const mapSlice = createSlice({
  name: "map",
  initialState: {
    location: {
      latitude: null,
      longitude: null,
    },
    address: null,
  },
  reducers: {
    setLocation: (state, action) => {
      state.location.latitude = action.payload.latitude;
      state.location.longitude = action.payload.longitude;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const { setLocation, setAddress } = mapSlice.actions;
export default mapSlice.reducer;
