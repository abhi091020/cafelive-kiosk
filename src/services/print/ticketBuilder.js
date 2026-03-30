// src/services/print/ticketBuilder.js

import QRCode from "qrcode";

/**
 * buildTicketHtml — generates a print-ready HTML string matching the meal coupon layout.
 *
 * @param {Object}   options
 * @param {Object}   options.user    - { employeeId, name, department }
 * @param {Array}    options.items   - [{ name, quantity }]
 * @param {string}   options.shift   - e.g. "1st Shift"
 * @returns {Promise<string>}        - Full HTML string ready to print
 */
export const buildTicketHtml = async ({ user, items, shift }) => {
  const now = new Date();

  // ── Date / Time strings ───────────────────────────────────────────────────
  const dateStr = now.toLocaleDateString("en-GB"); // DD/MM/YYYY
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }); // 10:00AM

  // ── Valid Upto — end of today (same shift day) ────────────────────────────
  const validUpto = dateStr;

  // ── Item label ────────────────────────────────────────────────────────────
  const itemLabel = items
    .map((i) => (i.quantity > 1 ? `${i.name} x${i.quantity}` : i.name))
    .join(", ");

  // ── QR data — same as PNG: EmpID + Items + Date ───────────────────────────
  const qrData = `${user.employeeId}|${itemLabel}|${dateStr}`;
  const qrDataUrl = await QRCode.toDataURL(qrData, {
    width: 200,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  // ── HTML ──────────────────────────────────────────────────────────────────
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: Arial, sans-serif;
      width: 320px;
      padding: 24px 20px;
      background: #ffffff;
      color: #000000;
    }

    .header {
      text-align: center;
      margin-bottom: 16px;
    }
    .header .label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .header .company {
      font-size: 24px;
      font-weight: 700;
      line-height: 1.2;
      margin-top: 2px;
    }

    .divider {
      border: none;
      border-top: 1px solid #000;
      margin: 12px 0;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4px;
    }
    .meta-left .emp-id {
      font-size: 12px;
      font-weight: 700;
    }
    .meta-left .emp-name {
      font-size: 14px;
      font-weight: 700;
      margin-top: 2px;
    }
    .meta-left .dept {
      font-size: 11px;
      font-weight: 400;
      color: #444;
      margin-top: 2px;
    }
    .meta-right {
      text-align: right;
    }
    .meta-right .date {
      font-size: 12px;
      font-weight: 700;
    }
    .meta-right .time {
      font-size: 12px;
      font-weight: 700;
      margin-top: 2px;
    }

    .item-name {
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      margin: 14px 0 12px 0;
    }

    .qr-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 8px 0 14px 0;
      position: relative;
    }
    .qr-frame {
      position: relative;
      display: inline-block;
      padding: 8px;
    }
    /* Corner brackets */
    .qr-frame::before,
    .qr-frame::after,
    .corner-bl,
    .corner-br {
      content: "";
      position: absolute;
      width: 20px;
      height: 20px;
    }
    .qr-frame::before {
      top: 0; left: 0;
      border-top: 3px solid #000;
      border-left: 3px solid #000;
      border-radius: 4px 0 0 0;
    }
    .qr-frame::after {
      top: 0; right: 0;
      border-top: 3px solid #000;
      border-right: 3px solid #000;
      border-radius: 0 4px 0 0;
    }
    .corner-bl {
      bottom: 0; left: 0;
      border-bottom: 3px solid #000;
      border-left: 3px solid #000;
      border-radius: 0 0 0 4px;
    }
    .corner-br {
      bottom: 0; right: 0;
      border-bottom: 3px solid #000;
      border-right: 3px solid #000;
      border-radius: 0 0 4px 0;
    }
    .qr-frame img {
      display: block;
      width: 180px;
      height: 180px;
    }

    .valid-upto {
      text-align: center;
      font-size: 13px;
      font-weight: 700;
      margin-top: 4px;
    }

    @media print {
    body { -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="label">Meal Coupon</div>
    <div class="company">Mukand Limited, Thane</div>
  </div>

  <hr class="divider" />

  <!-- Employee info + Date/Time -->
  <div class="meta-row">
    <div class="meta-left">
      <div class="emp-id">EMP ID: ${user.employeeId}</div>
      <div class="emp-name">${user.name}</div>
      <div class="dept">${user.department}</div>
    </div>
    <div class="meta-right">
      <div class="date">${dateStr}</div>
      <div class="time">${timeStr}</div>
    </div>
  </div>

  <hr class="divider" />

  <!-- Item -->
  <div class="item-name">${itemLabel}</div>

  <!-- QR Code with corner brackets -->
  <div class="qr-wrapper">
    <div class="qr-frame">
      <img src="${qrDataUrl}" alt="QR Code" />
      <span class="corner-bl"></span>
      <span class="corner-br"></span>
    </div>
  </div>

  <!-- Valid Upto -->
  <div class="valid-upto">Valid Upto: ${validUpto}</div>

</body>
</html>`;
};
