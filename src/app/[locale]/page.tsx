import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          {t("home.title")}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t("home.description")}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {t("home.startLearning")}
          </Link>
          <Link
            href="/auth/login"
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            {t("common.login")}
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t("home.features.lessons")}</h3>
            <p className="text-gray-600">{t("home.features.lessonsDesc")}</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t("home.features.tests")}</h3>
            <p className="text-gray-600">{t("home.features.testsDesc")}</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t("home.features.progress")}</h3>
            <p className="text-gray-600">{t("home.features.progressDesc")}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
