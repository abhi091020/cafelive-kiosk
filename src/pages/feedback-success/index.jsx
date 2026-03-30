// src/pages/feedback-success/index.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "@common";
import successFeedImg from "@assets/successfeed.png";
import thankYouSvg from "@assets/thankyou.svg";
import subtitleSvg from "@assets/feedbacksubtitle.svg";

// ─── Confetti ─────────────────────────────────────────────────────────────────
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
    const size = 6 + Math.random() * 8;
    return {
      key: i,
      style: {
        position: "fixed",
        top: "-20px",
        left: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size * (Math.random() > 0.5 ? 1 : 2.5)}px`,
        backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
        animation: `confettiFall ${1.8 + Math.random() * 1.4}s ${Math.random() * 1.2}s ease-in forwards`,
        zIndex: 50,
        pointerEvents: "none",
      },
    };
  });

// ─── FeedbackSuccessPage ──────────────────────────────────────────────────────
const FeedbackSuccessPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [confetti] = useState(() => generateConfetti(70));

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
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
      {/* ── Confetti ────────────────────────────────────────────────────── */}
      {confetti.map(({ key, style }) => (
        <ConfettiPiece key={key} style={style} />
      ))}

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Header />

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 4%",
          gap: "20px",
          position: "relative",
        }}
      >
        {/* Pulse glow ring */}
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

        {/* Illustration */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            animation:
              "popIn 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
          }}
        >
          <img
            src={successFeedImg}
            alt="Feedback Submitted"
            style={{
              width: "78vw",
              maxWidth: "860px",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        {/* "Thank you!" SVG */}
        <img
          src={thankYouSvg}
          alt="Thank you!"
          style={{
            width: "clamp(200px, 30vw, 310px)",
            height: "auto",
            animation: "fadeUp 0.5s 0.25s ease both",
            zIndex: 1,
          }}
        />

        {/* Subtitle SVG */}
        <img
          src={subtitleSvg}
          alt="Your feedback has been submitted successfully."
          style={{
            width: "clamp(320px, 55vw, 710px)",
            height: "auto",
            animation: "fadeUp 0.5s 0.35s ease both",
            zIndex: 1,
          }}
        />

        {/* Countdown */}
        <p
          style={{
            margin: 0,
            fontSize: "1.05rem",
            color: "#9CA3AF",
            animation: "fadeUp 0.5s 0.45s ease both",
            zIndex: 1,
          }}
        >
          Redirecting in{" "}
          <span
            style={{
              color: "#B91C1C",
              fontWeight: 700,
              fontSize: "1.2rem",
              display: "inline-block",
              animation: "countPulse 1s ease infinite",
              minWidth: "22px",
              textAlign: "center",
            }}
          >
            {countdown}
          </span>{" "}
          seconds…
        </p>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <Footer />

      {/* ── Keyframes ───────────────────────────────────────────────────── */}
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
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FeedbackSuccessPage;
