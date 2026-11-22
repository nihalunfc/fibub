// Tiny SVG chart maker for the Data storytelling course. Every figure draws its charts with these functions, so
// a "before" and an "after" chart differ only in the options a lesson is teaching (gridlines, colour, labels...).
// Returns SVG markup as a string; colours come from CSS variables so light, dark and red night mode all work.
// The numbers come from ./data.ts (the Northbay Goods data, the same made-up shop as the Power BI course).

export const PAL = ['#0072b2', '#e69f00', '#009e73', '#cc79a7', '#56b4e9', '#d55e00']; // Okabe-Ito: safe for colour-blind readers
export const GREY = '#a3a8ae';
const INK = 'var(--ink)', MUTED = 'var(--muted)', LINE = 'var(--line)';

export const k = (n: number) => (Math.abs(n) >= 1000 ? `${(n / 1000).toFixed(Math.abs(n) >= 100000 ? 0 : 1).replace(/\.0$/, '')}k` : String(Math.round(n)));
export const pct = (n: number, d = 0) => `${(n * 100).toFixed(d)}%`;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const txt = (x: number, y: number, s: string, a = '', fill = INK, size = 12) => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${size}" fill="${fill}" ${a}>${esc(s)}</text>`;

/** "Nice" axis ticks from lo to hi. */
export function ticks(lo: number, hi: number, n = 4) {
  const span = hi - lo || 1, raw = span / n, mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= n) ?? mag * 10;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(6));
  return out;
}

export type BarOpts = {
  labels: string[]; values: number[];
  horizontal?: boolean; sort?: boolean; grid?: boolean; border?: boolean; axis?: boolean;
  colors?: string[] | 'rainbow' | 'one'; highlight?: number[]; dataLabels?: boolean; yMin?: number; yMax?: number;
  fmt?: (n: number) => string; w?: number; h?: number; rotate?: boolean; legend?: boolean; label?: string;
  target?: number[]; // a target mark per bar
};

