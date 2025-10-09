import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../assets/styles/return_books.css";

import api from "../api/api";
import NavbarSidebar from "../components/NavbarSidebar";

const ReturnBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);

  const [userRole, setUserRole] = useState("user");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api
      .get("/borrowed")
      .then((res) => {
        setBorrowedBooks(res.data);
      })
      .catch((err) => console.error("Failed to fetch borrowed books", err));

    api
      .get("/members")
      .then((res) => {
        setMembers(res.data);
      })
      .catch((err) => console.error("Failed to fetch members", err));

    api
      .get("/books")
      .then((res) => {
        setBooks(res.data.data);
      })
      .catch((err) => console.error("Failed to fetch books", err));
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "user";
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
    toast.success("Logged out successfully!");
  };

  const getMemberName = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    return member?.name || "Unknown Member";
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
      toast.error("Error Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="home">
        <NavbarSidebar />
        <div className="main-content">
          <div className="return-books">
            <div className="return-books-list">
              <h3>Return Book</h3>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnBooks;
