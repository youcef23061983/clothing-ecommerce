import { useState } from "react";
import {
  PaymentElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { AppContext } from "../data managment/AppProvider";
import { useContext, useEffect } from "react";

const CheckoutForm = ({ onSuccess }) => {
  const { cart, shipping, formUser, firebaseUser, total, amount } =
    useContext(AppContext);

  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [showWallet, setShowWallet] = useState(false); // Optional

  const tax = parseFloat((total * 0.1).toFixed(2));
  const shippingPrice = parseFloat((total * 0.13).toFixed(2));

  const totalAll = parseFloat((total + shippingPrice + tax).toFixed(2));

  const url = import.meta.env.VITE_PUBLIC_PRODUCTS_URL;

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

        // ✅ GET CARD INFO DIRECTLY - no backend call needed!
        const cardBrand = paymentIntent.payment_method?.card?.brand || "card";
        const last4 = paymentIntent.payment_method?.card?.last4 || "****";

        console.log("💳 Card details:", { cardBrand, last4 });

        // ✅ CREATE CUSTOMER DATA USING YOUR FORM DATA + CARD INFO
        const sellingProduct = cart.map((item) => ({
          id: item.id,
          product_name: item.product_name,
          amount: item.amount,
          unitPrice: item?.newPrice || item?.price,
          image: item?.images?.[0] || "/placeholder-product.jpg",
          totalPrice: (item?.newPrice || item?.price) * item?.amount,
        }));
        const customerData = {
          // From Stripe (payment info)
          stripe_payment_intent_id: paymentIntent.id,
          amount: (paymentIntent.amount / 100).toFixed(2) || totalAll,
          currency: paymentIntent.currency.toUpperCase(),
          paymentMethod: cardBrand,
          last4: last4,
          tax,
          shipping: shippingPrice,
          total: totalAll,
          created: paymentIntent.created * 1000, // to ms

          // From your form (customer info)
          email: formUser?.user?.email || firebaseUser?.email,
          fullName: shipping?.fullName,
          fullPhone: shipping?.fullPhone,
          street: shipping?.address,
          city: shipping?.city,
          country: shipping?.country,
          postalCode: shipping?.postalCode,

          sellingProduct,
        };

        setCustomerData(customerData);

        // ✅ SEND EMAIL & SMS (NON-BLOCKING)
        try {
          console.log("🔔 Sending order notifications...");

          // Send email
          fetch(`${url}/send-order-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: customerData.email, // ✅ Use customerData.email, not orderData.email
              subject: `🧾 Order Confirmation #${paymentIntent.id}`,
              orderData: customerData, // ✅ Use customerData
            }),
          })
            .then(() => console.log("📧 Email sent successfully"))
            .catch((err) => console.error("❌ Email failed:", err));

          // Send SMS if phone exists
          if (customerData.fullPhone) {
            fetch(`${url}/send-order-sms`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderData: customerData, // ✅ Use customerData
              }),
            })
              .then(() => console.log("📱 SMS sent successfully"))
              .catch((err) => console.error("❌ SMS failed:", err));
          } else {
            console.log("ℹ️ No phone number provided for SMS");
          }
        } catch (notificationError) {
          console.error("❌ Notifications setup failed:", notificationError);
        }

        // ✅ CALL onSuccess TO SAVE ORDER
        onSuccess({
          paymentIntentId: paymentIntent.id,
          sessionId: null,
        });

        console.log("✅ Payment successful! Order data:", customerData);
      } else {
        setMessage("Unexpected payment status");
      }
    } catch (err) {
      setErrorMessage("An error occurred: " + err.message);
    }

    setIsProcessing(false);
  };
  console.log("Customer Data:", customerData);
  console.log("Wallet visible?", showWallet);

  //   {
  //     4000 0027 6000 3184 → Returns complete US address

  // 4000 0036 0000 0005 → Returns UK address format
  //   4000 0025 0000 3155 - Requires full 3D Secure flow

  // 4000 0000 0000 3220 - Triggers address verification

  // 4000 0084 0000 1629 → Requires ZIP code verification
  //   }
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Total",
          amount: Math.round(totalAll * 100), // Amount in cents
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          console.log("Can make payment result:", result);

          setPaymentRequest(pr);
          setShowWallet(true);
        } else {
          console.log("Payment request not available. Reasons:", {
            applePay: result?.applePay,
            googlePay: result?.googlePay,
          });
        }
      });

      pr.on("paymentmethod", async (event) => {
        try {
          const { error, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret, // You must pass clientSecret as a prop or from backend
            {
              payment_method: event.paymentMethod.id,
            },
            {
              handleActions: false,
            }
          );

          if (error) {
            event.complete("fail");
            setErrorMessage(error.message);
          } else {
            event.complete("success");

            if (paymentIntent.status === "requires_action") {
              await stripe.confirmCardPayment(clientSecret);
            }

            if (paymentIntent.status === "succeeded") {
              onSuccess(); // same as your card flow
            }
          }
        } catch (err) {
          console.error(err);
          event.complete("fail");
        }
      });
    }
  }, [stripe, totalAll]);

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement
          options={{
            fields: {
              billingDetails: "auto",
            },
          }}
        />
        {showWallet && paymentRequest && (
          <div className="mb-4">
            <PaymentRequestButtonElement
              options={{
                paymentRequest,
                style: {
                  paymentRequestButton: {
                    height: "40px", // Must specify!
                    theme: "light", // or 'dark'
                    type: "buy", // 'default', 'donate', 'buy'
                  },
                },
              }}
            />{" "}
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isProcessing ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isProcessing ? "Processing..." : "Pay now"}
        </button>

        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
        {message && <div className="text-green-500 mt-2">{message}</div>}
      </form>

      {customerData && (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
          {/* Header with company logo and Stripe-inspired gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              {/* Replace with your actual logo */}
              <div className="mr-3 bg-white p-1 rounded">
                <svg
                  className="w-8 h-8 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Payment Receipt
                </h3>
                <p className="text-purple-100 text-sm mt-1">
                  {new Date(customerData.created).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="bg-white hover:bg-gray-50 text-purple-600 font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              Download PDF
            </button>
          </div>

          <div className="p-6">
            {/* Customer Info Section */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                Customer Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Full Name</p>
                  <p className="font-medium break-all text-xl">
                    {customerData.fullName || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-medium break-all text-xl">
                    {customerData.email || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="font-medium">{customerData.fullPhone || "-"}</p>
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                Order Summary
              </h4>

              <div className="border rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-12 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-6">Item</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-center">Unit Price</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>

                {/* Product Items */}
                <div className="divide-y divide-gray-200">
                  {customerData?.sellingProduct?.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-12 p-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* Product Info */}
                      <div className="col-span-6 flex items-center mb-2 sm:mb-0">
                        <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md overflow-hidden mr-3">
                          <img
                            src={item?.image || "/placeholder-product.jpg"}
                            alt={item?.product_name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item?.product_name}
                          </p>
                          <p className="text-xs text-gray-500 sm:hidden">
                            {item?.unitPrice} × {item?.amount} $
                          </p>
                        </div>
                      </div>

                      {/* Quantity - Centered */}
                      <div className="col-span-2 flex items-center justify-center">
                        <span className="text-sm text-gray-700">
                          {item?.amount}
                        </span>
                      </div>

                      {/* Unit Price - Centered */}
                      <div className="col-span-2 flex items-center justify-center">
                        <span className="text-sm text-gray-700">
                          {item?.unitPrice} $
                        </span>
                      </div>

                      {/* Total Price - Centered */}
                      <div className="col-span-2 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {item?.totalPrice} $
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                Payment Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Payment Method</p>
                  <div className="flex items-center mt-1">
                    <div className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs font-medium mr-2 transition-colors duration-200">
                      {customerData.paymentMethod || "Card"}
                    </div>
                    <span className="font-mono">•••• {customerData.last4}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Amount</p>
                  <p className="text-xl font-bold text-purple-600">{amount}</p>
                </div>{" "}
                <div>
                  <p className="text-gray-600 text-sm">Subtotal</p>
                  <p className="text-xl font-bold text-purple-600">{total} $</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">tax</p>
                  <p className="text-xl font-bold text-purple-600">{tax} $</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Shipping</p>
                  <p className="text-xl font-bold text-purple-600">
                    {shippingPrice} $
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="text-xl font-bold text-purple-600">
                    {customerData.amount || totalAll} $
                  </p>
                </div>
                <div className="break-all">
                  <p className="text-gray-600 text-sm">Transaction ID</p>
                  <p className="font-mono text-sm text-gray-500">
                    {customerData.stripe_payment_intent_id}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 hover:bg-green-200 text-green-800 transition-colors duration-200">
                    Completed
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address Section */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
                Shipping Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Street</p>
                  <p className="font-medium">{customerData.street || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">City/State/Zip</p>
                  <p className="font-medium">
                    {customerData.city || "-"}
                    {customerData.country || ""} {customerData.postalCode}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Country</p>
                  <p className="font-medium">{customerData.country || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t">
            <p className="text-xs text-gray-500 text-center">
              Thank you for your purchase! A receipt has been sent to{" "}
              {customerData.email || "your email"}
            </p>
            <div className="flex justify-center mt-2 space-x-4">
              <button className="text-xs text-purple-600 hover:text-purple-800 hover:underline transition-colors duration-200">
                Print Receipt
              </button>
              <button className="text-xs text-purple-600 hover:text-purple-800 hover:underline transition-colors duration-200">
                Contact Support
              </button>
              <button className="text-xs text-purple-600 hover:text-purple-800 hover:underline transition-colors duration-200">
                Order Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
