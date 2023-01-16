import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

// Initial state
const initialState = {
  subscriptionStatusState: {
    freeTrial: '',
    subscription: ''
  },
};

// Actual Slice
export const subscriptionStatusSlice = createSlice({
  name: "subscriptionStatus",
  initialState,
  reducers: {

    // Action to set the authentication status
    setSubscriptionStatusState(state, action) {
      state.subscriptionStatusState = action.payload;
    },

    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    extraReducers: {
      [HYDRATE]: (state, action) => {
        return {
          ...state,
          ...action.payload.subscriptionStatus,
        };
      },
    },

  },
});

export const { setSubscriptionStatusState } = subscriptionStatusSlice.actions;

export const selectSubscriptionStatusState = (state) => state.subscriptionStatus.subscriptionStatusState;

export default subscriptionStatusSlice.reducer;