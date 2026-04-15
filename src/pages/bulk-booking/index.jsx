// src/pages/bulk-booking/index.jsx

import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Header,
  Footer,
  UserWelcome,
  DateTimeDisplay,
  ConfirmDialog,
  BackButton,
} from "@common";
import { BookOrderCard } from "@components/menu";
import { BulkOrderItem, BulkOrderActions } from "@components/bulk-booking";
import { useUser } from "@context/UserContext";
import { useTranslation } from "react-i18next";
import usePrint from "@hooks/usePrint";
import { createAndPrintTicket } from "@services/print/printService";
import { bookBulkOrder } from "@services/api/orderAPI";

// ─── Animations ───────────────────────────────────────────────────────────────

const bounceStyle = `
  @keyframes bounceDown {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(6px); }
  }
  @keyframes shakeX {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px); }
  }
`;

// ─── Shift Alert Dialog ───────────────────────────────────────────────────────

const ShiftAlertDialog = ({ visible, onClose }) => {
  const { t } = useTranslation();
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "40px 48px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          minWidth: "380px",
          animation: "shakeX 0.4s ease",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#FEF2F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="#B91C1C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#050404",
            textAlign: "center",
          }}
        >
          {t("shift.pleaseSelectShift")}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "1rem",
            color: "#6B7280",
            textAlign: "center",
          }}
        >
          {t("shift.mustSelectShift")}
        </p>
        <button
          onClick={onClose}
          style={{
            marginTop: "8px",
            padding: "12px 40px",
            background: "linear-gradient(90deg, #EA4D4E 0%, #B91C1C 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "1.05rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(234,77,78,0.35)",
          }}
        >
          {t("shift.okGotIt")}
        </button>
      </div>
    </div>
  );
};

// ─── Booking Error Dialog ─────────────────────────────────────────────────────

