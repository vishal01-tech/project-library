import { useState, useEffect } from "react";
import "../assets/styles/Home.css";
import {useNavigate } from "react-router-dom";
import NavbarSidebar from "../components/NavbarSidebar";
import api from "../api/api"; 

const Home = () => {
  const baseURL = api.defaults.baseURL;
  const [books, setBooks] = useState([]);
  const [userRole, setUserRole] = useState("user");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user role from localStorage or cookie
    const role = localStorage.getItem("userRole") || "user";
    setUserRole(role);

    // Fetch books
    fetchBooks();
  }, []);

  const fetchBooks = async (page = 1) => {
    try {
      const response = await api.get(`/books?page=${page}&limit=12`);
      const data = response.data;
      setBooks(data.data);
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
    localStorage.removeItem("access_token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("email");
    // Clear cookie
    document.cookie = "access_token=; path=/; max-age=0";
    // Navigate to login
    navigate("/");
  };

  return (
    <div className="home">
      <NavbarSidebar userRole={userRole} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="main-content">
        <h2>All Books</h2>
        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-image">
                <img
                  src={`${baseURL}${book.image}`}
                  alt={book.title}
                  onError={(e) => {
                    e.target.src = "/images/image.png";
                  }}
                />
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
};

export default Home;
