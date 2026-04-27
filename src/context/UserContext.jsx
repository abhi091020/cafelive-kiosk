// src/context/UserContext.jsx

import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";

const UserContext = createContext(null);

const INITIAL_USER = null;

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(INITIAL_USER);

  const setUser = useCallback((userData) => {
    if (!userData || typeof userData !== "object") {
      console.error("[UserContext] setUser received invalid data:", userData);
      return;
    }

    const message = userData._message ?? "";

    const isStaff = message === "Valid staff";
    const isContractor = message === "Valid contractor";
    const isEmployee = message === "Valid employee";

    const normalised = isStaff
      ? {
          id: String(userData.canteenStaffId ?? ""),
          employeeId: String(userData.canteenStaffId ?? ""),
          name: userData.staffName ?? "Staff",
          designation: userData.designation ?? "—",
          department: "—",
          shift: "General",
          canBookGuest: false,
          branchId: null,
          branchName: "",
          empCategoryName: "",
          userType: "staff",
        }
      : isContractor
        ? {
            id: String(userData.empId ?? ""),
            employeeId: String(userData.empId ?? ""),
            name: userData.empName ?? "Contractor",
            designation: userData.designation ?? "",
            department: userData.deptName ?? "—",
            shift: userData.shift ?? "General",
            canBookGuest: false,
            branchId: userData.branchId ?? null,
            branchName: userData.branchName ?? "",
            empCategoryName: userData.empCategoryName ?? "",
            userType: "contractor",
          }
        : {
            // isEmployee (default fallback)
            id: String(userData.empId ?? ""),
            employeeId: String(userData.empId ?? ""),
            name: userData.empName ?? "Employee",
            designation: userData.designation ?? "",
            department: userData.deptName ?? "—",
            shift: userData.shift ?? "General",
            canBookGuest: userData.canBookGuest ?? false,
            branchId: userData.branchId ?? null,
            branchName: userData.branchName ?? "",
            empCategoryName: userData.empCategoryName ?? "",
            userType: "employee",
          };

    console.log("[UserContext] normalised user →", normalised);
    setUserState(normalised);
  }, []);

  const clearUser = useCallback(() => {
    sessionStorage.removeItem("cafelive_token");
    setUserState(INITIAL_USER);
  }, []);

  const value = {
    user,
    setUser,
    clearUser,
    isAuthenticated: user !== null,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a <UserProvider>");
  }
  return context;
};

export default UserContext;
