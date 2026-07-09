import PDFDocument from "pdfkit";

// Streams a formatted PDF report directly to the HTTP response.
export const generateFeedbackPDF = ({ items, crLabel, settings, res }) => {
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  doc.pipe(res);

  // Header
  doc
    .fontSize(20)
    .fillColor("#4338CA")
    .text("Class Feedback Report", { align: "center" })
    .moveDown(0.3);

  doc
    .fontSize(11)
    .fillColor("#374151")
    .text(`${settings.className} | ${settings.termInfo}`, { align: "center" })
    .text(`Report scope: ${crLabel}`, { align: "center" })
    .text(`Generated: ${new Date().toLocaleString()}`, { align: "center" })
    .moveDown();

  doc
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .strokeColor("#E5E7EB")
    .stroke()
    .moveDown();

  if (items.length === 0) {
    doc.fontSize(12).fillColor("#6B7280").text("No feedback entries found for this scope.");
  }

  items.forEach((item, idx) => {
    if (doc.y > 680) doc.addPage();

    doc
      .fontSize(13)
      .fillColor("#111827")
      .text(`#${idx + 1}  •  Rating: ${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)} (${item.rating}/5)`, {
        continued: false,
      });

    doc
      .fontSize(9)
      .fillColor("#9CA3AF")
      .text(`Submitted: ${new Date(item.createdAt).toLocaleString()}  |  Scope: ${item.cr}`);

    doc.moveDown(0.3);

    const addField = (label, value) => {
      if (!value) return;
      doc.fontSize(10).fillColor("#4B5563").text(`${label}:`, { continued: false });
      doc.fontSize(10).fillColor("#111827").text(value, { indent: 10 });
      doc.moveDown(0.2);
    };

    addField("Feedback", item.feedback);
    addField("Suggestions", item.suggestions);
    addField("Improvements", item.improvements);
    addField("General Message", item.generalMessage);

    doc.moveDown(0.4);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#F3F4F6").stroke();
    doc.moveDown(0.4);
  });

  doc.end();
};
