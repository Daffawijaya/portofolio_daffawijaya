import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { ICONS } from "../../lib/icons";
import PageHead from "../../components/PageHead";

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
    ],
  },
  {
    name: "techstack",
    label: "Techstack",
    fields: [
      {
        key: "category",
        label: "Category",
        options: ["Programming Language", "Web Development", "Framework"],
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
      { key: "image", label: "Image class" },
      { key: "icon", label: "Icon", options: Object.keys(ICONS).sort() },
      { key: "color", label: "Color" },
      { key: "url", label: "URL" },
    ],
  },
];

type Row = Record<string, unknown> & { id: number | string };
type Rows = Record<string, Row[]>;

const inputClass =
  "w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white text-black";

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

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [activeTable, setActiveTable] = useState(TABLES[0].name);
  const [rows, setRows] = useState<Rows>({});
  // snapshot per row (json string) untuk mendeteksi apakah ada perubahan
  const [originals, setOriginals] = useState<
    Record<string, Record<string, string>>
  >({});
  // id row yang sedang dibuka di editor detail; null = tampilan list
  const [editingId, setEditingId] = useState<string | null>(null);
  // cache-buster per row so rotated images refresh in the preview
  const [imageBust, setImageBust] = useState<Record<string, number>>({});

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
      .map((r) => ({ ...r, ...parseYearParts(r.year) }))
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

  useEffect(() => {
    if (session) loadRows(activeTable);
  }, [session, activeTable]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setMessage(error.message);
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
      setImageBust((prev) => ({ ...prev, [String(data.id)]: prev[String(row.id)] ?? 0 }));
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

  // drag-to-pan: convert pointer movement into background-position percentages
  const dragRef = useRef<{
    key: string;
    startX: number;
    startY: number;
    px: number;
    py: number;
  } | null>(null);

  const clampPan = (v: number, zoom: number) => {
    // keep the oversized layer covering the frame: max pan depends on zoom
    const limit = Math.max(0, (75 * (zoom / 100) - 50) / 1.5);
    return Math.round(Math.max(-limit, Math.min(limit, v)));
  };

  function parsePos(row: Row): [number, number] {
    const [x = 0, y = 0] = String(row.image_position || "")
      .split(" ")
      .map((v) => parseFloat(v) || 0);
    return [x, y];
  }

  function previewPointerDown(e: React.PointerEvent, table: string, row: Row) {
    const [px, py] = parsePos(row);
    dragRef.current = {
      key: `${table}:${row.id}`,
      startX: e.clientX,
      startY: e.clientY,
      px,
      py,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function previewPointerMove(e: React.PointerEvent, table: string, row: Row) {
    const d = dragRef.current;
    if (!d || d.key !== `${table}:${row.id}`) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = ((e.clientX - d.startX) / rect.width) * 100;
    const dy = ((e.clientY - d.startY) / rect.height) * 100;
    const zoom = Number(row.image_scale) || 100;
    editRow(
      table,
      row.id,
      "image_position",
      `${clampPan(d.px + dx, zoom)}% ${clampPan(d.py + dy, zoom)}%`
    );
  }

  // set image_position ("x% y%") from the preview sliders

  // rotate the stored webp 90° clockwise, overwriting the same file
  async function rotateImage(table: string, id: number | string, url: string) {
    setMessage("Memutar gambar...");
    try {
      const res = await fetch("/api/rotate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Rotate gagal");
      setImageBust((prev) => ({ ...prev, [String(id)]: Date.now() }));
      setMessage("Gambar diputar 90°. Posisi slider bisa disesuaikan lagi.");
    } catch (e) {
      setMessage(`Error: ${(e as Error).message}`);
    }
  }

  async function uploadImage(table: string, id: number | string, file: File) {    setMessage("Uploading...");
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify({ name: file.name, data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload gagal");
      editRow(table, id, "image", json.url);
      setMessage("Upload berhasil. Klik Save untuk menyimpan.");
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
        <span className="block text-xs opacity-50 mb-3">id: {String(row.id)}</span>

        <div className="flex flex-wrap gap-x-4 gap-y-3 items-end">
          {table.fields.map((field) => {
            // hidden fields are managed by other controls
            if (field.hidden) return null;

            // image: preview (drag to pan) + upload + rotate/zoom sliders
            if (field.key === "image") {
              const hasTransform = table.fields.some(
                (f) => f.key === "image_position"
              );
              const bust = imageBust[String(row.id)];
              const imageUrl = String(row.image ?? "");
              const previewUrl =
                imageUrl && bust
                  ? `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}v=${bust}`
                  : imageUrl;
              const [px, py] = parsePos(row);
              const rot = Number(row.image_rotate) || 0;
              const zoom = Number(row.image_scale) || 100;
              return (
                <div key={field.key} className="w-full">
                  <span className="text-xs font-semibold opacity-70">
                    Image {hasTransform && "(drag gambar untuk menggeser)"}
                  </span>
                  <div className="flex flex-col sm:flex-row gap-3 mt-1">
                    {/* preview pakai rasio yang sama dengan kartu di halaman works */}
                    <div
                      className={
                        "relative sm:w-72 w-full aspect-[16/7] border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 overflow-hidden select-none touch-none " +
                        (hasTransform ? "cursor-grab active:cursor-grabbing" : "")
                      }
                      onPointerDown={(e) =>
                        hasTransform && previewPointerDown(e, table.name, row)
                      }
                      onPointerMove={(e) =>
                        hasTransform && previewPointerMove(e, table.name, row)
                      }
                      onPointerUp={() => (dragRef.current = null)}
                      onPointerCancel={() => (dragRef.current = null)}
                    >
                      {/* -inset-1/4: layer lebih besar supaya sudut tetap tertutup */}
                      <div
                        className="absolute -inset-1/4 bg-cover bg-center pointer-events-none"
                        style={{
                          backgroundImage: previewUrl
                            ? `url(${previewUrl})`
                            : undefined,
                          transform: `translate(${px}%, ${py}%) rotate(${rot}deg) scale(${zoom / 100})`,
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2 grow text-sm">
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadImage(table.name, row.id, file);
                            e.target.value = "";
                          }}
                        />
                        {!!row.image && (
                          <button
                            type="button"
                            onClick={() =>
                              rotateImage(table.name, row.id, String(row.image))
                            }
                            className="border border-gray-300 dark:border-gray-700 px-3 py-1 whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-900 duration-300"
                          >
                            ⟳ Putar 90°
                          </button>
                        )}
                      </div>
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
            onClick={() => saveRow(table, row)}
            disabled={!dirty}
            className={`bg-a-2 text-white px-3 py-1.5 text-sm duration-300 ${
              dirty ? "hover:opacity-90" : "opacity-40 cursor-not-allowed"
            }`}
          >
            Save
          </button>
          <button
            onClick={() => deleteRow(table.name, row.id)}
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
      <PageHead title="Admin" />
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
        </div>

        {message && <p className="mb-4 text-sm text-a-2">{message}</p>}

        <button
          onClick={() => startAdd(table)}
          className="mb-4 bg-a-2 text-white px-4 py-1.5 text-sm font-bold hover:opacity-90 duration-300"
        >
          + Add
        </button>

        {/* ===== list; editor melorot (animasi) di bawah item yang diedit ===== */}
        <div className="flex flex-col">
          {(rows[table.name] ?? []).map((row) => {
            const category = Array.isArray(row.category)
              ? (row.category as string[]).join(", ")
              : String(row.group_name ?? row.category ?? "");
            const subtitle =
              [category, String(row.year ?? "")].filter(Boolean).join(" • ") ||
              String(row.color ?? "");
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
                    {subtitle && (
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
                      onClick={() => deleteRow(table.name, row.id)}
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
          })}
          {(rows[table.name] ?? []).length === 0 && (
            <p className="opacity-60 italic text-sm">Belum ada data.</p>
          )}
        </div>

        <p className="mt-8 text-xs opacity-60 italic">
          Perubahan tampil di situs publik maksimal {60} detik setelah disimpan.
        </p>
      </div>
    </main>
  );
}
