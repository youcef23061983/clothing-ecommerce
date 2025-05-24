// import React, { useState } from "react";
// import {
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

// const CheckoutForm = ({ onSuccess }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [errorMessage, setErrorMessage] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [message, setMessage] = useState(null);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!elements || !stripe) return;
//     setIsProcessing(true);

//     const { error: submitError } = await elements.submit();
//     if (submitError) {
//       setErrorMessage(submitError.message);
//       setIsProcessing(false);
//       return;
//     }

//     try {
//       // const res = await fetch("http://localhost:3000/create-payment-intent", {
//       //   method: "POST",
//       //   headers: { "Content-Type": "application/json" },
//       // });

//       // const { clientSecret } = await res.json();

//       const { error, paymentIntent } = await stripe.confirmPayment({
//         elements,
//         confirmParams: {
//           // Return URL becomes you need it in postgresql:
//           // return_url: `${origin}/order?order_id=${newOrder.rows[0].id}`,
//           return_url: `${window.location.origin}/order`,
//         },
//         redirect: "if_required",
//       });

//       if (error) {
//         setErrorMessage(error.message);
//       } else if (paymentIntent?.status === "succeeded") {
//         setMessage("Payment status: " + paymentIntent?.status + " 🎉");
//         onSuccess();
//       } else {
//         setMessage("Unexpected payment status");
//       }
//     } catch (err) {
//       setErrorMessage("An error occurred: " + err.message);
//     }

//     setIsProcessing(false);
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       <PaymentElement />
//       <button
//         type="submit"
//         disabled={isProcessing}
//         className="bg-blue-500 text-white p-2 rounded mt-4"
//       >
//         {isProcessing ? "Processing..." : "Pay now"}
//       </button>

//       {/* Show error message to your customers */}
//       {errorMessage && <div>{errorMessage}</div>}
//       {message && <div>{message}</div>}
//     </form>
//   );
// };

// export default CheckoutForm;

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!elements || !stripe) return;
    setIsProcessing(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setIsProcessing(false);
      return;
    }

    try {
      // const res = await fetch("http://localhost:3000/create-payment-intent", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      // });

      // const { clientSecret } = await res.json();

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Return URL becomes you need it in postgresql:
          // return_url: `${origin}/order?order_id=${newOrder.rows[0].id}`,
          return_url: `${window.location.origin}/order`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (paymentIntent?.status === "succeeded") {
        setMessage("Payment status: " + paymentIntent?.status + " 🎉");
        onSuccess();
      } else {
        setMessage("Unexpected payment status");
      }
    } catch (err) {
      setErrorMessage("An error occurred: " + err.message);
    }

    setIsProcessing(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={isProcessing}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        {isProcessing ? "Processing..." : "Pay now"}
      </button>

      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
      {message && <div>{message}</div>}
    </form>
  );
};

export default CheckoutForm;
