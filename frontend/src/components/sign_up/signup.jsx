import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [usersExist, setUsersExist] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUsersExist = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/users/exists");
        const result = await response.json();
        setUsersExist(result.exists);
      } catch (err) {
        console.error("Error checking if users exist:", err);
      }
    };
    checkUsersExist();
  }, []);

  const validateField = (name, value) => {
    let message = "";
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    switch (name) {
      case "fullname":
        if (!value.trim()) message = "Fullname is required.";
        break;
      case "username":
        if (!value.trim()) message = "Username is required.";
        break;
      case "email":
        if (!value.trim()) message = "Email is required.";
        else if (!emailRegex.test(value)) message = "Invalid email format.";
        break;
      case "password":
        if (!value.trim()) message = "Password is required.";
        else if (value.length < 6)
          message = "Password must be at least 6 characters.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const validateForm = () => {
    const fieldNames = ["fullname", "username", "email", "password"];
    const newErrors = {};

    fieldNames.forEach((field) => {
      validateField(field, formData[field]);
      if (formData[field].trim() === "" || errors[field]) {
        newErrors[field] = errors[field] || "This field is required.";
      }
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const response = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("User created successfully!");
        setFormData({
          fullname: "",
          username: "",
          email: "",
          password: "",
          role: "user",
        });
        navigate("/"); // Redirect to login
      } else {
        alert(result.detail || "Signup failed.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-img">
        <img src="./images/image.png" alt="Signup visual" />
      </div>

      <div className="signup-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>
              Fullname <span>*</span>
            </label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your fullname"
            />
            {errors.fullname && (
              <span className="error">{errors.fullname}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              Username <span>*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your username"
            />
            {errors.username && (
              <span className="error">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              Email <span>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>
              Password <span>*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              Role <span>*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              {!usersExist && <option value="super_admin">Super Admin</option>}
            </select>
          </div>

          <button type="submit" className="button">
            Create Account
          </button>

          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
