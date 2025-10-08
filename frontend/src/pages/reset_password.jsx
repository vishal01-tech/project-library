import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/reset_password.css";


function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");

  // Validate password strength (minimum 8 characters, at least one number and one letter)
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setErrors(
        "Password must be at entered it can not be empty."
      );
    } else if (password !== confirmPassword) {
      setErrors("Passwords do not match.");
    } else {
      setErrors(""); // Clear errors if password is valid
      try {
        const response = await fetch("http://localhost:8000/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp, new_password: password }),
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message);
        } else {
          setErrors(data.detail || "Failed to reset password");
        }
      } catch (error) {
        setErrors("Failed to reset password");
      }
    }
  };

  return (
    <>
      <div className="reset-img">
        <img src="./images/image.png" alt="image not found" />
      </div>
      <div className="reset-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="reset-0">
            <label htmlFor="email">
              Email <span>*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="reset-otp">
            <label htmlFor="otp">
              OTP <span>*</span>
            </label>
            <input
              type="text"
              name="otp"
              id="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div className="reset-1">
            <label htmlFor="password">
              New Password <span>*</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errors && <span className="error-message">{errors}</span>}
          <div className="reset-2">
            <label htmlFor="confirmPassword">
              Confirm Password <span>*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {errors && <span className="error-message">{errors}</span>}
          <div className="reset-btn">
            <button type="submit">Reset Password</button>
          </div>
          <p className="p">
            Remembered password? <Link to="/">Log In</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default ResetPassword;
