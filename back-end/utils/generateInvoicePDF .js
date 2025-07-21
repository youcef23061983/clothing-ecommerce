const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const moment = require("moment");

// Configurable constants
const CONFIG = {
  MARGIN: 50,
  LOGO_SIZE: 50,
  FONT_PRIMARY: "Helvetica",
  FONT_BOLD: "Helvetica-Bold",
  COLORS: {
    primary: "#444444",
    secondary: "#666666",
    divider: "#aaaaaa",
  },
};

const generateInvoicePDF = async (orderData, orderId) => {
  return new Promise((resolve, reject) => {
    try {
      // Create invoices directory
      const invoicesDir = path.join(__dirname, "invoices");
      fs.mkdirSync(invoicesDir, { recursive: true });

      const doc = new PDFDocument({
        margin: CONFIG.MARGIN,
        size: "A4",
        bufferPages: true,
        compress: true,
        fontLayoutCache: true,
        info: {
          Title: `Invoice ${orderId}`,
          Author: metadata?.companyName || "Your Company",
        },
      });

      const filePath = path.join(invoicesDir, `${orderId}.pdf`);
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Generate document sections
      generateHeader(doc, orderData);
      generateCustomerInfo(doc, orderData, orderId);
      generateInvoiceItems(doc, orderData);
      generateFooter(doc);

      doc.end();

      writeStream.on("finish", () => resolve(filePath));
      writeStream.on("error", reject);
    } catch (err) {
      console.error("PDF Generation Error:", err);
      reject(new Error("Failed to generate invoice"));
    }
  });
};

// -- Header Section --
function generateHeader(doc, { metadata = {} }) {
  const {
    companyLogoPath,
    companyName,
    companyAddress,
    companyCity,
    companyState,
    companyPostalCode,
  } = metadata;
  const hasLogo = companyLogoPath && fs.existsSync(companyLogoPath);

  // Company Logo
  if (hasLogo) {
    doc.image(companyLogoPath, CONFIG.MARGIN, CONFIG.MARGIN, {
      width: CONFIG.LOGO_SIZE,
      height: CONFIG.LOGO_SIZE,
      fit: [CONFIG.LOGO_SIZE, CONFIG.LOGO_SIZE],
    });
  }

  // Company Info
  doc
    .fillColor(CONFIG.COLORS.primary)
    .font(CONFIG.FONT_BOLD)
    .fontSize(20)
    .text(
      companyName || "Your Company",
      hasLogo ? CONFIG.MARGIN + CONFIG.LOGO_SIZE + 10 : CONFIG.MARGIN,
      CONFIG.MARGIN
    )
    .font(CONFIG.FONT_PRIMARY)
    .fontSize(10)
    .text(companyAddress || "123 Business Rd", 0, CONFIG.MARGIN + 25, {
      align: "right",
      width: doc.page.width - CONFIG.MARGIN * 2,
    })
    .text(
      `${companyCity || "City"}, ${companyState || "ST"} ${
        companyPostalCode || "12345"
      }`,
      0,
      CONFIG.MARGIN + 40,
      { align: "right", width: doc.page.width - CONFIG.MARGIN * 2 }
    )
    .moveDown(2);
}

// -- Customer Information --
function generateCustomerInfo(doc, order, orderId) {
  const { fullName, address, city, postalCode, country, currency, total } =
    order;

  doc
    .fontSize(20)
    .font(CONFIG.FONT_BOLD)
    .text("Invoice", CONFIG.MARGIN, 150)
    .moveDown(0.5);

  generateDivider(doc, 180);

  // Invoice Metadata
  doc
    .font(CONFIG.FONT_PRIMARY)
    .fontSize(10)
    .text("Invoice #:", CONFIG.MARGIN, 200)
    .text(orderId, 150, 200)
    .text("Date:", CONFIG.MARGIN, 220)
    .text(moment().format("MMMM D, YYYY"), 150, 220)
    .text("Amount Due:", CONFIG.MARGIN, 240)
    .font(CONFIG.FONT_BOLD)
    .text(formatCurrency(total, currency), 150, 240)
    .font(CONFIG.FONT_PRIMARY);

  // Customer Info
  doc
    .text("Bill To:", 300, 200)
    .font(CONFIG.FONT_BOLD)
    .text(fullName, 300, 220)
    .font(CONFIG.FONT_PRIMARY)
    .text(address, 300, 240)
    .text(`${city}, ${postalCode}, ${country}`, 300, 260);

  generateDivider(doc, 280);
}

