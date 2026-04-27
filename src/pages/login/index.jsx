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
import oopsImg from "@assets/oops.png";
import oopsBg from "@assets/oopsbg.png";
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

      // result now contains _message from userAPI
      setUser(result);

      if (result._message === "Valid employee") {
        navigate(ROUTES.HOME, { replace: true });
      } else {
        // "Valid staff" → Employee Booking + Guest Booking
        // "Valid contractor" → Bulk Booking only
        navigate(ROUTES.STAFF_HOME, { replace: true });
      }
    } catch (err) {
      setError(err.serverMessage ?? "Face not recognised. Please try again.");
      setScanEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  useScanner({
    onScan: (empId) => handleFaceScan(empId),
    minLength: 1,
    disabled: !scanEnabled,
  });

  const handleScan = () => {
    setScanEnabled(true);
    setTimeout(() => {
      setScanEnabled(false);
    }, 10000); // 10 seconds
  };
  const handleDismissError = () => setError(null);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        backgroundColor: "#0f0f0f",
      }}
    >
      {/* ── BASE IMAGE ── */}
      <img
        src={finalBg}
        alt="Login Background"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "fill",
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
          zIndex: error ? 0 : 1,
          width: "clamp(220px, 36vw, 340px)",
          pointerEvents: error ? "none" : "auto",
        }}
      >
        <LanguageSelector />
      </div>

      {/* ── LOADING / SCAN READY INDICATOR ── */}
      {/* {(loading || scanEnabled) && !error && (
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
      )} */}

      {/* ── READY TO SCAN BUTTON ── */}
      <div
        style={{
          position: "absolute",
          top: "clamp(72vh, 77vh, 82vh)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: error ? 0 : 1,
          width: "clamp(300px, 46vw, 500px)",
          height: "clamp(70px, 8.5vh, 120px)",
          pointerEvents: error ? "none" : "auto",
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
          zIndex: error ? 0 : 1,
        }}
      >
        <SplashFooter />
      </div>

      {/* ── OOPS ERROR MODAL ── */}
      {error && (
        <>
          {/* Backdrop */}
          <div
            onClick={handleDismissError}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.55)",
              zIndex: 9999,
            }}
          />

          {/* Card */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10000,
              width: "clamp(280px, 44vw, 460px)",
              backgroundImage: `url(${oopsBg})`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              borderRadius: "20px",
              padding: "32px 32px 36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              overflow: "hidden",
            }}
          >
            <img
              src={oopsImg}
              alt="Oops"
              style={{
                width: "clamp(90px, 14vw, 140px)",
                height: "auto",
                marginBottom: "4px",
              }}
            />

            <p
              style={{
                margin: 0,
                fontSize: "clamp(1.2rem, 2.6vw, 1.7rem)",
                fontWeight: 700,
                color: "#C0392B",
              }}
            >
              Sorry
            </p>

            <p
              style={{
                margin: 0,
                fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
                fontWeight: 600,
                color: "#1a1a1a",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              {error}
            </p>

            <button
              onClick={handleDismissError}
              style={{
                marginTop: "16px",
                padding: "11px 48px",
                backgroundColor: "#8B0000",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.3px",
              }}
            >
              Try Again
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginPage;
