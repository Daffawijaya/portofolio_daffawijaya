import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Session } from "@supabase/supabase-js";
import { HiChevronDown } from "react-icons/hi";
import { supabase } from "../../lib/supabase";
import { ICONS } from "../../lib/icons";
import PannableImage from "../../components/PannableImage";
import PageHead from "../../components/PageHead";
import { SETTINGS_DEFAULTS } from "../../lib/content";

interface FieldDef {
  key: string;
  label: string;
  options?: string[]; // render as <select> when set
  multi?: boolean; // render as checkboxes (array value) instead of single select
  hidden?: boolean; // not editable directly (managed by other controls)
}

interface TableDef {
  name: string;
  label: string;
  fields: FieldDef[];
}

const TABLES: TableDef[] = [
  {
    name: "works",
    label: "Works",
    fields: [
      {
        key: "category",
        label: "Category",
        options: ["frontend", "fullstack", "uiux", "mobile"],
        multi: true,
      },
      { key: "name", label: "Name" },
      { key: "image", label: "Image" },
      { key: "url", label: "URL" },
      { key: "year", label: "Year" },
      { key: "image_position", label: "Image Position", hidden: true },
      { key: "image_rotate", label: "Image Rotate", hidden: true },
      { key: "image_scale", label: "Image Scale", hidden: true },
    ],
  },
  {
    name: "experiences",
    label: "Experiences",
    fields: [
      {
        key: "group_name",
        label: "Group",
        options: ["Works", "Education", "Certification", "Organization"],
      },
      { key: "name", label: "Name" },
      { key: "image", label: "Image" },
      { key: "url", label: "URL" },
      { key: "year", label: "Year" },
      { key: "image_position", label: "Image Position", hidden: true },
      { key: "image_rotate", label: "Image Rotate", hidden: true },
      { key: "image_scale", label: "Image Scale", hidden: true },
    ],
  },
  {
    name: "techstack",
    label: "Techstack",
    fields: [
      {
        key: "category",
        label: "Category",
        options: ["Programming Language", "Fullstack Development", "Framework", "Mobile Development"],
      },
      { key: "name", label: "Name" },
      { key: "icon", label: "Icon", options: Object.keys(ICONS).sort() },
      { key: "color", label: "Color" },
    ],
  },
  {
    name: "skills",
    label: "Skills",
    fields: [
      { key: "name", label: "Name" },
      { key: "icon", label: "Icon", options: Object.keys(ICONS).sort() },
      { key: "color", label: "Color" },
    ],
  },
  {
    name: "contact_links",
    label: "Contact Links",
    fields: [
      { key: "name", label: "Name" },
      { key: "icon", label: "Icon", options: Object.keys(ICONS).sort() },
      { key: "url", label: "URL" },
      // disimpan sebagai nilai CSS background (warna solid / linear-gradient);
      // diedit lewat color picker di bawah, bukan input teks
      { key: "color", label: "Background", hidden: true },
    ],
  },
];

type Row = Record<string, unknown> & { id: number | string };
type Rows = Record<string, Row[]>;

// key-value settings yang diedit lewat tab Settings (satu nilai dipakai
// bersama oleh beberapa halaman: position tampil di home & about)
const SETTING_FIELDS: { key: string; label: string; textarea?: boolean; upload?: string }[] = [
  { key: "position", label: "Position (tampil di Home & About)" },
  { key: "about_image", label: "About: Foto Profil", upload: "image/*" },
  { key: "about_text", label: "About Text (paragraf passionate)", textarea: true },
  { key: "cv_url", label: "CV URL", upload: "application/pdf,.pdf" },
  { key: "contact_country", label: "Contact: Judul Negara" },
  { key: "contact_address", label: "Contact: Alamat" },
  { key: "map_url", label: "Contact: Link Google Maps" },
];

const inputClass =
  "w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white text-black";

// seksi grup yang bisa diminimize (Works/Education/dll)
function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left mb-1"
      >
        <HiChevronDown
          className={`transition-transform duration-300 ${open ? "" : "-rotate-90"}`}
        />
        <span className="font-bold text-lg italic">{title}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden flex flex-col"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// year is stored as text like "August 2022 - Present"; the admin edits it via
// two date inputs + a "Present" checkbox (kept in row as __yf/__yt/__yp)
const fmtMonth = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("en-US", { month: "long", year: "numeric" });

