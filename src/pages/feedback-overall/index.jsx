// src/pages/feedback-overall/index.jsx

import { Header, Footer, BackButton } from "@common";
import FeedbackCard from "@components/feedback/FeedbackCard";

export default function OverallFeedbackPage() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#F9F9F9",
      }}
    >
      <div style={{ position: "relative", zIndex: 3 }}>
        <Header />
        {/* ── BACK BUTTON ── */}
        <BackButton to="/home" />
      </div>

      <FeedbackCard type="overall" />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 3,
        }}
      >
        <Footer />
      </div>
    </div>
  );
}
