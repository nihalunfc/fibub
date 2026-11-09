// Reinforcing bar quantities: mass per metre from the steel density, bar counts from spacing over a
// rectangular slab, wall or footing, splitting long bars into stock lengths with laps the user gives,
// and a first-fit-decreasing plan of how many stock bars to buy. No code values are built in.

export const STEEL = 7850; // kg/m³

/** Mass per metre of a round bar of diameter d mm (kg/m) = ρ × π d² / 4. */
export const massPerM = (d: number, rho = STEEL) => (rho * Math.PI * d * d) / 4 / 1e6;
/** Cross-section area in mm². */
export const area = (d: number) => (Math.PI * d * d) / 4;

/** Number of bars at a spacing over a width (mm): bars at both edges, spacing not exceeded. */
export function barCount(width: number, spacing: number): number {
  if (!(width >= 0) || !(spacing > 0)) return NaN;
  return Math.ceil(width / spacing - 1e-9) + 1;
}

/** Split a bar of length L into stock bars with laps. Returns the pieces (mm). */
export function splitBar(L: number, stock: number, lap: number): number[] {
  if (L <= stock + 1e-9) return [L];
  if (!(stock > lap)) return [];
  const n = Math.ceil((L - lap) / (stock - lap) - 1e-9); // pieces
  const pieces = Array(n - 1).fill(stock);
  pieces.push(L + (n - 1) * lap - (n - 1) * stock);
  return pieces;
}

export type Direction = { d: number; spacing: number; along: number; across: number; cover: number; hook: number };
export type DirResult = { count: number; length: number; pieces: number[]; laps: number; total: number; mass: number };

/** One direction of a mesh: bars run `along` (mm), spaced across `across` (mm), cover at each end and edge. */
export function meshDirection(p: Direction, stock: number, lap: number, layers: number, copies: number): DirResult {
  const length = p.along - 2 * p.cover + 2 * p.hook;
  const count = barCount(p.across - 2 * p.cover, p.spacing) * layers * copies;
  const pieces = splitBar(length, stock, lap);
  const per = pieces.reduce((a, b) => a + b, 0);
  const total = (count * per) / 1000; // m
  return { count, length, pieces, laps: pieces.length - 1, total, mass: total * massPerM(p.d) };
}

/** Pack cut pieces (mm) into stock bars by first fit decreasing. Returns the number of stock bars and the offcut total (mm). */
export function stockBars(pieces: number[], stock: number): { bars: number; waste: number; plan: number[][] } {
  const sorted = [...pieces].sort((a, b) => b - a), bins: number[][] = [], room: number[] = [];
  for (const p of sorted) {
    let i = room.findIndex((r) => r >= p - 1e-9);
    if (i < 0) { bins.push([]); room.push(stock); i = bins.length - 1; }
    bins[i].push(p); room[i] -= p;
  }
  return { bars: bins.length, waste: room.reduce((a, b) => a + b, 0), plan: bins };
}
