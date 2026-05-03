"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import { getLesson, getTestByLessonId, saveProgress, Lesson, Test } from "@/lib/lessons";
import { getCurrentUser, getUserProfile } from "@/lib/auth";

export default function LessonPage() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const lessonId = params.id as string;

  useEffect(() => {
    async function load() {
      try {
        const user = await getCurrentUser();
        if (user) {
          const profile = await getUserProfile(user.$id);
          if (profile?.role === "admin") {
            setIsAdmin(true);
          }
        }
        const lessonData = await getLesson(lessonId);
        setLesson(lessonData);
        const testData = await getTestByLessonId(lessonId);
        setTest(testData);
      } catch (err) {
        console.error("Failed to load lesson:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [lessonId]);

  async function handleComplete() {
    const user = await getCurrentUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    await saveProgress({
      userId: user.$id,
      lessonId,
      completed: true,
      completedAt: new Date().toISOString(),
    });

    if (test) {
      router.push(`/tests/${test.$id}`);
    } else {
      router.push("/lessons");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Урок не найден</p>
      </div>
    );
  }

  const title = locale === "kk" ? lesson.title_kk : lesson.title_ru;
  const content = locale === "kk" ? lesson.content_kk : lesson.content_ru;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-xl border p-8">
          <div className="mb-6">
            <span className="text-sm text-gray-500">
              {t("lessons.lesson")} {lesson.order}
            </span>
            <h1 className="text-3xl font-bold mt-1">{title}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <span>{t(`lessons.${lesson.difficulty}`)}</span>
              {lesson.duration && (
                <span>
                  {lesson.duration} {t("lessons.minutes")}
                </span>
              )}
            </div>
          </div>

          <div
            className="prose prose-blue max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <div className="border-t pt-6 flex justify-between items-center">
            <Link href="/lessons" className="text-gray-600 hover:text-gray-900">
              ← {t("common.back")}
            </Link>
            {!isAdmin && (
              <button
                onClick={handleComplete}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                {test ? t("lessons.takeTest") : t("common.next")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
