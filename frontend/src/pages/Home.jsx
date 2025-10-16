import { useState, useEffect } from "react";
import "../assets/styles/Home.css";
import {useNavigate } from "react-router-dom";
import NavbarSidebar from "../components/NavbarSidebar";
import api from "../api/api";
import Cookies from "js-cookie";



function Home() {
  const baseURL = api.defaults.baseURL;
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user role from cookie
    const role = Cookies.get("email") || "user";
    setUserRole(role);

    // Fetch books
    fetchBooks();
  }, []);

  useEffect(() => {
    // Refetch books when search query changes
    fetchBooks(1, searchQuery);
  }, [searchQuery]);

  const fetchBooks = async (page = 1, search = searchQuery) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      });
      if (search) {
        params.append('search', search);
      }
      const response = await api.get(`/books?${params.toString()}`);
      const data = response.data;
      setBooks(data.data);
      setFilteredBooks(data.data);
      setTotalBooks(data.total);
      setTotalPages(Math.ceil(data.total / 12));
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      alert("Failed to fetch books.");
    }
  };

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
    <div className="home">
      <NavbarSidebar userRole={userRole} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="main-content">
        <div className="header-row">
          <h2>All Books</h2>
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
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
                  ✏️ Update
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteBook(book.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => fetchBooks(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => fetchBooks(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