/** A bar (horizontal) or column (vertical) chart. */
export function bar(o: BarOpts): string {
  const fmt = o.fmt ?? k;
  let idx = o.labels.map((_, i) => i);
  if (o.sort) idx.sort((a, b) => o.values[b] - o.values[a]);
  const L = idx.map((i) => o.labels[i]), V = idx.map((i) => o.values[i]), Tg = o.target && idx.map((i) => o.target![i]);
  const hi = new Set((o.highlight ?? []).map((h) => idx.indexOf(h)));
  const col = (i: number) => {
    if (Array.isArray(o.colors)) return o.colors[idx[i]] ?? PAL[0];
    if (o.colors === 'rainbow') return PAL[i % PAL.length];
    if (hi.size) return hi.has(i) ? PAL[0] : GREY;
    return PAL[0];
  };
  const W = o.w ?? 360, H = o.h ?? (o.horizontal ? 34 + L.length * 30 : 230);
  const yMin = o.yMin ?? 0, yMax = o.yMax ?? Math.max(...V, ...(Tg ?? [])) * 1.08;
  const ts = ticks(yMin, yMax);
  const parts: string[] = [];
  const legendH = o.legend ? 22 : 0;
  if (o.horizontal) {
    const left = Math.min(130, 12 + Math.max(...L.map((s) => s.length)) * 6.6), right = o.dataLabels ? 44 : 14, top = 8 + legendH, bot = o.axis === false ? 6 : 24;
    const pw = W - left - right, bh = (H - top - bot) / L.length;
    const x = (v: number) => left + ((v - yMin) / (yMax - yMin)) * pw;
    if (o.grid) ts.forEach((t) => parts.push(`<line x1="${x(t)}" x2="${x(t)}" y1="${top}" y2="${H - bot}" stroke="${LINE}"/>`));
    if (o.axis !== false) ts.forEach((t) => parts.push(txt(x(t), H - 8, fmt(t), 'text-anchor="middle"', MUTED, 11)));
    L.forEach((l, i) => {
      const y = top + i * bh;
      parts.push(txt(left - 6, y + bh / 2 + 4, l, 'text-anchor="end"', hi.size && !hi.has(i) ? MUTED : INK));
      parts.push(`<rect x="${left}" y="${(y + bh * 0.18).toFixed(1)}" width="${Math.max(0, x(V[i]) - left).toFixed(1)}" height="${(bh * 0.64).toFixed(1)}" fill="${col(i)}"/>`);
      if (Tg) parts.push(`<line x1="${x(Tg[i])}" x2="${x(Tg[i])}" y1="${y + bh * 0.08}" y2="${y + bh * 0.92}" stroke="${INK}" stroke-width="2.5"/>`);
      if (o.dataLabels) parts.push(txt(x(V[i]) + 4, y + bh / 2 + 4, fmt(V[i]), '', hi.size && !hi.has(i) ? MUTED : INK, 11.5));
    });
    parts.push(`<line x1="${left}" x2="${left}" y1="${top}" y2="${H - bot}" stroke="${MUTED}"/>`);
  } else {
    const rot = o.rotate, left = o.axis === false ? 8 : 40, right = 8, top = 10 + legendH + (o.dataLabels ? 8 : 0), bot = rot ? 62 : 26;
    const pw = W - left - right, bw = pw / L.length, ph = H - top - bot;
    const y = (v: number) => top + ph - ((Math.max(v, yMin) - yMin) / (yMax - yMin)) * ph;
    if (o.grid) ts.forEach((t) => parts.push(`<line x1="${left}" x2="${W - right}" y1="${y(t)}" y2="${y(t)}" stroke="${LINE}"/>`));
    if (o.axis !== false) ts.forEach((t) => parts.push(txt(left - 5, y(t) + 4, fmt(t), 'text-anchor="end"', MUTED, 11)));
    L.forEach((l, i) => {
      const cx = left + i * bw + bw / 2;
      parts.push(`<rect x="${(cx - bw * 0.32).toFixed(1)}" y="${y(V[i]).toFixed(1)}" width="${(bw * 0.64).toFixed(1)}" height="${(top + ph - y(V[i])).toFixed(1)}" fill="${col(i)}"/>`);
      if (Tg) parts.push(`<line x1="${cx - bw * 0.42}" x2="${cx + bw * 0.42}" y1="${y(Tg[i])}" y2="${y(Tg[i])}" stroke="${INK}" stroke-width="2.5"/>`);
      if (o.dataLabels) parts.push(txt(cx, y(V[i]) - 5, fmt(V[i]), 'text-anchor="middle"', hi.size && !hi.has(i) ? MUTED : INK, 11));
      parts.push(rot ? txt(cx + 3, H - bot + 12, l, `text-anchor="end" transform="rotate(-45 ${cx + 3} ${H - bot + 12})"`, MUTED, 11) : txt(cx, H - 9, l, 'text-anchor="middle"', MUTED, 11));
    });
    parts.push(`<line x1="${left}" x2="${W - right}" y1="${top + ph}" y2="${top + ph}" stroke="${MUTED}"/>`);
    if (yMin > 0) parts.push(`<path d="M${left - 6} ${top + ph - 4} l6 -4 l6 4" fill="none" stroke="var(--bad)" stroke-width="2"/>`);
  }
  if (o.legend) parts.push(...L.map((l, i) => `<rect x="${8 + (i % 3) * 118}" y="${2 + Math.floor(i / 3) * 0}" width="10" height="10" fill="${col(i)}"/>` + txt(22 + (i % 3) * 118, 11, l, '', INK, 11)).slice(0, 3));
  if (o.border) parts.push(`<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="${INK}"/>`);
  return svg(W, H, parts, o.label ?? `Bar chart: ${L.map((l, i) => `${l} ${fmt(V[i])}`).join(', ')}`);
}

