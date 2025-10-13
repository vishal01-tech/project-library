import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, isAuthRequired = true }) => {
  const navigate = useNavigate();
  const token = Cookies.get("access_token");

  useEffect(() => {
    if (isAuthRequired && !token) {
      // If auth required but no token, redirect to login
      navigate("/");
    } else if (!isAuthRequired && token) {
      // If no auth required but token exists (e.g., login page), redirect to home
      navigate("/home");
    }
  }, [token, isAuthRequired, navigate]);

  // If auth required and no token, don't render children
  if (isAuthRequired && !token) {
    return null;
  }

  // If no auth required but token exists, don't render (will redirect)
  if (!isAuthRequired && token) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
