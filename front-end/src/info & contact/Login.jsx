import React from "react";
import { useState } from "react";
import img from "../images/men/banner/login.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
const Login = ({ setLogin }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginFormData.email || !loginFormData.password) {
      return alert("enter your information please");
    }

    setLoginFormData({ ...loginFormData });
    setLoginFormData("");
    setLogin(true);

    navigate("/cart");
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const googleLogin = (e) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setLogin(true);

        navigate("/cart");
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(auth);
  };
  const googleLogout = (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        console.log("logout has been ssucceded");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="headerimages">
        <img src={img} alt="" className="detailImg" />
      </div>
      <div className="loginContainer">
        <h1>Sign in to your account</h1>
        <form onSubmit={handleSubmit} className="login-form">
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

          <button disabled={status === "submitting"} className="addCart">
            {status === "submitting" ? "logging in ..." : "Sign in"}
          </button>
          <Link className="addCart" to="/">
            Sign out
          </Link>
        </form>

        <div className="googleContainer">
          <div className="googleLogin" onClick={googleLogin}>
            <p>Sign in with google</p>
            <FaGoogle />
          </div>
          <Link className="addCart" onClick={googleLogout}>
            sign out
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
