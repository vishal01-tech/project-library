import { useState, useEffect, useCallback } from "react";
import "../assets/styles/Home.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import NavbarSidebar from "../components/NavbarSidebar";
import Pagination from "../components/Pagination";
import api from "../api/api";
import Cookies from "js-cookie";
import Footer from "../components/Footer";

function Home() {
  const baseURL = api.defaults.baseURL;
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [inputValue, setInputValue] = useState(searchQuery);
  const [userRole, setUserRole] = useState("user");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [booksPerPage, setBooksPerPage] = useState(
    parseInt(searchParams.get("limit")) || 12
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Get user role from cookie
    const role = Cookies.get("email") || "admin";
    setUserRole(role);

    // Fetch books based on URL params
    fetchBooks(currentPage, searchQuery);
  }, [currentPage, searchQuery, booksPerPage]);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    // Update URL params when state changes
    setSearchParams({
      page: currentPage.toString(),
      limit: booksPerPage.toString(),
      search: searchQuery,
    });
  }, [currentPage, booksPerPage, searchQuery, setSearchParams]);

  const fetchBooks = async (page = 1, search = searchQuery) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: booksPerPage.toString(),
      });
      if (search) {
        params.append("search", search);
      }
      const response = await api.get(`/books?${params.toString()}`);
      const data = response.data;
      setBooks(data.data);
      setFilteredBooks(data.data);
      setTotalBooks(data.total);
      setTotalPages(Math.ceil(data.total / booksPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      alert("Failed to fetch books.");
    }
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      setCurrentPage(1);
      setSearchParams({
        page: "1",
        limit: booksPerPage.toString(),
        search: value,
      });
    }, 500),
    [booksPerPage, setSearchParams]
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

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await api.delete(`/books/${bookId}`);
        if (response.status === 200) {
          await fetchBooks(currentPage);
        } else {
          alert("Failed to delete book");
        }
      } catch (error) {
        console.error("Failed to delete book:", error);
        alert("Failed to delete book");
      }
    }
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    navigate("/");
  };

  return (
    <>
      <div className="home">
        <NavbarSidebar userRole={userRole} handleLogout={handleLogout} />
        <div className="main-content">
          <div className="header-row">
            <h2>All Books</h2>
            <div className="search-and-dropdown-home">
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  handleSearchChange(e);
                }}
                className="search-bar-home"
              />
              <select
                value={booksPerPage}
                onChange={(e) => {
                  setBooksPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="books-per-page-dropdown"
              >
                <option value={12}>Books Per Page</option>
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
            <div className="addbooks">
              <Link to="/managebooks"> ➕ Add Books</Link>
            </div>
          </div>
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-image">
                  {book.image ? (
                    <img src={`${baseURL}${book.image}`} alt={book.title} />
                  ) : (
                    <div className="no-image">Image not available</div>
                  )}
                </div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="author">by {book.author}</p>
                  <p className="category">{book.category}</p>
                  <p className="quantity">Available: {book.quantity}</p>
                </div>
                <div className="book-actions">
                  <button
                    className="action-btn update-btn"
                    onClick={() => navigate(`/manage-books/${book.id}`)}
                  >
                    Update
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={fetchBooks}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
