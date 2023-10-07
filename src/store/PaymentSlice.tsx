import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BankType, PaymentState } from "../models/Model";

const initialState: PaymentState = {
  paymentMethod: "",
};

export const initSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentMethod: (state, action: PayloadAction<BankType>) => {
      return { ...state, paymentMethod: action.payload };
    },
  },
});

export const { setPaymentMethod } = initSlice.actions;

export default initSlice.reducer;
