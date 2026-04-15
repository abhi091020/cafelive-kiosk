// src/context/UserContext.jsx

import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";

// ─── Context ──────────────────────────────────────────────────────────────────

const UserContext = createContext(null);

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_USER = null;

// ─── Provider ─────────────────────────────────────────────────────────────────

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(INITIAL_USER);

  /**
   * setUser — populate session after successful card / QR scan.
   *
   * Expected shape from Java backend /user/scan/:cardId :
   * {
   *   id:           string,
   *   employeeId:   string,
   *   name:         string,
   *   department:   string,
   *   shift:        string,     // "Morning" | "Evening" | "Night"
   *   canBookGuest: boolean,
   *   branchId:     number,     // used to filter menu by branch
   *   branchName:   string,     // e.g. "Mumbai"
   * }
   *
   * @param {Object} userData - Raw response from userAPI.scanCard()
   */
  const setUser = useCallback((userData) => {
    if (!userData || typeof userData !== "object") {
      console.error("[UserContext] setUser received invalid data:", userData);
      return;
    }

    // ── Staff response: { canteenStaffId, staffName }
    const isStaff = !!userData.canteenStaffId;

    const normalised = isStaff
      ? {
          id: String(userData.canteenStaffId),
          employeeId: String(userData.canteenStaffId),
          name: userData.staffName ?? "Staff",
          department: "—",
          shift: "General",
          canBookGuest: false,
          branchId: null,
          branchName: "",
          empCategoryName: "", // falsy → login routes to STAFF_HOME
          userType: "staff",
        }
      : {
          id: String(userData.empId ?? ""),
          employeeId: String(userData.empId ?? ""),
          name: userData.empName ?? "Employee",
          department: userData.deptName ?? "—",
          shift: userData.shift ?? "General",
          canBookGuest: userData.canBookGuest ?? false,
          branchId: userData.branchId ?? null,
          branchName: userData.branchName ?? "",
          empCategoryName: userData.empCategoryName ?? "",
          employmentType: userData.employmentType ?? "", // "OnRoll" | "OnContract"
          userType:
            userData.employmentType === "OnContract"
              ? "contractor"
              : "employee",
        };

    setUserState(normalised);
  }, []);

  /**
   * clearUser — wipe the session entirely.
   * Called on: logout, idle timeout, session expiry.
   */
  const clearUser = useCallback(() => {
    setUserState(INITIAL_USER);
  }, []);

  // ── Value ─────────────────────────────────────────────────────────────────

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

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useUser — consume UserContext inside any component.
 * Must be used within <UserProvider>.
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a <UserProvider>");
  }
  return context;
};

export default UserContext;
