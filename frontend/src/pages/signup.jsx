import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "../assets/styles/signup.css";
import api from "../api/api";
import NavbarSidebar from "../components/NavbarSidebar";
import Footer from "../components/Footer";

function SignUp() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [userEmail, setUserEmail] = useState("");

  const [errors, setErrors] = useState({});
  const [usersExist, setUsersExist] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUsersExist = async () => {
      try {
        const response = await api.get("/users/exists");
        const result = response.data;
        setUsersExist(result.exists);
      } catch (err) {
        console.error("Error checking if users exist:", err);
      }
    };
    checkUsersExist();

    // Get user role from cookies
    const email = Cookies.get("email");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const validateField = (name, value) => {
    let message = "";
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    switch (name) {
      case "fullname":
        if (!value.trim()) message = "Fullname is required.";
        break;
      // case "username":
      //   if (!value.trim()) message = "Username is required.";
      //   break;
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
    return message;
  };

  const validateForm = () => {
    const fieldNames = ["fullname", "email", "password"];
    const newErrors = {};

    fieldNames.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await api.post("/signup", formData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Admin created successfully!");
        setFormData({
          fullname: "",
          // username: "",
          email: "",
          password: "",
          role: "admin",
        });
        navigate("/");
      } else {
        toast.error(response.data.detail || "Signup failed.");
      }
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.detail === "Email already registered"
      ) {
        toast.error("Email already registered");
      } else {
        toast.error("Please try again.");
      }
      console.error(err);
    }
  };

  return (
    <>
      <NavbarSidebar userEmail={userEmail} />
      <div className="signup-container">
        <div className="signup-form">
          <h3>Add User</h3>
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
            {/*
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
            </div> */}

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
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">Admin</option>
              </select>
              <button type="submit" className="button">
                Add Admin
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SignUp;
