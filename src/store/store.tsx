import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, createStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import initReducer from "./InitSlice";
import peopleReducer from "./PeopleSlice";
import paymentReducer from "./PaymentSlice";

const rootReducer = combineReducers({
  init: initReducer,
  people: peopleReducer,
  payment: paymentReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["init", "people"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
