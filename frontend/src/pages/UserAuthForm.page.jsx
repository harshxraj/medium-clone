import React, { useContext, useEffect, useState } from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Toaster, toast } from "react-hot-toast";
import { Link, useNavigate, Navigate } from "react-router-dom";
import AnimationWrapper from "../common/Page-animation";
import axios from "axios";
import { authWithGoogle } from "../common/firebase";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../redux/authSlice";

const UserAuthForm = ({ type }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.auth.user);
  const access_token = useSelector((store) => store.auth.access_token);

  const signup = (fullname, email, password) => {
    // console.log(email, password, fullname);
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/auth/signup`, {
        fullname,
        email,
        password,
      })
      .then(({ data }) => {
        dispatch(authenticate(data));
      })
      .catch(({ response }) => {
        console.log(response);
        toast.error(response.data.error);
      });
  };

  const signin = (email, password) => {
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/auth/signin`, {
        email,
        password,
      })
      .then(({ data }) => {
        dispatch(authenticate(data));
      })
      .catch(({ response }) => {
        console.log(response);
        toast.error(response.data.error);
      });
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();
    authWithGoogle()
      .then((user) => {
        axios
          .post(`${import.meta.env.VITE_BASE_URL}/auth/google`, {
            access_token: user.accessToken,
          })
          .then(({ data }) => {
            dispatch(authenticate(data));
          })
          .catch(({ response }) => {
            console.log(response);
            toast.error(response.data.error);
          });
      })
      .catch((err) => {
        toast.error("Trouble Login using Google");
        return console.log(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    console.log(fullname, email, password);

    if (type === "sign-up" && fullname.length < 3) {
      return toast.error("Fullname must be at least 3 letters or more;");
    }

    if (!email.length) {
      return toast.error("Enter Email");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid!");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 letters or more");
    }

    if (type === "sign-in") signin(email, password);
    else signup(fullname, email, password);
  };
  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <form className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
          <Toaster />
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "sign-in" ? "Welcome back" : "Join us today"}
          </h1>

          {type === "sign-up" && (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
              onChange={(e) => setFullname(e.target.value)}
            />
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-dark center mt-14 ">
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} alt="googleIcon" className="w-5" />
            Continue with google
          </button>

          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us Today
              </Link>
              `
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
