import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  setActivity,
  setComments,
  setTotalParentCommentsLoaded,
} from "../../redux/selectedBlogSlice";

const CommentField = ({
  action,
  replyingTo = undefined,
  setReplying,
}) => {
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
  const [isSubmitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  const {
    _id,
    author: { _id: blog_author },
  } = selectedBlog;

  const handleComment = () => {
    if (!access_token) {
      return toast.error("Login first to leave a comment!");
    }
    if (!comment.trim().length) {
      return toast.error("Write something to leave a comment..");
    }

    setSubmitting(true);
    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/blog/comment`,
        {
          _id,
          blog_author,
          comment: comment.trim(),
          replying_to: replyingTo,
        },
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

        if (replyingTo) {
          data.parent = replyingTo;
          const indexToUpdate = commentArr.findIndex(
            (comment) => comment._id === replyingTo
          );

          if (indexToUpdate === -1) {
            return toast.error(
              "The comment being replied to is no longer loaded."
            );
          }

          newCommentArr = [...commentArr]; // Clone the commentArr

          newCommentArr[indexToUpdate] = {
            ...newCommentArr[indexToUpdate],
            children: [...newCommentArr[indexToUpdate].children, data._id],
            isReplyLoaded: true,
          };

          data.childrenLevel =
            newCommentArr[indexToUpdate].childrenLevel + 1;

          newCommentArr.splice(indexToUpdate + 1, 0, data);

          setReplying(false);
        } else {
          // Saying this is the parent comment, first reply
          data.childrenLevel = 0;

          newCommentArr = [data, ...commentArr];
        }

        let parentCommentIncrementVal = replyingTo ? 0 : 1;

        dispatch(setComments(newCommentArr));
        dispatch(setActivity(parentCommentIncrementVal));
        dispatch(setTotalParentCommentsLoaded(parentCommentIncrementVal));

      })
      .catch(({ response }) => {
        toast.error(response?.data?.error || "Unable to post comment.");
      })
      .finally(() => setSubmitting(false));
  };

  const isReply = action === "reply";

  return (
    <div
      className={`overflow-hidden rounded-xl border border-grey bg-grey/40 transition-colors focus-within:border-dark-grey/40 focus-within:bg-white ${
        isReply ? "mt-4" : ""
      }`}
    >
      <textarea
        autoFocus={isReply}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={isReply ? "Write a reply…" : "Add to the conversation…"}
        rows={isReply ? 2 : 3}
        className="block w-full resize-none bg-transparent px-4 py-4 text-base leading-6 placeholder:text-dark-grey/80 focus:outline-none"
      />
      <div className="flex items-center justify-end gap-2 border-t border-grey px-3 py-2">
        {isReply ? (
          <button
            type="button"
            onClick={() => setReplying(false)}
            className="rounded-full px-3 py-2 text-sm text-dark-grey hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="button"
          onClick={handleComment}
          disabled={isSubmitting || !comment.trim().length}
          className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          {isSubmitting
            ? "Posting…"
            : isReply
            ? "Post reply"
            : "Post comment"}
        </button>
      </div>
    </div>
  );
};

export default CommentField;
