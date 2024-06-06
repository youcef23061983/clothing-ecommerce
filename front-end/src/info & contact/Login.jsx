import React, { useState, useEffect } from "react";
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
    name: "",
    email: "",
    password: "",
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedLoginFormData = localStorage.getItem("loginFormData");
    if (savedLoginFormData) {
      setLoginFormData(JSON.parse(savedLoginFormData));
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("loginFormData", JSON.stringify(loginFormData));
  }, [loginFormData]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginFormData.email || !loginFormData.password) {
      return alert("Enter your information please");
    }

    setLogin(true);
    navigate("/cart");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const googleLogin = (e) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setUser(user);
        setLogin(true);
        navigate("/cart");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const googleLogout = (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        // localStorage.removeItem("user");

        console.log("Logout has been succeeded");
        setLoginFormData(null);
        setLogin(false);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formLogout = () => {
    // localStorage.removeItem("loginFormData");
    setLoginFormData({
      email: "",
      password: "",
    });
    setUser(null);
    setLogin(false);
    navigate("/");
  };
  console.log("login name:", loginFormData.name);
  return (
    <div>
      <div className="headerimages">
        <img src={img} alt="" className="detailImg" />
      </div>
      <div className="loginContainer">
        <h1>Sign in to your account</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            name="name"
            onChange={handleChange}
            type="name"
            placeholder="name"
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

          <button disabled={status === "submitting"} className="addCart">
            {status === "submitting" ? "Logging in ..." : "Sign in"}
          </button>
          <Link className="addCart" to="/" onClick={formLogout}>
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
