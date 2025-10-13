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
                viewBox="0 0 448 512"
                width="35"
                height="35"
              >
                <path
                  fill="red"
                  d="M224 202.7c-35.1 0-63.6 28.4-63.6 63.6S188.9 330 224 330s63.6-28.4 63.6-63.6S259.1 202.7 224 202.7zm0-42.7c58.8 0 106.4 47.6 106.4 106.4S282.8 372.8 224 372.8 117.6 325.2 117.6 266.4 165.2 160 224 160zm138.4-46.9c0 10-8.1 18.1-18.1 18.1s-18.1-8.1-18.1-18.1 8.1-18.1 18.1-18.1 18.1 8.1 18.1 18.1zM448 144v224c0 79.5-64.5 144-144 144H144C64.5 512 0 447.5 0 368V144C0 64.5 64.5 0 144 0h160c79.5 0 144 64.5 144 144z"
                />
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
