// Cache simulator: direct-mapped, set-associative or fully associative caches with LRU, FIFO or random
// replacement, one or two levels, run on an address trace; hit/miss per access, the three kinds of miss and
// the average memory access time (AMAT). Plain TypeScript, no DOM.

export type Policy = 'lru' | 'fifo' | 'random';
export type Level = { size: number; block: number; ways: number | 'full'; policy: Policy; hit: number };
export type Geometry = { blocks: number; sets: number; ways: number; offsetBits: number; indexBits: number };

const isPow2 = (x: number) => Number.isInteger(x) && x >= 1 && (x & (x - 1)) === 0;
export function geometry(L: Level, name = 'The cache'): Geometry {
  if (!isPow2(L.block)) throw new Error(`${name}: block size must be a power of 2 (such as 16, 32 or 64 bytes).`);
  if (!isPow2(L.size)) throw new Error(`${name}: size must be a power of 2 in bytes (such as 1024 or 32768).`);
  if (L.size < L.block) throw new Error(`${name}: size must be at least one block.`);
  const blocks = L.size / L.block, ways = L.ways === 'full' ? blocks : L.ways;
  if (!isPow2(ways) || ways > blocks) throw new Error(`${name}: ways must be a power of 2 and no more than the ${blocks} blocks.`);
  if (blocks > 1 << 20) throw new Error(`${name}: up to about a million blocks.`);
  const sets = blocks / ways;
  return { blocks, sets, ways, offsetBits: Math.log2(L.block), indexBits: Math.log2(sets) };
}

/** mulberry32: a small repeatable random number generator (the Python check uses the same one). */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

type Line = { tag: number; valid: boolean; stamp: number };
export class Cache {
  g: Geometry; L: Level; sets: Line[][]; clock = 0; rand: () => number;
  constructor(L: Level, seed = 1, name?: string) { this.L = L; this.g = geometry(L, name); this.sets = Array.from({ length: this.g.sets }, () => Array.from({ length: this.g.ways }, () => ({ tag: 0, valid: false, stamp: 0 }))); this.rand = rng(seed); }
  split(addr: number) { const blk = Math.floor(addr / this.L.block); return { block: blk, offset: addr - blk * this.L.block, set: blk % this.g.sets, tag: Math.floor(blk / this.g.sets) }; }
  /** Look up an address; on a miss, bring its block in. Returns whether it hit and which block (if any) was evicted. */
  access(addr: number): { hit: boolean; set: number; tag: number; offset: number; way: number; evicted: number | null } {
    const { set, tag, offset } = this.split(addr), lines = this.sets[set];
    this.clock++;
    for (let w = 0; w < lines.length; w++) if (lines[w].valid && lines[w].tag === tag) { if (this.L.policy === 'lru') lines[w].stamp = this.clock; return { hit: true, set, tag, offset, way: w, evicted: null }; }
    let w = lines.findIndex((l) => !l.valid), evicted: number | null = null;
    if (w < 0) {
      if (this.L.policy === 'random') w = Math.floor(this.rand() * lines.length);
      else { w = 0; for (let k = 1; k < lines.length; k++) if (lines[k].stamp < lines[w].stamp) w = k; } // LRU: oldest use; FIFO: oldest arrival
      evicted = lines[w].tag * this.g.sets + set;
    }
    lines[w] = { tag, valid: true, stamp: this.clock };
    return { hit: false, set, tag, offset, way: w, evicted };
  }
}

export type Miss = 'compulsory' | 'capacity' | 'conflict';
export type Row = { i: number; addr: number; set: number; tag: number; offset: number; l1: boolean; kind?: Miss; evicted: number | null; l2?: boolean; cycles: number };
export type Result = {
  rows: Row[]; n: number; l1: { hits: number; misses: number; compulsory: number; capacity: number; conflict: number };
  l2: { hits: number; misses: number } | null; amat: number; g1: Geometry; g2: Geometry | null; final: Cache;
};

/** Run a trace. L2 (if given) is looked up on every L1 miss; memory on every L2 miss (or L1 miss with no L2).
 * Misses are classed the usual way (Hill): compulsory = first touch of the block, capacity = would also miss in
 * a fully associative LRU cache of the same size, conflict = the rest. */
