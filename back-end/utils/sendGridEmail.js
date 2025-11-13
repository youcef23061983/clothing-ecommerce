const sgMail = require("@sendgrid/mail");

// Set your SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendGridEmail = async ({ to, subject, html }) => {
  const msg = {
    to,
    from: process.env.SENDGRID_VERIFIED_SENDER, // Your verified sender email
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Email sent via SendGrid to", to);
    return true;
  } catch (error) {
    console.error(
      "❌ SendGrid email failed:",
      error.response?.body || error.message
    );
    return false;
  }
};

module.exports = sendGridEmail;
