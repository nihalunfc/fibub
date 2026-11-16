// Pure maths and sketches shared by the building and DIY calculators (tile, paint, wallpaper,
// drywall, gravel, concrete, deck). No DOM: sketches are returned as SVG text. Prices are plain
// numbers in whatever currency the visitor uses; nothing is stored or sent.

/** Parse a typed number; blank or junk gives NaN (never 0). */
export const num = (s: string): number => (s.trim() === '' ? NaN : Number(s));

/** A price with two decimals, e.g. 1,234.50. */
export const money = (v: number): string => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** A price is usable when it is a number above zero. */
export const validPrice = (p: number): boolean => Number.isFinite(p) && p > 0;

/** Cost of a quantity at a price; null when either is missing, zero or negative. */
export function costOf(qty: number, price: number): number | null {
  if (!Number.isFinite(qty) || qty < 0 || !validPrice(price)) return null;
  return qty * price;
}

/** Whole number of packs needed to cover a quantity (tiny tolerance so 3.0000001 does not round up). */
export const packs = (qty: number, perPack: number): number => (perPack > 0 && qty > 0 ? Math.ceil(qty / perPack - 1e-9) : 0);

/** Tiles across and down a rectangle, counted in whole tiles plus a part tile (rounded up). */
export function tileGrid(len: number, wid: number, tl: number, tw: number): { cols: number; rows: number; total: number } {
  if (!(len > 0 && wid > 0 && tl > 0 && tw > 0)) return { cols: 0, rows: 0, total: 0 };
  const cols = Math.ceil(len / tl - 1e-9), rows = Math.ceil(wid / tw - 1e-9);
  return { cols, rows, total: cols * rows };
}

/** Area one tonne covers at a depth (m) and density (t per m³), in m². */
export function areaPerTonne(depthM: number, densityTPerM3: number): number {
  return depthM > 0 && densityTPerM3 > 0 ? 1 / (depthM * densityTPerM3) : NaN;
}

/** Volume that bagged and ready-mix concrete cost: returns both totals and the cheaper one. */
export function compareConcrete(bags: number, bagPrice: number, volM3: number, readyPerM3: number, minLoadM3 = 0): { bagTotal: number; readyTotal: number; cheaper: 'bags' | 'ready' } | null {
  if (!validPrice(bagPrice) || !validPrice(readyPerM3) || !(volM3 > 0)) return null;
  const bagTotal = bags * bagPrice, readyTotal = Math.max(volM3, minLoadM3 > 0 ? minLoadM3 : 0) * readyPerM3;
  return { bagTotal, readyTotal, cheaper: bagTotal <= readyTotal ? 'bags' : 'ready' };
}

/** Joist centre positions along a run, in the same unit as run: 0, sp, 2sp ... and the far end. */
export function joistPositions(run: number, sp: number): number[] {
  if (!(run > 0 && sp > 0)) return [];
  const out: number[] = [];
  for (let x = 0; x < run - 1e-9; x += sp) out.push(+x.toFixed(6));
  out.push(run);
  return out;
}

