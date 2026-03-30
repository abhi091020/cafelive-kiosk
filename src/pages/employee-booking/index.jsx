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

const EmployeeBookingPage = () => {
  const [employeeId, setEmployeeId] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!employeeId) return;

    // ── Mock employee lookup until backend is ready ──
    const mockEmployees = {
      1001: {
        name: "Rahul Sharma",
        department: "Engineering",
        shift: "Morning",
      },
      1002: { name: "Priya Patel", department: "HR", shift: "Evening" },
      1003: { name: "Amit Kumar", department: "Finance", shift: "Morning" },
    };

    const mock = mockEmployees[employeeId] ?? {
      name: "Employee " + employeeId, // ← fallback if ID not in mock list
      department: "General",
      shift: "Morning",
    };

    setUser({
      id: employeeId,
      employeeId: employeeId,
      name: mock.name,
      department: mock.department,
      shift: mock.shift,
      canBookGuest: false,
    });

    navigate(ROUTES.MENU);
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
      <BackButton to="/home" />

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
        <EmployeeBookingActions onSubmit={handleSubmit} />
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
