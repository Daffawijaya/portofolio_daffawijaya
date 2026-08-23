import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const config = {
  api: { bodyParser: { sizeLimit: "15mb" } },
};

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

  // only logged-in admins may upload; verify the client's access token
  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  const { data: auth } = await supabaseAdmin.auth.getUser(token);
  if (!auth?.user) return res.status(401).json({ error: "Not authenticated" });

  if (req.method !== "POST") return res.status(405).end();

  const { name, data } = req.body as { name?: string; data?: string };
  if (!data) return res.status(400).json({ error: "No image data" });

  try {
    const buffer = Buffer.from(String(data).split(",").pop() ?? "", "base64");

    // PDF (mis. CV) disimpan apa adanya, tanpa konversi gambar
    if (/\.pdf$/i.test(String(name ?? ""))) {
      const base = String(name)
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-z0-9]+/gi, "-")
        .toLowerCase();
      const path = `files/${Date.now()}-${base}.pdf`;
      let { error } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, buffer, { contentType: "application/pdf" });
      if (error && /not found/i.test(error.message)) {
        await supabaseAdmin.storage.createBucket(BUCKET, { public: true });
        ({ error } = await supabaseAdmin.storage
          .from(BUCKET)
          .upload(path, buffer, { contentType: "application/pdf" }));
      }
      if (error) return res.status(500).json({ error: error.message });
      const { data: pub } = supabaseAdmin.storage
        .from(BUCKET)
        .getPublicUrl(path);
      return res.status(200).json({ url: pub.publicUrl });
    }

    // auto-convert to WebP before it enters storage
    const webp = await sharp(buffer)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const base = String(name ?? "image")
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase();
    const path = `works/${Date.now()}-${base}.webp`;

    let { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, webp, { contentType: "image/webp" });

    // bucket missing -> create public bucket once, then retry
    if (error && /not found/i.test(error.message)) {
      await supabaseAdmin.storage.createBucket(BUCKET, { public: true });
      ({ error } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, webp, { contentType: "image/webp" }));
    }
    if (error) return res.status(500).json({ error: error.message });

    const { data: pub } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(path);
    res.status(200).json({ url: pub.publicUrl });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
