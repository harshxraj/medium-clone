import bcrypt from "bcrypt";
import User from "../Schema/User.js";
import { formatDataToSend, generateUsername } from "../utils/auth.utils.js";
import admin from "firebase-admin";
import serviceAccountKey from "../firebase-key.json" assert { type: "json" };
import { getAuth } from "firebase-admin/auth";

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Fullname must be at least 3 letters or more;" });
  }

  if (!email.length) {
    return res.status(403).json({ error: "Enter Email" });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is invalid!" });
  }

  if (password.length < 6) {
    return res
      .status(403)
      .json({ error: "Password must be at least 6 letters or more" });
  }

  try {
    const existingUser = await User.findOne({ "personal_info.email": email });

    if (existingUser) {
      return res.status(500).json({ error: "Email already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const username = await generateUsername(email);

    const newUser = new User({
      personal_info: { fullname, email, password: hashedPassword, username },
    });

    const user = await newUser.save();
    res.status(200).json(formatDataToSend(user));
  } catch (error) {
    res
      .status(400)
      .json({ error: "User creation failed", message: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const existingUser = await User.findOne({ "personal_info.email": email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    if (existingUser.google_auth) {
      return res.status(403).json({
        error: "Account was created using Google, Try logging in with Google",
      });
    }

    // Compare passwords
    bcrypt.compare(
      password,
      existingUser.personal_info.password,
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error occured while login, Please try again!" });
        }
        if (!result) {
          return res.status(403).json({ error: "Incorrect password!" });
        }

        // Passwords match, return user data
        return res.status(200).json(formatDataToSend(existingUser));
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

export const googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;

    const decodedUser = await getAuth().verifyIdToken(access_token);
    let { email, name, picture } = decodedUser;
    picture = picture.replace("s96-c", "s384-c");

    let user = await User.findOne({ "personal_info.email": email }).select(
      "personal_info.fullname personal_info.username personal_info.profile_img personal_info.google_auth"
    );

    if (user) {
      if (!user.personal_info.google_auth) {
        // Update user document to set google_auth to true
        await User.updateOne(
          { "personal_info.email": email },
          { "personal_info.google_auth": true }
        );
      }
    } else {
      let username = await generateUsername(email);
      user = new User({
        personal_info: {
          fullname: name,
          email,
          profile_img: picture,
          username,
        },
        google_auth: true, // Setingt google_auth to true here
      });

      await user.save();
    }

    return res.status(200).json(formatDataToSend(user));
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Failed to authenticate!" });
  }
};
