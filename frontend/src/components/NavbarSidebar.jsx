import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Home.css";



function NavbarSidebar({
  userRole, handleLogout,
}) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <h1>The Chapter House</h1>
        </div>
        <div className="navbar-right">
          <Link to="/" onClick={handleLogout}>
            <button className="log-out">Log Out</button>
          </Link>
        </div>
      </nav>

      <div className="sidebar open">
        <div className="sidebar-content">
          <Link to="/home" className="sidebar-link">
            Home
          </Link>
          <Link to="/addmember" className="sidebar-link">
             Add Member
          </Link>
          <Link to="/managebooks" className="sidebar-link">
             Manage Books
          </Link>
          <Link to="/issuebooks" className="sidebar-link">
           Issue Books
          </Link>
          <Link to="/returnbooks" className="sidebar-link">
            Return Books
          </Link>
          <Link to="/memberlist" className="sidebar-link">
            Member List
          </Link>
          {(userRole === "super_admin" || email === "admin@gmail.com") && (
            <Link to="/signup" className="sidebar-link">
               Add User
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default NavbarSidebar;
