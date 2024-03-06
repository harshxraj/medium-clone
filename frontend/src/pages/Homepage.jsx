import React, { useEffect, useState } from "react";
import axios from "axios";
import AnimationWrapper from "../common/Page-animation";
import InPageNavigation, {
  activeTabRef,
} from "../components/Home Page/InPageNavigation";
import Loader from "../components/ui/Loader";
import BlogPostCard from "../components/Blogs/BlogPostCard";
import MinimalBlogPost from "../components/Blogs/MinimalBlogPost";
import NoDataMessage from "../components/ui/NoData";
import { filterPaginationData } from "../common/FilteredPaginationData";
import LoadMoreDataBtn from "../components/Blogs/LoadMoreDataBtn";

const Homepage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");

  let categories = [
    "psychology",
    "space",
    "tech",
    "travel",
    "entertainment",
    "finance",
  ];

  const fetchLatestBlogs = ({ page = 1 }) => {
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/blog/latest-blogs`, { page })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/blog/all-latest-blogs-count",
        });

        setBlogs(formatedData);
        console.log(formatedData);
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

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();

    setBlogs(null);

    if (pageState == category) {
      setPageState("home");
    } else {
      setPageState(category);
    }
  };

  const fetchBlogsByCategory = ({ page = 1 }) => {
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/blog/search-blogs`, {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/blog/search-blogs-count",
          data_to_send: { tag: pageState },
        });

        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    activeTabRef.current.click();

    if (pageState == "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => {
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
              ) : (
                <NoDataMessage message={"No Blog Published!"} />
              )}
              <LoadMoreDataBtn
                state={blogs}
                fetchData={
                  pageState == "home" ? fetchLatestBlogs : fetchBlogsByCategory
                }
              />
            </>

            {trendingBlogs == null ? (
              <Loader />
            ) : trendingBlogs.length ? (
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
            ) : (
              <NoDataMessage message={"No Trending Blogs!"} />
            )}
          </InPageNavigation>
        </div>
        {/* Filter and treding blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden ">
          <div className="flex flex-col gap-10">
            {/* // Tags */}
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interests
              </h1>

              <div className="flex flex-wrap gap-3">
                {categories.map((category, i) => {
                  return (
                    <button
                      key={i}
                      onClick={loadBlogByCategory}
                      className={
                        "tag " +
                        (pageState == category ? "bg-black text-white" : "")
                      }
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* // Trending Posts */}
            <div>
              <h1 className="font-medium text-xl mb-8">
                <i className="fi fi-rr-arrow-trend-up"></i> Trending
              </h1>
              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs.length ? (
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
              ) : (
                <NoDataMessage message={"No Trending Blogs!"} />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Homepage;
