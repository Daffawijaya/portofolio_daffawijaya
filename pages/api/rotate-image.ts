import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

const BUCKET = "images";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!supabaseAdmin) {
    return res
      .status(500)
      .json({ error: "SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local" });
  }

  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  const { data: auth } = await supabaseAdmin.auth.getUser(token);
  if (!auth?.user) return res.status(401).json({ error: "Not authenticated" });

  if (req.method !== "POST") return res.status(405).end();

  const { url } = req.body as { url?: string };
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  if (!url || !url.includes(marker)) {
    return res.status(400).json({ error: "URL gambar storage tidak valid" });
  }

  try {
    const path = url.split(marker)[1].split("?")[0];

    const { data: blob, error: dlErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .download(path);
    if (dlErr || !blob)
      return res.status(500).json({ error: dlErr?.message ?? "Download gagal" });

    const buffer = Buffer.from(await blob.arrayBuffer());
    const rotated = await sharp(buffer).rotate(90).webp().toBuffer();

    // overwrite the same file so the stored path/URL never changes
    const { error: upErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .update(path, rotated, { contentType: "image/webp", upsert: true });
    if (upErr) return res.status(500).json({ error: upErr.message });

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
