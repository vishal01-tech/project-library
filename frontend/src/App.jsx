import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import SignUp from "./components/signup";
import ForgotPassword from "./components/forgot_password"
import ResetPassword from "./components/reset_password";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        {/* <Route path="/home" element={<Home />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
