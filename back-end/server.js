require("dotenv").config();
const express = require("express");
const app = express();
app.set("trust proxy", true);

const PORT = process.env.PORT || 3000;
const cors = require("cors");
const morgan = require("morgan");
const productsRoutes = require("./routes/products.js");
const authRoutes = require("./routes/authUser.js");
const sellingsRoutes = require("./routes/sellings.js");
const aj = require("./libs/arctjet.js");
const helmet = require("helmet");

const stripe = require("stripe")(process.env.VITE_STRIPE_SECRET_KEY);

app.use(express.json());
app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://clothing-ecommerce-phi.vercel.app",
    ],
    credentials: true, // Allow credentials (cookies)
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Colorful logs
} else {
  app.use(morgan("tiny")); // Minimal logs
}
app.use("/products", productsRoutes);
app.use("/sell", sellingsRoutes);

app.use("/auth", authRoutes);
app.use(async (req, res, next) => {
  // 🛑 Skip Arcjet on /health
  if (req.path === "/health" || req.path === "/") return next();
  if (req.path.startsWith("/assets")) return next();
  console.log("Client IP:", req.ip);
  console.log("User-Agent:", req.headers["user-agent"]);
  console.log("Accept-Language:", req.headers["accept-language"]);
  console.log("Request Path:", req.path);

  try {
    const ajPromise = await aj;

    const decision = await ajPromise.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // check for spoofed bots
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }

    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
});

app.post("/create-payment-intent", async (req, res) => {
  const { totalInCents } = req.body;

  if (!totalInCents || totalInCents <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalInCents,
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
      amount: total || (paymentIntent.amount / 100).toFixed(2) || "0.00",
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
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
