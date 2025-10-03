import React, { useState, useEffect } from "react";
import "./issue_books.css";
import "../home/Home.css";
import NavbarSidebar from "../NavbarSidebar";

const IssueBooks = () => {
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    member_id: "",
    book_id: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [userRole, setUserRole] = useState('user');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.member_id) newErrors.member_id = "Member is required";
    if (!formData.book_id) newErrors.book_id = "Book is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    setErrors({...errors, [e.target.name]: ""});
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/issuebook", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          member_id: parseInt(formData.member_id),
          book_id: parseInt(formData.book_id)
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage("Book issued successfully!");
        setFormData({member_id: "", book_id: ""});
      } else {
        setMessage(result.detail || "Failed to issue book.");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="home">
      <NavbarSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userRole={userRole} handleLogout={handleLogout} />
      <div className="main-content">
        <div className="issue-books">
          <div className="issue-books-img">
            <img src="./images/image.png" alt="image not found" />
          </div>

          <div className="issue-books-form">
            <h2>Issue Book</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Member <span>*</span></label>
                <select name="member_id" value={formData.member_id} onChange={handleChange}>
                  <option value="">Select Member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
                {errors.member_id && <span className="error">{errors.member_id}</span>}
              </div>

              <div className="form-group">
                <label>Book <span>*</span></label>
                <select name="book_id" value={formData.book_id} onChange={handleChange}>
                  <option value="">Select Book</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>{book.title}</option>
                  ))}
                </select>
                {errors.book_id && <span className="error">{errors.book_id}</span>}
              </div>

              <button type="submit" className="button">Issue Book</button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueBooks;
