// src/hooks/usePrint.js

import { useCallback, useState } from "react";
import { useApp } from "@context/AppContext";

// ─── usePrint ─────────────────────────────────────────────────────────────────
//
// Handles ticket printing silently.
//
// Production (Electron)     → window.electronAPI.print()  (silent, no dialog)
// Kiosk (Chrome + flag)     → hidden <iframe> + print()   (silent with --kiosk-printing)
// Dev (plain browser)       → hidden <iframe> + print()   (shows dialog — expected)
//
// Kiosk launch flag required in .bat:
//   --kiosk-printing
//
// Usage:
//   const { print, isPrinting } = usePrint();
//   await print({ html: ticketHtmlString });
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
          const isElectron = Boolean(window?.electronAPI?.print);

          if (isElectron) {
            // ── Production: Electron silent print ──────────────────────────
            window.electronAPI
              .print({ html })
              .then(resolve)
              .catch((err) => {
                console.error("[usePrint] Electron print failed:", err);
                showNotification({ message: "printerError", type: "error" });
                resolve();
              })
              .finally(() => setIsPrinting(false));

            return;
          }

          // ── Chrome Kiosk / Dev: hidden iframe silent print ────────────────
          // No popup — iframe is injected invisibly into the current page.
          // With --kiosk-printing flag, Chrome skips the dialog entirely.
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

          // Write ticket HTML into the hidden iframe
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
