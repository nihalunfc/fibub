// Stratigraphic column: bed table → layout (cumulative heights, scaled to paper) → SVG in millimetres.
// Fill patterns are fibub's own simple designs (dots for sand, circles for gravel, bricks for limestone and so on),
// in the spirit of the usual geological conventions but not copied from any standard. Plain TypeScript, no DOM.

export const GRAINS = [
  { code: 'cl', name: 'clay' }, { code: 'si', name: 'silt' }, { code: 'vf', name: 'very fine sand' }, { code: 'f', name: 'fine sand' },
  { code: 'm', name: 'medium sand' }, { code: 'c', name: 'coarse sand' }, { code: 'vc', name: 'very coarse sand' }, { code: 'gr', name: 'granule' },
  { code: 'pb', name: 'pebble' }, { code: 'cb', name: 'cobble' }, { code: 'bd', name: 'boulder' },
];
const GRAIN_WORDS: Record<string, number> = {
  cl: 0, clay: 0, si: 1, silt: 1, vf: 2, 'very fine': 2, 'very fine sand': 2, f: 3, fine: 3, 'fine sand': 3, m: 4, med: 4, medium: 4, 'medium sand': 4,
  c: 5, coarse: 5, 'coarse sand': 5, vc: 6, 'very coarse': 6, 'very coarse sand': 6, gr: 7, gran: 7, granule: 7, granules: 7,
  pb: 8, peb: 8, pebble: 8, pebbles: 8, cb: 9, cob: 9, cobble: 9, cobbles: 9, bd: 10, bo: 10, boulder: 10, boulders: 10,
};

export type Litho = { id: string; name: string; words: string[]; grain: number; tint: string };
/** Lithologies with their own fill pattern. `grain` is the default profile width when no grain size is given. */
export const LITHOS: Litho[] = [
  { id: 'sandstone', name: 'Sandstone', words: ['sandstone', 'sand', 'ss', 'arenite', 'greywacke'], grain: 4, tint: '#f6e7a8' },
  { id: 'conglomerate', name: 'Conglomerate', words: ['conglomerate', 'cgl', 'gravel'], grain: 8, tint: '#f0cf8c' },
  { id: 'breccia', name: 'Breccia', words: ['breccia', 'bx'], grain: 8, tint: '#e9c08a' },
  { id: 'siltstone', name: 'Siltstone', words: ['siltstone', 'silt', 'slt'], grain: 1, tint: '#d9d2b8' },
  { id: 'mudstone', name: 'Mudstone', words: ['mudstone', 'mud', 'mdst', 'claystone', 'clay'], grain: 0, tint: '#c9c9c9' },
  { id: 'shale', name: 'Shale', words: ['shale', 'sh'], grain: 0, tint: '#b9bcc2' },
  { id: 'limestone', name: 'Limestone', words: ['limestone', 'ls', 'lst', 'grainstone', 'packstone', 'wackestone'], grain: 3, tint: '#bcd9ef' },
  { id: 'dolostone', name: 'Dolostone', words: ['dolostone', 'dolomite', 'dol'], grain: 3, tint: '#c9cdec' },
  { id: 'marl', name: 'Marl', words: ['marl', 'marlstone'], grain: 1, tint: '#cfe1d6' },
  { id: 'chalk', name: 'Chalk', words: ['chalk'], grain: 1, tint: '#f4f6f8' },
  { id: 'chert', name: 'Chert', words: ['chert', 'flint'], grain: 1, tint: '#e3d0d8' },
  { id: 'coal', name: 'Coal', words: ['coal', 'lignite'], grain: 0, tint: '#222222' },
  { id: 'evaporite', name: 'Evaporite', words: ['evaporite', 'gypsum', 'anhydrite', 'halite', 'salt'], grain: 2, tint: '#f2d8ef' },
  { id: 'tuff', name: 'Tuff', words: ['tuff', 'ash', 'volcanic ash', 'tephra'], grain: 2, tint: '#f3c6a8' },
  { id: 'lava', name: 'Lava', words: ['lava', 'basalt', 'andesite', 'rhyolite', 'volcanic'], grain: 5, tint: '#d9a39a' },
  { id: 'intrusive', name: 'Intrusive rock', words: ['intrusive', 'granite', 'igneous', 'dolerite', 'gabbro', 'sill', 'dyke', 'dike'], grain: 6, tint: '#e7b7b7' },
  { id: 'diamictite', name: 'Diamictite', words: ['diamictite', 'diamict', 'till', 'tillite'], grain: 7, tint: '#d8d0c0' },
  { id: 'covered', name: 'Covered', words: ['covered', 'no exposure', 'cover', 'gap', 'unexposed'], grain: 3, tint: '#ffffff' },
];
export function findLitho(s: string): Litho | null {
  const t = s.trim().toLowerCase();
  if (!t) return null;
  const exact = LITHOS.find((l) => l.words.includes(t));
  if (exact) return exact;
  // "sandy limestone": the word that ends last (the noun) wins.
  let best: Litho | null = null, end = -1;
  for (const l of LITHOS) for (const w of l.words) { const i = w.length > 3 ? t.lastIndexOf(w) : -1; if (i >= 0 && i + w.length > end) { end = i + w.length; best = l; } }
  return best;
}

