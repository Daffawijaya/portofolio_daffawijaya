-- ============================================================
-- Portfolio schema for Supabase
-- Paste this whole file into Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- ---------- Tables ----------
create table if not exists works (
  id bigint generated always as identity primary key,
  category text[] not null default '{}', -- bisa lebih dari satu, mis. {frontend,fullstack}
  name text not null,
  image text not null default '',
  url text not null default '',
  year text not null default '',
  image_position text not null default '', -- CSS background-position, mis. "50% 70%"; kosong = center
  image_rotate int not null default 0,     -- derajat, bebas -180..180
  image_scale int not null default 100,    -- persen zoom, 67 = fit penuh (min), 100 = normal
  sort_order int not null default 0
);

create table if not exists experiences (
  id bigint generated always as identity primary key,
  group_name text not null, -- Works / Education / Certification / Organization
  name text not null,
  image text not null default '',
  url text not null default '',
  year text not null default '',
  image_position text not null default '', -- "x% y%", kosong = center
  image_rotate int not null default 0,     -- derajat
  image_scale int not null default 100,    -- persen zoom, 67 = fit
  sort_order int not null default 0
);

create table if not exists techstack (
  id bigint generated always as identity primary key,
  category text not null, -- Programming Language / Web Development / Framework
  name text not null,
  icon text not null,     -- react-icons name, see lib/icons.ts
  color text not null default '#2D2D2D',
  sort_order int not null default 0
);

create table if not exists skills (
  id bigint generated always as identity primary key,
  name text not null,
  icon text not null,
  color text not null default '#2D2D2D',
  sort_order int not null default 0
);

create table if not exists contact_links (
  id bigint generated always as identity primary key,
  name text not null,
  image text not null default '', -- tailwind bg-[url(...)] class
  icon text not null,
  color text not null default '',
  url text not null default '',
  sort_order int not null default 0
);

-- ---------- RLS ----------
alter table works enable row level security;
alter table experiences enable row level security;
alter table techstack enable row level security;
alter table skills enable row level security;
alter table contact_links enable row level security;

-- public site: everyone can read
create policy "public read works" on works for select using (true);
create policy "public read experiences" on experiences for select using (true);
create policy "public read techstack" on techstack for select using (true);
create policy "public read skills" on skills for select using (true);
create policy "public read contact_links" on contact_links for select using (true);

-- admin panel: only logged-in users can write
create policy "admin write works" on works for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write experiences" on experiences for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write techstack" on techstack for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write skills" on skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write contact_links" on contact_links for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- Seed data (isi awal = konten yang sekarang tampil di situs)
-- ============================================================

insert into works (category, name, image, url, year, sort_order) values
  (array['frontend','fullstack'], 'etamhub: digital directory platform for UMKM in Kutai Kartanegara', '/EtamHub2.png', 'https://etamhub.vercel.app/', 'January 2026 - Present', 1),
  (array['frontend'], 'SIPP: Sistem Informasi Penataan dan Penaatan Kota Batu', '/batu.png', 'https://sipp-dev.vercel.app', 'August 2022 - December 2022', 2),
  (array['frontend'], 'UMM research network Re-engineering', '/experience/umm.png', 'http://ummrn-daffacindy.vercel.app/', 'February 2022 - November 2022', 3),
  (array['frontend'], 'SEAL Bounding Project: Todo List app for student', '/experience/seal2.png', 'https://mini-project-todolist-seal-5.vercel.app', 'June 2022 - August 2022', 4),
  (array['fullstack'], 'Kumala: Kutai Kartanegara UMKM Enterpreneur-hub Collaborator', '/experience/kumala.png', 'https://kumala.kukarkab.go.id/', 'Present', 5),
  (array['fullstack'], 'TerapiKu: Sistem Penjadwalan Pasien Rehabilitasi Medis RSUD AM Parikesit', '/experience/terapiku.png', 'https://www.figma.com/proto/AIDl4kL0bSoXVtWyRAn4hl/TA?node-id=2994-10970&starting-point-node-id=2593%3A7694', '2025', 6),
  (array['uiux'], 'TerapiKu: Sistem Penjadwalan Pasien Rehabilitasi Medis RSUD AM Parikesit', '/experience/terapiku.png', 'https://www.figma.com/proto/AIDl4kL0bSoXVtWyRAn4hl/TA?node-id=2994-10970&starting-point-node-id=2593%3A7694', '2024', 7);

