"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { getArticles, deleteArticle, Article } from "@/lib/articles";

export default function TeacherArticlesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getArticles();
        setArticles(data);
      } catch (err) {
        console.error("Failed to load articles:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Удалить теорию?")) return;
    await deleteArticle(id);
    setArticles((prev) => prev.filter((a) => a.$id !== id));
  }

  function getTitle(article: Article) {
    return locale === "kk" ? article.title_kk : article.title_ru;
  }

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("knowledge.title")}</h1>
          <Link
            href="/teacher/articles/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            + {t("knowledge.createArticle")}
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>{t("knowledge.empty")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <div
                key={article.$id}
                className="bg-white rounded-xl border p-5 flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <Link
                  href={`/knowledge/${article.$id}`}
                  className="flex-1 min-w-0"
                >
                  <h3 className="font-medium text-gray-900 hover:text-blue-600 transition">
                    {getTitle(article)}
                  </h3>
                  <span className="text-xs text-gray-500">{article.category}</span>
                </Link>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button
                    onClick={() => handleDelete(article.$id)}
                    className="text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                  >
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
