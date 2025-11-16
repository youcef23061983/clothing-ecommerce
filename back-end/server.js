// require("dotenv").config();
// const express = require("express");
// const app = express();
// app.set("trust proxy", true);

// const PORT = process.env.PORT || 3000;
// const cors = require("cors");
// const morgan = require("morgan");
// const productsRoutes = require("./routes/products.js");
// const authRoutes = require("./routes/authUser.js");
// const sellingsRoutes = require("./routes/sellings.js");
// const aj = require("./libs/arctjet.js");
// const helmet = require("helmet");

// const stripe = require("stripe")(process.env.VITE_STRIPE_SECRET_KEY);

// app.use(express.json());
// app.use(helmet());

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://clothing-ecommerce-phi.vercel.app",
//     ],
//     credentials: true, // Allow credentials (cookies)
//     optionsSuccessStatus: 200, // Some legacy browsers choke on 204
//   })
// );

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev")); // Colorful logs
// } else {
//   app.use(morgan("tiny")); // Minimal logs
// }
// app.use("/products", productsRoutes);
// app.use("/sell", sellingsRoutes);

// app.use("/auth", authRoutes);
// app.use(async (req, res, next) => {
//   // 🛑 Skip Arcjet on /health
//   if (req.path === "/health" || req.path === "/") return next();
//   if (req.path.startsWith("/assets")) return next();
//   console.log("Client IP:", req.ip);
//   console.log("User-Agent:", req.headers["user-agent"]);
//   console.log("Accept-Language:", req.headers["accept-language"]);
//   console.log("Request Path:", req.path);

//   try {
//     const ajPromise = await aj;

//     const decision = await ajPromise.protect(req, {
//       requested: 1, // specifies that each request consumes 1 token
//     });

//     if (decision.isDenied()) {
//       if (decision.reason.isRateLimit()) {
//         res.status(429).json({ error: "Too Many Requests" });
//       } else if (decision.reason.isBot()) {
//         res.status(403).json({ error: "Bot access denied" });
//       } else {
//         res.status(403).json({ error: "Forbidden" });
//       }
//       return;
//     }

//     // check for spoofed bots
//     if (
//       decision.results.some(
//         (result) => result.reason.isBot() && result.reason.isSpoofed()
//       )
//     ) {
//       res.status(403).json({ error: "Spoofed bot detected" });
//       return;
//     }

//     next();
//   } catch (error) {
//     console.log("Arcjet error", error);
//     next(error);
//   }
// });

// app.post("/create-payment-intent", async (req, res) => {
//   const { totalInCents } = req.body;

//   if (!totalInCents || totalInCents <= 0) {
//     return res.status(400).json({ error: "Invalid amount" });
//   }

//   try {
//     const paymentIntents = await stripe.paymentIntents.create({
//       amount: totalInCents,
//       currency: "usd",

//       automatic_payment_methods: { enabled: true },
//     });
//     res.json({ clientSecret: paymentIntents.client_secret,paymentIntentId: paymentIntents.id }); // Send back clientSecret
//   } catch (error) {
//     res.status(400).json({ error: error.message }); // Handle any errors
//   }
// });

// app.get("/config", (req, res) => {
//   res.json({
//     publishableKey: process.env.VITE_STRIPE_PUBLIC_KEY, // Send as JSON object
//   });
// });
// app.post("/retrieve-customer-data", async (req, res) => {
//   try {
//     const { sessionId, total, cart, shipping, formUser, firebaseUser } =
//       req.body;

//     // const isTestMode = process.env.NODE_ENV === "development";

//     // // Test mode mock data
//     // if (isTestMode) {
//     //   return res.json({
//     //     fullName: "John Doe",
//     //     name: "John Doe",
//     //     email: "testcustomer@example.com",
//     //     country: "US",
//     //     state: "CA",
//     //     city: "Testville",
//     //     street: "123 Test Street",
//     //     transactionId: sessionId || "pi_mock_123456789",
//     //     postalCode: "12345",
//     //     phone: "+15551234567",
//     //     paymentMethod: "visa",
//     //     last4: "4242",
//     //     amount: "10.00",
//     //     currency: "USD",
//     //     created: new Date().toISOString(),
//     //   });
//     // }

