// src/services/print/printService.js

import {
  buildSingleItemTicketHtml,
  buildGuestTicketHtml,
  buildBulkTicketHtml,
} from "./ticketBuilder";

// ─── Name resolvers ───────────────────────────────────────────────────────────

// Always returns English name — used for coupon-type keyword detection
const resolveEnglishName = (item) =>
  item?.nameEn ?? item?.name ?? item?.menuEnglishName ?? "Item";

// Returns the name in the selected language — used for on-ticket display
const resolveLocalizedName = (item, lang) => {
  if (lang === "hi" && item?.nameHi) return item.nameHi;
  if (lang === "mr" && item?.nameMr) return item.nameMr;
  return item?.nameEn ?? item?.name ?? item?.menuEnglishName ?? "Item";
};

// ─── createAndPrintTicket (Employee) ─────────────────────────────────────────
export const createAndPrintTicket = async ({
  user,
  items,
  shift,
  print,
  bookingResult,
  lang = "en",
}) => {
  try {
    const expandedItems = [];

    if (Array.isArray(bookingResult) && bookingResult.length > 0) {
      for (const booking of bookingResult) {
        const matchedItem = items.find(
          (i) => String(i.id) === String(booking.menuId),
        );
        expandedItems.push({
          itemName: resolveEnglishName(matchedItem),
          itemNameLocalized: resolveLocalizedName(matchedItem, lang),
          qrCodeNumber: booking.qrCodeNumber,
        });
      }
    } else {
      for (const item of items) {
        const qty = Number(item.quantity) || 1;
        for (let i = 0; i < qty; i++) {
          expandedItems.push({
            itemName: resolveEnglishName(item),
            itemNameLocalized: resolveLocalizedName(item, lang),
            qrCodeNumber: undefined,
          });
        }
      }
    }

    console.log(
      `[printService] Building ${expandedItems.length} ticket(s) in parallel [lang: ${lang}]`,
    );

    // OPTIMISATION: Build all ticket HTMLs in parallel (QR generation is async
    // and CPU-bound — no reason to wait for ticket N before starting ticket N+1).
    // Printer still receives jobs one at a time (sequential print loop below).
    const htmlList = await Promise.all(
      expandedItems.map(({ itemName, itemNameLocalized, qrCodeNumber }) =>
        buildSingleItemTicketHtml({
          user,
          itemName,
          itemNameLocalized,
          shift,
          qrCodeNumber,
          lang,
        }),
      ),
    );

    console.log(`[printService] Printing ${htmlList.length} ticket(s)...`);

    for (const html of htmlList) {
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
  lang = "en",
}) => {
  const mealDetails = guestDetails?.mealDetails ?? [];

  if (mealDetails.length === 0) {
    throw new Error("No QR codes available for this guest booking.");
  }

  console.log(
    `[printService] Building ${mealDetails.length} guest ticket(s) in parallel for requestId: ${requestId} [lang: ${lang}]`,
  );

  // OPTIMISATION: Build all guest ticket HTMLs in parallel
  const htmlList = await Promise.all(
    mealDetails.map((meal) => {
      const qrCodeNumber = String(meal.questQrCode);

      // mealName arrives as comma-separated multilingual string:
      // "Non-veg meal,मांसाहारी,मांसाहार"  → [en, hi, mr]
      const mealNameParts = (meal.mealName ?? "Special Veg Meal")
        .split(",")
        .map((s) => s.trim());

      const itemName = mealNameParts[0] ?? "Special Veg Meal";
      const itemNameLocalized =
        lang === "hi"
          ? (mealNameParts[1] ?? itemName)
          : lang === "mr"
            ? (mealNameParts[2] ?? itemName)
            : itemName;

      return buildGuestTicketHtml({
        requestId,
        guestDetails,
        hostDetails,
        itemName,
        itemNameLocalized,
        qrCodeNumber,
        lang,
      });
    }),
  );

  console.log(`[printService] Printing ${htmlList.length} guest ticket(s)...`);

  for (const html of htmlList) {
    await print({ html });
  }

  console.log("[printService] All guest tickets printed successfully.");
};

// ─── createAndPrintBulkTicket (Contractor) ───────────────────────────────────
export const createAndPrintBulkTicket = async ({
  contractorName,
  items,
  print,
  bookingResult,
  lang = "en",
}) => {
  try {
    const expandedItems = [];

    if (Array.isArray(bookingResult) && bookingResult.length > 0) {
      for (const booking of bookingResult) {
        const matchedItem = items.find(
          (i) => String(i.id) === String(booking.menuId),
        );
        expandedItems.push({
          itemName: resolveEnglishName(matchedItem),
          itemNameLocalized: resolveLocalizedName(matchedItem, lang),
          qrCodeNumber: booking.qrCodeNumber,
        });
      }
    } else {
      for (const item of items) {
        const qty = Number(item.quantity) || 1;
        for (let i = 0; i < qty; i++) {
          expandedItems.push({
            itemName: resolveEnglishName(item),
            itemNameLocalized: resolveLocalizedName(item, lang),
            qrCodeNumber: undefined,
          });
        }
      }
    }

    console.log(
      `[printService] Building ${expandedItems.length} bulk ticket(s) in parallel [lang: ${lang}]`,
    );

    // OPTIMISATION: Build all bulk ticket HTMLs in parallel
    const htmlList = await Promise.all(
      expandedItems.map(({ itemName, itemNameLocalized, qrCodeNumber }) =>
        buildBulkTicketHtml({
          contractorName,
          itemName,
          itemNameLocalized,
          qrCodeNumber,
          lang,
        }),
      ),
    );

    console.log(`[printService] Printing ${htmlList.length} bulk ticket(s)...`);

    for (const html of htmlList) {
      await print({ html });
    }

    console.log("[printService] All bulk tickets printed successfully.");
  } catch (err) {
    console.error("[printService] Failed to build or print bulk ticket:", err);
  }
};
