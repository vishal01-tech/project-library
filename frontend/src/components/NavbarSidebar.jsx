import React from "react";
import { Link } from "react-router-dom";
import './home/Home.css';

const NavbarSidebar = ({ sidebarOpen, setSidebarOpen, userRole, handleLogout }) => {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <h1>The Chapter House</h1>
        </div>
        <div className="navbar-right">
          <Link to="/" onClick={handleLogout}>
            <button className="log-out">Log Out</button>
          </Link>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
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
          {userRole === 'super_admin' && (
            <Link to="/signup" className="sidebar-link">
              <span></span> Add User
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default NavbarSidebar;
