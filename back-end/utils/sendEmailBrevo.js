const sendEmailBrevo = async ({ to, subject, html }) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "My Shop", email: process.env.GMAIL_USER },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    console.log("✅ Email sent:", data);
    return data;
  } catch (err) {
    console.error("❌ Brevo error FULL:", err);
    throw err;
  }
};
module.exports = sendEmailBrevo;