insert into experiences (group_name, name, image, url, year, sort_order) values
  ('Works', 'Dinas Koperasi dan UKM Kutai Kartanegara', '/experience/diskopukm.png', 'https://etamhub.vercel.app', 'June 2025 - Present', 1),
  ('Works', 'AWS × Social Economic Accelerator Lab', '/experience/seal2.png', 'https://seal.or.id/', 'August 2022 - December 2022', 2),
  ('Education', 'Muhammadiyah Malang University', '/experience/umm.png', 'https://www.umm.ac.id/', 'August 2019 - January 2025', 1),
  ('Education', 'SMA Negeri 3 Unggulan Tenggarong', '/experience/smaga.png', 'http://www.sman3tenggarong.sch.id/', 'July 2016 - June 2019', 2),
  ('Certification', 'SEAL Internship Graduate', '/experience/seal2.png', 'https://drive.google.com/file/d/1kA6ukvDQoVK4PAAmr2n_N-OeKnwLoxuw/view', 'December 2022', 1),
  ('Certification', 'AWS Academy Cloud Architecting', '/experience/aws.jpg', 'https://www.credly.com/badges/1c7ecf10-0045-4431-9791-d43ec0e1ac0c/linked_in_profile', 'November 2022', 2),
  ('Certification', 'IC3 Digital Literacy', '/experience/IC3.png', 'https://drive.google.com/file/d/1FiavmAuL1vkFKUZi4xMWKIjpFSNKOimw/view', 'November 2019', 3),
  ('Organization', 'Ikasti', '/experience/ikasto.png', 'https://www.instagram.com/ikastiofficial/', 'August 2020 - July 2022', 1),
  ('Organization', 'OSIS', '/experience/osis.jpg', 'https://www.instagram.com/ospk_smagatgr/', 'July 2017 - June 2018', 2);

insert into techstack (category, name, icon, color, sort_order) values
  ('Programming Language', 'Javascript', 'SiJavascript', '#EAD41C', 1),
  ('Programming Language', 'Typescript', 'SiTypescript', '#2F72BC', 2),
  ('Programming Language', 'PHP', 'SiPhp', '#777bb3', 3),
  ('Web Development', 'React JS', 'SiReact', '#61DAFB', 1),
  ('Web Development', 'HTML', 'SiHtml5', '#E34F26', 2),
  ('Web Development', 'CSS', 'SiCss3', '#1572B6', 3),
  ('Web Development', 'Tailwind', 'SiTailwindcss', '#06B6D4', 4),
  ('Web Development', 'Chakra UI', 'SiChakraui', '#319795', 5),
  ('Web Development', 'Bootstrap', 'SiBootstrap', '#7952B3', 6),
  ('Web Development', 'Framer Motion', 'SiFramer', '#0055FF', 7),
  ('Web Development', 'Redux', 'SiRedux', '#764ABC', 8),
  ('Web Development', 'PostgreSQL', 'SiPostgresql', '#4169E1', 9),
  ('Web Development', 'Supabase', 'SiSupabase', '#3ECF8E', 10),
  ('Framework', 'Next JS', 'SiNextdotjs', '#7046B3', 1),
  ('Framework', 'Vue JS', 'FaVuejs', '#41b883', 2),
  ('Framework', 'Laravel', 'IoLogoLaravel', '#f63003', 3);

insert into skills (name, icon, color, sort_order) values
  ('Python', 'SiPython', '#F2B92F', 1),
  ('C', 'SiCsharp', '#045494', 2),
  ('Arduino', 'SiArduino', '#009297', 3),
  ('Figma', 'SiFigma', '#09C47C', 4),
  ('Coreldraw', 'HiPencil', '#5AA141', 5),
  ('Canva', 'SiCanva', '#446fdd', 6),
  ('Photoshop', 'SiAdobephotoshop', '#154973', 7),
  ('Premiere', 'SiAdobepremierepro', '#0c0c8c', 8),
  ('Sketchup', 'SiSketchup', '#015ea3', 9),
  ('Blender', 'SiBlender', '#DE7000', 10),
  ('Excel', 'RiFileExcel2Fill', '#0c7238', 11),
  ('Word', 'RiFileWord2Fill', '#1b5fbf', 12);

insert into contact_links (name, image, icon, color, url, sort_order) values
  ('Daffa Wijaya', 'bg-[url(/icon/li.png)]', 'SiLinkedin', 'hover:text-[#EAD41C]', 'https://www.linkedin.com/in/daffa-wijaya-621a04255/', 1),
  ('@daffawijayaaa', 'bg-[url(/icon/ig.jpg)]', 'SiInstagram', 'hover:text-[#EAD41C]', 'https://www.instagram.com/daffawijayaaa/', 2),
  ('Daffawijaya', 'bg-[url(/icon/gh.png)]', 'SiGithub', 'hover:text-[#2F72BC]', 'https://github.com/Daffawijaya', 3);
