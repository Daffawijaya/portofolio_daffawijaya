-- Jalankan SEKALI: rotasi & zoom gambar works (diedit lewat drag/slider di admin)
alter table works add column if not exists image_rotate int not null default 0;  -- derajat, bebas -180..180
alter table works add column if not exists image_scale int not null default 100; -- persen zoom, min 67 = fit penuh
