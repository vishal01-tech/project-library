import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "../assets/styles/Home.css";

function NavbarSidebar({ userRole }) {
  const [username, setUsername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("email");
    Cookies.remove("username");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <button className="sidebar-toggle">☰</button>
          <h1>The Chapter House</h1>
        </div>
        <div className="navbar-right">
          <div
            className="user-profile"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="user-icon">👤︎ {username} </span>
            {isDropdownOpen && (
              <div className="user-dropdown">
                {/* <p>Logged in as: </p> */}
                <Link to="/" onClick={handleLogout}>
                  <button className="log-out">Log Out</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="sidebar">
        <div className="sidebar-content">
          <Link
            to="/home"
            className={`sidebar-link ${
              location.pathname === "/home" ? "active" : ""
            }`}
          >
            🏠 Home
          </Link>
          <Link
            to="/addmember"
            className={`sidebar-link ${
              location.pathname === "/addmember" ? "active" : ""
            }`}
          >
            👤 Add Member
          </Link>
          <Link
            to="/managebooks"
            className={`sidebar-link ${
              location.pathname === "/managebooks" ? "active" : ""
            }`}
          >
            📚 Add Books
          </Link>
          <Link
            to="/issuebooks"
            className={`sidebar-link ${
              location.pathname === "/issuebooks" ? "active" : ""
            }`}
          >
            📖 Issue Books
          </Link>
          <Link
            to="/returnbooks"
            className={`sidebar-link ${
              location.pathname === "/returnbooks" ? "active" : ""
            }`}
          >
            ⬅️ Return Books
          </Link>
          <Link
            to="/memberlist"
            className={`sidebar-link ${
              location.pathname === "/memberlist" ? "active" : ""
            }`}
          >
            📋 Member List
          </Link>
          {(userRole === "super_admin" ||
            Cookies.get("email") === "admin@gmail.com") && (
            <Link
              to="/signup"
              className={`sidebar-link ${
                location.pathname === "/signup" ? "active" : ""
              }`}
            >
              ➕ Add User
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default NavbarSidebar;
