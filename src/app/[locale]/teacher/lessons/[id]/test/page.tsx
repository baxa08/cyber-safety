"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import { getLesson, getTestByLessonId, createTest, updateTest, Lesson, TestQuestion } from "@/lib/lessons";
import { getCurrentUser, getUserProfile } from "@/lib/auth";

interface QuestionForm {
  question_ru: string;
  question_kk: string;
  options_ru: [string, string, string, string];
  options_kk: [string, string, string, string];
  correctIndex: number;
}

const emptyQuestion: QuestionForm = {
  question_ru: "",
  question_kk: "",
  options_ru: ["", "", "", ""],
  options_kk: ["", "", "", ""],
  correctIndex: 0,
};

export default function CreateTestPage() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [questions, setQuestions] = useState<QuestionForm[]>([{ ...emptyQuestion }]);
  const [passingScore, setPassingScore] = useState(70);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [existingTestId, setExistingTestId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const profile = await getUserProfile(user.$id);
      if (!profile || profile.role !== "admin") {
        router.push("/lessons");
        return;
      }

      try {
        const lessonData = await getLesson(lessonId);
        setLesson(lessonData);

        const existingTest = await getTestByLessonId(lessonId);
        if (existingTest) {
          setExistingTestId(existingTest.$id);
          setPassingScore(existingTest.passingScore);
          const parsed: TestQuestion[] = JSON.parse(existingTest.questions);
          setQuestions(
            parsed.map((q) => ({
              question_ru: q.question_ru,
              question_kk: q.question_kk,
              options_ru: q.options_ru as [string, string, string, string],
              options_kk: q.options_kk as [string, string, string, string],
              correctIndex: q.correctIndex,
            }))
          );
        }
      } catch {
        setError("Ошибка загрузки урока");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [lessonId, router]);

  function addQuestion() {
    setQuestions([...questions, { ...emptyQuestion, options_ru: ["", "", "", ""], options_kk: ["", "", "", ""] }]);
  }

  function removeQuestion(index: number) {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  }

  function updateQuestion(index: number, field: keyof QuestionForm, value: string | number) {
    const updated = [...questions];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  }

  function updateOption(qIndex: number, lang: "ru" | "kk", optIndex: number, value: string) {
    const updated = [...questions];
    if (lang === "ru") {
      updated[qIndex].options_ru[optIndex] = value;
    } else {
      updated[qIndex].options_kk[optIndex] = value;
    }
    setQuestions(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_ru || !q.question_kk) {
        setError(`Вопрос ${i + 1}: заполните текст вопроса на обоих языках`);
        return;
      }
      if (q.options_ru.some((o) => !o) || q.options_kk.some((o) => !o)) {
        setError(`Вопрос ${i + 1}: заполните все варианты ответов`);
        return;
      }
    }

    setSaving(true);

    try {
      const testQuestions: TestQuestion[] = questions.map((q, i) => ({
        id: `q${i + 1}`,
        question_ru: q.question_ru,
        question_kk: q.question_kk,
        options_ru: q.options_ru,
        options_kk: q.options_kk,
        correctIndex: q.correctIndex,
      }));

      const testData = {
        lessonId,
        title_ru: lesson ? `Тест: ${lesson.title_ru}` : "Тест",
        title_kk: lesson ? `Тест: ${lesson.title_kk}` : "Тест",
        questions: JSON.stringify(testQuestions),
        passingScore,
      };

      if (existingTestId) {
        await updateTest(existingTestId, testData);
      } else {
        await createTest(testData);
      }

      router.push("/teacher/lessons");
    } catch {
      setError("Ошибка сохранения теста");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  const title = lesson
    ? locale === "kk"
      ? lesson.title_kk
      : lesson.title_ru
    : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/teacher/lessons" className="text-sm text-gray-500 hover:text-gray-700">
              ← {t("common.back")}
            </Link>
            <h1 className="text-2xl font-bold mt-1">
              {existingTestId ? t("teacher.editTest") : t("teacher.createTest")}
            </h1>
            <p className="text-gray-600 text-sm mt-1">{title}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("tests.passingScore")} (%)
            </label>
            <input
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(parseInt(e.target.value))}
              min={1}
              max={100}
              className="w-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  {t("tests.question")} {qIndex + 1}
                </h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    {t("common.delete")}
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Вопрос (русский)</label>
                  <textarea
                    value={q.question_ru}
                    onChange={(e) => updateQuestion(qIndex, "question_ru", e.target.value)}
                    required
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Сұрақ (қазақша)</label>
                  <textarea
                    value={q.question_kk}
                    onChange={(e) => updateQuestion(qIndex, "question_kk", e.target.value)}
                    required
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {[0, 1, 2, 3].map((optIndex) => (
                  <div key={optIndex} className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => updateQuestion(qIndex, "correctIndex", optIndex)}
                      className={`mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        q.correctIndex === optIndex
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {q.correctIndex === optIndex && "✓"}
                    </button>
                    <div className="flex-1 grid md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={q.options_ru[optIndex]}
                        onChange={(e) => updateOption(qIndex, "ru", optIndex, e.target.value)}
                        required
                        placeholder={`Вариант ${optIndex + 1} (рус)`}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={q.options_kk[optIndex]}
                        onChange={(e) => updateOption(qIndex, "kk", optIndex, e.target.value)}
                        required
                        placeholder={`Нұсқа ${optIndex + 1} (қаз)`}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {t("teacher.clickCorrect")}
              </p>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition"
          >
            + {t("teacher.addQuestion")}
          </button>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? t("common.loading") : t("common.save")}
          </button>
        </form>
      </div>
    </div>
  );
}
