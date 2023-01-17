import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { captchaSlice } from "./captchaSlice";
import { formDataSlice } from "./formDataSlice";
import { subscriptionStatusSlice } from "./subscriptionStatusSlice";
import { createWrapper } from "next-redux-wrapper";

const makeStore = () =>
  configureStore({
    reducer: {
      [captchaSlice.name]: captchaSlice.reducer,
      [formDataSlice.name]: formDataSlice.reducer,
      [subscriptionStatusSlice.name]: subscriptionStatusSlice.reducer,
    },
    devTools: true,
  });

export const wrapper = createWrapper(makeStore);