/** "m", "medium", "c-f" (base coarse, top fine) → [base, top] indices into GRAINS, or null if unreadable. */
export function parseGrain(s: string): [number, number] | null {
  const t = s.trim().toLowerCase();
  if (!t) return null;
  const parts = t.split(/\s*(?:-|–|>|→|to)\s*/).filter(Boolean);
  if (parts.length > 2) return null;
  const v = parts.map((p) => GRAIN_WORDS[p]);
  if (v.some((x) => x === undefined)) return null;
  return [v[0], v[v.length - 1]];
}

export type Contact = 'sharp' | 'erosive' | 'gradational';
export function parseContact(s: string): Contact | null {
  const t = s.trim().toLowerCase();
  if (!t || /^(sharp|s|planar|flat)$/.test(t)) return 'sharp';
  if (/^(erosive|erosional|e|scour|scoured|eroded|unconformity|unconformable)$/.test(t)) return 'erosive';
  if (/^(gradational|gradual|g|transitional)$/.test(t)) return 'gradational';
  return null;
}

export type Bed = { thick: number; litho: Litho; grain: [number, number]; contact: Contact; note: string };
export type Placed = Bed & { base: number; top: number };

/** Stack beds listed oldest first: base and top heights (same unit as thickness), from 0 at the base. */
export function stack(beds: Bed[]): Placed[] {
  let h = 0;
  return beds.map((b) => { const base = h; h += b.thick; return { ...b, base, top: h }; });
}

export type Opts = {
  /** Paper millimetres per metre of rock (10 = 1:100). */
  mmPerM: number;
  colour: boolean;
  /** Width of the column for clay; each grain-size step adds `step` mm. */
  w0?: number; step?: number; notesW?: number; font?: number; title?: string;
  /** The 1:N shown in the scale note (default 1000 / mmPerM, right when thickness is in metres). */
  ratio?: number;
};
export const widthOf = (g: number, o: Opts) => (o.w0 ?? 8) + (o.step ?? 3.2) * g;

