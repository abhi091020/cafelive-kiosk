// src/pages/feedback-overall/index.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header, Footer, BackButton } from "@common";
import FeedbackCard from "@components/feedback/FeedbackCard";
import { useUser } from "@context/UserContext";
import { useApp } from "@context/AppContext";
import {
  getOverallFeedbackQuestions,
  getConsumedFoodForFeedback,
  saveOverallFeedback,
} from "@services/api/feedbackAPI";
import { ROUTES } from "@router/AppRouter";

export default function OverallFeedbackPage() {
  const { user } = useUser();
  const { showNotification } = useApp();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [questions, setQuestions] = useState([]);
  const [bookingId, setBookingId] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(""); // ← NEW

  useEffect(() => {
    const load = async () => {
      if (!user?.employeeId) return;

      try {
        setIsFetching(true);
        setFetchError(null);

        const [questionsRes, mealsRes] = await Promise.allSettled([
          getOverallFeedbackQuestions(),
          getConsumedFoodForFeedback(user.employeeId),
        ]);

        if (questionsRes.status === "fulfilled") {
          const data = questionsRes.value;
          if (data.statusCode === "200") {
            setQuestions(data.result ?? []);
          } else {
            setFetchError(data.message || "Failed to load questions.");
          }
        } else {
          setFetchError(
            questionsRes.reason?.serverMessage ||
              "Failed to load questions. Please try again.",
          );
        }

        if (mealsRes.status === "fulfilled") {
          const data = mealsRes.value;
          if (data.statusCode === "200" && data.result?.length > 0) {
            const latest = data.result[data.result.length - 1];
            setBookingId(latest.bookingId);
          } else {
            setBookingId(0);
          }
        } else {
          setBookingId(0);
        }
      } finally {
        setIsFetching(false);
      }
    };

    load();
  }, [user?.employeeId]);

  const handleSubmit = async (ratings) => {
    if (!user?.employeeId) return;

    setSubmitError(""); // clear previous error

    const unrated = questions.filter(
      (q) => (ratings[String(q.feedbackQueId)] ?? 0) === 0,
    );

    if (unrated.length > 0) {
      setSubmitError("Please select all feedback fields!");
      return;
    }

    const feedbackResponseList = Object.entries(ratings)
      .filter(([, star]) => star > 0)
      .map(([queId, star]) => ({
        star,
        empId: Number(user.employeeId),
        questionId: Number(queId),
        bookingId: bookingId ?? 0,
      }));

    try {
      setIsSubmitting(true);
      const result = await saveOverallFeedback(feedbackResponseList);

      if (result?.statusCode !== "200") {
        setSubmitError(result?.message || "Submission failed.");
        return;
      }

      navigate(ROUTES.FEEDBACK_SUCCESS);
    } catch (err) {
      // 409 "Feedback Already Present" and all other errors show inline
      setSubmitError(
        err?.serverMessage || "Failed to submit feedback. Please try again.",
      );
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
        type="overall"
        questions={questions}
        isFetching={isFetching}
        fetchError={fetchError}
        isSubmitting={isSubmitting}
        lang={i18n.language}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.FEEDBACK)}
      />

      {/* ── API Error Message ──────────────────────────────────── */}
      {submitError ? (
        <div
          style={{
            position: "absolute",
            bottom: "clamp(80px, 10vh, 120px)",
            left: "clamp(20px, 5.93vw, 64px)",
            right: "clamp(20px, 5.93vw, 64px)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "clamp(6px, 0.8vw, 12px)",
            padding: "clamp(10px, 1.2vh, 20px) clamp(16px, 2.5vw, 40px)",
            background: "#FFF5F5",
            border: "1px solid rgba(234, 77, 78, 0.3)",
            borderRadius: "clamp(6px, 0.8vw, 12px)",
          }}
        >
          <span
            style={{
              flexShrink: 0,
              fontSize: "clamp(16px, 2vw, 26px)",
              color: "#EA4D4E",
            }}
          >
            ⚠
          </span>
          <span
            style={{
              color: "#EA4D4E",
              fontSize: "clamp(13px, 1.8vw, 22px)",
              fontWeight: 600,
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {submitError}
          </span>
        </div>
      ) : null}

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
