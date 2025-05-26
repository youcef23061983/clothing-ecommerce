import { useContext, useEffect } from "react";
import img from "/images/men/banner/shipping.jpg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppContext } from "../data managment/AppProvider";

const Shipping = () => {
  const { cartShipping, shipping } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Shipping Address";
  }, []);

  const shippingSubmit = (e) => {
    e.preventDefault();
    if (
      !shipping.fullName ||
      !shipping.address ||
      !shipping.city ||
      !shipping.postalCode ||
      !shipping.country
    ) {
      alert("Please enter your information");
      return;
    }
    navigate("/payment");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    cartShipping({ ...shipping, [name]: value });
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
        <img src={img} alt="shipping" loading="lazy" className="detailImg" />
      </motion.div>
      <motion.div className="loginContainer" variants={containerVariants}>
        <h3>Shipping Address</h3>
        <form onSubmit={shippingSubmit}>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={shipping.fullName || ""}
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
              value={shipping.address || ""}
              onChange={handleChange}
              className="input"
            />
          </label>{" "}
          <br />
          <label>
            City:
            <input
              type="text"
              name="city"
              value={shipping.city || ""}
              onChange={handleChange}
              className="input"
            />
          </label>{" "}
          <br />
          <label>
            Postal Code:
            <input
              type="text"
              name="postalCode"
              value={shipping.postalCode || ""}
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
              value={shipping.country || ""}
              onChange={handleChange}
              className="input"
            />
          </label>
          <br />
          <button type="submit" className="addCart">
            Continue
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Shipping;
