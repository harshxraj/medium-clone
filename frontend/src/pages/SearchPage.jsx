import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InPageNavigation from "../components/Home Page/InPageNavigation";
import { useScroll } from "framer-motion";
import AnimationWrapper from "../common/Page-animation";
import Loader from "../components/ui/Loader";
import BlogPostCard from "../components/Blogs/BlogPostCard";
import NoDataMessage from "../components/ui/NoData";
import LoadMoreDataBtn from "../components/Blogs/LoadMoreDataBtn";
import axios from "axios";
import { filterPaginationData } from "../common/FilteredPaginationData";
import UserCard from "../components/Users/UserCard";

const SearchPage = () => {
  const { query } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [users, setUsers] = useState(null);

  const searchBlogs = ({ page = 1, create_new_arr = false }) => {
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/blog/search-blogs`, {
        query,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/blog/search-blogs-count",
          data_to_send: { query },
          create_new_arr,
        });

        setBlogs(formatedData);
        console.log(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query]);

  const resetState = () => {
    setBlogs(null);
    setUsers(null);
  };

  const fetchUsers = () => {
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/user/search`, { query })
      .then(({ data: { users } }) => {
        console.log(users);
        setUsers(users);
      });
  };

  const UserCardWrapper = () => {
    return (
      <>
        {users == null ? (
          <Loader />
        ) : users.length ? (
          users.map((user, i) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoDataMessage message={"No User Found!"} />
        )}
      </>
    );
  };

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Search Results from ${query}`, `Accounts Matched`]}
          defaultHidden={["Accounts Matched"]}
        >
          <>
            {blogs == null ? (
              <Loader />
            ) : blogs.results.length ? (
              blogs.results.map((blog, i) => {
                console.log(blog.author);
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
            <LoadMoreDataBtn state={blogs} fetchData={searchBlogs} />
          </>

          <UserCardWrapper />
        </InPageNavigation>
      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">
          <i className="fi fi-rr-user mt-1"></i> Users related to search
        </h1>

        <UserCardWrapper />
      </div>
    </section>
  );
};

export default SearchPage;
