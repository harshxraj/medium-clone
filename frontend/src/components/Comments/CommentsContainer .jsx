import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setComments,
  setTotalParentCommentsLoaded,
  toggleCommentWrapper,
  updateComments,
} from "../../redux/selectedBlogSlice";
import CommentField from "./CommentField";
import NoDataMessage from "../../components/ui/NoData";
import axios from "axios";
import AnimationWrapper from "../../common/Page-animation";
import CommentCard from "./CommentCard";

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
      data.map((comment) => {
        // Indicating that this is a parent comment
        comment.childrenLevel = 0;
      });

      //   setParentCommentCountFun((prev) => prev + data.length);
      dispatch(setTotalParentCommentsLoaded(data.length));
      console.log("AFTER DIS", data);

      if (comment_array == null) {
        res = { results: data };
      } else {
        res = { results: [...comment_array, ...data] };
      }
    });
  return res;
};

const CommentsContainer = () => {
  const selectedBlog = useSelector((store) => store.selectedBlog);
  const commentWrapper = useSelector(
    (store) => store.selectedBlog.commentWrapper
  );
  let {
    _id,
    title,
    blog_id,
    activity,
    comments: { results: commentArr },
    activity: { total_likes, total_comment, total_parent_comments },
    author: {
      personal_info: { username: author_username },
    },
    totalParentCommentsLoaded,
  } = selectedBlog;
  console.log("Commetnns", commentArr);

  const dispatch = useDispatch();

  const loadMoreComments = async () => {
    let newCommentsArr = await fetchComments({
      skip: totalParentCommentsLoaded,
      blog_id: _id,
      dispatch,
      comment_array: commentArr,
    });

    // This newCommentArr will contain all the comments for that array, so we wont spread the old comments, insted we dispatch this newComments array as a payload, and set it to comments
    // so if the limit is 5, and total comemnt is 12, after clicking first time, we will get 10 comments, and we get load more button, and then after 2 more

    dispatch(updateComments(newCommentsArr));
  };
  return (
    <div
      className={
        "max-sm:w-full fixed " +
        (commentWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") +
        " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[500px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"
      }
    >
      <div className="relative">
        <h1 className="text-xl font-medium">Comments</h1>
        <p className="text-lg mt-2 w[70%] text-dark-grey line-clamp-1">
          {title}
        </p>

        <button
          onClick={() => dispatch(toggleCommentWrapper())}
          className="flex absolute top-0 right-0 justify-center items-center w-10 h-10 rounded-full bg-grey"
        >
          <i className="fi fi-br-cross text-2xl mt-1"></i>
        </button>

        <hr className="border-grey my-8 w-[120%] -ml-10" />

        <CommentField action={"comment"} />

        {commentArr && commentArr?.length ? (
          commentArr.map((comment, i) => {
            return (
              <AnimationWrapper key={i}>
                <CommentCard
                  index={i}
                  leftVal={comment.childrenLevel * 4}
                  commentData={comment}
                />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoDataMessage message={"No Comments"} />
        )}

        {total_parent_comments > totalParentCommentsLoaded ? (
          <button
            onClick={loadMoreComments}
            className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
          >
            Load More
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CommentsContainer;
