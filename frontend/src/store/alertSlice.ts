import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAlert {
  show: boolean;
  success: boolean;
  message: string;
}

const initialState: IAlert = {
  show: false,
  success: false,
  message: "",
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlert: (
      state,
      action: PayloadAction<{ success: boolean; message: string }>
    ) => {
      state.show = true;
      state.success = action.payload.success;
      state.message = action.payload.message;
    },
    hideAlert: (state) => {
      state.show = false;
      state.success = false;
      state.message = "";
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;
