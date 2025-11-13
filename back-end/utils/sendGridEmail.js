const sgMail = require("@sendgrid/mail");

const sendGridEmail = async ({ to, subject, html }) => {
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

  const msg = {
    to,
    from: process.env.SENDGRID_VERIFIED_SENDER,
    subject,
    html,
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
