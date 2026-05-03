"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { getLessons, deleteLesson, Lesson } from "@/lib/lessons";
import { getCurrentUser, getUserProfile } from "@/lib/auth";

export default function TeacherLessonsPage() {
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
      if (!profile || (profile.role !== "teacher" && profile.role !== "admin")) {
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
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("teacher.myLessons")}</h1>
          <Link
            href="/teacher/lessons/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + {t("teacher.createLesson")}
          </Link>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Уроки пока не созданы</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">#</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    {t("lessons.lesson")}
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    {t("lessons.difficulty")}
                  </th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">
                    {t("common.edit")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.$id} className="border-b last:border-0">
                    <td className="px-6 py-4 text-sm">{lesson.order}</td>
                    <td className="px-6 py-4">
                      {locale === "kk" ? lesson.title_kk : lesson.title_ru}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {t(`lessons.${lesson.difficulty}`)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(lesson.$id)}
                        className="text-red-600 hover:text-red-800 text-sm"
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
