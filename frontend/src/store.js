import { configureStore } from "@reduxjs/toolkit";
import blogEditorSlice from "./redux/blogEditorSlice";
import authSlice from "./redux/authSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    blogEditor: blogEditorSlice,
  },
});

export default store;
