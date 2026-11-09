// Plasmid map layout: turns features and sites into simple shapes (polygons, lines, text) that can be drawn on a
// canvas or written out as SVG. Circular maps go clockwise from the top; overlapping features take inner tracks;
// labels sit outside and are spread apart so they do not overlap. No DOM here.

export type MapFeature = { label: string; parts: { start: number; end: number }[]; strand: 1 | -1 | 0; color: string };
export type MapSite = { pos: number; label: string };
export type Colour = string; // '#rrggbb' or a palette name: 'ink' | 'muted' | 'line' | 'bg'
export type Prim =
  | { k: 'poly'; pts: number[]; fill?: Colour; stroke?: Colour; w?: number; closed: boolean }
  | { k: 'text'; x: number; y: number; s: string; size: number; align: 'start' | 'middle' | 'end'; color: Colour; bold?: boolean };
export type MapOut = { w: number; h: number; prims: Prim[] };

export const textWidth = (s: string, size: number) => s.length * size * 0.56;

/** Round a step to 1, 2 or 5 × 10^k. */
export function niceStep(raw: number) {
  const p = 10 ** Math.floor(Math.log10(raw)), m = raw / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
}

/** Give each item the first track where it overlaps nothing already there. Intervals are [a, b) and may wrap. */
export function assignTracks(items: { a: number; b: number }[], L: number, circular: boolean) {
  const tracks: { a: number; b: number }[][] = [];
  const pieces = (x: { a: number; b: number }) => (circular && x.b > L ? [{ a: x.a, b: L }, { a: 0, b: x.b - L }] : [x]);
  const hit = (x: { a: number; b: number }, y: { a: number; b: number }) => pieces(x).some((p) => pieces(y).some((q) => p.a < q.b && q.a < p.b));
  return items.map((it) => {
    let t = tracks.findIndex((tr) => !tr.some((o) => hit(it, o)));
    if (t < 0) { t = tracks.length; tracks.push([]); }
    tracks[t].push(it); return t;
  });
}

/** Spread label positions (sorted by want) so neighbours are at least `gap` apart and stay within [lo, hi]. */
export function spread(want: number[], gap: number, lo: number, hi: number) {
  const ord = want.map((w, i) => [w, i]).sort((a, b) => a[0] - b[0]);
  const y = ord.map((o) => o[0]);
  for (let i = 1; i < y.length; i++) y[i] = Math.max(y[i], y[i - 1] + gap);
  if (y.length && y[y.length - 1] > hi) { y[y.length - 1] = hi; for (let i = y.length - 2; i >= 0; i--) y[i] = Math.min(y[i], y[i + 1] - gap); }
  if (y.length && y[0] < lo) { const sh = lo - y[0]; for (let i = 0; i < y.length; i++) y[i] += sh; }
  const out: number[] = new Array(want.length);
  ord.forEach((o, k) => (out[o[1]] = y[k]));
  return out;
}

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 0.02)), pts: number[] = [];
  for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; pts.push(cx + r * Math.cos(a), cy + r * Math.sin(a)); }
  return pts;
};
const fmt = (n: number) => n.toLocaleString('en');
const short = (s: string, n = 20) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

