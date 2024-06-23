import { FaAlignJustify } from "react-icons/fa";
import { LuShoppingCart, LuUserCircle2, LuSearch } from "react-icons/lu";
import { AppContext } from "../data managment/AppProvider";
import { Link } from "react-router-dom";
import {
  useLayoutEffect,
  useRef,
  useState,
  useContext,
  useEffect,
} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
// import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";
import { auth } from "../info & contact/Firebase";

const Navbar = () => {
  const [showLinks, setShowLinks] = useState(false);
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);
  const navCenter = useRef(null);

  const { googleUser, formUser, logout, amount, setLoginFormData } =
    useContext(AppContext);
  // const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    // Retrieve login form data from localStorage when component mounts
    const savedLoginFormData = localStorage.getItem("loginFormData");
    if (savedLoginFormData) {
      setLoginFormData(JSON.parse(savedLoginFormData));
    }
  }, []);
  useLayoutEffect(() => {
    let isMounted = true;

    const handleScroll = () => {
      if (!isMounted) {
        return;
      }

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
        displayNameElements.forEach((displayNameElement) => {
          displayNameElement.style.color = "rgb(249, 175, 35)";
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
        displayNameElements.forEach((displayNameElement) => {
          displayNameElement.style.color = "white";
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      isMounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Define a variable to hold the display name
  // let displayName;

  // if (user) {
  //   displayName = user.displayName;
  // } else {
  //   displayName = loginFormData.name;
  // }

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
            <img src="./src/images/desire.png" alt="" className="img" />
          </Link>
        </div>

        <button
          className="nav-toggle"
          type="button"
          onClick={() => setShowLinks(!showLinks)}
        >
          <FaAlignJustify />
        </button>
      </motion.div>
      <div ref={linksContainerRef}>
        <motion.div className="book" variants={containerVariants}>
          <div className="navSearch">
            <input type="text" />
            <LuSearch className="linkIcon" />
          </div>
          <div className="cart">
            {googleUser ? (
              <div div className="cart">
                <p className="displayName">
                  Welcome, {user && user.displayName}
                </p>
                <Link className="linkIcon" to="/login">
                  <img
                    src={user && user.photoURL}
                    className="img"
                    style={{ borderRadius: "50%" }}
                  />
                </Link>
                <Link className="displayName" to="/" onClick={logout}>
                  Logout
                </Link>
              </div>
            ) : formUser ? (
              <div className="cart">
                <p className="displayName">Welcome, {formUser.name}</p>
                <Link className="linkIcon">
                  <LuUserCircle2 />
                </Link>
                <Link className="displayName" to="/" onClick={logout}>
                  Logout
                </Link>
              </div>
            ) : (
              <Link className="displayName" to="/login">
                Login
              </Link>
            )}

            <div className="shoppingContainer">
              <Link className="linkIcon" to="/cart">
                <LuShoppingCart className="img" />
              </Link>
              <div className="navAmount">
                <p className="amountTag">{amount}</p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div variants={containerVariants}>
          <ul
            className={`${showLinks ? "links show-nav" : "links"}`}
            ref={linksRef}
          >
            <li>
              <Link to="" className="sale navlink">
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
