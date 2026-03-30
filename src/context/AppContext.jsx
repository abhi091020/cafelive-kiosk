// src\context\AppContext.jsx

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import PropTypes from "prop-types";

// ─── Constants ────────────────────────────────────────────────────────────────

const NOTIFICATION_AUTO_CLOSE_MS = 4000;

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setErrorState] = useState(null);
  const [notification, setNotificationState] = useState(null);

  const notifTimerRef = useRef(null);

  // ── Loading ───────────────────────────────────────────────────────────────

  /**
   * setLoading — show or hide the fullscreen loading overlay.
   * @param {boolean} isActive
   * @param {string}  [message] - optional label shown under the spinner
   */
  const setLoading = useCallback((isActive, message = "") => {
    setIsLoading(isActive);
    setLoadingMessage(message);
  }, []);

  // ── Error ─────────────────────────────────────────────────────────────────

  /**
   * setError — set a visible error message app-wide.
   * Pass null or empty string to clear.
   * @param {string|null} message
   */
  const setError = useCallback((message) => {
    setErrorState(message || null);
  }, []);

  const clearError = useCallback(() => setErrorState(null), []);

  // ── Notification / Toast ──────────────────────────────────────────────────

  /**
   * showNotification — display a toast notification.
   * Auto-dismisses after NOTIFICATION_AUTO_CLOSE_MS unless persistent=true.
   *
   * @param {Object}  options
   * @param {string}  options.message
   * @param {"success"|"error"|"info"|"warning"} [options.type="info"]
   * @param {boolean} [options.persistent=false]
   */
  const showNotification = useCallback(
    ({ message, type = "info", persistent = false }) => {
      if (notifTimerRef.current) {
        clearTimeout(notifTimerRef.current);
      }

      setNotificationState({ message, type, persistent });

      if (!persistent) {
        notifTimerRef.current = setTimeout(() => {
          setNotificationState(null);
          notifTimerRef.current = null;
        }, NOTIFICATION_AUTO_CLOSE_MS);
      }
    },
    [],
  );

  const clearNotification = useCallback(() => {
    if (notifTimerRef.current) {
      clearTimeout(notifTimerRef.current);
      notifTimerRef.current = null;
    }
    setNotificationState(null);
  }, []);

  // ── Value ─────────────────────────────────────────────────────────────────

  const value = {
    // Loading
    isLoading,
    loadingMessage,
    setLoading,

    // Error
    error,
    setError,
    clearError,

    // Notification
    notification,
    showNotification,
    clearNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useApp — consume AppContext inside any component.
 * Must be used within <AppProvider>.
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an <AppProvider>");
  }
  return context;
};

export default AppContext;
