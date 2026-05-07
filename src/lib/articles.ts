import { databases, DATABASE_ID, COLLECTIONS } from "./appwrite";
import { ID, Query } from "appwrite";

export interface Article {
  $id: string;
  title_ru: string;
  title_kk: string;
  content_ru: string;
  content_kk: string;
  category: string;
  authorId: string;
  order: number;
}

export async function getArticles(): Promise<Article[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ARTICLES,
    [Query.orderAsc("order"), Query.limit(100)]
  );
  return response.documents as unknown as Article[];
}

export async function getArticle(id: string): Promise<Article> {
  const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.ARTICLES, id);
  return doc as unknown as Article;
}

export async function createArticle(data: Omit<Article, "$id">): Promise<Article> {
  const doc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.ARTICLES,
    ID.unique(),
    data
  );
  return doc as unknown as Article;
}

export async function updateArticle(id: string, data: Partial<Omit<Article, "$id">>): Promise<Article> {
  const doc = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.ARTICLES,
    id,
    data
  );
  return doc as unknown as Article;
}

export async function deleteArticle(id: string): Promise<void> {
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ARTICLES, id);
}
