import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./reset_password.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");

  // Validate password strength (minimum 8 characters, at least one number and one letter)
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setErrors(
        "Password must be at entered it can not be empty."
      );
    } else if (password !== confirmPassword) {
      setErrors("Passwords do not match.");
    } else {
      setErrors(""); // Clear errors if password is valid
      // Logic to reset the password goes here
      console.log("Password reset successfully");
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
