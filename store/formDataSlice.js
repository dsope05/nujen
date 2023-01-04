import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

// Initial state
const initialState = {
  formData: {},
};

// Actual Slice
export const formDataSlice = createSlice({
  name: "formData",
  initialState,
  reducers: {

    // Action to set the authentication status
    setFormDataState(state, action) {
      state.formDataState = action.payload;
    },

    // Special reducer for hydrating the state. Special case for next-redux-wrapper
    extraReducers: {
      [HYDRATE]: (state, action) => {
        return {
          ...state,
          ...action.payload.formData,
        };
      },
    },

  },
});

export const { setFormDataState } = formDataSlice.actions;

export const selectFormDataState = (state) => state.formData.formDataState;

export default formDataSlice.reducer;