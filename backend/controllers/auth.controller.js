import bcrypt from "bcrypt";
import User from "../Schema/User.js";
import { formatDataToSend, generateUsername } from "../utils/auth.utils.js";
import admin from "firebase-admin";
// import serviceAccountKey from "../firebase-key.json" assert { type: "json" };
import { getAuth } from "firebase-admin/auth";

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const serviceAccountKey = {
  type: "service_account",
  project_id: "medium-clone-4f4ea",
  private_key_id: "a085945d0e5ab5c3ab5cbc0966761d8bac4e0a2d",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDBL+Au9dfcdjTm\nAGN6o7AD5wo0bmVVBfiwMV18XXsDdrlBwGiVif2BqdlFzBagK4bgfrfV5p+uxC/S\nPHhvY6W+N4BsWj6WXiRERG8s9xaQMSqofiAqwxKSj/zeb1P0M1aAbWeiv4QOYuPK\nbJIVveJQ9ZaRW0njiCZLJQXcoDYOwXDIdPwycCfbgek4MoWcstpLAfEoxYhU5Epm\njyuvZ+jxKXnlei0kqfzrp0oI4XrPFVU1GfThB4KlWZNksqbejF955198NAAZC/fV\nARRbJahNnRj74eCYrpl47GSkXTap2uNaevq+R3BokutKZZeXkUNhNk+MWhflo42J\ncxKlZ+PfAgMBAAECggEAPOGnH3WHnSk9e3yE3TnntxshKqvd0GEs4e30vcRCB7Hr\nKS8HZpURqMLLv8TVHo4JGAenTMg865lVTsaS19vJ+HvKQ5tfHQk3GbKNbNjDqhZs\nkKQK5B8M49ZvxPPFu/BP4vJXlkEPz27XxcvYb/Si9Yun81AXJZcbJlRZGBH/Zz9/\nMSzGdFwkpuCMpfS3SnERfsGleUM8MEnON+5XeuS1LBdb2XId3gnhfTIM6h54kTsn\nEBknw+jjqPTaDXAVWZqILgOvOf637PAyB5BLhDX6duuHGUNiZsE08WrdpsvSlpIh\nycWaGA1HiE67fZtb9spX0YUcX7NBHx3gJ4M+GhzU1QKBgQD2Yqcu4eknmCjv++SN\nY3fF3YGQCjwL3MFUYxjBSQ1i2QvHdVnFaAkoGzknu8pUhJAHyYhZPQbcoN8VyG3a\n6wr6BZB2bxIhoCG+AGM1g2u0NVrKavEViLpqFLMBfhzr+eYQxLRARpUS/oZXE4gF\naT8z2FeY4XgMr9aE3fVsfJIt+wKBgQDIucfIWtnmCo0bSm4rM8QufYnyCVbKkeGL\n3CBVX/+0cqFLn7rfuxgp7Ge8n3Z4kQoPwhh0baLcZXAr9gTqX1S6OSYdTm4H80Ib\nV4KOn0ks674Trh5eGKEGUB2b+OXvBX9mfucWUZov+rUz9PA7Fe352Fj5DrRYfQQx\nxefkLf3wbQKBgHHKxmQEumYrBF0x/TC/y8V6tCgOUgU4g6Gx0vESCDiq/aG1NSzT\nC8eWKyOKu7ulLdAq5+ovIUgslFu/Id2FyKAIidvpGHqnNm5GR4ujks68BZ6PHaFQ\ncKglvzblQ/5IgFUmRAmbj6YiH3F/98ZoAWS0emCFYaiaXX0n9f2Q2wKZAoGAPNVB\nHRGbtEJCXaEDHojDzisx4W6/JQltR8vg6L79ahzLkXXJVwEG473H+ryBVSzv1bLH\nYpHPp+f+RPR8rONTdFTZnkwkwLgSsuKkqMDRlpGju6crgO0J8DXbo2edmAEciV2w\nf20fw6bBwAtduyp8Qxo0bNbuBVtuJ/+ItfjSW0kCgYBdl/3Y/D0dMRpcntvxwrGF\nJZ6pVuMM/APlu7a6GxMt6RjuwgRTwmQ2H5VLtVqgDr/xHUgCQAnM6KCE+Z1ckaot\n+E+5JeqBddnUc2Ra8Or73kR04FuSZJ9ZabD6DLzWQp5Hh12Mx563OY+sb3iSk++u\n8CjWXxd0tOKhoTidhWm5Kw==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-dwo14@medium-clone-4f4ea.iam.gserviceaccount.com",
  client_id: "114517356335579330336",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dwo14%40medium-clone-4f4ea.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

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
