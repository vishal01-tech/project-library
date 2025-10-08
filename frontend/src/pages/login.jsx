import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api"; 
import { toast, ToastContainer } from "react-toastify"; 
import "../assets/styles/login.css";

import "react-toastify/dist/ReactToastify.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Field validation function
  const validateField = (value, field) => {
    switch (field) {
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
          return "Invalid email format.";
        break;
      case "password":
        if (!value.trim()) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
        break;
      default:
        return "";
    }
    return "";
  };

  // Handle input change
  const handleChange = (e, field) => {
    const value = e.target.value;
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    setErrors((prev) => ({ ...prev, [field]: "" })); // Reset error on input change
  };

  // Handle input blur (on lose focus)
  const handleBlur = (e, field) => {
    const value = e.target.value;
    const error = validateField(value, field);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    // Reset errors before submission
    let newErrors = { email: "", password: "" };
    let valid = true;

    // Validate both fields
    const emailError = validateField(email, "email");
    const passwordError = validateField(password, "password");

    if (emailError) {
      newErrors.email = emailError;
      valid = false;
    }
    if (passwordError) {
      newErrors.password = passwordError;
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    try {
      const response = await api.post("/login", {
        email: email,
        password: password,
      });

      console.log("Login successful", response.data);

      // Store tokens and user details in local storage after successful login
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("email", response.data.email);

      // Set cookie for backend auth
      document.cookie = `access_token=${response.data.access_token}; path=/; max-age=${30 * 60}`; // 30 minutes

      // Show a success toast
      toast.success("Login successful! Redirecting...");

      // Redirect to home page after login
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error.response?.data);

      // If server returns specific error messages, display them
      if (error.response?.status === 401) {
        if (error.response?.data?.message === "Invalid email") {
          setErrors((prev) => ({ ...prev, email: "Email is incorrect." }));
          toast.error("Email is incorrect.");
        } else if (error.response?.data?.message === "Invalid password") {
          setErrors((prev) => ({
            ...prev,
            password: "Password is incorrect.",
          }));
          toast.error("Password is incorrect.");
        }
      } else {
        // Generic error message if not specifically handled
        setErrors((prev) => ({
          ...prev,
          password: "An error occurred. Please try again.",
        }));
        toast.error("An error occurred. Please try again.");
      }
    }
  }

  return (
    <>
      <nav className="nav">
        <h3>LibraryApp</h3>
      </nav>

      <div className="img">
        <img src="./images/image.png" alt="Library" loading="lazy" />
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
              onBlur={(e) => handleBlur(e, "email")}
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
              onBlur={(e) => handleBlur(e, "password")}
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

      {/* Toast Container for displaying toast messages */}
      <ToastContainer />
    </>
  );
};

export default Login;
