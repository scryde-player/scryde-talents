// app/api/sell/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});

type Payload = {
  title: string;
  type: string;
  price: string | number; // большие значения присылай строкой
  items_count: number;
  found_index?: number; // индекс в найденных данных
};

// CREATE TABLE price_data (
//   id           uuid PRIMARY KEY DEFAULT uuidv7(),
//   batch_id     uuid NOT NULL DEFAULT uuidv7(),
//   created_at   timestamptz GENERATED ALWAYS AS (uuid_extract_timestamp(batch_id)) STORED,
//   deal_type    text        NOT NULL,
//   title        text        NOT NULL,
//   price        numeric(38,0) NOT NULL,
//   items_count  integer     NOT NULL,
//   found_index  integer     NOT NULL
// );

// -- Индексы под типичные выборки
// CREATE INDEX price_data_created_at_idx ON price_data (created_at ASC);
// CREATE INDEX price_data_batch_id_idx ON price_data (found_index ASC);
// CREATE INDEX price_data_title_idx      ON price_data (title);
// CREATE INDEX price_data_found_index_idx ON price_data (found_index);

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload | Payload[];
    const items = Array.isArray(body) ? body : [body];

    // простая валидация
    items.forEach((it, i) => {
      if (typeof it.title !== "string") throw new Error("title must be string");
      if (typeof it.type !== "string") throw new Error("type must be string");
      if (!["string", "number"].includes(typeof it.price))
        throw new Error("price must be string|number");
      if (typeof it.items_count !== "number")
        throw new Error("items_count must be number");
      if (it.found_index != null && !Number.isInteger(it.found_index))
        throw new Error("found_index must be integer");
      if (it.found_index == null) it.found_index = i; // если не пришло — ставим позицию в массиве
    });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // 1) первая вставка: batch_id создаётся в БД (DEFAULT) и возвращается
      const first = items[0];
      const firstSql = `
        INSERT INTO price_data (title, price, items_count, found_index, deal_type)
        VALUES ($1, $2::NUMERIC, $3, $4, $5)
        RETURNING batch_id
      `;
      const firstRes = await client.query(firstSql, [
        first.title,
        String(first.price),
        first.items_count,
        first.found_index!,
        first.type,
      ]);
      const batchId: string = firstRes.rows[0].batch_id;

      // 2) остальные строки — с тем же batch_id
      if (items.length > 1) {
        const restSql = `
          INSERT INTO price_data (batch_id, title, price, items_count, found_index, deal_type)
          VALUES ($1, $2, $3::NUMERIC, $4, $5, $6)
        `;
        for (let i = 1; i < items.length; i++) {
          const it = items[i];
          await client.query(restSql, [
            batchId,
            it.title,
            String(it.price),
            it.items_count,
            it.found_index!,
            it.type,
          ]);
        }
      }
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err ?? "bad request" },
      { status: 400 },
    );
  }
}
