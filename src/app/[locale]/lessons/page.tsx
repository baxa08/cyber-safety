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

  function getTitle(lesson: Lesson) {
    return locale === "kk" ? lesson.title_kk : lesson.title_ru;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("lessons.catalog")}</h1>

        {lessons.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Уроки пока не добавлены</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Link
                key={lesson.$id}
                href={`/lessons/${lesson.$id}`}
                className="bg-white rounded-xl border p-6 hover:shadow-md transition block"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">
                    {categoryIcons[lesson.category] || "📖"}
                  </span>
                  {isCompleted(lesson.$id) && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      {t("lessons.completed")}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{getTitle(lesson)}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>
                    {t(`lessons.${lesson.difficulty}`)}
                  </span>
                  {lesson.duration && (
                    <span>
                      {lesson.duration} {t("lessons.minutes")}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
