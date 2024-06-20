import React from "react";
import { GoArrowRight } from "react-icons/go";
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from "react-icons/fa";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="footerContainer">
        <div className="footerEmail">
          <h2>stay in the know</h2>
          <div className="footerInput">
            <input type="text" />
            <Link className="footerIcon">
              <GoArrowRight />
            </Link>
          </div>
          <div>
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
          <Link className="footerLink" to="story">
            Our Story
          </Link>
          <Link className="footerLink" to="contact">
            Contact Us
          </Link>
          <Link className="footerLink" to="login">
            Sign In
          </Link>
        </div>
        <div className="footerCompany">
          <h3>Shop</h3>
          <Link className="footerLink" to="best">
            Best Sellers
          </Link>
          <Link className="footerLink" to="rating">
            Top Rates
          </Link>
          <Link className="footerLink" to="sale">
            Sale
          </Link>
        </div>
      </div>
      <ul className="copyrights">
        <li className="footerReserved">
          <p className="footerReserved">© 2024 Desire All Rights Reserved</p>
        </li>
        <li className="footerTerms">
          <a href="/policy">Privacy Policy |</a>
        </li>
        <li className="footerTerms">
          <a href="/terms">Terms &amp; Conditions |</a>
        </li>
        <li className="footerTerms">
          <a href="/cookies">Cookies Policy |</a>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
