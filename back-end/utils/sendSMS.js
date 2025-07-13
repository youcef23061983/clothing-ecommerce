const axios = require("axios");

const sendSMS = async ({ phone, message }) => {
  try {
    const response = await axios.post("https://textbelt.com/text", {
      phone,
      message,
      key: "textbelt", // 1 SMS/day free key
    });

    if (response.data.success) {
      console.log("✅ SMS sent successfully:", response.data);
    } else {
      console.error("❌ SMS failed:", response.data.error || response.data);
    }

    return response.data;
  } catch (error) {
    console.error("❌ SMS error:", error.message);
    throw error;
  }
};

module.exports = sendSMS;
