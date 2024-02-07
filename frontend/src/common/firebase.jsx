import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHwpBBQJfDl9f7vkOPd7n57csv1K3MbRU",
  authDomain: "medium-clone-4f4ea.firebaseapp.com",
  projectId: "medium-clone-4f4ea",
  storageBucket: "medium-clone-4f4ea.appspot.com",
  messagingSenderId: "464495310639",
  appId: "1:464495310639:web:2e04e90bcc1430e6e213da",
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => (user = result.user))
    .catch((err) => console.log(err));

  return user;
};
