import axios from "axios";
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  setActivity,
  setComments,
  setTotalParentCommentsLoaded,
} from "../../redux/selectedBlogSlice";

const CommentField = ({ action }) => {
  const access_token = useSelector((store) => store.auth.access_token);
  const userInfo = useSelector((store) => store.auth);
  let currentUser = {};

  if (access_token) {
    const { profile_img, fullname, username } = userInfo.user;
    currentUser = { profile_img, fullname, username };
  }
  const selectedBlog = useSelector((store) => store.selectedBlog);
  let commentArr = selectedBlog.comments.results;

  //   console.log("SELE", selectedBlog);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const {
    _id,
    author: { _id: blog_author },
  } = selectedBlog;

  const handleComment = () => {
    if (!access_token) {
      return toast.error("Login first to leave a comment!");
    }
    if (!comment.length) {
      return toast.error("Write something to leave a comment..");
    }

    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/blog/comment`,
        { _id, blog_author, comment },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        setComment("");
        data.commented_by = { personal_info: currentUser };

        let newCommentArr;

        // Saying this is the parent comment, first reply
        data.childrenLevel = 0;

        newCommentArr = [data, ...commentArr];

        let parentCommentIncrementVal = 1;

        dispatch(setComments(newCommentArr));
        dispatch(setActivity(parentCommentIncrementVal));

        dispatch(setTotalParentCommentsLoaded(parentCommentIncrementVal));

        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button onClick={handleComment} className="btn-dark mt-5 px-10">
        {action}
      </button>
    </>
  );
};

export default CommentField;
