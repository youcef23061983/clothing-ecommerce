import { FaAlignJustify } from "react-icons/fa";
import { LuShoppingCart, LuUserCircle2, LuSearch } from "react-icons/lu";
import { AppContext } from "./AppProvider";
import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";

const Navbar = () => {
  const [showLinks, setShowLinks] = useState(false);
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);
  const navCenter = useRef(null);

  const { amount } = useContext(AppContext);
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    let isMounted = true;

    const handScroll = () => {
      if (!isMounted) {
        return;
      }

      const scrollHeight = window.scrollY;
      const navCenterHeight = navCenter.current.getBoundingClientRect().height;
      const links = document.querySelectorAll(".navlink");
      const linkIcon = document.querySelectorAll(".linkIcon");
      const sale = document.querySelector(".sale");

      if (scrollHeight > navCenterHeight) {
        navCenter.current.style.position = "fixed";
        navCenter.current.style.background = "white";
        navCenter.current.style.width = "100%";
        navCenter.current.style.transition = "all 0.8s linear";
        links.forEach((link) => {
          link.style.color = " rgb(249, 175, 35)";
        });
        if (sale) {
          sale.style.color = "red";
        }
        linkIcon.forEach((icon) => {
          icon.style.color = " rgb(249, 175, 35)";
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
      }
    };

    window.addEventListener("scroll", handScroll);

    return () => {
      isMounted = false;
      window.removeEventListener("scroll", handScroll);
    };
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
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
            <p className="displayName">{user && user.displayName}</p>
            {!user && (
              <Link className="linkIcon" to="/login">
                <LuUserCircle2 />
              </Link>
            )}{" "}
            {user && (
              <Link className="linkIcon" to="/login">
                <img
                  src={user && user.photoURL}
                  className="img"
                  style={{ borderRadius: "50%" }}
                />
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
                Shop{" "}
              </Link>
            </li>
            <li>
              <Link className="navlink" to="new">
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
                Sign Up{" "}
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
