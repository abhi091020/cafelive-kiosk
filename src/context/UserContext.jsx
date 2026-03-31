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

    const normalised = {
      id:           userData.id          ?? "",
      employeeId:   userData.employeeId  ?? userData.id ?? "",
      name:         userData.name        ?? "Employee",
      department:   userData.department  ?? "—",
      shift:        userData.shift       ?? "General",
      canBookGuest: userData.canBookGuest ?? false,
      branchId:     userData.branchId    ?? null,   // ← added
      branchName:   userData.branchName  ?? "",     // ← added
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