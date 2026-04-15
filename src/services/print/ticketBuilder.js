// src/services/print/ticketBuilder.js
//
// Optimised for: Epson TM-T82X — 80mm thermal roll printer
// Print width  : 72mm usable
// Resolution   : 203 DPI
// Color        : Monochrome only (no grays, no gradients)
// QR size      : 52mm × 52mm  (industry scan-safe minimum for thermal)

import QRCode from "qrcode";

// ─── Coupon type resolver ─────────────────────────────────────────────────────
const MEAL_KEYWORDS = [
  "meal",
  "veg",
  "non-veg",
  "rice",
  "roti",
  "thali",
  "lunch",
  "dinner",
  "breakfast",
  "khana",
  "jewan",
];
const SNACK_KEYWORDS = [
  "snack",
  "biscuit",
  "banana",
  "vada",
  "pav",
  "vadapav",
  "paav",
  "sandwich",
  "samosa",
  "farsan",
];
const DRINK_KEYWORDS = [
  "tea",
  "coffee",
  "drink",
  "beverage",
  "juice",
  "water",
  "chai",
  "chaha",
];

const getCouponType = (itemName = "") => {
  const lower = itemName.toLowerCase();
  if (DRINK_KEYWORDS.some((k) => lower.includes(k))) return "TEA/COFFEE COUPON";
  if (SNACK_KEYWORDS.some((k) => lower.includes(k))) return "SNACKS COUPON";
  if (MEAL_KEYWORDS.some((k) => lower.includes(k))) return "MEAL COUPON";
  return "MEAL COUPON";
};

// ─── Shared thermal CSS ───────────────────────────────────────────────────────
const thermalCSS = `
  @page { size: 72mm auto; margin: 0; }
  * {
    margin: 0; padding: 0; box-sizing: border-box;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  body {
    font-family: 'Courier New', Courier, monospace;
    width: 72mm; padding: 3mm 3mm;
    background: #ffffff; color: #000000;
    font-size: 8pt; line-height: 1.3;
  }
  .header { text-align: center; margin-bottom: 2mm; }
  .header .coupon-type {
    font-size: 7pt; font-weight: bold;
    letter-spacing: 0.05em; text-transform: uppercase;
    border: 1px solid #000; display: inline-block;
    padding: 0.5mm 3mm; margin-bottom: 1.5mm;
  }
  .header .company { font-size: 13pt; font-weight: bold; line-height: 1.2; }
  .divider       { border: none; border-top: 1px dashed #000; margin: 2mm 0; }
  .divider-solid { border: none; border-top: 1px solid #000;  margin: 2mm 0; }
  .meta-row {
    display: flex; justify-content: space-between;
    align-items: flex-start; margin-bottom: 1mm;
  }
  .meta-left .label    { font-size: 7pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.04em; }
  .meta-left .value    { font-size: 9pt; font-weight: normal; margin-top: 0.5mm; }
  .meta-right          { text-align: right; }
  .meta-right .date    { font-size: 7.5pt; font-weight: bold; }
  .meta-right .time    { font-size: 7.5pt; font-weight: bold; margin-top: 0.5mm; }
  .item-name {
    text-align: center; font-size: 11pt; font-weight: bold;
    letter-spacing: 0.03em; margin: 2mm 0;
  }
  .qr-wrapper { display: flex; justify-content: center; align-items: center; margin: 2mm 0; }
  .qr-frame   { display: inline-block; padding: 2mm; border: 1.5px solid #000; border-radius: 4mm; }
  .qr-frame img { display: block; width: 52mm; height: 52mm; }
  .valid-upto {
    text-align: center; font-size: 7.5pt; font-weight: bold;
    margin-top: 2mm; letter-spacing: 0.03em;
  }
  .tear-space { margin-top: 5mm; text-align: center; font-size: 6pt; letter-spacing: 0.2em; }
  @media print { body { width: 72mm; } }
`;

// ─── QR generator ────────────────────────────────────────────────────────────
const generateQR = (data) =>
  QRCode.toDataURL(data, {
    width: 400,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#ffffff" },
  });

