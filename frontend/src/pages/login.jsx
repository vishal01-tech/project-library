import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "../assets/styles/login.css";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Field validation function
  const validateField = (value, field) => {
    switch (field) {
      case "email":
        if (!value.trim()) return "Email is required.";
        // if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
        //   return "Invalid email format.";
        break;
      case "password":
        if (!value.trim()) return "Password is required.";
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

  // Handle input blur when losing focus
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

    setIsLoading(true);

    try {
      const response = await api.post("/login", {
        email: email,
        password: password,
      });


      // Set cookie for backend auth
      Cookies.set("access_token", response.data.data.access_token, { expires: 3 / 24 }); // 3 hours
      Cookies.set("email", response.data.data.email, { expires: 3 / 24 }); // 3 hours


      // Show a success toast
      toast.success("Login successful..");

      // Redirect to home page after login
      navigate("/home");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Please try again");
      }
    } finally {
      setIsLoading(false);
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
              required />
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
              required />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="btn">
            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span> Logging In...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </div>

          <Link to="/forgotpassword">
            <p className="forgot-button">Forgot Password?</p>
          </Link>
        </form>
      </div>
    </>
  );
}
  

export default Login;
