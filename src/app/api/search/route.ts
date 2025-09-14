import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../drizzle/db/db";
import { sql } from "drizzle-orm";

/** Replace with your real embedder later */
async function embed(q: string): Promise<number[]> {
  // TODO: call your provider; keep 1536 or change table dim accordingly
  // For now, mirror the fakeEmbed from the backfill script:
  const dim = 1536; const out = new Array(dim); let seed = 0;
  for (let i = 0; i < q.length; i++) seed = (seed * 31 + q.charCodeAt(i)) >>> 0;
  for (let i = 0; i < dim; i++) { seed = (seed * 1664525 + 1013904223) >>> 0; out[i] = (seed % 1000) / 1000; }
  return out;
}

export async function POST(req: NextRequest) {
  const { query, limit = 10 } = await req.json();
  const qVec = await embed(query);

  // Using cosine distance (<=>) because we indexed with vector_cosine_ops
  const result = await db.execute(sql`
    WITH q AS (SELECT ${sql.raw(`'[${qVec.join(",")}]'`)}::vector AS v)
    SELECT n.id, n.title, n.content,
           (ne.embedding <=> (SELECT v FROM q)) AS distance
    FROM note_embeddings ne
    JOIN notes n ON n.id = ne.note_id
    ORDER BY distance ASC
    LIMIT ${limit};
  `);

  return NextResponse.json(result.rows);
}
