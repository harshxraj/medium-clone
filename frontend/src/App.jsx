import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/UserAuthForm.page";
import Editor from "./pages/Editor";
import Homepage from "./pages/Homepage";
import SearchPage from "./pages/SearchPage";
import PageNotFound from "./pages/404";
import ProfilePage from "./pages/ProfilePage";
import BlogPage from "./pages/BlogPage";
import SideNav from "./components/ui/SideNav";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePwdPage from "./pages/ChangePwdPage";
import ManageBlogs from "./pages/ManageBlogs";
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({});

const App = () => {
  const { pathname } = useLocation();

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const themeFromLs = localStorage.getItem("medium-theme");

    if (themeFromLs) {
      setTheme(() => {
        document.body.setAttribute("data-theme", themeFromLs);

        return themeFromLs;
      });
    } else {
      document.body.setAttribute("data-theme", theme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {!pathname.startsWith("/editor") && <Navbar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signin" element={<UserAuthForm type="sign-in" />} />
        <Route path="/signup" element={<UserAuthForm type="sign-up" />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/dashboard" element={<SideNav />}>
          <Route path="blogs" element={<ManageBlogs />} />
        </Route>
        <Route path="/settings" element={<SideNav />}>
          <Route path="edit-profile" element={<EditProfilePage />} />
          <Route path="change-password" element={<ChangePwdPage />} />
        </Route>
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/user/:id" element={<ProfilePage />} />
        <Route path="/blog/:id" element={<BlogPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </ThemeContext.Provider>
  );
};

export default App;
