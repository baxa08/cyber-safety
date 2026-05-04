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
        <h1 className="text-3xl font-bold mb-8">{t("admin.users")}</h1>

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">{t("auth.name")}</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">{t("auth.email")}</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">{t("auth.role")}</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">{t("auth.school")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.$id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
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
      </div>
    </div>
  );
}
