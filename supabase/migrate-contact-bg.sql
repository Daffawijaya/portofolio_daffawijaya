-- ============================================================
-- Background sosmed di halaman Contact kini berupa CSS color /
-- gradient (kolom `color`), bukan lagi class Tailwind di kolom
-- `image` (yang tidak tampil karena dibuat runtime).
-- Paste ke Supabase Dashboard > SQL Editor > Run
-- ============================================================

update contact_links set color = 'linear-gradient(135deg, #0A66C2, #0E76A8)' where lower(name) like '%daffa%' and url like '%linkedin%';
update contact_links set color = 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)' where url like '%instagram%';
update contact_links set color = 'linear-gradient(135deg, #24292E, #57606A)' where url like '%github%';

-- baris lain yang masih kosong -> abu-abu solid
update contact_links set color = '#374151' where color = '' or color is null;
