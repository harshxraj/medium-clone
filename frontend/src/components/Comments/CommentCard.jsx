import React, { useState } from "react";
import { getFullDayWithTime } from "../../common/Date";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import CommentField from "./CommentField";
import {
  deleteCommentFromState,
  hideRepliesForComment,
  showRepliesForComment,
} from "../../redux/selectedBlogSlice";
import axios from "axios";

const CommentCard = ({ isNested = false, commentData }) => {
  const access_token = useSelector((store) => store.auth.access_token);
  const currentUsername = useSelector((store) => store.auth.user?.username);
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
  const [isDeleting, setDeleting] = useState(false);

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

  const handleDelete = () => {
    const deleteMessage = children.length
      ? "Delete this comment and all of its replies?"
      : "Delete this comment?";

    if (!window.confirm(deleteMessage)) return;

    setDeleting(true);
    axios
      .delete(`${import.meta.env.VITE_BASE_URL}/blog/comment/${_id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(
        ({
          data: {
            deleted_comment_ids,
            deleted_count,
            deleted_parent_count,
            parent_id,
          },
        }) => {
          dispatch(
            deleteCommentFromState({
              deletedCommentIds: deleted_comment_ids,
              deletedCount: deleted_count,
              deletedParentCount: deleted_parent_count,
              parentId: parent_id,
            })
          );
          toast.success("Comment deleted.");
        }
      )
      .catch(({ response }) => {
        toast.error(response?.data?.error || "Unable to delete comment.");
      })
      .finally(() => setDeleting(false));
  };

  const replyLabel = `${children.length} ${
    children.length === 1 ? "reply" : "replies"
  }`;

  return (
    <article className={isNested ? "py-4" : "py-5"}>
      <div className="flex items-start gap-3">
          {profile_img ? (
            <img
              src={profile_img}
              alt={`${fullname}'s avatar`}
              className="h-8 w-8 flex-none rounded-full bg-grey object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-grey text-sm font-medium">
              {fullname?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p className="truncate text-sm font-medium capitalize">
                {fullname}
              </p>
              <time
                dateTime={commentedAt}
                className="text-xs text-dark-grey"
              >
                {getFullDayWithTime(commentedAt)}
              </time>
            </div>

            <p className="mt-2.5 whitespace-pre-wrap break-words font-gelasio text-[17px] leading-7">
              {comment}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              {children.length ? (
                commentData.isReplyLoaded ? (
                  <button
                    type="button"
                    onClick={hideReplies}
                    aria-expanded="true"
                    className="text-sm font-medium text-dark-grey hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Hide replies
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={loadReplies}
                    aria-expanded="false"
                    className="text-sm font-medium text-dark-grey hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    {replyLabel}
                  </button>
                )
              ) : null}

              <button
                type="button"
                onClick={handleReply}
                className="text-sm font-medium text-dark-grey hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                {isReplying ? "Cancel reply" : "Reply"}
              </button>

              {currentUsername === username ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-sm text-dark-grey hover:text-red disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
                >
                  {isDeleting ? "Deleting…" : "Delete"}
                </button>
              ) : null}
            </div>

            {isReplying ? (
              <CommentField
                action="reply"
                replyingTo={_id}
                setReplying={setReplying}
              />
            ) : null}
          </div>
      </div>
    </article>
  );
};

export default CommentCard;
