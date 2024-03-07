import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  setLike,
  setUserLiked,
  toggleCommentWrapper,
  toggleLikedByUser,
} from "../../redux/selectedBlogSlice";

const BlogInteraction = () => {
  const user = useSelector((store) => store.auth.user);
  let username;
  if (user != null) {
    username = user.username;
  }
  const selectedBlog = useSelector((store) => store.selectedBlog);
  const isLikedByUser = useSelector(
    (store) => store.selectedBlog.isLikedByUser
  );
  // console.log(selectedBlog);
  // console.log(isLikedByUser);
  const access_token = useSelector((store) => store.auth.access_token);

  const dispatch = useDispatch();

  useEffect(() => {
    if (access_token) {
      // Checking if the user has liked the post or not
      axios
        .post(
          `${import.meta.env.VITE_BASE_URL}/blog/isLiked`,
          { _id },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then((data) => {
          console.log(data.data.result);
          // dispatch(toggleLikedByUser(Boolean(data.data.result)));
          dispatch(setUserLiked(Boolean(data.data.result)));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  let {
    _id,
    title,
    blog_id,
    activity,
    activity: { total_likes, total_comments },
    author: {
      personal_info: { username: author_username },
    },
  } = selectedBlog;

  const handleLike = () => {
    if (access_token) {
      dispatch(toggleLikedByUser());

      !isLikedByUser ? total_likes++ : total_likes--;
      dispatch(setLike(total_likes));

      axios
        .post(
          `${import.meta.env.VITE_BASE_URL}/blog/like`,
          { _id, isLikedByUser },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("Please login to like this blog!");
    }
  };

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center ">
          <button
            onClick={handleLike}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80"
            }`}
          >
            <i className={`fi fi-${isLikedByUser ? "sr" : "rr"}-heart`}></i>
          </button>

          <p className="text-xl text-dark-grey">{total_likes}</p>

          <button
            onClick={() => dispatch(toggleCommentWrapper())}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
          >
            <i className="fi fi-rr-comment-dots"></i>
          </button>

          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {username == author_username ? (
            <Link to={`/editor/${blog_id}`} className="underline">
              Edit
            </Link>
          ) : (
            ""
          )}
          <Link
            to={`https://twitter.com/intent/tweet?text=Read${title}&url=${location.href}`}
          >
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>
        </div>
      </div>
      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
