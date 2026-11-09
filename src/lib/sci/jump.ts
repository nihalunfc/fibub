// Vertical jump height from flight time (h = g t² / 8) and the reactive strength index. Plain maths, no DOM.

export const G = 9.81;
/** Jump height (m) from flight time (s): the body rises for t/2 and falls for t/2, so h = g t² / 8. */
export const heightFromFlight = (t: number, g = G) => (g * t * t) / 8;
/** Take-off velocity (m/s) from flight time: v = g t / 2. */
export const takeoffVelocity = (t: number, g = G) => (g * t) / 2;
/** Flight time (s) from frame numbers and frame rate. */
export const flightFromFrames = (takeoff: number, landing: number, fps: number) => (landing - takeoff) / fps;
/** Reactive strength index: jump height (m) / ground contact time (s). */
export const rsi = (h: number, contact: number) => h / contact;

export type Jump = { label: string; flight: number; contact: number | null; h: number; v: number; rsi: number | null; ratio: number | null; lo: number | null; hi: number | null };

/** Height range when the flight time is off by ± one frame. */
export function frameRange(t: number, fps: number, g = G): [number, number] {
  return [heightFromFlight(Math.max(0, t - 1 / fps), g), heightFromFlight(t + 1 / fps, g)];
}

/**
 * Lines of "flight, contact, label" (contact and label optional). unit: 'ms' or 's'.
 * Returns the jumps; throws with a line number on bad input.
 */
export function parseJumps(text: string, unit: 'ms' | 's', g = G, fps?: number): Jump[] {
  const k = unit === 'ms' ? 1e-3 : 1;
  const out: Jump[] = [];
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const cells = line.split(/\t|;|,/).map((c) => c.trim());
    if (i === 0 && /[a-z]/i.test(cells[0]) && !/^\d/.test(cells[0])) return; // header row
    const f = Number(cells[0]), c = cells[1] ? Number(cells[1]) : null;
    if (!Number.isFinite(f) || f <= 0) throw new Error(`Line ${i + 1}: "${cells[0]}" is not a flight time.`);
    if (c !== null && !(Number.isFinite(c) && c > 0)) throw new Error(`Line ${i + 1}: "${cells[1]}" is not a contact time.`);
    const t = f * k, tc = c === null ? null : c * k;
    if (t > 1.5) throw new Error(`Line ${i + 1}: a flight time of ${t} s is too long for a jump. Check the unit (ms or s).`);
    if (tc !== null && tc > 3) throw new Error(`Line ${i + 1}: a contact time of ${tc} s is too long. Check the unit (ms or s).`);
    const h = heightFromFlight(t, g);
    const [lo, hi] = fps ? frameRange(t, fps, g) : [null, null];
    out.push({ label: cells.slice(2).join(', ') || `Jump ${out.length + 1}`, flight: t, contact: tc, h, v: takeoffVelocity(t, g), rsi: tc ? rsi(h, tc) : null, ratio: tc ? t / tc : null, lo, hi });
  });
  if (!out.length) throw new Error('Type at least one flight time.');
  return out;
}

export function meanSd(x: number[]): { mean: number; sd: number } {
  const n = x.length, mean = x.reduce((a, b) => a + b, 0) / n;
  const sd = n > 1 ? Math.sqrt(x.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)) : NaN;
  return { mean, sd };
}
