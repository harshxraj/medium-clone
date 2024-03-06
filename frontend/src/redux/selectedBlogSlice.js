import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  _id: "",
  title: "",
  des: "",
  content: [],
  tags: [],
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
  blog_id: null,
  activity: {},
  isLikedByUser: "",
};
const selectedBlogSlice = createSlice({
  name: "selectedBlog",
  initialState,
  reducers: {
    setSelectedBlog: (state, { payload }) => {
      const {
        _id,
        title,
        des,
        content,
        tags,
        author,
        banner,
        publishedAt,
        blog_id,
        activity,
      } = payload;

      state._id = _id;
      state.title = title;
      state.des = des;
      state.content = content;
      state.tags = tags;
      state.author = author;
      state.banner = banner;
      state.publishedAt = publishedAt;
      state.blog_id = blog_id;
      state.activity = activity;
    },
    resetSelectedBlog: (state) => {
      Object.assign(state, initialState);
    },
    setLike: (state, { payload }) => {
      state.activity.total_likes = payload;
    },
    toggleLikedByUser: (state) => {
      state.isLikedByUser = !state.isLikedByUser;
    },
    setUserLiked: (state, { payload }) => {
      state.isLikedByUser = payload;
    },
  },
});

export const {
  setSelectedBlog,
  resetSelectedBlog,
  toggleLikedByUser,
  setLike,
  setUserLiked,
} = selectedBlogSlice.actions;
export default selectedBlogSlice.reducer;
