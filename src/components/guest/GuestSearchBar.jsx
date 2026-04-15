// src/components/guest/GuestSearchBar.jsx

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { NumPad } from "@components/shared";

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#999"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const GuestSearchBar = ({
  value,
  onChange,
  showNumPad,
  setShowNumPad,
  onEnter,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);

  const handlePointerDown = (e) => {
    e.currentTarget.style.transform = "scale(0.98)";
    e.currentTarget.style.opacity = "0.9";
    e.currentTarget.style.background = "#CB0000";
  };

  const handlePointerUp = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.background = "#EA4D4E";
  };

  const handlePointerDownCancel = (e) => {
    e.currentTarget.style.transform = "scale(0.98)";
    e.currentTarget.style.opacity = "0.9";
    e.currentTarget.style.background = "#FEE2E2";
  };

  const handlePointerUpCancel = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.background = "transparent";
  };

  return (
    <>
      <div
        className="guest-searchbar-wrapper"
        onClick={() => {
          inputRef.current?.focus();
          setShowNumPad(true);
        }}
      >
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          placeholder={`${t("guest.searchGuestName")}*`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="guest-searchbar-input"
          readOnly
        />
        {value && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              setShowNumPad(false);
            }}
            aria-label={t("general.clear")}
            className="guest-searchbar-clear"
          >
            ×
          </button>
        )}
      </div>

      {showNumPad && (
        <>
          <div className="guest-numpad-actions">
            <button
              className="guest-numpad-submit"
              onClick={() => {
                if (value) onEnter();
              }}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {t("general.submit")}
            </button>
            <button
              className="guest-numpad-cancel"
              onClick={() => {
                onChange("");
                setShowNumPad(false);
              }}
              onPointerDown={handlePointerDownCancel}
              onPointerUp={handlePointerUpCancel}
              onPointerLeave={handlePointerUpCancel}
            >
              {t("general.cancel")}
            </button>
          </div>

          <div className="guest-numpad-wrapper">
            <NumPad
              value={value}
              onChange={onChange}
              onEnter={() => {
                if (value) onEnter();
              }}
            />
          </div>
        </>
      )}

      <style>{`
        .guest-searchbar-wrapper {
          position: absolute;
          top: calc(max(70px, 10vh) + clamp(10px, 1.5vh, 20px));
          left: clamp(100px, 13vw, 180px);
          width: clamp(250px, 70vw, 730px);
          height: clamp(54px, 7vh, 76px);
          display: flex;
          align-items: center;
          gap: clamp(8px, 1vw, 14px);
          background: #FFFFFF;
          border: 1.5px solid rgba(0, 0, 0, 0.12);
          border-radius: clamp(8px, 1vw, 12px);
          padding: 0 clamp(12px, 2vw, 20px);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
          box-sizing: border-box;
          cursor: text;
          transition: border-color 0.2s, box-shadow 0.2s;
          z-index: 10;
        }

        .guest-searchbar-wrapper:focus-within {
          border-color: rgba(234, 77, 78, 0.50);
          box-shadow: 0 2px 16px rgba(234, 77, 78, 0.12);
        }

        .guest-searchbar-input {
          border: none;
          outline: none;
          flex: 1;
          width: 100%;
          box-sizing: border-box;
          font-size: clamp(13px, 1.4vw, 16px);
          color: #333;
          background: transparent;
          font-family: inherit;
          min-width: 0;
          cursor: text;
        }

        .guest-searchbar-input::placeholder { color: #AAAAAA; }

        .guest-searchbar-clear {
          background: none;
          border: none;
          cursor: pointer;
          color: #BBBBBB;
          font-size: clamp(18px, 2vw, 22px);
          line-height: 1;
          padding: 0 2px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          transition: color 0.15s;
        }

        .guest-searchbar-clear:hover { color: #EA4D4E; }

        .guest-numpad-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
        }

        .guest-numpad-actions {
          position: absolute;
          top: calc(50% - clamp(280px, 38vh, 420px));
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          flex-direction: row;
          gap: clamp(10px, 1.5vw, 20px);
          width: clamp(500px, 80vw, 800px);
        }

        .guest-numpad-submit {
          flex: 1;
          padding: clamp(0.6vh, 0.9vh, 1.2vh) 0;
          background: #EA4D4E;
          color: #FFFFFF;
          border: none;
          border-radius: clamp(6px, 0.8vw, 10px);
          font-size: clamp(1.3rem, 2vw, 1.8rem);
          font-weight: 600;
          cursor: pointer;
          outline: none;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.1s ease, opacity 0.1s ease;
          letter-spacing: 0.02em;
        }

        .guest-numpad-cancel {
          flex: 1;
          padding: clamp(0.6vh, 0.9vh, 1.2vh) 0;
          background: transparent;
          color: #EA4D4E;
          border: 2px solid #EA4D4E;
          border-radius: clamp(6px, 0.8vw, 10px);
          font-size: clamp(1.3rem, 2vw, 1.8rem);
          font-weight: 600;
          cursor: pointer;
          outline: none;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.1s ease, opacity 0.1s ease;
          letter-spacing: 0.02em;
        }
      `}</style>
    </>
  );
};

export default GuestSearchBar;
