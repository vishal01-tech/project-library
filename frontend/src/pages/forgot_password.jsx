import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import '../assets/styles/forgot_password.css'

function Forgotpassword() {
  const [forgotEmail, setForgotEmail] = useState("");
  const [errors, setErrors] = useState("");

  // Validate Email
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(forgotEmail)) {
      setErrors("Please enter a email address.");
    } else {
      setErrors(""); // Clear errors if email is valid
      try {
        const response = await api.post("/forgot-password", { email: forgotEmail });
        if (response.status === 200 || response.status === 201) {
          alert(response.data.message);
          if (response.data.otp) {
            alert(`Your OTP is: ${response.data.otp}`);
          }
        } else {
          setErrors(response.data.detail || "Failed to send OTP");
        }
      } catch (error) {
        setErrors("Failed to send OTP");
      }
    }
  };

  return (
    <>
        <nav className="nav">
            <h3>LibraryApp</h3>
        </nav>
      <div className="forgot-img">
        <img src="./images/image.png" alt="image not found" />
      </div>
      <div className="forgot-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="forgot">
            <label htmlFor="email">
              Enter your registered email <span>*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            {errors && <div className="error-message">{errors}</div>}
          </div>
          <div className="forgot-btn">
            <button type="submit">Send OTP</button>
          </div>
          <p className="p">
            Remember Password? <Link to="/">Log In</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Forgotpassword;
