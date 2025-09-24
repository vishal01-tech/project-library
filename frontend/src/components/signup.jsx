import React, { useState } from "react";
import "./signup.css";
import { Link } from "react-router-dom";

const UserForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Validate a single field onBlur
  const validateField = (name, value) => {
    let message = "";

    if (name === "fullname" && !value.trim()) {
      message = "Fullname is required.";
    }

    if (name === "username" && !value.trim()) {
      message = "Username is required.";
    }

    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!value.trim()) {
        message = "Email is required.";
      } else if (!emailRegex.test(value)) {
        message = "Invalid email format.";
      }
    }

    if (name === "password") {
      if (!value.trim()) {
        message = "Password is required.";
      } else if (value.length < 6) {
        message = "Password must be at least 6 characters.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: message,
    }));
  };

  // Validate the entire form on submit
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Fullname is required.";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert("User created successfully!");

      // Clear form after submission
      setFormData({
        fullname: "",
        username: "",
        email: "",
        password: "",
      });

      setErrors({});
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-img">
        <img src="./images/image.png" alt="image not found" />
      </div>

      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Fullname input */}
        <div className="form-group">
          <label htmlFor="fullname">
            Fullname <span>*</span>
          </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            placeholder="Enter your fullname"
          />
          {errors.fullname && <span className="error">{errors.fullname}</span>}
        </div>

        {/* Username input */}
        <div className="form-group">
          <label htmlFor="username">
            Username <span>*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            placeholder="Enter your username"
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        {/* Email input */}
        <div className="form-group">
          <label htmlFor="email">
            Email <span>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Password input */}
        <div className="form-group">
          <label htmlFor="password">
            Password <span>*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            placeholder="Enter your password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <button className="button" type="submit">
          Create User
        </button>

        <p>
          Already have an account? <Link to="/">Log In</Link>
        </p>
      </form>
    </div>
  );
};

export default UserForm;
