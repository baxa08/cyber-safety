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
  const averageScore = progress.length > 0
    ? Math.round(progress.filter((p) => p.score).reduce((sum, p) => sum + (p.score || 0), 0) / progress.filter((p) => p.score).length) || 0
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">{t("common.appName")}</Link>
          <nav className="flex gap-4">
            <Link href="/lessons" className="text-gray-600 hover:text-gray-900">{t("common.lessons")}</Link>
            <Link href="/progress" className="text-blue-600 font-medium">{t("common.progress")}</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">{t("common.dashboard")}</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("dashboard.myProgress")}</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold text-gray-700">{t("dashboard.completedLessons")}</h3>
            <p className="text-3xl font-bold mt-2">{completedCount} / {lessons.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold text-gray-700">{t("dashboard.averageScore")}</h3>
            <p className="text-3xl font-bold mt-2">{averageScore}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold text-gray-700">{t("common.progress")}</h3>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lesson list with progress */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">#</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">{t("lessons.lesson")}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">{t("tests.score")}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Статус</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => {
                const p = getProgressForLesson(lesson.$id);
                return (
                  <tr key={lesson.$id} className="border-b last:border-0">
                    <td className="px-6 py-4 text-sm">{lesson.order}</td>
                    <td className="px-6 py-4">
                      <Link href={`/lessons/${lesson.$id}`} className="hover:text-blue-600">
                        {locale === "kk" ? lesson.title_kk : lesson.title_ru}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {p?.score ? `${p.score}%` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      {p?.completed ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          {t("lessons.completed")}
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
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
      </main>
    </div>
  );
}
