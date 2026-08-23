// Skala minimum supaya layer yang dirotasi tetap menutup frame-nya,
// sehingga tidak ada sudut kosong saat gambar diputar.
// ponytail: mengasumsikan frame ~16:9; frame jauh lebih lebar mungkin
// butuh zoom sedikit lebih besar -> naikkan param aspect jika perlu.
export function autoFitScale(rotateDeg: number, aspect = 9 / 16): number {
  const t = (Math.abs(rotateDeg) * Math.PI) / 180;
  const c = Math.abs(Math.cos(t));
  const s = Math.abs(Math.sin(t));
  const r = aspect; // tinggi / lebar frame
  // layer berukuran 1.5x frame; cari skala agar rotasinya tetap menutupi
  return Math.max(
    1,
    (0.5 * c + 0.5 * r * s) / 0.75,
    (0.5 * s + 0.5 * r * c) / (0.75 * r)
  );
}

// batas geser (translate %) supaya pinggir tidak bolong, tergantung skala efektif
export function panLimitPct(effectiveScale: number): number {
  return Math.max(0, ((effectiveScale * 0.75 - 0.5) / 1.5) * 100);
}

export function clampPan(v: number, effectiveScale: number): number {
  const limit = panLimitPct(effectiveScale);
  return Math.round(Math.max(-limit, Math.min(limit, v)));
}
