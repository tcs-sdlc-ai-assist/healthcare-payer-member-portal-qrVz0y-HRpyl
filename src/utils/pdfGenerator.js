/**
 * PDF generation utility for the Healthcare Member Portal.
 * Uses jspdf for ID card download and EOB document generation.
 * Creates print-friendly PDF layouts for ID cards (front/back) and claim EOB summaries.
 *
 * @module pdfGenerator
 */

import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate, formatClaimStatus, formatClaimType } from './formatters.js';

/**
 * Brand color constants for PDF generation.
 * @type {Object}
 */
const COLORS = {
  brand: [0, 105, 204],
  brandDark: [0, 63, 122],
  white: [255, 255, 255],
  black: [17, 24, 39],
  gray: [107, 114, 128],
  grayLight: [229, 231, 235],
  grayLighter: [243, 244, 246],
  success: [16, 185, 129],
  error: [239, 68, 68],
  warning: [245, 158, 11],
  info: [59, 130, 246],
};

/**
 * PDF page dimensions and margins (in mm).
 * @type {Object}
 */
const PAGE = {
  marginLeft: 15,
  marginRight: 15,
  marginTop: 15,
  marginBottom: 15,
  width: 210,
  height: 297,
};

/**
 * ID card dimensions (in mm) for standard credit card size scaled for PDF.
 * @type {Object}
 */
const CARD = {
  width: 170,
  height: 100,
  padding: 8,
  borderRadius: 4,
};

/**
 * Draws a rounded rectangle on the PDF document.
 * @param {jsPDF} doc - The jsPDF document instance
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} w - Width
 * @param {number} h - Height
 * @param {number} r - Border radius
 * @param {string} [style='S'] - Draw style ('S' for stroke, 'F' for fill, 'FD' for fill and stroke)
 */
const drawRoundedRect = (doc, x, y, w, h, r, style = 'S') => {
  doc.roundedRect(x, y, w, h, r, r, style);
};

/**
 * Sets the font style on the PDF document.
 * @param {jsPDF} doc - The jsPDF document instance
 * @param {string} [style='normal'] - Font style ('normal', 'bold', 'italic')
 * @param {number} [size=10] - Font size in points
 * @param {number[]} [color] - RGB color array
 */
const setFont = (doc, style = 'normal', size = 10, color = COLORS.black) => {
  doc.setFont('helvetica', style);
  doc.setFontSize(size);
  doc.setTextColor(color[0], color[1], color[2]);
};

/**
 * Draws a horizontal line on the PDF document.
 * @param {jsPDF} doc - The jsPDF document instance
 * @param {number} y - Y position
 * @param {number} [x1] - Start X position
 * @param {number} [x2] - End X position
 * @param {number[]} [color] - RGB color array
 */
const drawLine = (doc, y, x1 = PAGE.marginLeft, x2 = PAGE.width - PAGE.marginRight, color = COLORS.grayLight) => {
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(0.3);
  doc.line(x1, y, x2, y);
};

/**
 * Draws the HealthFirst logo text on the PDF document.
 * @param {jsPDF} doc - The jsPDF document instance
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} [size=14] - Font size
 */
const drawLogo = (doc, x, y, size = 14) => {
  setFont(doc, 'bold', size, COLORS.brand);
  doc.text('HealthFirst', x, y);
};

/**
 * Draws a labeled value pair on the PDF document.
 * @param {jsPDF} doc - The jsPDF document instance
 * @param {string} label - The label text
 * @param {string} value - The value text
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} [labelWidth=40] - Width allocated for the label
 * @returns {number} The Y position after drawing
 */
const drawLabelValue = (doc, label, value, x, y, labelWidth = 40) => {
  setFont(doc, 'bold', 8, COLORS.gray);
  doc.text(label, x, y);
  setFont(doc, 'normal', 9, COLORS.black);
  doc.text(String(value || '—'), x + labelWidth, y);
  return y + 5;
};

/**
 * Draws the front of an ID card on the PDF document.
 * @param {jsPDF} doc - The jsPDF document instance
 * @param {Object} card - The ID card data object
 * @param {number} startX - Starting X position
 * @param {number} startY - Starting Y position
 * @returns {number} The Y position after drawing the card front
 */
