import { supabase } from "./supabase";
import frontendData from "../data/frontendData";
import fullstackData from "../data/fullstackData";
import uiuxData from "../data/uiuxData";
import experienceData from "../data/experienceData";
import techstackData from "../data/techstackData";
import skillsData from "../data/skillsData";
import { contactLinksData } from "../data/contactData";

export interface WorkItem {
  category: string[]; // bisa lebih dari satu, mis. ["frontend", "fullstack"]
  name: string;
  image: string;
  url: string;
  year: string;
  image_position?: string; // CSS background-position; kosong = center
  image_rotate?: number; // derajat rotasi bebas
  image_scale?: number; // zoom dalam persen, 100 = normal
}

export interface ExperienceItem {
  name: string;
  image: string;
  url: string;
  year: string;
  image_position?: string; // CSS pan offset "x% y%"
  image_rotate?: number; // derajat
  image_scale?: number; // persen zoom
}

export interface ExperienceGroup {
  title: string;
  items: ExperienceItem[];
}

export interface TechItem {
  name: string;
  icon: string; // react-icons name, resolved via lib/icons.ts
  color: string;
}

export interface TechCategory {
  title: string;
  items: TechItem[];
}

export interface ContactLink {
  name: string;
  image: string;
  icon: string;
  color: string;
  url: string;
}

const REVALIDATE = 60; // seconds until edited content shows on the public site

// fallback saat Supabase belum diisi / tabel kosong
export const SETTINGS_DEFAULTS: Record<string, string> = {
  position: "Web Developer",
  about_image: "/dafanoanting.png",
  about_text:
    '"Passionate about fullstack web and mobile development, leveraging AI to build responsive, user-friendly applications and solve real-world problems through practical projects.',
  cv_url:
    "https://drive.google.com/file/d/1JJzxZVgSfaoVXRh2cc9ShLaGczQHXJzv/view?usp=sharing",
  contact_country: "Indonesia",
  contact_address:
    "Dusun Rambaan 31, Landungsari, Dau, Malang Regency, East Java",
  map_url: "https://goo.gl/maps/NBknBQpL43MXpbrb9",
};

export async function getSettings(): Promise<Record<string, string>> {
  if (supabase) {
    const { data } = await supabase.from("settings").select("key, value");
    if (data && data.length > 0)
      return {
        ...SETTINGS_DEFAULTS,
        ...Object.fromEntries(data.map((r) => [r.key, r.value])),
      };
  }
  return SETTINGS_DEFAULTS;
}

function group<T extends Record<string, unknown>>(
  rows: T[],
  groupKey: string,
  titleKey = "title"
): { title: string; items: T[] }[] {
  const groups: { title: string; items: T[] }[] = [];
  for (const row of rows) {
    const title = row[groupKey] as string;
    let group = groups.find((g) => g.title === title);
    if (!group) {
      group = { title, items: [] };
      groups.push(group);
    }
    group.items.push(row);
  }
  return groups.map(({ title, items }) => ({ [titleKey]: title, items })) as {
    title: string;
    items: T[];
  }[];
}

export async function getWorks(): Promise<WorkItem[]> {
  if (supabase) {
    const { data } = await supabase
      .from("works")
      .select("category, name, image, url, year, image_position, image_rotate, image_scale")
      .order("sort_order");
    if (data && data.length > 0) return data;
  }
  return [...frontendData, ...fullstackData, ...uiuxData];
}

export async function getExperiences(): Promise<ExperienceGroup[]> {
  if (supabase) {
    const { data } = await supabase
      .from("experiences")
      .select("group_name, name, image, url, year, image_position, image_rotate, image_scale")
      .order("sort_order");
    if (data && data.length > 0) return group(data, "group_name");
  }
  return experienceData;
}

export async function getTechstack(): Promise<TechCategory[]> {
  if (supabase) {
    const { data } = await supabase
      .from("techstack")
      .select("category, name, icon, color")
      .order("sort_order");
    if (data && data.length > 0) return group(data, "category");
  }
  return techstackData;
}

export async function getSkills(): Promise<TechItem[]> {
  if (supabase) {
    const { data } = await supabase
      .from("skills")
      .select("name, icon, color")
      .order("sort_order");
    if (data && data.length > 0) return data;
  }
  return skillsData;
}

export async function getContactLinks(): Promise<ContactLink[]> {
  if (supabase) {
    const { data } = await supabase
      .from("contact_links")
      .select("name, image, icon, color, url")
      .order("sort_order");
    if (data && data.length > 0) return data;
  }
  return contactLinksData;
}

export { REVALIDATE };
