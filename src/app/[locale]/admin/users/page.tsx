"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { getCurrentUser, getUserProfile } from "@/lib/auth";
import { Query } from "appwrite";

interface UserInfo {
  $id: string;
  name: string;
  email: string;
  role: string;
  school: string;
  class: string;
}

export default function AdminUsersPage() {
  const t = useTranslations();
  const router = useRouter();
  const [users, setUsers] = useState<UserInfo[]>([]);
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

      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.limit(100)]
      );

      setUsers(res.documents as unknown as UserInfo[]);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">{t("common.appName")}</Link>
          <nav className="flex gap-4">
            <Link href="/admin/users" className="text-blue-600 font-medium">{t("admin.users")}</Link>
            <Link href="/admin/content" className="text-gray-600 hover:text-gray-900">{t("admin.content")}</Link>
            <Link href="/admin/stats" className="text-gray-600 hover:text-gray-900">{t("admin.statistics")}</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("admin.users")}</h1>

        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">{t("auth.name")}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">{t("auth.email")}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">{t("auth.role")}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">{t("auth.school")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.$id} className="border-b last:border-0">
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      u.role === "admin" ? "bg-purple-100 text-purple-700" :
                      u.role === "teacher" ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{u.school || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
