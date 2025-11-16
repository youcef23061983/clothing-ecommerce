// import { useContext, useEffect } from "react";
// import { AppContext } from "../data managment/AppProvider";
// import img from "/images/men/banner/order.jpg";
// import { motion } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";

// const Order = () => {
//   const { payment, shipping, cart, total, amount } = useContext(AppContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!payment.payment) {
//       navigate("/payment");
//     }
//     document.title = "Order";
//   }, [payment]);
//   const tax = parseFloat((total * 0.1).toFixed(2));
//   const shippingPrice = parseFloat((total * 0.13).toFixed(2));
//   const totalAll = parseFloat((total + tax + shippingPrice).toFixed(2));
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
//         <img src={img} alt="order" loading="lazy" className="detailImg" />
//       </motion.div>
//       <motion.h2 className="orderTitle" variants={containerVariants}>
//         Your order
//       </motion.h2>
//       <motion.div className="x" variants={containerVariants}>
//         <div className="orderContainer">
//           <div className="orderItem">
//             <h2 className="orderTitle">Shipping:</h2>
//             <div className="orderDesc">
//               <h4 className="orderName"> Full Name:</h4>
//               <p>{shipping.fullName}</p>
//             </div>
//             <div className="orderDesc">
//               <h4 className="orderName">Address:</h4>
//               <p>{shipping.address}</p>
//             </div>
//             <div className="orderDesc">
//               <h4 className="orderName">City:</h4>
//               <p>{shipping.city}</p>
//             </div>
//             <div className="orderDesc">
//               <h4 className="orderName"> Postal Code:</h4>
//               <p>{shipping.postalCode}</p>
//             </div>
//             <div className="orderDesc">
//               <h4 className="orderName"> Country:</h4>
//               <p>{shipping.country}</p>
//             </div>
//           </div>
//           <div className="orderItem">
//             <h2 className="orderTitle">Payment:</h2>
//             <div className="orderDesc">
//               <h4 className="orderName">Type:</h4>
//               <p>{payment.payment}</p>
//             </div>
//           </div>
//         </div>
//         <div className="y">
//           <div className="orderItem">
//             <h2 className="orderTitle">Your Payment Has Been Succeeded</h2>
//           </div>
//           <div className="cartContainer">
//             {cart.map((item) => {
//               let itemsPrice = (item?.newPrice || item?.price) * item?.amount;
//               itemsPrice = parseFloat(itemsPrice.toFixed(2));
//               return (
//                 <div className="cartDiv" key={item.id}>
//                   <div className="cartImg">
//                     <img
//                       src={item?.images[0]}
//                       alt="cart"
//                       loading="lazy"
//                       className="img"
//                     />
//                   </div>
//                   <h3 className="cartName">{item?.product_name}</h3>
//                   <div>
//                     <h3>{item?.newPrice || item?.price} $</h3>
//                     <h3>{itemsPrice} $</h3>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//           <div className="cartResult">
//             <h3>amount: {amount} </h3>
//             <h3>SUBTOTAL: {total} $</h3>
//             <h3>TAX: {tax} $</h3>
//             <h3>SHPPING: {shippingPrice} $</h3>
//             <h3>TOTAL: {totalAll} $</h3>
//             <div className="cartCheck">
//               <Link className="addCart" to="/">
//                 Place Order{" "}
//               </Link>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Order;

import { useContext, useEffect } from "react";
import { AppContext } from "../data managment/AppProvider";
import img from "/images/men/banner/order.jpg";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FcCheckmark } from "react-icons/fc";

const Order = () => {
  const { payment, shipping, cart, total, amount } = useContext(AppContext);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!payment.payment) {
      navigate("/payment");
    }
    document.title = "Order";
  }, [payment]);
  const tax = parseFloat((total * 0.1).toFixed(2));
  const shippingPrice = parseFloat((total * 0.13).toFixed(2));
  const totalAll = parseFloat((total + tax + shippingPrice).toFixed(2));

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
        <img src={img} alt="order" loading="lazy" className="detailImg" />
      </motion.div>
      <motion.h2 className="orderTitle" variants={containerVariants}>
        Your order
      </motion.h2>

      <motion.div className="x" variants={containerVariants}>
        <div className="orderContainer">
          <div className="orderItem">
            <h2 className="orderTitle">Shipping:</h2>
            <div className="orderDesc">
              <h4 className="orderName"> Full Name:</h4>
              <p>{shipping.fullName}</p>
            </div>
            <div className="orderDesc">
              <h4 className="orderName">Address:</h4>
              <p>{shipping.address}</p>
            </div>
            <div className="orderDesc">
              <h4 className="orderName">City:</h4>
              <p>{shipping.city}</p>
            </div>
            <div className="orderDesc">
              <h4 className="orderName"> Postal Code:</h4>
              <p>{shipping.postalCode}</p>
            </div>
            <div className="orderDesc">
              <h4 className="orderName"> Country:</h4>
              <p>{shipping.country}</p>
            </div>
          </div>
          <div className="orderItem">
            <h2 className="orderTitle">Payment:</h2>
            <div className="orderDesc">
              <h4 className="orderName">Type:</h4>
              <p>{payment.payment}</p>
            </div>
          </div>
        </div>
        <div className="y">
          <div className="orderItem">
            <h2 className="orderTitle">Your Payment Has Been Succeeded</h2>
          </div>
          {paymentId && (
            <motion.div className="orderItem" variants={childVariants}>
              <div className="orderDesc">
                <h2 className="orderTitle">Order Confirmation</h2>
                <FcCheckmark />
              </div>

              <div className="orderDesc">
                <h4 className="orderName"> Session Checkout ID:</h4>
                <p>{sessionId}</p>
              </div>
            </motion.div>
          )}
          <div className="cartContainer">
            {cart.map((item) => {
              let itemsPrice = (item?.newPrice || item?.price) * item?.amount;
              itemsPrice = parseFloat(itemsPrice.toFixed(2));
              return (
                <div className="cartDiv" key={item.id}>
                  <div className="cartImg">
                    <img
                      src={item?.images[0]}
                      alt="cart"
                      loading="lazy"
                      className="img"
                    />
                  </div>
                  <h3 className="cartName">{item?.product_name}</h3>
                  <div>
                    <h3>{item?.newPrice || item?.price} $</h3>
                    <h3>{itemsPrice} $</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cartResult">
            <h3>amount: {amount} </h3>
            <h3>SUBTOTAL: {total} $</h3>
            <h3>TAX: {tax} $</h3>
            <h3>SHPPING: {shippingPrice} $</h3>
            <h3>TOTAL: {totalAll} $</h3>
            <div className="cartCheck">
              <Link className="addCart" to="/">
                Place Order{" "}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Order;
