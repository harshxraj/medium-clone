import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/UserAuthForm.page";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Navbar />}></Route> */}
        <Route path="/signin" element={<UserAuthForm type="sign-in" />}></Route>
        <Route path="/signup" element={<UserAuthForm type="sign-up" />}></Route>
      </Routes>
    </div>
  );
};

export default App;
