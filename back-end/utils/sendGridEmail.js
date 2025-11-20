const sgMail = require("@sendgrid/mail");

const sendGridEmail = async ({ to, subject, orderData }) => {
  // Debug: Check if API key is loaded
  if (!process.env.SENDGRID_API_KEY) {
    console.error("❌ SendGrid API key is missing");
    return false;
  }

  if (!process.env.SENDGRID_VERIFIED_SENDER) {
    console.error("❌ SendGrid verified sender is missing");
    return false;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
                `
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

  const msg = {
    to,
    from: process.env.SENDGRID_VERIFIED_SENDER,
    subject,
    html: emailHtml,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Email sent via SendGrid to", to);
    return true;
  } catch (error) {
    console.error("❌ SendGrid email failed:");
    console.error("Error details:", error.response?.body || error.message);

    // More detailed error logging
    if (error.response) {
      console.error("Status code:", error.response.statusCode);
      console.error("Headers:", error.response.headers);
    }

    return false;
  }
};

module.exports = sendGridEmail;
