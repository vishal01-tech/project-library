import React, { useState, useEffect } from "react";
import './Home.css'
import { Link } from "react-router-dom";
import NavbarSidebar from "../NavbarSidebar";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [userRole, setUserRole] = useState('user');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Get user role from localStorage or cookie
    const role = localStorage.getItem('userRole') || 'user';
    setUserRole(role);

    // Fetch books
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  const handleAddBook = async (bookId) => {
    await fetchBooks();
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/books/${bookId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          await fetchBooks();
        } else {
          alert('Failed to delete book');
        }
      } catch (error) {
        console.error("Failed to delete book:", error);
        alert('Failed to delete book');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    // Clear any other auth data
  };

  return (
    <div className="home">
      <NavbarSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userRole={userRole} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="main-content">
        <h2>All Books</h2>
        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-image">
                <img
                  src={`http://127.0.0.1:8000${book.image}`}
                  alt={book.title}
                  onError={(e) => {
                    e.target.src = '/images/image.png';
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
                  className="action-btn add-btn"
                  onClick={() => handleAddBook(book.id)}
                >
                  Add
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
      </div>
    </div>
  );
};

export default Home;
