import "../assets/styles/Footer.css";

const Footer = () => {
  return (
    <>
      <div className="footer-container">
        <div className="footer-section first">
          <h2>Library Management System</h2>
          <p>
            Welcome to our digital library platform — a space for managing,
            borrowing, and discovering books effortlessly. Designed to simplify
            the way libraries operate and readers connect with knowledge.
          </p>
        </div>

        <div className="footer-section second">
          <h2>| Quick Links</h2>
          <a href="/">Home</a>
          <a href="/books">Books</a>
          <a href="/students">Students</a>
          <a href="/contact">Contact Us</a>
        </div>

        <div className="footer-section third">
          <h2>| Policies</h2>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/rules">Library Rules</a>
          <a href="/help">Help & Support</a>
        </div>

        <div className="footer-section fourth">
          <h2>| Connect With Us</h2>
          <div className="social-icons">
            {/* Instagram */}
            <a href="#" className="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="35"
                fill="currentColor"
                className="bi bi-instagram"
                viewBox="0 0 16 16"
              >
                <path
                  fill="red"
                  d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
              </svg>
            </a>

            {/* Facebook */}
            <a href="#" className="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="35"
                height="35"
              >
                <path
                  fill="#1877F2"
                  d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"
                />
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="#" className="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="35"
                height="35"
              >
                <path
                  fill="#0A66C2"
                  d="M100.28 448H7.4V148.9h92.88V448zM53.79 108.1C24.09 108.1 0 83.5 0 53.8 0 24.1 24.1 0 53.79 0c29.69 0 53.8 24.1 53.8 53.8 0 29.7-24.11 54.3-53.8 54.3zM447.9 448h-92.4V302.4c0-34.7-.7-79.2-48.2-79.2-48.2 0-55.6 37.7-55.6 76.6V448h-92.5V148.9h88.8v40.9h1.3c12.3-23.4 42.3-48.2 87.1-48.2 93.2 0 110.4 61.4 110.4 141.3V448z"
                />
              </svg>
            </a>

            {/* YouTube */}
            <a href="#" className="icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                width="35"
                height="35"
              >
                <path
                  fill="#FF0000"
                  d="M549.7 124.1c-6.3-23.7-24.9-42.3-48.6-48.6C458.8 64 288 64 288 64s-170.8 0-213.1 10.9c-23.7 6.3-42.3 24.9-48.6 48.6C16.4 166.4 16.4 256 16.4 256s0 89.6 9.9 131.9c6.3 23.7 24.9 42.3 48.6 48.6C117.2 448 288 448 288 448s170.8 0 213.1-10.9c23.7-6.3 42.3-24.9 48.6-48.6 9.9-42.3 9.9-131.9 9.9-131.9s0-89.6-9.9-131.9z"
                />
                <path fill="#FFFFFF" d="M232 338.5v-165l142 82.5-142 82.5z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-section fifth">
          <h2>© 2025 Library Management System. All Rights Reserved.</h2>
        </div>
      </div>
    </>
  );
};

export default Footer;
