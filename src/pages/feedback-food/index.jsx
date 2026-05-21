// src\pages\feedback-food\index.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header, Footer, BackButton } from "@common";
import FeedbackCard from "@components/feedback/FeedbackCard";
import { useUser } from "@context/UserContext";
import { useApp } from "@context/AppContext";
import {
  getConsumedFoodForFeedback,
  getFoodFeedbackQuestions,
  saveFoodFeedback,
} from "@services/api/feedbackAPI";
import { ROUTES } from "@router/AppRouter";

export default function FoodFeedbackPage() {
  const { user } = useUser();
  const { showNotification } = useApp();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [meals, setMeals] = useState([]);
  const [foodQuestions, setFoodQuestions] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch meals + food questions in parallel ────────────────────────────────
  useEffect(() => {
    const load = async () => {
      if (!user?.employeeId) return;

      try {
        setIsFetching(true);
        setFetchError(null);

        const [mealsRes, questionsRes] = await Promise.allSettled([
          getConsumedFoodForFeedback(user.employeeId),
          getFoodFeedbackQuestions(),
        ]);

        // ── Meals ──
        if (mealsRes.status === "fulfilled") {
          const data = mealsRes.value;
          setMeals(data.statusCode === "200" ? (data.result ?? []) : []);
        } else {
          setFetchError(
            mealsRes.reason?.serverMessage || "Failed to load meals.",
          );
        }

        // ── Food Questions ──
        if (questionsRes.status === "fulfilled") {
          const data = questionsRes.value;
          setFoodQuestions(
            data.statusCode === "200" ? (data.result ?? []) : [],
          );
        } else {
          setFetchError(
            questionsRes.reason?.serverMessage ||
              "Failed to load feedback questions.",
          );
        }
      } finally {
        setIsFetching(false);
      }
    };

    load();
  }, [user?.employeeId]);

  // ── Submit ──────────────────────────────────────────────────────────────────
  // ratings = { "5": 4, "6": 3, "7": 5, "8": 2 }  (feedbackQueId → star)
  const handleSubmit = async (selectedMeal, ratings) => {
    if (!selectedMeal || !user?.employeeId) return;

    // ── Validate: guard against empty questions list ───────────────────────
    if (!foodQuestions || foodQuestions.length === 0) {
      showNotification({
        message: "Feedback questions not loaded. Please try again.",
        type: "error",
      });
      return;
    }

    // ── Validate: every question must have star > 0 ────────────────────────
    const unrated = foodQuestions.filter(
      (q) => (ratings[String(q.feedbackQueId)] ?? 0) === 0,
    );

    if (unrated.length > 0) {
      showNotification({
        message: "Please Select all feedback fields!",
        type: "error",
      });
      return;
    }

    // Build payload
    const feedbackResponseList = Object.entries(ratings)
      .filter(([, star]) => star > 0)
      .map(([queId, star]) => ({
        star,
        empId: Number(user.employeeId),
        menuId: selectedMeal.menuId,
        questionId: Number(queId),
        bookingId: selectedMeal.bookingId,
      }));

    try {
      setIsSubmitting(true);
      const result = await saveFoodFeedback(feedbackResponseList);

      if (result?.statusCode !== "200") {
        showNotification({
          message: result?.message || "Submission failed.",
          type: "error",
        });
        return;
      }

      navigate(ROUTES.FEEDBACK_SUCCESS);
    } catch (err) {
      showNotification({
        message:
          err?.serverMessage || "Failed to submit feedback. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#F9F9F9",
      }}
    >
      <div style={{ position: "relative", zIndex: 3 }}>
        <Header />
        <BackButton to="/home" />
      </div>

      <FeedbackCard
        type="food"
        meals={meals}
        foodQuestions={foodQuestions}
        isFetching={isFetching}
        fetchError={fetchError}
        isSubmitting={isSubmitting}
        lang={i18n.language}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.FEEDBACK)}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 3,
        }}
      >
        <Footer />
      </div>
    </div>
  );
}
