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
    showRepliesForComment: (state, { payload }) => {
      const { parentId, replies } = payload;
      const comments = state.comments.results;
      const parentIndex = comments.findIndex(
        (comment) => comment._id === parentId
      );

      if (parentIndex === -1) return;

      const parentLevel = comments[parentIndex].childrenLevel;

      while (
        comments[parentIndex + 1] &&
        comments[parentIndex + 1].childrenLevel > parentLevel
      ) {
        comments.splice(parentIndex + 1, 1);
      }

      comments[parentIndex].isReplyLoaded = true;
      comments.splice(
        parentIndex + 1,
        0,
        ...replies.map((reply) => ({
          ...reply,
          childrenLevel: parentLevel + 1,
        }))
      );
    },
    hideRepliesForComment: (state, { payload }) => {
      const { parentId } = payload;
      const comments = state.comments.results;
      const parentIndex = comments.findIndex(
        (comment) => comment._id === parentId
      );

      if (parentIndex === -1) return;

      const parentLevel = comments[parentIndex].childrenLevel;
      comments[parentIndex].isReplyLoaded = false;

      while (
        comments[parentIndex + 1] &&
        comments[parentIndex + 1].childrenLevel > parentLevel
      ) {
        comments.splice(parentIndex + 1, 1);
      }
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
  showRepliesForComment,
  hideRepliesForComment,
} = selectedBlogSlice.actions;
export default selectedBlogSlice.reducer;
