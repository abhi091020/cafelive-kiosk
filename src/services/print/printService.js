// src/services/print/printService.js

import { buildTicketHtml } from "./ticketBuilder";

/**
 * createAndPrintTicket — builds the ticket HTML and triggers silent print.
 *
 * @param {Object}   options
 * @param {Object}   options.user    - { employeeId, name, department }
 * @param {Array}    options.items   - [{ name, quantity }]
 * @param {string}   options.shift   - e.g. "1st Shift"
 * @param {Function} options.print   - print function from usePrint() hook
 * @returns {Promise<void>}
 */
export const createAndPrintTicket = async ({ user, items, shift, print }) => {
  try {
    const html = await buildTicketHtml({ user, items, shift });
    await print({ html });
  } catch (err) {
    console.error("[printService] Failed to build or print ticket:", err);
  }
};