export type Series = { name: string; values: (number | null)[]; color?: string; dash?: boolean; width?: number };
export type LineOpts = {
  labels: string[]; series: Series[]; grid?: boolean; legend?: 'box' | 'direct' | 'none'; markers?: boolean;
  dataLabels?: 'last' | 'none'; yMin?: number; yMax?: number; fmt?: (n: number) => string; w?: number; h?: number;
  border?: boolean; note?: { s: number; i: number; text: string }; every?: number; label?: string; band?: [number, number];
};

/** A line chart of one or more series over the same labels. */
export function line(o: LineOpts): string {
  const fmt = o.fmt ?? k, W = o.w ?? 360, H = o.h ?? 230;
  const all = o.series.flatMap((s) => s.values.filter((v): v is number => v !== null));
  const yMin = o.yMin ?? 0, yMax = o.yMax ?? Math.max(...all) * 1.1;
  const legendH = o.legend === 'box' ? 22 : 0, top = 12 + legendH + (o.note ? 20 : 0), bot = 26, left = 40, right = o.legend === 'direct' || o.dataLabels === 'last' ? 72 : 10;
  const pw = W - left - right, ph = H - top - bot, n = o.labels.length;
  const x = (i: number) => left + (n === 1 ? pw / 2 : (i / (n - 1)) * pw), y = (v: number) => top + ph - ((v - yMin) / (yMax - yMin)) * ph;
  const parts: string[] = [];
  if (o.band) parts.push(`<rect x="${x(o.band[0]) - 4}" y="${top}" width="${x(o.band[1]) - x(o.band[0]) + 8}" height="${ph}" fill="var(--warn-soft)"/>`);
  const ts = ticks(yMin, yMax);
  if (o.grid) ts.forEach((t) => parts.push(`<line x1="${left}" x2="${W - right}" y1="${y(t)}" y2="${y(t)}" stroke="${LINE}"/>`));
  ts.forEach((t) => parts.push(txt(left - 5, y(t) + 4, fmt(t), 'text-anchor="end"', MUTED, 11)));
  const every = o.every ?? (n > 12 ? 3 : n > 6 ? 2 : 1);
  o.labels.forEach((l, i) => { if (i % every === 0) parts.push(txt(x(i), H - 9, l, 'text-anchor="middle"', MUTED, 11)); });
  parts.push(`<line x1="${left}" x2="${W - right}" y1="${top + ph}" y2="${top + ph}" stroke="${MUTED}"/>`);
  const ends: { y: number; s: Series; c: string; v: number }[] = [];
  o.series.forEach((s, si) => {
    const c = s.color ?? PAL[si % PAL.length];
    let d = '', pen = false;
    s.values.forEach((v, i) => { if (v === null) { pen = false; return; } d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)} `; pen = true; });
    parts.push(`<path d="${d}" fill="none" stroke="${c}" stroke-width="${s.width ?? 2.5}" ${s.dash ? 'stroke-dasharray="5 4"' : ''} stroke-linejoin="round"/>`);
    if (o.markers) s.values.forEach((v, i) => { if (v !== null) parts.push(`<circle cx="${x(i)}" cy="${y(v)}" r="3" fill="${c}"/>`); });
    const li = s.values.map((v, i) => (v === null ? -1 : i)).filter((i) => i >= 0).pop();
    if (li !== undefined) ends.push({ y: y(s.values[li]!), s, c, v: s.values[li]! });
  });
  if (o.legend === 'direct' || o.dataLabels === 'last') {
    ends.sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14; // keep labels apart
    ends.forEach((e) => parts.push(txt(W - right + 5, e.y + 4, o.legend === 'direct' ? (o.dataLabels === 'last' ? `${e.s.name} ${fmt(e.v)}` : e.s.name) : fmt(e.v), 'font-weight="600"', e.c === GREY ? MUTED : e.c, 11.5)));
  }
  if (o.legend === 'box') o.series.forEach((s, si) => {
    const c = s.color ?? PAL[si % PAL.length], lx = 8 + si * 112;
    parts.push(`<line x1="${lx}" x2="${lx + 16}" y1="7" y2="7" stroke="${c}" stroke-width="3" ${s.dash ? 'stroke-dasharray="4 3"' : ''}/>` + txt(lx + 21, 11, s.name, '', INK, 11));
  });
  if (o.note) {
    const v = o.series[o.note.s].values[o.note.i]!, nx = x(o.note.i), ny = y(v);
    parts.push(`<circle cx="${nx}" cy="${ny}" r="5" fill="none" stroke="var(--bad)" stroke-width="2"/>`);
    const tx = Math.min(Math.max(nx, left + 60), W - right - 60);
    parts.push(`<line x1="${nx}" y1="${ny - 6}" x2="${tx}" y2="${top - 12}" stroke="var(--bad)"/>`, txt(tx, top - 16, o.note.text, 'text-anchor="middle" font-weight="600"', 'var(--bad)', 11.5));
  }
  if (o.border) parts.push(`<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="${INK}"/>`);
  return svg(W, H, parts, o.label ?? `Line chart: ${o.series.map((s) => s.name).join(', ')} over ${o.labels[0]} to ${o.labels[n - 1]}`);
}

/** A pie or doughnut chart. Lessons use it to show when a pie works (2 or 3 slices) and when it doesn't. */
export function pie(o: { labels: string[]; values: number[]; colors?: string[]; donut?: boolean; w?: number; h?: number; labelsOn?: boolean; label?: string }): string {
  const W = o.w ?? 360, H = o.h ?? 220, r = Math.min(H / 2 - 12, 90), cx = o.labelsOn ? W / 2 : r + 16, cy = H / 2;
  const tot = o.values.reduce((a, b) => a + b, 0);
  let a0 = -Math.PI / 2;
  const parts: string[] = [];
  o.values.forEach((v, i) => {
    const a1 = a0 + (v / tot) * Math.PI * 2, big = a1 - a0 > Math.PI ? 1 : 0, c = o.colors?.[i] ?? PAL[i % PAL.length];
    const p = (a: number, rr = r) => `${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
    parts.push(`<path d="M${cx} ${cy} L${p(a0)} A${r} ${r} 0 ${big} 1 ${p(a1)} Z" fill="${c}" stroke="var(--bg)" stroke-width="1.5"/>`);
    const am = (a0 + a1) / 2;
    if (o.labelsOn) { const [lx, ly] = p(am, r + 14).split(' ').map(Number); parts.push(txt(lx, ly + 4, `${o.labels[i]} ${pct(v / tot)}`, `text-anchor="${Math.cos(am) >= 0 ? 'start' : 'end'}"`, INK, 11)); }
    a0 = a1;
  });
  if (o.donut) parts.push(`<circle cx="${cx}" cy="${cy}" r="${r * 0.55}" fill="var(--bg)"/>`);
  if (!o.labelsOn) o.labels.forEach((l, i) => parts.push(`<rect x="${cx + r + 22}" y="${cy - o.labels.length * 9 + i * 18}" width="10" height="10" fill="${o.colors?.[i] ?? PAL[i % PAL.length]}"/>` + txt(cx + r + 37, cy - o.labels.length * 9 + i * 18 + 9, l, '', INK, 11)));
  return svg(W, H, parts, o.label ?? `Pie chart: ${o.labels.map((l, i) => `${l} ${pct(o.values[i] / tot)}`).join(', ')}`);
}

/** A scatter plot with optional point labels. */
export function scatter(o: { points: { x: number; y: number; label?: string; c?: string }[]; xLabel: string; yLabel: string; w?: number; h?: number; fx?: (n: number) => string; fy?: (n: number) => string; label?: string }): string {
  const W = o.w ?? 360, H = o.h ?? 250, left = 44, right = 12, top = 12, bot = 38, fx = o.fx ?? k, fy = o.fy ?? k;
  const xs = o.points.map((p) => p.x), ys = o.points.map((p) => p.y);
  const xMax = Math.max(...xs) * 1.1, yMax = Math.max(...ys) * 1.12;
  const x = (v: number) => left + (v / xMax) * (W - left - right), y = (v: number) => top + (H - top - bot) - (v / yMax) * (H - top - bot);
  const parts: string[] = [];
  ticks(0, yMax).forEach((t) => parts.push(`<line x1="${left}" x2="${W - right}" y1="${y(t)}" y2="${y(t)}" stroke="${LINE}"/>`, txt(left - 5, y(t) + 4, fy(t), 'text-anchor="end"', MUTED, 11)));
  ticks(0, xMax).forEach((t) => parts.push(txt(x(t), H - 22, fx(t), 'text-anchor="middle"', MUTED, 11)));
  parts.push(txt((left + W - right) / 2, H - 6, o.xLabel, 'text-anchor="middle"', INK, 11.5), txt(12, top + 4, o.yLabel, '', INK, 11.5));
  o.points.forEach((p) => {
    parts.push(`<circle cx="${x(p.x)}" cy="${y(p.y)}" r="5" fill="${p.c ?? PAL[0]}" fill-opacity=".85"/>`);
    if (p.label) parts.push(txt(x(p.x) + (x(p.x) > W - 90 ? -7 : 7), y(p.y) + 4, p.label, x(p.x) > W - 90 ? 'text-anchor="end"' : '', MUTED, 10.5));
  });
  return svg(W, H, parts, o.label ?? `Scatter plot of ${o.yLabel} against ${o.xLabel}`);
}

/** A stacked bar chart: one bar per label, one segment per series. */
export function stacked(o: { labels: string[]; series: { name: string; values: number[]; color?: string }[]; w?: number; h?: number; percent?: boolean; label?: string }): string {
  const W = o.w ?? 360, H = o.h ?? 34 + o.labels.length * 30 + 22, left = Math.min(120, 12 + Math.max(...o.labels.map((s) => s.length)) * 6.6), right = 12, top = 26, bot = 6;
  const tots = o.labels.map((_, i) => o.series.reduce((a, s) => a + s.values[i], 0)), max = o.percent ? 1 : Math.max(...tots);
  const pw = W - left - right, bh = (H - top - bot) / o.labels.length;
  const parts: string[] = [];
  o.series.forEach((s, si) => parts.push(`<rect x="${8 + si * 88}" y="4" width="10" height="10" fill="${s.color ?? PAL[si % PAL.length]}"/>` + txt(22 + si * 88, 13, s.name, '', INK, 11)));
  o.labels.forEach((l, i) => {
    const yy = top + i * bh; let x0 = left;
    parts.push(txt(left - 6, yy + bh / 2 + 4, l, 'text-anchor="end"'));
    o.series.forEach((s, si) => {
      const w = (s.values[i] / (o.percent ? tots[i] : 1) / max) * pw;
      parts.push(`<rect x="${x0.toFixed(1)}" y="${(yy + bh * 0.18).toFixed(1)}" width="${w.toFixed(1)}" height="${(bh * 0.64).toFixed(1)}" fill="${s.color ?? PAL[si % PAL.length]}" stroke="var(--bg)"/>`);
      x0 += w;
    });
  });
  return svg(W, H, parts, o.label ?? `Stacked bar chart of ${o.series.map((s) => s.name).join(', ')} by ${o.labels.join(', ')}`);
}

function svg(W: number, H: number, parts: string[], label: string) {
  return `<svg class="ds-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label).replace(/"/g, '&quot;')}" font-family="system-ui, sans-serif">${parts.join('')}</svg>`;
}
