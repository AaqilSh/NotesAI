import "dotenv/config";
import { db } from "../drizzle/db/db";
import { sql } from "drizzle-orm";

// tiny helper to make a deterministic-length vector
function fakeEmbed(text: string, dim = 1536): number[] {
  const out = new Array(dim);
  let seed = 0;
  for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) >>> 0;
  for (let i = 0; i < dim; i++) { seed = (seed * 1664525 + 1013904223) >>> 0; out[i] = (seed % 1000) / 1000; }
  return out;
}

async function main() {
  // grab notes missing an embedding
  const { rows } = await db.execute(sql`
    SELECT n.id, n.title, n.content
    FROM notes n
    LEFT JOIN note_embeddings e ON e.note_id = n.id
    WHERE e.note_id IS NULL
    LIMIT 1000
  `);

  for (const r of rows as any[]) {
    const v = fakeEmbed(`${r.title}\n\n${r.content}`);
    await db.execute(sql`
      INSERT INTO note_embeddings (note_id, embedding)
      VALUES (${r.id}::int, ${sql.raw(`'[${v.join(",")}]'`)}::vector)
      ON CONFLICT (note_id) DO UPDATE SET embedding = EXCLUDED.embedding
    `);
  }
  console.log("Backfill complete ✅");
}
main().catch(err => { console.error(err); process.exit(1); });
