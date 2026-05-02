"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { getCurrentUser, getUserProfile, UserProfile } from "@/lib/auth";

export default function DashboardPage() {
  const t = useTranslations();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const userProfile = await getUserProfile(user.$id);
      if (userProfile) {
        setProfile(userProfile);
      }
      setLoading(false);
    }
    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t("common.appName")}</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {profile.name} ({profile.role})
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">
          {t("dashboard.welcome")}, {profile.name}!
        </h2>

        {profile.role === "student" && <StudentDashboard />}
        {profile.role === "teacher" && <TeacherDashboard />}
        {profile.role === "admin" && <AdminDashboard />}
      </main>
    </div>
  );
}

function StudentDashboard() {
  const t = useTranslations();
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-700">{t("dashboard.completedLessons")}</h3>
        <p className="text-3xl font-bold mt-2">0 / 10</p>
      </div>
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-700">{t("dashboard.averageScore")}</h3>
        <p className="text-3xl font-bold mt-2">—</p>
      </div>
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-700">{t("dashboard.totalTime")}</h3>
        <p className="text-3xl font-bold mt-2">0 {t("lessons.minutes")}</p>
      </div>
    </div>
  );
}

function TeacherDashboard() {
  const t = useTranslations();
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-700">{t("teacher.myLessons")}</h3>
        <p className="text-3xl font-bold mt-2">0</p>
      </div>
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-700">{t("teacher.myStudents")}</h3>
        <p className="text-3xl font-bold mt-2">0</p>
      </div>
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-700">{t("teacher.studentProgress")}</h3>
        <p className="text-3xl font-bold mt-2">—</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const t = useTranslations();
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-700">{t("admin.totalUsers")}</h3>
        <p className="text-3xl font-bold mt-2">0</p>
      </div>
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-700">{t("admin.totalLessons")}</h3>
        <p className="text-3xl font-bold mt-2">0</p>
      </div>
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-700">{t("admin.activeUsers")}</h3>
        <p className="text-3xl font-bold mt-2">0</p>
      </div>
    </div>
  );
}
