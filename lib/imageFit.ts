import { useEffect, useRef, useState } from "react";

// Skala minimum supaya layer yang dirotasi tetap menutup frame-nya,
// sehingga tidak ada sudut kosong saat gambar diputar.
export function autoFitScale(rotateDeg: number, aspectHW: number): number {
  const t = (Math.abs(rotateDeg) * Math.PI) / 180;
  const c = Math.abs(Math.cos(t));
  const s = Math.abs(Math.sin(t));
  const r = aspectHW; // tinggi / lebar frame (diukur langsung dari elemen)
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
  return Math.max(-limit, Math.min(limit, v));
}

// ukur rasio (lebar/tinggi) elemen secara realtime
export function useMeasuredAspect<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [aspectWH, setAspect] = useState(16 / 9);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) setAspect(r.width / r.height);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, aspectWH };
}
