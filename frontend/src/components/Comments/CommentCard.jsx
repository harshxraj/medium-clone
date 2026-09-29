import React, { useState } from "react";
import { getFullDayWithTime } from "../../common/Date";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import CommentField from "./CommentField";
import {
  hideRepliesForComment,
  showRepliesForComment,
} from "../../redux/selectedBlogSlice";
import axios from "axios";

const CommentCard = ({ leftVal, commentData }) => {
  const access_token = useSelector((store) => store.auth.access_token);
  const dispatch = useDispatch();

  const {
    _id,
    comment,
    commented_by: {
      personal_info: { profile_img, fullname, username },
    },
    commentedAt,
    children,
  } = commentData;

  const [isReplying, setReplying] = useState(false);

  const loadReplies = () => {
    if (children.length) {
      axios
        .post(`${import.meta.env.VITE_BASE_URL}/blog/reply`, { _id })
        .then(({ data: { replies } }) => {
          dispatch(showRepliesForComment({ parentId: _id, replies }));
        })
        .catch(() => {
          toast.error("Unable to load replies. Please try again.");
        });
    }
  };

  const hideReplies = () => {
    dispatch(hideRepliesForComment({ parentId: _id }));
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
