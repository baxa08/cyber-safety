import { Client, Databases } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("69f504b90026598bb346")
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function main() {
  const doc = await databases.getDocument("cyber_db", "articles", "article5");

  const content_ru = doc.content_ru.replace(
    /<li><a href="https:\/\/111\.kz"[^<]*<\/a><\/li>\n?/g,
    ""
  );
  const content_kk = doc.content_kk.replace(
    /<li><a href="https:\/\/111\.kz"[^<]*<\/a><\/li>\n?/g,
    ""
  );

  await databases.updateDocument("cyber_db", "articles", "article5", {
    content_ru,
    content_kk,
  });

  console.log("Done — 111.kz link removed from article5");
}

main().catch(console.error);
