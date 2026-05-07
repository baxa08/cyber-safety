"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { getLessons, getUserProgress, Lesson, Progress } from "@/lib/lessons";
import { getCurrentUser } from "@/lib/auth";

export default function ProgressPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const [lessonsData, progressData] = await Promise.all([
        getLessons(),
        getUserProgress(user.$id),
      ]);
      setLessons(lessonsData);
      setProgress(progressData);
      setLoading(false);
    }
    load();
  }, [router]);

  function getProgressForLesson(lessonId: string) {
    return progress.find((p) => p.lessonId === lessonId);
  }

  const completedCount = progress.filter((p) => p.completed).length;
  const scores = progress.filter((p) => p.score != null).map((p) => p.score!);
  const averageScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("dashboard.myProgress")}</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="font-semibold text-blue-700">{t("dashboard.completedLessons")}</h3>
            <p className="text-3xl font-bold mt-2 text-blue-900">{completedCount} / {lessons.length}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100 shadow-sm">
            <h3 className="font-semibold text-green-700">{t("dashboard.averageScore")}</h3>
            <p className="text-3xl font-bold mt-2 text-green-900">{averageScore}%</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
            <h3 className="font-semibold text-purple-700">{t("common.progress")}</h3>
            <div className="mt-3">
              <div className="w-full bg-purple-200/50 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all"
                  style={{ width: `${lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0}%` }}
                />
              </div>
              <p className="text-sm text-purple-600 mt-1 font-medium">
                {lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Lesson list with progress */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">#</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">{t("lessons.lesson")}</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">{t("tests.score")}</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Статус</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => {
                const p = getProgressForLesson(lesson.$id);
                return (
                  <tr key={lesson.$id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{lesson.order}</td>
                    <td className="px-6 py-4">
                      <Link href={`/lessons/${lesson.$id}`} className="hover:text-blue-600 font-medium transition-colors">
                        {locale === "kk" ? lesson.title_kk : lesson.title_ru}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {p?.score ? `${p.score}%` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      {p?.completed ? (
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                          {t("lessons.completed")}
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-full">
                          Не пройден
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
