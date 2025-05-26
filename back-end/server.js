require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");
const morgan = require("morgan");
const productsRoutes = require("./routes/products.js");
const authRoutes = require("./routes/authUser.js");
const stripe = require("stripe")(process.env.VITE_STRIPE_SECRET_KEY);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend origin
    credentials: true, // Allow credentials (cookies)
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

app.use(morgan("dev"));
app.use("/products", productsRoutes);
app.use("/auth", authRoutes);

// app.post("/checkout", async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "Node.js and Express book",
//           },
//           unit_amount: 50 * 100,
//         },
//         quantity: 1,
//       },
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "JavaScript T-Shirt",
//           },
//           unit_amount: 20 * 100,
//         },
//         quantity: 1,
//       },
//     ],
//     payment_method_types: ["card"],
//     mode: "payment",
//     success_url: `http://localhost:3000/complete?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: "http://localhost:3000/cancel",
//     shipping_address_collection: {
//       allowed_countries: ["US", "CA", "FR", "DZ"],
//     },
//   });
//   console.log(session);
//   res.redirect(303, session.url);
// });
app.post("/create-payment-intent", async (req, res) => {
  const { total, formUser } = req.body;

  if (!total || total <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100, // Convert to cents
      currency: "usd",

      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret }); // Send back clientSecret
  } catch (error) {
    res.status(400).json({ error: error.message }); // Handle any errors
  }
});

app.get("/config", (req, res) => {
  res.json({
    publishableKey: process.env.VITE_STRIPE_PUBLIC_KEY, // Send as JSON object
  });
});
app.post("/retrieve-customer-data", async (req, res) => {
  try {
    const { paymentIntentId, total, cart, shipping, formUser, firebaseUser } =
      req.body;

    // const isTestMode = process.env.NODE_ENV === "development";

    // // Test mode mock data
    // if (isTestMode) {
    //   return res.json({
    //     fullName: "John Doe",
    //     name: "John Doe",
    //     email: "testcustomer@example.com",
    //     country: "US",
    //     state: "CA",
    //     city: "Testville",
    //     street: "123 Test Street",
    //     transactionId: paymentIntentId || "pi_mock_123456789",
    //     postalCode: "12345",
    //     phone: "+15551234567",
    //     paymentMethod: "visa",
    //     last4: "4242",
    //     amount: "10.00",
    //     currency: "USD",
    //     created: new Date().toISOString(),
    //   });
    // }

    // Production mode - retrieve real Stripe data
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: ["payment_method"],
      }
    );
    const formatAddress = (address) =>
      [
        address.line1,
        address.line2,
        `${address.city}, ${address.state} ${address.postal_code}`,
        address.country,
      ]
        .filter(Boolean)
        .join("\n");

    const customerData = {
      amout: total || (paymentIntent.amount / 100).toFixed(2) || "0.00",
      fullName: shipping?.fullName || "Not provided",
      street: shipping?.address || "",
      email: formUser.user.email || firebaseUser?.email || "Not provided",
      country: shipping?.country || "N/A",
      city: shipping?.city || "",
      postalCode: shipping?.postalCode || "",
      items: cart,
      // fullName:
      //   paymentIntent.payment_method?.billing_details?.name || "Not provided",

      // email:
      //   paymentIntent.receipt_email ||
      //   paymentIntent.payment_method?.billing_details?.email ||
      //   "Not provided",
      // country:
      //   paymentIntent.payment_method?.billing_details?.address?.country ||
      //   "N/A",
      // state:
      //   paymentIntent.payment_method?.billing_details?.address?.state || "",
      // address: paymentIntent.billing_details?.address
      //   ? formatAddress(paymentIntent.billing_details.address)
      //   : "No address provided",
      // city: paymentIntent.payment_method?.billing_details?.address?.city || "",
      // street:
      //   paymentIntent.payment_method?.billing_details?.address?.line1 || "",

      transactionId: paymentIntent.id,
      postalCode:
        paymentIntent.payment_method?.billing_details?.address?.postal_code ||
        "",

      phone: paymentIntent.payment_method?.billing_details?.phone || "",
      paymentMethod: paymentIntent.payment_method?.card?.brand || "Unknown",
      last4: paymentIntent.payment_method?.card?.last4 || "****",
      amount: (paymentIntent.amount / 100).toFixed(2) || "0.00",
      currency: paymentIntent.currency.toUpperCase() || "USD",
      created:
        new Date(paymentIntent.created * 1000).toISOString() ||
        new Date().toISOString(),
    };

    res.json(customerData);
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve customer data",
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
