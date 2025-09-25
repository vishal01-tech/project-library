import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './login.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", server: "" });
  const navigate = useNavigate();

  // Email validation regex
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  // Password validation (min 6 chars)
  const validatePassword = (password) => password.length >= 6;

  const handleChange = (e, field) => {
    const value = e.target.value;
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    setErrors((prev) => ({ ...prev, [field]: "", server: "" }));
  };

  const handleBlur = (e, field) => {
    const value = e.target.value;
    let error = "";

    if (field === "email") {
      if (!value.trim()) {
        error = "Email is required.";
      } else if (!validateEmail(value)) {
        error = "Invalid email format.";
      }
    } else if (field === "password") {
      if (!value.trim()) {
        error = "Password is required.";
      } else if (!validatePassword(value)) {
        error = "Password must be at least 6 characters.";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error, server: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    let newErrors = { email: "", password: "", server: "" };
    let valid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrors((prev) => ({ ...prev, server: "Invalid credentials" }));
        } else {
          setErrors((prev) => ({ ...prev, server: "Server error" }));
        }
        return;
      }

      const data = await response.json();

      // Store token for future authenticated requests
      localStorage.setItem("access_token", data.access_token);

      // Redirect to a protected page (home)
      navigate("/home");
    } catch (error) {
      setErrors((prev) => ({ ...prev, server: "Network error" }));
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <nav className="nav">
        <h3>Chapter House</h3>
        <div className="sign-up">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </nav>

      <div className="img">
        <img src="./images/image.png" alt="Library" />
      </div>

      <div className="login-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">
              Email <span>*</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleChange(e, "email")}
              onBlur={(e) => handleBlur(e, "email")} // Trigger validation on blur
              required
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">
              Password <span>*</span>
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => handleChange(e, "password")}
              onBlur={(e) => handleBlur(e, "password")} // Trigger validation on blur
              required
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {errors.server && <div className="server-error">{errors.server}</div>}

          <div className="btn">
            <button type="submit">Log In</button>
          </div>

          <Link to="/forgotpassword">
            <p className="forgot-button">Forgot Password?</p>
          </Link>
        </form>
      </div>
    </>
  );
};

export default Login;
