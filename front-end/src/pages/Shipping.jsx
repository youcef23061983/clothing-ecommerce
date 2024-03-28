import React, { useContext, useEffect, useState } from "react";
import img from "../images/men/banner/shipping.jpg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppContext } from "./AppProvider";
const Shipping = () => {
  const { cartShipping } = useContext(AppContext);
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  useEffect(() => {
    document.title = "Shipping Adress";
  }, []);
  const navigate = useNavigate();

  const shippingSubmit = (e) => {
    e.preventDefault();
    if (
      !shipping.fullName ||
      !shipping.address ||
      !shipping.city ||
      !shipping.postalCode ||
      !shipping.country
    ) {
      alert("please enter your information");
      return;
    }
    setShipping({ ...shipping });
    cartShipping(shipping);
    setShipping("");
    navigate("/payment");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };
  const containerVariants = {
    hidden: { x: "100vw", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 2,
        type: "spring",
        stiffness: 50,
        when: "beforeChildren",
        staggerChildren: 1,
      },
    },
    exit: {
      x: "-100vw",
      transition: { ease: "easeInOut" },
    },
  };
  const childVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: "easeInOut" } },
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className="headerimages" variants={childVariants}>
        <img src={img} alt="" className="detailImg" />
      </motion.div>
      <motion.div className="loginContainer" variants={containerVariants}>
        <h3>shipping adress</h3>
        <form onSubmit={shippingSubmit}>
          <label>
            FullName:
            <input
              type="text"
              name="fullName"
              value={shipping.fullName}
              onChange={handleChange}
              className="input"
            />
          </label>{" "}
          <br />
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={shipping.address}
              onChange={handleChange}
              className="input"
            />
          </label>{" "}
          <br />{" "}
          <label>
            City:
            <input
              type="text"
              name="city"
              value={shipping.city}
              onChange={handleChange}
              className="input"
            />
          </label>{" "}
          <br />
          <label>
            PostalCode:
            <input
              type="text"
              name="postalCode"
              value={shipping.postalCode}
              onChange={handleChange}
              className="input"
            />
          </label>
          <br />
          <label>
            Country:
            <input
              type="text"
              name="country"
              value={shipping.country}
              onChange={handleChange}
              className="input"
            />
          </label>
          <br />
          <button type="submit" className="addCart">
            continue{" "}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Shipping;
