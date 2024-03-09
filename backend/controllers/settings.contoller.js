import User from "../Schema/User.js";
import bcrypt from "bcrypt";

export const changePassword = (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (currentPassword.length < 6 || newPassword.length < 6) {
    return res
      .status(403)
      .json({ error: "Password must be at least 6 letters or more" });
  }

  User.findOne({ _id: req.user })
    .then((user) => {
      if (user.google_auth) {
        return res.status(403).json({
          error:
            "You can't change account's password because you logged in through google!",
        });
      }

      bcrypt.compare(
        currentPassword,
        user.personal_info.password,
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Some error while changing password" });
          }

          if (!result) {
            return res
              .status(403)
              .json({ error: "Incorrect Current password" });
          }

          if (currentPassword == newPassword) {
            return res
              .status(500)
              .json({ error: "New password is same as old!" });
          }

          bcrypt.hash(newPassword, 5, (err, hashed_password) => {
            User.findOneAndUpdate(
              { _id: req.user },
              { "personal_info.password": hashed_password }
            )
              .then((u) => {
                return res.status(200).json({ Status: "Password changed" });
              })
              .catch((err) => {
                return res.status(500).json({ error: err.message });
              });
          });
        }
      );
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "User not found" });
    });
};

export const updateProfileImg = (req, res) => {
  const { img } = req.body;

  User.findOneAndUpdate(
    { _id: req.user },
    { "personal_info.profile_img": img },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ success: "Image updated", user });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const updateProfile = (req, res) => {
  let bioLimit = 150;
  const { username, bio, social_links } = req.body;

  if (username < 3) {
    return res
      .status(403)
      .json({ error: "Username should be at least 3 letters long" });
  }

  if (bio.length > bioLimit) {
    return res
      .status(403)
      .json({ error: `Bio Should not be more than ${bioLimit} characters` });
  }

  let socialLinksArr = Object.keys(social_links);

  try {
    for (let i = 0; i < socialLinksArr.length; i++) {
      if (social_links[socialLinksArr[i]].length) {
        let hostname = new URL(social_links[socialLinksArr[i]]).hostname;

        if (
          !hostname.includes(`${socialLinksArr[i]}.com`) &&
          socialLinksArr[i] != "website"
        ) {
          return res.status(403).json({
            error: `${socialLinksArr[i]} link is invalid, You must enter a correct link`,
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "You must provide full social links with http(s) included",
    });
  }

  let updateObj = {
    "personal_info.username": username,
    "personal_info.bio": bio,
    social_links,
  };

  User.findOneAndUpdate({ _id: req.user }, updateObj, {
    runValidators: true,
  })
    .then(() => {
      return res.status(200).json({ username });
    })
    .catch((err) => {
      if (err.code == 11000) {
        return res.status(409).json({ error: "Username is already taken" });
      }
      return res.status(500).json({ error: err.message });
    });
};