/** Round tick interval (in m) so ticks sit 8 to 25 mm apart on paper. */
export function tickStep(mmPerM: number) {
  for (const s of [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000]) if (s * mmPerM >= 8) return s;
  return 10000;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f = (x: number) => +x.toFixed(3);

/** SVG <pattern> definitions (user space in mm), black line work. */
export function patternDefs(ink = '#000'): Record<string, string> {
  const P = (id: string, w: number, h: number, body: string) => `<pattern id="sc-${id}" patternUnits="userSpaceOnUse" width="${w}" height="${h}">${body}</pattern>`;
  const sw = `stroke="${ink}" stroke-width="0.18" fill="none"`;
  return {
    sandstone: P('sandstone', 2.4, 2.4, `<circle cx="0.6" cy="0.6" r="0.17" fill="${ink}"/><circle cx="1.8" cy="1.8" r="0.17" fill="${ink}"/>`),
    conglomerate: P('conglomerate', 5, 4, `<circle cx="1.3" cy="1.1" r="0.85" ${sw}/><ellipse cx="3.7" cy="3" rx="0.95" ry="0.65" ${sw}/><circle cx="3.6" cy="0.7" r="0.15" fill="${ink}"/><circle cx="1" cy="3.2" r="0.15" fill="${ink}"/>`),
    breccia: P('breccia', 5, 4, `<path d="M0.4 1.8 L1.4 0.4 L2.2 1.6 Z M2.8 3.6 L3.4 2.2 L4.6 3.2 Z" ${sw}/><circle cx="3.8" cy="0.9" r="0.15" fill="${ink}"/><circle cx="1.2" cy="3.1" r="0.15" fill="${ink}"/>`),
    siltstone: P('siltstone', 3, 1.6, `<path d="M0.2 0.4 H1.2 M1.7 1.2 H2.8" ${sw}/><circle cx="2.3" cy="0.4" r="0.13" fill="${ink}"/><circle cx="0.7" cy="1.2" r="0.13" fill="${ink}"/>`),
    mudstone: P('mudstone', 4, 1.4, `<path d="M0.2 0.4 H2.2 M2.4 1.1 H3.8 M0 1.1 H0.6" ${sw}/>`),
    shale: P('shale', 4, 1.3, `<path d="M0 0.3 H1.6 M2 0.3 H4 M0.8 0.95 H3.2" ${sw}/>`),
    limestone: P('limestone', 5, 2.4, `<path d="M0 0.05 H5 M0 1.25 H5 M1.25 0.05 V1.25 M3.75 1.25 V2.45" ${sw}/>`),
    dolostone: P('dolostone', 5, 2.4, `<path d="M0 0.05 H5 M0 1.25 H5 M0.9 0.05 L1.6 1.25 M3.4 1.25 L4.1 2.45" ${sw}/>`),
    marl: P('marl', 5, 2.4, `<path d="M0 0.05 H5 M1.25 0.05 V1.25 M0.3 1.75 H2.2 M2.8 1.75 H4.7" ${sw}/>`),
    chalk: P('chalk', 5, 2.4, `<path d="M0 0.05 H5 M0 1.25 H5 M1.25 0.05 V1.25 M3.75 1.25 V2.45" stroke="${ink}" stroke-width="0.12" stroke-dasharray="0.5 0.4" fill="none"/>`),
    chert: P('chert', 4, 3, `<path d="M0.4 1.1 L1.2 0.4 L2 1.1 Z M2.4 2.6 L3.2 1.9 L4 2.6" ${sw}/>`),
    coal: P('coal', 2, 2, `<rect width="2" height="2" fill="${ink}"/>`),
    evaporite: P('evaporite', 3, 3, `<path d="M0.5 0.5 L1.3 1.3 M1.3 0.5 L0.5 1.3 M2 2 L2.8 2.8 M2.8 2 L2 2.8" ${sw}/>`),
    tuff: P('tuff', 3.2, 2.6, `<path d="M0.3 0.4 L0.8 1.1 L1.3 0.4 M1.9 1.7 L2.4 2.4 L2.9 1.7" ${sw}/>`),
    lava: P('lava', 4, 3.4, `<path d="M0.4 0.4 L1 1.3 L1.6 0.4 M2.4 2 L3 2.9 L3.6 2" ${sw}/><path d="M0 2.4 H1.4 M2 0.9 H3.6" stroke="${ink}" stroke-width="0.12" fill="none"/>`),
    intrusive: P('intrusive', 3.4, 3.4, `<path d="M0.9 0.3 V1.5 M0.3 0.9 H1.5 M2.6 1.9 V3.1 M2 2.5 H3.2" ${sw}/>`),
    diamictite: P('diamictite', 6, 4, `<path d="M0.3 0.5 H1.5 M3.5 3.5 H5" ${sw}/><circle cx="4" cy="1.2" r="0.8" ${sw}/><path d="M1 2.6 L1.8 2 L2.4 3 Z" ${sw}/><circle cx="5.2" cy="2.4" r="0.13" fill="${ink}"/><circle cx="2.8" cy="0.9" r="0.13" fill="${ink}"/>`),
    covered: P('covered', 2.5, 2.5, `<path d="M0 2.5 L2.5 0" stroke="${ink}" stroke-width="0.1" fill="none"/>`),
  };
}

export type Layout = {
  beds: (Placed & { y0: number; y1: number; wBase: number; wTop: number })[];
  total: number; heightMm: number; widthMm: number; colX: number; colY: number; maxW: number;
  ticks: number[]; labels: { bed: number; y: number; lines: string[] }[]; legend: Litho[];
};

/** Wrap text into lines of at most `max` characters (by words). */
export function wrap(s: string, max: number): string[] {
  const out: string[] = []; let line = '';
  for (const w of s.split(/\s+/).filter(Boolean)) {
    if (!line) line = w; else if ((line + ' ' + w).length <= max) line += ' ' + w; else { out.push(line); line = w; }
    while (line.length > max) { out.push(line.slice(0, max)); line = line.slice(max); }
  }
  if (line) out.push(line);
  return out;
}

/** Place everything on paper (mm). y grows downward; the column's base is at colY + heightMm. */
export function layout(beds: Bed[], o: Opts): Layout {
  const st = stack(beds), total = st.length ? st[st.length - 1].top : 0;
  const fs = o.font ?? 2.8, axisW = 16, colX = axisW, colY = 6 + (o.title ? fs * 2 : 0) + fs;
  const heightMm = total * o.mmPerM, baseY = colY + heightMm;
  const placed = st.map((b) => ({ ...b, y0: baseY - b.base * o.mmPerM, y1: baseY - b.top * o.mmPerM, wBase: widthOf(b.grain[0], o), wTop: widthOf(b.grain[1], o) }));
  const maxW = widthOf(GRAINS.length - 1, o);
  const step = tickStep(o.mmPerM), ticks: number[] = [];
  for (let k = 0; k * step <= total + 1e-9; k++) ticks.push(+(k * step).toPrecision(12));
  // Notes: at each bed's middle, pushed apart so they never overlap, with leader lines.
  const lh = fs * 1.2, notesW = o.notesW ?? 62, maxChars = Math.max(10, Math.floor(notesW / (fs * 0.52)));
  const raw = placed.map((b, i) => ({ bed: i, want: (b.y0 + b.y1) / 2, lines: b.note ? wrap(b.note, maxChars) : [] })).filter((l) => l.lines.length);
  // Sweep from the base up: each block's centre y, block height = lines * lh.
  const labels: Layout['labels'] = [];
  let ceiling = Infinity; // y of the top edge of the block below (smaller y is higher)
  for (let i = 0; i < raw.length; i++) {
    const r = raw[i], hgt = r.lines.length * lh;
    let c = r.want;
    if (c + hgt / 2 > ceiling - 0.6) c = ceiling - 0.6 - hgt / 2;
    labels.push({ bed: r.bed, y: c, lines: r.lines });
    ceiling = c - hgt / 2;
  }
  // If the top block went above the paper, shift every block down as little as needed (then they may pass the base).
  const lowest = labels.length ? Math.min(...labels.map((l) => l.y - (l.lines.length * lh) / 2)) : colY;
  if (lowest < colY - fs) { const d = colY - fs - lowest; labels.forEach((l) => (l.y += d)); }
  const used: Litho[] = [];
  for (const b of placed) if (!used.includes(b.litho)) used.push(b.litho);
  const legendRows = Math.ceil(used.length / 3);
  const labelsBottom = labels.length ? Math.max(...labels.map((l) => l.y + (l.lines.length * lh) / 2)) : 0;
  const scaleBottom = baseY + 4 + fs * 2.6;
  const heightTotal = Math.max(scaleBottom, labelsBottom) + 3 + legendRows * 7 + fs + 4;
  return { beds: placed, total, heightMm: heightTotal, widthMm: colX + maxW + 6 + notesW + 4, colX, colY, maxW, ticks, labels, legend: used };
}

/** The whole column as an SVG document in millimetres (prints at the chosen scale). */
export function columnSvg(beds: Bed[], o: Opts, unitLabel = 'm'): string {
  const L = layout(beds, o), fs = o.font ?? 2.8, ink = '#000', defs = patternDefs(ink);
  const baseY = L.colY + L.total * o.mmPerM, x0 = L.colX, p: string[] = [];
  const W = f(L.widthMm), H = f(L.heightMm);
  p.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}" font-family="Helvetica, Arial, sans-serif">`);
  p.push(`<defs>${L.legend.map((l) => defs[l.id]).join('')}</defs>`);
  p.push(`<rect width="${W}" height="${H}" fill="#fff"/>`);
  if (o.title) p.push(`<text x="${x0}" y="${f(6 + fs * 1.3)}" font-size="${f(fs * 1.5)}" font-weight="700" fill="${ink}">${esc(o.title)}</text>`);
  // Beds: tint, pattern, profile edge.
  for (const b of L.beds) {
    const poly = `${f(x0)},${f(b.y0)} ${f(x0 + b.wBase)},${f(b.y0)} ${f(x0 + b.wTop)},${f(b.y1)} ${f(x0)},${f(b.y1)}`;
    if (o.colour) p.push(`<polygon points="${poly}" fill="${b.litho.tint}"/>`);
    p.push(`<polygon points="${poly}" fill="url(#sc-${b.litho.id})"/>`);
    p.push(`<line x1="${f(x0 + b.wBase)}" y1="${f(b.y0)}" x2="${f(x0 + b.wTop)}" y2="${f(b.y1)}" stroke="${ink}" stroke-width="0.3"/>`);
  }
  // Contacts (at each bed's base) and the top line.
  L.beds.forEach((b, i) => {
    const w = Math.max(b.wBase, i ? L.beds[i - 1].wTop : b.wBase), y = f(b.y0);
    if (b.contact === 'erosive' && i) {
      const n = Math.max(2, Math.round(w / 2.4)), pts: string[] = [];
      for (let k = 0; k <= n * 8; k++) { const x = x0 + (w * k) / (n * 8); pts.push(`${f(x)},${f(b.y0 - 0.45 * Math.sin((2 * Math.PI * k) / 8))}`); }
      p.push(`<polyline points="${pts.join(' ')}" fill="none" stroke="${ink}" stroke-width="0.35"/>`);
    } else if (b.contact === 'gradational' && i) p.push(`<line x1="${f(x0)}" y1="${y}" x2="${f(x0 + w)}" y2="${y}" stroke="${ink}" stroke-width="0.25" stroke-dasharray="1 0.8"/>`);
    else p.push(`<line x1="${f(x0)}" y1="${y}" x2="${f(x0 + w)}" y2="${y}" stroke="${ink}" stroke-width="0.3"/>`);
  });
  if (L.beds.length) { const t = L.beds[L.beds.length - 1]; p.push(`<line x1="${f(x0)}" y1="${f(t.y1)}" x2="${f(x0 + t.wTop)}" y2="${f(t.y1)}" stroke="${ink}" stroke-width="0.3"/>`); }
  p.push(`<line x1="${f(x0)}" y1="${f(L.colY)}" x2="${f(x0)}" y2="${f(baseY)}" stroke="${ink}" stroke-width="0.3"/>`);
  // Scale bar: alternating black and white blocks between ticks, labels on the left.
  const bx = x0 - 4.5;
  L.ticks.forEach((t, k) => {
    const y = baseY - t * o.mmPerM, next = Math.min(L.total, L.ticks[k + 1] ?? L.total), y2 = baseY - next * o.mmPerM;
    if (next > t) p.push(`<rect x="${f(bx)}" y="${f(y2)}" width="1.6" height="${f(y - y2)}" fill="${k % 2 ? '#fff' : ink}" stroke="${ink}" stroke-width="0.15"/>`);
    p.push(`<line x1="${f(bx - 0.8)}" y1="${f(y)}" x2="${f(bx)}" y2="${f(y)}" stroke="${ink}" stroke-width="0.2"/>`);
    p.push(`<text x="${f(bx - 1.3)}" y="${f(y + fs * 0.35)}" font-size="${fs}" text-anchor="end" fill="${ink}">${+t.toPrecision(6)}</text>`);
  });
  p.push(`<text x="${f(bx - 1.3)}" y="${f(L.colY - fs * 0.6)}" font-size="${fs}" text-anchor="end" fill="${ink}">${esc(unitLabel)}</text>`);
  // Grain-size scale under the column.
  const gy = baseY + 1.5;
  p.push(`<line x1="${f(x0)}" y1="${f(gy)}" x2="${f(x0 + L.maxW)}" y2="${f(gy)}" stroke="${ink}" stroke-width="0.2"/>`);
  GRAINS.forEach((g, i) => {
    const x = x0 + widthOf(i, o);
    p.push(`<line x1="${f(x)}" y1="${f(gy)}" x2="${f(x)}" y2="${f(gy + 1)}" stroke="${ink}" stroke-width="0.2"/>`);
    p.push(`<text x="${f(x)}" y="${f(gy + 1.2)}" font-size="${f(fs * 0.72)}" fill="${ink}" text-anchor="end" transform="rotate(-90 ${f(x)} ${f(gy + 1.2)})" dy="${f(fs * 0.25)}">${g.code}</text>`);
  });
  // Notes with leader lines.
  const nx = x0 + L.maxW + 6, lh = fs * 1.2;
  for (const l of L.labels) {
    const b = L.beds[l.bed], ym = (b.y0 + b.y1) / 2, top = l.y - (l.lines.length * lh) / 2;
    p.push(`<polyline points="${f(x0 + (b.wBase + b.wTop) / 2 + 0.6)},${f(ym)} ${f(nx - 2.5)},${f(ym)} ${f(nx - 1)},${f(l.y)}" fill="none" stroke="#777" stroke-width="0.15"/>`);
    l.lines.forEach((s, k) => p.push(`<text x="${f(nx)}" y="${f(top + lh * (k + 0.78))}" font-size="${fs}" fill="${ink}">${esc(s)}</text>`));
  }
  // Legend and scale text.
  const ly0 = L.heightMm - Math.ceil(L.legend.length / 3) * 7 - fs - 4;
  const colW = (L.widthMm - x0) / 3;
  L.legend.forEach((l, i) => {
    const x = x0 + (i % 3) * colW, y = ly0 + Math.floor(i / 3) * 7;
    if (o.colour) p.push(`<rect x="${f(x)}" y="${f(y)}" width="8" height="5" fill="${l.tint}"/>`);
    p.push(`<rect x="${f(x)}" y="${f(y)}" width="8" height="5" fill="url(#sc-${l.id})" stroke="${ink}" stroke-width="0.2"/>`);
    p.push(`<text x="${f(x + 10)}" y="${f(y + 3.6)}" font-size="${fs}" fill="${ink}">${esc(l.name)}</text>`);
  });
  const ratio = o.ratio ?? Math.round(1000 / o.mmPerM);
  p.push(`<text x="${f(x0)}" y="${f(L.heightMm - 3)}" font-size="${f(fs * 0.85)}" fill="#555">Vertical scale 1:${ratio.toLocaleString('en')} · contacts: solid sharp, wavy erosive, dashed gradational · made with fibub.com</text>`);
  p.push('</svg>');
  return p.join('\n');
}

/** Bed table back to CSV rows (oldest first), with base and top heights. */
export function toRows(beds: Bed[]): (string | number)[][] {
  return [['thickness', 'lithology', 'grain', 'contact', 'notes', 'base', 'top'], ...stack(beds).map((b) => [
    +b.thick.toPrecision(8), b.litho.name.toLowerCase(), b.grain[0] === b.grain[1] ? GRAINS[b.grain[0]].code : `${GRAINS[b.grain[0]].code}-${GRAINS[b.grain[1]].code}`, b.contact, b.note, +b.base.toPrecision(10), +b.top.toPrecision(10)])];
}
