// import { useState } from "react";
// import React, { useContext } from "react";
// import { AppContext } from "../data managment/AppProvider";
// import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

// const Checkout = ({ onSuccess }) => {
//   const { total, cartShipping, shipping } = useContext(AppContext);

//   const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
//   const [currency, setCurrency] = useState(options.currency);

//   const onCurrencyChange = ({ target: { value } }) => {
//     setCurrency(value);
//     dispatch({
//       type: "resetOptions",
//       value: {
//         ...options,
//         currency: value,
//       },
//     });
//   };

//   const onCreateOrder = (data, actions) => {
//     return actions.order.create({
//       purchase_units: [
//         {
//           amount: {
//             value: total,
//           },
//         },
//       ],
//     });
//   };

//   // const onApproveOrder = (data, actions) => {
//   //   return actions.order.capture().then((details) => {
//   //     const name = details.payer.name.given_name;
//   //     alert(`Transaction completed by ${name}`);
//   //     console.log(details);

//   //     onSuccess();
//   //   });
//   // };

//   const onApproveOrder = (data, actions) => {
//     return actions.order.capture().then((details) => {
//       const clientData = {
//         // fullName: details.purchase_units[0]?.shipping?.name?.full_name,
//         // fullName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
//         name: `${details.payer.name.given_name} ${details.payer.name.surname}`,
//         email: details.payer.email_address,
//         country:
//           details.purchase_units?.[0]?.shipping?.address?.country_code || "N/A",
//         state: details.purchase_units[0]?.shipping?.address?.admin_area_1,
//         city: details.purchase_units[0]?.shipping?.address?.admin_area_2,
//         Address: details.purchase_units[0]?.shipping?.address,
//         transactionId: details.id,
//         postalCode: details.purchase_units[0]?.shipping?.address?.postal_code,
//         countryCode: details.purchase_units[0]?.shipping?.address?.country_code,
//         Phone: details.purchase_units[0]?.shipping?.address?.phone,
//         last4:
//           details.purchase_units[0]?.payments?.captures[0]?.card_last_digits ||
//           "****",
//         created: details.create_time || new Date().toISOString(),
//         amount: details.purchase_units[0]?.amount?.value,
//       };

//       // You can save this to context, localStorage, or your backend
//       // cartShipping(clientData);
//       console.log(clientData);

//       alert(`Transaction completed by ${clientData.name}`);

//       onSuccess();
//     });
//   };

