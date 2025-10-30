import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Forgotpassword from "./pages/forgot_password";
import ResetPassword from "./pages/reset_password";
import Home from "./pages/Home";
import AddMember from "./pages/add_member";
import ManageBooks from "./pages/manage_books";
import IssueBooks from "./pages/issue_books";
import ReturnBooks from "./pages/return_books";
import NotFound from "./pages/NotFound";
import MemberList from "./pages/MemberList";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminList from "./pages/AdminList";
import Members from "./pages/Members";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public routes - redirect to home if logged in */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthRequired={false}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgotpassword"
          element={
            <ProtectedRoute isAuthRequired={false}>
              <Forgotpassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resetpassword"
          element={
            <ProtectedRoute isAuthRequired={false}>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Protected routes - require login */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addmember"
          element={
            <ProtectedRoute>
              <AddMember />
            </ProtectedRoute>
          }
        />
        <Route
          path="/managebooks"
          element={
            <ProtectedRoute>
              <ManageBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-books/:id"
          element={
            <ProtectedRoute>
              <ManageBooks />
            </ProtectedRoute>
          }
        />
        <Route path="/members" element={
          <ProtectedRoute>
            <Members/>
          </ProtectedRoute>
        }
        />
        <Route
          path="/issuebooks"
          element={
            <ProtectedRoute>
              <IssueBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/returnbooks"
          element={
            <ProtectedRoute>
              <ReturnBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/memberlist"
          element={
            <ProtectedRoute>
              <MemberList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <ProtectedRoute>
              <SignUp />
            </ProtectedRoute>
          }
        />
        <Route path="/adminlist" element={
          <ProtectedRoute>
            <AdminList />
          </ProtectedRoute>
        }/>

        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* <Footer/> */}
    </Router>
  );
}

export default App;
