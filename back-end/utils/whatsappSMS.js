const axios = require("axios");

const sendSMS = async ({ phone, name, orderId, total }) => {
  const message = `Hi ${name}, your order ${orderId} of $${(
    total / 100
  ).toFixed(2)} was received. Thank you!`;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(
    message
  )}&apikey=${process.env.CALLMEBOT_API_KEY}`;

  try {
    const res = await axios.get(url);
    console.log("✅ SMS sent:", res.data);
  } catch (err) {
    console.error("❌ SMS error:", err.message);
  }
};

module.exports = sendSMS;
