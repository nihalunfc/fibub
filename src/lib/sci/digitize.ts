// Turning clicks on a picture of a graph into numbers. Two points on each axis set the scale; the
// axes may be tilted or not quite square (a phone photo of a printed page), and either can be log.

export type Pt = { x: number; y: number };
export type AxisPoint = Pt & { value: number };
export type Axes = { x1: AxisPoint; x2: AxisPoint; y1: AxisPoint; y2: AxisPoint; xLog: boolean; yLog: boolean };

/**
 * A function from image pixels to data values. Each data coordinate changes linearly (in log space
 * for log axes) along its own axis and not at all along the other one, which fixes its gradient.
 */
export function makeMap(a: Axes): (p: Pt) => Pt {
  const L = (v: number, log: boolean) => (log ? Math.log10(v) : v);
  if (a.xLog && (a.x1.value <= 0 || a.x2.value <= 0)) throw new Error('A log axis needs values above zero');
  if (a.yLog && (a.y1.value <= 0 || a.y2.value <= 0)) throw new Error('A log axis needs values above zero');
  const ex = { x: a.x2.x - a.x1.x, y: a.x2.y - a.x1.y }, ey = { x: a.y2.x - a.y1.x, y: a.y2.y - a.y1.y };
  const det = ex.x * ey.y - ex.y * ey.x;
  if (Math.abs(det) < 1e-9 * (Math.hypot(ex.x, ex.y) * Math.hypot(ey.x, ey.y) || 1)) throw new Error('The two axes are parallel: put two points on the x axis and two on the y axis');
  const dx = L(a.x2.value, a.xLog) - L(a.x1.value, a.xLog), dy = L(a.y2.value, a.yLog) - L(a.y1.value, a.yLog);
  if (dx === 0 || dy === 0) throw new Error('The two points on each axis need different values');
  // g·ex = d, g·ey = 0 (and the same for y with ex, ey swapped), solved by Cramer's rule.
  const gx = { x: (dx * ey.y) / det, y: (-dx * ey.x) / det };
  const gy = { x: (-dy * ex.y) / det, y: (dy * ex.x) / det };
  const lx1 = L(a.x1.value, a.xLog), ly1 = L(a.y1.value, a.yLog);
  return (p) => {
    const u = lx1 + gx.x * (p.x - a.x1.x) + gx.y * (p.y - a.x1.y);
    const v = ly1 + gy.x * (p.x - a.y1.x) + gy.y * (p.y - a.y1.y);
    return { x: a.xLog ? 10 ** u : u, y: a.yLog ? 10 ** v : v };
  };
}

const near = (d: Uint8ClampedArray, i: number, c: [number, number, number], tol2: number) => {
  const r = d[i] - c[0], g = d[i + 1] - c[1], b = d[i + 2] - c[2];
  return d[i + 3] > 32 && r * r + g * g + b * b <= tol2;
};

/**
 * Trace a curve drawn in one colour: every `step` pixels across the box, take the middle of the
 * pixels of that colour. Where the curve is thick, the middle of the thickest run is used.
 */
export function traceLine(img: ImageData, box: { x0: number; y0: number; x1: number; y1: number }, colour: [number, number, number], tol: number, step = 4): Pt[] {
  const out: Pt[] = [], tol2 = tol * tol, W = img.width, d = img.data;
  const x0 = Math.max(0, Math.floor(box.x0)), x1 = Math.min(W - 1, Math.ceil(box.x1)), y0 = Math.max(0, Math.floor(box.y0)), y1 = Math.min(img.height - 1, Math.ceil(box.y1));
  for (let x = x0; x <= x1; x += Math.max(1, step)) {
    let best: [number, number] | null = null, start = -1;
    for (let y = y0; y <= y1 + 1; y++) {
      const hit = y <= y1 && near(d, (y * W + x) * 4, colour, tol2);
      if (hit && start < 0) start = y;
      if (!hit && start >= 0) { if (!best || y - start > best[1] - best[0]) best = [start, y - 1]; start = -1; }
    }
    if (best) out.push({ x: x + 0.5, y: (best[0] + best[1]) / 2 + 0.5 });
  }
  return out;
}

/** Find markers of one colour: the centre of each separate blob between minArea and maxArea pixels. */
export function findMarkers(img: ImageData, box: { x0: number; y0: number; x1: number; y1: number }, colour: [number, number, number], tol: number, minArea = 4, maxArea = 4000): Pt[] {
  const W = img.width, H = img.height, d = img.data, tol2 = tol * tol;
  const x0 = Math.max(0, Math.floor(box.x0)), x1 = Math.min(W - 1, Math.ceil(box.x1)), y0 = Math.max(0, Math.floor(box.y0)), y1 = Math.min(H - 1, Math.ceil(box.y1));
  const seen = new Uint8Array(W * H), out: Pt[] = [], stack: number[] = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const k = y * W + x;
    if (seen[k] || !near(d, k * 4, colour, tol2)) continue;
    let n = 0, sx = 0, sy = 0;
    seen[k] = 1; stack.push(k);
    while (stack.length) {
      const j = stack.pop()!, jx = j % W, jy = (j - jx) / W;
      n++; sx += jx; sy += jy;
      for (const [ax, ay] of [[jx + 1, jy], [jx - 1, jy], [jx, jy + 1], [jx, jy - 1]]) {
        if (ax < x0 || ax > x1 || ay < y0 || ay > y1) continue;
        const m = ay * W + ax;
        if (!seen[m] && near(d, m * 4, colour, tol2)) { seen[m] = 1; stack.push(m); }
      }
    }
    if (n >= minArea && n <= maxArea) out.push({ x: sx / n + 0.5, y: sy / n + 0.5 });
  }
  return out;
}

// Working with the digitised points (data coordinates).

/** Points sorted by x, with repeated x values averaged so the curve is a function of x. */
export function asFunction(pts: Pt[]): Pt[] {
  const s = [...pts].filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y)).sort((a, b) => a.x - b.x), out: Pt[] = [];
  for (let i = 0; i < s.length;) {
    let j = i, sum = 0; while (j < s.length && s[j].x === s[i].x) sum += s[j++].y;
    out.push({ x: s[i].x, y: sum / (j - i) }); i = j;
  }
  return out;
}
/** n values evenly spaced in x from the first to the last point, read off the straight lines between the points. */
export function resample(pts: Pt[], n: number): Pt[] {
  const f = asFunction(pts);
  if (f.length < 2 || !(n >= 2)) return f;
  const x0 = f[0].x, x1 = f[f.length - 1].x, out: Pt[] = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    const x = i === n - 1 ? x1 : x0 + ((x1 - x0) * i) / (n - 1);
    while (j < f.length - 2 && f[j + 1].x < x) j++;
    const a = f[j], b = f[j + 1], t = b.x === a.x ? 0 : (x - a.x) / (b.x - a.x);
    out.push({ x, y: a.y + t * (b.y - a.y) });
  }
  return out;
}
/** Area between the curve and y = 0 by the trapezoid rule (negative below the axis). */
export function trapezoidArea(pts: Pt[]): number {
  const f = asFunction(pts); let a = 0;
  for (let i = 1; i < f.length; i++) a += ((f[i].y + f[i - 1].y) / 2) * (f[i].x - f[i - 1].x);
  return a;
}
