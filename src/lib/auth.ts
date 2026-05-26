import { account, databases, DATABASE_ID, COLLECTIONS } from "./appwrite";
import { ID, Query } from "appwrite";

export type UserRole = "admin" | "teacher" | "student";

export interface UserProfile {
  $id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  school?: string;
  class?: string;
  language: "ru" | "kk";
}

function saveSession(session: { $id: string; userId: string }) {
  if (typeof window !== "undefined") {
    localStorage.setItem("appwrite_session", JSON.stringify(session));
  }
}

function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("appwrite_session");
  }
}

export async function register(
  email: string,
  password: string,
  name: string,
  role: UserRole,
  school?: string,
  userClass?: string
) {
  // Create account in Appwrite Auth
  const authUser = await account.create(ID.unique(), email, password, name);

  // Create session
  const session = await account.createEmailPasswordSession(email, password);
  saveSession(session);

  // Create user profile in database
  await databases.createDocument(DATABASE_ID, COLLECTIONS.USERS, ID.unique(), {
    userId: authUser.$id,
    name,
    email,
    role,
    school: school || "",
    class: userClass || "",
    language: "ru",
  });

  return authUser;
}

export async function login(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    saveSession(session);
    return session;
  } catch (error: unknown) {
    // If session already exists, delete it and retry once
    if (error instanceof Error && error.message.includes("session_already_exists")) {
      await account.deleteSession("current");
      clearSession();
      const session = await account.createEmailPasswordSession(email, password);
      saveSession(session);
      return session;
    }
    throw error;
  }
}

export async function logout() {
  try {
    await account.deleteSession("current");
  } catch {
    // session may already be expired
  }
  clearSession();
}

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    clearSession();
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [Query.equal("userId", userId)]
    );
    if (response.documents.length > 0) {
      return response.documents[0] as unknown as UserProfile;
    }
    return null;
  } catch {
    return null;
  }
}
