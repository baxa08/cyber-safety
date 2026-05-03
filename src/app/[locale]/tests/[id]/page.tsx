"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { saveProgress, TestQuestion } from "@/lib/lessons";
import { getCurrentUser, getUserProfile } from "@/lib/auth";

export default function TestPage() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [lessonId, setLessonId] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const user = await getCurrentUser();
        if (user) {
          const profile = await getUserProfile(user.$id);
          if (profile?.role === "admin") {
            setIsAdmin(true);
            setLoading(false);
            return;
          }
        }

        const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.TESTS, testId);
        const parsed: TestQuestion[] = JSON.parse(doc.questions as string);
        setQuestions(parsed);
        setLessonId(doc.lessonId as string);
        setPassingScore(doc.passingScore as number);
        setAnswers(new Array(parsed.length).fill(-1));
      } catch (err) {
        console.error("Failed to load test:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [testId]);

  function selectAnswer(index: number) {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
  }

  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  }

  function prevQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }

  async function finishTest() {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) {
        correct++;
      }
    });

    const percentage = Math.round((correct / questions.length) * 100);
    setScore(percentage);
    setShowResult(true);

    const user = await getCurrentUser();
    if (user) {
      await saveProgress({
        userId: user.$id,
        lessonId,
        completed: true,
        score: percentage,
        completedAt: new Date().toISOString(),
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold mb-2">{t("tests.adminRestricted")}</h2>
          <p className="text-gray-600 mb-6">{t("tests.adminRestrictedDesc")}</p>
          <Link
            href="/lessons"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {t("common.lessons")}
          </Link>
        </div>
      </div>
    );
  }

  if (showResult) {
    const passed = score >= passingScore;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border p-8 max-w-md w-full text-center">
          <div className={`text-6xl mb-4 ${passed ? "text-green-500" : "text-red-500"}`}>
            {passed ? "✓" : "✗"}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {passed ? t("tests.passed") : t("tests.failed")}
          </h2>
          <p className="text-gray-600 mb-4">
            {t("tests.score")}: {score}%
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {t("tests.passingScore")}: {passingScore}%
          </p>
          <div className="flex gap-3 justify-center">
            {!passed && (
              <button
                onClick={() => {
                  setShowResult(false);
                  setCurrentQuestion(0);
                  setAnswers(new Array(questions.length).fill(-1));
                }}
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
              >
                {t("tests.tryAgain")}
              </button>
            )}
            <Link
              href="/lessons"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              {t("common.lessons")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const questionText = locale === "kk" ? question.question_kk : question.question_ru;
  const options = locale === "kk" ? question.options_kk : question.options_ru;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            {t("common.appName")}
          </Link>
          <span className="text-sm text-gray-500">
            {t("tests.question")} {currentQuestion + 1} {t("tests.of")} {questions.length}
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-xl border p-8">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          <h2 className="text-xl font-semibold mb-6">{questionText}</h2>

          <div className="space-y-3 mb-8">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border transition ${
                  answers[currentQuestion] === index
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="text-gray-600 hover:text-gray-900 disabled:opacity-30"
            >
              ← {t("common.back")}
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={finishTest}
                disabled={answers.includes(-1)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {t("tests.finish")}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                {t("common.next")} →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
