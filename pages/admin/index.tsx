import { useEffect, useState } from "react";
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
        options: ["frontend", "fullstack", "uiux"],
        multi: true,
      },
      { key: "name", label: "Name" },
      { key: "image", label: "Image" },
      { key: "url", label: "URL" },
      { key: "year", label: "Year" },
      { key: "image_position", label: "Image Position", hidden: true },
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
    const { data } = await supabase.from(table).select("*").order("id");
    setRows((prev) => ({
      ...prev,
      [table]: (data ?? []).map((r) => ({ ...r, ...parseYearParts(r.year) })),
    }));
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
    values.sort_order = row.sort_order ?? 0;
    const { error } = await supabase!
      .from(tableDef.name)
      .update(values)
      .eq("id", row.id);
    setMessage(error ? `Error: ${error.message}` : "Saved.");
  }

  async function deleteRow(table: string, id: number | string) {
    setMessage("");
    const { error } = await supabase!.from(table).delete().eq("id", id);
    if (!error) loadRows(table);
    else setMessage(`Error: ${error.message}`);
  }

  async function addRow(table: TableDef) {
    setMessage("");
    // start every column empty; sort_order goes last so it appears at the end
    const values = Object.fromEntries([
      ...table.fields.map((f) => [f.key, ""]),
      ["sort_order", 0],
    ]);
    const { error } = await supabase!.from(table.name).insert(values);
    if (!error) loadRows(table.name);
    else setMessage(`Error: ${error.message}`);
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

  // set image_position ("x% y%") from the preview sliders
  function setImagePosition(
    table: string,
    id: number | string,
    axis: "x" | "y",
    value: number
  ) {
    setRows((prev) => ({
      ...prev,
      [table]: prev[table].map((r) => {
        if (r.id !== id) return r;
        const [x = 50, y = 50] = String(r.image_position || "50% 50%")
          .split(" ")
          .map((v) => parseInt(v) || 50);
        const pos = axis === "x" ? `${value}% ${y}%` : `${x}% ${value}%`;
        return { ...r, image_position: pos };
      }),
    }));
  }

  async function uploadImage(table: string, id: number | string, file: File) {
    setMessage("Uploading...");
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

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
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
              onClick={() => setActiveTable(t.name)}
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
          onClick={() => addRow(table)}
          className="mb-4 bg-a-2 text-white px-4 py-1.5 text-sm font-bold hover:opacity-90 duration-300"
        >
          + Add
        </button>

        <div className="flex flex-col gap-6">
          {(rows[table.name] ?? []).map((row) => (
            <div
              key={row.id}
              className="border border-gray-200 dark:border-gray-800 p-4"
            >
              <div className="flex flex-wrap gap-x-4 gap-y-3 items-end">
                {table.fields.map((field) => {
                  // hidden fields are managed by other controls
                  if (field.hidden) return null;

                  // image: preview + upload + focal point sliders
                  if (field.key === "image") {
                    const hasPosition = table.fields.some(
                      (f) => f.key === "image_position"
                    );
                    const [px = 50, py = 50] = String(
                      row.image_position || "50% 50%"
                    )
                      .split(" ")
                      .map((v) => parseInt(v) || 50);
                    return (
                      <div key={field.key} className="w-full">
                        <span className="text-xs font-semibold opacity-70">
                          Image
                        </span>
                        <div className="flex flex-col sm:flex-row gap-3 mt-1">
                          {/* preview pakai rasio yang sama dengan kartu di halaman works */}
                          <div
                            className="sm:w-72 w-full aspect-[16/7] border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 bg-cover"
                            style={{
                              backgroundImage: row.image
                                ? `url(${row.image})`
                                : undefined,
                              backgroundPosition:
                                String(row.image_position || "") || "center",
                            }}
                          />
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
                                editRow(
                                  table.name,
                                  row.id,
                                  "image",
                                  e.target.value
                                )
                              }
                              placeholder="/path/atau/URL"
                            />
                            {hasPosition && (
                              <>
                                <label className="flex items-center gap-2">
                                  <span className="text-xs opacity-70 w-10">
                                    Pos X
                                  </span>
                                  <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={px}
                                    onChange={(e) =>
                                      setImagePosition(
                                        table.name,
                                        row.id,
                                        "x",
                                        Number(e.target.value)
                                      )
                                    }
                                    className="grow"
                                  />
                                </label>
                                <label className="flex items-center gap-2">
                                  <span className="text-xs opacity-70 w-10">
                                    Pos Y
                                  </span>
                                  <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={py}
                                    onChange={(e) =>
                                      setImagePosition(
                                        table.name,
                                        row.id,
                                        "y",
                                        Number(e.target.value)
                                      )
                                    }
                                    className="grow"
                                  />
                                </label>
                                <p className="text-[11px] opacity-60">
                                  Preview mengikuti rasio kartu works; posisi
                                  tersimpan setelah klik Save.
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
                        <span className="text-xs font-semibold opacity-70">
                          Year
                        </span>
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
                    <label key={field.key} className="flex flex-col gap-1 grow min-w-[160px]">
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
                  onClick={() => updateRow(table, row)}
                  className="bg-a-2 text-white px-3 py-1.5 text-sm hover:opacity-90 duration-300"
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
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs opacity-60 italic">
          Perubahan tampil di situs publik maksimal {60} detik setelah disimpan.
        </p>
      </div>
    </main>
  );
}
