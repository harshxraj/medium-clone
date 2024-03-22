import axios, { formToJSON } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { profileDataStructure } from "./ProfilePage";
import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/Page-animation";
import Loader from "../components/ui/Loader";
import InputBox from "../components/input.component";
import { Navigate } from "react-router-dom";
import { updateProfileImg, updateUsername } from "../redux/authSlice";

const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: "",
};

const EditProfilePage = () => {
  const access_token = useSelector((store) => store.auth.access_token);
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();

  let bioLimit = 150;
  const editProfileForm = useRef();

  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [charactersLeft, setCharactersLeft] = useState(bioLimit);

  const {
    personal_info: { email, fullname, username, bio, profile_img },
    social_links,
  } = profile;

  console.log(user);
  console.log(profile);

  const handleSubmit = (e) => {
    e.preventDefault();

    let form = new FormData(editProfileForm.current);

    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    const {
      username,
      bio,
      youtube,
      facebook,
      twitter,
      github,
      instagram,
      website,
    } = formData;

    if (username.length < 4) {
      return toast.error("Username should be at least 3 letters long");
    }

    if (bio.length > bioLimit) {
      return toast.error(`Bio should not be more that ${bioLimit}`);
    }

    let x = toast.loading("Updating....");
    e.target.setAttribute("disabled", true);

    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/settings/update-profile`,
        {
          username,
          bio,
          social_links: {
            youtube,
            facebook,
            twitter,
            github,
            instagram,
            website,
          },
        },
        {
          headers: {
            Authorization: `Bearer: ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        console.log(data);
        if (user.username != data.username) {
          dispatch(updateUsername(data.username));
        }
        toast.dismiss(x);
        e.target.removeAttribute("disabled");
        toast.success("Profile Updated! 😎");
      })
      .catch(({ response }) => {
        toast.dismiss(x);
        e.target.removeAttribute("disabled");
        toast.error(response.data.error);
      });
  };

  const handleAvatarUpload = async (event) => {
    try {
      let x = toast.loading("Uploading image...");
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "blogapp");
      formData.append(
        "cloud_name",
        `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`
      );

      fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data.secure_url);
          setAvatar(data.secure_url);
          toast.dismiss(x);
          toast.success("Image uploaded!");
        });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageChange = (event) => {
    event.preventDefault();
    if (!avatar) {
      return toast.error("Choose a photo to change your profile image");
    }
    let x = toast.loading("Uploading Image!");
    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/settings/update-profile-img`,
        {
          img: avatar,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(() => {
        toast.dismiss(x);
        dispatch(updateProfileImg(avatar));
        // setAvatar(null);
        window.location.reload();

        toast.success("Profile Image updated");
      })
      .catch((err) => {
        toast.dismiss(x);
        console.log(err);
      });
  };

  useEffect(() => {
    if (access_token) {
      axios
        .post(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
          username: user.username,
        })
        .then(({ data }) => {
          setProfile(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [access_token]);

  useEffect(() => {
    if (!access_token) {
      <Navigate to="/signin" />;
    }
  }, []);

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <form ref={editProfileForm}>
          <Toaster />

          <h1 className="max-md:hidden">Edit Profile</h1>
          <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
            <div className="max-lg:center mb-5">
              <label className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden">
                <img src={avatar == null ? profile_img : avatar} alt="" />
                <input
                  type="file"
                  id="avatarInput"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />

                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                  Upload Image
                </div>
              </label>
              <button
                type="button"
                onClick={handleImageChange}
                className="btn-light mt-5 max-lg:bg-center lg:w-full px-10"
              >
                Upload
              </button>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <div>
                  <InputBox
                    name="fullname"
                    type={"text"}
                    disabled={true}
                    value={user.fullname}
                    placeholder="Full Name"
                    icon="fi-rr-user"
                  />
                </div>

                <div>
                  <InputBox
                    name="email"
                    type="email"
                    value={email}
                    disabled={true}
                    placeholder="Email"
                    icon="fi-rr-envelope"
                  />
                </div>
              </div>

              <InputBox
                type="text"
                name="username"
                value={username}
                placeholder="Username"
                icon="fi-rr-at"
              />

              <p className="text-dark-grey -mt-3">
                Username will be used to search for users and will be visible to
                all users
              </p>

              <textarea
                name="bio"
                maxLength={bioLimit}
                defaultValue={bio}
                className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
                placeholder="Bio"
                onChange={(e) =>
                  setCharactersLeft(bioLimit - e.target.value.length)
                }
              ></textarea>

              <p className="mt-1 text-dark-grey">
                {charactersLeft} characters left
              </p>

              <p className="my-6 text-dark-grey">Add your socials below</p>

              <div className="md:grid md:grid-cols-2 gap-x-6">
                {Object.keys(social_links).map((key, i) => {
                  let link = social_links[key];

                  <i
                    className={`fi ${
                      key != "website" ? `fi-brands-${key}` : "fi-rr-globe"
                    }`}
                  ></i>;
                  return (
                    <InputBox
                      key={i}
                      name={key}
                      type="text"
                      value={link}
                      placeholder="https://"
                      icon={`fi ${
                        key != "website" ? `fi-brands-${key}` : "fi-rr-globe"
                      }`}
                    />
                  );
                })}
              </div>

              <button
                onClick={handleSubmit}
                className="btn-dark w-auto px-10"
                type="submit"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      )}
    </AnimationWrapper>
  );
};

export default EditProfilePage;
