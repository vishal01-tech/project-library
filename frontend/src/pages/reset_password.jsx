import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "../assets/styles/reset_password.css";


function ResetPassword() {
  const [email, setEmail] = useState(localStorage.getItem('resetEmail') || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [step, setStep] = useState(1); // 1 for OTP verification, 2 for new password

  // Validate password strength (minimum 8 characters, at least one number and one letter)
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setErrors("Please enter the OTP.");
    } else {
      setErrors("");
      try {
        // First, verify OTP by attempting reset with dummy password or separate endpoint
        // Since backend verifies OTP in reset-password, we'll use a temporary check
        const response = await api.post("/verify-otp", { email, otp });
        if (response.status === 200) {
          setStep(2); // Move to password reset step
        } else {
          setErrors("Invalid OTP");
        }
      } catch (error) {
        setErrors("Invalid OTP");
      }
    }
  };

  // Handle password reset
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setErrors("Password must be at least 8 characters with at least one letter and one number.");
    } else if (password !== confirmPassword) {
      setErrors("Passwords do not match.");
    } else {
      setErrors("");
      try {
        const response = await api.post("/reset-password", { email, otp, new_password: password });
        if (response.status === 200 || response.status === 201) {
          alert(response.data.message);
          // Redirect to login or home
          window.location.href = "/";
        } else {
          setErrors(response.data.detail || "Failed to reset password");
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
        {step === 1 ? (
          <form onSubmit={handleOtpSubmit}>
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
                required
              />
            </div>
            {errors && <span className="error-message">{errors}</span>}
            <div className="reset-btn">
              <button type="submit">Verify OTP</button>
            </div>
            <p className="p">
              Remembered password? <Link to="/">Log In</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
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
                required
              />
            </div>
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
                required
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
        )}
      </div>
    </>
  );
}

export default ResetPassword;
