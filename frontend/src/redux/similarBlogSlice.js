import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  blogs: [],
};
const selectedBlogSlice = createSlice({
  name: "similarBlog",
  initialState,
  reducers: {
    setSimilarBlog: (state, { payload }) => {
      state.blogs = payload;
    },
    resetSimilarBlog: (state) => {
      state.blogs = [];
    },
  },
});

export const { setSimilarBlog, resetSimilarBlog } = selectedBlogSlice.actions;
export default selectedBlogSlice.reducer;