const BookingErrorDialog = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "40px 48px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          minWidth: "420px",
          maxWidth: "560px",
          animation: "shakeX 0.4s ease",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#FEF2F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="#B91C1C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#050404",
            textAlign: "center",
          }}
        >
          Booking Failed
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "1.05rem",
            color: "#6B7280",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          style={{
            marginTop: "8px",
            padding: "12px 40px",
            background: "linear-gradient(90deg, #EA4D4E 0%, #B91C1C 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "1.05rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(234,77,78,0.35)",
          }}
        >
          OK, Got It
        </button>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const BulkBookingPage = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const bookingLockRef = useRef(false); // ← prevent duplicate submissions
  const { user } = useUser();
  const { print } = usePrint();
  const { t } = useTranslation();

  const [shift, setShift] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showShiftAlert, setShowShiftAlert] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // ── Scroll indicator ────────────────────────────────────────────────────────
  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollable = el.scrollHeight - el.clientHeight;
    setCanScrollDown(el.scrollTop < scrollable - 2);
    setScrollRatio(scrollable > 0 ? el.scrollTop / scrollable : 0);
  };

  useEffect(() => {
    updateScroll();
  }, [selectedItems]);

  // ── Item handlers ───────────────────────────────────────────────────────────
  const selectedItemIds = useMemo(
    () => new Set(selectedItems.map((i) => i.id)),
    [selectedItems],
  );

  const handleShiftChange = (newShift) => {
    setShift(newShift);
    setSelectedItems([]);
  };

  const handleItemToggle = (item) =>
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      return exists
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, { ...item, quantity: 1 }];
    });

  const handleQtyChange = (itemId, val) =>
    setSelectedItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: val } : i)),
    );

  const handleDelete = (itemId) =>
    setSelectedItems((prev) => prev.filter((i) => i.id !== itemId));

  // ── Booking ─────────────────────────────────────────────────────────────────
  const isEnabled = selectedItems.length > 0;

  const handleBookMeal = () => {
    if (!isEnabled) return;
    if (!shift) {
      setShowShiftAlert(true);
      return;
    }
    setShowDialog(true);
  };

  const handleDialogYes = () => setShowDialog(false);

  const handleDialogNo = async () => {
    // ── prevent duplicate submissions ──────────────────────────────────────
    if (bookingLockRef.current) return;
    bookingLockRef.current = true;

    setShowDialog(false);
    setIsBooking(true);
    setBookingError(null);

    let bookingResult = null;

    try {
      const response = await bookBulkOrder({
        empId: user.id,
        shiftId: shift.shiftId,
        deviceId: 1,
        items: selectedItems.map((i) => ({
          menuId: i.menuId,
          quantity: i.quantity,
        })),
      });

      // ── capture result for QR display ──────────────────────────────────
      bookingResult = response.result;

      await createAndPrintTicket({
        user,
        items: selectedItems,
        shift: shift.shiftName,
        print,
      });

      navigate("/order-success", {
        state: {
          items: selectedItems,
          shift: shift.shiftName,
          bookingResult, // ← pass QR data to order-success page
        },
      });
    } catch (err) {
      console.error("[BulkBooking] bookBulkOrder failed:", err);
      setBookingError(
        err?.serverMessage ??
          err?.message ??
          "Booking failed. Please try again.",
      );
      bookingLockRef.current = false; // release lock so user can retry
    } finally {
      setIsBooking(false);
    }
  };

  // ── Scroll dots ─────────────────────────────────────────────────────────────
  const DOT_COUNT = Math.min(selectedItems.length, 5);
  const activeDot = Math.round(scrollRatio * (DOT_COUNT - 1));

  const CARD_BOTTOM_PCT = "61.35%";
  const FOOTER_TOP_PCT = "86%";
  const PANEL_H_PAD = "5.65%";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#FFFFFF",
      }}
    >
      <style>{bounceStyle}</style>
      <style>{`
        .bulk-order-scroll::-webkit-scrollbar { width: 10px; }
        .bulk-order-scroll::-webkit-scrollbar-track { background: #F3F4F6; border-radius: 10px; }
        .bulk-order-scroll::-webkit-scrollbar-thumb { background: #EA4D4E; border-radius: 10px; }
      `}</style>

      <Header />
      <BackButton to="/staff-home" />
      <UserWelcome />
      <DateTimeDisplay />

      <BookOrderCard
        selectedItemIds={selectedItemIds}
        onItemToggle={handleItemToggle}
        shift={shift}
        onShiftChange={handleShiftChange}
      />

      {/* ── Selected items + Book button ──────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: CARD_BOTTOM_PCT,
          bottom: `calc(100% - ${FOOTER_TOP_PCT})`,
          left: PANEL_H_PAD,
          right: PANEL_H_PAD,
          zIndex: 15,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          paddingTop: "1.5vh",
        }}
      >
        {isEnabled && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "#050404",
                  }}
                >
                  {t("menu.myOrder")}
                </p>
                <div
                  style={{
                    background: "#EA4D4E",
                    color: "#fff",
                    borderRadius: "20px",
                    padding: "2px 12px",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                  }}
                >
                  {selectedItems.length}{" "}
                  {selectedItems.length === 1
                    ? t("menu.item")
                    : t("menu.items")}
                </div>
              </div>
              <span
                style={{
                  fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
                  fontWeight: 700,
                  color: "#EA4D4E",
                }}
              >
                {t("menu.enterQty")}
              </span>
            </div>

            <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
              {DOT_COUNT > 1 && (
                <div
                  style={{
                    position: "absolute",
                    right: "-18px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    zIndex: 5,
                  }}
                >
                  {Array.from({ length: DOT_COUNT }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: i === activeDot ? "8px" : "6px",
                        height: i === activeDot ? "8px" : "6px",
                        borderRadius: "50%",
                        background: i === activeDot ? "#EA4D4E" : "#D1D5DB",
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </div>
              )}

              <div
                ref={scrollRef}
                className="bulk-order-scroll"
                onScroll={updateScroll}
                style={{
                  height: "100%",
                  overflowY: "auto",
                  overflowX: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  paddingRight: "4px",
                }}
              >
                {selectedItems.map((item) => (
                  <BulkOrderItem
                    key={item.id}
                    item={item}
                    onDelete={handleDelete}
                    onQtyChange={handleQtyChange}
                  />
                ))}
              </div>

              {canScrollDown && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "70px",
                    background:
                      "linear-gradient(to bottom, transparent, rgba(255,255,255,0.97))",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingBottom: "4px",
                    pointerEvents: "none",
                    zIndex: 4,
                  }}
                >
                  <div
                    style={{
                      animation: "bounceDown 1.2s ease-in-out infinite",
                      color: "#EA4D4E",
                      fontSize: "1.3rem",
                    }}
                  >
                    ↓
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <BulkOrderActions
          isEnabled={isEnabled && !isBooking}
          onClick={handleBookMeal}
        />
      </div>

      <Footer />

      <ConfirmDialog
        visible={showDialog}
        message={t("menu.addMoreMessage")}
        yesLabel={t("general.yes")}
        noLabel={t("general.no")}
        onYes={handleDialogYes}
        onNo={handleDialogNo}
      />

      <ShiftAlertDialog
        visible={showShiftAlert}
        onClose={() => setShowShiftAlert(false)}
      />

      <BookingErrorDialog
        message={bookingError}
        onClose={() => setBookingError(null)}
      />
    </div>
  );
};

export default BulkBookingPage;
