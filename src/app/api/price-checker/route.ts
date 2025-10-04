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
  price: string | number; // большие значения присылай строкой
  items_count: number;
  found_index?: number; // индекс в найденных данных
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload | Payload[];
    const items = Array.isArray(body) ? body : [body];

    // простая валидация
    items.forEach((it, i) => {
      if (typeof it.title !== "string") throw new Error("title must be string");
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
      const sql = `
        INSERT INTO sell_data (title, price, items_count, found_index)
        VALUES ($1, $2::NUMERIC, $3, $4)
      `;
      for (const it of items) {
        await client.query(sql, [
          it.title,
          String(it.price),
          it.items_count,
          it.found_index!,
        ]);
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
      { status: 400 }
    );
  }
}
