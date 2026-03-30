// src/pages/menu/index.jsx

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Header,
  Footer,
  UserWelcome,
  DateTimeDisplay,
  ConfirmDialog,
  BackButton,
} from "@common";
import { BookOrderCard } from "@components/menu";
import { useNavigate } from "react-router-dom";
import { useUser } from "@context/UserContext";
import { useTranslation } from "react-i18next";
import usePrint from "@hooks/usePrint";
import { createAndPrintTicket } from "@services/print/printService";

// ─── Icons ────────────────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="#CB0000">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const CartIcon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="3"
      y1="6"
      x2="21"
      y2="6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 10a4 4 0 01-8 0"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

// ─── MenuPage ─────────────────────────────────────────────────────────────────
const MenuPage = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const { user } = useUser();
  const { print } = usePrint();
  const { t } = useTranslation();

  const [selectedItems, setSelectedItems] = useState([]);
  const [shift, setShift] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showShiftAlert, setShowShiftAlert] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);

  const selectedItemIds = useMemo(
    () => new Set(selectedItems.map((i) => i.id)),
    [selectedItems],
  );

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

  const handleItemToggle = (item) =>
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      return exists
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, { ...item, quantity: 1 }];
    });

  const handleIncrement = (itemId) =>
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );

  const handleDecrement = (itemId) =>
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i,
      ),
    );

  const handleDelete = (itemId) =>
    setSelectedItems((prev) => prev.filter((i) => i.id !== itemId));

  const isEnabled = selectedItems.length > 0;
  const activeGradient = "linear-gradient(90deg, #EA4D4E 0%, #B91C1C 100%)";

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
    setShowDialog(false);
    await createAndPrintTicket({ user, items: selectedItems, shift, print });
    setTimeout(() => {
      navigate("/order-success", { state: { items: selectedItems, shift } });
    }, 150);
  };

  const DOT_COUNT = Math.min(selectedItems.length, 5);
  const activeDot = Math.round(scrollRatio * (DOT_COUNT - 1));

  const CARD_BOTTOM_PCT = "57%";
  const FOOTER_TOP_PCT = "86%";
  const PANEL_H_PAD = "5.65%";
  const BUTTON_HEIGHT = "clamp(60px, 8vh, 100px)";
  const BUTTON_RADIUS = "clamp(10px, 1.2vw, 16px)";

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
        .order-scroll::-webkit-scrollbar { width: 10px; }
        .order-scroll::-webkit-scrollbar-track { background: #F3F4F6; border-radius: 10px; }
        .order-scroll::-webkit-scrollbar-thumb { background: #EA4D4E; border-radius: 10px; }
      `}</style>

      <Header />
      <BackButton to="/home" />
      <UserWelcome />
      <DateTimeDisplay />

      <BookOrderCard
        selectedItemIds={selectedItemIds}
        onItemToggle={handleItemToggle}
        shift={shift}
        onShiftChange={setShift}
      />

      {/* ── Bottom panel ─────────────────────────────────────────────────── */}
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
                gap: "10px",
                flexShrink: 0,
              }}
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
                {selectedItems.length === 1 ? t("menu.item") : t("menu.items")}
              </div>
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
                className="order-scroll"
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
                  <div
                    key={item.id}
                    style={{
                      background: "#F9F9F9",
                      borderRadius: "10px",
                      minHeight: "72px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 16px",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.25rem",
                        color: "#050404",
                        fontWeight: 500,
                        flex: 1,
                      }}
                    >
                      {item.name}
                    </span>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <button
                        onClick={() => handleDecrement(item.id)}
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          border: "none",
                          backgroundColor: "#079A3F",
                          color: "#fff",
                          fontSize: "1.6rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          lineHeight: 1,
                        }}
                      >
                        −
                      </button>

                      <span
                        style={{
                          minWidth: "32px",
                          textAlign: "center",
                          fontSize: "1.35rem",
                          fontWeight: 700,
                          color: "#050404",
                        }}
                      >
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => handleIncrement(item.id)}
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          border: "none",
                          backgroundColor: "#EA4D4E",
                          color: "#fff",
                          fontSize: "1.6rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          lineHeight: 1,
                        }}
                      >
                        +
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "6px",
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "10px",
                        }}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
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
                      lineHeight: 1,
                    }}
                  >
                    ↓
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Book Meal button ──────────────────────────────────────────── */}
        <button
          onClick={handleBookMeal}
          disabled={!isEnabled}
          style={{
            width: "100%",
            height: BUTTON_HEIGHT,
            borderRadius: BUTTON_RADIUS,
            flexShrink: 0,
            background: isEnabled ? activeGradient : "#E5E7EB",
            border: "none",
            cursor: isEnabled ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow: isEnabled ? "0 4px 18px rgba(234,77,78,0.35)" : "none",
            transition: "background 0.2s, transform 0.1s",
            marginTop: isEnabled ? 0 : "auto",
          }}
          onMouseDown={(e) => {
            if (isEnabled) {
              e.currentTarget.style.transform = "scale(0.98)";
              e.currentTarget.style.background = "#CB0000";
            }
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = isEnabled
              ? activeGradient
              : "#E5E7EB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = isEnabled
              ? activeGradient
              : "#E5E7EB";
          }}
        >
          <CartIcon color={isEnabled ? "#fff" : "#9CA3AF"} />
          <span
            style={{
              color: isEnabled ? "#FFFFFF" : "#9CA3AF",
              fontSize: "2rem",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            {isEnabled ? t("menu.bookMeal") : t("menu.selectItemToBook")}
          </span>
        </button>
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
    </div>
  );
};

export default MenuPage;