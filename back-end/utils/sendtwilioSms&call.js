require("dotenv").config();
const client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

const sendtwilioSMS = async ({ phone, message }) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
      mediaUrl: ["https://www.google.com"],
    });
    console.log("✅ SMS sent", result.sid);
  } catch (err) {
    console.error("❌ SMS Error:", err.message);
  }
};
const sendTwilioCall = async ({ phone, message }) => {
  try {
    const result = await client.calls.create({
      //   twiml: `<Response><Play>https://your-site.com/payment-success.mp3</Play></Response>`,

      twiml: `<Response><Say voice='man' language='en-gb' >${message}</Say></Response>`,
      //       twiml: `<Response>
      //   <Say voice='man' language='en-gb'>
      //     Hi ${full}, your order ${orderId} of $${(total / 100).toFixed(
      //         2
      //       )} was received.
      //   </Say>
      //   <Pause length="2"/>
      //   <Say voice='man' language='en-gb'>
      //     Thank you!
      //   </Say>
      // </Response>`,

      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    console.log("✅ Call initiated, SID:", result.sid);
  } catch (err) {
    console.error("❌ Call Error:", err.message);
  }
};

module.exports = { sendtwilioSMS, sendTwilioCall };
