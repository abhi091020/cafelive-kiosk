// src/pages/staff-home/index.jsx

import {
  Header,
  Footer,
  UserWelcome,
  DateTimeDisplay,
  BackButton,
} from "@common";
import { HomeIllustration, ActionButtons } from "@components/staff-home";

const StaffHomePage = () => {
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

      {/* ── BACK BUTTON ── */}
      <BackButton to="/home" />

      {/* ── USER WELCOME ── */}
      <UserWelcome />

      {/* ── DATE TIME ── */}
      <DateTimeDisplay />

      {/* ── CENTRAL ILLUSTRATION ── */}
      <HomeIllustration />

      {/* ── ACTION BUTTONS (Employee Booking / Guest Booking / Bulk Order Booking) ── */}
      <ActionButtons />

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
};

export default StaffHomePage;