//     // Production mode - retrieve real Stripe data
//     const session = await stripe.sessions.retrieve(
//       sessionId,
//       {
//         expand: ["payment_method"],
//       }
//     );
//     const formatAddress = (address) =>
//       [
//         address.line1,
//         address.line2,
//         `${address.city}, ${address.state} ${address.postal_code}`,
//         address.country,
//       ]
//         .filter(Boolean)
//         .join("\n");

//     const customerData = {
//       amount: total || (session.amount / 100).toFixed(2) || "0.00",
//       fullName: shipping?.fullName || "Not provided",
//       street: shipping?.address || "",
//       email: formUser.user.email || firebaseUser?.email || "Not provided",
//       country: shipping?.country || "N/A",
//       city: shipping?.city || "",
//       postalCode: shipping?.postalCode || "",
//       items: cart,
//       // fullName:
//       //   session.payment_method?.billing_details?.name || "Not provided",

//       // email:
//       //   session.receipt_email ||
//       //   session.payment_method?.billing_details?.email ||
//       //   "Not provided",
//       // country:
//       //   session.payment_method?.billing_details?.address?.country ||
//       //   "N/A",
//       // state:
//       //   session.payment_method?.billing_details?.address?.state || "",
//       // address: session.billing_details?.address
//       //   ? formatAddress(session.billing_details.address)
//       //   : "No address provided",
//       // city: session.payment_method?.billing_details?.address?.city || "",
//       // street:
//       //   session.payment_method?.billing_details?.address?.line1 || "",

//       transactionId: session.id,
//       postalCode:
//         session.payment_method?.billing_details?.address?.postal_code ||
//         "",

//       phone: session.payment_method?.billing_details?.phone || "",
//       paymentMethod: session.payment_method?.card?.brand || "Unknown",
//       last4: session.payment_method?.card?.last4 || "****",
//       currency: session.currency.toUpperCase() || "USD",
//       created:
//         new Date(session.created * 1000).toISOString() ||
//         new Date().toISOString(),
//     };

//     res.json(customerData);
//   } catch (err) {
//     res.status(500).json({
//       error: "Failed to retrieve customer data",
//       details: err.message,
//     });
//   }
// });
// app.get("/", (req, res) => {
//   res.send("API is running ✅");
// });

// app.listen(PORT, () => {
//   console.log("Server is running on port", PORT);
// });

require("dotenv").config();
const express = require("express");
const app = express();
app.set("trust proxy", true);

const PORT = process.env.PORT || 3000;
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const productsRoutes = require("./routes/products.js");
const authRoutes = require("./routes/authUser.js");
const sellingsRoutes = require("./routes/sellings.js");
const aj = require("./libs/arctjet.js");

const stripe = require("stripe")(process.env.VITE_STRIPE_SECRET_KEY);
const sendEmail = require("./utils/sendEmail");
const sendwhatsappSMS = require("./utils/whatsappSMS.js");
const { sendSMS } = require("./utils/sendSMS.js");
const saveOrderToDatabase = require("./utils/saveOrderToDb.js");
const { sendtwilioSMS } = require("./utils/sendtwilioSms&call.js");
const generateInvoicePDF = require("./utils/generateInvoicePDF .js");
const { uploadInvoice } = require("./utils/uploadInvoiceToStorage .js");
const sendGridEmail = require("./utils/sendGridEmail.js");

// 1. Security middleware first

app.use(helmet());
// 2. CORS configuration

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://clothing-ecommerce-phi.vercel.app",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
// 3. Logging middleware

