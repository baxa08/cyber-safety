import { Client, Databases, ID } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("69f504b90026598bb346")
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = "cyber_db";
const COLLECTION_ID = "articles";

async function main() {
  console.log("Creating articles collection...");

  // Create collection
  await databases.createCollection(DATABASE_ID, COLLECTION_ID, "articles", [
    // Anyone can read, only users can create/update/delete
    'read("any")',
    'create("users")',
    'update("users")',
    'delete("users")',
  ]);
  console.log("Collection created!");

  // Create attributes
  const attrs = [
    () =>
      databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, "title_ru", 255, true),
    () =>
      databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, "title_kk", 255, true),
    () =>
      databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, "content_ru", 50000, true),
    () =>
      databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, "content_kk", 50000, true),
    () =>
      databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, "category", 100, true),
    () =>
      databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, "authorId", 255, true),
    () =>
      databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, "order", true),
  ];

  for (const create of attrs) {
    await create();
  }
  console.log("All attributes created!");

  // Wait for attributes to be ready
  console.log("Waiting for attributes to be available...");
  await new Promise((r) => setTimeout(r, 3000));

  // Create index for ordering
  await databases.createIndex(
    DATABASE_ID,
    COLLECTION_ID,
    "order_idx",
    "key",
    ["order"],
    ["asc"]
  );
  console.log("Index created!");

  console.log("Done! Collection 'articles' is ready.");
}

main().catch(console.error);
