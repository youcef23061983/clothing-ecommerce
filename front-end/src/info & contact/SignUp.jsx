import React, { useEffect, useState } from "react";
import img from "../images/men/banner/signup.jpg";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  useEffect(() => {
    document.title = "SignUp";
  }, []);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setFormData({
      ...formData,
    });
    navigate("/cart");
    setFormData("");
  };

  return (
    <div>
      <div className="headerimages">
        <img src={img} alt="" className="detailImg" />
      </div>
      <div className="loginContainer">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username" className="inputLabel">
            Username:
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
            />
          </label>
          <br />
          <label htmlFor="email" className="inputLabel">
            Email:
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          </label>
          <br />
          <label htmlFor="password" className="inputLabel">
            Password:
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
            />
          </label>
          <br />
          <label htmlFor="confirmPassword" className="inputLabel">
            Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
            />
          </label>
          <br />
          <button type="submit" className="addCart">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
