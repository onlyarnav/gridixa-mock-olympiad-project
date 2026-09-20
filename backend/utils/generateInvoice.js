const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

function formatMoneyPaise(paise) {
  const rupees = Number(paise || 0) / 100;
  return `Rs. ${rupees.toFixed(2)}`;
}

module.exports = async function generateInvoice(data) {
  const {
    name,
    email,
    invoiceNumber,
    date,
    originalAmount = 19900, // ✅ NEW
    subtotalAmount = 0,
    gstAmount = 0,
    discountAmount = 0,
    payableAmount = 0,
    couponCode = null,
  } = data;

  const templatePath = path.join(__dirname, "../public/invoice.pdf");
  const existingPdfBytes = fs.readFileSync(templatePath);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  const font = await pdfDoc.embedFont(StandardFonts.CourierBold);

  page.drawText(name, {
    x: 320,
    y: 657,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(email, {
    x: 320,
    y: 638,
    size: 12,
    font,
  });

  page.drawText(String(invoiceNumber), {
    x: 154,
    y: 549,
    size: 12,
    font,
  });

  page.drawText(date, {
    x: 154,
    y: 527,
    size: 12,
    font,
  });

  // 1. Original Price
  page.drawText("Base Amount", {
    x: 154,
    y: 449,
    size: 12,
    font,
  });

  page.drawText(formatMoneyPaise(originalAmount), {
    x: 320,
    y: 449,
    size: 12,
    font,
  });

  // 2. Discount
  page.drawText("Discount", {
    x: 154,
    y: 427,
    size: 12,
    font,
  });
  
  if (couponCode) {
    page.drawText(`(${couponCode})`, {
      x: 230,
      y: 427,
      size: 12,
      font,
    });
  }

  page.drawText("- " + formatMoneyPaise(discountAmount), {
    x: 320,
    y: 427,
    size: 12,
    font,
  });

  // 3. Taxable Amount (after discount)
  page.drawText("Subtotal", {
    x: 154,
    y: 390,
    size: 12,
    font,
  });

  page.drawText(formatMoneyPaise(subtotalAmount), {
    x: 320,
    y: 390,
    size: 12,
    font,
  });

  // 4. GST
  page.drawText("GST", {
    x: 154,
    y: 368,
    size: 12,
    font,
  });

  page.drawText(formatMoneyPaise(gstAmount), {
    x: 320,
    y: 368,
    size: 12,
    font,
  });

  // 5. Total Paid
  page.drawText("Total Paid", {
    x: 154,
    y: 331,
    size: 12,
    font,
  });

  page.drawText(formatMoneyPaise(payableAmount), {
    x: 320,
    y: 331,
    size: 12,
    font,
  });

  const pdfBytes = await pdfDoc.save();

  const outputPath = path.join(
    __dirname,
    `../invoices/invoice-${invoiceNumber}.pdf`
  );

  fs.mkdirSync(path.join(__dirname, "../invoices"), { recursive: true });
  fs.writeFileSync(outputPath, pdfBytes);

  return outputPath;
};