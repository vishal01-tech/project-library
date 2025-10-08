import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import "../assets/styles/manage_books.css";

import NavbarSidebar from "../components/NavbarSidebar";


const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormdata] = useState({
    title: "",
    author: "",
    quantity: "",
    category: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchBooks();
  }, []);

  const [userRole, setUserRole] = useState("user");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "user";
    setUserRole(role);
  }, []);

  useEffect(() => {
    if (id) {
      fetchBookDetails(id);
    }
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
  };

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      const data = response.data;
      setBooks(data.data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  const fetchBookDetails = async (bookId) => {
    try {
      const response = await api.get(`/books/${bookId}`);
      if (response.status === 200) {
        const data = response.data;
        setEditingBook(data);
        setFormdata({
          title: data.title,
          author: data.author,
          quantity: data.quantity.toString(),
          category: data.category,
          image: null,
        });
        if (data.image) {
          setImagePreview(
            data.image.startsWith("/media")
              ? `api${data.image}`
              : data.image
          );
        }
      } else {
        console.error("Failed to fetch book details");
      }
    } catch (error) {
      console.error("Failed to fetch book details:", error);
    }
  };

  // Validate individual fields
  const validateField = (name, value) => {
    let message = "";

    if (!value || typeof value !== "string") {
      message = `${name} is required`;
    } else {
      switch (name) {
        case "title":
          if (!value.trim()) message = "Title is required";
          break;
        case "author":
          if (!value.trim()) message = "Author is required";
          break;
        case "quantity":
          if (!value.trim()) message = "Quantity is required";
          break;
        case "category":
          if (!value.trim()) message = "Category is required";
          break;
        default:
          break;
      }
    }
    return message;
  };

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {};
    const fieldNames = ["title", "author", "quantity", "category"];

    fieldNames.forEach((field) => {
      const fieldValue = formData[field];
      const message = validateField(field, fieldValue);
      if (message) newErrors[field] = message;
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = editingBook
        ? `api/${editingBook.id}`
        : "api/addbooks";
      const method = editingBook ? "PUT" : "POST";

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("category", formData.category);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          editingBook ? "Book updated successfully" : "Book added successfully"
        );
        setFormdata({
          title: "",
          author: "",
          quantity: "",
          category: "",
          image: null,
        });
        setImagePreview(null);
        setEditingBook(null);
        fetchBooks();
      } else {
        console.error("Error response:", result);
        alert(result.detail || "Failed to save book");
      }
    } catch (err) {
      console.error("Error during fetch:", err);
      alert("Please try again");
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormdata({
      title: book.title,
      author: book.author,
      quantity: book.quantity.toString(),
      category: book.category,
      image: null,
    });
    // Set preview to existing image if available
    if (book.image) {
      setImagePreview(
        book.image.startsWith("/media")
          ? `api${book.image}`
          : book.image
      );
    } else {
      setImagePreview(null);
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await api.delete(`/books/${bookId}`);
        if (response.status === 200) {
          alert("Book deleted successfully");
          fetchBooks();
        } else {
          alert("Failed to delete book");
        }
      } catch (error) {
        console.error("Failed to delete book:", error);
        alert("Failed to delete book");
      }
    }
  };

  const handleCancel = () => {
    setEditingBook(null);
    setFormdata({
      title: "",
      author: "",
      quantity: "",
      category: "",
      image: null,
    });
    setImagePreview(null);
  };

  return (
    <div className="home">
      <NavbarSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userRole={userRole}
        handleLogout={handleLogout}
      />
      <div className="main-content">
        <div className="manage-container">
          {/* <div className="manage-img">
            <img src="./images/image.png" alt="Library" />
          </div> */}
          <div className="add-books">
            <h3>Add Books</h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="title">
                  Title <span>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter the title"
                />
                {errors.title && <span className="error">{errors.title}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="author">
                  Author <span>*</span>
                </label>
                <input
                  type="text"
                  name="author"
                  id="author"
                  value={formData.author}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter the author name"
                />
                {errors.author && (
                  <span className="error">{errors.author}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="quantity">
                  Quantity <span>*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter the quantity"
                />
                {errors.quantity && (
                  <span className="error">{errors.quantity}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="category">
                  Category <span>*</span>
                </label>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select from here</option>
                  <option value="history">History</option>
                  <option value="biography">Biography</option>
                  <option value="drama">Drama</option>
                  <option value="poetry">Poetry</option>
                  <option value="thriller">Thriller</option>
                  <option value="mystery">Mystery</option>
                  <option value="horror">Horror</option>
                </select>
                {errors.category && (
                  <span className="error">{errors.category}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="image">Upload Image</label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormdata((prev) => ({ ...prev, image: file }));
                      const previewUrl = URL.createObjectURL(file);
                      setImagePreview(previewUrl);
                    }
                  }}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      marginTop: "10px",
                    }}
                  />
                )}
              </div>
              <div className="form-buttons">
                <button type="submit" className="button">
                  {editingBook ? "UPDATE" : "ADD"}
                </button>
                {/* {editingBook && (
                  <button
                    type="button"
                    className="button cancel-btn"
                    onClick={handleCancel}
                  >
                    CANCEL
                  </button>
                )} */}
              </div>
            </form>
          </div>
        </div>
        <div className="books-list">
          <h2>Books</h2>
          <div className="books-table">
            {books.map((book) => (
              <div key={book.id} className="book-row">
                <div className="book-details">
                  <img
                    src={`http://127.0.0.1:8000${book.image}`}
                    alt={book.title}
                    className="book-thumb"
                    onError={(e) => {
                      e.target.src = "/images/image.png";
                    }}
                  />
                  <div className="book-text">
                    <h3>{book.title}</h3>
                    <p>by {book.author}</p>
                    <p>Category: {book.category}</p>
                    <p>Quantity: {book.quantity}</p>
                  </div>
                </div>
                <div className="book-actions">
                  <button className="edit-btn" onClick={() => handleEdit(book)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;
