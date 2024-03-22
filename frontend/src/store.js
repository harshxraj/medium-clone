import { configureStore } from "@reduxjs/toolkit";
import blogEditorSlice from "./redux/blogEditorSlice";
import authSlice from "./redux/authSlice";
import selectedBlogSlice from "./redux/selectedBlogSlice";
import similarBlogSlice from "./redux/similarBlogSlice";
import blogManagementSlice from "./redux/blogManagementSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    blogEditor: blogEditorSlice,
    selectedBlog: selectedBlogSlice,
    similarBlog: similarBlogSlice,
    blogManagement: blogManagementSlice,
  },
});

export default store;
