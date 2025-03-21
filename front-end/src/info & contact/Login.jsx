import React, { useState, useContext } from "react";
import img from "/images/men/banner/login.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { auth } from "../info & contact/Firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { AppContext } from "../data managment/AppProvider";
import { Helmet } from "react-helmet-async";

const Login = ({ onSubmit }) => {
  const navigate = useNavigate();
  const { setGoogleUser, setFormUser, logout, updateLoginStatus } =
    useContext(AppContext);
  const [status, setStatus] = useState("idle");

  const [loginFormData, setLoginFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!loginFormData.email || !loginFormData.password) {
      return alert("Enter your information please");
    }
    if (onSubmit) {
      onSubmit(loginFormData);
      return; // Skip the emailjs logic in tests
    }
    setFormUser(loginFormData);
    updateLoginStatus(true);
    navigate("/cart", { replace: true });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const provider = new GoogleAuthProvider();

  const googleLogin = (e) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setGoogleUser({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        });
        updateLoginStatus(true);
        navigate("/cart", { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const googleLogout = (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        console.log("Logout has been succeeded");
        setGoogleUser(null);
        updateLoginStatus(false);
        logout();
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Login</title>
        <meta name="description" content="Login to your account" />
      </Helmet>
      <div className="headerimages">
        <img src={img} alt="login" loading="lazy" className="detailImg" />
      </div>
      <div className="loginContainer">
        <h1>Sign in to your account</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            name="name"
            onChange={handleChange}
            type="name"
            placeholder="Name"
            value={loginFormData.name}
            className="googleInput"
          />
          <input
            name="email"
            onChange={handleChange}
            type="email"
            placeholder="Email address"
            value={loginFormData.email}
            className="googleInput"
          />
          <input
            name="password"
            onChange={handleChange}
            type="password"
            placeholder="Password"
            value={loginFormData.password}
            className="googleInput"
          />

          <button
            type="submit"
            disabled={status === "submitting"}
            className="addCart"
          >
            {status === "submitting" ? "Logging in ..." : "Sign in"}
          </button>
          <Link className="addCart" to="/" onClick={logout}>
            Sign out
          </Link>
        </form>

        <div className="googleContainer">
          <div className="googleLogin" onClick={googleLogin}>
            <p>Sign in with Google</p>
            <FaGoogle />
          </div>
          <Link className="addCart" to="/" onClick={googleLogout}>
            Google Sign out
          </Link>
        </div>
        <Link className="addCart" to="/signup">
          Create An Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
