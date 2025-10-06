import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import SignUp from "./components/sign_up/signup";
import Forgotpassword from "./components/forgot_password/forgot_password";
import ResetPassword from "./components/reset_password/reset_password";
import Home from "./components/home/Home";
import AddMember from "./components/add_member/add_member";
import ManageBooks from "./components/manage_books/manage_books";
import IssueBooks from "./components/issue_books/issue_books";

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
        <Route path="/managebooks" element={<ManageBooks />} />
        <Route path="/manage-books/:id" element={<ManageBooks />} />
        <Route path="/issuebooks" element={<IssueBooks />} />
      </Routes>
    </Router>
  );
}

export default App;
