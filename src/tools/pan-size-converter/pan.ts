// Pan size maths for #T862. Plain TypeScript, no DOM.
export type Preset = { id: string; name: string; shape: 'round' | 'square' | 'rect' | 'loaf' | 'vol'; inch: [number, number]; cm: [number, number] };

/** Common pans, in inches (as US recipes write them) and the metric size usually sold for it. Volume pans hold `inch[0]` US cups / `cm[0]` litres. */
export const PRESETS: Preset[] = [
  { id: 'round-6', name: '6 in (15 cm) round', shape: 'round', inch: [6, 0], cm: [15, 0] },
  { id: 'round-8', name: '8 in (20 cm) round', shape: 'round', inch: [8, 0], cm: [20, 0] },
  { id: 'round-9', name: '9 in (23 cm) round', shape: 'round', inch: [9, 0], cm: [23, 0] },
  { id: 'round-10', name: '10 in (25 cm) round', shape: 'round', inch: [10, 0], cm: [25, 0] },
  { id: 'square-8', name: '8 in (20 cm) square', shape: 'square', inch: [8, 0], cm: [20, 0] },
  { id: 'square-9', name: '9 in (23 cm) square', shape: 'square', inch: [9, 0], cm: [23, 0] },
  { id: 'rect-9x13', name: '9 × 13 in (23 × 33 cm) rectangle', shape: 'rect', inch: [13, 9], cm: [33, 23] },
  { id: 'rect-7x11', name: '7 × 11 in (18 × 28 cm) rectangle', shape: 'rect', inch: [11, 7], cm: [28, 18] },
  { id: 'loaf-9x5', name: '9 × 5 in (23 × 13 cm) loaf tin', shape: 'loaf', inch: [9, 5], cm: [23, 13] },
  { id: 'loaf-8x4', name: '8½ × 4½ in (22 × 11 cm) loaf tin', shape: 'loaf', inch: [8.5, 4.5], cm: [22, 11] },
  { id: 'bundt-10', name: 'Bundt, 10 cups (2.4 litres)', shape: 'vol', inch: [10, 0], cm: [2.4, 0] },
  { id: 'bundt-12', name: 'Bundt, 12 cups (2.8 litres)', shape: 'vol', inch: [12, 0], cm: [2.8, 0] },
];

/** Top area of a flat pan: round uses d1 as the diameter, square d1 as the side, others d1 × d2. NaN when a size is missing. */
export function panArea(shape: string, d1: number, d2 = NaN): number {
  if (!(d1 > 0)) return NaN;
  if (shape === 'round') return (Math.PI * d1 * d1) / 4;
  if (shape === 'square') return d1 * d1;
  return d2 > 0 ? d1 * d2 : NaN;
}

/** Diameter of the round pan that has the same top area. */
export const roundEquivalent = (area: number) => (area > 0 ? Math.sqrt((4 * area) / Math.PI) : NaN);

const FR: [number, string][] = [[0, ''], [1 / 8, '⅛'], [1 / 4, '¼'], [1 / 3, '⅓'], [3 / 8, '⅜'], [1 / 2, '½'], [5 / 8, '⅝'], [2 / 3, '⅔'], [3 / 4, '¾'], [7 / 8, '⅞'], [1, '']];
/** The factor as a kitchen fraction ("1¼") when it is within 0.03 of one, otherwise null. */
export function friendlyFactor(k: number): string | null {
  if (!(k > 0) || !Number.isFinite(k) || k > 100) return null;
  let w = Math.floor(k), best = FR[0];
  const r = k - w;
  for (const f of FR) if (Math.abs(f[0] - r) < Math.abs(best[0] - r)) best = f;
  if (Math.abs(best[0] - r) > 0.03) return null;
  if (best[0] === 1) { w += 1; best = FR[0]; }
  const s = (w ? String(w) : '') + best[1];
  return s === '' ? null : s;
}
