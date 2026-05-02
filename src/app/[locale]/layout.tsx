import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/shared/Navbar";
import "../globals.css";

export const metadata: Metadata = {
  title: "CyberSafe — Безопасное интернет-поведение",
  description:
    "Интерактивная платформа для изучения основ кибербезопасности в школьном курсе информатики",
  keywords: ["кибербезопасность", "интернет-безопасность", "информатика", "школа", "обучение"],
  openGraph: {
    title: "CyberSafe — Безопасное интернет-поведение",
    description: "Интерактивная платформа для изучения основ кибербезопасности",
    type: "website",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ru" | "kk")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