//   return (
//     <div className="checkout">
//       {isPending ? (
//         <p>LOADING...</p>
//       ) : (
//         <div className="paypal">
//           <select
//             value={currency}
//             onChange={onCurrencyChange}
//             data-testid="money-div"
//           >
//             <option value="USD">💵 USD</option>
//             <option value="EUR">💶 Euro</option>
//           </select>
//           <PayPalButtons
//             style={{ layout: "vertical" }}
//             createOrder={(data, actions) => onCreateOrder(data, actions)}
//             onApprove={(data, actions) => onApproveOrder(data, actions)}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Checkout;
import { useState } from "react";
import React, { useContext } from "react";
import { AppContext } from "../data managment/AppProvider";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const Checkout = ({ onSuccess }) => {
  const { total, cartShipping } = useContext(AppContext);
  const [customerData, setCustomerData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const [currency, setCurrency] = useState(options.currency);

  const onCurrencyChange = ({ target: { value } }) => {
    setCurrency(value);
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: value,
      },
    });
  };

  const onCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total,
          },
        },
      ],
    });
  };

  const onApproveOrder = (data, actions) => {
    return actions.order.capture().then((details) => {
      const clientData = {
        fullName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
        email: details.payer.email_address,
        country:
          details.purchase_units?.[0]?.shipping?.address?.country_code || "N/A",
        state: details.purchase_units[0]?.shipping?.address?.admin_area_1,
        city: details.purchase_units[0]?.shipping?.address?.admin_area_2,
        address: details.purchase_units[0]?.shipping?.address,
        transactionId: details.id,
        postalCode: details.purchase_units[0]?.shipping?.address?.postal_code,
        countryCode: details.purchase_units[0]?.shipping?.address?.country_code,
        phone: details.purchase_units[0]?.shipping?.address?.phone,
        paymentMethod: "PayPal",
        last4:
          details.purchase_units[0]?.payments?.captures[0]?.card_last_digits ||
          "****",
        created: details.create_time || new Date().toISOString(),
        amount: details.purchase_units[0]?.amount?.value,
        currency: currency,
        status: details.status || "COMPLETED",
        payerId: details.payer.payer_id,
      };

      setCustomerData(clientData);
      cartShipping(clientData);
      onSuccess();
    });
  };

  return (
    // <div className="checkout">
    //   {isPending ? (
    //     <p>LOADING...</p>
    //   ) : (
    //     <>
    //       <div className="paypal">
    //         <select
    //           value={currency}
    //           onChange={onCurrencyChange}
    //           data-testid="money-div"
    //         >
    //           <option value="USD">💵 USD</option>
    //           <option value="EUR">💶 Euro</option>
    //         </select>
    //         <PayPalButtons
    //           style={{ layout: "vertical" }}
    //           createOrder={(data, actions) => onCreateOrder(data, actions)}
    //           onApprove={(data, actions) => onApproveOrder(data, actions)}
    //         />
    //       </div>

    //       {/* PayPal Client Data Display (appears after payment) */}
    //       {customerData && (
    //         <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
    //           {/* Header */}
    //           <div className="bg-[#003087] p-4 flex items-center">
    //             <svg
    //               className="w-6 h-6 mr-2"
    //               viewBox="0 0 24 24"
    //               fill="#009cde"
    //             >
    //               <path
    //                 d="M7.3 17.2h9.1c1.6 0 2.8-1.2 2.8-2.8V9.8c0-1.6-1.2-2.8-2.8-2.8H7.3c-1.6 0-2.8 1.2-2.8 2.8v4.6c0 1.6 1.2 2.8 2.8 2.8z"
    //                 fill="#ffffff"
    //               />
    //               <path
    //                 d="M12 16.5c-1.2 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3z"
    //                 fill="#009cde"
    //               />
    //             </svg>
    //             <h3 className="text-white font-medium">Payment Details</h3>
    //           </div>

    //           {/* Body */}
    //           <div className="bg-white p-4">
    //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //               {/* Left Column */}
    //               <div>
    //                 <div className="mb-3">
    //                   <p className="text-gray-500 text-sm">Customer</p>
    //                   <p className="font-medium">{customerData.fullName}</p>
    //                 </div>
    //                 <div className="mb-3">
    //                   <p className="text-gray-500 text-sm">Email</p>
    //                   <p className="font-medium break-all">
    //                     {customerData.email}
    //                   </p>
    //                 </div>
    //                 <div>
    //                   <p className="text-gray-500 text-sm">Transaction ID</p>
    //                   <p className="font-mono text-sm break-all">
    //                     {customerData.transactionId}
    //                   </p>
    //                 </div>
    //               </div>

    //               {/* Right Column */}
    //               <div>
    //                 <div className="mb-3">
    //                   <p className="text-gray-500 text-sm">Amount</p>
    //                   <p className="text-xl font-bold text-[#003087]">
    //                     {customerData.amount} {customerData.currency}
    //                   </p>
    //                 </div>
    //                 <div className="mb-3">
    //                   <p className="text-gray-500 text-sm">Status</p>
    //                   <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
    //                     {customerData.status}
    //                   </span>
    //                 </div>
    //                 <div>
    //                   <p className="text-gray-500 text-sm">Paid with</p>
    //                   <p className="font-medium">
    //                     PayPal (•••• {customerData.last4})
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>

    //             {/* Shipping Address */}
    //             {customerData.address && (
    //               <div className="mt-4 pt-4 border-t">
    //                 <p className="text-gray-500 text-sm mb-2">
    //                   Shipping Address
    //                 </p>
    //                 <p className="font-medium">
    //                   {customerData.address.address_line_1}
    //                 </p>
    //                 {customerData.address.address_line_2 && (
    //                   <p className="font-medium">
    //                     {customerData.address.address_line_2}
    //                   </p>
    //                 )}
    //                 <p className="font-medium">
    //                   {customerData.city}, {customerData.state}{" "}
    //                   {customerData.postalCode}
    //                 </p>
    //                 <p className="font-medium">{customerData.country}</p>
    //               </div>
    //             )}
    //           </div>
    //         </div>
    //       )}
    //     </>
    //   )}
    // </div>
    <div className="checkout">
      {isPending ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Original Checkout (Enhanced) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Complete Payment
              </h2>
              <select
                value={currency}
                onChange={onCurrencyChange}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <PayPalButtons
              style={{
                layout: "vertical",
              }}
              createOrder={(data, actions) => onCreateOrder(data, actions)}
              onApprove={(data, actions) => onApproveOrder(data, actions)}
            />
          </div>

          {/* Enhanced Client Data Display */}
          {customerData && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-lg">
              {/* Header with PayPal branding */}
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-5 flex items-center">
                <div className="bg-white p-1.5 rounded-full mr-3">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7.3 17.2h9.1c1.6 0 2.8-1.2 2.8-2.8V9.8c0-1.6-1.2-2.8-2.8-2.8H7.3c-1.6 0-2.8 1.2-2.8 2.8v4.6c0 1.6 1.2 2.8 2.8 2.8z"
                      fill="#003087"
                    />
                    <path
                      d="M12 16.5c-1.2 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3z"
                      fill="#009cde"
                    />
                    <path
                      d="M12 14.6c-.4 0-.8.3-.8.8s.3.8.8.8.8-.3.8-.8-.4-.8-.8-.8z"
                      fill="#012169"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Payment Confirmation
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {new Date(customerData.created).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Customer
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-500 text-sm">Name</p>
                      <p className="font-medium">{customerData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Email</p>
                      <p className="font-medium break-all text-blue-600">
                        {customerData.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Payer ID</p>
                      <p className="font-mono text-sm">
                        {customerData.payerId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    Payment
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-500 text-sm">Amount</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {customerData.amount} {customerData.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Method</p>
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium mr-2">
                          PayPal
                        </span>
                        <span className="text-gray-700">
                          •••• {customerData.last4}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Status</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {customerData.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Shipping
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-500 text-sm">Address</p>
                      <p className="font-medium">
                        {customerData.address?.address_line_1}
                      </p>
                      {customerData.address?.address_line_2 && (
                        <p className="font-medium">
                          {customerData.address.address_line_2}
                        </p>
                      )}
                      <p className="font-medium">
                        {customerData.city}, {customerData.state}{" "}
                        {customerData.postalCode}
                      </p>
                      <p className="font-medium">{customerData.country}</p>
                    </div>
                    {customerData.phone && (
                      <div>
                        <p className="text-gray-500 text-sm">Phone</p>
                        <p className="font-medium">{customerData.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Transaction ID</p>
                    <p className="font-mono text-sm text-gray-700 break-all">
                      {customerData.transactionId}
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download Receipt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkout;