app.use(
  process.env.NODE_ENV === "development" ? morgan("dev") : morgan("tiny")
);
// 4. Stripe Webhook - Must come before JSON body parsers
// Webhook handler must be registered BEFORE any body parsers
app.post(
  "/webhook",
  // Use express.raw middleware to get raw body for signature verification
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    console.log("Signature:", sig ? "Present" : "Missing"); // Verify headers

    if (!sig) {
      console.error("❌ Missing Stripe signature");
      return res.status(400).send("Missing Stripe signature");
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body, // Use raw body directly
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log("🟢 Event type:", event.type); // Confirm event parsing
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle checkout.session.completed events
    if (event.type === "checkout.session.completed") {
      console.log("🛒 Checkout session completed - starting processing"); // Entry point

      try {
        console.log("🔔 Handling checkout.session.completed event");

        // Retrieve the expanded session
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          {
            expand: ["line_items", "payment_intent.payment_method"],
          }
        );
        console.log("📦 Raw session data:", JSON.stringify(session, null, 2));

        // Extract customer details with proper fallbacks
        const metadata = session.metadata || {};

        const customerDetails = session.customer_details || {};
        const email =
          customerDetails.email || metadata.email || "no-email@example.com";

        const fullName =
          customerDetails.name || metadata.fullName || "Valued Customer";
        const phone = customerDetails.phone || metadata.phone || null;
        const stripe_payment_intent_id = session.payment_intent.id;
        const amount = metadata.amount;
        const currency = session.currency.toUpperCase();
        const country =
          session.shipping_details?.address?.country ||
          session.metadata?.country ||
          "Not provided";
        const postalCode =
          session.shipping_details?.address?.postal_code ||
          metadata?.postalCode ||
          "Not provided";
        const address =
          session.shipping_details?.address?.line1 ||
          metadata?.address ||
          "no-email@example.com";
        const city =
          session.shipping_details?.address?.city ||
          metadata?.city ||
          "Not provided";
        const subtotal = metadata.subtotal || "0";
        const tax = metadata.tax || "0";
        const total = session.amount_total / 100 || metadata.total || "0";

        const tbluser_id = metadata.userId || "guest";
        const shipping =
          metadata.shipping || (session.shipping_cost?.amount_total || 0) / 100;
        const sellingProduct = JSON.parse(metadata.cart || "[]");
        const payment = "stripe" || "no method";

        // Log important details

        // Prepare order data for database
        const orderData = {
          fullName,
          address,
          city,
          postalCode,
          country,
          payment,
          phone,
          amount,
          subtotal,
          tbluser_id,
          total,
          tax,
          shipping,
          sellingProduct,
          stripe_payment_intent_id,
        };

        // Save to database
        await saveOrderToDatabase(orderData);
        console.log("💾 Order saved to database");
        console.log("💰 Payment Details:", {
          stripe_payment_intent_id,
          total: total.toFixed(2),
          currency,
          email: email,
          phone: phone ? "provided" : "not provided",
        });
        console.log("📱 My Phone Number:", metadata?.phone);
        console.log("🛡️ My Session:", session);
        console.log(" 📧 Email:", email);

        // Send email notification

        try {
          //       const emailSent = await sendEmail({
          //         to: email,
          //         subject: `🧾 Order Confirmation #${stripe_payment_intent_id}`,
          //         html: `
          //   <p>Hello ${fullName},</p>
          //   <p>Thank you for your order <strong>#${stripe_payment_intent_id}</strong>.</p>
          //   <p>Total: <strong>${total} ${currency}</strong></p>
          //   <p>View your order details <a href="${process.env.VITE_PUBLIC_PRODUCTS_FRONTEND_URL}/order/${stripe_payment_intent_id}">here</a>.</p>
          //   <p>If you have any questions, please contact our support team.</p>
          // `,
          //       });

          //       if (emailSent) {
          //         console.log("📧 Confirmation email sent to", fullName);
          //       } else {
          //         console.log("❌ Email failed to send for", fullName);
          //         // You might want to handle this case - maybe retry or log to database
          //       }
          //     } catch (emailError) {
          //       console.error("❌ Failed to send email:", emailError.message);
          //     }
          console.log("🔧 Debug - Environment variables check:");
          console.log(
            "SENDGRID_API_KEY exists:",
            !!process.env.SENDGRID_API_KEY
          );
          console.log(
            "SENDGRID_API_KEY length:",
            process.env.SENDGRID_API_KEY?.length
          );
          console.log(
            "SENDGRID_VERIFIED_SENDER:",
            process.env.SENDGRID_VERIFIED_SENDER
          );
          const emailSent = await sendGridEmail({
            to: email,
            subject: `🧾 Order Confirmation #${stripe_payment_intent_id}`,
            orderData,
          });

          if (emailSent) {
            console.log("📧 Confirmation email sent to", fullName);
          } else {
            console.log("❌ Email failed to send for", fullName);
            // You might want to handle this case - maybe retry or log to database
          }
        } catch (emailError) {
          console.error("❌ Failed to send email:", emailError.message);
        }

        // Send SMS notifications if phone number exists and textbelt accept the country:
        if (phone) {
          try {
            // await sendwhatsappSMS({
            //   phone: phone,
            //   name: fullName,
            //   stripe_payment_intent_id,
            //   total,
            // });

            // await sendSMS({
            //   phone: phone,
            //   message: `Hi ${fullName}, your order #${stripe_payment_intent_id} of ${currency} ${(
            //     total / 100
            //   ).toFixed(2)} was received. Thank you!`,
            // });

            // const pdfBuffer = await generateInvoicePDF(metadata, stripe_payment_intent_id);
            // const pdfUrl = await uploadInvoice(session.id, pdfBuffer);

            // await sendtwilioSMS({
            //   phone: phone,
            //   // message: `Hi ${fullName}, your order #${stripe_payment_intent_id} of ${currency} ${total} $ was received. Thank you!`,
            //   message: "hi i am youcef here, it works",
            //   pdfUrl,
            // });
            await sendtwilioSMS({
              phone: phone,
              message: `Hi ${fullName}, your order #${stripe_payment_intent_id} of ${total} ${currency} was received. Thank you!`,
            });
            console.log("📱 twilio SMS notifications sent to", phone);
            console.log("🆔 SID:", process.env.TWILIO_SID);
            console.log("🔑 AUTH:", process.env.TWILIO_AUTH);

            // await sendTwilioCall({
            //   phone: phone,
            //   message: `Hi ${fullName}, your order #${stripe_payment_intent_id} of ${currency} ${(
            //     total / 100
            //   ).toFixed(2)} $ was received. Thank you!`,
            // });
            // console.log("📱 SMS notifications sent to", phone);
          } catch (smsError) {
            console.error("❌ Failed to send SMS:", smsError.message);
          }
        }
      } catch (processingError) {
        console.error("❌ Order processing failed:", processingError);
        // Here you should implement your error handling logic:
        // - Log to error tracking service
        // - Retry mechanism
        // - Alert your team
      }
    }

    // Return a response to Stripe to prevent retries
    res.status(200).json({ received: true });
  }
);

