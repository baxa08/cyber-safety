"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { getCurrentUser, getUserProfile, UserProfile } from "@/lib/auth";
import { getLessons, Lesson } from "@/lib/lessons";
import { Query } from "appwrite";

interface ProgressEntry {
  lessonId: string;
  completed: boolean;
  score?: number;
  completedAt?: string;
}

export default function StudentDetailPage() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const studentUserId = params.id as string;

  const [student, setStudent] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
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
      if (!profile || profile.role !== "teacher") {
        router.push("/lessons");
        return;
      }

      const studentProfile = await getUserProfile(studentUserId);
      if (!studentProfile) {
        router.push("/teacher/students");
        return;
      }
      setStudent(studentProfile);

      const [lessonsData, progressRes] = await Promise.all([
        getLessons(),
        databases.listDocuments(DATABASE_ID, COLLECTIONS.PROGRESS, [
          Query.equal("userId", studentUserId),
          Query.limit(100),
        ]),
      ]);

      setLessons(lessonsData);
      setProgress(
        progressRes.documents.map((d) => ({
          lessonId: d.lessonId as string,
          completed: d.completed as boolean,
          score: d.score as number | undefined,
          completedAt: d.completedAt as string | undefined,
        }))
      );

      setLoading(false);
    }
    load();
  }, [studentUserId, router]);

  function getProgress(lessonId: string) {
    return progress.find((p) => p.lessonId === lessonId);
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(locale === "kk" ? "kk-KZ" : "ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  if (!student) return null;

  const completedCount = progress.filter((p) => p.completed).length;
  const scores = progress.filter((p) => p.score != null).map((p) => p.score!);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/teacher/students" className="text-sm text-gray-500 hover:text-gray-700">
          ← {t("common.back")}
        </Link>

        <div className="bg-white rounded-xl border p-6 mt-4 mb-6">
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <div className="flex gap-6 mt-2 text-sm text-gray-600">
            <span>{student.email}</span>
            {student.class && <span>{t("auth.class")}: {student.class}</span>}
            {student.school && <span>{t("auth.school")}: {student.school}</span>}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">{completedCount} / {lessons.length}</p>
              <p className="text-xs text-blue-600 mt-1">{t("dashboard.completedLessons")}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{avgScore}%</p>
              <p className="text-xs text-green-600 mt-1">{t("dashboard.averageScore")}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-700">{scores.length}</p>
              <p className="text-xs text-purple-600 mt-1">{t("teacher.testsTaken")}</p>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">{t("teacher.lessonProgress")}</h2>
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">#</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">{t("lessons.lesson")}</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">{t("common.progress")}</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">{t("tests.score")}</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">{t("teacher.completedDate")}</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => {
                const p = getProgress(lesson.$id);
                const title = locale === "kk" ? lesson.title_kk : lesson.title_ru;
                return (
                  <tr key={lesson.$id} className="border-b last:border-0">
                    <td className="px-6 py-4 text-sm text-gray-500">{lesson.order}</td>
                    <td className="px-6 py-4">{title}</td>
                    <td className="px-6 py-4 text-center">
                      {p?.completed ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          {t("lessons.completed")}
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                          {t("teacher.notStarted")}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {p?.score != null ? (
                        <span className={`font-medium ${p.score >= 70 ? "text-green-600" : "text-red-600"}`}>
                          {p.score}%
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      {formatDate(p?.completedAt)}
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
