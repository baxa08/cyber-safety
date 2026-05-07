"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getArticle, Article } from "@/lib/articles";

export default function ArticlePage() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const articleId = params.id as string;

  useEffect(() => {
    async function load() {
      try {
        const data = await getArticle(articleId);
        setArticle(data);
      } catch (err) {
        console.error("Failed to load article:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("common.loading")}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{t("knowledge.notFound")}</p>
      </div>
    );
  }

  const title = locale === "kk" ? article.title_kk : article.title_ru;
  const content = locale === "kk" ? article.content_kk : article.content_ru;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-xl border p-8">
          <div className="mb-6">
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium">
              {article.category}
            </span>
            <h1 className="text-3xl font-bold mt-3">{title}</h1>
          </div>

          <div
            className="prose prose-blue max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <div className="border-t pt-6">
            <Link href="/knowledge" className="text-gray-600 hover:text-gray-900">
              ← {t("knowledge.backToList")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