// IMPORTANT: Regular body parsers must come AFTER the webhook handler
app.use(express.json());
// 5. Regular body parsers (AFTER webhook handler)
// Stripe needs raw body for webhook verification
// app.use(
//   express.json({
//     verify: (req, res, buf) => {
//       if (req.originalUrl.startsWith("/webhook")) {
//         req.rawBody = buf.toString();
//       }
//     },
//   })
// );
// 6. API routes

app.use("/products", productsRoutes);
app.use("/sell", sellingsRoutes);
app.use("/auth", authRoutes);

// //////////////////////////////////////// you let the tax be calculated by stripe:\\\\\\\\\\\\\\\\\\\\\\

// // app.post("/create-checkout-session", async (req, res) => {
// //   const {
// //     totalInCents,
// //     metadata,
// //     subtotal,
// //     tax, // Optional (if you still want manual tax as fallback)
// //     shipping,
// //   } = req.body;

// //   try {
// //     const cartItems = JSON.parse(metadata.cart);

// //     const line_items = cartItems.map((item) => ({
// //       price_data: {
// //         currency: "usd",
// //         product_data: {
// //           name: item.name,
// //           // images: item.image?.startsWith('http') ? [item.image] : undefined,
// //           tax_code: "txcd_30000000", // Stripe tax category (e.g., "General Goods")
// //         },
// //         unit_amount: Math.round(item.price * 100),
// //       },
// //       quantity: item.quantity,
// //     }));

// //     const sessionParams = {
// //       payment_method_types: ["card"],
// //       line_items,
// //       mode: "payment",
// //       customer_email: metadata.email,
// //       phone_number_collection: { enabled: true },
// //       metadata: {
// //         ...metadata,
// //         subtotal: String(subtotal || "0"),
// //         tax: String(tax || "0"), // Still useful for reference
// //         shipping: String(shipping || "0"),
// //         total: String(totalInCents || "0"),
// //       },
// //       success_url: `${process.env.VITE_PUBLIC_PRODUCTS_URL}/order?session_id={CHECKOUT_SESSION_ID}`,
// //       cancel_url: `${process.env.VITE_PUBLIC_PRODUCTS_URL}/cart`,
// //       shipping_address_collection: {
// //         allowed_countries: ["US", "CA", "FR", "DZ"], // Stripe needs this for tax calculation
// //       },
// //       automatic_tax: {
// //         enabled: true, // Enable automatic tax calculation
// //       },
// //     };

