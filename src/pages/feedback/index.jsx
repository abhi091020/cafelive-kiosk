import feedbackSvg from "@assets/feedback.svg";
import {
  Header,
  Footer,
  UserWelcome,
  DateTimeDisplay,
  BackButton,
} from "@common";
import FeedbackButtons from "@components/feedback/FeedbackButtons";

export default function FeedbackPage() {
  return (
    <div
      style={{
        position: "relative",
        width: "1080px",
        height: "1920px",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* ── HEADER ──────────────────────────────────── */}
      <Header />

      {/* ── BACK BUTTON ── */}
      <BackButton to="/home" />

      {/* ── USER WELCOME + DATE TIME ────────────────── */}
      <UserWelcome />
      <DateTimeDisplay />

      {/* ── FEEDBACK ILLUSTRATION (SVG) ─────────────── */}
      <img
        src={feedbackSvg}
        alt="Feedback illustration"
        style={{
          position: "absolute",
          left: "158px",
          top: "659px",
          width: "765px",
          height: "512px",
          objectFit: "contain",
        }}
      />

      {/* ── BUTTONS ─────────────────────────────────── */}
      <FeedbackButtons />

      {/* ── FOOTER ──────────────────────────────────── */}
      <Footer />
    </div>
  );
}
