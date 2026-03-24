// utils/sendEmailBrevo.js
const brevo = require("@getbrevo/brevo");

const sendEmailBrevo = async ({ to, subject, html }) => {
  // Check if API key exists
  if (!process.env.BREVO_API_KEY) {
    console.error("❌ BREVO_API_KEY is missing in environment variables");
    throw new Error("BREVO_API_KEY missing");
  }

  try {
    // Configure Brevo API
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(process.env.BREVO_API_KEY);

    // Create email content
    const sendSmtpEmail = {
      to: [{ email: to }],
      sender: {
        email: process.env.GMAIL_USER, // Your Gmail as sender
        name: "My Shop",
      },
      subject: subject,
      htmlContent: html,
      // Optional: Add text version for better deliverability
      textContent: subject,
    };

    // Send the email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent via Brevo to:", to);
    return response;
  } catch (error) {
    console.error("❌ Brevo error:", error.response?.body || error.message);
    throw error;
  }
};

module.exports = sendEmailBrevo;
