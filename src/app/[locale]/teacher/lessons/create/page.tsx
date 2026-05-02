"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { createLesson } from "@/lib/lessons";
import { getCurrentUser } from "@/lib/auth";

const categories = [
  "passwords",
  "phishing",
  "personal_data",
  "cyberbullying",
  "safe_browsing",
  "social_media",
  "fraud",
  "digital_footprint",
  "copyright",
  "vpn",
];

export default function CreateLessonPage() {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title_ru: "",
    title_kk: "",
    content_ru: "",
    content_kk: "",
    category: "passwords",
    difficulty: "easy" as "easy" | "medium" | "hard",
    order: 1,
    duration: 15,
  });

  function updateForm(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      await createLesson({
        ...form,
        authorId: user.$id,
      });

      router.push("/teacher/lessons");
    } catch {
      setError("Ошибка при создании урока");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            {t("common.appName")}
          </Link>
          <Link href="/teacher/lessons" className="text-gray-600 hover:text-gray-900">
            {t("common.back")}
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">{t("teacher.createLesson")}</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl border p-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название (русский)
              </label>
              <input
                type="text"
                value={form.title_ru}
                onChange={(e) => updateForm("title_ru", e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Атауы (қазақша)
              </label>
              <input
                type="text"
                value={form.title_kk}
                onChange={(e) => updateForm("title_kk", e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Содержание (русский) — HTML
            </label>
            <textarea
              value={form.content_ru}
              onChange={(e) => updateForm("content_ru", e.target.value)}
              required
              rows={8}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Мазмұны (қазақша) — HTML
            </label>
            <textarea
              value={form.content_kk}
              onChange={(e) => updateForm("content_kk", e.target.value)}
              required
              rows={8}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория
              </label>
              <select
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("lessons.difficulty")}
              </label>
              <select
                value={form.difficulty}
                onChange={(e) => updateForm("difficulty", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="easy">{t("lessons.easy")}</option>
                <option value="medium">{t("lessons.medium")}</option>
                <option value="hard">{t("lessons.hard")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Порядок
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => updateForm("order", parseInt(e.target.value))}
                min={1}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("lessons.duration")} ({t("lessons.minutes")})
              </label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => updateForm("duration", parseInt(e.target.value))}
                min={1}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? t("common.loading") : t("common.create")}
          </button>
        </form>
      </main>
    </div>
  );
}
