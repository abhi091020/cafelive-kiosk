// src/router/AppRouter.jsx

import { lazy, Suspense, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import PropTypes from "prop-types";
import { useUser } from "@context/UserContext";

// ─── Route Constants ──────────────────────────────────────────────────────────

export const ROUTES = {
  LOGIN: "/",
  HOME: "/home",
  STAFF_HOME: "/staff-home",
  MENU: "/menu",
  ORDER_SUCCESS: "/order-success",
  GUEST: "/guest",
  EMPLOYEE_BOOKING: "/employee-booking",
  GUEST_BOOKING: "/guest-booking",
  BULK_BOOKING: "/bulk-booking",
  FEEDBACK: "/feedback",
  FEEDBACK_FOOD: "/feedback/food",
  FEEDBACK_OVERALL: "/feedback/overall",
  FEEDBACK_SUCCESS: "/feedback/success",
};

// ─── Lazy Page Imports ────────────────────────────────────────────────────────

const LoginPage = lazy(() => import("@pages/login"));
const HomePage = lazy(() => import("@pages/home"));
const StaffHomePage = lazy(() => import("@pages/staff-home"));
const MenuPage = lazy(() => import("@pages/menu"));
const OrderSuccessPage = lazy(() => import("@pages/order-success"));
const GuestPage = lazy(() => import("@pages/guest"));

// ── Staff Action Pages ────────────────────────────────────────────────────────
const EmployeeBookingPage = lazy(() => import("@pages/employee-booking"));
const BulkBookingPage = lazy(() => import("@pages/bulk-booking"));

// ── Feedback Pages ────────────────────────────────────────────────────────────
const FeedbackHomePage = lazy(() => import("@pages/feedback"));
const FoodFeedbackPage = lazy(() => import("@pages/feedback-food"));
const OverallFeedbackPage = lazy(() => import("@pages/feedback-overall"));
const FeedbackSuccessPage = lazy(() => import("@pages/feedback-success"));

// ─── Suspense Fallback ────────────────────────────────────────────────────────

const PageLoader = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100vw",
      height: "100vh",
      background: "var(--color-bg-primary, #0f0f0f)",
      color: "var(--color-text-primary, #ffffff)",
      fontSize: "1.25rem",
      letterSpacing: "0.05em",
    }}
  >
    Loading...
  </div>
);

// ─── Protected Route Guard ────────────────────────────────────────────────────

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// ─── Back Button Blocker ──────────────────────────────────────────────────────
// Prevents hardware / browser back from navigating away in kiosk mode.

const BackButtonBlocker = () => {
  useEffect(() => {
    // Push a dummy state so there's always something to "go back to"
    window.history.pushState(null, "", window.location.href);

    const blockBack = () => {
      // Re-push whenever popstate fires — effectively cancels the back action
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, []);

  return null;
};

// ─── Router ───────────────────────────────────────────────────────────────────

const AppRouter = () => {
  return (
    <HashRouter>
      {/* ── Kiosk: block all hardware / browser back navigation ── */}
      <BackButtonBlocker />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public ─────────────────────────────────────────────────── */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />

          {/* ── Employee Home ───────────────────────────────────────────── */}
          <Route
            path={ROUTES.HOME}
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* ── Staff / Canteen Operator Home ───────────────────────────── */}
          <Route
            path={ROUTES.STAFF_HOME}
            element={
              <ProtectedRoute>
                <StaffHomePage />
              </ProtectedRoute>
            }
          />

          {/* ── Staff Action Pages ──────────────────────────────────────── */}
          <Route
            path={ROUTES.EMPLOYEE_BOOKING}
            element={
              <ProtectedRoute>
                <EmployeeBookingPage />
              </ProtectedRoute>
            }
          />

          {/* Guest Booking → Guest List Page */}
          <Route
            path={ROUTES.GUEST_BOOKING}
            element={
              <ProtectedRoute>
                <GuestPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.BULK_BOOKING}
            element={
              <ProtectedRoute>
                <BulkBookingPage />
              </ProtectedRoute>
            }
          />

          {/* ── Guest (direct access) ───────────────────────────────────── */}
          <Route
            path={ROUTES.GUEST}
            element={
              <ProtectedRoute>
                <GuestPage />
              </ProtectedRoute>
            }
          />

          {/* ── Menu & Order ────────────────────────────────────────────── */}
          <Route
            path={ROUTES.MENU}
            element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ORDER_SUCCESS}
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />

          {/* ── Feedback ───────────────────────────────────────────────── */}
          <Route
            path={ROUTES.FEEDBACK}
            element={
              <ProtectedRoute>
                <FeedbackHomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.FEEDBACK_FOOD}
            element={
              <ProtectedRoute>
                <FoodFeedbackPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.FEEDBACK_OVERALL}
            element={
              <ProtectedRoute>
                <OverallFeedbackPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.FEEDBACK_SUCCESS}
            element={
              <ProtectedRoute>
                <FeedbackSuccessPage />
              </ProtectedRoute>
            }
          />

          {/* ── Catch-all ──────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default AppRouter;
