"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { getCurrentUser, getUserProfile } from "@/lib/auth";
import { Query } from "appwrite";

interface Stats {
  totalUsers: number;
  students: number;
  teachers: number;
  totalLessons: number;
  totalProgress: number;
  completionRate: number;
  averageScore: number;
}

export default function AdminStatsPage() {
  const t = useTranslations();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
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

      const [usersRes, lessonsRes, progressRes] = await Promise.all([
        databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [Query.limit(1000)]),
        databases.listDocuments(DATABASE_ID, COLLECTIONS.LESSONS, [Query.limit(1000)]),
        databases.listDocuments(DATABASE_ID, COLLECTIONS.PROGRESS, [Query.limit(1000)]),
      ]);

      const students = usersRes.documents.filter((u) => u.role === "student").length;
      const teachers = usersRes.documents.filter((u) => u.role === "teacher").length;
      const completed = progressRes.documents.filter((p) => p.completed).length;
      const scores = progressRes.documents.filter((p) => p.score).map((p) => p.score as number);
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

      setStats({
        totalUsers: usersRes.total,
        students,
        teachers,
        totalLessons: lessonsRes.total,
        totalProgress: progressRes.total,
        completionRate: lessonsRes.total > 0 && students > 0
          ? Math.round((completed / (lessonsRes.total * students)) * 100)
          : 0,
        averageScore: avg,
      });
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">{t("common.appName")}</Link>
          <nav className="flex gap-4">
            <Link href="/admin/users" className="text-gray-600 hover:text-gray-900">{t("admin.users")}</Link>
            <Link href="/admin/content" className="text-gray-600 hover:text-gray-900">{t("admin.content")}</Link>
            <Link href="/admin/stats" className="text-blue-600 font-medium">{t("admin.statistics")}</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("admin.statistics")}</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="text-sm font-medium text-gray-500">{t("admin.totalUsers")}</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="text-sm font-medium text-gray-500">{t("auth.roleStudent")}</h3>
            <p className="text-3xl font-bold mt-2">{stats.students}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="text-sm font-medium text-gray-500">{t("auth.roleTeacher")}</h3>
            <p className="text-3xl font-bold mt-2">{stats.teachers}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="text-sm font-medium text-gray-500">{t("admin.totalLessons")}</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalLessons}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Процент прохождения</h3>
            <div className="flex items-center gap-4">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
              <span className="font-bold text-lg">{stats.completionRate}%</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="text-sm font-medium text-gray-500 mb-4">{t("dashboard.averageScore")}</h3>
            <div className="flex items-center gap-4">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{ width: `${stats.averageScore}%` }}
                />
              </div>
              <span className="font-bold text-lg">{stats.averageScore}%</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
