import { combineReducers, configureStore } from "@reduxjs/toolkit";
import positionReducer from "./feature/positions";
export const store = () => {
  return configureStore({
    reducer: { positionReducer },
  });
};
export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
