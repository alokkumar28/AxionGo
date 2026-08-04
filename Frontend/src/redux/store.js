import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import ownerReducer from "./ownerSlice";
import mapReducer from "./mapSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    owner: ownerReducer,
    map: mapReducer,
  },
});