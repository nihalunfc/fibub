// Light carpentry maths for the Home skills lessons and the Shelf load tool (#L376 saw-straight, #L377 drill-and-screw,
// #T1012 shelf-load). Plain functions, no DOM, so tests/tools/*.mjs can check them against hand-worked examples.
// Rules of thumb are general woodworking guidance, not a standard: makers' tables and ratings win.

export const G = 9.81; // N per kg

// ---------- Sawing: the kerf ----------
/** Which side of the marked line the saw runs: the waste side (line kept), centred on it, or the keep side. */
export type SawSide = 'waste' | 'centre' | 'keep';
/** Length of the piece you keep when you mark it at `mark` mm and cut with a blade that removes `kerf` mm. */
export function keptLength(mark: number, kerf: number, side: SawSide) {
  return side === 'waste' ? mark : side === 'centre' ? mark - kerf / 2 : mark - kerf;
}
/** How many pieces of `piece` mm come out of a board `board` mm long, losing `kerf` mm at every cut. */
export function piecesFromBoard(board: number, piece: number, kerf: number) {
  if (!(piece > 0) || !(board > 0) || kerf < 0) return { n: 0, offcut: Math.max(0, board) };
  const n = Math.floor((board + kerf + 1e-9) / (piece + kerf)); // the last piece needs no cut after it
  const cuts = n * piece >= board - 1e-9 ? Math.max(0, n - 1) : n; // no cut if the last piece ends exactly at the board end
  return { n, offcut: Math.max(0, board - n * piece - cuts * kerf) };
}

// ---------- Screws ----------
/** Stock wood screw lengths in mm (common in shops; check what yours sells). */
export const SCREW_LENGTHS = [12, 16, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 120];
/** Screw diameter (mm) by length, with the nearest imperial gauge, clearance and pilot drills (mm). */
export const SCREW_TABLE = [
  { upTo: 20, d: 3.0, gauge: '#5', clear: 3.5, soft: 1.5, hard: 2.0 },
  { upTo: 30, d: 3.5, gauge: '#6', clear: 4.0, soft: 2.0, hard: 2.5 },
  { upTo: 50, d: 4.0, gauge: '#8', clear: 4.5, soft: 2.5, hard: 3.0 },
  { upTo: 80, d: 5.0, gauge: '#10', clear: 5.5, soft: 3.0, hard: 3.5 },
  { upTo: Infinity, d: 6.0, gauge: '#12', clear: 6.5, soft: 3.5, hard: 4.0 },
];
/**
 * Pick a screw to fix a piece `top` mm thick onto a base `base` mm thick.
 * Aim: about 2.5 x the top piece's thickness, but the tip stays at least `spare` mm inside the base.
 * Then the largest stock length that fits both. `bite` is how far it goes into the base, `biteShare` its share.
 */
export function pickScrew(top: number, base: number, wood: 'soft' | 'hard' = 'soft', spare = 5) {
  if (!(top > 0) || !(base > 0)) return null;
  const aim = 2.5 * top, max = top + base - spare;
  const len = [...SCREW_LENGTHS].reverse().find((l) => l <= Math.min(aim, max) + 1e-9) ?? 0;
  const row = SCREW_TABLE.find((r) => len <= r.upTo)!;
  const bite = len - top;
  return { aim, max, len, d: row.d, gauge: row.gauge, clear: row.clear, pilot: wood === 'hard' ? row.hard : row.soft,
    bite, biteShare: len > 0 ? bite / len : 0, weak: len <= top || bite < len / 2 };
}

// ---------- Shelf load ----------
export type ShelfIn = {
  kg: number;          // everything on the shelf plus the board, kg
  depth: number;       // shelf depth from the wall, mm
  brackets: number;    // how many brackets
  h: number;           // vertical distance between the top and bottom screw of a bracket, mm
  screws: number;      // screws into the wall per bracket
  front?: boolean;     // true: the weight sits at the front edge (depth), not spread (depth / 2)
};
/**
 * Rough forces on the wall screws of a bracketed shelf. The bracket tips about its bottom edge, so the load W at
 * lever arm a (d/2 when spread evenly) is held by the top screws pulling out: F = W·a / h, shared by the top screws
 * (half the screws on each bracket, rounded down, at least one). Every screw also carries W / (all screws) downwards (shear).
 */
export function shelfLoad(p: ShelfIn) {
  const W = p.kg * G, arm = p.front ? p.depth : p.depth / 2;
  const topPer = Math.max(1, Math.floor(p.screws / 2)), tops = p.brackets * topPer, all = p.brackets * p.screws;
  const pullTotal = (W * arm) / p.h;
  const pull = pullTotal / tops, shear = W / all;
  return { W, arm, tops, all, pullTotal, pull, shear, pullKg: pull / G, shearKg: shear / G, both: Math.hypot(pull, shear) };
}
/** Allowed load per screw, kg: a safe working load is used as it is; a failure (ultimate) load is divided by the safety factor. */
export const allowedKg = (rating: number, kind: 'safe' | 'ultimate', factor: number) => (kind === 'safe' ? rating : rating / factor);
