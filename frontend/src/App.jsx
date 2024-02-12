import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/UserAuthForm.page";
import Editor from "./pages/Editor";

const App = () => {
  const { pathname } = useLocation();

  return (
    <>
      {!pathname.startsWith("/editor") && <Navbar />}
      <Routes>
        <Route path="/signin" element={<UserAuthForm type="sign-in" />} />
        <Route path="/signup" element={<UserAuthForm type="sign-up" />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </>
  );
};

export default App;
