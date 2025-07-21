const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Initialize if not already done (better for standalone usage)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      require("./path/to/serviceAccountKey.json")
    ),
    storageBucket: "your-project-id.appspot.com",
  });
}

const uploadInvoice = async (orderId, pdfBufferOrPath) => {
  const bucket = admin.storage().bucket();
  let tempFilePath = null;

  try {
    // Handle both buffer and file path inputs
    let filePath;
    if (Buffer.isBuffer(pdfBufferOrPath)) {
      tempFilePath = path.join(__dirname, "../temp", `${orderId}.pdf`);
      fs.writeFileSync(tempFilePath, pdfBufferOrPath);
      filePath = tempFilePath;
    } else {
      filePath = pdfBufferOrPath;
    }

    // Upload with metadata
    await bucket.upload(filePath, {
      destination: `invoices/${orderId}.pdf`,
      metadata: {
        contentType: "application/pdf",
        metadata: {
          // Custom metadata
          owner: "system",
          createdAt: new Date().toISOString(),
        },
      },
    });

    // Generate signed URL (more secure than public URL)
    const [url] = await bucket.file(`invoices/${orderId}.pdf`).getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
      version: "v4",
    });

    return url;
  } catch (error) {
    console.error("Invoice upload failed:", error);
    throw new Error(`Failed to upload invoice: ${error.message}`);
  } finally {
    // Clean up temp file if created
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
};

module.exports = { uploadInvoice };
