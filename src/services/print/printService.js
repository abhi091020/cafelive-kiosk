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
  print,
}) => {
  try {
    const qrCodes = guestDetails?.questQrCodes ?? [];

    // If backend already generated QR codes → print one ticket per QR code
    // Fallback → print 1 + coGuestCount tickets using requestId as QR value
    const tickets =
      qrCodes.length > 0
        ? qrCodes.map((qr) => ({ qrCodeNumber: String(qr) }))
        : Array.from(
            { length: 1 + (Number(guestDetails?.coGuestCount) || 0) },
            () => ({ qrCodeNumber: String(requestId) }),
          );

    console.log(
      `[printService] Printing ${tickets.length} guest ticket(s) for requestId: ${requestId}`,
    );

    for (const { qrCodeNumber } of tickets) {
      const html = await buildGuestTicketHtml({
        requestId,
        guestDetails,
        hostDetails,
        itemName: "Special Veg Meal",
        qrCodeNumber, // ← real 16-digit QR from backend, or requestId as fallback
      });
      await print({ html });
    }

    console.log("[printService] All guest tickets printed successfully.");
  } catch (err) {
    console.error("[printService] Failed to build or print guest ticket:", err);
    throw err; // re-throw so GuestPage can show the error
  }
};

// ─── createAndPrintBulkTicket (Contractor) ───────────────────────────────────
export const createAndPrintBulkTicket = async ({
  contractorName,
  items,
  print,
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
