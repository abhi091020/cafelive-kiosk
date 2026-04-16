// src/hooks/usePrint.js

import { useCallback, useState } from "react";
import { useApp } from "@context/AppContext";

// ─── usePrint ─────────────────────────────────────────────────────────────────
//
// Handles ticket printing silently.
//
// Production (Electron)  → window.electronAPI.silentPrint()  (hidden BrowserWindow, no dialog)
// Dev (plain browser)    → hidden <iframe> + print()         (shows dialog — expected)
//
// ─────────────────────────────────────────────────────────────────────────────

const usePrint = () => {
  const { showNotification } = useApp();
  const [isPrinting, setIsPrinting] = useState(false);

  /**
   * print — send HTML content to the printer silently.
   *
   * @param  {Object} options
   * @param  {string} options.html - Ticket HTML string built by ticketBuilder
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
          // ── Production: Electron silent print via hidden BrowserWindow ──────
          // Uses ipcMain handler "silent-print" in electron/main.js which
          // loads the ticket HTML into an invisible window and prints only that.
          const isElectron = Boolean(window?.electronAPI?.silentPrint);

          if (isElectron) {
            window.electronAPI
              .silentPrint({
                html,
                pageSize: "A4", // change to thermal size if needed e.g. { width: 72, height: 200 }
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
          // Shows the browser print dialog in dev — that's expected behaviour.
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
              // Small delay so the print job is queued before iframe is removed
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
