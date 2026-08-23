-- ============================================================
-- Site settings (key-value): posisi/tagline, teks about, CV,
-- alamat kontak, dan link Google Maps.
-- Paste ke Supabase Dashboard > SQL Editor > Run
-- ============================================================

create table if not exists settings (
  key text primary key,
  value text not null default ''
);

alter table settings enable row level security;

create policy "public read settings" on settings for select using (true);
create policy "admin write settings" on settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into settings (key, value) values
  ('position', 'Web Developer'),
  ('about_image', '/dafanoanting.png'),
  ('about_text', '"Passionate about fullstack web and mobile development, leveraging AI to build responsive, user-friendly applications and solve real-world problems through practical projects.'),
  ('cv_url', 'https://drive.google.com/file/d/1JJzxZVgSfaoVXRh2cc9ShLaGczQHXJzv/view?usp=sharing'),
  ('contact_country', 'Indonesia'),
  ('contact_address', 'Dusun Rambaan 31, Landungsari, Dau, Malang Regency, East Java'),
  ('map_url', 'https://goo.gl/maps/NBknBQpL43MXpbrb9')
on conflict (key) do nothing;