export function simulate(trace: number[], L1: Level, L2: Level | null, memory: number, seed = 1): Result {
  const c1 = new Cache(L1, seed, 'Level 1'), c2 = L2 ? new Cache(L2, seed + 1, 'Level 2') : null;
  if (L2 && L2.block < L1.block) throw new Error('Level 2 blocks must be at least as large as level 1 blocks.');
  const seen = new Set<number>(), full = new Map<number, true>(), cap = c1.g.blocks; // Map keeps LRU order
  const rows: Row[] = [], l1 = { hits: 0, misses: 0, compulsory: 0, capacity: 0, conflict: 0 }, l2 = c2 ? { hits: 0, misses: 0 } : null;
  let total = 0;
  trace.forEach((addr, i) => {
    const r = c1.access(addr), blk = Math.floor(addr / L1.block);
    const inFull = full.has(blk);
    if (inFull) full.delete(blk);
    full.set(blk, true);
    if (full.size > cap) full.delete(full.keys().next().value!);
    let cycles = L1.hit;
    const row: Row = { i: i + 1, addr, set: r.set, tag: r.tag, offset: r.offset, l1: r.hit, evicted: r.evicted, cycles: 0 };
    if (r.hit) l1.hits++;
    else {
      l1.misses++;
      row.kind = !seen.has(blk) ? 'compulsory' : !inFull ? 'capacity' : 'conflict';
      l1[row.kind]++;
      if (c2) {
        const h = c2.access(addr).hit;
        row.l2 = h; cycles += L2!.hit;
        if (h) l2!.hits++; else { l2!.misses++; cycles += memory; }
      } else cycles += memory;
    }
    seen.add(blk);
    row.cycles = cycles; total += cycles;
    rows.push(row);
  });
  return { rows, n: trace.length, l1, l2, amat: trace.length ? total / trace.length : 0, g1: c1.g, g2: c2 ? c2.g : null, final: c1 };
}

/** AMAT from rates: L1 hit + L1 miss rate × (L2 hit + L2 local miss rate × memory). */
export function amatFormula(h1: number, m1: number, mem: number, h2?: number, m2?: number): number {
  return h2 === undefined ? h1 + m1 * mem : h1 + m1 * (h2 + (m2 ?? 0) * mem);
}

// ---------- Traces ----------
export function parseTrace(text: string, max = 100000): number[] {
  const out: number[] = [];
  const lines = text.split(/\r?\n/);
  for (let k = 0; k < lines.length; k++) {
    const raw = lines[k].replace(/#.*/, '').trim();
    if (!raw) continue;
    if (!out.length && /^[A-Za-z_][A-Za-z_ \t,;()]*$/.test(raw) && !/^[RWLSIMrwlsim]$/.test(raw)) continue; // a header row such as "address"
    for (const tok of raw.split(/[\s,;]+/)) {
      if (/^[RWLSIMrwlsim]$/.test(tok)) continue; // access type letters (read, write, load, store, instruction, modify)
      const t = tok.replace(/^[RWLSIMrwlsim]:?/, '');
      let v: number;
      if (/^0x[0-9a-f]+$/i.test(t)) v = parseInt(t.slice(2), 16);
      else if (/^[0-9]+$/.test(t)) v = Number(t);
      else if (/^[0-9a-f]+h$/i.test(t)) v = parseInt(t.slice(0, -1), 16);
      else throw new Error(`Line ${k + 1}: "${tok}" is not an address. Use decimal (4096) or hex (0x1000).`);
      if (!Number.isSafeInteger(v)) throw new Error(`Line ${k + 1}: "${tok}" is too large.`);
      out.push(v);
      if (out.length > max) throw new Error(`The trace has more than ${max.toLocaleString('en')} addresses; this tool takes up to ${max.toLocaleString('en')}.`);
    }
  }
  if (!out.length) throw new Error('Type or paste some addresses, one per line or separated by spaces.');
  return out;
}

/** Walk an array: `count` elements of `elem` bytes from `base`, every `stride`-th element, `passes` times. */
export function strided(base: number, elem: number, count: number, stride: number, passes: number): number[] {
  const out: number[] = [];
  for (let p = 0; p < passes; p++) for (let i = 0; i < count; i += stride) out.push(base + i * elem);
  return out;
}
/** C = A × B for n × n matrices stored row by row (A at 0, B after A, C after B): for each innermost step,
 * read A[i][k], read B[k][j], then read and write C[i][j] (counted as one access). */
export function matmul(n: number, elem: number, order: 'ijk' | 'ikj' | 'jki'): number[] {
  const A = 0, B = n * n * elem, C = 2 * n * n * elem, out: number[] = [];
  const at = (base: number, r: number, c: number) => base + (r * n + c) * elem;
  const body = (i: number, j: number, k: number) => { out.push(at(A, i, k), at(B, k, j), at(C, i, j)); };
  for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) for (let z = 0; z < n; z++) {
    if (order === 'ijk') body(x, y, z); else if (order === 'ikj') body(x, z, y); else body(z, x, y);
  }
  return out;
}
export function randomTrace(count: number, range: number, align: number, seed = 7): number[] {
  const r = rng(seed);
  return Array.from({ length: count }, () => Math.floor((r() * range) / align) * align);
}
