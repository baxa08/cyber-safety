import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 pt-20 pb-28 text-center">
          {/* Shield icon */}
          <div className="mx-auto mb-8 w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>

          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">
              Диссертациялық жұмыс
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">{t("home.title").split(" ").slice(0, -1).join(" ")} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              {t("home.title").split(" ").slice(-1)}
            </span>
          </h1>

          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            {t("home.description")}
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3.5 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition shadow-lg shadow-green-500/25"
            >
              {t("home.startLearning")}
            </Link>
            <Link
              href="/auth/login"
              className="border border-gray-700 text-gray-300 px-8 py-3.5 rounded-xl font-medium hover:bg-gray-800 hover:border-gray-600 transition"
            >
              {t("common.login")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">{t("home.subtitle")}</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            {t("home.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Lessons card */}
          <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-green-500/30 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-5 group-hover:bg-green-500/20 transition">
              <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">{t("home.features.lessons")}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t("home.features.lessonsDesc")}</p>
          </div>

          {/* Tests card */}
          <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition">
              <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">{t("home.features.tests")}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t("home.features.testsDesc")}</p>
          </div>

          {/* Progress card */}
          <div className="group bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-teal-500/30 transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-teal-500/10 flex items-center justify-center mb-5 group-hover:bg-teal-500/20 transition">
              <svg className="w-7 h-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">{t("home.features.progress")}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t("home.features.progressDesc")}</p>
          </div>
        </div>
      </section>

      {/* Topics preview */}
      <section className="container mx-auto px-4 pb-20">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10">
          <h3 className="text-xl font-bold mb-6 text-center">10 {t("common.lessons").toLowerCase()}</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { icon: "🔑", name: "Пароли" },
              { icon: "🎣", name: "Фишинг" },
              { icon: "🛡️", name: "Персональные данные" },
              { icon: "🚫", name: "Кибербуллинг" },
              { icon: "🌐", name: "Безопасный сёрфинг" },
              { icon: "📱", name: "Соцсети" },
              { icon: "⚠️", name: "Мошенничество" },
              { icon: "👣", name: "Цифровой след" },
              { icon: "©️", name: "Авторское право" },
              { icon: "🔒", name: "VPN и приватность" },
            ].map((topic) => (
              <div
                key={topic.name}
                className="flex items-center gap-2 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2.5 text-sm text-gray-300"
              >
                <span>{topic.icon}</span>
                <span>{topic.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <Image
            src="/itu-logo.jpg"
            alt="iTU - Sherkhan Murtaza University"
            width={48}
            height={48}
            className="rounded-lg opacity-70"
          />
          <p className="text-xs text-gray-500 text-center uppercase tracking-wider">
            Шерхан Мұртаза атындағы Халықаралық Тараз Университеті
          </p>
          <p className="text-sm text-gray-600">
            &copy; 2026 CyberSafe — {t("home.subtitle")}
          </p>
        </div>
      </footer>
    </main>
  );
}
