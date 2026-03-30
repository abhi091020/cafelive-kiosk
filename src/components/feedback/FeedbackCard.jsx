// src/components/feedback/FeedbackCard.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@router/AppRouter";
import InfoBox from "./InfoBox";

/**
 * FeedbackCard
 * ────────────
 * type="food"    → meal section + food categories
 * type="overall" → overall categories
 */

const FeedbackCard = ({
  type = "food",
  mealName = "Special Meal",
  mealItems = "( vegetable sweet corn, padwal chana, dudhi kofta, steamed, dal tadka, chapati, gulab jamun )",
  date = "09 Mar 2026 Monday",
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isFood = type === "food";

  // ── Translated constants (inside component so t() is available) ──────────
  const STAR_LEGEND = [
    { key: "poor",      label: t("ratings.poor") },
    { key: "average",   label: t("ratings.average") },
    { key: "good",      label: t("ratings.good") },
    { key: "excellent", label: t("ratings.excellent") },
  ];

  const FOOD_CATEGORIES = [
    { key: "taste",       label: t("feedback.taste") },
    { key: "freshness",   label: t("feedback.freshness") },
    { key: "portionSize", label: t("feedback.portionSize") },
    { key: "appearance",  label: t("feedback.appearance") },
  ];

  const OVERALL_CATEGORIES = [
    { key: "canteenCleanliness",  label: t("feedback.canteenCleanliness") },
    { key: "staffBehaviours",     label: t("feedback.staffBehaviours") },
    { key: "speedOfService",      label: t("feedback.speedOfService") },
    { key: "qualityOfFacilities", label: t("feedback.qualityOfFacilities") },
  ];
  // ─────────────────────────────────────────────────────────────────────────

  const categories = isFood ? FOOD_CATEGORIES : OVERALL_CATEGORIES;

  const [ratings, setRatings] = useState(() =>
    Object.fromEntries(categories.map(({ key }) => [key, 0]))
  );

  const handleSubmit = () => {
    console.log(`[FeedbackCard] ${type} submitted:`, ratings);
    navigate(ROUTES.FEEDBACK_SUCCESS);
  };

  const handleCancel = () => {
    navigate(ROUTES.FEEDBACK);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "clamp(20px, 5.93vw, 64px)",
        top: "clamp(140px, 18vh, 280px)",
        right: "clamp(20px, 5.93vw, 64px)",
        bottom: "clamp(60px, 8vh, 100px)",
        borderRadius: "clamp(6px, 0.93vw, 12px)",
        background: "#F9F9F9",
        boxShadow: "2px 2px 27.8px rgba(0, 0, 0, 0.15)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(10px, 1.5vh, 24px)",
        padding: "clamp(16px, 2vh, 36px) 0 clamp(16px, 2vh, 36px)",
      }}
    >
      {/* ── Top Row: Title + Star Legend ──────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "0 clamp(16px, 3.5vw, 50px)",
          flexWrap: "wrap",
          gap: "clamp(8px, 1vw, 16px)",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(20px, 3.2vw, 42px)",
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.2,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              background: "linear-gradient(to right, #860606, #EA4D4E)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {isFood ? t("feedback.foodFeedback") : t("feedback.overallFeedback")}
          </span>
        </h1>

        {/* Star Legend */}
        <div
          style={{
            display: "flex",
            gap: "clamp(12px, 2.5vw, 40px)",
            alignItems: "center",
          }}
        >
          {STAR_LEGEND.map(({ key, label }) => (
            <div
              key={key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "clamp(2px, 0.3vh, 6px)",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(1.6rem, 3vw, 3.8rem)",
                  color: "#FFC335",
                  lineHeight: 1,
                }}
              >
                ★
              </span>
              <span
                style={{
                  fontSize: "clamp(10px, 1.1vw, 14px)",
                  color: "#888888",
                  fontWeight: 400,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Subtitle Block ────────────────────────────────────── */}
      <div
        style={{
          padding: "0 clamp(16px, 3.5vw, 50px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(4px, 0.5vh, 10px)",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(15px, 2.3vw, 30px)",
            fontWeight: 700,
            color: "#570000",
            margin: 0,
          }}
        >
          {isFood ? t("feedback.rateYourMeal") : t("feedback.rateCanteen")}
        </h2>
        <p
          style={{
            color: "#050404",
            fontSize: "clamp(13px, 2vw, 26px)",
            margin: 0,
            fontWeight: 400,
          }}
        >
          {isFood ? t("feedback.foodFeedbackDesc") : t("feedback.overallFeedbackDesc")}
        </p>
        <p
          style={{
            color: "#050404",
            fontSize: "clamp(12px, 1.8vw, 24px)",
            margin: 0,
            fontWeight: 500,
          }}
        >
          • {date}
        </p>
      </div>

      {/* ── InfoBox ───────────────────────────────────────────── */}
      <InfoBox
        categories={categories}
        ratings={ratings}
        setRatings={setRatings}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        mealName={isFood ? mealName : undefined}
        mealItems={isFood ? mealItems : undefined}
      />
    </div>
  );
};

export default FeedbackCard;