/** Circular map on a square of side `size`. */
export function circularMap(name: string, L: number, feats: MapFeature[], sites: MapSite[], size = 640): MapOut {
  const S = size, W = 1.5 * S, H = S, cx = W / 2, cy = H / 2, fs = 0.036 * S, t = 0.036 * S, gap = 0.008 * S;
  const prims: Prim[] = [];
  const ang = (p: number) => -Math.PI / 2 + (2 * Math.PI * p) / L;
  // Each part becomes a band; overlapping bands go to inner tracks.
  const bands = feats.flatMap((f, fi) => f.parts.map((p, pi) => ({ fi, pi, a: p.start, b: p.end < p.start ? p.end + L : p.end })));
  const tr = assignTracks(bands, L, true);
  const nT = Math.max(1, ...tr.map((x) => x + 1));
  const R = 0.3 * S;
  const rOf = (k: number) => R - k * (t + gap);
  prims.push({ k: 'poly', pts: arc(cx, cy, R, 0, 2 * Math.PI), stroke: 'ink', w: 0.004 * S, closed: true });
  // Ruler inside the innermost track.
  const rr = rOf(nT - 1) - t / 2 - 0.02 * S, step = niceStep(L / 8);
  prims.push({ k: 'poly', pts: arc(cx, cy, rr, 0, 2 * Math.PI), stroke: 'line', w: 0.002 * S, closed: true });
  for (let p = 0; p < L; p += step) {
    const a = ang(p), c = Math.cos(a), s = Math.sin(a);
    prims.push({ k: 'poly', pts: [cx + rr * c, cy + rr * s, cx + (rr - 0.015 * S) * c, cy + (rr - 0.015 * S) * s], stroke: 'muted', w: 0.003 * S, closed: false });
    if (p > 0 && rr > 0.16 * S) prims.push({ k: 'text', x: cx + (rr - 0.045 * S) * c, y: cy + (rr - 0.045 * S) * s, s: fmt(p), size: fs * 0.75, align: 'middle', color: 'muted' });
  }
  prims.push({ k: 'text', x: cx, y: cy - fs * 0.7, s: name, size: fs * 1.15, align: 'middle', color: 'ink', bold: true });
  prims.push({ k: 'text', x: cx, y: cy + fs * 0.8, s: `${fmt(L)} bp`, size: fs, align: 'middle', color: 'muted' });
  // Feature bands with arrowheads at the 3' end of the last part.
  const labelAt: { a: number; r: number; s: string; color: Colour }[] = [];
  feats.forEach((f, fi) => {
    let best = -1, bestLen = -1;
    f.parts.forEach((p, pi) => {
      const bi = bands.findIndex((b) => b.fi === fi && b.pi === pi), b = bands[bi], r = rOf(tr[bi]);
      let a0 = ang(b.a), a1 = ang(b.b);
      if (a1 - a0 < 0.004) a1 = a0 + 0.004;
      const len = b.b - b.a; if (len > bestLen) { bestLen = len; best = bi; }
      const last = pi === f.parts.length - 1, head = last && f.strand !== 0 ? Math.min((0.03 * S) / r, (a1 - a0) * 0.6) : 0;
      const s0 = f.strand === -1 ? a0 + head : a0, s1 = f.strand === 1 ? a1 - head : a1;
      const pts = [...arc(cx, cy, r + t / 2, s0, s1), ...arc(cx, cy, r - t / 2, s1, s0)];
      prims.push({ k: 'poly', pts, fill: f.color, closed: true });
      if (head) {
        const tip = f.strand === 1 ? a1 : a0, base = f.strand === 1 ? s1 : s0, w2 = t * 0.85;
        prims.push({ k: 'poly', pts: [cx + (r + w2) * Math.cos(base), cy + (r + w2) * Math.sin(base), cx + r * Math.cos(tip), cy + r * Math.sin(tip), cx + (r - w2) * Math.cos(base), cy + (r - w2) * Math.sin(base)], fill: f.color, closed: true });
      }
    });
    if (best >= 0) { const b = bands[best]; labelAt.push({ a: ang((b.a + b.b) / 2), r: rOf(tr[best]) + t / 2, s: short(f.label), color: 'ink' }); }
  });
  for (const s of sites) {
    const a = ang(s.pos), c = Math.cos(a), sn = Math.sin(a), r0 = R + t / 2 + 0.002 * S, r1 = R + t / 2 + 0.025 * S;
    prims.push({ k: 'poly', pts: [cx + (R - t / 2) * c, cy + (R - t / 2) * sn, cx + r1 * c, cy + r1 * sn], stroke: 'ink', w: 0.003 * S, closed: false });
    labelAt.push({ a, r: r0, s: `${s.label} (${fmt(s.pos)})`, color: 'muted' });
  }
  // Labels: right half and left half, spread vertically.
  const rl = R + t / 2 + 0.06 * S;
  for (const side of [1, -1]) {
    const ls = labelAt.filter((l) => (Math.cos(l.a) >= 0 ? 1 : -1) === side);
    const ys = spread(ls.map((l) => cy + rl * Math.sin(l.a)), fs * 1.15, fs, H - fs * 0.6);
    ls.forEach((l, i) => {
      const y = ys[i], dy = (y - cy) / rl, dx = Math.sqrt(Math.max(0, 1 - Math.min(1, dy * dy)));
      const x = cx + side * Math.max(rl * dx, R * 0.35);
      const ex = cx + l.r * Math.cos(l.a), ey = cy + l.r * Math.sin(l.a);
      prims.push({ k: 'poly', pts: [ex, ey, x - side * 0.006 * S, y], stroke: 'line', w: 0.002 * S, closed: false });
      prims.push({ k: 'text', x, y, s: l.s, size: fs, align: side === 1 ? 'start' : 'end', color: l.color });
    });
  }
  return { w: W, h: H, prims };
}