const drawIDCardFront = (doc, card, startX, startY) => {
  const front = card.front;
  const x = startX;
  const y = startY;
  const cardW = CARD.width;
  const cardH = CARD.height;
  const pad = CARD.padding;

  // Card background
  doc.setFillColor(COLORS.white[0], COLORS.white[1], COLORS.white[2]);
  doc.setDrawColor(COLORS.grayLight[0], COLORS.grayLight[1], COLORS.grayLight[2]);
  doc.setLineWidth(0.5);
  drawRoundedRect(doc, x, y, cardW, cardH, CARD.borderRadius, 'FD');

  // Header bar
  doc.setFillColor(COLORS.brand[0], COLORS.brand[1], COLORS.brand[2]);
  doc.rect(x, y, cardW, 14, 'F');

  // Logo and plan name in header
  setFont(doc, 'bold', 12, COLORS.white);
  doc.text('HealthFirst', x + pad, y + 9);
  setFont(doc, 'normal', 9, COLORS.white);
  doc.text(front.planName || '', x + pad + 50, y + 9);

  // Plan type badge
  if (front.planType) {
    setFont(doc, 'bold', 8, COLORS.white);
    doc.text(front.planType, x + cardW - pad - 15, y + 9);
  }

  let currentY = y + 22;

  // Member info
  setFont(doc, 'bold', 10, COLORS.black);
  doc.text(front.memberName || '', x + pad, currentY);
  currentY += 6;

  // Two column layout
  const col1X = x + pad;
  const col2X = x + pad + 85;

  currentY = drawLabelValue(doc, 'Member ID:', front.memberId || '', col1X, currentY, 30);
  currentY -= 5;
  drawLabelValue(doc, 'Group:', front.groupNumber || '', col2X, currentY, 22);
  currentY += 5;

  currentY = drawLabelValue(doc, 'Subscriber:', front.subscriberId || '', col1X, currentY, 30);
  currentY -= 5;
  drawLabelValue(doc, 'Effective:', front.effectiveDate || '', col2X, currentY, 22);
  currentY += 5;

  if (front.pcpName) {
    currentY = drawLabelValue(doc, 'PCP:', front.pcpName, col1X, currentY, 30);
    if (front.pcpPhone) {
      currentY -= 5;
      drawLabelValue(doc, 'PCP Phone:', front.pcpPhone, col2X, currentY, 28);
      currentY += 5;
    }
  }

  // Network
  if (front.networkName) {
    setFont(doc, 'normal', 7, COLORS.gray);
    doc.text(front.networkName, col1X, currentY);
    currentY += 5;
  }

  // Copays section
  if (front.copays) {
    drawLine(doc, currentY, col1X, x + cardW - pad, COLORS.grayLight);
    currentY += 4;

    setFont(doc, 'bold', 7, COLORS.brand);
    doc.text('COPAYS', col1X, currentY);
    currentY += 4;

    const copayItems = [
      { label: 'Primary Care', value: front.copays.primaryCare },
      { label: 'Specialist', value: front.copays.specialist },
      { label: 'Urgent Care', value: front.copays.urgentCare },
      { label: 'ER', value: front.copays.emergencyRoom },
    ];

    const copayColWidth = (cardW - pad * 2) / copayItems.length;
    copayItems.forEach((item, index) => {
      const copayX = col1X + (index * copayColWidth);
      setFont(doc, 'normal', 6, COLORS.gray);
      doc.text(item.label, copayX, currentY);
      setFont(doc, 'bold', 8, COLORS.black);
      doc.text(item.value || 'N/A', copayX, currentY + 4);
    });
  }

  return y + cardH + 5;
};

/**
 * Draws the back of an ID card on the PDF document.
 * @param {jsPDF} doc - The jsPDF document instance
 * @param {Object} card - The ID card data object
 * @param {number} startX - Starting X position
 * @param {number} startY - Starting Y position
 * @returns {number} The Y position after drawing the card back
 */
