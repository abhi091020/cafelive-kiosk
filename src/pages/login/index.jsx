import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useUser } from "@context/UserContext";
import { ROUTES } from "@router/AppRouter";
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
  const { setUser } = useUser();

  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  const handleScan = () => {
    tapCount.current += 1;
    clearTimeout(tapTimer.current);

    tapTimer.current = setTimeout(() => {
      if (tapCount.current >= 2) {
        // ── DOUBLE TAP → Staff Home ──
        const mockStaff = {
          id: "STAFF001",
          employeeId: "STAFF001",
          name: "Canteen Staff",
          department: "Canteen",
          role: "staff",
        };
        setUser(mockStaff);
        navigate(ROUTES.STAFF_HOME);
      } else {
        // ── SINGLE TAP → Employee Home ──
        const mockUser = {
          id: "2",
          employeeId: "2",
          name: "Aakash Shirke",
          department: "Staff Executive",
          shift: "Morning",
          canBookGuest: true,
        };
        setUser(mockUser);
        navigate(ROUTES.HOME);
      }
      tapCount.current = 0;
    }, 300); // 300ms window to detect double tap
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