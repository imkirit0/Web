import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Rough paper edge: a CSS polygon that wobbles along the outline through `corners` (percentages). Seeded, so server and client always match. */
export function tornEdge(corners: [number, number][], seed: number, rough = 0.5) {
  let n = seed;
  let step = 0;
  // Slow drift plus fine grain, so the edge wanders like torn paper instead of a regular zigzag.
  const wobble = () => Math.sin(++step * 0.37 + seed) * rough * 1.6 + ((n = (n * 16807) % 2147483647) / 2147483647 - 0.5) * rough;
  const points = corners.flatMap(([x, y], i) => {
    const [nx, ny] = corners[(i + 1) % corners.length];
    const steps = Math.max(2, Math.round(Math.hypot(nx - x, ny - y) / 1.6));
    return Array.from({ length: steps }, (_, s) => `${(x + ((nx - x) * s) / steps + wobble()).toFixed(1)}% ${(y + ((ny - y) * s) / steps + wobble()).toFixed(1)}%`);
  });
  return `polygon(${points.join(",")})`;
}
