import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/UserAuthForm.page";
import Editor from "./pages/Editor";
import Homepage from "./pages/Homepage";
import SearchPage from "./pages/SearchPage";
import PageNotFound from "./pages/404";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const { pathname } = useLocation();

  return (
    <>
      {!pathname.startsWith("/editor") && <Navbar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signin" element={<UserAuthForm type="sign-in" />} />
        <Route path="/signup" element={<UserAuthForm type="sign-up" />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/user/:id" element={<ProfilePage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
