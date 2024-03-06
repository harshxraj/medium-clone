import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/Publish Blogs/BlogEditor";
import PublishForm from "../components/Publish Blogs/PublishForm";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/ui/Loader";
import axios from "axios";
import {
  resetBlogState,
  setBanner,
  setBlog,
  setDescription,
  setTags,
  setTile,
} from "../redux/blogEditorSlice";

export const editorContext = createContext({});

const Editor = () => {
  const [textEditor, setTextEditor] = useState({ isReady: false });
  // const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const editorState = useSelector((store) => store.blogEditor.editorState);
  const access_token = useSelector((store) => store.auth.access_token);
  const blogState = useSelector((store) => store.blogEditor);
  console.log(blogState);

  const { id: blog_id } = useParams();
  const disptach = useDispatch();

  useEffect(() => {
    if (!blog_id) {
      setLoading(false);
      return;
    }
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/blog`, {
        blog_id,
        draft: true,
        mode: "edit",
      })
      .then(({ data: { blog } }) => {
        console.log(blog);
        disptach(setBanner(blog.banner));
        disptach(setTile(blog.title));
        disptach(setBlog(blog));
        disptach(setTags(blog.tags));
        disptach(setDescription(blog.des));
        setLoading(false);
      })
      .catch((err) => {
        setBlog(null);
        setLoading(false);
      });

    return () => {
      disptach(resetBlogState());
    };
  }, []);

  return (
    <editorContext.Provider value={{ textEditor, setTextEditor }}>
      {access_token === null ? (
        <Navigate to="/signin" />
      ) : loading ? (
        <Loader />
      ) : editorState == "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </editorContext.Provider>
  );
};

export default Editor;
