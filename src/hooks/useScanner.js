// src\hooks\useScanner.js

import { useEffect, useRef, useCallback } from "react";

// ─── useScanner ───────────────────────────────────────────────────────────────
//
// Listens for input from a physical HID card reader or QR code scanner.
// These devices behave like a fast keyboard — they fire rapid keydown events
// and end with an Enter key press.
//
// How it works:
//   - Collects characters typed faster than SCAN_SPEED_THRESHOLD_MS apart
//   - When Enter is received, treats the accumulated string as a scan result
//   - Ignores slow typing (human keyboard input) by checking time between keys
//
// Usage:
//   useScanner({ onScan: (cardId) => handleCardScan(cardId) });
//
// Options:
//   onScan   {Function} - called with the scanned string when scan completes
//   minLength {number}  - minimum scan length to be considered valid (default 3)
//   disabled  {boolean} - pause scanning without unmounting (default false)
//
// ─────────────────────────────────────────────────────────────────────────────

const SCAN_SPEED_THRESHOLD_MS = 50; // Characters arriving faster than this = scanner input

const useScanner = ({ onScan, minLength = 3, disabled = false } = {}) => {
  const bufferRef = useRef("");
  const lastKeyTimeRef = useRef(0);

  const handleKeyDown = useCallback(
    (e) => {
      if (disabled) return;

      const now = Date.now();
      const elapsed = now - lastKeyTimeRef.current;
      lastKeyTimeRef.current = now;

      // Enter key = end of scan
      if (e.key === "Enter") {
        const scanned = bufferRef.current.trim();
        bufferRef.current = "";

        if (scanned.length >= minLength && typeof onScan === "function") {
          onScan(scanned);
        }
        return;
      }

      // If too slow between keystrokes → likely human typing, reset buffer
      if (elapsed > SCAN_SPEED_THRESHOLD_MS && bufferRef.current.length > 0) {
        bufferRef.current = "";
      }

      // Accumulate printable characters only
      if (e.key.length === 1) {
        bufferRef.current += e.key;
      }
    },
    [disabled, minLength, onScan],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      bufferRef.current = "";
    };
  }, [handleKeyDown]);
};

export default useScanner;
