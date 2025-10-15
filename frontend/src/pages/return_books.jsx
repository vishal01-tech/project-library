import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../assets/styles/return_books.css";

import api from "../api/api";
import NavbarSidebar from "../components/NavbarSidebar";
import Cookies from "js-cookie";

const ReturnBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMembers, setfilterMembers] = useState([]);
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
    Cookies.remove("access_token");
    Cookies.remove("email");
    toast.success("Logged out successfully!");
  };

  const getMemberName = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    return member?.name || "Unknown Member";
  };
  const getMemberEmail = (memberId) => {
    const member = members.find((m) => m.id === memberId)
    return member?.email || "Email not found"
  };

  const getBookTitle = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    return book?.title || "Unknown Book";
  };

   useEffect(() => {
     // filter members by name
     if (searchQuery.trim() === "") {
       setfilterMembers(members);
     } else {
       const filtered = members.filter((member) =>
         member.name.toLowerCase().includes(searchQuery.toLowerCase())
       );
       setfilterMembers(filtered);
     }
   }, [members, searchQuery]);
  
  const filteredBorrowedBooks = borrowedBooks.filter((borrow) =>
    filterMembers.some((member) => member.id === borrow.member_id)
  );

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
        <NavbarSidebar handleLogout={handleLogout} />
        <div className="main-content">
          <div className="return-books">
            <div className="return-books-list">
              <h3>Return Book</h3>
              <input
                type="text"
                placeholder="Search member by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
              />
              <table>
                <thead>
                  <tr>
                    <th>Member Name</th>
                    <th>Email</th>
                    <th>Book Title</th>
                    <th>Borrowed At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBorrowedBooks.length === 0 ? (
                    <tr>
                      <td colSpan="4">No books are currently borrowed</td>
                    </tr>
                  ) : (
                    filteredBorrowedBooks.map((borrowed) => (
                      <tr key={borrowed.id}>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnBooks;
