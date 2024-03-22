import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  _id: "",
  title: "",
  des: "",
  content: [],
  tags: [],
  comments: {
    results: [],
  },
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
  blog_id: null,
  activity: {},
  isLikedByUser: "",
  commentWrapper: false,
  totalParentCommentsLoaded: 0,
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
        comments,
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
      state.comments = comments;
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
    setTotalParentCommentsLoaded: (state, { payload }) => {
      state.totalParentCommentsLoaded =
        state.totalParentCommentsLoaded + payload;
    },
    toggleCommentWrapper: (state) => {
      state.commentWrapper = !state.commentWrapper;
    },
    setComments: (state, { payload }) => {
      state.comments = { ...state.comments, results: payload };
    },
    updateComments: (state, { payload }) => {
      state.comments = payload;
    },
    setActivity: (state, { payload }) => {
      state.activity = {
        ...state.activity,
        total_comments: state.activity.total_comments + 1,
        total_parent_comments: state.activity.total_parent_comments + payload,
      };
    },
    setIsReplyLoaded: (state, action) => {
      const { index, isLoaded } = action.payload;
      console.log("GETTING", index, isLoaded, state);
      state.comments.results[index].isReplyLoaded = isLoaded;
      console.log("Ager", state);
    },
    makeReplyLoadedFalse: (state, { payload }) => {
      console.log(state.comments.results[payload].isReplyLoaded);
      state.comments.results[payload].isReplyLoaded = false;
      console.log(state.comments.results[payload].isReplyLoaded);
    },

    setCommentsResults: (state, { payload }) => {
      state.comments.results = payload;
      console.log("AFTER", state);
    },
  },
});

export const {
  setSelectedBlog,
  resetSelectedBlog,
  toggleLikedByUser,
  setLike,
  setUserLiked,
  setTotalParentCommentsLoaded,
  toggleCommentWrapper,
  setComments,
  updateComments,
  setActivity,
  setIsReplyLoaded,
  setCommentsResults,
  makeReplyLoadedFalse,
} = selectedBlogSlice.actions;
export default selectedBlogSlice.reducer;
