// import { useContext, useEffect, useState } from "react";
// import img from "/images/men/banner/payment.jpg";
// import { useNavigate } from "react-router-dom";
// import { AppContext } from "../data managment/AppProvider";
// import Checkout from "./Checkout";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import { motion } from "framer-motion";
// import CheckoutForm from "./CheckoutForm";
// import { useCallback } from "react";
// import { useMutation } from "@tanstack/react-query";

// const Payment = () => {
//   const { cartPayment, total, shipping, cart, formUser, firebaseUser, amount } =
//     useContext(AppContext);

//   const [payment, setPayment] = useState({});
//   const navigate = useNavigate();
//   const [paymentSucceeded, setPaymentSucceeded] = useState(false);
//   const [stripePromise, setStripePromise] = useState(null);
//   const [clientSecret, setClientSecret] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const tax = parseFloat((total * 0.1).toFixed(2));
//   const shippingPrice = parseFloat((total * 0.13).toFixed(2));

//   const totalAll = parseFloat((total + shippingPrice + tax).toFixed(2));

//   const totalInCents = Math.round(totalAll * 100);

//   console.log("total", total, typeof total);
//   console.log("totalall", totalAll, typeof totalAll);
//   console.log("totalincent", totalInCents, typeof totalInCents);

//   const url = import.meta.env.VITE_PUBLIC_PRODUCTS_URL;

//   useEffect(() => {
//     document.title = "Payment";
//     fetch(`${url}/config`) // Correct URL for the config
//       .then(async (r) => {
//         const { publishableKey } = await r.json();
//         setStripePromise(
//           loadStripe(publishableKey, {
//             locale: "en", // Force English
//           })
//         ); // Use publishableKey
//         console.log("Publishable Key:", publishableKey);
//       })
//       .catch((error) => console.error("Error fetching config:", error));
//   }, []);

//   useEffect(() => {
//     fetch(`${url}/create-payment-intent`, {
//       // Correct URL for create-payment-intent
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ totalInCents }),
//     })
//       .then(async (r) => {
//         if (!r.ok) {
//           throw new Error("Failed to fetch client secret");
//         }
//         const { clientSecret } = await r.json();
//         console.log("Client Secret:", clientSecret);
//         setClientSecret(clientSecret);
//       })
//       .catch((error) => console.error("Error fetching client secret:", error));
//   }, []);

