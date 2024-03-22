import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  publishedBlogs: null,
  draftedBlogs: null,
};

const blogManagementSlice = createSlice({
  name: "blogManagement",
  initialState,
  reducers: {
    setPublishedBlogs(state, { payload }) {
      state.publishedBlogs = payload;
    },
    setDraftedBlogs(state, { payload }) {
      state.draftedBlogs = payload;
    },
  },
});

export const { setDraftedBlogs, setPublishedBlogs } =
  blogManagementSlice.actions;

export default blogManagementSlice.reducer;
