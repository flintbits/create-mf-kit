import { configureStore } from "@reduxjs/toolkit";
import counterReducer, { increment, decrement } from "./counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export { increment, decrement };
