"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: "ru" | "kk") {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => switchLocale("ru")}
        className={`px-2 py-1 rounded ${locale === "ru" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-500 hover:text-gray-700"}`}
      >
        РУ
      </button>
      <button
        onClick={() => switchLocale("kk")}
        className={`px-2 py-1 rounded ${locale === "kk" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-500 hover:text-gray-700"}`}
      >
        ҚЗ
      </button>
    </div>
  );
}
