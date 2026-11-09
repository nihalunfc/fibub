// Cellular automata for the explorer tool: elementary one-dimensional rules 0 to 255 (Wolfram numbering), and
// Life-like two-dimensional rules in B/S notation (Conway's Life is B3/S23), with wrap-around or dead edges,
// RLE pattern reading and writing, and cycle detection. Plain TypeScript, no DOM.

/** mulberry32 seeded generator in [0, 1). */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// ---------- elementary ----------
/** One step of elementary rule `rule`: the new cell is bit (4·left + 2·centre + right) of the rule number. */
export function elementaryStep(row: Uint8Array, rule: number, wrap: boolean): Uint8Array {
  const n = row.length, out = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const l = i > 0 ? row[i - 1] : wrap ? row[n - 1] : 0, r = i < n - 1 ? row[i + 1] : wrap ? row[0] : 0;
    out[i] = (rule >> ((l << 2) | (row[i] << 1) | r)) & 1;
  }
  return out;
}
export function elementaryRun(first: Uint8Array, rule: number, gens: number, wrap: boolean): Uint8Array[] {
  const rows = [first]; for (let g = 0; g < gens; g++) rows.push(elementaryStep(rows[rows.length - 1], rule, wrap)); return rows;
}
export function elementaryStart(width: number, kind: 'single' | 'random' | 'custom', opt: { density?: number; seed?: number; text?: string } = {}): Uint8Array {
  const row = new Uint8Array(width);
  if (kind === 'single') row[Math.floor(width / 2)] = 1;
  else if (kind === 'random') { const r = rng(opt.seed ?? 1); for (let i = 0; i < width; i++) row[i] = r() < (opt.density ?? 0.5) ? 1 : 0; }
  else {
    const t = (opt.text ?? '').replace(/\s/g, '');
    if (!/^[01.*#oO]*$/.test(t)) throw new Error('A custom start uses 1 (or # or *) for live cells and 0 (or .) for dead ones.');
    if (t.length > width) throw new Error(`The custom start has ${t.length} cells but the row is only ${width} wide.`);
    const off = Math.floor((width - t.length) / 2);
    for (let i = 0; i < t.length; i++) row[off + i] = /[1*#oO]/.test(t[i]) ? 1 : 0;
  }
  return row;
}
/** Wolfram's class names for a few famous rules, for the page. */
export const FAMOUS: Record<number, string> = { 30: 'chaotic; used as a random number generator', 90: 'Sierpiński triangle (XOR of the neighbours)', 110: 'complex; proven able to compute anything (Turing complete)', 184: 'traffic flow', 150: 'XOR of all three cells', 54: 'complex, with gliders', 60: 'Sierpiński triangle, leaning', 73: 'walls with complex areas', 45: 'chaotic' };

// ---------- Life-like ----------
export interface LifeRule { birth: boolean[]; survive: boolean[]; text: string }
/** Read B/S notation ("B3/S23", "b36s23", "B2/S") or the older S/B form ("23/3"). */
export function parseRule(s: string): LifeRule {
  const t = s.trim().replace(/\s/g, '');
  let b = '', sv = '';
  let m = /^B([0-8]*)\/?S([0-8]*)$/i.exec(t);
  if (m) { b = m[1]; sv = m[2]; }
  else if ((m = /^S([0-8]*)\/?B([0-8]*)$/i.exec(t))) { sv = m[1]; b = m[2]; }
  else if ((m = /^([0-8]*)\/([0-8]*)$/.exec(t))) { sv = m[1]; b = m[2]; }
  else throw new Error(`"${s}" is not a rule. Write it as B3/S23: the neighbour counts (0 to 8) that bring a dead cell to life (B) and keep a live cell alive (S).`);
  const birth = new Array(9).fill(false), survive = new Array(9).fill(false);
  for (const c of b) birth[+c] = true; for (const c of sv) survive[+c] = true;
  const txt = `B${birth.map((x, i) => (x ? i : '')).join('')}/S${survive.map((x, i) => (x ? i : '')).join('')}`;
  return { birth, survive, text: txt };
}
export interface Grid { w: number; h: number; c: Uint8Array }
export const newGrid = (w: number, h: number): Grid => ({ w, h, c: new Uint8Array(w * h) });
/** One generation: count the 8 neighbours (wrapping round or treating outside as dead) and apply the rule. */
export function lifeStep(g: Grid, rule: LifeRule, wrap: boolean): Grid {
  const { w, h, c } = g, out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      let X = x + dx, Y = y + dy;
      if (wrap) { X = (X + w) % w; Y = (Y + h) % h; } else if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
      n += c[Y * w + X];
    }
    out[y * w + x] = (c[y * w + x] ? rule.survive[n] : rule.birth[n]) ? 1 : 0;
  }
  return { w, h, c: out };
}
export const population = (g: Grid) => { let n = 0; for (const v of g.c) n += v; return n; };
export function randomGrid(w: number, h: number, density: number, seed: number): Grid { const g = newGrid(w, h), r = rng(seed); for (let i = 0; i < g.c.length; i++) g.c[i] = r() < density ? 1 : 0; return g; }

/** A cheap hash of a grid, for spotting repeats. */
export function gridHash(g: Grid): string {
  let a = 0x811c9dc5, b = 0x9747b28c;
  for (let i = 0; i < g.c.length; i++) if (g.c[i]) { a = Math.imul(a ^ i, 16777619); b = Math.imul(b ^ (i * 2654435761), 2246822519); }
  return (a >>> 0).toString(36) + (b >>> 0).toString(36) + ':' + population(g);
}

// ---------- RLE ----------
export interface Pattern { w: number; h: number; cells: [number, number][]; rule?: string; name?: string }
/** Read a pattern in RLE (the format of most Life pattern collections) or plain text (. and O, or 0 and 1). */
export function parseRLE(text: string): Pattern {
  const lines = text.replace(/\r/g, '').split('\n');
  let name: string | undefined, rule: string | undefined, w = 0, h = 0, header = false;
  const body: string[] = [];
  for (const raw of lines) {
    const l = raw.trim();
    if (!l) continue;
    if (l.startsWith('#')) { if (/^#N\s/.test(l)) name = l.slice(3).trim(); continue; }
    const hm = /^x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)(?:\s*,\s*rule\s*=\s*([^\s,]+))?/i.exec(l);
    if (hm && !header) { header = true; w = +hm[1]; h = +hm[2]; rule = hm[3]; continue; }
    body.push(l);
  }
  const src = body.join('');
  if (!header && /^[.Oo*01!\n]+$/.test(body.join('\n')) && !/\d{2,}|[bB$]/.test(src)) {
    // Plain text: one row per line, O * 1 alive.
    const cells: [number, number][] = [];
    body.forEach((row, y) => { for (let x = 0; x < row.length; x++) if (/[Oo*1]/.test(row[x])) cells.push([x, y]); });
    return { w: Math.max(0, ...body.map((r) => r.length)), h: body.length, cells, name };
  }
  const cells: [number, number][] = [];
  let x = 0, y = 0, run = '', mx = 0;
  for (const ch of src) {
    if (ch === '!') break;
    if (/\d/.test(ch)) { run += ch; continue; }
    const n = run ? parseInt(run, 10) : 1; run = '';
    if (n > 100000) throw new Error('A run in the RLE is too long.');
    if (ch === 'b' || ch === '.') x += n;
    else if (ch === '$') { y += n; x = 0; }
    else if (/[a-zA-Z]/.test(ch)) { for (let k = 0; k < n; k++) cells.push([x + k, y]); x += n; mx = Math.max(mx, x); }
    else if (/\s/.test(ch)) continue;
    else throw new Error(`"${ch}" is not allowed in RLE: use b for dead, o for alive, $ for a new row and ! at the end.`);
    mx = Math.max(mx, x);
  }
  if (!cells.length && !header) throw new Error('No live cells found. Paste a pattern in RLE (such as "bo$2bo$3o!") or as rows of . and O.');
  if (!header) { w = mx; h = y + 1; }
  return { w: Math.max(w, ...cells.map((c) => c[0] + 1)), h: Math.max(h, ...cells.map((c) => c[1] + 1)), cells, rule, name };
}
/** Write the live cells of a grid (cropped to their bounding box) as RLE, lines up to 70 characters. */
export function toRLE(g: Grid, rule: string): string {
  let x0 = g.w, y0 = g.h, x1 = -1, y1 = -1;
  for (let i = 0; i < g.c.length; i++) if (g.c[i]) { const x = i % g.w, y = (i - x) / g.w; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  if (x1 < 0) return `x = 0, y = 0, rule = ${rule}\n!\n`;
  const rows: string[] = [];
  for (let y = y0; y <= y1; y++) {
    const parts: [number, string][] = []; let cur = '', n = 0;
    for (let x = x0; x <= x1; x++) { const t = g.c[y * g.w + x] ? 'o' : 'b'; if (t === cur) n++; else { if (n) parts.push([n, cur]); cur = t; n = 1; } }
    if (n) parts.push([n, cur]);
    if (parts.length && parts[parts.length - 1][1] === 'b') parts.pop();
    rows.push(parts.map(([k, t]) => (k > 1 ? k : '') + t).join(''));
  }
  let body = '', pend = 0;
  rows.forEach((row, k) => { if (k) pend++; if (!row) return; if (pend) body += (pend > 1 ? pend : '') + '$'; pend = 0; body += row; });
  const toks = body.match(/\d*[bo$]/g)!;
  const lines: string[] = []; let line = '';
  for (const t of [...toks, '!']) { if ((line + t).length > 70) { lines.push(line); line = ''; } line += t; }
  lines.push(line);
  return `x = ${x1 - x0 + 1}, y = ${y1 - y0 + 1}, rule = ${rule}\n${lines.join('\n')}\n`;
}
/** Put a pattern into a grid, centred (or at x, y). Throws if it does not fit. */
export function place(g: Grid, p: Pattern, at?: [number, number]): Grid {
  if (p.w > g.w || p.h > g.h) throw new Error(`The pattern is ${p.w} × ${p.h} cells; make the grid at least that big.`);
  const ox = at ? at[0] : Math.floor((g.w - p.w) / 2), oy = at ? at[1] : Math.floor((g.h - p.h) / 2);
  const out = { w: g.w, h: g.h, c: g.c.slice() };
  for (const [x, y] of p.cells) out.c[(oy + y) * g.w + ox + x] = 1;
  return out;
}

export const RULES: { id: string; name: string; rule: string }[] = [
  { id: 'life', name: "Conway's Game of Life", rule: 'B3/S23' },
  { id: 'highlife', name: 'HighLife (has a replicator)', rule: 'B36/S23' },
  { id: 'seeds', name: 'Seeds (everything explodes)', rule: 'B2/S' },
  { id: 'daynight', name: 'Day & Night', rule: 'B3678/S34678' },
  { id: 'lwod', name: 'Life without death', rule: 'B3/S012345678' },
  { id: 'maze', name: 'Maze', rule: 'B3/S12345' },
  { id: '2x2', name: '2×2', rule: 'B36/S125' },
];
export const PATTERNS: { id: string; name: string; rle: string }[] = [
  { id: 'glider', name: 'Glider', rle: 'x = 3, y = 3\nbo$2bo$3o!' },
  { id: 'lwss', name: 'Lightweight spaceship', rle: 'x = 5, y = 4\nbo2bo$o4b$o3bo$4o!' },
  { id: 'blinker', name: 'Blinker (period 2)', rle: 'x = 3, y = 1\n3o!' },
  { id: 'pulsar', name: 'Pulsar (period 3)', rle: 'x = 13, y = 13\n2b3o3b3o2b2$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o2b2$2b3o3b3o2b$o4bobo4bo$o4bobo4bo$o4bobo4bo2$2b3o3b3o!' },
  { id: 'rpent', name: 'R-pentomino (long-lived)', rle: 'x = 3, y = 3\nb2o$2o$bo!' },
  { id: 'acorn', name: 'Acorn (long-lived)', rle: 'x = 7, y = 3\nbo$3bo$2o2b3o!' },
  { id: 'gun', name: 'Gosper glider gun', rle: 'x = 36, y = 9\n24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!' },
];
