// src/hooks/usePrint.js

import { useCallback, useState } from "react";
import { useApp } from "@context/AppContext";

// ─── usePrint ─────────────────────────────────────────────────────────────────
//
// Handles ticket printing silently.
//
// Production (Electron)  → window.electronAPI.silentPrint()
//                          Uses hidden BrowserWindow in main.js.
//                          Loads ticket HTML via temp file (file://) to avoid
//                          data: URL size limits with base64 QR images.
//                          Fully silent — no dialog shown to user.
//
// Dev (plain browser)    → hidden <iframe> + print()
//                          Shows system print dialog — expected in dev.
//
// Printer                : POS58 Printer (58mm thermal roll)
// pageSize               : { width: 58000, height: 297000 } — microns
//                          width  = 58mm (full roll width)
//                          height = 297mm (tall enough; thermal driver
//                                  feeds only what's needed and auto-cuts)
//
// ─────────────────────────────────────────────────────────────────────────────

const usePrint = () => {
  const { showNotification } = useApp();
  const [isPrinting, setIsPrinting] = useState(false);

  /**
   * print — send HTML ticket content to the printer.
   *
   * @param  {Object} options
   * @param  {string} options.html - Ticket HTML string from ticketBuilder
   * @returns {Promise<void>}
   */
  const print = useCallback(
    ({ html } = {}) => {
      return new Promise((resolve) => {
        if (!html) {
          console.warn("[usePrint] No HTML provided — skipping print.");
          resolve();
          return;
        }

        setIsPrinting(true);

        try {
          // ── Production: Electron silent print via IPC ─────────────────────
          // Calls ipcMain "silent-print" handler in electron/main.js which:
          //   1. Writes HTML to OS temp file
          //   2. Loads it in a hidden BrowserWindow via file://
          //   3. Waits for QR image to decode + forces compositor paint
          //   4. Prints silently to POS58 Printer at 58mm
          //   5. Deletes temp file
          const isElectron = Boolean(window?.electronAPI?.silentPrint);

          if (isElectron) {
            window.electronAPI
              .silentPrint({
                html,
                // POS58 Printer: 58mm wide roll (in microns)
                // height 297000 = 297mm — tall enough for any receipt;
                // thermal driver feeds as needed and auto-cuts.
                // Must match: ticketBuilder @page CSS + main.js BrowserWindow
                pageSize: { width: 48000, height: 297000 }, // ← was undefined
                copies: 1,
              })
              .then(resolve)
              .catch((err) => {
                console.error("[usePrint] Electron silent print failed:", err);
                showNotification({ message: "printerError", type: "error" });
                resolve();
              })
              .finally(() => setIsPrinting(false));

            return;
          }

          // ── Dev / Browser fallback: hidden iframe print ───────────────────
          // Opens the browser print dialog — that is expected behaviour in dev.
          // NOTE: This will NOT print silently on POS58 Printer from a browser.
          //       Use Electron for production printing.
          console.log("[usePrint] Browser fallback — using hidden iframe");

          const iframe = document.createElement("iframe");

          Object.assign(iframe.style, {
            position: "fixed",
            top: "-9999px",
            left: "-9999px",
            width: "0",
            height: "0",
            border: "none",
            visibility: "hidden",
          });

          document.body.appendChild(iframe);

          iframe.onload = () => {
            try {
              iframe.contentWindow.focus();
              iframe.contentWindow.print();
            } catch (err) {
              console.error("[usePrint] iframe print failed:", err);
              showNotification({ message: "printerError", type: "error" });
            } finally {
              // Small delay so print job is queued before iframe is removed
              setTimeout(() => {
                document.body.removeChild(iframe);
                setIsPrinting(false);
                resolve();
              }, 500);
            }
          };

          iframe.contentDocument.open();
          iframe.contentDocument.write(html);
          iframe.contentDocument.close();
        } catch (err) {
          console.error("[usePrint] Print failed:", err);
          showNotification({ message: "printerError", type: "error" });
          setIsPrinting(false);
          resolve();
        }
      });
    },
    [showNotification],
  );

  return { print, isPrinting };
};

export default usePrint;
