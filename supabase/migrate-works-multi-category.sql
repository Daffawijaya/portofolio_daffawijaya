-- Jalankan SEKALI di SQL Editor untuk mengubah works.category menjadi multi-kategori.
alter table works drop constraint if exists works_category_check;
alter table works alter column category type text[] using
  case when category is null or category = '' then '{}' else array[category] end;
