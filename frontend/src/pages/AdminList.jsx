import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import NavbarSidebar from "../components/NavbarSidebar";
import Pagination from "../components/Pagination";
import "../assets/styles/AdminList.css";
import api from "../api/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function AdminList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [inputValue, setInputValue] = useState(search);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const email = Cookies.get("email");
    setUserEmail(email);
    if (email === "admin@gmail.com") {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  const fetchUsers = async () => {
    try {
      const params = { page: currentPage, limit, search };
      const response = await api.get("/users", { params });
      setUsers(response.data.data.users);
      setTotalUsers(response.data.data.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString(), search });
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setCurrentPage(1);
      setSearchParams({ page: "1", search: value });
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  // Debounce utility function
  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <>
      <NavbarSidebar userEmail={userEmail} />
      <div className="main">
        <div className="admin-list">
          <h3>Admin List</h3>
          <div className="search-and-dropdown">
            <input
              type="text"
              placeholder="Search by name or email"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                handleSearchChange(e);
              }}
            />
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setCurrentPage(1);
                setSearchParams({ page: "1", search });
              }}
              className="users-per-page-dropdown"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={150}>150</option>
              <option value={200}>200</option>
              <option value={300}>300</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5">No admin found</td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{(currentPage - 1) * limit + index + 1}</td>
                    <td>{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AdminList;
