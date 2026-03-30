// src/components/common/UserWelcome.jsx

import { useTranslation } from "react-i18next";
import { useUser } from "@context/UserContext";

const UserWelcome = () => {
  const { user } = useUser();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "clamp(9vh, 11.00vh, 13vh)",
        left: "clamp(90px, 12vw, 140px)",
        zIndex: 10,
      }}
    >
      {/* Welcome Message */}
      <h1
        style={{
          margin: 0,
          padding: 0,
          fontSize: "clamp(1.8rem, 3.05vw, 2.5rem)",
          fontWeight: 750,
          color: "#B91C1C",
          letterSpacing: "0.01em",
          lineHeight: 1.0,
        }}
      >
        {t("home.welcomeUser", { name: user.name })}
      </h1>

      {/* User Info — values only, no labels */}
      <p
        style={{
          margin: "clamp(0.5vh, 0.8vh, 1vh) 0 0 0",
          padding: 0,
          fontSize: "clamp(1.3rem, 2.25vw, 1.8rem)",
          fontWeight: 500,
          color: "#6B7280",
          letterSpacing: "0.01em",
          lineHeight: 0.5,
        }}
      >
        {user.employeeId} - {user.department}
      </p>
    </div>
  );
};

export default UserWelcome;