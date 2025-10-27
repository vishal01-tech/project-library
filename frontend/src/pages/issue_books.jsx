import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../assets/styles/issue_books.css";
import NavbarSidebar from "../components/NavbarSidebar";
import api from "../api/api";
import Cookies from "js-cookie";
import Footer from "../components/Footer";

function IssueBooks() {
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    member_phone: "",
    book_id: "",
  });
  const [errors, setErrors] = useState({});
  const [bookSearch, setBookSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showBookDropdown, setShowBookDropdown] = useState(false);
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    api
      .get("/members")
      .then((response) => setMembers(response.data.data || []))
      .catch((err) => console.error("Failed to fetch members", err));

    api
      .get("/books")
      .then((response) => setBooks(response.data.data))
      .catch((err) => console.error("Failed to fetch books", err));
  }, []);

  // useEffect(() => {
  //   const role = localStorage.getItem("userRole") || "user";
  //   setUserRole(role);
  // }, []);
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    Cookies.remove("access_token");
    Cookies.remove("email");
    toast.success("Logged out successfully!");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.member_phone) newErrors.member_phone = "Member is required";
    if (!formData.book_id) newErrors.book_id = "Book is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("member_phone", formData.member_phone);
      formDataToSend.append("book_id", formData.book_id);

      const response = await api.post("/issuebook", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const result = response.data;
      if (response.status === 200) {
        toast.success("Book issued successfully!");
        setFormData({ member_phone: "", book_id: "" });
        setBookSearch("");
        setMemberSearch("");
      } else {
        toast.error(result.detail || "Failed to issue book.");
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
          <div className="issue-books">
            <div className="issue-books-form">
              <h3>Issue Book</h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label>
                    Search Member <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name or number"
                    value={memberSearch}
                    onChange={(e) => {
                      setMemberSearch(e.target.value);
                      setShowMemberDropdown(true);
                    }}
                    onFocus={() => setShowMemberDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowMemberDropdown(false), 200)
                    }
                  />
                  {showMemberDropdown && memberSearch && (
                    <div className="dropdown-list">
                      {members
                        .filter(
                          (member) =>
                            member.name
                              .toLowerCase()
                              .includes(memberSearch.toLowerCase()) ||
                            member.phone.toString().includes(memberSearch)
                        )
                        .map((member) => (
                          <div
                            key={member.id}
                            className="dropdown-item"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                member_phone: member.phone,
                              });
                              setMemberSearch(
                                `${member.name} - ${member.phone}`
                              );
                              setShowMemberDropdown(false);
                              setErrors({ ...errors, member_phone: "" });
                            }}
                          >
                            {member.name} - {member.phone}
                          </div>
                        ))}
                    </div>
                  )}
                  {errors.member_phone && (
                    <span className="error">{errors.member_phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Search Book <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Search by title or author"
                    value={bookSearch}
                    onChange={(e) => {
                      setBookSearch(e.target.value);
                      setShowBookDropdown(true);
                    }}
                    onFocus={() => setShowBookDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowBookDropdown(false), 200)
                    }
                  />
                  {showBookDropdown && bookSearch && (
                    <div className="dropdown-list">
                      {books
                        .filter(
                          (book) =>
                            book.title
                              .toLowerCase()
                              .includes(bookSearch.toLowerCase()) ||
                            book.author
                              .toLowerCase()
                              .includes(bookSearch.toLowerCase())
                        )
                        .map((book) => (
                          <div
                            key={book.id}
                            className="dropdown-item"
                            onClick={() => {
                              setFormData({ ...formData, book_id: book.id });
                              setBookSearch(`${book.title} by ${book.author}`);
                              setShowBookDropdown(false);
                              setErrors({ ...errors, book_id: "" });
                            }}
                          >
                            {book.title} by {book.author}
                          </div>
                        ))}
                    </div>
                  )}
                  {errors.book_id && (
                    <span className="error">{errors.book_id}</span>
                  )}
                </div>

                <button type="submit" className="button">
                  Issue Book
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default IssueBooks;
