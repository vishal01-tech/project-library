import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import NavbarSidebar from "../components/NavbarSidebar";
import Pagination from "../components/Pagination";
import "../assets/styles/MemberList.css";
import api from "../api/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [inputValue, setInputValue] = useState(search);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalMembers, setTotalMembers] = useState(0);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit")) || 10);

  useEffect(() => {
    const email = Cookies.get("email");
    setUserEmail(email);
    fetchMembers();
  }, [currentPage, search, limit]);

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  const fetchMembers = async () => {
    try {
      const params = { page: currentPage, limit, search };
      const response = await api.get("/members", { params });
      setMembers(response.data.data);
      setTotalMembers(response.data.total);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      toast.error("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString(), search, limit: limit.toString() });
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setCurrentPage(1);
      setSearchParams({ page: "1", search: value, limit: limit.toString() });
    }, 500),
    [limit]
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

  const totalPages = Math.ceil(totalMembers / limit);

  return (
    <>
      <NavbarSidebar userEmail={userEmail} />
      <div className="main">
        <div className="member-list">
          <h3>Members List</h3>
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
                setSearchParams({ page: "1", search, limit: e.target.value });
              }}
              className="members-per-page-dropdown"
            >
              <option value={10}>Members Per Page</option>
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
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="5">No members found</td>
                </tr>
              ) : (
                members.map((member, index) => (
                  <tr key={member.id}>
                    <td>{(currentPage - 1) * limit + index + 1}</td>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{member.address}</td>
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

export default Members;
