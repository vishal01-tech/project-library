import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../assets/styles/issue_books.css";

// import "../home/Home.css";
import NavbarSidebar from "../components/NavbarSidebar";
import api from "../api/api";

const IssueBooks = () => {
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    member_id: "",
    book_id: ""
  });
  const [errors, setErrors] = useState({});

  const [userRole, setUserRole] = useState('user');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api.get("/members")
      .then((response) => setMembers(response.data))
      .catch((err) => console.error("Failed to fetch members", err));

    api.get("/books")
      .then((response) => setBooks(response.data.data))
      .catch((err) => console.error("Failed to fetch books", err));
  }, []);

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'user';
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
    toast.success("Logged out successfully!");
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await api.post("/issuebook", {
        member_id: parseInt(formData.member_id),
        book_id: parseInt(formData.book_id)
      });
      const result = response.data;
      if (response.status === 200) {
        toast.success("Book issued successfully!");
        setFormData({member_id: "", book_id: ""});
      } else {
        toast.error(result.detail || "Failed to issue book.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="home">
      <NavbarSidebar/>
      <div className="main-content">
        <div className="issue-books">
          <div className="issue-books-form">
            <h3>Issue Book</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueBooks;
