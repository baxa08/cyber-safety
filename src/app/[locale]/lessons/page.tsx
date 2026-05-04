"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { getLessons, getUserProgress, Lesson, Progress } from "@/lib/lessons";
import { getCurrentUser } from "@/lib/auth";

const categoryIcons: Record<string, string> = {
  passwords: "🔑",
  phishing: "🎣",
  personal_data: "🛡️",
  cyberbullying: "🚫",
  safe_browsing: "🌐",
  social_media: "📱",
  fraud: "⚠️",
  digital_footprint: "👣",
  copyright: "©️",
  vpn: "🔒",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

export default function LessonsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const lessonsData = await getLessons();
        setLessons(lessonsData);

        const user = await getCurrentUser();
        if (user) {
          const progressData = await getUserProgress(user.$id);
          setProgress(progressData);
        }
      } catch (err) {
        console.error("Failed to load lessons:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function isCompleted(lessonId: string) {
    return progress.some((p) => p.lessonId === lessonId && p.completed);
  }

  function getScore(lessonId: string) {
    const p = progress.find((p) => p.lessonId === lessonId && p.score != null);
    return p?.score;
  }

  function getTitle(lesson: Lesson) {
    return locale === "kk" ? lesson.title_kk : lesson.title_ru;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  const completedCount = lessons.filter((l) => isCompleted(l.$id)).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("lessons.catalog")}</h1>
          {lessons.length > 0 && (
            <div className="mt-4 flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / lessons.length) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-500">
                {completedCount} / {lessons.length} {t("lessons.completed").toLowerCase()}
              </span>
            </div>
          )}
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-4xl mb-3">📚</div>
            <p>Уроки пока не добавлены</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lessons.map((lesson) => {
              const completed = isCompleted(lesson.$id);
              const score = getScore(lesson.$id);
              return (
                <Link
                  key={lesson.$id}
                  href={`/lessons/${lesson.$id}`}
                  className={`group relative bg-white rounded-2xl border p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 block ${
                    completed ? "border-green-200 bg-green-50/30" : "border-gray-200"
                  }`}
                >
                  {completed && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {categoryIcons[lesson.category] || "📖"}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-3 leading-snug">{getTitle(lesson)}</h3>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColors[lesson.difficulty]}`}>
                      {t(`lessons.${lesson.difficulty}`)}
                    </span>
                    {lesson.duration && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        {lesson.duration} {t("lessons.minutes")}
                      </span>
                    )}
                    {score != null && (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        score >= 70 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {score}%
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
