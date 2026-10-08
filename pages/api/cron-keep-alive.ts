import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

// Dipanggil Vercel Cron 1x sehari agar project Supabase Free tidak auto-pause
// (pause terjadi setelah ~7 hari tanpa aktivitas API/DB).
// GET /api/cron-keep-alive -> query ringan (1 row) supaya tercatat sebagai aktivitas.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  // Kunci pengaman opsional: isi CRON_SECRET di Vercel agar hanya cron resmi
  // yang bisa memicu (Vercel mengirim Authorization: Bearer <CRON_SECRET>).
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = String(req.headers.authorization ?? "");
    if (auth !== `Bearer ${secret}`)
      return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  if (!supabase)
    return res.status(500).json({ ok: false, error: "Supabase not configured" });

  const { error } = await supabase.from("works").select("id").limit(1);
  if (error) return res.status(500).json({ ok: false, error: error.message });

  return res.status(200).json({ ok: true, at: new Date().toISOString() });
}
