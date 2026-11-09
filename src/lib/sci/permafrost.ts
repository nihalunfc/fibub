// Permafrost active layer and frost depth by the Stefan equation (no DOM).
//
// One soil:   Z = √(2 k Iₛ / L),  Iₛ = n · I (surface index from the air index, °C·days × 86 400 → °C·s),
//             L = ρd · w · Lf (volumetric latent heat, J/m³), Lf = 334 kJ/kg.
// Layers:     the front moves through each layer with the thawed (or frozen) layers above it in series, so with
//             R = Σ hⱼ/kⱼ of the layers above, fully thawing layer i takes ΔI = Lᵢ hᵢ (R + hᵢ / (2 kᵢ)), and a front
//             part-way into layer i after a remaining index I' sits at z = 2 I' / Lᵢ ÷ (R + √(R² + 2 I' / (kᵢ Lᵢ))).
//             With one layer this is the plain Stefan equation. The last layer goes on downwards for ever.
import { parseTable, num } from './num.ts';

/** Latent heat of fusion of water, J/kg (334 kJ/kg). */
export const LF = 334000;
/** Seconds in a day. */
export const DAY = 86400;

export type Layer = { h: number; k: number; w: number; rhoD: number };

/** Volumetric latent heat, J/m³, from dry density (kg/m³) and gravimetric water content (fraction). */
export const latent = (rhoD: number, w: number) => rhoD * w * LF;

/** Stefan depth (m) for conductivity k (W/m/K), surface index I (°C·days) and volumetric latent heat L (J/m³). */
export function stefan(k: number, I: number, L: number): number {
  if (!(I > 0)) return 0;
  return Math.sqrt((2 * k * I * DAY) / L);
}

/** The index (°C·days) that takes the front to depth z in one soil: the Stefan equation turned round. */
export const indexFor = (k: number, z: number, L: number) => (L * z * z) / (2 * k * DAY);

/** Check one layer's numbers; a message, or '' if they are fine. */
export function layerProblem(l: Layer, i: number, last: boolean): string {
  const n = `Layer ${i + 1}`;
  if (!last && !(l.h > 0)) return `${n}: give a thickness above 0 m.`;
  if (!(l.k > 0)) return `${n}: the thermal conductivity must be above 0 W/m/K.`;
  if (!(l.w > 0)) return `${n}: the water content must be above 0 %. Dry soil has no ice to melt, so the Stefan equation does not apply.`;
  if (l.w > 5) return `${n}: a water content above 500 % is not believable; give it in per cent of the dry mass (25 for 25 %).`;
  if (!(l.rhoD > 0) || l.rhoD > 3000) return `${n}: give a dry density between 0 and 3000 kg/m³.`;
  return '';
}

export type LayerOut = { top: number; bottom: number; L: number; R: number; need: number; cum: number; reached: 'all' | 'part' | 'no' };
export type Result = { depth: number; layer: number; layers: LayerOut[] };

/** Front depth (m) after a surface index I (°C·days) through layers (w as a fraction). The last layer has no bottom. */
export function layered(layers: Layer[], I: number): Result {
  let R = 0, top = 0, left = Math.max(0, I) * DAY, depth = NaN, layer = -1, cum = 0;
  const out: LayerOut[] = [];
  layers.forEach((l, i) => {
    const L = latent(l.rhoD, l.w), last = i === layers.length - 1;
    const need = last ? Infinity : L * l.h * (R + l.h / (2 * l.k)); // J/m² = °C·s × W/m/K ÷ … (index in °C·s)
    cum += need;
    let reached: LayerOut['reached'] = 'no';
    if (layer < 0) {
      if (left >= need) { left -= need; reached = 'all'; }
      else {
        const a = (2 * left) / L, z = left > 0 ? a / (R + Math.sqrt(R * R + a / l.k)) : 0;
        depth = top + z; layer = i; reached = left > 0 ? 'part' : 'no';
        left = 0;
      }
    }
    out.push({ top, bottom: last ? Infinity : top + l.h, L, R, need: need / DAY, cum: cum / DAY, reached });
    top += l.h; R += l.h / l.k;
  });
  return { depth, layer, layers: out };
}

/** Thawing (sum of daily means above 0 °C) or freezing (sum of minus the means below 0 °C) index, with the running sum per day. */
export function dailyIndex(temps: number[], kind: 'thaw' | 'freeze'): { I: number; cum: number[]; days: number } {
  let s = 0, days = 0;
  const cum = temps.map((t) => { const d = kind === 'thaw' ? Math.max(0, t) : Math.max(0, -t); if (d > 0) days++; s += d; return s; });
  return { I: s, cum, days };
}

/** Daily mean temperatures from pasted text: one day per line, the last cell on each line is the temperature (°C). */
export function parseTemps(text: string): { temps: number[]; skipped: number } | string {
  const temps: number[] = []; let skipped = 0;
  for (const row of parseTable(text)) {
    const v = num(row[row.length - 1]);
    if (Number.isFinite(v) && v > -90 && v < 60) temps.push(v); else skipped++;
  }
  if (temps.length < 2) return 'Paste at least two daily mean temperatures in °C, one day per line (a date or day number before each is fine).';
  if (temps.length > 3700) return 'Up to ten years (3700 days) of daily temperatures, please.';
  return { temps, skipped };
}

/** A made-up year of daily mean air temperatures (°C) for the example: a smooth seasonal swing with day-to-day wobble. Not a real station. */
export function exampleTemps(): number[] {
  let s = 20261109;
  const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const out: number[] = [];
  for (let d = 1; d <= 365; d++) {
    const t = -7 + 17 * Math.sin((2 * Math.PI * (d - 115)) / 365) + 4 * (rnd() + rnd() - 1);
    out.push(Math.round(t * 10) / 10);
  }
  return out;
}

export type SensRow = { name: string; depths: number[] };
/** Depth when one input is scaled by each factor (all layers together for soil values). */
export function sensitivity(layers: Layer[], I: number, factors: number[]): SensRow[] {
  const d = (ls: Layer[], i: number) => layered(ls, i).depth;
  const rows: SensRow[] = [
    { name: 'Surface index (index × n)', depths: factors.map((f) => d(layers, I * f)) },
    { name: 'Thermal conductivity k', depths: factors.map((f) => d(layers.map((l) => ({ ...l, k: l.k * f })), I)) },
    { name: 'Water content w', depths: factors.map((f) => d(layers.map((l) => ({ ...l, w: l.w * f })), I)) },
    { name: 'Dry density ρd', depths: factors.map((f) => d(layers.map((l) => ({ ...l, rhoD: l.rhoD * f })), I)) },
  ];
  if (layers.length > 1) rows.push({ name: 'Top layer thickness', depths: factors.map((f) => d(layers.map((l, i) => (i ? l : { ...l, h: l.h * f })), I)) });
  return rows;
}
