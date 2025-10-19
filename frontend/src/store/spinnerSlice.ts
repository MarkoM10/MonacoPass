import { createSlice } from "@reduxjs/toolkit";

interface ISpinner {
  toggleSpinner: boolean;
}

const initialState: ISpinner = {
  toggleSpinner: false,
};

const spinnerSlice = createSlice({
  name: "spinner",
  initialState,
  reducers: {
    showSpinner: (state) => {
      state.toggleSpinner = true;
    },
    hideSpinner: (state) => {
      state.toggleSpinner = false;
    },
  },
});

export const { showSpinner, hideSpinner } = spinnerSlice.actions;
export default spinnerSlice.reducer;
