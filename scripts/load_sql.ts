import "dotenv/config";
import fs from "node:fs";
import { parse } from "csv-parse";
import { db } from "../drizzle/db/db";
import { notesStaging } from "../drizzle/db/schema";

async function main() {
  const file = fs.createReadStream("./data/notes.csv");
  const parser = file.pipe(parse({ columns: true, trim: true }));

  const batch: any[] = [];
  const BATCH = 1000;

  for await (const row of parser) {
    batch.push({
      id: row.id ?? null,
      title: row.title ?? null,
      content: row.content ?? null,
      email: row.email ?? null,
      created_at: row.created_at ?? null,
      age: row.age ?? null,
      active: row.active ?? null,
    });

    if (batch.length >= BATCH) {
      await db.insert(notesStaging).values(batch as any);
      batch.length = 0;
    }
  }
  if (batch.length) await db.insert(notesStaging).values(batch as any);

  console.log("Loaded into staging ✅");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