// ---------- sketches ----------
const W = 300; // sketch width in SVG units
const lab = (x: number, y: number, t: string, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="11" fill="currentColor">${esc(t)}</text>`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const wrap = (h: number, inner: string, title: string) =>
  `<svg viewBox="0 0 ${W} ${h}" width="100%" role="img" aria-label="${esc(title)}" style="max-width:420px;color:var(--muted)">${inner}</svg>`;
/** Fit a w x h box into the drawing area, leaving room for labels. Returns scale and size. */
function fit(w: number, h: number, maxH = 180): { s: number; pw: number; ph: number } {
  const s = Math.min((W - 60) / w, maxH / h);
  return { s, pw: w * s, ph: h * s };
}

/** Plan of a rectangle, optionally with a tile grid. Sizes share one unit; labels come from the caller. */
export function rectSketch(w: number, h: number, labW: string, labH: string, grid?: { cols: number; rows: number }, title = 'Scaled sketch'): string {
  if (!(w > 0 && h > 0)) return '';
  const { pw, ph } = fit(w, h), x0 = (W - pw) / 2, y0 = 8;
  let g = '';
  if (grid && grid.cols > 0 && grid.rows > 0 && grid.cols * grid.rows <= 4000 && grid.cols <= 120 && grid.rows <= 120) {
    const rh = ph / grid.rows, cwid = pw / grid.cols;
    for (let i = 1; i < grid.cols; i++) g += `<line x1="${(x0 + i * cwid).toFixed(2)}" y1="${y0}" x2="${(x0 + i * cwid).toFixed(2)}" y2="${(y0 + ph).toFixed(2)}" stroke="currentColor" stroke-width="0.5" opacity="0.5"/>`;
    for (let j = 1; j < grid.rows; j++) g += `<line x1="${x0}" y1="${(y0 + j * rh).toFixed(2)}" x2="${(x0 + pw).toFixed(2)}" y2="${(y0 + j * rh).toFixed(2)}" stroke="currentColor" stroke-width="0.5" opacity="0.5"/>`;
  }
  const body = `<rect x="${x0.toFixed(2)}" y="${y0}" width="${pw.toFixed(2)}" height="${ph.toFixed(2)}" fill="var(--accent-soft)" stroke="var(--ink)" stroke-width="1.5"/>${g}`
    + lab(W / 2, y0 + ph + 16, labW) + `<text x="${(x0 - 8).toFixed(2)}" y="${(y0 + ph / 2).toFixed(2)}" text-anchor="middle" font-size="11" fill="currentColor" transform="rotate(-90 ${(x0 - 8).toFixed(2)} ${(y0 + ph / 2).toFixed(2)})">${esc(labH)}</text>`;
  return wrap(y0 + ph + 24, body, title);
}

/** Wall of wallpaper strips: width across, height up. `strips` is the number of strips the roll width gives. */
export function stripSketch(totalW: number, h: number, strips: number, labW: string, labH: string): string {
  if (!(totalW > 0 && h > 0 && strips > 0)) return '';
  const { pw, ph } = fit(totalW, h, 130), x0 = (W - pw) / 2, y0 = 8;
  let g = '';
  const shown = Math.min(strips, 120), sw = pw / strips;
  for (let i = 0; i < shown; i++) g += `<rect x="${(x0 + i * sw).toFixed(2)}" y="${y0}" width="${sw.toFixed(2)}" height="${ph.toFixed(2)}" fill="${i % 2 ? 'var(--surface)' : 'var(--accent-soft)'}" stroke="var(--ink)" stroke-width="0.6"/>`;
  return wrap(y0 + ph + 24, g + lab(W / 2, y0 + ph + 16, `${labW} (${strips} strips)`) + `<text x="${(x0 - 8).toFixed(2)}" y="${(y0 + ph / 2).toFixed(2)}" text-anchor="middle" font-size="11" fill="currentColor" transform="rotate(-90 ${(x0 - 8).toFixed(2)} ${(y0 + ph / 2).toFixed(2)})">${esc(labH)}</text>`, 'Scaled sketch of the wallpaper strips');
}

/** Deck from above: boards run along the x axis (length `run`), `rows` boards stack across `wid`, joists run across. */
export function deckSketch(run: number, wid: number, rows: number, joists: number[], labRun: string, labWid: string): string {
  if (!(run > 0 && wid > 0 && rows > 0)) return '';
  const { s, pw, ph } = fit(run, wid), x0 = (W - pw) / 2, y0 = 8;
  let g = `<rect x="${x0.toFixed(2)}" y="${y0}" width="${pw.toFixed(2)}" height="${ph.toFixed(2)}" fill="var(--accent-soft)" stroke="var(--ink)" stroke-width="1.5"/>`;
  if (rows <= 80) { const rh = ph / rows; for (let i = 1; i < rows; i++) g += `<line x1="${x0}" y1="${(y0 + i * rh).toFixed(2)}" x2="${(x0 + pw).toFixed(2)}" y2="${(y0 + i * rh).toFixed(2)}" stroke="currentColor" stroke-width="0.5" opacity="0.6"/>`; }
  if (joists.length <= 80) for (const j of joists) g += `<line x1="${(x0 + j * s).toFixed(2)}" y1="${y0}" x2="${(x0 + j * s).toFixed(2)}" y2="${(y0 + ph).toFixed(2)}" stroke="var(--ink)" stroke-width="1" stroke-dasharray="3 2"/>`;
  g += lab(W / 2, y0 + ph + 16, `${labRun}  ·  dashed lines are joists`) + `<text x="${(x0 - 8).toFixed(2)}" y="${(y0 + ph / 2).toFixed(2)}" text-anchor="middle" font-size="11" fill="currentColor" transform="rotate(-90 ${(x0 - 8).toFixed(2)} ${(y0 + ph / 2).toFixed(2)})">${esc(labWid)}</text>`;
  return wrap(y0 + ph + 24, g, 'Scaled plan of the deck: boards and joists');
}

/** Side view of solid steps, rise and tread in any one unit. */
export function stepsSketch(n: number, rise: number, tread: number, labRise: string, labTread: string): string {
  if (!(n >= 1 && rise > 0 && tread > 0)) return '';
  const k = Math.min(Math.round(n), 30), { s } = fit(k * tread, k * rise, 130), x0 = 30, y0 = 8, H = k * rise * s;
  let d = `M ${x0} ${y0 + H}`;
  for (let i = 1; i <= k; i++) d += ` L ${(x0 + (i - 1) * tread * s).toFixed(2)} ${(y0 + H - i * rise * s).toFixed(2)} L ${(x0 + i * tread * s).toFixed(2)} ${(y0 + H - i * rise * s).toFixed(2)}`;
  d += ` L ${(x0 + k * tread * s).toFixed(2)} ${y0 + H} Z`;
  return wrap(y0 + H + 24, `<path d="${d}" fill="var(--accent-soft)" stroke="var(--ink)" stroke-width="1.5"/>` + lab(x0 + (k * tread * s) / 2, y0 + H + 16, `${labTread} tread, ${labRise} rise, ${k} step${k === 1 ? '' : 's'}`), 'Scaled side view of the steps');
}

/** Round post hole: outer circle with the post inside. */
export function holeSketch(d: number, post: number, labD: string): string {
  if (!(d > 0)) return '';
  const r = 60, rp = Math.min(r, (Math.max(0, post) / d) * r), cx = W / 2, cy = 70;
  return wrap(150, `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--accent-soft)" stroke="var(--ink)" stroke-width="1.5"/>${rp > 0 ? `<circle cx="${cx}" cy="${cy}" r="${rp.toFixed(2)}" fill="var(--surface)" stroke="var(--ink)" stroke-width="1"/>` : ''}` + lab(cx, 148, `Hole ${labD}, post in the middle`), 'Scaled top view of a post hole');
}
