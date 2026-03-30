// src/components/shared/PlaceholderPage.jsx
// Renamed from PlaceholderScreen → PlaceholderPage to match pages/ structure.
// Used by all unbuilt pages during development.
// Replace each lazy import in AppRouter.jsx with the real page when built.

import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@router/AppRouter";
import { useUser } from "@context/UserContext";

const PlaceholderPage = ({ screenName, route }) => {
  const navigate = useNavigate();
  const { setUser, clearUser, isAuthenticated } = useUser();

  // Simulate a card scan so protected routes can be tested
  const handleFakeLogin = () => {
    setUser({
      id: "EMP-10042",
      employeeId: "MUK-10042",
      name: "Rajesh Sharma",
      department: "Production",
      shift: "Morning",
      canBookGuest: true,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        background: "#0f0f0f",
        color: "#ffffff",
        fontFamily: "monospace",
        gap: "1.25rem",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      {/* Phase badge */}
      <span
        style={{
          background: "#f97316",
          color: "#fff",
          padding: "0.3rem 0.9rem",
          borderRadius: "4px",
          fontSize: "0.7rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        Phase 2 — Placeholder
      </span>

      {/* Page name */}
      <h1
        style={{
          margin: 0,
          fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
          fontWeight: 700,
        }}
      >
        {screenName}
      </h1>

      {/* Current route */}
      <code
        style={{
          background: "rgba(255,255,255,0.08)",
          padding: "0.4rem 1.1rem",
          borderRadius: "6px",
          fontSize: "0.95rem",
          color: "#f97316",
        }}
      >
        {route}
      </code>

      {/* Auth status */}
      <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.5 }}>
        Auth: {isAuthenticated ? "✅ Logged in" : "❌ Not logged in"}
      </p>

      {/* Dev controls */}
      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
          width: "100%",
          maxWidth: "340px",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.4 }}>
          Dev Controls
        </p>

        {/* Fake login / logout */}
        <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
          <button onClick={handleFakeLogin} style={btnStyle("#16a34a")}>
            Simulate Scan
          </button>
          <button onClick={clearUser} style={btnStyle("#dc2626")}>
            Clear User
          </button>
        </div>

        <p
          style={{
            margin: "0.5rem 0 0.25rem",
            fontSize: "0.75rem",
            opacity: 0.4,
          }}
        >
          Navigate To
        </p>

        {/* Route list */}
        {Object.entries(ROUTES).map(([key, path]) => (
          <button
            key={key}
            onClick={() => navigate(path)}
            style={btnStyle(
              path === route ? "#f97316" : "rgba(255,255,255,0.07)",
            )}
          >
            {key} → {path}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Button style helper ──────────────────────────────────────────────────────

const btnStyle = (background) => ({
  width: "100%",
  padding: "0.7rem 1rem",
  background,
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "0.82rem",
  cursor: "pointer",
  fontFamily: "monospace",
  transition: "opacity 0.15s",
});

// ─── Props ────────────────────────────────────────────────────────────────────

PlaceholderPage.propTypes = {
  screenName: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
};

export default PlaceholderPage;
