// src/components/common/UserWelcome.jsx

import { useTranslation } from "react-i18next";
import { useUser } from "@context/UserContext";

const UserWelcome = ({ overrideUser = null }) => {
  const { user } = useUser();
  const { t } = useTranslation();

  const displayUser = overrideUser
    ? {
        name: overrideUser.empName ?? overrideUser.staffName ?? "Employee",
        employeeId: String(
          overrideUser.empId ?? overrideUser.canteenStaffId ?? "",
        ),
        designation: overrideUser.designation ?? "",
      }
    : user;

  if (!displayUser) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "clamp(9vh, 11.00vh, 13vh)",
        left: "clamp(90px, 12vw, 140px)",
        zIndex: 10,
      }}
    >
      <h1
        style={{
          margin: 0,
          padding: 0,
          fontSize: "clamp(1.8rem, 3.05vw, 2.5rem)",
          fontWeight: 600,
          color: "#B91C1C",
          letterSpacing: "0.01em",
          lineHeight: 1.0,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {t("home.welcomeUser", { name: displayUser.name })}
      </h1>

      <p
        style={{
          margin: "clamp(0.5vh, 0.8vh, 1vh) 0 0 0",
          padding: 0,
          fontSize: "clamp(1.3rem, 2.25vw, 1.8rem)",
          fontWeight: 400,
          color: "#6B7280",
          letterSpacing: "0.01em",
          lineHeight: 0.5,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {displayUser.enrollId || displayUser.employeeId} -{" "}
        {displayUser.designation}
      </p>
    </div>
  );
};

export default UserWelcome;
