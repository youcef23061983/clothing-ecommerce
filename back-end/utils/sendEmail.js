const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // your Gmail address
      pass: process.env.GMAIL_PASS, // app password (NOT your Gmail password)
    },
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,
    socketTimeout: 60000,
    dnsTimeout: 30000,
  });

  const mailOptions = {
    from: `"My Shop" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to", to);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
};

module.exports = sendEmail;
