import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const config = {
  api: { bodyParser: { sizeLimit: "15mb" } },
};

const BUCKET = "images";

// hapus file lama dari storage berdasarkan URL publiknya (abaikan jika
// bukan file di bucket ini, mis. URL eksternal)
async function deleteByPublicUrl(
  client: NonNullable<typeof supabaseAdmin>,
  url: string
) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return;
  const path = decodeURIComponent(url.slice(i + marker.length).split("?")[0]);
  if (path) await client.storage.from(BUCKET).remove([path]);
}

// gambar sudah dikompres + dikonversi WebP/JPEG di browser (admin),
// jadi API ini cukup menyimpan file apa adanya -> tidak butuh sharp
const MIME_EXT: Record<string, string> = {
  "image/webp": ".webp",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "application/pdf": ".pdf",
};

function safeBase(name: string) {
  return String(name)
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase();
}

async function saveFile(
  client: NonNullable<typeof supabaseAdmin>,
  buffer: Buffer,
  contentType: string,
  name: string,
  folder: string
) {
  const ext = MIME_EXT[contentType] ?? "";
  const path = `${folder}/${Date.now()}-${safeBase(name)}${ext}`;
  let { error } = await client.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType });
  // bucket missing -> create public bucket once, then retry
  if (error && /not found/i.test(error.message)) {
    await client.storage.createBucket(BUCKET, { public: true });
    ({ error } = await client.storage.from(BUCKET).upload(path, buffer, {
      contentType,
    }));
  }
  return { error, path };
}

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

  const { name, data, oldUrl } = req.body as {
    name?: string;
    data?: string;
    oldUrl?: string;
  };
  if (!data) return res.status(400).json({ error: "No image data" });

  try {
    // deteksi tipe dari data URL ("data:image/webp;base64,...")
    const mime = String(data).match(/^data:([^;,]+)/)?.[1] ?? "";
    const buffer = Buffer.from(String(data).split(",").pop() ?? "", "base64");

    const isPdf = /\.pdf$/i.test(String(name ?? "")) || mime === "application/pdf";
    const contentType = isPdf ? "application/pdf" : mime || "image/webp";
    const folder = isPdf ? "files" : "works";

    const { error, path } = await saveFile(
      supabaseAdmin,
      buffer,
      contentType,
      String(name ?? "file"),
      folder
    );
    if (error) return res.status(500).json({ error: error.message });

    if (oldUrl) await deleteByPublicUrl(supabaseAdmin, oldUrl);
    const { data: pub } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(path);
    res.status(200).json({ url: pub.publicUrl });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
