import React, { useState } from "react";
import { getDay, getFullDayWithTime } from "../../common/Date";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import CommentField from "./CommentField";
import {
  makeReplyLoadedFalse,
  setComments,
  setCommentsResults,
  setIsReplyLoaded,
  updateComments,
} from "../../redux/selectedBlogSlice";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {
  const access_token = useSelector((store) => store.auth.access_token);
  const dispatch = useDispatch();
  const isReplyLoaded = useSelector(
    (store) => store.selectedBlog.comments.results[index].isReplyLoaded
  );
  console.log("check kar rah hu", isReplyLoaded);

  const {
    _id,
    comment,
    commented_by: {
      personal_info: { profile_img, fullname, username },
    },
    commentedAt,
    children,
  } = commentData;
  const selectedBlog = useSelector((store) => store.selectedBlog);
  let commentArr = selectedBlog.comments.results;
  // console.log("COMMENTDATA", commentArr);

  const [isReplying, setReplying] = useState(false);

  const loadReplies = ({ skip = 0 }) => {
    if (children.length) {
      hideReplies();

      axios
        .post(`${import.meta.env.VITE_BASE_URL}/blog/reply`, { _id, skip })
        .then(({ data: { replies } }) => {
          // commentData.isReplyLoaded = true;
          dispatch(setIsReplyLoaded({ index, isLoaded: true }));
          console.log("respiles", replies);

          // for (let i = 0; i < replies.length; i++) {
          //   replies[i].childrenLevel = commentData.childrenLevel + 1;

          //   commentArr.splice(index + 1 + i + skip, 0, replies[i]);
          // }

          // const updatedComments = [...selectedBlog.comments.results];
          const updatedComments = [...commentArr];

          // for (let i = 0; i < replies.length; i++) {
          //   replies[i].childrenLevel = commentData.childrenLevel + 1;
          //   updatedComments.splice(skip + i, 0, replies[i]);
          // }
          console.log(commentData.childrenLevel);
          for (let i = 0; i < replies.length; i++) {
            replies[i].childrenLevel = commentData.childrenLevel + 1;

            updatedComments.splice(index + 1 + i + skip, 0, replies[i]);
          }

          // dispatch(setComments({ results: updatedComments }));

          // dispatch(setComments(updatedComments));
          console.log("getting", updatedComments);
          dispatch(setCommentsResults(updatedComments));
        });
    }
  };

  const removeCommentsCards = (startingPoint) => {
    let updatedCommentArr = [...commentArr];
    if (updatedCommentArr[startingPoint]) {
      while (
        updatedCommentArr[startingPoint].childrenLevel >
        commentData.childrenLevel
      ) {
        // commentArr.splice(startingPoint, 1);
        updatedCommentArr.splice(startingPoint, 1);

        if (!updatedCommentArr[startingPoint]) {
          break;
        }
      }
    }

    // dispatch(updateComments({ results: updatedCommentArr }));
    console.log("UPATED", updatedCommentArr);
    dispatch(setCommentsResults(updatedCommentArr));
  };

  // const hideReplies = () => {
  //   // commentData.isReplyLoaded = false;
  //   // dispatch(setIsReplyLoaded({ index, isLoaded: false }));
  //   // dispatch(makeReplyLoadedFalse(index));
  //   // console.log(index);
  //   console.log("COMMERNTARRU", commentArr);

  //   let updatedComments = [...commentArr];
  //   updatedComments[index].isReplyLoaded = false;

  //   dispatch(setCommentsResults(updatedComments));

  //   removeCommentsCards(index + 1);
  // };
  const hideReplies = () => {
    // Clone the commentArr to avoid mutating it directly
    let updatedComments = commentArr.map((comment, idx) => {
      if (idx === index) {
        // If it's the comment we want to modify, create a new object with the updated isReplyLoaded property
        return { ...comment, isReplyLoaded: false };
      }

      return comment; // Otherwise, return the original comment object
    });
    console.log("", updatedComments);

    // Dispatch an action to update the comments in Redux state
    dispatch(setCommentsResults(updatedComments));

    // Call any other necessary functions
    removeCommentsCards(index + 1);
  };

  const handleReply = () => {
    if (!access_token) {
      return toast.error("Login first to leave a reply!");
    }

    setReplying((prev) => !prev);
  };

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-8">
          {profile_img && (
            <img src={profile_img} className="w-6 h-6 rounded-full" />
          )}

          <p className="line-clamp-1 font-medium capitalize">{fullname}</p>
          <p className="min-w-fit text-dark-grey">
            {getFullDayWithTime(commentedAt)}
          </p>
        </div>

        <p className="font-gelasio text-xl ml-3">{comment}</p>

        <div className="flex gap-5 items-center mt-5">
          {commentData.isReplyLoaded ? (
            <button
              onClick={hideReplies}
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
            >
              <i className="fi fi-rs-comment-dots"></i>
              Hide Reply
            </button>
          ) : (
            <button
              onClick={loadReplies}
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
            >
              <i className="fi fi-rs-comment-dots"></i>
              {children.length} Replies
            </button>
          )}
          <i
            className={`fi fi-rr-undo -mr-2 ${
              isReplying ? "-rotate-90 transition duration-500" : ""
            }`}
          ></i>
          <button onClick={handleReply} className="underline">
            Reply
          </button>
        </div>

        {isReplying && (
          <div className="mt-8">
            <CommentField
              action="reply"
              index={index}
              replyingTo={_id}
              setReplying={setReplying}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
