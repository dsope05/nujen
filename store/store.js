import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { captchaSlice } from "./captchaSlice";
import { createWrapper } from "next-redux-wrapper";

const makeStore = () =>
  configureStore({
    reducer: {
      [captchaSlice.name]: captchaSlice.reducer,
    },
    devTools: true,
  });

export const wrapper = createWrapper(makeStore);