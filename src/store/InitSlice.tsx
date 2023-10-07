import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initSlice = createSlice({
  name: "init",
  initialState: {
    isFreshInstall: true,
    isLogin: false,
  },
  reducers: {
    falseFreshInstall: (state) => {
      return { ...state, isFreshInstall: false };
    },
    setLogin: (state, action: PayloadAction<boolean>) => {
      return { ...state, isLogin: action.payload };
    },
  },
});

export const { falseFreshInstall, setLogin } = initSlice.actions;

export default initSlice.reducer;
