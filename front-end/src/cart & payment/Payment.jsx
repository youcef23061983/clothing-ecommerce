import { useContext, useEffect, useState } from "react";
import img from "/images/men/banner/payment.jpg";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../data managment/AppProvider";
import Checkout from "./Checkout";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import CheckoutForm from "./CheckoutForm";

const Payment = () => {
  const { cartPayment } = useContext(AppContext);
  const [payment, setPayment] = useState({});
  const navigate = useNavigate();
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prevPayment) => ({
      ...prevPayment,
      [name]: value,
    }));
  };

  useEffect(() => {
    document.title = "Payment";
  }, []);

  const paymentSubmit = (e) => {
    e.preventDefault();
    cartPayment(payment);
    if (paymentSucceeded) {
      navigate("/order");
    }
    navigate("/order");
  };
  const handleSuccess = () => {
    setPaymentSucceeded(true);
  };
  const paypalClienId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const initialOptions = {
    "client-id": paypalClienId,
    currency: "USD",
    intent: "capture",
  };
  //////---- ----stripe)))
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  const CLIENT_SECRET = import.meta.env.VITE_STRIPE_SECRET_KEY;
  const stripeOptions = {
    clientSecret: CLIENT_SECRET,
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
        <img src={img} alt="payment" loading="lazy" className="detailImg" />
      </motion.div>
      <motion.div className="loginContainer" variants={containerVariants}>
        <h3>Payment Method</h3>
        <form onSubmit={paymentSubmit} className="login-form">
          <label>
            Paypal:
            <input
              type="radio"
              id="paypal"
              name="payment"
              value="paypal"
              onChange={handleChange}
              checked={payment.payment === "paypal"}
            />
          </label>{" "}
          <br />
          <label>
            Stripe:
            <input
              type="radio"
              id="stripe"
              name="payment"
              value="stripe"
              onChange={handleChange}
              checked={payment.payment === "stripe"}
            />
          </label>
          <br />
          {payment.payment === "paypal" && (
            <PayPalScriptProvider options={initialOptions}>
              <Checkout onSuccess={handleSuccess} />
            </PayPalScriptProvider>
          )}
          {payment.payment === "stripe" && (
            <div>
              <Elements stripe={stripePromise} options={stripeOptions}>
                <CheckoutForm />
              </Elements>
            </div>
          )}
          {/* {paymentSucceeded && ( */}
          <button type="submit" className="addCart">
            Continue
          </button>
          {/* )} */}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Payment;
