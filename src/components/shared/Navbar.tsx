"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { getCurrentUser, getUserProfile, logout, UserProfile } from "@/lib/auth";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const t = useTranslations();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (user) {
        const p = await getUserProfile(user.$id);
        setProfile(p);
      }
    }
    load();
  }, []);

  async function handleLogout() {
    await logout();
    window.location.href = "/";
  }

  return (
    <header className="bg-white border-b px-6 py-3 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          {t("common.appName")}
        </Link>

        <nav className="flex items-center gap-4">
          {profile ? (
            <>
              <Link href="/lessons" className="text-sm text-gray-600 hover:text-gray-900">
                {t("common.lessons")}
              </Link>
              {profile.role === "student" && (
                <Link href="/progress" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("common.progress")}
                </Link>
              )}
              {(profile.role === "teacher" || profile.role === "admin") && (
                <Link href="/teacher/lessons" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("teacher.myLessons")}
                </Link>
              )}
              {profile.role === "teacher" && (
                <Link href="/teacher/students" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("teacher.myStudents")}
                </Link>
              )}
              {profile.role === "admin" && (
                <Link href="/admin/stats" className="text-sm text-gray-600 hover:text-gray-900">
                  {t("admin.statistics")}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                {t("common.logout")}
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700">
              {t("common.login")}
            </Link>
          )}

          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
