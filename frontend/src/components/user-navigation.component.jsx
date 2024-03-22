import React from "react";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/Page-animation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { resetSelectedBlog, setUserLiked } from "../redux/selectedBlogSlice";

const UsernavigationPanel = () => {
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();

  const signOut = () => {
    dispatch(logout());
    dispatch(setUserLiked(false));
  };

  return (
    <AnimationWrapper
      transition={{ duration: 0.2 }}
      className="absolute right-0 z-50"
    >
      <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
        <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
          <i className="fi fi-rr-file edit"></i>
          <p>Write</p>
        </Link>
        <Link to={`/user/${user.username}`} className="link pl-8 py-4">
          Profile
        </Link>
        <Link to={`/dashboard/blogs`} className="link pl-8 py-4">
          Dashboard
        </Link>
        <Link to={`/settings/edit-profile`} className="link pl-8 py-4">
          Settings
        </Link>
        <span className="absolute border-t border-grey w-[100%]"></span>

        <button
          onClick={signOut}
          className="text-left hover:bg-grey w-full pl-8 py-4"
        >
          <h1 className="font-bold text-xl mb-1">Sign Out</h1>
          <p className="text-dark-grey">@{user.username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UsernavigationPanel;
