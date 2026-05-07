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
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 py-3 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent select-none">
          {t("common.appName")}
        </span>

        <nav className="flex items-center gap-1">
          {profile ? (
            <>
              <Link href="/lessons" className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                {t("common.lessons")}
              </Link>
              <Link href="/knowledge" className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                {t("knowledge.nav")}
              </Link>
              {profile.role === "student" && (
                <Link href="/progress" className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                  {t("common.progress")}
                </Link>
              )}
              {(profile.role === "teacher" || profile.role === "admin") && (
                <>
                  <Link href="/teacher/lessons" className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                    {t("teacher.myLessons")}
                  </Link>
                  <Link href="/teacher/articles" className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                    {t("knowledge.nav")} +
                  </Link>
                </>
              )}
              {profile.role === "teacher" && (
                <Link href="/teacher/students" className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                  {t("teacher.myStudents")}
                </Link>
              )}
              {profile.role === "admin" && (
                <Link href="/admin/stats" className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                  {t("admin.statistics")}
                </Link>
              )}
              <div className="w-px h-5 bg-gray-200 mx-2" />
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
              >
                {t("common.logout")}
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-lg hover:shadow-md transition">
              {t("common.login")}
            </Link>
          )}

          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
