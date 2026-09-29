import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  hideRepliesForComment,
  setTotalParentCommentsLoaded,
  toggleCommentWrapper,
  updateComments,
} from "../../redux/selectedBlogSlice";
import CommentField from "./CommentField";
import axios from "axios";
import CommentCard from "./CommentCard";
import { Toaster } from "react-hot-toast";

const buildCommentTree = (comments) => {
  const commentNodes = new Map(
    comments.map((comment) => [
      comment._id.toString(),
      { ...comment, replies: [] },
    ])
  );
  const roots = [];

  commentNodes.forEach((comment) => {
    const parentId = comment.parent?.toString();
    const parent = parentId ? commentNodes.get(parentId) : null;

    if (parent) {
      parent.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
};

const CommentThread = ({ comment, depth = 0, onCollapse }) => {
  const hasVisibleReplies = comment.replies.length > 0;

  return (
    <div className={depth === 0 ? "border-b border-grey" : ""}>
      <CommentCard commentData={comment} isNested={depth > 0} />

      {hasVisibleReplies ? (
        <div className="relative ml-4 pl-4">
          <button
            type="button"
            aria-label="Collapse this reply thread"
            title="Collapse thread"
            onClick={() => onCollapse(comment._id)}
            className="group absolute inset-y-0 left-0 z-[1] w-4 -translate-x-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <span className="mx-auto block h-full w-px bg-dark-grey/20 transition-colors group-hover:bg-dark-grey/60" />
          </button>

          {comment.replies.map((reply) => (
            <CommentThread
              key={reply._id}
              comment={reply}
              depth={depth + 1}
              onCollapse={onCollapse}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const fetchComments = async ({
  skip = 0,
  blog_id,
  dispatch,
  comment_array = null,
}) => {
  let res;
  await axios
    .post(`${import.meta.env.VITE_BASE_URL}/blog/comment/get`, {
      blog_id,
      skip,
    })
    .then(({ data }) => {
      const comments = data.map((comment) => ({
        ...comment,
        childrenLevel: 0,
      }));

      dispatch(setTotalParentCommentsLoaded(comments.length));

      if (comment_array == null) {
        res = { results: comments };
      } else {
        res = { results: [...comment_array, ...comments] };
      }
    });
  return res;
};

const CommentsContainer = () => {
  const selectedBlog = useSelector((store) => store.selectedBlog);
  const commentWrapper = useSelector(
    (store) => store.selectedBlog.commentWrapper
  );
  const {
    _id,
    title,
    comments: { results: commentArr },
    activity: { total_comments = 0, total_parent_comments = 0 },
    totalParentCommentsLoaded,
  } = selectedBlog;

  const dispatch = useDispatch();
  const commentTree = useMemo(
    () => buildCommentTree(commentArr || []),
    [commentArr]
  );

  const loadMoreComments = async () => {
    let newCommentsArr = await fetchComments({
      skip: totalParentCommentsLoaded,
      blog_id: _id,
      dispatch,
      comment_array: commentArr,
    });

    dispatch(updateComments(newCommentsArr));
  };

  const closeComments = () => dispatch(toggleCommentWrapper());
  const collapseThread = (parentId) =>
    dispatch(hideRepliesForComment({ parentId }));

  useEffect(() => {
    if (!commentWrapper) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        dispatch(toggleCommentWrapper());
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [commentWrapper, dispatch]);

  return (
    <>
      <Toaster position="top-center" />
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close comments"
        onClick={closeComments}
        className={`fixed inset-0 z-40 bg-[#000]/20 transition-opacity duration-300 motion-reduce:transition-none ${
          commentWrapper
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="comments-title"
        aria-hidden={!commentWrapper}
        inert={commentWrapper ? undefined : ""}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-full flex-col bg-white shadow-[-16px_0_48px_rgba(0,0,0,0.10)] transition-transform duration-300 motion-reduce:transition-none sm:w-[440px] ${
          commentWrapper ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-grey bg-white/95 px-5 py-5 backdrop-blur-sm sm:px-6">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <h1 id="comments-title" className="text-xl font-medium">
                Comments
              </h1>
              <span className="text-sm text-dark-grey">{total_comments}</span>
            </div>
            <p className="mt-1 truncate text-sm text-dark-grey">{title}</p>
          </div>
          <button
            type="button"
            onClick={closeComments}
            aria-label="Close comments"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-dark-grey hover:bg-grey hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 fill-none stroke-current stroke-2"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-10 sm:px-6">
          <div className="border-b border-grey py-6">
            <CommentField action="comment" />
          </div>

          <div aria-live="polite">
            {commentTree.length ? (
              commentTree.map((comment) => (
                <CommentThread
                  key={comment._id}
                  comment={comment}
                  onCollapse={collapseThread}
                />
              ))
            ) : (
              <div className="py-14 text-center">
                <p className="font-medium">No comments yet</p>
                <p className="mt-1 text-sm text-dark-grey">
                  Start the conversation above.
                </p>
              </div>
            )}
          </div>

          {total_parent_comments > totalParentCommentsLoaded ? (
            <button
              type="button"
              onClick={loadMoreComments}
              className="mt-5 w-full rounded-full border border-grey px-4 py-2.5 text-sm font-medium text-dark-grey hover:border-dark-grey/40 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Load older comments
            </button>
          ) : null}
        </div>
      </aside>
    </>
  );
};

export default CommentsContainer;
