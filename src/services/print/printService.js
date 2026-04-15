// src/services/print/printService.js

import {
  buildSingleItemTicketHtml,
  buildGuestTicketHtml,
} from "./ticketBuilder";

// ─── createAndPrintTicket ─────────────────────────────────────────────────────
/**
 * Prints ONE physical coupon per item unit.
 *
 * Example:
 *   items = [{ name: "Coffee", quantity: 2 }, { name: "Tea", quantity: 3 }]
 *   → prints 5 tickets: Coffee, Coffee, Tea, Tea, Tea  (each with its own QR)
 *
 * @param {Object}   options
 * @param {Object}   options.user           - { employeeId, name, department }
 * @param {Array}    options.items          - [{ name: string, quantity: number }]
 * @param {string}   options.shift          - e.g. "1st Shift"
 * @param {Function} options.print          - print({ html }) from usePrint() hook
 * @param {string}   [options.qrCodeNumber] - Unique QR ID from API response
 *                                            (e.g. "11504202610080653191").
 *                                            If provided, all tickets use this as QR content.
 * @returns {Promise<void>}
 */
export const createAndPrintTicket = async ({
  user,
  items,
  shift,
  print,
  qrCodeNumber,
}) => {
  try {
    // Expand items by quantity → flat list of individual item names
    // [{ name: "Coffee", quantity: 2 }, { name: "Tea", quantity: 3 }]
    // becomes → ["Coffee", "Coffee", "Tea", "Tea", "Tea"]
    const expandedItems = [];

    for (const item of items) {
      const qty = Number(item.quantity) || 1;
      for (let i = 0; i < qty; i++) {
        expandedItems.push(item.name);
      }
    }

    console.log(
      `[printService] Printing ${expandedItems.length} ticket(s):`,
      expandedItems,
    );

    // Print each ticket sequentially — one QR per physical coupon
    for (const itemName of expandedItems) {
      const html = await buildSingleItemTicketHtml({
        user,
        itemName,
        shift,
        qrCodeNumber, // ✅ passed from API order response
      });
      await print({ html });
    }

    console.log("[printService] All tickets printed successfully.");
  } catch (err) {
    console.error("[printService] Failed to build or print ticket:", err);
  }
};

// ─── createAndPrintGuestTicket ────────────────────────────────────────────────
/**
 * Builds and prints a guest QR coupon ticket silently.
 *
 * @param {Object}   options
 * @param {number}   options.requestId      - Guest request ID
 * @param {Object}   options.guestDetails   - { name, company, coGuestCount }
 * @param {Object}   options.hostDetails    - { empName, deptName }
 * @param {Function} options.print          - print({ html }) from usePrint() hook
 * @returns {Promise<void>}
 */
export const createAndPrintGuestTicket = async ({
  requestId,
  guestDetails,
  hostDetails,
  print,
}) => {
  try {
    const html = await buildGuestTicketHtml({
      requestId,
      guestDetails,
      hostDetails,
    });
    await print({ html });
    console.log("[printService] Guest ticket printed successfully.");
  } catch (err) {
    console.error("[printService] Failed to build or print guest ticket:", err);
  }
};
