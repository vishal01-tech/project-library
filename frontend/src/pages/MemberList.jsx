import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import NavbarSidebar from "../components/NavbarSidebar";
import Pagination from "../components/Pagination";
import "../assets/styles/MemberList.css";
import api from "../api/api";
import Footer from "../components/Footer";

function MemberList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [members, setMembers] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [inputValue, setInputValue] = useState(searchQuery);
  const [filterMembers, setFilterMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit")) || 10);

  // Fetch members
  const fetchMembers = async (page = 1, search = searchQuery) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) {
        params.append("search", search);
      }
      const response = await api.get(`/members?${params.toString()}`);
      const data = response.data;
      setMembers(data.data);
      setTotalPages(Math.ceil(data.total / limit));
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      setCurrentPage(1);
      setSearchParams({ page: "1", limit: limit.toString(), search: value });
    }, 500),
    [limit, setSearchParams]
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

  // Fetch borrowed books
  const fetchBorrowed = async () => {
    try {
      const response = await api.get("/borrowed?limit=10000");
      const data = response.data;
      setBorrowed(data.data || []);
    } catch (error) {
      console.error("Failed to fetch borrowed books:", error);
    }
  };

  // Fetch books
  const fetchBooks = async () => {
    try {
      const response = await api.get("/books?limit=10000");
      const data = response.data;
      setBooks(data.data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Update URL params when state changes
  useEffect(() => {
    setSearchParams({
      page: currentPage.toString(),
      limit: limit.toString(),
      search: searchQuery,
    });
  }, [currentPage, limit, searchQuery, setSearchParams]);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchBorrowed(),
        fetchBooks(),
        fetchMembers(currentPage, searchQuery),
      ]);
      setLoading(false);
    };
    fetchData();
  }, [searchQuery]); // Empty dependency array to run only once when component mounts

  // Process data to map members to their borrowed books
  const memberBorrowedMap = {};
  borrowed.forEach((borrow) => {
    if (!memberBorrowedMap[borrow.member_id]) {
      memberBorrowedMap[borrow.member_id] = [];
    }
    const book = books.find((book) => book.id === borrow.book_id);
    if (book) {
      memberBorrowedMap[borrow.member_id].push({ ...borrow, book });
    }
  });

  const membersWithBorrowed = members.filter(
    (member) => memberBorrowedMap[member.id]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavbarSidebar />
      <div className="main">
        <div className="member-list">
          <h3>Members with Borrowed Books</h3>
          <div className="search-and-dropdown">
            <input
              type="text"
              placeholder="Search member by name"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                handleSearchChange(e);
              }}
              className="search-bar"
            />
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setCurrentPage(1);
                fetchMembers(1, searchQuery);
              }}
              className="members-per-page-dropdown"
            >
              <option value={10}>Books Per Page</option>
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
                <th>Borrowed Books</th>
              </tr>
            </thead>
            <tbody>
              {membersWithBorrowed.length === 0 ? (
                <tr>
                  <td colSpan="6">No members have borrowed books</td>
                </tr>
              ) : (
                membersWithBorrowed.map((member, index) => (
                  <tr key={member.id}>
                    <td>{(currentPage - 1) * limit + (index + 1)}</td>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{member.address}</td>
                    <td>
                      <ul>
                        {memberBorrowedMap[member.id].map((borrow) => (
                          <li key={borrow.id}>
                            {borrow.book.title} by {borrow.book.author}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                fetchMembers(page, searchQuery);
              }}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MemberList;
