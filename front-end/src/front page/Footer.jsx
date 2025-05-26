import { GoArrowRight } from "react-icons/go";
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from "react-icons/fa";

import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footerContainer">
        <div className="footerEmail">
          <h2>stay in the know</h2>
          <div className="footerInput">
            <input type="text" placeholder="Search..." />
            <Link className="footerIcon">
              <GoArrowRight />
            </Link>
          </div>
          <div className="footerInput">
            <Link className="footerIcon">
              <FaInstagram />
            </Link>
            <Link className="footerIcon">
              <FaTwitter />
            </Link>
            <Link className="footerIcon">
              <FaFacebook />
            </Link>
            <Link className="footerIcon">
              <FaYoutube />
            </Link>
          </div>
        </div>
        <div className="footerCompany">
          <h3>Company</h3>
          <NavLink
            style={({ isActive }) => {
              return { color: isActive ? " rgb(249, 175, 35)" : "grey" };
            }}
            className="footerLink"
            to="story"
          >
            Our Story
          </NavLink>
          <NavLink
            style={({ isActive }) => {
              return { color: isActive ? " rgb(249, 175, 35)" : "grey" };
            }}
            className="footerLink"
            to="contact"
          >
            Contact Us
          </NavLink>
          <NavLink
            style={({ isActive }) => {
              return { color: isActive ? " rgb(249, 175, 35)" : "grey" };
            }}
            className="footerLink"
            to="login"
          >
            Sign In
          </NavLink>
        </div>
        <div className="footerCompany">
          <h3>Shop</h3>
          <NavLink
            style={({ isActive }) => {
              return { color: isActive ? " rgb(249, 175, 35)" : "grey" };
            }}
            className="footerLink"
            to="best"
          >
            Best Sellers
          </NavLink>
          <NavLink
            style={({ isActive }) => {
              return { color: isActive ? " rgb(249, 175, 35)" : "grey" };
            }}
            className="footerLink"
            to="rating"
          >
            Top Rates
          </NavLink>
          <NavLink
            style={({ isActive }) => {
              return { color: isActive ? " red" : "grey" };
            }}
            className="footerLink"
            to="sale"
          >
            Sale
          </NavLink>
        </div>
      </div>
      <ul className="copyrights">
        <li className="footerReserved">
          <p className="footerReserved">© 2024 Desire All Rights Reserved</p>
        </li>
        <li className="footerTerms">
          <NavLink
            className="footerTerms"
            style={({ isActive }) => {
              return { color: isActive ? " rgb(249, 175, 35)" : "grey" };
            }}
            to="policy"
          >
            Privacy Policy |{" "}
          </NavLink>
        </li>
        <li className="footerTerms">
          <NavLink
            className="footerTerms"
            style={({ isActive }) => {
              return { color: isActive ? " rgb(249, 175, 35)" : "grey" };
            }}
            to="terms"
          >
            Terms &amp; Conditions |{" "}
          </NavLink>
        </li>
        <li className="footerTerms">
          <NavLink
            className="footerTerms"
            style={({ isActive }) => {
              return { color: isActive ? " rgb(249, 175, 35)" : "grey" };
            }}
            to="cookies"
          >
            Cookies Policy |{" "}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
