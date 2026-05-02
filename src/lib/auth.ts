import { account, databases, DATABASE_ID, COLLECTIONS } from "./appwrite";
import { ID } from "appwrite";

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
  await account.createEmailPasswordSession(email, password);

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
  return await account.createEmailPasswordSession(email, password);
}

export async function logout() {
  return await account.deleteSession("current");
}

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [`equal("userId", "${userId}")`]
    );
    if (response.documents.length > 0) {
      return response.documents[0] as unknown as UserProfile;
    }
    return null;
  } catch {
    return null;
  }
}
