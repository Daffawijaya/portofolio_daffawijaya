-- Jalankan SEKALI: posisi/rotasi/zoom gambar untuk experiences (drag & slider di admin)
alter table experiences add column if not exists image_position text not null default ''; -- "x% y%", kosong = center
alter table experiences add column if not exists image_rotate int not null default 0;     -- derajat
alter table experiences add column if not exists image_scale int not null default 100;    -- persen, 67 = fit
