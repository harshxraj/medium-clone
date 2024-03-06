import React, { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setDescription,
  setEditorState,
  setTile,
  setTags,
  resetBlogState,
} from "../../redux/blogEditorSlice";
import Tag from "../ui/Tag";
import AnimationWrapper from "../../common/Page-animation";

const PublishForm = () => {
  const access_token = useSelector((store) => store.auth.access_token);
  const textEditor = useSelector((store) => store.blogEditor.textEditor);
  const { title, banner, des, content, tags } = useSelector(
    (store) => store.blogEditor
  );
  let navigate = useNavigate();
  const { id: blog_id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const dispatch = useDispatch();

  let characterLimit = 200;
  let tagLimit = 10;

  const handleClose = () => {
    dispatch(setEditorState("editor"));
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      let tag = e.target.value;
      tag = tag.trim();

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          dispatch(setTags(tag));
        }
      } else {
        toast.error(`You can add max ${tagLimit} tags!`);
      }
      e.target.value = "";
    }
  };

  const handlePublish = (e) => {
    if (e.target.classList.contains("disable")) {
      return;
    }
    if (!title.length) {
      return toast.error("Write blog title before publishing!");
    }

    if (!des.length || des.length > characterLimit) {
      return toast.error(
        `Write a description within ${characterLimit} characters to publish!`
      );
    }

    if (!tags.length) {
      return toast.error("Enter atleast 1 tag to help us rank you blog!");
    }

    let loadingToast = toast.loading("Publishing...");

    e.target.classList.add("disable");

    let blogObj = {
      title,
      banner,
      des,
      content,
      tags,
      draft: false,
    };

    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/blog/create`,
        { ...blogObj, id: blog_id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(() => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);
        toast.success("Published👍");

        dispatch(resetBlogState());

        setTimeout(() => {
          navigate("/");
        }, 500);
      })
      .catch(({ response }) => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);

        return toast.error(response.data.error);
      });
  };
  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />

        <button
          onClick={handleClose}
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
        >
          <i className="fi fi-br-cross"></i>
        </button>

        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-1">Preview</p>

          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={banner} alt="" />
          </div>

          <h1 className="text-4xl font-medium mt-3 leading-tight line-clamp-2">
            {title}
          </h1>

          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
            {des}
          </p>
        </div>

        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
          <input
            type="text"
            placeholder="Blog Title"
            defaultValue={title}
            className="input-box pl-4"
            onChange={(e) => dispatch(setTile(e.target.value))}
          />

          <p className="text-dark-grey mb-2 mt-9">
            Short description about your blog
          </p>
          <textarea
            className="h-40 resize-none leading-7 input-box pl-4"
            maxLength={characterLimit}
            defaultValue={des}
            onKeyDown={handleTitleKeyDown}
            onChange={(e) => dispatch(setDescription(e.target.value))}
          ></textarea>

          <p className="mt-1 text-dark-grey text-sm text-right">
            {characterLimit - des.length} Characters left!
          </p>

          <p className="text-dark-grey mb-2 mt-9 ">
            Topics - (Helps in searching and ranking your blog post)
          </p>

          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="Topic"
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={handleKeyDown}
            />
            {tags.map((tag, i) => {
              return <Tag tag={tag} key={tag} tagIndex={i} />;
            })}
          </div>
          <p className="mt-1 mb-4 text-dark-grey text-right">
            {tagLimit - tags.length} Tags left!
          </p>

          <div className="flex justify-center">
            <button
              onClick={handlePublish}
              className="btn-dark px-8 text-center"
            >
              Publish
            </button>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
