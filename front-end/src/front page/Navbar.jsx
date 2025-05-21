import { FaAlignJustify } from "react-icons/fa";
import { LuShoppingCart, LuUserCircle2, LuSearch } from "react-icons/lu";
import { AppContext } from "../data managment/AppProvider";
import { Link, useNavigate } from "react-router-dom";
import { useLayoutEffect, useRef, useState, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import { auth } from "../info & contact/Firebase";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const [showLinks, setShowLinks] = useState(false);
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);
  const navCenter = useRef(null);
  const {
    user: contextUser,
    logout,
    amount,
    formUser,
    setFirebaseUser,
    setFormUser,
  } = useContext(AppContext);
  const [firebaseUser, loading] = useAuthState(auth);

  // Use either Firebase user or context user
  const currentUser = firebaseUser || contextUser;

  useLayoutEffect(() => {
    let isMounted = true;

    const handleScroll = () => {
      if (!isMounted || !navCenter.current) return;

      const scrollHeight = window.scrollY;
      const navCenterHeight = navCenter.current.getBoundingClientRect().height;
      const links = document.querySelectorAll(".navlink");
      const linkIcon = document.querySelectorAll(".linkIcon");
      const sale = document.querySelector(".sale");
      const displayNameElements = document.querySelectorAll(".displayName");

      if (scrollHeight > navCenterHeight) {
        navCenter.current.style.position = "fixed";
        navCenter.current.style.background = "white";
        navCenter.current.style.width = "100%";
        navCenter.current.style.transition = "all 0.8s linear";

        displayNameElements.forEach((el) => {
          el.style.color = "rgb(249, 175, 35)";
        });

        links.forEach((link) => {
          link.style.color = "rgb(249, 175, 35)";
        });

        if (sale) {
          sale.style.color = "red";
        }

        linkIcon.forEach((icon) => {
          icon.style.color = "rgb(249, 175, 35)";
        });
      } else {
        navCenter.current.style.background = "transparent";

        linkIcon.forEach((icon) => {
          icon.style.color = "white";
        });

        links.forEach((link) => {
          link.style.color = "white";
        });

        if (sale) {
          sale.style.color = "red";
        }

        displayNameElements.forEach((el) => {
          el.style.color = "white";
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      isMounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.5,
        type: "spring",
        stiffness: 50,
        when: "beforeChildren",
        staggerChildren: 0.5,
      },
    },
  };

  return (
    <motion.nav
      className="nav-center"
      ref={navCenter}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-testid="navbar"
    >
      <motion.div className="nav-header" variants={containerVariants}>
        <div className="logo">
          <Link to="">
            <img
              src="/images/desire.png"
              alt="logo"
              loading="lazy"
              className="img"
            />
          </Link>
        </div>

        <button
          className="nav-toggle"
          type="button"
          onClick={() => setShowLinks(!showLinks)}
          aria-label="Toggle navigation"
        >
          <FaAlignJustify />
        </button>
      </motion.div>

      <div ref={linksContainerRef}>
        <motion.div className="book" variants={containerVariants}>
          <div className="navSearch">
            <input type="text" placeholder="Search..." aria-label="Search" />
            <LuSearch className="linkIcon" />
          </div>

          <div className="cart">
            {currentUser ? (
              <div className="cart">
                <p className="displayName">
                  Welcome, {currentUser.displayName || currentUser.name}
                </p>

                <Link
                  to="/login"
                  className="linkIcon"
                  aria-label="User profile"
                >
                  {firebaseUser?.photoURL ? (
                    <img
                      src={firebaseUser.photoURL}
                      className="img"
                      style={{ borderRadius: "50%" }}
                      alt="Profile"
                      loading="lazy"
                    />
                  ) : (
                    <LuUserCircle2 />
                  )}
                </Link>
                <Link
                  className="displayName"
                  onClick={async (e) => {
                    e.preventDefault(); // Prevent navigation until signOut completes
                    try {
                      await signOut(auth);
                      setFirebaseUser(null);
                      setFormUser(null);
                      sessionStorage.removeItem("token");

                      navigate("/", { replace: true });
                    } catch (err) {
                      console.error("Error signing out:", err.message);
                    }
                  }}
                >
                  Logout
                </Link>
              </div>
            ) : formUser ? (
              <div className="cart">
                <p className="displayName">
                  Welcome, {formUser?.user?.username}
                </p>
                <Link className="linkIcon">
                  <LuUserCircle2 />
                </Link>
                <Link className="displayName" onClick={logout}>
                  Logout
                </Link>
              </div>
            ) : (
              <Link className="displayName" to="/login">
                Login
              </Link>
            )}

            <div className="shoppingContainer">
              <Link className="linkIcon" to="/cart" aria-label="Shopping cart">
                <LuShoppingCart className="cart-icon" />
              </Link>
              {amount > 0 && (
                <div className="navAmount">
                  <p className="amountTag">{amount}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={containerVariants}>
          <ul
            className={`${showLinks ? "links show-nav" : "links"}`}
            ref={linksRef}
          >
            <li>
              <Link to="/" className="sale navlink">
                Shop
              </Link>
            </li>
            <li>
              <Link className="navlink" to="new" data-testid="display-name">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link className="navlink" to="story">
                Our Story
              </Link>
            </li>
            <li>
              <Link className="navlink" to="contact">
                Contact Us
              </Link>
            </li>
            <li>
              <Link className="navlink" to="signup">
                Sign Up
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
