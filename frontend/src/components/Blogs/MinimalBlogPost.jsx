import React from "react";
import { Link } from "react-router-dom";
import { getDay } from "../../common/Date";

const MinimalBlogPost = ({ blog, index }) => {
  const {
    title,
    des,
    banner,
    blog_id: id,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    publishedAt,
  } = blog;

  return (
    <Link className="flex gap-3 mb-8" to={`/blog/${id}`}>
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>

      <div>
        <div className="flex gap-2 items-center mb-8">
          <img
            src={profile_img}
            alt="user_img"
            className="w-6 h-6 rounded-full"
          />
          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>
        <h1 className="blog-title">{title}</h1>
      </div>
    </Link>
  );
};

export default MinimalBlogPost;
