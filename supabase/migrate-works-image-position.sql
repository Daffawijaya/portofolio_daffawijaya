-- Jalankan SEKALI: kolom posisi gambar untuk works (dipakai slider di admin)
alter table works add column if not exists image_position text not null default '';
