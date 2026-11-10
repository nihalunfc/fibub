// Maths for cost-per-mile, load-profit and pallet-planner. Plain TypeScript, no DOM.

export interface CpmIn {
  fixedMonth: number;      // truck payment + insurance + permits + parking, per month
  distMonth: number;       // miles or km driven per month
  fuelPrice: number;       // per gallon or litre
  economy: number;         // miles per gallon or km per litre (distance per volume)
  maint: number;           // per mile or km
  tyres: number;
  tolls: number;
  driverPerDist: number;   // driver pay per mile or km (0 if paid by the hour)
  driverHours: number;     // hours per month, if paid by the hour
  driverPerHour: number;
  marginPct: number;       // wanted margin on the rate (profit as % of revenue)
  payload: number;         // tonnes (or tons) carried, 0 = skip the per-tonne figure
}
export interface CpmOut {
  fixed: number; fuel: number; maint: number; tyres: number; tolls: number; driver: number;
  total: number; monthCost: number; breakEven: number; targetRate: number; perTonne: number;
}
export function costPerMile(i: CpmIn): CpmOut | null {
  if (!(i.distMonth > 0) || !(i.economy > 0) || i.marginPct < 0 || i.marginPct >= 100) return null;
  const fixed = i.fixedMonth / i.distMonth;
  const fuel = i.fuelPrice / i.economy;
  const driver = i.driverPerDist + (i.driverHours * i.driverPerHour) / i.distMonth;
  const total = fixed + fuel + i.maint + i.tyres + i.tolls + driver;
  return {
    fixed, fuel, maint: i.maint, tyres: i.tyres, tolls: i.tolls, driver, total,
    monthCost: total * i.distMonth, breakEven: total, targetRate: total / (1 - i.marginPct / 100),
    perTonne: i.payload > 0 ? total / i.payload : 0,
  };
}

export interface LoadIn {
  rate: number; perMile: boolean; loaded: number; deadhead: number; costPerDist: number;
  tolls: number; detention: number; days: number; minPerDay: number; minPerMile: number;
}
export interface LoadOut {
  revenue: number; cost: number; profit: number; totalDist: number; ratePerTotal: number;
  profitPerDay: number; ok: boolean; reasons: string[];
}
export function loadProfit(i: LoadIn): LoadOut | null {
  if (!(i.loaded > 0) || i.deadhead < 0 || !(i.days > 0)) return null;
  const totalDist = i.loaded + i.deadhead;
  const linehaul = i.perMile ? i.rate * i.loaded : i.rate;
  const revenue = linehaul + i.detention;
  const cost = totalDist * i.costPerDist + i.tolls;
  const profit = revenue - cost;
  const ratePerTotal = revenue / totalDist;
  const profitPerDay = profit / i.days;
  const reasons: string[] = [];
  if (profit <= 0) reasons.push('it loses money');
  if (i.minPerDay > 0 && profitPerDay < i.minPerDay) reasons.push('profit per day is under your minimum');
  if (i.minPerMile > 0 && ratePerTotal < i.minPerMile) reasons.push('rate per total mile is under your minimum');
  return { revenue, cost, profit, totalDist, ratePerTotal, profitPerDay, ok: reasons.length === 0, reasons };
}

// ---- Pallet planner (all sizes in the same unit, e.g. mm) ----
export interface Rect { x: number; y: number; w: number; h: number; turned: boolean }
export interface Layout { count: number; rects: Rect[]; note?: string }
const EPS = 1e-6;

/** Pallets all one way round. alongLong: the pallet's long side runs along the trailer length. */
export function straightLayout(L: number, W: number, pl: number, pw: number, alongLong: boolean): Layout {
  const a = alongLong ? Math.max(pl, pw) : Math.min(pl, pw); // size along the trailer
  const b = alongLong ? Math.min(pl, pw) : Math.max(pl, pw); // size across
  const rows = Math.floor(L / a + EPS), cols = Math.floor(W / b + EPS);
  const rects: Rect[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) rects.push({ x: r * a, y: c * b, w: a, h: b, turned: false });
  return { count: rects.length, rects };
}

/** Best mix of both ways round (guillotine cuts: pinwheel-style patterns). */
export function mixedLayout(L: number, W: number, pl: number, pw: number): Layout {
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const pts = (max: number) => {
    const s = new Set<number>();
    for (let i = 0; i * pl <= max + EPS; i++) for (let j = 0; i * pl + j * pw <= max + EPS; j++) s.add(r2(i * pl + j * pw));
    return [...s].sort((p, q) => p - q);
  };
  const xs = pts(L), ys = pts(W);
  if (xs.length * ys.length * (xs.length + ys.length) > 6e6) {
    const a = straightLayout(L, W, pl, pw, true), b = straightLayout(L, W, pl, pw, false);
    const best = a.count >= b.count ? a : b;
    return { ...best, note: 'Too many small pallets for the pattern search; showing the better straight layout.' };
  }
  const nx = xs.length, ny = ys.length;
  const best = new Int32Array(nx * ny), how = new Int32Array(nx * ny).fill(-1); // how: 0 none, 1 pallet, 2 cut x, 3 cut y (cut index in cutAt)
  const cutAt = new Int32Array(nx * ny);
  const fits = (a: number, b: number) => (a + EPS >= pl && b + EPS >= pw ? 1 : 0) | (a + EPS >= pw && b + EPS >= pl ? 2 : 0);
  for (let ix = 0; ix < nx; ix++) for (let iy = 0; iy < ny; iy++) {
    const a = xs[ix], b = ys[iy], k = ix * ny + iy;
    let v = fits(a, b) ? 1 : 0, h = v ? 1 : 0, c = 0;
    for (let jx = 1; jx <= ix; jx++) { const left = xs[jx]; // symmetric: only test the smaller half
      const rest = r2(a - left), rj = xs.indexOf(rest);
      if (rj < 0 || left > a / 2 + EPS) continue;
      const s = best[jx * ny + iy] + best[rj * ny + iy]; if (s > v) { v = s; h = 2; c = jx; } }
    for (let jy = 1; jy <= iy; jy++) { const low = ys[jy];
      const rest = r2(b - low), rj = ys.indexOf(rest);
      if (rj < 0 || low > b / 2 + EPS) continue;
      const s = best[ix * ny + jy] + best[ix * ny + rj]; if (s > v) { v = s; h = 3; c = jy; } }
    best[k] = v; how[k] = h; cutAt[k] = c;
  }
  const rects: Rect[] = [];
  const build = (ix: number, iy: number, ox: number, oy: number) => {
    const k = ix * ny + iy, h = how[k];
    if (best[k] === 0) return;
    const a = xs[ix], b = ys[iy];
    if (h === 1) { const f = fits(a, b); if (f & 1) rects.push({ x: ox, y: oy, w: pl, h: pw, turned: false }); else rects.push({ x: ox, y: oy, w: pw, h: pl, turned: true }); return; }
    if (h === 2) { const jx = cutAt[k], left = xs[jx], rj = xs.indexOf(r2(a - left)); build(jx, iy, ox, oy); build(rj, iy, ox + left, oy); return; }
    if (h === 3) { const jy = cutAt[k], low = ys[jy], rj = ys.indexOf(r2(b - low)); build(ix, jy, ox, oy); build(ix, rj, ox, oy + low); }
  };
  build(nx - 1, ny - 1, 0, 0);
  return { count: best[(nx - 1) * ny + (ny - 1)], rects };
}
