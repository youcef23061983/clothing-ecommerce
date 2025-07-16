const axios = require("axios");

const formatPhoneNumber = (phone) => {
  let cleaned = phone.replace(/\D/g, "");

  if (!cleaned.startsWith("+")) {
    if (cleaned.startsWith("00")) {
      cleaned = "+" + cleaned.substring(2);
    } else {
      console.warn(
        "Assuming US number - specify country code for international numbers"
      );
      cleaned = "+1" + cleaned;
    }
  }

  return cleaned;
};

const sendSMS = async ({ phone, message }) => {
  try {
    const formattedPhone = formatPhoneNumber(phone);

    // === VALIDATION CHECK === //
    if (!/^\+[1-9]\d{1,14}$/.test(formattedPhone)) {
      throw new Error(`Rejected invalid phone number: ${formattedPhone}`);
    }
    // ======================= //

    const response = await axios.post("https://textbelt.com/text", {
      phone: formattedPhone,
      message,
      key: process.env.TEXTBELT_API_KEY || "textbelt",
    });

    if (!response.data.success) {
      throw new Error(response.data.error || "Unknown SMS gateway error");
    }

    console.log(`SMS sent to ${formattedPhone}`, {
      textId: response.data.textId,
      quota: response.data.quotaRemaining,
    });

    return response.data;
  } catch (error) {
    console.error("SMS Failed:", error.message);
    throw error; // Re-throw for caller to handle
  }
};

module.exports = { sendSMS, formatPhoneNumber };
