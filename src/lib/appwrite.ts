import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };

// Database and collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export const COLLECTIONS = {
  USERS: "users",
  LESSONS: "lessons",
  TESTS: "tests",
  PROGRESS: "progress",
  CLASSES: "classes",
} as const;
