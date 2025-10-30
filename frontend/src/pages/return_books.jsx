import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../assets/styles/return_books.css";
import api from "../api/api";
import NavbarSidebar from "../components/NavbarSidebar";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";

function ReturnBooks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [inputValue, setInputValue] = useState(searchQuery);
  const [books, setBooks] = useState([]);
  const [userRole, setUserRole] = useState("user");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit")) || 10);

  const fetchBorrowedBooks = async (page = 1, search = searchQuery) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) {
        params.append("search", search);
      }
      console.log("Fetching borrowed books with params:", params.toString());
      const response = await api.get(`/borrowed?${params.toString()}`);
      console.log("Response:", response);
      const data = response.data;
      console.log("Data:", data);
      setBorrowedBooks(data.data);
      setTotalPages(Math.ceil(data.total / limit));
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch borrowed books:", error);
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

  useEffect(() => {
    api
      .get("/members?limit=10000")
      .then((res) => {
        setMembers(res.data.data);
      })
      .catch((err) => console.error("Failed to fetch members", err));

    api
      .get("/books?limit=10000")
      .then((res) => {
        setBooks(res.data.data);
      })
      .catch((err) => console.error("Failed to fetch books", err));
  }, []);

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

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "user";
    setUserRole(role);
  }, []);

  useEffect(() => {
    fetchBorrowedBooks(currentPage, searchQuery);
  }, [searchQuery]);
  const getMemberName = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    return member?.name || "Unknown Member";
  };
  const getMemberEmail = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    return member?.email || "Email not found";
  };

  const getBookTitle = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    return book?.title || "Unknown Book";
  };

  const handleReturn = async (borrowedId) => {
    try {
      const response = await api.post("/returnbook", {
        borrowed_id: parseInt(borrowedId),
      });
      const result = response.data;
      if (response.status === 200) {
        toast.success("Book returned successfully!");
        // Remove the returned book
        setBorrowedBooks(borrowedBooks.filter((b) => b.id !== borrowedId));
      } else {
        let errorMessage = "Failed to return book.";
        if (result.detail) {
          if (Array.isArray(result.detail)) {
            errorMessage = result.detail.map((err) => err.msg).join(", ");
          } else {
            errorMessage = result.detail;
          }
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="home">
        <NavbarSidebar userRole={userRole} />
        <div className="main-content">
          <div className="return-books">
            <div className="return-books-list">
              <h3>Return Book</h3>
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
                    fetchBorrowedBooks(1, searchQuery);
                  }}
                  className="borrowed-per-page-dropdown"
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
                    <th>Member Name</th>
                    <th>Email</th>
                    <th>Book Title</th>
                    <th>Borrowed At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowedBooks.length === 0 ? (
                    <tr>
                      <td colSpan="6">No member found by this name</td>
                    </tr>
                  ) : (
                    borrowedBooks.map((borrowed, index) => (
                      <tr key={borrowed.id}>
                        <td>{(currentPage - 1) * limit + (index + 1)}</td>
                        <td>{getMemberName(borrowed.member_id)}</td>
                        <td>{getMemberEmail(borrowed.member_id)}</td>
                        <td>{getBookTitle(borrowed.book_id)}</td>
                        <td>
                          {new Date(borrowed.borrowed_at).toLocaleString()}
                        </td>
                        <td>
                          <button
                            onClick={() => handleReturn(borrowed.id)}
                            className="button"
                          >
                            Return Book
                          </button>
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
                  onPageChange={fetchBorrowedBooks}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ReturnBooks;
