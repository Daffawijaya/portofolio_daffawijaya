import { useRef } from "react";
import {
  autoFitScale,
  clampPan,
  useMeasuredAspect,
} from "../lib/imageFit";

interface PannableImageProps {
  src: string;
  position: string; // "x% y%" pan offset
  rotate: number; // derajat
  scale: number; // zoom manual, fraksi (1 = normal)
  interactive?: boolean;
  onPositionChange?: (pos: string) => void;
}

// Gambar dengan pan/rotate/zoom. Layer sengaja dibuat 150% lebih besar dari
// frame lalu skala minimum dihitung otomatis dari rasio frame asli + sudut
// rotasi, jadi tidak pernah ada sudut kosong.
export default function PannableImage({
  src,
  position,
  rotate,
  scale,
  interactive = false,
  onPositionChange,
}: PannableImageProps) {
  const { ref, aspectWH } = useMeasuredAspect<HTMLDivElement>();
  const dragRef = useRef<{
    startX: number;
    startY: number;
    px: number;
    py: number;
  } | null>(null);

  const [px = 0, py = 0] = position.split(" ").map((v) => parseFloat(v) || 0);
  const effective = scale * autoFitScale(rotate, 1 / aspectWH);

  return (
    <div
      ref={ref}
      className={
        "relative w-full h-full overflow-hidden select-none touch-none " +
        (interactive ? "cursor-grab active:cursor-grabbing" : "")
      }
      onPointerDown={(e) => {
        if (!interactive) return;
        dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          px,
          py,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = dragRef.current;
        if (!d || !onPositionChange) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const dx = ((e.clientX - d.startX) / rect.width) * 100;
        const dy = ((e.clientY - d.startY) / rect.height) * 100;
        onPositionChange(
          `${clampPan(d.px + dx, effective)}% ${clampPan(d.py + dy, effective)}%`
        );
      }}
      onPointerUp={() => (dragRef.current = null)}
      onPointerCancel={() => (dragRef.current = null)}
    >
      <div
        className="absolute -inset-1/4 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: src ? `url(${src})` : undefined,
          transform: `translate(${px}%, ${py}%) rotate(${rotate}deg) scale(${effective})`,
        }}
      />
    </div>
  );
}