function parseYearParts(year: unknown) {
  const [from, to] = String(year ?? "").split(" - ");
  const toIso = (v?: string) => {
    const d = v ? new Date(v) : null;
    return d && !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : "";
  };
  const present = (to ?? "").trim() === "Present";
  return { __yf: toIso(from), __yt: present ? "" : toIso(to), __yp: present };
}

function yearValue(row: Row): string {
  const from = row.__yf ? fmtMonth(String(row.__yf)) : "";
  const to = row.__yp ? "Present" : row.__yt ? fmtMonth(String(row.__yt)) : "";
  if (!from && !to) return "";
  return to ? `${from} - ${to}`.replace(/^ - /, "") : from;
}

// ===== background builder (Contact Links) =====
// format tersimpan: "#0A66C2" atau "linear-gradient(135deg, #a, #b, ...)"
function parseBg(css: unknown): { __bgAngle: number; __bgStops: string[] } {
  const s = String(css ?? "").trim();
  const m = s.match(/linear-gradient\(([\d.]+)deg\s*,\s*(.+)\)/);
  if (m)
    return {
      __bgAngle: Number(m[1]),
      __bgStops: m[2].split(",").map((c) => c.trim()),
    };
  return { __bgAngle: 135, __bgStops: s ? [s] : ["#374151", "#6B7280"] };
}

