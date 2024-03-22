import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blog_id: "",
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
  editorState: "editor",
};

const blogEditorSlice = createSlice({
  name: "blogEditor",
  initialState,
  reducers: {
    setBanner: (state, { payload }) => {
      state.banner = payload;
    },
    setTile: (state, { payload }) => {
      state.title = payload;
    },
    setDescription: (state, { payload }) => {
      state.des = payload;
    },
    setEditorState: (state, { payload }) => {
      state.editorState = payload;
    },
    setBlog: (state, { payload }) => {
      state.content = payload;
    },
    setTags: (state, { payload }) => {
      // If payload is a string, adding the tag
      if (typeof payload == "string") {
        state.tags = [...state.tags, payload];
      } else if (Array.isArray(payload)) {
        // If payload is an array, replace tags with the new array (using while deleting the tag)
        state.tags = payload;
      }
    },
    resetBlogState: () => initialState,
  },
});

export const {
  setBanner,
  setTile,
  setEditorState,
  setBlog,
  setDescription,
  setTags,
  resetBlogState,
} = blogEditorSlice.actions;
export default blogEditorSlice.reducer;