// ─── buildSingleItemTicketHtml (Employee) ────────────────────────────────────
export const buildSingleItemTicketHtml = async ({
  user,
  itemName,
  shift,
  qrCodeNumber,
}) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const couponLabel = getCouponType(itemName);
  const qrDataUrl = await generateQR(qrCodeNumber);

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8" /><style>${thermalCSS}</style></head>
<body>

  <div class="header">
    <div class="coupon-type">${couponLabel}</div>
    <div class="company">Mukand Limited, Thane</div>
  </div>

  <hr class="divider-solid" />

  <div class="meta-row">
    <div class="meta-left">
      <div class="label">EMP ID: ${user.employeeId}</div>
      <div class="value">${user.name}</div>
    </div>
    <div class="meta-right">
      <div class="date">${dateStr}</div>
      <div class="time">${timeStr}</div>
    </div>
  </div>

  <hr class="divider" />

  <div class="item-name">${itemName}</div>

  <div class="qr-wrapper">
    <div class="qr-frame"><img src="${qrDataUrl}" alt="QR" /></div>
  </div>

  <div class="valid-upto">Valid Upto: ${dateStr}</div>
  <div class="tear-space">- - - - - - - - - - - - - - -</div>

</body></html>`;
};

// ─── buildGuestTicketHtml ─────────────────────────────────────────────────────
export const buildGuestTicketHtml = async ({
  requestId,
  guestDetails,
  hostDetails,
  itemName = "Special Veg Meal",
}) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const qrData = `GUEST|${requestId}|${dateStr}`;
  const qrDataUrl = await generateQR(qrData);

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8" /><style>${thermalCSS}</style></head>
<body>

  <div class="header">
    <div class="coupon-type">MEAL COUPON (GUEST)</div>
    <div class="company">Mukand Limited, Thane</div>
  </div>

  <hr class="divider-solid" />

  <div class="meta-row">
    <div class="meta-left">
      <div class="label">Guest Name:</div>
      <div class="value">${guestDetails?.name ?? "—"}</div>
      <div class="value" style="font-size:7pt;">${guestDetails?.company ?? guestDetails?.organization ?? ""}</div>
    </div>
    <div class="meta-right">
      <div class="date">${dateStr}</div>
      <div class="time">${timeStr}</div>
    </div>
  </div>

  <hr class="divider" />

  <div class="item-name">${itemName}</div>

  <div class="qr-wrapper">
    <div class="qr-frame"><img src="${qrDataUrl}" alt="QR" /></div>
  </div>

  <div class="valid-upto">Valid Upto: ${dateStr}</div>
  <div class="tear-space">- - - - - - - - - - - - - - -</div>

</body></html>`;
};

// ─── buildBulkTicketHtml (Contractor) ────────────────────────────────────────
export const buildBulkTicketHtml = async ({
  contractorName,
  itemName = "Special Veg Meal",
  qrCodeNumber,
}) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const qrData = qrCodeNumber ?? `BULK|${contractorName}|${dateStr}`;
  const qrDataUrl = await generateQR(qrData);

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8" /><style>${thermalCSS}</style></head>
<body>

  <div class="header">
    <div class="coupon-type">MEAL COUPON (BULK)</div>
    <div class="company">Mukand Limited, Thane</div>
  </div>

  <hr class="divider-solid" />

  <div class="meta-row">
    <div class="meta-left">
      <div class="label">Contractor Name:</div>
      <div class="value">${contractorName ?? "—"}</div>
    </div>
    <div class="meta-right">
      <div class="date">${dateStr}</div>
      <div class="time">${timeStr}</div>
    </div>
  </div>

  <hr class="divider" />

  <div class="item-name">${itemName}</div>

  <div class="qr-wrapper">
    <div class="qr-frame"><img src="${qrDataUrl}" alt="QR" /></div>
  </div>

  <div class="valid-upto">Valid Upto: ${dateStr}</div>
  <div class="tear-space">- - - - - - - - - - - - - - -</div>

</body></html>`;
};

// ─── buildTicketHtml (legacy) ─────────────────────────────────────────────────
/** @deprecated Use buildSingleItemTicketHtml via printService loop instead. */
export const buildTicketHtml = async ({ user, items, shift }) => {
  const firstItem = items?.[0]?.nameEn ?? items?.[0]?.name ?? "Meal";
  return buildSingleItemTicketHtml({ user, itemName: firstItem, shift });
};
