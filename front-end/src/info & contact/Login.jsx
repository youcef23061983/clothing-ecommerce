import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "/images/men/banner/login.jpg";
import { FaGoogle } from "react-icons/fa";
import { auth } from "../info & contact/Firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { AppContext } from "../data managment/AppProvider";
import { Helmet } from "react-helmet-async";

const Login = ({ onSubmit, setAuth }) => {
  const navigate = useNavigate();
  const { setFormUser, logout, setFirebaseUser } = useContext(AppContext);
  const [status, setStatus] = useState("idle");
  const [googlestatus, setGooglestatus] = useState("idle");
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    const { password, email } = loginFormData;
    e.preventDefault();
    setStatus("submitting");
    setError("");

    if (!loginFormData.email || !loginFormData.password) {
      setError("Please enter both email and password");
      setStatus("idle");
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(loginFormData);
        return;
      }
      const token = sessionStorage.getItem("token");
      const body = { email, password };
      const response = await fetch("http://localhost:3000/auth/signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      console.log("Full response:", parseRes);
      console.log("Token received:", parseRes.token);

      if (!response.ok) {
        setError(parseRes.message || "Login failed. Please try again.");
        return;
      }

      if (!parseRes.token) {
        throw new Error("No token received from server");
      }

      console.log(
        "Token stored in sessionStorage:",
        sessionStorage.getItem("token")
      );

      if (parseRes.token) {
        sessionStorage.setItem("token", parseRes.token);

        setAuth({
          isAuthenticated: true,
          user_role: parseRes.user?.user_role || "customer",
        });
        setFormUser(parseRes);
      } else {
        setAuth(null);
        sessionStorage.removeItem("token");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setStatus("idle");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({ ...prev, [name]: value }));
  };
  const provider = new GoogleAuthProvider();
  const googleLogin = async (e) => {
    e.preventDefault();
    try {
      setGooglestatus("submitting");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const payload = {
        email: user.email,
        firebase_uid: user.uid,
        username: user.displayName,
        provider: "google",
      };
      const res = await fetch("http://localhost:3000/auth/firebaseSignup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to login with Google");
      const data = await res.json();
      console.log("Logged in user:", data);
      if (data.token) {
        sessionStorage.setItem("token", data.token);
        setFirebaseUser({
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          user_role: data.user.user_role,
          firebase_uid: data.user.firebase_uid,
        });

        setAuth({
          isAuthenticated: true,
          user_role: parseRes.user?.user_role || "customer",
        });
      } else {
        setAuth(null);
      }
    } catch (error) {
      console.error("Google login error:", error.message);
    } finally {
      setGooglestatus("idle");
    }
  };

  const googleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setFormUser(null);
      setAuth(null);
      sessionStorage.removeItem("token");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error signing out:", err.message);
    }
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
          {error && <div className="error-message">{error}</div>}
        </form>

        <div className="googleContainer">
          <button
            onClick={googleLogin}
            disabled={googlestatus === "submitting"}
            className="googleLogin"
          >
            <p>
              {googlestatus === "submitting"
                ? "Signing in..."
                : "Sign in with Google"}
            </p>
            <FaGoogle />
          </button>
          <button className="addCart" onClick={googleLogout}>
            Sign out
          </button>
        </div>
        <Link className="addCart" to="/signup">
          Create An Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
