// src/pages/login/index.jsx

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@context/UserContext";
import { useOrder } from "@context/OrderContext";
import { ROUTES } from "@router/AppRouter";
import { validateUser } from "@services/api/userAPI";
import useScanner from "@hooks/useScanner";
import finalBg from "@assets/finalbg.jpg";
import CafeLiveLogo from "@assets/cafelive.png";
import BajajLogo from "@assets/bajajlogo.png";
import welcomeImg from "@assets/welcome.png";
import vectorLine from "@assets/Vectorline.png";
import smartFoodImg from "@assets/Smart Food. Smart Access..png";
import LanguageSelector from "@components/login/LanguageSelector";
import ScanButton from "@components/login/ScanButton";
import SplashFooter from "@components/login/SplashFooter";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser, clearUser } = useUser();
  const { clearOrder } = useOrder();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanEnabled, setScanEnabled] = useState(false);

  // ── Always wipe session when Login mounts ─────────────────────────────────
  // This guarantees a clean state whether the user:
  //   • arrived via idle timeout
  //   • pressed BackButton from Home / StaffHome
  //   • navigated here any other way
  // This is the correct kiosk pattern — no race condition possible.
  useEffect(() => {
    clearUser();
    clearOrder();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFaceScan = async (empId) => {
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const result = await validateUser(empId);

      setUser(result);

      // ── Routing logic ─────────────────────────────────────────
      // Staff      → canteenStaffId present      → /staff-home
      // Contractor → employmentType OnContract   → /staff-home
      // Employee   → employmentType OnRoll       → /home
      const isStaff = !!result.canteenStaffId;
      const isContractor = result.employmentType === "OnContract";

      if (isStaff || isContractor) {
        navigate(ROUTES.STAFF_HOME, { replace: true });
      } else {
        navigate(ROUTES.HOME, { replace: true });
      }
    } catch (err) {
      setError(err.serverMessage ?? "Face not recognised. Please try again.");
      setScanEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  // ── Face device input — only active after button click ──
  useScanner({
    onScan: (empId) => handleFaceScan(empId),
    minLength: 1,
    disabled: !scanEnabled,
  });

  // ── Button click → only enables scanner, nothing else ──
  const handleScan = () => {
    setScanEnabled(true);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── BASE IMAGE ── */}
      <img
        src={finalBg}
        alt="Login Background"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* ── CAFELIVE LOGO ── */}
      <img
        src={CafeLiveLogo}
        alt="CafeLive"
        style={{
          position: "absolute",
          top: "clamp(2vh, 4.2vh, 5vh)",
          left: "clamp(3vw, 6.1vw, 8vw)",
          width: "clamp(120px, 20vw, 240px)",
          height: "auto",
          zIndex: 1,
        }}
      />

      {/* ── BAJAJ MUKAND LOGO ── */}
      <img
        src={BajajLogo}
        alt="Bajaj Mukand"
        style={{
          position: "absolute",
          top: "clamp(2vh, 4.2vh, 5vh)",
          right: "clamp(3vw, 6.1vw, 8vw)",
          width: "clamp(90px, 15vw, 175px)",
          height: "auto",
          objectFit: "contain",
          zIndex: 1,
        }}
      />

      {/* ── WELCOME TO MUKAND LIMITED ── */}
      <img
        src={welcomeImg}
        alt="Welcome to Mukand Limited"
        style={{
          position: "absolute",
          top: "clamp(12vh, 14.2vh, 16vh)",
          left: "clamp(18vw, 22.8vw, 26vw)",
          width: "clamp(150px, 25vw, 280px)",
          height: "auto",
          zIndex: 1,
        }}
      />

      {/* ── VECTOR LINE ── */}
      <img
        src={vectorLine}
        alt=""
        style={{
          position: "absolute",
          top: "clamp(18.5vh, 20.77vh, 23vh)",
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(280px, 65vw, 700px)",
          height: "auto",
          zIndex: 1,
        }}
      />

      {/* ── SMART FOOD. SMART ACCESS. ── */}
      <img
        src={smartFoodImg}
        alt="Smart Food. Smart Access."
        style={{
          position: "absolute",
          top: "clamp(22vh, 24vh, 26vh)",
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(300px, 55vw, 640px)",
          height: "auto",
          zIndex: 1,
        }}
      />

      {/* ── LANGUAGE SELECTOR ── */}
      <div
        style={{
          position: "absolute",
          top: "clamp(54vh, 58vh, 62vh)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          width: "clamp(220px, 36vw, 340px)",
        }}
      >
        <LanguageSelector />
      </div>

      {/* ── ERROR MESSAGE ── */}
      {error && (
        <div
          style={{
            position: "absolute",
            top: "clamp(44vh, 48vh, 52vh)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            background: "#FEF2F2",
            border: "1px solid #B91C1C",
            borderRadius: "10px",
            padding: "10px 24px",
            color: "#B91C1C",
            fontWeight: 600,
            fontSize: "1rem",
            whiteSpace: "nowrap",
          }}
        >
          {error}
        </div>
      )}

      {/* ── LOADING / SCAN READY INDICATOR ── */}
      {(loading || scanEnabled) && !error && (
        <div
          style={{
            position: "absolute",
            top: "clamp(44vh, 48vh, 52vh)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            color: "#079A3F",
            fontWeight: 600,
            fontSize: "1.2rem",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Verifying..." : "Ready — please scan your face"}
        </div>
      )}

      {/* ── READY TO SCAN BUTTON ── */}
      <div
        style={{
          position: "absolute",
          top: "clamp(72vh, 77vh, 82vh)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          width: "clamp(300px, 46vw, 500px)",
          height: "clamp(70px, 8.5vh, 120px)",
        }}
      >
        <ScanButton onScan={handleScan} />
      </div>

      {/* ── FOOTER ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 1,
        }}
      >
        <SplashFooter />
      </div>
    </div>
  );
};

export default LoginPage;
