// src/pages/employee-booking/index.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer, BackButton } from "@common";
import {
  EmployeeIdCard,
  EmployeeBookingActions,
} from "@components/employee-booking";
import NumPad from "@components/employee-booking/NumPad";
import { useUser } from "@context/UserContext";
import { ROUTES } from "@router/AppRouter";
import { validateUser } from "@services/api/userAPI";

const EmployeeBookingPage = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, setUser } = useUser(); // ✅ also destructure `user`
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!employeeId) return;

    setLoading(true);
    setError(null);

    // ✅ Capture staffId BEFORE setUser() overwrites the session
    const staffId = user?.userType === "staff" ? Number(user.id) : null;

    try {
      const result = await validateUser(employeeId);

      setUser(result);

      // ✅ Pass staffId to MenuPage via route state
      navigate(ROUTES.MENU, { state: { staffId } });
    } catch (err) {
      setError(err.serverMessage ?? "User not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      <div style={{ position: "relative", zIndex: 10 }}>
        <Header />
      </div>

      {/* ── BACK BUTTON ── */}
      <BackButton to="/staff-home" />

      {/* ── ID CARD ── */}
      <div
        style={{
          position: "absolute",
          top: "21vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
        }}
      >
        <EmployeeIdCard value={employeeId} />
      </div>

      {/* ── ERROR MESSAGE ── */}
      {error && (
        <div
          style={{
            position: "absolute",
            top: "30vh",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 6,
            color: "#EA4D4E",
            fontWeight: 600,
            fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)",
          }}
        >
          {error}
        </div>
      )}

      {/* ── SUBMIT + CANCEL BUTTONS ── */}
      <div
        style={{
          position: "absolute",
          top: "clamp(33vh, 35vh, 37vh)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
        }}
      >
        <EmployeeBookingActions onSubmit={handleSubmit} loading={loading} />
      </div>

      {/* ── NUMPAD ── */}
      <div
        style={{
          position: "absolute",
          top: "clamp(38vh, 42vh, 46vh)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
        }}
      >
        <NumPad
          value={employeeId}
          onChange={setEmployeeId}
          onEnter={handleSubmit}
        />
      </div>

      {/* ── FOOTER ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default EmployeeBookingPage;
