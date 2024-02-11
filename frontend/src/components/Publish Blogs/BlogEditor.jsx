import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../imgs/logo.png";
import AnimationWrapper from "../../common/Page-animation";
import defaultBanner from "../../imgs/blog banner.png";
import { useDispatch, useSelector } from "react-redux";
import {
  setBanner,
  setBlog,
  setEditorState,
  setTile,
} from "../../redux/blogEditorSlice";
import EditorJS from "@editorjs/editorjs";
import { tools } from "../../utils/tools";
import { toast, Toaster } from "react-hot-toast";
import { editorContext } from "../../pages/Editor";

const BlogEditor = () => {
  const dispatch = useDispatch();
  const blogEditor = useSelector((store) => store.blogEditor);
  const { title, banner, des, content } = blogEditor;
  // console.log(title, banner, des);
  console.log(content);

  const { textEditor, setTextEditor } = useContext(editorContext);

  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holderId: "textEditor",
        data: content,
        tools: tools,
        placeholder: "Let's Write something awesome!",
      })
    );
  }, []);

  const handleImageChange = async (event) => {
    try {
      let x = toast.loading("Uploading image...");
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "blogapp");
      formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          dispatch(setBanner(data.secure_url));
          console.log(data.secure_url);
          toast.dismiss(x);
          toast.success("Image uploaded!");
        });

      // const response = await axios.post("http://localhost:3000/url", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      // console.log("Upload successful:", response.data);
      // Handle response data as needed
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handleTilteChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    dispatch(setTile(input.value));
  };

  const handlePublish = () => {
    // if (!blogEditor.banner) {
    //   return toast.error("Upload a blog banner to publish it!");
    // }
    // if (!title.length) {
    //   return toast.error("Enter blog title to publish it!");
    // }
    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          // console.log(data);
          if (data.blocks.length) {
            dispatch(setBlog(data));
            dispatch(setEditorState("publish"));
          } else {
            return toast.error("Write something in the blog to publish it");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <Toaster />
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {blogEditor.title == "" ? "New Blog" : blogEditor.title}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublish}>
            Publish
          </button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
              <label htmlFor="uploadBanner">
                <img
                  src={
                    blogEditor.banner == "" ? defaultBanner : blogEditor.banner
                  }
                  alt=""
                />
                <input
                  type="file"
                  id="uploadBanner"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight"
              placeholder="Blog Title"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTilteChange}
            ></textarea>

            <hr className="w-full opacity-20 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
