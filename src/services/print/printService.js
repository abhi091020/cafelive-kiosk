// src/services/print/printService.js

import {
  buildSingleItemTicketHtml,
  buildGuestTicketHtml,
  buildBulkTicketHtml,
} from "./ticketBuilder";

// ─── Helper: resolve item name from any field shape ───────────────────────────
const resolveItemName = (item) =>
  item?.nameEn ?? item?.name ?? item?.menuEnglishName ?? "Item";

// ─── createAndPrintTicket (Employee) ─────────────────────────────────────────
export const createAndPrintTicket = async ({
  user,
  items,
  shift,
  print,
  qrCodeNumber,
  bookingResult,
}) => {
  try {
    const expandedItems = [];

    if (Array.isArray(bookingResult) && bookingResult.length > 0) {
      for (const booking of bookingResult) {
        const matchedItem = items.find(
          (i) => String(i.id) === String(booking.menuId),
        );
        expandedItems.push({
          itemName: resolveItemName(matchedItem),
          qrCodeNumber: booking.qrCodeNumber,
        });
      }
    } else {
      for (const item of items) {
        const qty = Number(item.quantity) || 1;
        for (let i = 0; i < qty; i++) {
          expandedItems.push({ itemName: resolveItemName(item), qrCodeNumber });
        }
      }
    }

    console.log(`[printService] Printing ${expandedItems.length} ticket(s)`);

    for (const { itemName, qrCodeNumber: qr } of expandedItems) {
      const html = await buildSingleItemTicketHtml({
        user,
        itemName,
        shift,
        qrCodeNumber: qr,
      });
      await print({ html });
    }

    console.log("[printService] All tickets printed successfully.");
  } catch (err) {
    console.error("[printService] Failed to build or print ticket:", err);
  }
};

// ─── createAndPrintGuestTicket ────────────────────────────────────────────────
export const createAndPrintGuestTicket = async ({
  requestId,
  guestDetails,
  hostDetails,
  itemName,
  print,
}) => {
  try {
    const html = await buildGuestTicketHtml({
      requestId,
      guestDetails,
      hostDetails,
      itemName,
    });
    await print({ html });
    console.log("[printService] Guest ticket printed successfully.");
  } catch (err) {
    console.error("[printService] Failed to build or print guest ticket:", err);
  }
};

// ─── createAndPrintBulkTicket (Contractor) ───────────────────────────────────
export const createAndPrintBulkTicket = async ({
  contractorName,
  items,
  print,
  bookingResult, // ✅ now handles bookingResult with qrCodeNumber per ticket
}) => {
  try {
    const expandedItems = [];

    if (Array.isArray(bookingResult) && bookingResult.length > 0) {
      // ✅ Use QR codes from API response
      for (const booking of bookingResult) {
        const matchedItem = items.find(
          (i) => String(i.id) === String(booking.menuId),
        );
        expandedItems.push({
          itemName: resolveItemName(matchedItem),
          qrCodeNumber: booking.qrCodeNumber,
        });
      }
    } else {
      // Fallback: expand by quantity
      for (const item of items) {
        const qty = Number(item.quantity) || 1;
        for (let i = 0; i < qty; i++) {
          expandedItems.push({
            itemName: resolveItemName(item),
            qrCodeNumber: undefined,
          });
        }
      }
    }

    console.log(
      `[printService] Printing ${expandedItems.length} bulk ticket(s)`,
    );

    for (const { itemName, qrCodeNumber } of expandedItems) {
      const html = await buildBulkTicketHtml({
        contractorName,
        itemName,
        qrCodeNumber,
      });
      await print({ html });
    }

    console.log("[printService] All bulk tickets printed successfully.");
  } catch (err) {
    console.error("[printService] Failed to build or print bulk ticket:", err);
  }
};
