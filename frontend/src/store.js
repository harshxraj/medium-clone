import { configureStore } from "@reduxjs/toolkit";
import blogEditorSlice from "./redux/blogEditorSlice";

const store = configureStore({
  reducer: {
    blogEditor: blogEditorSlice,
  },
});

export default store;
