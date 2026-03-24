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
const sendGridEmail = require("./utils/sendGridEmail.js");
const { sendtwilioSMS } = require("./utils/sendtwilioSms&call.js");
const sendEmailBrevo = require("./utils/sendEmailBrevo.js");

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
  }),
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
        (result) => result.reason.isBot() && result.reason.isSpoofed(),
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
    const paymentIntents = await stripe.paymentIntents.create({
      amount: totalInCents,
      currency: "usd",

      automatic_payment_methods: { enabled: true },
    });
    res.json({
      clientSecret: paymentIntents.client_secret,
      // paymentIntentId: paymentIntents.id,
    }); // Send back clientSecret
  } catch (error) {
    res.status(400).json({ error: error.message }); // Handle any errors
  }
});

app.get("/config", (req, res) => {
  res.json({
    publishableKey: process.env.VITE_STRIPE_PUBLIC_KEY, // Send as JSON object
  });
});
// New endpoint specifically for sending emails
app.post("/send-order-email", async (req, res) => {
  try {
    const { to, subject, orderData } = req.body;
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .content { padding: 30px; }
        .order-details { background: #f8fafc; padding: 25px; border-radius: 8px; margin: 20px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .items-table th { text-align: left; padding: 12px 8px; border-bottom: 2px solid #e2e8f0; color: #374151; font-weight: 600; }
        .items-table td { padding: 12px 8px; border-bottom: 1px solid #e2e8f0; }
        .item-name { font-weight: 500; color: #1f2937; }
        .item-quantity { text-align: center; color: #6b7280; }
        .item-price { text-align: right; color: #059669; font-weight: 500; }
        .total-row { background: #f0fdf4; font-weight: bold; }
        .total-row td { border-bottom: none; padding-top: 15px; }
        .total-amount { text-align: right; font-size: 1.2em; color: #059669; }
        .footer { text-align: center; padding: 20px; background: #f1f5f9; color: #64748b; }
        .invoice-section { 
          background: #f0f9ff; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0; 
          text-align: center;
          border-left: 4px solid #059669;
        }
        .invoice-button {
          display: inline-block;
          background: #059669;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin: 10px 0;
          transition: background-color 0.2s;
        }
        .invoice-button:hover {
          background: #047857;
        }
        .shipping-info {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #3b82f6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🎉 Thank You for Your Order!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your purchase journey is about to begin</p>
        </div>
        <div class="content">
          <h2 style="color: #1f2937; margin-bottom: 10px;">Hello ${
            orderData.fullName
          },</h2>
          <p style="color: #6b7280; margin-bottom: 25px;">We're excited to let you know that we've received your order and it's being prepared!</p>
          
          <div class="order-details">
            <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 20px;">Order Details</h3>
            <p style="margin: 10px 0;"><strong>Order ID:</strong> ${
              orderData.stripe_payment_intent_id
            }</p>
            
            <h4 style="color: #374151; margin: 20px 0 15px 0;">Items Ordered:</h4>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 50%;">Product</th>
                  <th style="width: 20%; text-align: center;">Qty</th>
                  <th style="width: 30%; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${orderData?.sellingProduct
                  .map(
                    (item) => `
                <tr>
                  <td class="item-name">${item.product_name}</td>
                  <td class="item-quantity">${item.amount}</td>
                  <td class="item-price">${item.totalPrice.toFixed(2)} $</td>
                </tr>
                `,
                  )
                  .join("")}
                   <tr class="total-row">
                  <td colspan="2" style="text-align: right; font-weight: bold;">Tax:</td>
                  <td class="total-amount">${orderData.tax} $</td>
                </tr> <tr class="total-row">
                  <td colspan="2" style="text-align: right; font-weight: bold;">Shipping:</td>
                  <td class="total-amount">${orderData.shipping} $</td>
                </tr>
                <tr class="total-row">
                  <td colspan="2" style="text-align: right; font-weight: bold;">Total:</td>
                  <td class="total-amount">${orderData.total} $</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="shipping-info">
            <h4 style="color: #374151; margin-top: 0; margin-bottom: 15px;">📦 Shipping Address</h4>
            <p style="margin: 8px 0; line-height: 1.5;">
              <strong>${orderData.address}</strong><br>
              ${orderData.city}, ${orderData.postalCode}<br>
              ${orderData.country}<br>
              📞 ${orderData.phone}
            </p>
          </div>

          ${
            orderData.invoiceUrl
              ? `
          <div class="invoice-section">
            <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">📄 Your Invoice is Ready!</h3>
            <p style="margin: 10px 0; color: #374151;">Download your order invoice for your records:</p>
            <a href="${orderData.invoiceUrl}" class="invoice-button" target="_blank">
              Download Invoice PDF
            </a>
            <p style="font-size: 12px; color: #6b7280; margin-top: 15px; word-break: break-all;">
              Can't click the button? Copy this link:<br>
              ${orderData.invoiceUrl}
            </p>
          </div>
          `
              : ""
          }
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97706;">
            <h4 style="color: #92400e; margin-top: 0; margin-bottom: 10px;">🔄 What's Next?</h4>
            <ul style="margin: 0; padding-left: 20px; color: #78350f;">
              <li style="margin-bottom: 8px;">We'll send you a confirmation when your order ships</li>
              <li style="margin-bottom: 8px;">Expected delivery: 3-5 business days</li>
              <li style="margin-bottom: 8px;">Track your order with your order ID: <strong>${
                orderData.stripe_payment_intent_id
              }</strong></li>
            </ul>
          </div>
          
          <p style="color: #6b7280; text-align: center; margin: 25px 0 15px 0;">
            If you have any questions, reply to this email or call us at <strong>1-800-DESIRE</strong>
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 10px 0;">© 2024 Desire All Rights Reserved</p>
          <p style="margin: 0; font-style: italic;">DESIRED to make happiness, one purchase at a time 🛍️</p>
        </div>
      </div>
    </body>
    </html>
  `;

    console.log("📧 Sending order email to:", to);

    // Use your existing sendGridEmail function
    // const emailSent = await sendGridEmail({ to, subject, orderData });
    const emailSent = await sendEmailBrevo({ to, subject, html: emailHtml });

    if (emailSent) {
      res.json({ success: true, message: "Email sent successfully" });
    } else {
      res.status(500).json({ error: "Failed to send email" });
    }
  } catch (err) {
    console.error("❌ Email endpoint error:", err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/send-order-sms", async (req, res) => {
  try {
    const { orderData } = req.body;

    if (!orderData.phone) {
      return res.json({ success: true, message: "No phone number provided" });
    }

    await sendtwilioSMS({
      phone: orderData.phone,
      message: `Hi ${orderData.fullName}, your order #${orderData.stripe_payment_intent_id} of ${orderData.total} ${orderData.currency} was received. Thank you!`,
    });

    res.json({ success: true, message: "SMS sent successfully" });
  } catch (err) {
    console.error("❌ SMS endpoint error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("API is running ✅");
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
