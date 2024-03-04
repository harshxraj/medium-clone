import React, { useEffect, useState } from "react";
import axios from "axios";
import AnimationWrapper from "../common/Page-animation";
import InPageNavigation from "../components/Home Page/InPageNavigation";
import Loader from "../components/ui/Loader";
import BlogPostCard from "../components/Blogs/BlogPostCard";
import MinimalBlogPost from "../components/Blogs/MinimalBlogPost";

const Homepage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);

  const fetchLatestBlogs = () => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/blog/latest-blogs`)
      .then(({ data }) => {
        setBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTrendingBlogs = () => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/blog/trending-blogs`)
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchLatestBlogs();
    fetchTrendingBlogs();
  }, []);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : (
                blogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              )}
            </>

            {trendingBlogs == null ? (
              <Loader />
            ) : (
              trendingBlogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    key={i}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            )}
          </InPageNavigation>
        </div>
        {/* Filter and treding blogs */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
};

export default Homepage;
