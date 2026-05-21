// src/services/print/ticketBuilder.js
//
// Optimised for : POS58 Printer (58mm thermal roll)
// Paper width   : 58mm
// Printable     : 48mm  (5mm margin each side)
// DPI           : 203
// Color         : Monochrome (black on white)
// QR size       : 26mm × 26mm
//
// IMPORTANT — all three must stay in sync:
//   1. @page size here          → 58mm auto  (physical paper width)
//   2. main.js BrowserWindow    → width: 220  (58mm @ 96 DPI)

import QRCode from "qrcode";

// ─── Per-language label map ───────────────────────────────────────────────────
const TICKET_LABELS = {
  en: {
    companyName: "Mukand Limited, Thane",
    mealCoupon: "MEAL COUPON",
    mealCouponBulk: "MEAL COUPON (BULK)",
    mealCouponGuest: "MEAL COUPON (GUEST)",
    teaCoffeeCoupon: "TEA/COFFEE COUPON",
    snacksCoupon: "SNACKS COUPON",
    empId: "EMP ID",
    contractorName: "CONTRACTOR NAME",
    guestName: "GUEST NAME",
    validUpto: "Valid Upto",
  },
  hi: {
    companyName: "Mukand Limited, Thane",
    mealCoupon: "भोजन कूपन",
    mealCouponBulk: "भोजन कूपन (बल्क)",
    mealCouponGuest: "भोजन कूपन (अतिथि)",
    teaCoffeeCoupon: "चाय/कॉफी कूपन",
    snacksCoupon: "नाश्ता कूपन",
    empId: "कर्मचारी आईडी",
    contractorName: "ठेकेदार का नाम",
    guestName: "अतिथि का नाम",
    validUpto: "वैध तक",
  },
  mr: {
    companyName: "Mukand Limited, Thane",
    mealCoupon: "जेवण कूपन",
    mealCouponBulk: "जेवण कूपन (बल्क)",
    mealCouponGuest: "जेवण कूपन (पाहुणे)",
    teaCoffeeCoupon: "चहा/कॉफी कूपन",
    snacksCoupon: "नाश्ता कूपन",
    empId: "कर्मचारी क्रमांक",
    contractorName: "कंत्राटदार नाव",
    guestName: "अतिथी चे नाव",
    validUpto: "वैध तारीख",
  },
};

const getLabels = (lang) => TICKET_LABELS[lang] ?? TICKET_LABELS.en;

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

const getCouponType = (itemNameEn = "", lang = "en") => {
  const labels = getLabels(lang);
  const lower = itemNameEn.toLowerCase();
  if (DRINK_KEYWORDS.some((k) => lower.includes(k)))
    return labels.teaCoffeeCoupon;
  if (SNACK_KEYWORDS.some((k) => lower.includes(k))) return labels.snacksCoupon;
  return labels.mealCoupon;
};

// ─── 58mm Thermal CSS ─────────────────────────────────────────────────────────
const thermalCSS = `
  @page { size: 58mm auto; margin: 0; }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  html, body {
    width: 58mm;
    background: #ffffff;
    color: #000000;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  body {
    font-family: 'Arial', 'Noto Sans Devanagari', 'Arial Unicode MS', sans-serif;
    padding: 0;
  }

  .ticket {
    width: 48mm;
    margin: 0 auto;
    padding: 1mm;
    background: #fff;
  }

  .header {
    text-align: center;
    margin-bottom: 0.3mm;
  }
  .header .coupon-type {
    font-size: 7pt;
    font-weight: bold;
    border: 2px solid #000;
    display: inline-block;
    padding: 0.3mm 1mm;
    letter-spacing: 0.04em;
    margin-bottom: 0.3mm;
    border-radius: 1mm;
  }
  .header .company {
    font-size: 7pt;
    font-weight: bold;
    line-height: 1.3;
  }

  .divider {
    border: none;
    border-top: 1px dashed #000;
    margin: 0.3mm 0;
    width: 100%;
  }
  .divider-solid {
    border: none;
    border-top: 2px solid #000;
    margin: 0.3mm 0;
    width: 100%;
  }

  .meta-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1mm;
    width: 100%;
  }
  .meta-left {
    flex: 1;
    min-width: 0;
    word-break: break-word;
  }
  .meta-left .label {
    font-size: 5pt;
    font-weight: bold;
    color: #444;
    line-height: 1.4;
  }
  .meta-left .value {
    font-size: 7pt;
    font-weight: bold;
    line-height: 1.3;
  }
  .meta-right {
    text-align: right;
    flex-shrink: 0;
  }
  .meta-right .date {
    font-size: 6pt;
    font-weight: bold;
    white-space: nowrap;
  }
  .meta-right .time {
    font-size: 6pt;
    font-weight: bold;
    white-space: nowrap;
    color: #333;
  }

  .item-name {
    text-align: center;
    font-size: 8pt;
    font-weight: bold;
    margin: 0.3mm 0;
    letter-spacing: 0.03em;
  }

  .qr-wrapper {
    display: flex;
    justify-content: center;
    margin: 0.5mm 0;
  }
  .qr-frame {
    display: inline-block;
    padding: 0.5mm;
    border: 2px solid #000;
    border-radius: 1.5mm;
  }
  .qr-frame img {
    display: block;
    width: 26mm;
    height: 26mm;
  }

  .valid-upto {
    text-align: center;
    font-size: 6pt;
    font-weight: bold;
    margin-top: 0.3mm;
    color: #222;
  }
  .tear-space {
    margin-top: 0.3mm;
    text-align: center;
    font-size: 5pt;
    color: #666;
    letter-spacing: 0.15em;
  }

  @media print {
    html, body {
      width: 58mm;
    }
  }
`;

