import React, { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import AnimationWrapper from "../../common/Page-animation";
import { useDispatch, useSelector } from "react-redux";
import {
  setDescription,
  setEditorState,
  setTile,
  setTags,
} from "../../redux/blogEditorSlice";
import Tag from "../ui/Tag";

const PublishForm = () => {
  const textEditor = useSelector((store) => store.blogEditor.textEditor);
  const { title, banner, des, content, tags } = useSelector(
    (store) => store.blogEditor
  );
  console.log("tags", tags);

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
              return <Tag tag={tag} key={tag} />;
            })}
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
