"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { getLessons, deleteLesson, Lesson } from "@/lib/lessons";
import { getCurrentUser, getUserProfile } from "@/lib/auth";

export default function AdminContentPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const profile = await getUserProfile(user.$id);
      if (!profile || profile.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      const data = await getLessons();
      setLessons(data);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleDelete(id: string) {
    if (!confirm("Удалить урок?")) return;
    await deleteLesson(id);
    setLessons(lessons.filter((l) => l.$id !== id));
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("admin.content")}</h1>
          <Link
            href="/teacher/lessons/create"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            + {t("teacher.createLesson")}
          </Link>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Контент пока не создан</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50/80 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">#</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">{t("lessons.lesson")}</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Категория</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">{t("lessons.difficulty")}</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Действия</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.$id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{lesson.order}</td>
                    <td className="px-6 py-4 font-medium">{locale === "kk" ? lesson.title_kk : lesson.title_ru}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        {lesson.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{t(`lessons.${lesson.difficulty}`)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(lesson.$id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                      >
                        {t("common.delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
