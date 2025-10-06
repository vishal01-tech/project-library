import React, { useState, useEffect } from "react";
import "./return_books.css";
import "../home/Home.css";
import NavbarSidebar from "../NavbarSidebar";

const ReturnBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");

  const [userRole, setUserRole] = useState('user');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/borrowed")
      .then((res) => res.json())
      .then((data) => setBorrowedBooks(data))
      .catch((err) => console.error("Failed to fetch borrowed books", err));

    fetch("http://127.0.0.1:8000/members")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.error("Failed to fetch members", err));

    fetch("http://127.0.0.1:8000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Failed to fetch books", err));
  }, []);

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'user';
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
  };

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  const getBookTitle = (bookId) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Unknown';
  };

  const handleReturn = async (borrowedId) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/returnbook", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ borrowed_id: parseInt(borrowedId) }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage("Book returned successfully!");
        // Remove the returned book from the list
        setBorrowedBooks(borrowedBooks.filter(b => b.id !== borrowedId));
      } else {
        let errorMessage = "Failed to return book.";
        if (result.detail) {
          if (Array.isArray(result.detail)) {
            errorMessage = result.detail.map(err => err.msg).join(', ');
          } else {
            errorMessage = result.detail;
          }
        }
        setMessage(errorMessage);
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="home">
        <NavbarSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userRole={userRole}
          handleLogout={handleLogout}
        />
        <div className="main-content">
          <div className="return-books">
            {/* <div className="return-books-img">
              <img src="./images/image.png" alt="image not found" />
            </div> */}

            <div className="return-books-list">
              <h2>Return Book</h2>
              {borrowedBooks.length === 0 ? (
                <p>No books are currently borrowed.</p>
              ) : (
                <ul>
                  {borrowedBooks.map((borrowed) => (
                    <li key={borrowed.id} className="borrowed-item">
                      <div>
                        <strong>Member:</strong>{" "}
                        {getMemberName(borrowed.member_id)} <br />
                        <strong>Book:</strong> {getBookTitle(borrowed.book_id)}{" "}
                        <br />
                        <strong>Borrowed At:</strong>{" "}
                        {new Date(borrowed.borrowed_at).toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleReturn(borrowed.id)}
                        className="button"
                      >
                        Return Book
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {message && <p className="message">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnBooks;
