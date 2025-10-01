import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./manage_books.css";

const ManageBooks = () => {
  const [FormData, setFormdata] = useState({
    title: "",
    author: "",
    quantity: "",
    category: ""
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); 

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

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const validateForm = () => {
    const fieldNames = ["title", "author", "quantity", "category"];
    const newErrors = {};

    fieldNames.forEach((field) => {
      const fieldValue = FormData[field]; // Correct this to FormData
      validateField(field, fieldValue);

      if (!fieldValue || fieldValue.trim() === "" || errors[field]) {
        newErrors[field] = errors[field] || "This field is required";
      }
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/addbooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FormData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Book added successfully");
        setFormdata({
          title: "",
          author: "",
          quantity: "",
          category: "",
        });
        navigate("/managebooks");
      } else {
        alert(result.detail || "Failed to add books");
      }
    } catch (err) {
      alert("Please try again");
    }
  };

  return (
    <div className="manage-container">
      <div className="manage-img">
        <img src="./images/image.png" alt="Library" />
      </div>
      <div className="add-books">
        <h2>Add Books</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">
              Title <span>*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={FormData.title}
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
              value={FormData.author}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter the author name"
            />
            {errors.author && <span className="error">{errors.author}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="quantity">
              Quantity <span>*</span>
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              value={FormData.quantity}
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
              value={FormData.category}
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
          <button type="submit" className="button">
            ADD
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageBooks;
