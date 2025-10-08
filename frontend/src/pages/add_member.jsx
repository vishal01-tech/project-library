import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/add_member.css";
import api from "../api/api";
import NavbarSidebar from "../components/NavbarSidebar";

const AddMember = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('user');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'user';
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
  };

  const validateField = (name, value) => {
    let message = "";
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Check if the value exists before trimming
    if (!value || typeof value !== "string") {
      message = `${name} is required.`;
    } else {
      switch (name) {
        case "fullname":
          if (!value.trim()) message = "Fullname is required.";
          break;
        case "phone":
          if (!value.trim()) message = "Phone number is required.";
          break;
        case "email":
          if (!value.trim()) message = "Email is required.";
          else if (!emailRegex.test(value)) message = "Invalid email format.";
          break;
        case "address":
          if (!value.trim()) message = "Address is required"
          break
        default:
          break;
      }
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const validateForm = () => {
    const fieldNames = ["name", "phone", "email","address"];
    const newErrors = {};

    fieldNames.forEach((field) => {
      const fieldValue = formData[field];
      validateField(field, fieldValue);
      if (!fieldValue || fieldValue.trim() === "" || errors[field]) {
        newErrors[field] = errors[field] || "This field is required.";
      }
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await api.post("/addmember", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        alert("Added member successfully!");
        setFormData({
          name: "",
          phone: "",
          email: "",
          address:""
        });
        navigate("/home"); // Redirect to home page
      } else {
        alert(result.detail || "Add member failed.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="home">
      <NavbarSidebar/>
      <div className="main-content">
        <div className="add-member">
          {/* <div className="add-member-img">
            <img src="./images/image.png" alt="image not found" />
          </div> */}

          <div className="add-member-form">
            <h3>Add Member</h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>
                  Fullname <span>*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your fullname"
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>
                  Phone <span>*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label>
                  Email <span>*</span>
                </label>
                <input
                  id="email"
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
                <label htmlFor="address">Address <span>*</span></label>
                <input type="address" id="address" name="address" value={formData.address} onChange={handleChange} onBlur={handleBlur} placeholder="Enter your address" />
                {errors.address && <span className="error">{ errors.address}</span>}
              </div>

              <button type="submit" className="button">
                Add Member
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMember;
