import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

// Initial state
const initialState = {
  captchaState: false,
};

// Actual Slice
export const captchaSlice = createSlice({
  name: "captcha",
  initialState,
  reducers: {

    // Action to set the authentication status
    setCaptchaState(state, action) {
      state.captchaState = action.payload;
    },

    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    extraReducers: {
      [HYDRATE]: (state, action) => {
        console.log('state', state)
        console.log('action', action)
        return {
          ...state,
          ...action.payload.captcha,
        };
      },
    },

  },
});

export const { setCaptchaState } = captchaSlice.actions;

export const selectCaptchaState = (state) => state.captcha.captchaState;

export default captchaSlice.reducer;