// //     // If shipping is provided, add it as a shipping option
// //     if (shipping) {
// //       sessionParams.shipping_options = [
// //         {
// //           shipping_rate_data: {
// //             type: "fixed_amount",
// //             fixed_amount: {
// //               amount: Math.round(shipping * 100),
// //               currency: "usd",
// //             },
// //             display_name: "Shipping",
// //           },
// //         },
// //       ];
// //     }

// //     const session = await stripe.checkout.sessions.create(sessionParams);
// //     res.json({ sessionId: session.id,      paymentIntentId: paymentIntent.id, });
// //   } catch (err) {
// //     console.error("Stripe Session Error:", err);
// //     res.status(400).json({
// //       error: "Failed to create checkout session",
// //       details: err.message,
// //     });
// //   }
// // });

// ////////////////////////////////////////// retrieve the success data if we work on nextjs:\\\\\\\\\\\\\\\
// //     expand: ["payment_intent.payment_method"]: to show you all the card details
// // app.post("/order", async (req, res) => {
// //   const session = await stripe.checkout.session.retrieve(req.query.session_id, {
// //     expand: ["payment_intent.payment_method"],
// //   });
// //   const items = await stripe.checkout.session.listLineItems(
// //     req.query.session_id
// //   );
// //   console.log("session", session);
// //   console.log("items", items);
// // });
app.post("/create-checkout-session", async (req, res) => {
  const { total, metadata, subtotal, tax, shipping, amount, cart } = req.body;

  try {
    const cartItems = JSON.parse(metadata.cart || "[]"); // ✅ parse it

    const line_items = cartItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product_name || "Unnamed Product",
            images: [
              `${process.env.VITE_PUBLIC_PRODUCTS_FRONTEND_URL}/${item.image}`,
            ],
          },
          unit_amount: Math.round(Number(item.unitPrice || 0) * 100), // ✅ safe
        },
        quantity: item.amount || 1,
      };
    });

    const sessionParams = {
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: metadata.email,
      phone_number_collection: { enabled: true },
      metadata: {
        ...metadata,
        subtotal: subtotal || "0",
        tax: tax || "0",
        shipping: shipping || "0",
        total: total || "0",
        amount: amount || "0",
      },
      success_url: `${process.env.VITE_PUBLIC_PRODUCTS_FRONTEND_URL}/order?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_PUBLIC_PRODUCTS_FRONTEND_URL}/cart`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "FR", "DZ"],
      },
      automatic_tax: {
        enabled: false, // Set to true if you want Stripe to handle taxes
      },
    };

    // Add shipping as a shipping option if it exists
    if (shipping) {
      sessionParams.shipping_options = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: Math.round(Number(shipping || 0) * 100), // ✅ ensure number
              currency: "usd",
            },
            display_name: "Shipping",
          },
        },
      ];
    }

    // If not using automatic tax, add tax as a line item
    if (tax && !sessionParams.automatic_tax.enabled) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Tax" },

          unit_amount: Math.round(Number(tax || 0) * 100), // ✅ ensure number
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe Session Error:", err);
    res.status(400).json({
      error: "Failed to create checkout session",
      details: err.message,
    });
  }
});
// 8. Config endpoint

app.get("/config", (req, res) => {
  res.json({
    publishableKey: process.env.VITE_STRIPE_PUBLIC_KEY,
  });
});
// 9. Health check endpoint

app.get("/", (req, res) => {
  res.send("✅ API is running");
});
// 10. Arcjet middleware (commented out as in original)

if (process.env.NODE_ENV === "production") {
  app.use(async (req, res, next) => {
    if (
      ["/", "/health", "/webhook"].includes(req.path) ||
      req.path.startsWith("/assets")
    ) {
      return next();
    }

    try {
      const ajPromise = await aj;
      const decision = await ajPromise.protect(req, { requested: 1 });

      if (decision.isDenied()) {
        return res
          .status(decision.reason.isRateLimit() ? 429 : 403)
          .json({ error: decision.reason.toString() });
      }

      if (
        decision.results.some(
          (result) => result.reason.isBot() && result.reason.isSpoofed()
        )
      ) {
        return res.status(403).json({ error: "Spoofed bot detected" });
      }

      next();
    } catch (error) {
      console.error("Arcjet error", error);
      next(error);
    }
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