function bgValue(row: Row): string {
  const stops = Array.isArray(row.__bgStops) ? (row.__bgStops as string[]) : [];
  if (stops.length === 0) return "#374151";
  if (stops.length === 1) return stops[0];
  return `linear-gradient(${Number(row.__bgAngle) || 135}deg, ${stops.join(", ")})`;
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [activeTable, setActiveTable] = useState(TABLES[0].name);
  const [rows, setRows] = useState<Rows>({});
  const [originals, setOriginals] = useState<
    Record<string, Record<string, string>>
  >({});
  // id row yang sedang dibuka di editor detail; null = tampilan list
  const [editingId, setEditingId] = useState<string | null>(null);
  // modal konfirmasi sebelum aksi tulis (save/delete); action jalan saat setuju
  const [confirm, setConfirm] = useState<{
    title: string;
    body: string;
    label?: string;
    action: () => void | Promise<void>;
  } | null>(null);
  const [settingsValues, setSettingsValues] =
    useState<Record<string, string>>(SETTINGS_DEFAULTS);
  const [settingsOriginal, setSettingsOriginal] = useState<string>(
    JSON.stringify(SETTINGS_DEFAULTS)
  );

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  async function loadRows(table: string) {
    if (!supabase) return;
    const { data } = await supabase
      .from(table)
      .select("*")
      .order("id", { ascending: false });
    // urutkan berdasarkan tanggal awal di kolom year (terbaru dulu)
    const startDate = (r: Record<string, unknown>) => {
      const first = String(r.year ?? "").split(" - ")[0];
      const t = first ? new Date(first).getTime() : NaN;
      return isNaN(t) ? 0 : t; // tanpa tanggal -> paling bawah
    };
    const list = (data ?? [])
      .map((r) => ({ ...r, ...parseYearParts(r.year), ...parseBg(r.color) }))
      .sort((a, b) => startDate(b) - startDate(a));
    setRows((prev) => ({ ...prev, [table]: list }));
    setOriginals((prev) => ({
      ...prev,
      [table]: Object.fromEntries(list.map((r) => [String(r.id), JSON.stringify(r)])),
    }));
  }

  function isDirty(table: string, row: Row): boolean {
    const original = originals[table]?.[String(row.id)];
    return !original || JSON.stringify(row) !== original;
  }

  // depend pada status login saja, bukan objek session -- kalau bergantung
  // objek session, token refresh saat balik ke tab memicu loadRows() ulang
  // dan menghapus draft "Add" yang belum tersimpan
  const loggedIn = !!session;

  useEffect(() => {
    if (loggedIn) loadRows(activeTable);
  }, [loggedIn, activeTable]);

  // muat nilai settings dari DB saat tab Settings dibuka
  useEffect(() => {
    if (!supabase || !loggedIn || activeTable !== "settings") return;
    supabase
      .from("settings")
      .select("key, value")
      .then(({ data }) => {
        const values = data && data.length > 0
          ? { ...SETTINGS_DEFAULTS, ...Object.fromEntries(data.map((r) => [r.key, r.value])) }
          : SETTINGS_DEFAULTS;
        setSettingsValues(values);
        setSettingsOriginal(JSON.stringify(values));
      });
  }, [loggedIn, activeTable]);

  async function saveSettings() {
    setMessage("Saving...");
    const orig: Record<string, string> = JSON.parse(settingsOriginal);
    try {
      const upserts = [];
      for (const f of SETTING_FIELDS) {
        let v = settingsValues[f.key] ?? "";
        // pratinjau lokal (data URL) -> konversi & upload ke storage saat Save;
        // file lama di storage ikut dihapus
        if (v.startsWith("data:")) {
          v = await uploadDataUrl(
            v,
            f.key === "cv_url" ? "cv.pdf" : "image",
            orig[f.key]
          );
        }
        upserts.push({ key: f.key, value: v });
      }
      const { error } = await supabase!.from("settings").upsert(upserts);
      if (error) {
        setMessage(`Error: ${error.message}`);
        return;
      }
      setSettingsOriginal(JSON.stringify(settingsValues));
      setMessage("Saved.");
    } catch (e) {
      setMessage(`Error: ${(e as Error).message}`);
    }
  }

  const settingsDirty = JSON.stringify(settingsValues) !== settingsOriginal;

  // baca file apa adanya sebagai data URL
  function readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // kompres gambar di browser (max 1600px, webp/jpeg) supaya muat lewat
  // limit body 4.5MB serverless function di deployment (Vercel)
  async function compressImage(file: File): Promise<string> {
    const dataUrl = await readAsDataUrl(file);
    const img = document.createElement("img");
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = dataUrl;
    });
    const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    let out = canvas.toDataURL("image/webp", 0.82); // browser lama -> fallback jpeg
    if (!out.startsWith("data:image/webp")) out = canvas.toDataURL("image/jpeg", 0.82);
    return out;
  }

  // kirim pratinjau (data URL) ke /api/upload -> dikonversi WebP server,
  // disimpan ke storage, dan file lama (oldUrl) dihapus
  async function uploadDataUrl(
    data: string,
    name: string,
    oldUrl?: string
  ): Promise<string> {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session!.access_token}`,
      },
      body: JSON.stringify({
        name,
        data,
        oldUrl: oldUrl?.startsWith("http") ? oldUrl : undefined,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(json.error ?? `Upload gagal (HTTP ${res.status})`);
    return String(json.url);
  }

  // pilih file -> hanya pratinjau lokal; tersimpan ke storage saat Save
  async function previewTo(key: string, file: File) {
    try {
      const data = /image\//.test(file.type)
        ? await compressImage(file)
        : await readAsDataUrl(file);
      setSettingsValues((prev) => ({ ...prev, [key]: data }));
      setMessage("Pratinjau dimuat. Klik Save untuk menyimpan.");
    } catch (e) {
      setMessage(`Error: ${(e as Error).message}`);
    }
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setMessage(error.message);
  }

  // jika kolom image berisi pratinjau lokal (data URL), konversi & upload ke
  // storage dulu; URL lama (dari snapshot sebelum edit) ikut dihapus.
  // return false jika upload gagal (message sudah diisi)
  async function resolveImageUpload(
    table: string,
    row: Row,
    values: Record<string, unknown>
  ): Promise<boolean> {
    const img = values.image;
    if (typeof img !== "string" || !img.startsWith("data:")) return true;
    let oldImage: string | undefined;
    try {
      const snap = originals[table]?.[String(row.id)];
      if (snap) oldImage = JSON.parse(snap).image;
    } catch {}
    try {
      values.image = await uploadDataUrl(img, "image", oldImage);
      return true;
    } catch (e) {
      setMessage(`Error: ${(e as Error).message}`);
      return false;
    }
  }

  function askConfirm(
    title: string,
    body: string,
    action: () => void | Promise<void>,
    label = "Ya, lanjutkan"
  ) {
    setConfirm({ title, body, label, action });
  }

  async function updateRow(tableDef: TableDef, row: Row) {
    setMessage("");
    // only send real columns (skip __yf/__yt/__yp helpers)
    const values: Record<string, unknown> = {};
    for (const field of tableDef.fields) values[field.key] = row[field.key];
    if ("year" in values) values.year = yearValue(row);
    // int columns come back as strings from inputs
    for (const key of ["sort_order", "image_rotate", "image_scale"]) {
      if (key in values) values[key] = Number(values[key]) || (key === "image_scale" ? 100 : 0);
    }
    if ("color" in values) values.color = bgValue(row);
    if (!(await resolveImageUpload(tableDef.name, row, values))) return;
    const { error } = await supabase!
      .from(tableDef.name)
      .update(values)
      .eq("id", row.id);
    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }
    await loadRows(tableDef.name); // refresh snapshot -> Save kembali disable
    setMessage("Saved.");
  }

  async function deleteRow(table: string, id: number | string) {
    // draft belum pernah masuk DB -> cukup buang dari state
    if (String(id).startsWith("draft-")) {
      discardDraft(table, id);
      setEditingId(null);
      return;
    }
    setMessage("");
    const { error } = await supabase!.from(table).delete().eq("id", id);
    if (!error) {
      if (String(id) === editingId) setEditingId(null);
      loadRows(table);
    } else setMessage(`Error: ${error.message}`);
  }

  function discardDraft(table: string, id: number | string) {
    setRows((prev) => ({
      ...prev,
      [table]: (prev[table] ?? []).filter((r) => String(r.id) !== String(id)),
    }));
  }

  // kembali ke list; kalau yang diedit masih draft (belum pernah disave), buang
  function backToList(table: string) {
    const row = (rows[table] ?? []).find((r) => String(r.id) === editingId);
    if (row && String(row.id).startsWith("draft-")) discardDraft(table, row.id);
    setEditingId(null);
  }

  // tab diganti saat masih draft -> buang juga
  function switchTab(name: string) {
    if (editingId && String(editingId).startsWith("draft-"))
      discardDraft(activeTable, editingId);
    setActiveTable(name);
    setEditingId(null);
  }

  // + Add hanya membuat draft lokal; masuk DB saat Save pertama kali
  function startAdd(table: TableDef) {
    const id = `draft-${Date.now()}`;
    const draft = {
      id,
      ...Object.fromEntries(
        table.fields.filter((f) => !f.hidden).map((f) => [f.key, f.multi ? [] : ""])
      ),
      sort_order: 0,
      ...parseYearParts(""),
      ...parseBg(""),
    } as Row;
    setRows((prev) => ({ ...prev, [table.name]: [draft, ...(prev[table.name] ?? [])] }));
    setMessage("");
    setEditingId(id);
  }

  async function saveRow(tableDef: TableDef, row: Row) {
    // draft -> INSERT pertama kali
    if (String(row.id).startsWith("draft-")) {
      setMessage("");
      const values: Record<string, unknown> = {};
      for (const field of tableDef.fields)
        if (!field.hidden || field.key === "image_position")
          values[field.key] = row[field.key];
        if ("year" in values) values.year = yearValue(row);
        if (tableDef.fields.some((f) => f.key === "color"))
          values.color = bgValue(row);
        if (!(await resolveImageUpload(tableDef.name, row, values))) return;
      const { data, error } = await supabase!
        .from(tableDef.name)
        .insert(values)
        .select()
        .single();
      if (!data || error) {
        setMessage(`Error: ${error?.message ?? "Insert gagal"}`);
        return;
      }
      discardDraft(tableDef.name, row.id);
      await loadRows(tableDef.name);
      setEditingId(String(data.id));
      setMessage("Saved.");
      return;
    }
    await updateRow(tableDef, row);
  }

  function editRow(table: string, id: number | string, key: string, value: string) {
    setRows((prev) => ({
      ...prev,
      [table]: prev[table].map((r) => (r.id === id ? { ...r, [key]: value } : r)),
    }));
  }

  function toggleMulti(
    table: string,
    id: number | string,
    key: string,
    option: string
  ) {
    setRows((prev) => ({
      ...prev,
      [table]: prev[table].map((r) => {
        if (r.id !== id) return r;
        const current = Array.isArray(r[key]) ? (r[key] as string[]) : [];
        return {
          ...r,
          [key]: current.includes(option)
            ? current.filter((v) => v !== option)
            : [...current, option],
        };
      }),
    }));
  }

  // pilih file -> hanya pratinjau lokal; konversi WebP + upload ke storage
  // terjadi saat Save (lewat resolveImageUpload)
  async function uploadImage(table: string, id: number | string, file: File) {
    try {
      const data = await compressImage(file);
      editRow(table, id, "image", data);
      setMessage("Pratinjau dimuat. Klik Save untuk menyimpan.");
    } catch (e) {
      setMessage(`Error: ${(e as Error).message}`);
    }
  }

  if (!supabase) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-center max-w-md text-black dark:text-white italic">
          Supabase belum dikonfigurasi. Isi{" "}
          <code className="text-a-2">NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
          <code className="text-a-2">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di{" "}
          <code className="text-a-2">.env.local</code>, lalu restart dev server.
        </p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-black">
        <form
          onSubmit={signIn}
          className="flex flex-col gap-3 w-full max-w-xs border border-gray-200 dark:border-gray-800 p-6"
        >
          <h1 className="font-bold text-xl text-a-2">Admin Login</h1>
          <input
            className={inputClass}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={inputClass}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-a-2 text-white font-bold py-2 hover:opacity-90 duration-300"
          >
            Sign in
          </button>
          {message && <p className="text-red-500 text-sm">{message}</p>}
        </form>
      </main>
    );
  }

  const table = TABLES.find((t) => t.name === activeTable)!;

  // editor detail untuk satu baris; dirender melorot di bawah item list yang diedit
  const renderEditor = (row: Row) => {
    const dirty = isDirty(table.name, row);
    return (
      <>
        <div className="flex flex-wrap gap-x-4 gap-y-3 items-end">
          {table.fields.map((field) => {
            // hidden fields are managed by other controls
            // (kecuali color: punya editor color picker sendiri)
            if (field.hidden && field.key !== "color") return null;

            // image: preview (drag to pan) + upload + rotate/zoom sliders
            if (field.key === "image") {
              const hasTransform = table.fields.some(
                (f) => f.key === "image_position"
              );
              const rot = Number(row.image_rotate) || 0;
              const zoom = Number(row.image_scale) || 100;
              return (
                <div key={field.key} className="w-full">
                  <span className="text-xs font-semibold opacity-70">
                    Image {hasTransform && "(drag gambar untuk menggeser)"}
                  </span>
                  <div className="flex flex-col sm:flex-row gap-3 mt-1">
                    {/* preview pakai rasio yang sama dengan kartu di halaman works */}
                    <div className="sm:w-72 w-full aspect-[16/7] border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
                      <PannableImage
                        src={String(row.image ?? "")}
                        position={String(row.image_position || "0% 0%")}
                        rotate={rot}
                        scale={zoom / 100}
                        interactive={hasTransform}
                        onPositionChange={
                          hasTransform
                            ? (pos) =>
                                editRow(table.name, row.id, "image_position", pos)
                            : undefined
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2 grow text-sm">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(table.name, row.id, file);
                          e.target.value = "";
                        }}
                      />
                      <input
                        className={inputClass}
                        value={String(row.image ?? "")}
                        onChange={(e) =>
                          editRow(table.name, row.id, "image", e.target.value)
                        }
                        placeholder="/path/atau/URL"
                      />
                      {hasTransform && (
                        <>
                          <label className="flex items-center gap-2">
                            <span className="text-xs opacity-70 w-12">Rotasi</span>
                            <input
                              type="range"
                              min={-180}
                              max={180}
                              step={1}
                              value={rot}
                              onChange={(e) =>
                                editRow(
                                  table.name,
                                  row.id,
                                  "image_rotate",
                                  e.target.value
                                )
                              }
                              className="grow"
                            />
                            <span className="text-xs w-10 text-right">{rot}°</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <span className="text-xs opacity-70 w-12">Zoom</span>
                            <input
                              type="range"
                              min={67}
                              max={300}
                              step={1}
                              value={zoom}
                              onChange={(e) =>
                                editRow(
                                  table.name,
                                  row.id,
                                  "image_scale",
                                  e.target.value
                                )
                              }
                              className="grow"
                            />
                            <span className="text-xs w-10 text-right">{zoom}%</span>
                          </label>
                          <p className="text-[11px] opacity-60">
                            Drag gambar untuk geser; perubahan tersimpan setelah klik
                            Save.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // year: two date inputs + "Present" checkbox
            if (field.key === "year") {
              return (
                <div key={field.key} className="flex flex-col gap-1">
                  <span className="text-xs font-semibold opacity-70">Year</span>
                  <div className="flex gap-2 items-center text-sm">
                    <input
                      type="date"
                      className={inputClass}
                      value={String(row.__yf ?? "")}
                      onChange={(e) =>
                        editRow(table.name, row.id, "__yf", e.target.value)
                      }
                    />
                    <span className="opacity-60">-</span>
                    <input
                      type="date"
                      className={inputClass}
                      value={String(row.__yt ?? "")}
                      disabled={Boolean(row.__yp)}
                      onChange={(e) =>
                        editRow(table.name, row.id, "__yt", e.target.value)
                      }
                    />
                    <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={Boolean(row.__yp)}
                        onChange={(e) =>
                          editRow(
                            table.name,
                            row.id,
                            "__yp",
                            e.target.checked ? "1" : ""
                          )
                        }
                      />
                      Present
                    </label>
                  </div>
                </div>
              );
            }

            // background builder: color picker, mode solid/gradient + titik warna
            if (field.key === "color") {
              const stops = Array.isArray(row.__bgStops)
                ? (row.__bgStops as string[])
                : [];
              const angle = Number(row.__bgAngle) || 135;
              const gradient = stops.length > 1;
              const setStops = (next: string[]) =>
                editRow(table.name, row.id, "__bgStops", next as unknown as string);
              const hex = (c: string) =>
                /^#[0-9a-fA-F]{6}$/.test(c) ? c : "#000000";
              return (
                <div key={field.key} className="w-full">
                  <span className="text-xs font-semibold opacity-70">
                    Background
                  </span>
                  <div className="flex flex-wrap items-center gap-3 text-sm py-1.5">
                    <div
                      className="h-10 w-20 rounded border border-gray-300 dark:border-gray-700 shrink-0"
                      style={{ background: bgValue(row) }}
                    />
                    <select
                      className={`${inputClass} w-auto`}
                      value={gradient ? "gradient" : "solid"}
                      onChange={(e) => {
                        if (e.target.value === "gradient") {
                          if (!gradient)
                            setStops([stops[0] ?? "#374151", "#6B7280"]);
                        } else setStops([stops[0] ?? "#374151"]);
                      }}
                    >
                      <option value="solid">Solid</option>
                      <option value="gradient">Gradient</option>
                    </select>
                    {gradient && (
                      <label className="flex items-center gap-2">
                        <span className="text-xs opacity-70">Sudut</span>
                        <input
                          type="range"
                          min={0}
                          max={360}
                          value={angle}
                          onChange={(e) =>
                            editRow(table.name, row.id, "__bgAngle", e.target.value)
                          }
                          className="w-24"
                        />
                        <span className="text-xs w-10 text-right">{angle}°</span>
                      </label>
                    )}
                    {stops.map((c, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <input
                          type="color"
                          value={hex(c)}
                          onChange={(e) => {
                            const next = [...stops];
                            next[i] = e.target.value;
                            setStops(next);
                          }}
                          className="h-8 w-10 cursor-pointer"
                        />
                        {gradient && stops.length > 2 && (
                          <button
                            onClick={() =>
                              setStops(stops.filter((_, j) => j !== i))
                            }
                            className="text-red-500 text-lg leading-none"
                            title="Hapus titik warna"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    {gradient && (
                      <button
                        onClick={() => setStops([...stops, "#FFFFFF"])}
                        className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-900 duration-300"
                      >
                        + Titik
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            // multi-select: checkboxes, full-width row so nothing gets squeezed
            if (field.options && field.multi) {
              const current = Array.isArray(row[field.key])
                ? (row[field.key] as string[])
                : [];
              return (
                <div key={field.key} className="w-full">
                  <span className="text-xs font-semibold opacity-70">
                    {field.label}
                  </span>
                  <div className="flex gap-4 text-sm py-1.5">
                    {field.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={current.includes(opt)}
                          onChange={() =>
                            toggleMulti(table.name, row.id, field.key, opt)
                          }
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              );
            }

            if (field.options) {
              return (
                <label key={field.key} className="flex flex-col gap-1">
                  <span className="text-xs font-semibold opacity-70">
                    {field.label}
                  </span>
                  <select
                    className={inputClass}
                    value={String(row[field.key] ?? "")}
                    onChange={(e) =>
                      editRow(table.name, row.id, field.key, e.target.value)
                    }
                  >
                    <option value="">-</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            return (
              <label
                key={field.key}
                className="flex flex-col gap-1 grow min-w-[160px]"
              >
                <span className="text-xs font-semibold opacity-70">
                  {field.label}
                </span>
                <input
                  className={inputClass}
                  value={String(row[field.key] ?? "")}
                  onChange={(e) =>
                    editRow(table.name, row.id, field.key, e.target.value)
                  }
                />
              </label>
            );
          })}
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() =>
              askConfirm(
                String(row.id).startsWith("draft-")
                  ? "Tambah data baru?"
                  : "Simpan perubahan?",
                `"${String(row.name || "-")}" ${
                  String(row.id).startsWith("draft-")
                    ? `akan ditambahkan ke ${table.label}.`
                    : `akan diperbarui di ${table.label}.`
                }`,
                () => saveRow(table, row),
                "Save"
              )
            }
            disabled={!dirty}
            className={`bg-a-2 text-white px-3 py-1.5 text-sm duration-300 ${
              dirty ? "hover:opacity-90" : "opacity-40 cursor-not-allowed"
            }`}
          >
            Save
          </button>
          <button
            onClick={() =>
              askConfirm(
                "Hapus data?",
                `"${String(row.name ?? "-")}" akan dihapus permanen dari ${table.label}.`,
                () => deleteRow(table.name, row.id),
                "Ya, hapus"
              )
            }
            className="border border-red-400 text-red-500 px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-950 duration-300"
          >
            Delete
          </button>
        </div>
      </>
    );
  };

  return (
    <main className="h-screen overflow-y-auto scrollbar-hide p-6 bg-white dark:bg-black text-black dark:text-white">
      <PageHead title="Admin" noindex />
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-2xl text-a-2 italic">Content Admin</h1>
          <button
            onClick={() => supabase!.auth.signOut()}
            className="border border-gray-300 dark:border-gray-700 px-4 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-900 duration-300"
          >
            Sign out
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {TABLES.map((t) => (
            <button
              key={t.name}
              onClick={() => switchTab(t.name)}
              className={`px-4 py-1.5 text-sm italic duration-300 ${
                activeTable === t.name
                  ? "bg-a-2 text-white font-bold"
                  : "border border-gray-300 dark:border-gray-700 opacity-60 hover:opacity-100"
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={() => switchTab("settings")}
            className={`px-4 py-1.5 text-sm italic duration-300 ${
              activeTable === "settings"
                ? "bg-a-2 text-white font-bold"
                : "border border-gray-300 dark:border-gray-700 opacity-60 hover:opacity-100"
            }`}
          >
            Settings
          </button>
        </div>

        {message && <p className="mb-4 text-sm text-a-2">{message}</p>}

        {activeTable === "settings" ? (
          <div className="flex flex-col gap-4 max-w-2xl">
            {SETTING_FIELDS.map((field) => (
              <label key={field.key} className="flex flex-col gap-1">
                <span className="text-xs font-semibold opacity-70">
                  {field.label}
                </span>
                {field.textarea ? (
                  <textarea
                    className={inputClass}
                    rows={3}
                    value={settingsValues[field.key] ?? ""}
                    onChange={(e) =>
                      setSettingsValues((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <input
                    className={inputClass}
                    value={settingsValues[field.key] ?? ""}
                    onChange={(e) =>
                      setSettingsValues((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                  />
                )}
                {field.upload && (
                  <input
                    type="file"
                    accept={field.upload}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) previewTo(field.key, file);
                      e.target.value = "";
                    }}
                  />
                )}
              </label>
            ))}
            <button
              onClick={() =>
                askConfirm(
                  "Simpan settings?",
                  "Perubahan settings akan disimpan dan langsung tampil di halaman publik.",
                  saveSettings,
                  "Save"
                )
              }
              disabled={!settingsDirty}
              className={`self-start bg-a-2 text-white px-4 py-1.5 text-sm font-bold duration-300 ${
                settingsDirty ? "hover:opacity-90" : "opacity-40 cursor-not-allowed"
              }`}
            >
              Save
            </button>
          </div>
        ) : (
        <>

        <button
          onClick={() => startAdd(table)}
          className="mb-4 bg-a-2 text-white px-4 py-1.5 text-sm font-bold hover:opacity-90 duration-300"
        >
          + Add
        </button>
        {/* ===== list; editor melorot (animasi) di bawah item yang diedit =====
            tabel dengan kolom group_name/category otomatis dikelompokkan dan
            bisa di-minimize per grup */}
        {(() => {
          const allRows = rows[table.name] ?? [];
          const groupField = table.fields.find(
            (f) => !f.multi && (f.key === "group_name" || f.key === "category")
          );

          const renderRowItem = (row: Row) => {
            const category = Array.isArray(row.category)
              ? (row.category as string[]).join(", ")
              : String(row.group_name ?? row.category ?? "");
            const subtitle = [category, String(row.year ?? "")]
              .filter(Boolean)
              .join(" • ");
            const isOpen = String(row.id) === editingId;
            return (
              <div
                key={row.id}
                className="border border-gray-200 dark:border-gray-800 -mt-px first:mt-0"
              >
                <div className="flex justify-between items-center gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      {String(row.name ?? "-")}
                    </p>
                    {!groupField && subtitle && (
                      <p className="text-xs opacity-60 truncate italic">
                        {subtitle}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() =>
                        isOpen
                          ? backToList(table.name)
                          : setEditingId(String(row.id))
                      }
                      className="bg-a-2 text-white px-3 py-1.5 text-sm hover:opacity-90 duration-300"
                    >
                      {isOpen ? "Tutup" : "Edit"}
                    </button>
                    <button
                      onClick={() =>
                        askConfirm(
                          "Hapus data?",
                          `"${String(row.name ?? "-")}" akan dihapus permanen dari ${table.label}.`,
                          () => deleteRow(table.name, row.id),
                          "Ya, hapus"
                        )
                      }
                      className="border border-red-400 text-red-500 px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-950 duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="m-4 mt-0">{renderEditor(row)}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          };

          // tanpa kolom grup -> list biasa
          if (!groupField) {
            return (
              <div className="flex flex-col">
                {allRows.map(renderRowItem)}
                {allRows.length === 0 && (
                  <p className="opacity-60 italic text-sm">Belum ada data.</p>
                )}
              </div>
            );
          }

          // kelompokkan sesuai urutan data, lalu tiap grup bisa diminimize
          const groups: { title: string; rows: Row[] }[] = [];
          for (const r of allRows) {
            const title = String(r[groupField.key] ?? "-") || "-";
            let g = groups.find((x) => x.title === title);
            if (!g) {
              g = { title, rows: [] };
              groups.push(g);
            }
            g.rows.push(r);
          }
          return (
            <div className="flex flex-col space-y-4">
              {groups.map(({ title, rows: groupRows }) => (
                <CollapsibleSection key={title} title={title}>
                  {groupRows.map(renderRowItem)}
                </CollapsibleSection>
              ))}
              {allRows.length === 0 && (
                <p className="opacity-60 italic text-sm">Belum ada data.</p>
              )}
            </div>
          );
        })()}
        </>
        )}

        <p className="mt-8 text-xs opacity-60 italic">
          Perubahan tampil di situs publik maksimal {60} detik setelah disimpan.
        </p>
      </div>

      {/* modal konfirmasi -- gaya halaman publik: heading italic lime,
          animasi framer-motion, garis dashed khas Background */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setConfirm(null)}
          >
            <motion.div
              className="relative w-full max-w-sm bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-8"
              initial={{ scale: 0.9, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 12, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-x-8 top-0 border-t border-dashed border-a-2/50" />
              <h2 className="font-bold text-xl italic text-a-2 pb-3">
                {confirm.title}
              </h2>
              <p className="text-sm opacity-70">{confirm.body}</p>
              <div className="flex items-center gap-4 mt-6">
                <button
                  autoFocus
                  onClick={() => {
                    const { action } = confirm;
                    setConfirm(null);
                    void action();
                  }}
                  className="bg-a-2 text-white px-4 py-1.5 text-sm font-bold hover:opacity-90 duration-300"
                >
                  {confirm.label ?? "Ya"}
                </button>
                <button
                  onClick={() => setConfirm(null)}
                  className="italic text-sm text-black dark:text-white opacity-60 hover:opacity-100 duration-300"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
