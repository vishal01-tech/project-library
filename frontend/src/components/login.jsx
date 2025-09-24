import React, { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  // Simple validation functions
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  // Handle input changes
  const handleChange = (e, field) => {
    const value = e.target.value;
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { email: "", password: "" };

    // Check if email is valid
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    // Check if password is valid
    if (!password.trim()) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    setErrors(newErrors);

    // If valid, submit the form; otherwise, show errors
    if (valid) {
      console.log("Form submitted");
      // You can handle the form submission logic here, like redirecting or calling an API
      setEmail("");
      setPassword("");
      setErrors({ email: "", password: "" });
    }
  };

  // Handle blur (validation)
  const handleBlur = (field) => {
    if (field === "email" && !email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
    } else if (field === "password" && !password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Password is required." }));
    } else if (field === "email" && !validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format." }));
    } else if (field === "password" && !validatePassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters.",
      }));
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
        <img src="./images/image.png" alt="image not found" />
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
              onBlur={() => handleBlur("email")}
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
              onBlur={() => handleBlur("password")}
              required
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

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
