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
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("admin.statistics")}</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="text-sm font-medium text-blue-600">{t("admin.totalUsers")}</h3>
            <p className="text-3xl font-bold mt-2 text-blue-900">{stats.totalUsers}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-2xl border border-green-100 shadow-sm">
            <h3 className="text-sm font-medium text-green-600">{t("auth.roleStudent")}</h3>
            <p className="text-3xl font-bold mt-2 text-green-900">{stats.students}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-2xl border border-purple-100 shadow-sm">
            <h3 className="text-sm font-medium text-purple-600">{t("auth.roleTeacher")}</h3>
            <p className="text-3xl font-bold mt-2 text-purple-900">{stats.teachers}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 rounded-2xl border border-orange-100 shadow-sm">
            <h3 className="text-sm font-medium text-orange-600">{t("admin.totalLessons")}</h3>
            <p className="text-3xl font-bold mt-2 text-orange-900">{stats.totalLessons}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Процент прохождения</h3>
            <div className="flex items-center gap-4">
              <div className="w-full bg-gray-100 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
              <span className="font-bold text-lg min-w-[3rem]">{stats.completionRate}%</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-4">{t("dashboard.averageScore")}</h3>
            <div className="flex items-center gap-4">
              <div className="w-full bg-gray-100 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full transition-all"
                  style={{ width: `${stats.averageScore}%` }}
                />
              </div>
              <span className="font-bold text-lg min-w-[3rem]">{stats.averageScore}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
