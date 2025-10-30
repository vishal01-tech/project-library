import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "../assets/styles/Home.css";

function NavbarSidebar({ userRole }) {
  const [username, setUsername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("isSidebarOpen");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("isSidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);
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
      <nav className="navbar">
        <div className="navbar-left">
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
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
                <Link to="/" onClick={handleLogout}>
                  <button className="log-out">Log Out</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <Link
            to="/home"
            className={`sidebar-link ${
              location.pathname === "/home" ? "active" : ""
            }`}
          >
            🏠 All Books
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
            📋 Borrowed Books
          </Link>
          <Link to="/members" className={`sidebar-link ${location.pathname === "/members" ? "active" : ""}`}> 🧑‍💼 Members List</Link>
          {(userRole === "super_admin" ||
            Cookies.get("email") === "admin@gmail.com") && (
            <Link
              to="/signup"
              className={`sidebar-link ${
                location.pathname === "/signup" ? "active" : ""
              }`}
            >
              ➕ Add Admin
            </Link>
          )}
          {(userRole === "super_admin" ||
            Cookies.get("email") === "admin@gmail.com") && (
            <Link
              to="/adminlist"
              className={`sidebar-link ${
                location.pathname === "/adminlist" ? "active" : ""
              }`}
            >
              🧑‍💼 Admin List
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default NavbarSidebar;
