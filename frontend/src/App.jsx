import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import SignUp from "./components/sign_up/signup";
import Forgotpassword from "./components/forgot_password/forgot_password";
import ResetPassword from "./components/reset_password/reset_password";
import Home from "./components/home/Home";
import AddMember from "./components/add_member/add_member";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/addmember" element={<AddMember/>} />
        <Route path="/managebooks" element={<manage_books />} />
        <Route path="/issuebooks" element={<issue_books />} />
      </Routes>
    </Router>
  );
}

export default App;
