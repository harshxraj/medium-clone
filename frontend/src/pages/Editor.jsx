import React, { createContext, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/Publish Blogs/BlogEditor";
import PublishForm from "../components/Publish Blogs/PublishForm";
import { useSelector } from "react-redux";

export const editorContext = createContext({});

const Editor = () => {
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const editorState = useSelector((store) => store.blogEditor.editorState);
  const access_token = useSelector((store) => store.auth.access_token);

  return (
    <editorContext.Provider value={{ textEditor, setTextEditor }}>
      {access_token === null ? (
        <Navigate to="/signin" />
      ) : editorState == "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </editorContext.Provider>
  );
};

export default Editor;