//   useEffect(() => {
//     document.title = "Payment";
//   }, []);

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setPayment((prevPayment) => ({
//       ...prevPayment,
//       [name]: value,
//     }));
//   }, []);

//   const paymentSubmit = useCallback(() => {
//     setIsSubmitting(true);
//     cartPayment(payment);
//     navigate("/order");
//   }, [payment, cartPayment, navigate]);

//   const sellingProduct = cart.map((item) => ({
//     id: item.id,
//     product_name: item.product_name,
//     amount: item.amount,
//     unitPrice: item?.newPrice || item?.price,
//     totalPrice: (item?.newPrice || item?.price) * item?.amount,
//   }));
//   console.log("my product", {
//     ...shipping,
//     sellingProduct,
//     subtotal: total,
//     tax,
//     total: totalAll,
//     payment: payment.payment,
//     tbluser_id: formUser?.user?.id || firebaseUser?.id,
//   });

//   const sellingFun = async () => {
//     const res = await fetch(`${url}/sell`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         ...shipping,
//         sellingProduct,
//         subtotal: total,
//         tax,
//         shipping: shippingPrice,
//         amount,
//         total: totalAll,
//         payment: payment.payment,
//         tbluser_id: formUser?.user?.id || firebaseUser?.id,
//       }),
//     });
//   };

//   const { data: addSelling, mutate: sellingMutate } = useMutation({
//     mutationFn: sellingFun,
//   });

//   const handleSuccess = useCallback(async () => {
//     setIsSubmitting(true);
//     try {
//       await sellingMutate(); // wait for mutation to complete
//       cartPayment(payment);
//       setPaymentSucceeded(true);
//     } catch (err) {
//       console.error("Failed to save order:", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, [sellingMutate, payment, cartPayment]);

//   const paypalClienId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
//   const initialOptions = {
//     "client-id": paypalClienId,
//     currency: "USD",
//     intent: "capture",
//     components: "buttons",
//     locale: "en_US",
//   };

//   const containerVariants = {
//     hidden: { x: "100vw", opacity: 0 },
//     visible: {
//       x: 0,
//       opacity: 1,
//       transition: {
//         duration: 2,
//         type: "spring",
//         stiffness: 50,
//         when: "beforeChildren",
//         staggerChildren: 1,
//       },
//     },
//     exit: {
//       x: "-100vw",
//       transition: { ease: "easeInOut" },
//     },
//   };
//   const childVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { duration: 1, ease: "easeInOut" } },
//   };
//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       exit="exit"
//     >
//       <motion.div className="headerimages" variants={childVariants}>
//         <img src={img} alt="payment" loading="lazy" className="detailImg" />
//       </motion.div>
//       <motion.div className="loginContainer" variants={containerVariants}>
//         <h3>Payment Method</h3>
//         <form className="login-form">
//           <label>
//             Paypal:
//             <input
//               type="radio"
//               id="paypal"
//               name="payment"
//               value="paypal"
//               onChange={handleChange}
//               checked={payment.payment === "paypal"}
//             />
//           </label>{" "}
//           <br />
//           <label>
//             Stripe:
//             <input
//               type="radio"
//               id="stripe"
//               name="payment"
//               value="stripe"
//               onChange={handleChange}
//               checked={payment.payment === "stripe"}
//             />
//           </label>
//           <br />
//         </form>
//         {payment.payment === "paypal" && (
//           <PayPalScriptProvider options={initialOptions}>
//             <Checkout onSuccess={handleSuccess} />
//           </PayPalScriptProvider>
//         )}
//         {payment.payment === "stripe" && stripePromise && clientSecret && (
//           <Elements stripe={stripePromise} options={{ clientSecret }}>
//             <CheckoutForm onSuccess={handleSuccess} />
//           </Elements>
//         )}

//         {paymentSucceeded && (
//           <button
//             onClick={paymentSubmit}
//             className="addCart"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Processing..." : "Continue"}
//           </button>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Payment;

import { useContext, useEffect, useState } from "react";
import img from "/images/men/banner/payment.jpg";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../data managment/AppProvider";
import Checkout from "./Checkout";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

const Payment = () => {
  const { cartPayment, total, shipping, cart, formUser, firebaseUser, amount } =
    useContext(AppContext);

  const [payment, setPayment] = useState({});
  const navigate = useNavigate();
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tax = parseFloat((total * 0.1).toFixed(2));
  const shippingPrice = parseFloat((total * 0.13).toFixed(2));
  const totalAll = parseFloat((total + shippingPrice + tax).toFixed(2));
  const totalInCents = Math.round(totalAll * 100);

  const url = import.meta.env.VITE_PUBLIC_PRODUCTS_URL;

  useEffect(() => {
    document.title = "Payment";
    fetch(`${url}/config`)
      .then(async (r) => {
        const { publishableKey } = await r.json();
        setStripePromise(loadStripe(publishableKey, { locale: "en" }));
      })
      .catch((error) => console.error("Error fetching config:", error));
  }, []);
  console.log("shipping data ", shipping);

  const sellingProduct = cart.map((item) => ({
    id: item.id,
    product_name: item.product_name,
    amount: item.amount,
    unitPrice: item?.newPrice || item?.price,
    totalPrice: (item?.newPrice || item?.price) * item?.amount,
    image: item?.images?.[0],
    description: item?.description,
  }));
  // const baseURL = window.location.origin;

  // const sellingProduct = cart.map((item) => ({
  //   id: item.id,
  //   product_name: item.product_name,
  //   amount: item.amount,
  //   unitPrice: item?.newPrice || item?.price,
  //   totalPrice: (item?.newPrice || item?.price) * item?.amount,
  //   image: `${baseURL}/${item?.images?.[0] || "default.jpg"}`,
  // }));

  console.log("sellingProduct", sellingProduct);

  const handleStripeCheckout = async () => {
    setIsSubmitting(true);
    try {
      const metadata = {
        fullName: shipping?.fullName || "Not provided",
        email: formUser?.user?.email || firebaseUser?.email || "Not provided",
        phone: shipping?.fullPhone || "Not provided",
        address: shipping?.address || "Not provided",
        city: shipping?.city || "Not provided",
        country: shipping?.country || "Not provided",
        postalCode: shipping?.postalCode || "Not provided",
        userId: formUser?.user?.id || firebaseUser?.id || "guest",
        cart: JSON.stringify(sellingProduct),
        companyName: "DESIRE",
        companyLogoPath: `${window.location.href}/images/desire.png`,
        companyAddress: "123 ain naaja street",
        companyPhoneNumber: "+123540016247",
        companyCity: "Algiers",
        companyPostalCode: "16000",
        companyState: "Algeria",
      };
      const response = await fetch(`${url}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total: totalAll,
          subtotal: total, // subtotal before tax + shipping
          tax,
          shipping: shippingPrice,
          metadata,
          amount,
          // cart: JSON.stringify(sellingProduct),
          successUrl: `${window.location.origin}/order?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cart`,
        }),
      });

      const { sessionId } = await response.json();
      cartPayment(payment);

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of your existing code remains the same...
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setPayment((prevPayment) => ({
      ...prevPayment,
      [name]: value,
    }));
  }, []);

  const paymentSubmit = useCallback(() => {
    setIsSubmitting(true);
    cartPayment(payment);
    // After successful payment
    navigate("/order", {
      state: {
        orderId: paymentIntent.id, // This is your stripe_payment_intent_id
        amount: total,
        items: amount,
        shipping: shipping,
        stripePaymentIntentId: paymentIntent.id, // ✅ Add this
      },
      replace: true,
    });
  }, [payment, cartPayment, navigate]);

  const sellingFun = async () => {
    const res = await fetch(`${url}/sell`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...shipping,
        sellingProduct,
        subtotal: total,
        tax,
        phone: shipping?.fullPhone,
        shipping: shippingPrice,
        amount,
        total: totalAll,
        payment: payment.payment,
        tbluser_id: formUser?.user?.id || firebaseUser?.id,
      }),
    });
  };

  const { mutate: sellingMutate } = useMutation({
    mutationFn: sellingFun,
  });

  const handleSuccess = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await sellingMutate();
      cartPayment(payment);
      setPaymentSucceeded(true);
    } catch (err) {
      console.error("Failed to save order:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [sellingMutate, payment, cartPayment]);

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const initialOptions = {
    "client-id": paypalClientId,
    currency: "USD",
    intent: "capture",
    components: "buttons",
    locale: "en_US",
  };

  // Your motion variants remain the same...
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
        <form className="login-form">
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
        </form>
        {payment.payment === "paypal" && (
          <PayPalScriptProvider options={initialOptions}>
            <Checkout onSuccess={handleSuccess} />
          </PayPalScriptProvider>
        )}
        {payment.payment === "stripe" && stripePromise && (
          <button
            onClick={handleStripeCheckout}
            disabled={isSubmitting}
            className="addCart"
          >
            {isSubmitting ? "Processing..." : "Proceed to Stripe Checkout"}
          </button>
        )}

        {paymentSucceeded && (
          <button
            onClick={paymentSubmit}
            className="addCart"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Continue"}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Payment;