// ─── QR generator ─────────────────────────────────────────────────────────────
const generateQR = (data, size = 200) =>
  QRCode.toDataURL(data, {
    width: size,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#ffffff" },
  });

// ─── Ticket HTML wrapper ──────────────────────────────────────────────────────
const wrapTicket = (innerHtml) => `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><style>${thermalCSS}</style></head>
<body>
  <div class="ticket">
    ${innerHtml}
  </div>
</body></html>`;

// ─── buildSingleItemTicketHtml (Employee) ────────────────────────────────────
export const buildSingleItemTicketHtml = async ({
  user,
  itemName,
  itemNameLocalized,
  shift,
  qrCodeNumber,
  lang = "en",
}) => {
  const labels = getLabels(lang);
  const display = itemNameLocalized ?? itemName;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const couponLabel = getCouponType(itemName, lang);
  const qrDataUrl = await generateQR(qrCodeNumber);

  const empId = user.employeeId ?? user.empId ?? "—";
  const empName = user.name ?? user.empName ?? "—";
  const designation = user.designation ?? "—";

  return wrapTicket(`
    <div class="header">
      <div class="coupon-type">${couponLabel}</div><br/>
      <div class="company">${labels.companyName}</div>
    </div>

    <hr class="divider-solid"/>

    <div class="meta-row">
      <div class="meta-left">
        <div class="label">${labels.empId}: ${empId}</div>
        <div class="value">${empName}</div>
        <div class="value">${designation}</div>
      </div>
      <div class="meta-right">
        <div class="date">${dateStr}</div>
        <div class="time">${timeStr}</div>
      </div>
    </div>

    <hr class="divider"/>

    <div class="item-name">${display}</div>

    <div class="qr-wrapper">
      <div class="qr-frame">
        <img src="${qrDataUrl}" alt="QR" width="200" height="200"/>
      </div>
    </div>

    <div class="valid-upto">${labels.validUpto}: ${dateStr}</div>
    <div class="tear-space">- - - - - - - - - - - -</div>
  `);
};

// ─── buildGuestTicketHtml ─────────────────────────────────────────────────────
export const buildGuestTicketHtml = async ({
  requestId,
  guestDetails,
  hostDetails,
  itemName = "Special Veg Meal",
  itemNameLocalized,
  qrCodeNumber,
  lang = "en",
}) => {
  const labels = getLabels(lang);
  const display = itemNameLocalized ?? itemName;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const qrData = qrCodeNumber ?? `GUEST|${requestId}|${dateStr}`;
  const qrDataUrl = await generateQR(qrData);

  return wrapTicket(`
    <div class="header">
      <div class="coupon-type">${labels.mealCouponGuest}</div><br/>
      <div class="company">${labels.companyName}</div>
    </div>

    <hr class="divider-solid"/>

    <div class="meta-row">
      <div class="meta-left">
        <div class="label">${labels.guestName}:</div>
        <div class="value">${guestDetails?.name ?? "—"}</div>
        ${
          (guestDetails?.company ?? guestDetails?.organization)
            ? `<div class="value">${guestDetails.company ?? guestDetails.organization}</div>`
            : ""
        }
      </div>
      <div class="meta-right">
        <div class="date">${dateStr}</div>
        <div class="time">${timeStr}</div>
      </div>
    </div>

    <hr class="divider"/>

    <div class="item-name">${display}</div>

    <div class="qr-wrapper">
      <div class="qr-frame">
        <img src="${qrDataUrl}" alt="QR" width="200" height="200"/>
      </div>
    </div>

    <div class="valid-upto">${labels.validUpto}: ${dateStr}</div>
    <div class="tear-space">- - - - - - - - - - - -</div>
  `);
};

// ─── buildBulkTicketHtml (Contractor) ────────────────────────────────────────
export const buildBulkTicketHtml = async ({
  contractorName,
  itemName = "Special Veg Meal",
  itemNameLocalized,
  qrCodeNumber,
  lang = "en",
}) => {
  const labels = getLabels(lang);
  const display = itemNameLocalized ?? itemName;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const qrData = qrCodeNumber ?? `BULK|${contractorName}|${dateStr}`;
  const qrDataUrl = await generateQR(qrData);

  return wrapTicket(`
    <div class="header">
      <div class="coupon-type">${labels.mealCouponBulk}</div><br/>
      <div class="company">${labels.companyName}</div>
    </div>

    <hr class="divider-solid"/>

    <div class="meta-row">
      <div class="meta-left">
        <div class="label">${labels.contractorName}:</div>
        <div class="value">${contractorName ?? "—"}</div>
      </div>
      <div class="meta-right">
        <div class="date">${dateStr}</div>
        <div class="time">${timeStr}</div>
      </div>
    </div>

    <hr class="divider"/>

    <div class="item-name">${display}</div>

    <div class="qr-wrapper">
      <div class="qr-frame">
        <img src="${qrDataUrl}" alt="QR" width="200" height="200"/>
      </div>
    </div>

    <div class="valid-upto">${labels.validUpto}: ${dateStr}</div>
    <div class="tear-space">- - - - - - - - - - - -</div>
  `);
};

// ─── buildTicketHtml (legacy) ─────────────────────────────────────────────────
/** @deprecated Use buildSingleItemTicketHtml via printService loop instead. */
export const buildTicketHtml = async ({ user, items, shift, lang = "en" }) => {
  const firstItem = items?.[0]?.nameEn ?? items?.[0]?.name ?? "Meal";
  return buildSingleItemTicketHtml({ user, itemName: firstItem, shift, lang });
};
