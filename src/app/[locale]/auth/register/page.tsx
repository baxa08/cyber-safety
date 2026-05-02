"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { register, UserRole } from "@/lib/auth";

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [school, setSchool] = useState("");
  const [userClass, setUserClass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 8) {
      setError("Пароль должен быть не менее 8 символов");
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name, role, school, userClass);
      router.push("/dashboard");
    } catch {
      setError("Ошибка регистрации. Возможно, email уже используется.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          {t("auth.registerTitle")}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.confirmPassword")}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.role")}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="student">{t("auth.roleStudent")}</option>
              <option value="teacher">{t("auth.roleTeacher")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("auth.school")}
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {role === "student" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("auth.class")}
              </label>
              <input
                type="text"
                value={userClass}
                onChange={(e) => setUserClass(e.target.value)}
                placeholder="7А"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? t("common.loading") : t("common.register")}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          {t("auth.hasAccount")}{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            {t("common.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
