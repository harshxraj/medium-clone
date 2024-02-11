import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/UserAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/Editor";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});
  const { pathname } = useLocation();

  useEffect(() => {
    let userInSession = lookInSession("user");
    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ access_token: null });
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      {!pathname.startsWith("/editor") && <Navbar />}
      <Routes>
        <Route path="/signin" element={<UserAuthForm type="sign-in" />}></Route>
        <Route path="/signup" element={<UserAuthForm type="sign-up" />}></Route>
        <Route path="/editor" element={<Editor />}></Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
