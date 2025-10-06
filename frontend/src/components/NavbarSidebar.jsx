import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./home/Home.css";

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
            <span></span> Home
          </Link>
          <Link to="/addmember" className="sidebar-link">
            <span></span> Add Member
          </Link>
          <Link to="/managebooks" className="sidebar-link">
            <span></span> Manage Books
          </Link>
          <Link to="/issuebooks" className="sidebar-link">
            <span></span> Issue Books
          </Link>
          <Link to="/returnbooks" className="sidebar-link">
            <span></span> Return Books
          </Link>
          <Link to="/memberlist" className="sidebar-link">
            <span></span> Member List
          </Link>
          {(userRole === "super_admin" || email === "admin@gmail.com") && (
            <Link to="/signup" className="sidebar-link">
              <span></span> Add User
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default NavbarSidebar;
