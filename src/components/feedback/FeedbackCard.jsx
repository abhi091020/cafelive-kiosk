// src/components/feedback/FeedbackCard.jsx
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import InfoBox from "./InfoBox";

const FeedbackCard = ({
  type = "food",
  meals = [],
  foodQuestions = [],
  questions = [],
  isFetching = false,
  fetchError = null,
  isSubmitting = false,
  lang = "en",
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const isFood = type === "food";

  const STAR_LEGEND = [
    { key: "poor", label: t("ratings.poor") },
    { key: "average", label: t("ratings.average") },
    { key: "good", label: t("ratings.good") },
    { key: "excellent", label: t("ratings.excellent") },
  ];

  const [selectedMealIdx, setSelectedMealIdx] = useState(0);
  const [allRatings, setAllRatings] = useState({});
  const [validationMsg, setValidationMsg] = useState("");

  const selectedMeal = isFood ? (meals[selectedMealIdx] ?? null) : null;

  const emptyRatings = (qList) =>
    Object.fromEntries(qList.map((q) => [String(q.feedbackQueId), 0]));

  const getMealName = (meal) => {
    if (!meal) return "";
    if (lang === "hi") return meal.menuHindiName;
    if (lang === "mr") return meal.menuMarathiName;
    return meal.menuEnglishName;
  };

  const getMealItems = (meal) => {
    if (!meal) return "";
    if (lang === "hi") return meal.items_hindi_name;
    if (lang === "mr") return meal.items_marathi_name;
    return meal.items_english_name;
  };

  const foodCategories = useMemo(
    () =>
      foodQuestions.map((q) => ({
        key: String(q.feedbackQueId),
        label: q.questions,
      })),
    [foodQuestions],
  );

  const overallCategories = useMemo(
    () =>
      questions.map((q) => ({
        key: String(q.feedbackQueId),
        label: q.questions,
      })),
    [questions],
  );

  const activeCategories = isFood ? foodCategories : overallCategories;

  const currentRatings = useMemo(() => {
    if (isFood) {
      const key = selectedMeal?.bookingId;
      return key != null
        ? (allRatings[key] ?? emptyRatings(foodQuestions))
        : emptyRatings(foodQuestions);
    }
    return allRatings;
  }, [isFood, selectedMeal, allRatings, foodQuestions]);

  const setCurrentRatings = (updaterOrValue) => {
    if (isFood) {
      const bookingId = selectedMeal?.bookingId;
      if (bookingId == null) return;
      setAllRatings((prev) => ({
        ...prev,
        [bookingId]:
          typeof updaterOrValue === "function"
            ? updaterOrValue(prev[bookingId] ?? emptyRatings(foodQuestions))
            : updaterOrValue,
      }));
    } else {
      setAllRatings(updaterOrValue);
    }
  };

  const handleSubmit = () => {
    const activeQuestions = isFood ? foodQuestions : questions;

    if (!activeQuestions || activeQuestions.length === 0) {
      setValidationMsg("Feedback questions not loaded. Please try again.");
      return;
    }

    const unrated = activeQuestions.filter(
      (q) => (currentRatings[String(q.feedbackQueId)] ?? 0) === 0,
    );

    if (unrated.length > 0) {
      setValidationMsg("Please select all feedback fields!");
      return;
    }

    setValidationMsg("");
    if (isFood) {
      onSubmit?.(selectedMeal, currentRatings);
    } else {
      onSubmit?.(allRatings);
    }
  };

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "long",
  });

  const showContent =
    !isFetching &&
    !fetchError &&
    activeCategories.length > 0 &&
    (isFood ? meals.length > 0 : true);

  const renderInlineState = () => {
    let msg = "";
    let color = "#888888";

    if (isFetching) {
      msg = t("general.loading") || "Loading…";
    } else if (fetchError) {
      msg = fetchError;
      color = "#EA4D4E";
    } else if (isFood && meals.length === 0) {
      msg = t("feedback.noMealsFound") || "No meals available for feedback.";
    }

    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(14px, 2vw, 24px)",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 600,
          color,
          padding: "40px",
          textAlign: "center",
        }}
      >
        {msg}
      </div>
    );
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
      {/* ── Title + Star Legend ────────────────────────────────── */}
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
        {/* Poppins 600 for title */}
        <h1
          style={{
            fontSize: "clamp(20px, 3.2vw, 42px)",
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
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
            {isFood
              ? t("feedback.foodFeedback")
              : t("feedback.overallFeedback")}
          </span>
        </h1>

        {/* Star legend — Montserrat 600 */}
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
                  fontWeight: 600,
                  fontFamily: "'Montserrat', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Subtitle ──────────────────────────────────────────── */}
      <div
        style={{
          padding: "0 clamp(16px, 3.5vw, 50px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(4px, 0.5vh, 10px)",
        }}
      >
        {/* Montserrat 600 */}
        <h2
          style={{
            fontSize: "clamp(15px, 2.3vw, 30px)",
            fontWeight: 600,
            fontFamily: "'Montserrat', sans-serif",
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
            fontWeight: 600,
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {isFood
            ? t("feedback.foodFeedbackDesc")
            : t("feedback.overallFeedbackDesc")}
        </p>
        <p
          style={{
            color: "#050404",
            fontSize: "clamp(12px, 1.8vw, 24px)",
            margin: 0,
            fontWeight: 600,
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          • {today}
        </p>
      </div>

      {/* ── Meal Tabs ─────────────────────────────────────────── */}
      {isFood && meals.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "clamp(8px, 1vw, 16px)",
            padding: "0 clamp(16px, 3.5vw, 50px)",
            overflowX: "auto",
            flexShrink: 0,
          }}
        >
          {meals.map((meal, idx) => {
            const isActive = idx === selectedMealIdx;
            return (
              <button
                key={meal.bookingId}
                onClick={() => {
                  setSelectedMealIdx(idx);
                  setValidationMsg("");
                }}
                style={{
                  flexShrink: 0,
                  padding: "clamp(6px, 0.8vh, 14px) clamp(12px, 1.5vw, 24px)",
                  borderRadius: "clamp(4px, 0.5vw, 8px)",
                  border: `2px solid ${isActive ? "#EA4D4E" : "#E0E0E0"}`,
                  background: isActive ? "#FFF0F0" : "#FFFFFF",
                  color: isActive ? "#EA4D4E" : "#666666",
                  fontSize: "clamp(12px, 1.5vw, 18px)",
                  fontWeight: 600,
                  fontFamily: "'Montserrat', sans-serif",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                  transition: "border-color 0.15s ease, background 0.15s ease",
                }}
              >
                {getMealName(meal)}
              </button>
            );
          })}
        </div>
      )}

      {/* ── InfoBox or State Message ───────────────────────────── */}
      {!showContent ? (
        renderInlineState()
      ) : (
        <InfoBox
          categories={activeCategories}
          ratings={currentRatings}
          setRatings={setCurrentRatings}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          mealName={isFood ? getMealName(selectedMeal) : undefined}
          mealItems={isFood ? getMealItems(selectedMeal) : undefined}
          validationMsg={validationMsg}
        />
      )}
    </div>
  );
};

export default FeedbackCard;