const drawIDCardBack = (doc, card, startX, startY) => {
  const back = card.back;
  const x = startX;
  const y = startY;
  const cardW = CARD.width;
  const cardH = CARD.height;
  const pad = CARD.padding;

  // Card background
  doc.setFillColor(COLORS.grayLighter[0], COLORS.grayLighter[1], COLORS.grayLighter[2]);
  doc.setDrawColor(COLORS.grayLight[0], COLORS.grayLight[1], COLORS.grayLight[2]);
  doc.setLineWidth(0.5);
  drawRoundedRect(doc, x, y, cardW, cardH, CARD.borderRadius, 'FD');

  let currentY = y + pad + 2;
  const col1X = x + pad;
  const col2X = x + pad + 85;

  // Rx Info
  if (back.rxInfo && (back.rxInfo.rxBIN || back.rxInfo.rxPCN || back.rxInfo.rxGroup)) {
    setFont(doc, 'bold', 7, COLORS.brand);
    doc.text('PHARMACY / RX INFO', col1X, currentY);
    currentY += 4;

    if (back.rxInfo.rxBIN) {
      currentY = drawLabelValue(doc, 'RxBIN:', back.rxInfo.rxBIN, col1X, currentY, 20);
    }
    if (back.rxInfo.rxPCN) {
      currentY -= 5;
      drawLabelValue(doc, 'RxPCN:', back.rxInfo.rxPCN, col2X, currentY, 20);
      currentY += 5;
    }
    if (back.rxInfo.rxGroup) {
      currentY = drawLabelValue(doc, 'RxGroup:', back.rxInfo.rxGroup, col1X, currentY, 20);
    }

    drawLine(doc, currentY, col1X, x + cardW - pad, COLORS.grayLight);
    currentY += 3;
  }

  // Contact numbers
  setFont(doc, 'bold', 7, COLORS.brand);
  doc.text('IMPORTANT PHONE NUMBERS', col1X, currentY);
  currentY += 4;

  const phoneEntries = [];
  if (back.memberServicesPhone) {
    phoneEntries.push({ label: 'Member Services:', value: back.memberServicesPhone });
  }
  if (back.claimsPhone) {
    phoneEntries.push({ label: 'Claims:', value: back.claimsPhone });
  }
  if (back.nurseLinePhone) {
    phoneEntries.push({ label: '24/7 Nurse Line:', value: back.nurseLinePhone });
  }
  if (back.mentalHealthPhone) {
    phoneEntries.push({ label: 'Behavioral Health:', value: back.mentalHealthPhone });
  }
  if (back.preAuthPhone) {
    phoneEntries.push({ label: 'Pre-Authorization:', value: back.preAuthPhone });
  }

  phoneEntries.forEach((entry) => {
    currentY = drawLabelValue(doc, entry.label, entry.value, col1X, currentY, 38);
  });

  // Claims address
  if (back.claimsAddress) {
    drawLine(doc, currentY, col1X, x + cardW - pad, COLORS.grayLight);
    currentY += 3;
    setFont(doc, 'bold', 6, COLORS.gray);
    doc.text('Claims Address:', col1X, currentY);
    currentY += 3;
    setFont(doc, 'normal', 6, COLORS.black);
    const addressLines = doc.splitTextToSize(back.claimsAddress, cardW - pad * 2);
    doc.text(addressLines, col1X, currentY);
    currentY += addressLines.length * 3;
  }

  // Emergency instructions
  if (back.emergencyInstructions) {
    currentY += 1;
    drawLine(doc, currentY, col1X, x + cardW - pad, COLORS.grayLight);
    currentY += 3;
    setFont(doc, 'bold', 6, COLORS.error);
    doc.text('EMERGENCY:', col1X, currentY);
    currentY += 3;
    setFont(doc, 'normal', 5.5, COLORS.black);
    const emergencyLines = doc.splitTextToSize(back.emergencyInstructions, cardW - pad * 2);
    doc.text(emergencyLines, col1X, currentY);
  }

  return y + cardH + 5;
};

/**
 * Generates a PDF document for an ID card with front and back views.
 * @param {Object} card - The ID card data object from idCardsData
 * @param {Object} [options] - Generation options
 * @param {boolean} [options.download=true] - Whether to trigger a download
 * @param {string} [options.filename] - Custom filename for the download
 * @returns {jsPDF} The generated jsPDF document instance
 */
