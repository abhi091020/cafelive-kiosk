// src/pages/order-success/index.jsx
//
// Features:
//  • Triggers silent QR print on mount — one ticket per item unit
//    e.g. [Coffee x2, Tea x3] → prints 5 tickets silently in background
//  • Big illustration (78vw, max 860px)
//  • CSS confetti burst on mount
//  • Pulse glow ring behind image
//  • Gradient success text overlaid on bottom of image
//  • 3-second countdown → redirect to "/login"

import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header, Footer } from "@common";
import orderCompleteImg from "@assets/ordersuccess2.png";
import usePrint from "@hooks/usePrint";
import { createAndPrintTicket } from "@services/print/printService";

// ─── Confetti piece component ─────────────────────────────────────────────────
const CONFETTI_COLORS = [
  "#EA4D4E",
  "#B91C1C",
  "#FFD700",
  "#4CAF50",
  "#2196F3",
  "#FF9800",
  "#E91E63",
  "#00BCD4",
];

const ConfettiPiece = ({ style }) => <div style={style} />;

const generateConfetti = (count = 60) =>
  Array.from({ length: count }, (_, i) => {
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const left = Math.random() * 100;
    const delay = Math.random() * 1.2;
    const dur = 1.8 + Math.random() * 1.4;
    const size = 6 + Math.random() * 8;
    const shape = Math.random() > 0.5 ? "50%" : "2px";

    return {
      key: i,
      style: {
        position: "fixed",
        top: "-20px",
        left: `${left}%`,
        width: `${size}px`,
        height: `${size * (Math.random() > 0.5 ? 1 : 2.5)}px`,
        backgroundColor: color,
        borderRadius: shape,
        animation: `confettiFall ${dur}s ${delay}s ease-in forwards`,
        zIndex: 50,
        pointerEvents: "none",
      },
    };
  });

// ─── OrderSuccessPage ─────────────────────────────────────────────────────────
const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { print } = usePrint();

  // ── Data passed from the booking page via navigate(state) ──────────────
  const user = location.state?.user || null;
  const items = location.state?.items || [];
  const shift = location.state?.shift || "";

  // bookingResult from API is: { result: [{ bookingId, qrCodeNumber, ... }] }
  // menu/index.jsx passes `response.result` which is the array itself.
  // ✅ Safely extract qrCodeNumber from index [0] whether it's an array or object.
  const bookingResult = location.state?.bookingResult ?? null;
  const qrCodeNumber = Array.isArray(bookingResult)
    ? (bookingResult[0]?.qrCodeNumber ?? null)
    : (bookingResult?.qrCodeNumber ?? null);

  const [countdown, setCountdown] = useState(3);
  const [confetti] = useState(() => generateConfetti(70));

  // Guard so printing runs only once even under StrictMode double-invoke
  const hasPrinted = useRef(false);

  // ── Silent print on mount ───────────────────────────────────────────────
  useEffect(() => {
    if (hasPrinted.current) return;
    if (!user || items.length === 0) return;

    hasPrinted.current = true;

    console.log("[OrderSuccessPage] qrCodeNumber →", qrCodeNumber);

    // ✅ Pass qrCodeNumber — QR will encode only this number (e.g. "31504202611000968281")
    createAndPrintTicket({ user, items, shift, print, qrCodeNumber }).catch(
      (err) => console.error("[OrderSuccessPage] Print error:", err),
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Countdown → redirect ────────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) {
      navigate("/login");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Confetti ──────────────────────────────────────────────────────── */}
      {confetti.map(({ key, style }) => (
        <ConfettiPiece key={key} style={style} />
      ))}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <Header />

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 4%",
          gap: "16px",
          position: "relative",
        }}
      >
        {/* Pulse glow ring behind illustration */}
        <div
          style={{
            position: "absolute",
            width: "min(72vw, 720px)",
            height: "min(72vw, 720px)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(234,77,78,0.10) 0%, rgba(234,77,78,0) 70%)",
            animation: "pulseRing 2.4s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── Illustration + overlapping success text ────────────────────── */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "inline-block",
            animation:
              "popIn 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
          }}
        >
          <img
            src={orderCompleteImg}
            alt="Order Complete"
            style={{
              width: "78vw",
              maxWidth: "860px",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
            onError={(e) => {
              e.currentTarget.src = "/src/assets/ordercomplete.png";
            }}
          />

          <h1
            style={{
              position: "absolute",
              bottom: "6%",
              left: 0,
              right: 0,
              margin: 0,
              fontSize: "clamp(1.9rem, 5.5vw, 3rem)",
              fontWeight: 800,
              lineHeight: 1.28,
              textAlign: "center",
              background: "linear-gradient(90deg, #860606 0%, #EA4D4E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "fadeUp 0.5s 0.25s ease both",
            }}
          >
            {t("order.orderSuccess")}
            <br />
            {t("order.orderComplete")}
          </h1>
        </div>

        {/* ── Countdown ─────────────────────────────────────────────────── */}
        <p
          style={{
            margin: 0,
            fontSize: "1.05rem",
            color: "#9CA3AF",
            animation: "fadeUp 0.5s 0.45s ease both",
            zIndex: 1,
          }}
        >
          {t("order.redirecting", { seconds: countdown })}
        </p>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <Footer />

      {/* ── Keyframes ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.7) translateY(30px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes fadeUp {
          0%   { opacity: 0; transform: translateY(22px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseRing {
          0%   { transform: scale(0.92); opacity: 0.6; }
          50%  { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(0.92); opacity: 0.6; }
        }

        @keyframes countPulse {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }

        @keyframes confettiFall {
          0%   { transform: translateY(0)   rotate(0deg);    opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccessPage;
