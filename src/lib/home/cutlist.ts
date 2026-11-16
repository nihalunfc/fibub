// Cut list packer for #T1011 (src/tools/cut-list/). Plain functions, no DOM; checked in tests/tools/cut-list.mjs.
//
// One-dimensional: pieces are cut across the board (cross-cuts) from boards of one stock length. Every saw cut
// turns a kerf of wood into dust. n pieces on one board need n - 1 cuts between them, plus one more if an offcut
// is left over, so n pieces fit when  sum(len) + kerf × (n - 1) <= stock.  Written as  sum(len + kerf) <= stock + kerf,
// it is ordinary bin packing with item size len + kerf and bin size stock + kerf.

export type Piece = { label: string; len: number; qty: number };
export type Cut = { label: string; len: number };
export type Board = { cuts: Cut[]; used: number; offcut: number };
export type Plan = {
  boards: Board[];
  tooLong: Cut[];          // pieces longer than the stock board
  pieces: number;          // pieces placed
  bought: number;          // total length of boards to buy
  wood: number;            // total length of the pieces
  waste: number;           // percentage of bought length not in a piece (kerf dust and offcuts)
  lowerBound: number;      // no plan can use fewer boards than this
  optimal: boolean;        // true when the board count is proven to be the fewest possible
};

const EPS = 1e-9;

/** Lay out a list of cuts as boards, with what each board uses and the offcut left. */
function boardsOf(groups: Cut[][], stock: number, kerf: number): Board[] {
  return groups.map((cuts) => {
    const inner = cuts.reduce((a, c) => a + c.len, 0) + kerf * (cuts.length - 1), rest = stock - inner;
    // The offcut is what is left after one more cut to free it (none if that cut would eat it all).
    const offcut = rest > kerf + EPS ? rest - kerf : 0;
    return { cuts, used: stock - offcut, offcut };
  });
}

/** First-fit decreasing: each piece, longest first, goes on the first board with room. */
function ffd(items: Cut[], cap: number, kerf: number): Cut[][] {
  const bins: { left: number; cuts: Cut[] }[] = [];
  for (const it of items) {
    const s = it.len + kerf;
    let b = bins.find((x) => x.left >= s - EPS);
    if (!b) { b = { left: cap, cuts: [] }; bins.push(b); }
    b.cuts.push(it); b.left -= s;
  }
  return bins.map((b) => b.cuts);
}

/**
 * Exact search (branch and bound) for the fewest boards, used when the job is small. Gives up after `budget`
 * steps, so the page never hangs: `proven` is then false and the best plan found so far (if any) is returned.
 */
function exact(items: Cut[], cap: number, kerf: number, limit: number, lower: number, budget = 300000): { groups: Cut[][] | null; proven: boolean } {
  const n = items.length, size = items.map((x) => x.len + kerf);
  const left: number[] = [], who: number[] = new Array(n);
  let best: number[] | null = null, bestK = limit, steps = 0, out = false;
  const go = (i: number) => {
    if (out || ++steps > budget) { out = true; return; }
    if (i === n) { best = [...who]; bestK = left.length; return; }
    const seen = new Set<number>();
    for (let b = 0; b < left.length; b++) {
      const key = Math.round(left[b] * 1e6);
      if (seen.has(key) || left[b] < size[i] - EPS) continue; // boards with the same room left are the same choice
      seen.add(key);
      left[b] -= size[i]; who[i] = b; go(i + 1); left[b] += size[i];
      if (bestK <= lower || out) return;
    }
    if (left.length + 1 < bestK) { left.push(cap - size[i]); who[i] = left.length - 1; go(i + 1); left.pop(); }
  };
  go(0);
  if (!best) return { groups: null, proven: !out };
  const groups: Cut[][] = Array.from({ length: bestK }, () => []);
  (best as number[]).forEach((b, i) => groups[b].push(items[i]));
  return { groups, proven: !out };
}

/** Pack the pieces onto the fewest stock boards. Lengths in any one unit (mm or inches). */
export function packCuts(stock: number, kerf: number, pieces: Piece[]): Plan {
  const all: Cut[] = [];
  for (const p of pieces) for (let i = 0; i < Math.max(0, Math.floor(p.qty)); i++) if (p.len > 0) all.push({ label: p.label, len: p.len });
  const tooLong = all.filter((c) => c.len > stock + EPS);
  const items = all.filter((c) => c.len <= stock + EPS).sort((a, b) => b.len - a.len);
  const cap = stock + kerf;
  const lower = items.length ? Math.ceil(items.reduce((a, c) => a + c.len + kerf, 0) / cap - EPS) : 0;
  let groups = ffd(items, cap, kerf), optimal = groups.length <= lower;
  if (!optimal && items.length <= 24) {
    const ex = exact(items, cap, kerf, groups.length, lower);
    if (ex.groups && ex.groups.length < groups.length) groups = ex.groups;
    optimal = ex.proven;
  }
  // Fullest boards first, so the offcuts collect at the end.
  groups.sort((a, b) => b.reduce((s, c) => s + c.len, 0) - a.reduce((s, c) => s + c.len, 0));
  const boards = boardsOf(groups, stock, kerf);
  const wood = items.reduce((a, c) => a + c.len, 0), bought = boards.length * stock;
  return { boards, tooLong, pieces: items.length, bought, wood, waste: bought ? (100 * (bought - wood)) / bought : 0, lowerBound: lower, optimal };
}
