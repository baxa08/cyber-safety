import { databases, DATABASE_ID, COLLECTIONS } from "./appwrite";
import { ID, Query } from "appwrite";

export interface Lesson {
  $id: string;
  title_ru: string;
  title_kk: string;
  content_ru: string;
  content_kk: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  order: number;
  duration?: number;
  authorId: string;
}

export interface TestQuestion {
  id: string;
  question_ru: string;
  question_kk: string;
  options_ru: string[];
  options_kk: string[];
  correctIndex: number;
}

export interface Test {
  $id: string;
  lessonId: string;
  title_ru: string;
  title_kk: string;
  questions: string; // JSON stringified TestQuestion[]
  passingScore: number;
  timeLimit?: number;
}

export interface Progress {
  $id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  completedAt?: string;
}

// Lessons
export async function getLessons(): Promise<Lesson[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.LESSONS,
    [Query.orderAsc("order")]
  );
  return response.documents as unknown as Lesson[];
}

export async function getLesson(id: string): Promise<Lesson> {
  const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.LESSONS, id);
  return doc as unknown as Lesson;
}

export async function createLesson(data: Omit<Lesson, "$id">): Promise<Lesson> {
  const doc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.LESSONS,
    ID.unique(),
    data
  );
  return doc as unknown as Lesson;
}

export async function updateLesson(id: string, data: Partial<Omit<Lesson, "$id">>): Promise<Lesson> {
  const doc = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.LESSONS,
    id,
    data
  );
  return doc as unknown as Lesson;
}

export async function deleteLesson(id: string): Promise<void> {
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.LESSONS, id);
}

// Tests
export async function getTestByLessonId(lessonId: string): Promise<Test | null> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.TESTS,
    [Query.equal("lessonId", lessonId)]
  );
  if (response.documents.length > 0) {
    return response.documents[0] as unknown as Test;
  }
  return null;
}

export async function createTest(data: Omit<Test, "$id">): Promise<Test> {
  const doc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.TESTS,
    ID.unique(),
    data
  );
  return doc as unknown as Test;
}

export async function updateTest(id: string, data: Partial<Omit<Test, "$id">>): Promise<Test> {
  const doc = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.TESTS,
    id,
    data
  );
  return doc as unknown as Test;
}

// Progress
export async function getUserProgress(userId: string): Promise<Progress[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.PROGRESS,
    [Query.equal("userId", userId)]
  );
  return response.documents as unknown as Progress[];
}

export async function saveProgress(data: Omit<Progress, "$id">): Promise<Progress> {
  // Check if progress already exists
  const existing = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.PROGRESS,
    [
      Query.equal("userId", data.userId),
      Query.equal("lessonId", data.lessonId),
    ]
  );

  if (existing.documents.length > 0) {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.PROGRESS,
      existing.documents[0].$id,
      data
    );
    return doc as unknown as Progress;
  }

  const doc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.PROGRESS,
    ID.unique(),
    data
  );
  return doc as unknown as Progress;
}
