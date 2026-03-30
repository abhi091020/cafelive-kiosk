// src\hooks\useIdleTimer.js

import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@context/UserContext";
import { useOrder } from "@context/OrderContext";
import { ROUTES } from "@router/AppRouter";

// ─── useIdleTimer ─────────────────────────────────────────────────────────────
//
// Monitors user inactivity on any screen.
// After VITE_IDLE_TIMEOUT ms of no interaction → wipes user + order → Splash.
//
// Events tracked: touch, mouse move, mouse click, keydown
// Touch events are prioritised since this is a touchscreen kiosk.
//
// Usage:
//   Call once per screen that needs idle detection (all screens after Splash).
//   Pass onIdle callback if the screen needs to do cleanup before redirect.
//
//   useIdleTimer();                          // basic — just resets and redirects
//   useIdleTimer({ onIdle: handleCleanup }); // with optional pre-reset callback
//
// ─────────────────────────────────────────────────────────────────────────────

const IDLE_EVENTS = [
  "touchstart",
  "touchmove",
  "mousemove",
  "mousedown",
  "keydown",
];

const useIdleTimer = ({ onIdle } = {}) => {
  const navigate = useNavigate();
  const { clearUser } = useUser();
  const { clearOrder } = useOrder();
  const timerRef = useRef(null);

  const timeout = Number(import.meta.env.VITE_IDLE_TIMEOUT) || 30_000;

  // ── Reset timer on every interaction ─────────────────────────────────────

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      // Optional screen-level cleanup before session wipe
      if (typeof onIdle === "function") {
        onIdle();
      }

      // Wipe session data
      clearUser();
      clearOrder();

      // Return to Splash
      navigate(ROUTES.SPLASH, { replace: true });
    }, timeout);
  }, [timeout, onIdle, clearUser, clearOrder, navigate]);

  // ── Attach / detach event listeners ──────────────────────────────────────

  useEffect(() => {
    // Start timer immediately on mount
    resetTimer();

    IDLE_EVENTS.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true }),
    );

    return () => {
      // Clean up on unmount — prevents timer firing after screen changes
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      IDLE_EVENTS.forEach((event) =>
        window.removeEventListener(event, resetTimer),
      );
    };
  }, [resetTimer]);
};

export default useIdleTimer;
