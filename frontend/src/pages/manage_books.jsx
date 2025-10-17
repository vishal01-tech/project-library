import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";
import "../assets/styles/manage_books.css";
import NavbarSidebar from "../components/NavbarSidebar";
import Cookies from "js-cookie";

function ManageBooks() {
  const baseURL = api.defaults.baseURL;
  const [books, setBooks] = useState([]); // now storing books properly
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
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

  const [userRole, setUserRole] = useState("user");

  // Fetch user role from localStorage
  useEffect(() => {
    const role = localStorage.getItem("userRole") || "user";
    setUserRole(role);
  }, []);

  // Fetch all books
  useEffect(() => {
    fetchBooks();
  }, []);

  // If editing, fetch book details
  useEffect(() => {
    if (id) fetchBookDetails(id);
  }, [id]);

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("email");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data.data || []);
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
        setFormData({
          title: data.title,
          author: data.author,
          quantity: data.quantity.toString(),
          category: data.category,
          image: null,
        });
        if (data.image) {
          setImagePreview(
            data.image.startsWith("/media")
              ? `${baseURL}${data.image}`
              : data.image
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch book details:", error);
    }
  };

  // Validation
  const validateField = (name, value) => {
    if (!value || !value.toString().trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    return "";
  };

  const validateForm = () => {
    const fieldNames = ["title", "author", "quantity", "category"];
    const newErrors = {};

    fieldNames.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const form = new FormData();
      form.append("title", formData.title);
      form.append("author", formData.author);
      form.append("quantity", formData.quantity);
      form.append("category", formData.category);
      if (formData.image) {
        form.append("image", formData.image);
      }

      let response;
      if (editingBook) {
        response = await api.put(`/books/${editingBook.id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.post("/books/", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          editingBook
            ? "Book updated successfully!"
            : "Book added successfully!"
        );
        setFormData({
          title: "",
          author: "",
          quantity: "",
          category: "",
          image: null,
        });
        setImagePreview(null);
        setEditingBook(null);
        fetchBooks();
      }
    } catch (err) {
      console.error("Error saving book:", err);
      toast.error("Failed to save book. Please try again.");
    }
  };

  return (
    <div className="home">
      <NavbarSidebar userRole={userRole} handleLogout={handleLogout} />
      <div className="main-content">
        <div className="manage-container">
          <div className="add-books">
            <h3>{editingBook ? "Edit Book" : "Add Book"}</h3>
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
                      setFormData((prev) => ({ ...prev, image: file }));
                      setImagePreview(URL.createObjectURL(file));
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
                  {editingBook ? "UPDATE" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageBooks;
