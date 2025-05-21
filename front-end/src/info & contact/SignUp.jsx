import React, { useEffect, useState } from "react";
import img from "/images/men/banner/signup.jpg";
import { useNavigate } from "react-router-dom";

const SignUp = ({ onSubmit }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      const body = { username, email, password };
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (!response.ok) {
        alert(parseRes.message || "Signup failed");
        return;
      }
      console.log(parseRes.token);

      sessionStorage.setItem("token", parseRes.token);
      navigate("/cart");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signupPage">
      <div className="headerimages">
        <img
          src={img}
          alt="Sign up banner"
          loading="lazy"
          className="detailImg"
        />
      </div>

      <div className="loginContainer">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="formGroup">
            <label htmlFor="username" className="inputLabel">
              Username:
            </label>
            <input
              type="text"
              name="username"
              id="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="email" className="inputLabel">
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password" className="inputLabel">
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="confirmPassword" className="inputLabel">
              Confirm Password:
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
            />
          </div>

          <button type="submit" className="addCart">
            Sign Up{" "}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
