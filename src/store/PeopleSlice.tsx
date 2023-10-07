import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { People } from "../models/Model";

const initialState: People = {
  phoneNumber: "",
  email: "",
  houseNumber: "",
  idNumber: "",
  name: "",
  password: "",
  roadBlock: "",
  status: false,
  tagihan: {},
};

export const peopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {
    setPeople: (state, action: PayloadAction<People>) => {
      return { ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPeople } = peopleSlice.actions;

export default peopleSlice.reducer;
