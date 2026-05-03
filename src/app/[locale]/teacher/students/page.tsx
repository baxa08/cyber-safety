"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { getCurrentUser, getUserProfile } from "@/lib/auth";
import { Query } from "appwrite";

interface StudentInfo {
  $id: string;
  name: string;
  email: string;
  class: string;
  lessonsCompleted: number;
  averageScore: number;
}

export default function TeacherStudentsPage() {
  const t = useTranslations();
  const router = useRouter();
  const [students, setStudents] = useState<StudentInfo[]>([]);
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

      // Get all students
      const usersRes = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal("role", "student"), Query.limit(100)]
      );

      // Get progress for all students
      const studentList: StudentInfo[] = [];
      for (const student of usersRes.documents) {
        const progressRes = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.PROGRESS,
          [Query.equal("userId", student.userId as string)]
        );

        const completed = progressRes.documents.filter((p) => p.completed).length;
        const scores = progressRes.documents.filter((p) => p.score).map((p) => p.score as number);
        const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

        studentList.push({
          $id: student.$id,
          name: student.name as string,
          email: student.email as string,
          class: (student.class as string) || "—",
          lessonsCompleted: completed,
          averageScore: avg,
        });
      }

      setStudents(studentList);
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("teacher.myStudents")}</h1>

        {students.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Ученики пока не зарегистрированы</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">{t("auth.name")}</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">{t("auth.class")}</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">{t("dashboard.completedLessons")}</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">{t("dashboard.averageScore")}</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.$id} className="border-b last:border-0">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{student.class}</td>
                    <td className="px-6 py-4 text-sm">{student.lessonsCompleted}</td>
                    <td className="px-6 py-4 text-sm">{student.averageScore}%</td>
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
