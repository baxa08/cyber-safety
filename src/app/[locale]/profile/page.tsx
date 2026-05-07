"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getCurrentUser, getUserProfile, UserProfile } from "@/lib/auth";

export default function ProfilePage() {
  const t = useTranslations();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (user) {
        const p = await getUserProfile(user.$id);
        setProfile(p);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Not found</p>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    student: t("profile.student"),
    teacher: t("profile.teacher"),
    admin: t("profile.admin"),
  };

  const initial = profile.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Link href="/lessons" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
          ← {t("common.back")}
        </Link>

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold text-white mb-3">
              {initial}
            </div>
            <h1 className="text-xl font-bold text-white">{profile.name}</h1>
            <span className="text-blue-100 text-sm mt-1">
              {roleLabels[profile.role] || profile.role}
            </span>
          </div>

          {/* Info */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">{t("profile.email")}</span>
              <span className="text-sm font-medium text-gray-900">{profile.email}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">{t("profile.role")}</span>
              <span className="text-sm font-medium text-gray-900">
                {roleLabels[profile.role] || profile.role}
              </span>
            </div>

            {profile.school && (
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">{t("profile.school")}</span>
                <span className="text-sm font-medium text-gray-900">{profile.school}</span>
              </div>
            )}

            {profile.class && (
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">{t("profile.class")}</span>
                <span className="text-sm font-medium text-gray-900">{profile.class}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
