// src/pages/home/index.jsx

import {
  Header,
  Footer,
  UserWelcome,
  DateTimeDisplay,
  BackButton,
} from "@common";
import { HomeIllustration, ActionButtons } from "@components/home";
import { ROUTES } from "@router/AppRouter";

const HomePage = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* ── HEADER ── */}
      <Header />

      {/* ── BACK BUTTON ────────────────────────────────────────────────────
           No onBack needed — LoginPage clears session on mount automatically.
           replace:true is handled inside BackButton itself.
      ── */}
      <BackButton to={ROUTES.LOGIN} />

      {/* ── USER WELCOME ── */}
      <UserWelcome />

      {/* ── DATE TIME ── */}
      <DateTimeDisplay />

      {/* ── CENTRAL ILLUSTRATION ── */}
      <HomeIllustration />

      {/* ── ACTION BUTTONS ── */}
      <ActionButtons />

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
};

export default HomePage;