/** Linear map `width` wide; the height grows with the number of tracks. */
export function linearMap(name: string, L: number, feats: MapFeature[], sites: MapSite[], width = 640): MapOut {
  const W = width, fs = 0.03 * W, t = 0.03 * W, m = 0.04 * W, x = (p: number) => m + ((W - 2 * m) * p) / L;
  const prims: Prim[] = [];
  // Sites above the ruler, in rows so labels do not overlap.
  const sItems = sites.map((s) => { const tx = `${s.label} (${fmt(s.pos)})`, w = textWidth(tx, fs * 0.9); const c = Math.min(Math.max(x(s.pos), m + w / 2), W - m - w / 2); return { s, tx, c, a: c - w / 2 - 4, b: c + w / 2 + 4 }; });
  const sTr = assignTracks(sItems, W, false), nS = sites.length ? Math.max(...sTr) + 1 : 0;
  const yTitle = fs * 1.2, yRuler = yTitle + fs * 0.8 + nS * fs * 1.2 + (nS ? fs * 0.6 : 0);
  prims.push({ k: 'text', x: m, y: yTitle * 0.6, s: `${name}, ${fmt(L)} bp`, size: fs * 1.05, align: 'start', color: 'ink', bold: true });
  sItems.forEach((it, i) => {
    const yl = yTitle + fs * 0.8 + (nS - 1 - sTr[i]) * fs * 1.2;
    prims.push({ k: 'poly', pts: [x(it.s.pos), yRuler, x(it.s.pos), yl + fs * 0.45], stroke: 'line', w: 0.002 * W, closed: false });
    prims.push({ k: 'text', x: it.c, y: yl, s: it.tx, size: fs * 0.9, align: 'middle', color: 'muted' });
  });
  prims.push({ k: 'poly', pts: [x(0), yRuler, x(L), yRuler], stroke: 'ink', w: 0.004 * W, closed: false });
  const step = niceStep(L / 6);
  for (let p = 0; p <= L; p += step) {
    prims.push({ k: 'poly', pts: [x(p), yRuler, x(p), yRuler + 0.012 * W], stroke: 'muted', w: 0.003 * W, closed: false });
    prims.push({ k: 'text', x: x(p), y: yRuler + 0.012 * W + fs * 0.6, s: fmt(p), size: fs * 0.75, align: p === 0 ? 'start' : 'middle', color: 'muted' });
  }
  // Features: each needs room for its band and its label.
  const fItems = feats.map((f) => {
    const a = Math.min(...f.parts.map((p) => x(p.start))), b = Math.max(...f.parts.map((p) => x(p.end)));
    const w = textWidth(f.label, fs), c = Math.min(Math.max((a + b) / 2, m + w / 2), W - m - w / 2);
    return { f, a: Math.min(a, c - w / 2) - 4, b: Math.max(b, c + w / 2) + 4, c };
  });
  const fTr = assignTracks(fItems, W, false), nF = feats.length ? Math.max(...fTr) + 1 : 0, row = t + fs * 1.5, y0 = yRuler + 0.012 * W + fs * 1.3;
  fItems.forEach((it, i) => {
    const f = it.f, yb = y0 + fTr[i] * row + fs * 1.1 + t / 2;
    prims.push({ k: 'text', x: it.c, y: y0 + fTr[i] * row + fs * 0.5, s: f.label, size: fs, align: 'middle', color: 'ink' });
    const wrapPair = f.parts.length === 2 && f.parts.some((p) => p.end >= L) && f.parts.some((p) => p.start === 0);
    if (f.parts.length > 1 && !wrapPair) prims.push({ k: 'poly', pts: [Math.min(...f.parts.map((p) => x(p.start))), yb, Math.max(...f.parts.map((p) => x(p.end))), yb], stroke: f.color, w: 0.003 * W, closed: false });
    f.parts.forEach((p, k) => {
      const a = x(p.start), b = Math.max(x(p.end), a + 1.5), last = k === f.parts.length - 1;
      const tipR = f.strand === 1 && last, tipL = f.strand === -1 && last, head = Math.min(0.025 * W, (b - a) * 0.6);
      const a2 = tipL ? a + head : a, b2 = tipR ? b - head : b;
      prims.push({ k: 'poly', pts: [a2, yb - t / 2, b2, yb - t / 2, b2, yb + t / 2, a2, yb + t / 2], fill: f.color, closed: true });
      if (tipR) prims.push({ k: 'poly', pts: [b2, yb - t * 0.85, b, yb, b2, yb + t * 0.85], fill: f.color, closed: true });
      if (tipL) prims.push({ k: 'poly', pts: [a2, yb - t * 0.85, a, yb, a2, yb + t * 0.85], fill: f.color, closed: true });
    });
  });
  return { w: W, h: Math.ceil(y0 + nF * row + fs * 0.5), prims };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** SVG text of a map, with palette names turned into colours. */
export function toSvg(m: MapOut, pal: Record<string, string>) {
  const c = (x?: Colour) => (x ? (x.startsWith('#') ? x : pal[x] ?? '#000') : 'none');
  const r = (n: number) => Math.round(n * 10) / 10;
  const body = m.prims.map((p) => {
    if (p.k === 'poly') {
      const pts = []; for (let i = 0; i < p.pts.length; i += 2) pts.push(`${r(p.pts[i])},${r(p.pts[i + 1])}`);
      return `<${p.closed ? 'polygon' : 'polyline'} points="${pts.join(' ')}" fill="${p.closed ? c(p.fill) : 'none'}" stroke="${c(p.stroke)}"${p.w ? ` stroke-width="${r(p.w)}"` : ''}/>`;
    }
    return `<text x="${r(p.x)}" y="${r(p.y)}" font-size="${r(p.size)}" text-anchor="${p.align}" dominant-baseline="middle" fill="${c(p.color)}"${p.bold ? ' font-weight="600"' : ''}>${esc(p.s)}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${m.w}" height="${m.h}" viewBox="0 0 ${m.w} ${m.h}" font-family="Helvetica, Arial, sans-serif">\n<rect width="100%" height="100%" fill="${pal.bg ?? '#fff'}"/>\n${body.join('\n')}\n</svg>\n`;
}

/** Draw a map on a canvas context scaled to W wide. */
export function drawMap(ctx: CanvasRenderingContext2D, m: MapOut, W: number, pal: Record<string, string>) {
  const k = W / m.w, c = (x?: Colour) => (x ? (x.startsWith('#') ? pal.red ?? x : pal[x] ?? '#000') : 'transparent');
  // pal.red, when given, replaces every feature colour (red light mode).
  for (const p of m.prims) {
    if (p.k === 'poly') {
      ctx.beginPath(); ctx.moveTo(p.pts[0] * k, p.pts[1] * k);
      for (let i = 2; i < p.pts.length; i += 2) ctx.lineTo(p.pts[i] * k, p.pts[i + 1] * k);
      if (p.closed) { ctx.closePath(); if (p.fill) { ctx.fillStyle = c(p.fill); ctx.fill(); } }
      if (p.stroke) { ctx.strokeStyle = c(p.stroke); ctx.lineWidth = (p.w ?? 1) * k; ctx.stroke(); }
    } else {
      ctx.font = `${p.bold ? '600 ' : ''}${p.size * k}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
      ctx.textAlign = p.align === 'start' ? 'left' : p.align === 'end' ? 'right' : 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = c(p.color); ctx.fillText(p.s, p.x * k, p.y * k);
    }
  }
}