export const generateIDCardPDF = (card, options = {}) => {
  const { download = true, filename } = options;

  if (!card || !card.front || !card.back) {
    throw new Error('Invalid ID card data: card must include front and back properties.');
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const centerX = (PAGE.width - CARD.width) / 2;

  // Title
  drawLogo(doc, PAGE.marginLeft, PAGE.marginTop + 5, 16);
  setFont(doc, 'normal', 10, COLORS.gray);
  doc.text('Insurance ID Card', PAGE.marginLeft + 55, PAGE.marginTop + 5);

  // Card type and date
  setFont(doc, 'normal', 8, COLORS.gray);
  const cardTypeLabel = card.front.planType ? `${card.front.planType} Card` : 'ID Card';
  doc.text(cardTypeLabel, PAGE.width - PAGE.marginRight - doc.getTextWidth(cardTypeLabel), PAGE.marginTop + 5);

  let currentY = PAGE.marginTop + 15;

  // Front label
  setFont(doc, 'bold', 9, COLORS.brand);
  doc.text('FRONT', centerX, currentY);
  currentY += 3;

  // Draw front
  currentY = drawIDCardFront(doc, card, centerX, currentY);
  currentY += 5;

  // Back label
  setFont(doc, 'bold', 9, COLORS.brand);
  doc.text('BACK', centerX, currentY);
  currentY += 3;

  // Draw back
  drawIDCardBack(doc, card, centerX, currentY);

  // Footer
  setFont(doc, 'normal', 7, COLORS.gray);
  const footerText = `Generated on ${formatDate(new Date(), { format: 'MM/DD/YYYY hh:mm A' })} — For informational purposes only.`;
  doc.text(footerText, PAGE.marginLeft, PAGE.height - PAGE.marginBottom);

  if (download) {
    const defaultFilename = `ID_Card_${card.front.planType || 'Card'}_${card.front.memberId || 'member'}.pdf`;
    doc.save(filename || defaultFilename);
  }

  return doc;
};

/**
 * Generates a PDF document for a claim Explanation of Benefits (EOB).
 * @param {Object} claim - The claim data object from claimsData
 * @param {Object} [memberInfo] - Optional member information for the header
 * @param {string} [memberInfo.memberName] - Member name
 * @param {string} [memberInfo.memberId] - Member ID
 * @param {string} [memberInfo.groupNumber] - Group number
 * @param {string} [memberInfo.planName] - Plan name
 * @param {Object} [options] - Generation options
 * @param {boolean} [options.download=true] - Whether to trigger a download
 * @param {string} [options.filename] - Custom filename for the download
 * @returns {jsPDF} The generated jsPDF document instance
 */
export const generateEOBPDF = (claim, memberInfo = {}, options = {}) => {
  const { download = true, filename } = options;

  if (!claim || !claim.claimId) {
    throw new Error('Invalid claim data: claim must include a claimId.');
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const contentWidth = PAGE.width - PAGE.marginLeft - PAGE.marginRight;
  let currentY = PAGE.marginTop;

  // ===== Header =====
  drawLogo(doc, PAGE.marginLeft, currentY + 5, 18);

  setFont(doc, 'bold', 14, COLORS.brandDark);
  doc.text('Explanation of Benefits', PAGE.marginLeft + 60, currentY + 5);

  currentY += 10;
  setFont(doc, 'normal', 8, COLORS.gray);
  doc.text('This is not a bill. Please review the details below.', PAGE.marginLeft, currentY);

  currentY += 5;
  drawLine(doc, currentY, PAGE.marginLeft, PAGE.width - PAGE.marginRight, COLORS.brand);
  currentY += 6;

  // ===== Member & Claim Info =====
  const col1X = PAGE.marginLeft;
  const col2X = PAGE.marginLeft + contentWidth / 2;

  // Member info column
  setFont(doc, 'bold', 9, COLORS.brand);
  doc.text('MEMBER INFORMATION', col1X, currentY);
  currentY += 5;

  const memberName = memberInfo.memberName || claim.patient || '—';
  const memberId = memberInfo.memberId || claim.memberId || '—';
  const groupNumber = memberInfo.groupNumber || '—';
  const planName = memberInfo.planName || '—';

  currentY = drawLabelValue(doc, 'Member Name:', memberName, col1X, currentY, 32);
  currentY = drawLabelValue(doc, 'Member ID:', memberId, col1X, currentY, 32);
  currentY = drawLabelValue(doc, 'Group Number:', groupNumber, col1X, currentY, 32);
  currentY = drawLabelValue(doc, 'Plan Name:', planName, col1X, currentY, 32);

  // Claim info column (draw at same Y as member info start)
  let claimInfoY = currentY - 20;
  setFont(doc, 'bold', 9, COLORS.brand);
  doc.text('CLAIM INFORMATION', col2X, claimInfoY);
  claimInfoY += 5;

  claimInfoY = drawLabelValue(doc, 'Claim Number:', claim.claimNumber || claim.claimId, col2X, claimInfoY, 35);
  claimInfoY = drawLabelValue(doc, 'Claim Type:', formatClaimType(claim.type), col2X, claimInfoY, 35);
  claimInfoY = drawLabelValue(doc, 'Status:', formatClaimStatus(claim.status), col2X, claimInfoY, 35);
  claimInfoY = drawLabelValue(doc, 'Service Date:', formatDate(claim.serviceDate), col2X, claimInfoY, 35);

  currentY = Math.max(currentY, claimInfoY) + 3;
  drawLine(doc, currentY);
  currentY += 6;

  // ===== Provider & Diagnosis =====
  setFont(doc, 'bold', 9, COLORS.brand);
  doc.text('PROVIDER & DIAGNOSIS', col1X, currentY);
  currentY += 5;

  currentY = drawLabelValue(doc, 'Provider:', claim.provider || '—', col1X, currentY, 32);
  if (claim.providerNPI) {
    currentY = drawLabelValue(doc, 'Provider NPI:', claim.providerNPI, col1X, currentY, 32);
  }
  if (claim.diagnosisCode) {
    currentY = drawLabelValue(doc, 'Diagnosis:', `${claim.diagnosisCode} — ${claim.diagnosisDescription || ''}`, col1X, currentY, 32);
  }
  if (claim.receivedDate) {
    currentY = drawLabelValue(doc, 'Received Date:', formatDate(claim.receivedDate), col1X, currentY, 32);
  }
  if (claim.processedDate) {
    currentY = drawLabelValue(doc, 'Processed Date:', formatDate(claim.processedDate), col1X, currentY, 32);
  }

  currentY += 3;
  drawLine(doc, currentY);
  currentY += 6;

  // ===== Claim Summary =====
  setFont(doc, 'bold', 9, COLORS.brand);
  doc.text('CLAIM SUMMARY', col1X, currentY);
  currentY += 6;

  // Summary box
  doc.setFillColor(COLORS.grayLighter[0], COLORS.grayLighter[1], COLORS.grayLighter[2]);
  doc.setDrawColor(COLORS.grayLight[0], COLORS.grayLight[1], COLORS.grayLight[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(col1X, currentY, contentWidth, 22, 2, 2, 'FD');

  const summaryItems = [
    { label: 'Billed Amount', value: formatCurrency(claim.billedAmount) },
    { label: 'Allowed Amount', value: formatCurrency(claim.allowedAmount) },
    { label: 'Plan Paid', value: formatCurrency(claim.paidAmount) },
    { label: 'You Owe', value: formatCurrency(claim.memberOwes) },
  ];

  const summaryColWidth = contentWidth / summaryItems.length;
  summaryItems.forEach((item, index) => {
    const itemX = col1X + (index * summaryColWidth) + 5;
    setFont(doc, 'normal', 7, COLORS.gray);
    doc.text(item.label, itemX, currentY + 7);
    const isYouOwe = index === summaryItems.length - 1;
    setFont(doc, 'bold', 11, isYouOwe ? COLORS.brand : COLORS.black);
    doc.text(item.value, itemX, currentY + 15);
  });

  currentY += 28;

  // ===== Line Items Table =====
  if (claim.lineItems && claim.lineItems.length > 0) {
    setFont(doc, 'bold', 9, COLORS.brand);
    doc.text('SERVICE DETAILS', col1X, currentY);
    currentY += 5;

    // Table header
    const tableHeaders = ['Procedure', 'Description', 'Billed', 'Allowed', 'Paid', 'You Owe'];
    const colWidths = [22, contentWidth - 22 - 25 - 25 - 25 - 25, 25, 25, 25, 25];
    let tableX = col1X;

    doc.setFillColor(COLORS.brand[0], COLORS.brand[1], COLORS.brand[2]);
    doc.rect(col1X, currentY, contentWidth, 7, 'F');

    setFont(doc, 'bold', 7, COLORS.white);
    tableHeaders.forEach((header, index) => {
      doc.text(header, tableX + 2, currentY + 5);
      tableX += colWidths[index];
    });

    currentY += 7;

    // Table rows
    claim.lineItems.forEach((item, rowIndex) => {
      // Check if we need a new page
      if (currentY > PAGE.height - PAGE.marginBottom - 20) {
        doc.addPage();
        currentY = PAGE.marginTop;
      }

      // Alternate row background
      if (rowIndex % 2 === 0) {
        doc.setFillColor(COLORS.grayLighter[0], COLORS.grayLighter[1], COLORS.grayLighter[2]);
        doc.rect(col1X, currentY, contentWidth, 7, 'F');
      }

      tableX = col1X;
      setFont(doc, 'normal', 7, COLORS.black);

      const rowData = [
        item.procedureCode || '—',
        item.description || '—',
        formatCurrency(item.billedAmount),
        formatCurrency(item.allowedAmount),
        formatCurrency(item.paidAmount),
        formatCurrency(item.memberResponsibility),
      ];

      rowData.forEach((cellValue, colIndex) => {
        const cellText = colIndex === 1
          ? doc.splitTextToSize(String(cellValue), colWidths[colIndex] - 4)[0]
          : String(cellValue);
        doc.text(cellText, tableX + 2, currentY + 5);
        tableX += colWidths[colIndex];
      });

      currentY += 7;
    });

    // Table footer with totals
    doc.setFillColor(COLORS.grayLight[0], COLORS.grayLight[1], COLORS.grayLight[2]);
    doc.rect(col1X, currentY, contentWidth, 7, 'F');

    tableX = col1X;
    setFont(doc, 'bold', 7, COLORS.black);
    doc.text('TOTALS', tableX + 2, currentY + 5);
    tableX += colWidths[0] + colWidths[1];
    doc.text(formatCurrency(claim.billedAmount), tableX + 2, currentY + 5);
    tableX += colWidths[2];
    doc.text(formatCurrency(claim.allowedAmount), tableX + 2, currentY + 5);
    tableX += colWidths[3];
    doc.text(formatCurrency(claim.paidAmount), tableX + 2, currentY + 5);
    tableX += colWidths[4];
    setFont(doc, 'bold', 7, COLORS.brand);
    doc.text(formatCurrency(claim.memberOwes), tableX + 2, currentY + 5);

    currentY += 12;
  }

  // ===== Notes =====
  if (claim.notes) {
    if (currentY > PAGE.height - PAGE.marginBottom - 30) {
      doc.addPage();
      currentY = PAGE.marginTop;
    }

    setFont(doc, 'bold', 9, COLORS.brand);
    doc.text('NOTES', col1X, currentY);
    currentY += 5;

    setFont(doc, 'normal', 8, COLORS.black);
    const noteLines = doc.splitTextToSize(claim.notes, contentWidth);
    doc.text(noteLines, col1X, currentY);
    currentY += noteLines.length * 4 + 5;
  }

  // ===== Disclaimer =====
  if (currentY > PAGE.height - PAGE.marginBottom - 35) {
    doc.addPage();
    currentY = PAGE.marginTop;
  }

  drawLine(doc, currentY);
  currentY += 5;

  setFont(doc, 'bold', 7, COLORS.gray);
  doc.text('IMPORTANT INFORMATION', col1X, currentY);
  currentY += 4;

  setFont(doc, 'normal', 6.5, COLORS.gray);
  const disclaimerText = 'This Explanation of Benefits (EOB) is a summary of how your claim was processed. It is not a bill. ' +
    'If you have questions about this EOB, please contact Member Services at 1-800-555-0199. ' +
    'If you believe this claim was processed incorrectly, you have the right to appeal within 180 days of receiving this notice. ' +
    'Visit the member portal or call Member Services for appeal instructions.';
  const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth);
  doc.text(disclaimerLines, col1X, currentY);

  // ===== Footer =====
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    setFont(doc, 'normal', 7, COLORS.gray);
    const footerY = PAGE.height - PAGE.marginBottom + 5;
    drawLine(doc, footerY - 3);
    doc.text(`HealthFirst — Explanation of Benefits — ${claim.claimNumber || claim.claimId}`, PAGE.marginLeft, footerY);
    doc.text(`Page ${i} of ${pageCount}`, PAGE.width - PAGE.marginRight - 20, footerY);
    doc.text(`Generated: ${formatDate(new Date(), { format: 'MM/DD/YYYY' })}`, PAGE.width - PAGE.marginRight - 20, footerY + 4);
  }

  if (download) {
    const defaultFilename = `EOB_${claim.claimNumber || claim.claimId}.pdf`;
    doc.save(filename || defaultFilename);
  }

  return doc;
};

/**
 * Generates a PDF document containing multiple ID cards.
 * @param {Object[]} cards - Array of ID card data objects from idCardsData
 * @param {Object} [options] - Generation options
 * @param {boolean} [options.download=true] - Whether to trigger a download
 * @param {string} [options.filename='All_ID_Cards.pdf'] - Custom filename for the download
 * @returns {jsPDF} The generated jsPDF document instance
 */
export const generateAllIDCardsPDF = (cards, options = {}) => {
  const { download = true, filename = 'All_ID_Cards.pdf' } = options;

  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    throw new Error('Invalid cards data: cards must be a non-empty array.');
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const centerX = (PAGE.width - CARD.width) / 2;

  cards.forEach((card, index) => {
    if (index > 0) {
      doc.addPage();
    }

    let currentY = PAGE.marginTop;

    // Title
    drawLogo(doc, PAGE.marginLeft, currentY + 5, 16);
    setFont(doc, 'normal', 10, COLORS.gray);
    doc.text(`Insurance ID Card — ${card.front.planName || ''}`, PAGE.marginLeft + 55, currentY + 5);

    currentY += 12;

    // Status badge
    if (card.status) {
      const statusColor = card.status === 'active' ? COLORS.success : COLORS.gray;
      setFont(doc, 'bold', 8, statusColor);
      doc.text(card.status.toUpperCase(), PAGE.width - PAGE.marginRight - 15, PAGE.marginTop + 5);
    }

    // Front label
    setFont(doc, 'bold', 9, COLORS.brand);
    doc.text('FRONT', centerX, currentY);
    currentY += 3;

    currentY = drawIDCardFront(doc, card, centerX, currentY);
    currentY += 5;

    // Back label
    setFont(doc, 'bold', 9, COLORS.brand);
    doc.text('BACK', centerX, currentY);
    currentY += 3;

    drawIDCardBack(doc, card, centerX, currentY);

    // Footer
    setFont(doc, 'normal', 7, COLORS.gray);
    const footerText = `Generated on ${formatDate(new Date(), { format: 'MM/DD/YYYY hh:mm A' })} — Card ${index + 1} of ${cards.length}`;
    doc.text(footerText, PAGE.marginLeft, PAGE.height - PAGE.marginBottom);
  });

  if (download) {
    doc.save(filename);
  }

  return doc;
};

/**
 * Returns the jsPDF document as a Blob for preview or custom handling.
 * @param {jsPDF} doc - The jsPDF document instance
 * @returns {Blob} The PDF as a Blob object
 */
export const getPDFBlob = (doc) => {
  if (!doc || typeof doc.output !== 'function') {
    throw new Error('Invalid jsPDF document instance.');
  }

  return doc.output('blob');
};

/**
 * Returns the jsPDF document as a data URI string for embedding.
 * @param {jsPDF} doc - The jsPDF document instance
 * @returns {string} The PDF as a data URI string
 */
export const getPDFDataUri = (doc) => {
  if (!doc || typeof doc.output !== 'function') {
    throw new Error('Invalid jsPDF document instance.');
  }

  return doc.output('datauristring');
};