// -- Invoice Items --
function generateInvoiceItems(doc, order) {
  const startY = 300;
  const rowHeight = 30;
  const colWidths = [100, 150, 80, 60, 90]; // Column widths

  // Table Header
  doc
    .font(CONFIG.FONT_BOLD)
    .fontSize(10)
    .text("Item", CONFIG.MARGIN, startY)
    .text("Description", CONFIG.MARGIN + colWidths[0], startY)
    .text("Price", CONFIG.MARGIN + colWidths[0] + colWidths[1], startY, {
      width: colWidths[2],
      align: "right",
    })
    .text(
      "Qty",
      CONFIG.MARGIN + colWidths[0] + colWidths[1] + colWidths[2],
      startY,
      { width: colWidths[3], align: "right" }
    )
    .text("Total", 0, startY, { align: "right" });

  generateDivider(doc, startY + 20);

  // Table Rows
  let currentY = startY + rowHeight;
  order.cart.forEach((item) => {
    doc
      .font(CONFIG.FONT_PRIMARY)
      .fontSize(10)
      .text(item.product_name, CONFIG.MARGIN, currentY, {
        width: colWidths[0],
        ellipsis: true,
      })
      .text(item.description || "-", CONFIG.MARGIN + colWidths[0], currentY, {
        width: colWidths[1],
        ellipsis: true,
      })
      .text(
        formatCurrency(item.unitPrice, order.currency),
        CONFIG.MARGIN + colWidths[0] + colWidths[1],
        currentY,
        { width: colWidths[2], align: "right" }
      )
      .text(
        item.quantity,
        CONFIG.MARGIN + colWidths[0] + colWidths[1] + colWidths[2],
        currentY,
        { width: colWidths[3], align: "right" }
      )
      .text(
        formatCurrency(item.unitPrice * item.quantity, order.currency),
        0,
        currentY,
        { align: "right" }
      );

    generateDivider(doc, currentY + 20);
    currentY += rowHeight;

    // Page break logic
    if (currentY > doc.page.height - 100) {
      doc.addPage();
      currentY = CONFIG.MARGIN;
    }
  });

  // Totals
  doc
    .font(CONFIG.FONT_BOLD)
    .text("Subtotal:", CONFIG.MARGIN + colWidths[0] + colWidths[1], currentY, {
      width: colWidths[2],
      align: "right",
    })
    .text(formatCurrency(order.subtotal, order.currency), 0, currentY, {
      align: "right",
    });

  currentY += rowHeight;
  doc
    .text("Tax:", CONFIG.MARGIN + colWidths[0] + colWidths[1], currentY, {
      width: colWidths[2],
      align: "right",
    })
    .text(formatCurrency(order.tax, order.currency), 0, currentY, {
      align: "right",
    });

  currentY += rowHeight;
  doc
    .fontSize(12)
    .text("Total:", CONFIG.MARGIN + colWidths[0] + colWidths[1], currentY, {
      width: colWidths[2],
      align: "right",
    })
    .text(formatCurrency(order.total, order.currency), 0, currentY, {
      align: "right",
    });
}

// -- Footer --
function generateFooter(doc) {
  doc
    .fontSize(10)
    .text("Thank you for your business!", CONFIG.MARGIN, doc.page.height - 50, {
      align: "center",
      width: doc.page.width - CONFIG.MARGIN * 2,
    });
}

// -- Helper Functions --
function generateDivider(doc, y) {
  doc
    .strokeColor(CONFIG.COLORS.divider)
    .lineWidth(1)
    .moveTo(CONFIG.MARGIN, y)
    .lineTo(doc.page.width - CONFIG.MARGIN, y)
    .stroke();
}

function formatCurrency(amount, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

module.exports = generateInvoicePDF;
