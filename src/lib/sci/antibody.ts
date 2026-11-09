// Antibody dilutions and titres: a working dilution from a stock (as 1:N or as a target µg/mL), a serial dilution
// series for titration, the endpoint titre of an ELISA-style dilution series (the highest dilution whose OD stays
// above a cutoff, interpolated on log dilution), and how much antibody a run of blots or plates needs.
// "1:N" here means 1 part in N parts in total (1:1000 = 1 µL in 1 mL), as antibody data sheets use it.
// 1 mg/mL = 1000 µg/mL = 1 µg/µL. The example numbers are made up by fibub. No DOM.

/** Dilution factor N (for 1:N) that takes a stock in mg/mL to a target in µg/mL. */
export const factorFor = (stockMgMl: number, targetUgMl: number) => (stockMgMl * 1000) / targetUgMl;

export type Working = {
  factor: number; finalUl: number; stockUl: number; diluentUl: number;
  /** Final concentration in µg/mL, NaN when the stock concentration is not known. */
  ugMl: number;
  /** Total antibody in the final volume, µg (NaN when the stock concentration is not known). */
  ug: number;
  /** A 1:F intermediate made from `stockUl` µL of stock, then `useUl` µL of it + `diluentUl` µL diluent. */
  inter: { factor: number; stockUl: number; totalUl: number; useUl: number; diluentUl: number } | null;
  warn: string[];
};

const bad = (x: number) => !Number.isFinite(x) || x <= 0;

/** A working dilution of `finalUl` µL, either 1:`ratio` or to `targetUgMl` µg/mL from `stockMgMl` mg/mL. */
export function working(o: { stockMgMl?: number; ratio?: number; targetUgMl?: number; finalUl: number; mode: 'ratio' | 'conc' }): Working {
  const stock = o.stockMgMl ?? NaN, warn: string[] = [];
  if (bad(o.finalUl)) throw new Error('The final volume must be above zero.');
  let factor: number;
  if (o.mode === 'conc') {
    if (bad(stock)) throw new Error('Give the stock concentration (mg/mL) to dilute to a µg/mL target.');
    if (bad(o.targetUgMl ?? NaN)) throw new Error('The target concentration must be above zero.');
    factor = factorFor(stock, o.targetUgMl!);
    if (factor < 1) throw new Error(`The target (${o.targetUgMl} µg/mL) is stronger than the stock (${stock * 1000} µg/mL).`);
  } else {
    factor = o.ratio ?? NaN;
    if (!Number.isFinite(factor) || factor < 1) throw new Error('The dilution 1:N needs N of 1 or more.');
    if (o.stockMgMl != null && !Number.isNaN(stock) && stock <= 0) throw new Error('The stock concentration must be above zero, or leave it empty.');
  }
  const stockUl = o.finalUl / factor, diluentUl = o.finalUl - stockUl;
  const ugMl = bad(stock) ? NaN : (stock * 1000) / factor;
  let inter: Working['inter'] = null;
  if (stockUl < 1 && factor > 10) {
    // Smallest 1:10, 1:100 … intermediate so that at least 2 µL of it goes into the final tube.
    let F = 10; while ((o.finalUl * F) / factor < 2 && F < factor) F *= 10;
    if (F < factor) {
      const useUl = (o.finalUl * F) / factor;
      inter = { factor: F, stockUl: 2, totalUl: 2 * F, useUl, diluentUl: o.finalUl - useUl };
    }
    warn.push(`Only ${fmtUl(stockUl)} of stock: too little to pipette accurately. Make an intermediate dilution first, or a larger final volume.`);
  }
  return { factor, finalUl: o.finalUl, stockUl, diluentUl, ugMl, ug: (ugMl * o.finalUl) / 1000, inter, warn };
}

export type SerialRow = { tube: number; factor: number; ugMl: number; from: string; fromUl: number; diluentUl: number; keepUl: number };
export type Serial = { rows: SerialRow[]; transferUl: number; fold: number; warn: string[] };

/**
 * A serial dilution: tube 1 is 1:`start` made from the stock, each next tube is `fold` times more dilute.
 * Every tube ends with `volUl` µL: each tube after the first gets `volUl` µL of diluent and
 * volUl / (fold − 1) µL from the tube before; that much is thrown away from the last tube.
 */
export function serial(o: { start: number; fold: number; tubes: number; volUl: number; stockMgMl?: number }): Serial {
  const { start, fold, tubes, volUl } = o, warn: string[] = [];
  if (!Number.isFinite(start) || start < 1) throw new Error('The first tube needs a dilution 1:N with N of 1 or more.');
  if (!Number.isFinite(fold) || fold <= 1) throw new Error('Each step must dilute more than 1-fold (2 for 2-fold).');
  if (!Number.isInteger(tubes) || tubes < 2 || tubes > 48) throw new Error('Use between 2 and 48 tubes.');
  if (bad(volUl)) throw new Error('The volume per tube must be above zero.');
  const t = volUl / (fold - 1), total = volUl + t, stock = o.stockMgMl ?? NaN;
  const rows: SerialRow[] = [];
  for (let i = 0; i < tubes; i++) {
    const factor = start * fold ** i, ugMl = bad(stock) ? NaN : (stock * 1000) / factor;
    if (i === 0) rows.push({ tube: 1, factor, ugMl, from: 'stock', fromUl: total / start, diluentUl: total - total / start, keepUl: volUl });
    else rows.push({ tube: i + 1, factor, ugMl, from: `tube ${i}`, fromUl: t, diluentUl: volUl, keepUl: volUl });
  }
  if (rows[0].fromUl < 1 && start > 1) warn.push(`Tube 1 needs only ${fmtUl(rows[0].fromUl)} of stock. Make a 1:10 or 1:100 intermediate first, or a larger volume.`);
  if (t < 1) warn.push(`Each transfer is only ${fmtUl(t)}: too little to pipette accurately. Use a larger volume per tube.`);
  return { rows, transferUl: t, fold, warn };
}

export type Cut = { kind: 'sd'; k: number } | { kind: 'times'; k: number } | { kind: 'fixed'; od: number };
export type Cutoff = { value: number; mean: number; sd: number; n: number; text: string };

const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
/** Sample standard deviation (n − 1). */
const sdev = (a: number[]) => { if (a.length < 2) return NaN; const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };

/** The OD cutoff: blank mean + k × SD, k × blank mean, or a fixed OD. */
export function cutoff(blanks: number[], c: Cut): Cutoff {
  const b = blanks.filter(Number.isFinite), m = b.length ? mean(b) : NaN, s = sdev(b);
  if (c.kind === 'fixed') {
    if (!Number.isFinite(c.od) || c.od <= 0) throw new Error('The fixed cutoff OD must be above zero.');
    return { value: c.od, mean: m, sd: s, n: b.length, text: `fixed OD ${c.od}` };
  }
  if (!Number.isFinite(c.k) || c.k <= 0) throw new Error('The multiplier must be above zero.');
  if (c.kind === 'sd') {
    if (b.length < 2) throw new Error('Give at least two blank ODs for blank mean + SD.');
    return { value: m + c.k * s, mean: m, sd: s, n: b.length, text: `blank mean + ${c.k} SD` };
  }
  if (!b.length) throw new Error('Give at least one blank OD.');
  return { value: c.k * m, mean: m, sd: s, n: b.length, text: `${c.k} × blank mean` };
}

export type TitrePoint = { dil: number; ods: number[]; mean: number; sd: number; above: boolean };
export type Titre = {
  points: TitrePoint[]; cut: number;
  /** 'ok': crosses the cutoff; 'above': every dilution is above it; 'below': none is. */
  status: 'ok' | 'above' | 'below';
  /** Highest dilution above the cutoff (reciprocal), NaN if none. */
  last: number;
  /** Interpolated endpoint titre (reciprocal dilution where the mean OD meets the cutoff), NaN unless status is 'ok'. */
  titre: number; log10: number;
  warn: string[];
};

/** Endpoint titre: the highest dilution with a mean OD above the cutoff, interpolated on log10 dilution to the next one. */
export function titre(rows: { dil: number; ods: number[] }[], cut: number): Titre {
  if (!Number.isFinite(cut)) throw new Error('No cutoff.');
  const pts = rows.map((r) => ({ dil: r.dil, ods: r.ods.filter(Number.isFinite) })).filter((r) => r.ods.length);
  if (pts.length < 2) throw new Error('Give at least two dilutions with an OD.');
  if (pts.some((p) => !(p.dil >= 1))) throw new Error('Each dilution must be 1 or more (type 100 or 1:100 for a 1 in 100 dilution).');
  pts.sort((a, b) => a.dil - b.dil);
  for (let i = 1; i < pts.length; i++) if (pts[i].dil === pts[i - 1].dil) throw new Error(`The dilution 1:${pts[i].dil} is listed twice. Put replicates on one line.`);
  const points: TitrePoint[] = pts.map((p) => { const m = mean(p.ods); return { dil: p.dil, ods: p.ods, mean: m, sd: sdev(p.ods), above: m > cut }; });
  const warn: string[] = [];
  let k = -1; points.forEach((p, i) => { if (p.above) k = i; });
  if (k > 0 && points.slice(0, k).some((p) => !p.above)) warn.push('The OD dips below the cutoff and rises again. The highest dilution above it is used; check the plate.');
  for (let i = 1; i < points.length; i++) if (points[i].mean > points[i - 1].mean * 1.15 && points[i].mean - points[i - 1].mean > 0.05) { warn.push(`The OD goes up from 1:${points[i - 1].dil} to 1:${points[i].dil}. A prozone (hook) at strong dilutions, or a pipetting slip?`); break; }
  if (k < 0) return { points, cut, status: 'below', last: NaN, titre: NaN, log10: NaN, warn };
  if (k === points.length - 1) return { points, cut, status: 'above', last: points[k].dil, titre: NaN, log10: NaN, warn: [...warn, 'Every dilution is above the cutoff: the titre is higher than the last dilution. Dilute further.'] };
  const a = points[k], b = points[k + 1];
  const la = Math.log10(a.dil), lb = Math.log10(b.dil);
  const lt = la + ((a.mean - cut) / (a.mean - b.mean)) * (lb - la);
  return { points, cut, status: 'ok', last: a.dil, titre: 10 ** lt, log10: lt, warn };
}

/** A dilution typed as 100, 1:100, 1/100 or 1e2 (reciprocal). */
export function readDil(s: string): number {
  const t = s.trim().replace(/\s/g, '');
  const m = /^1[:/](.+)$/.exec(t);
  const v = Number((m ? m[1] : t).replace(/[×x]10\^?/i, 'e'));
  return Number.isFinite(v) ? v : NaN;
}

/** Lines of "dilution, OD, OD, …" (tabs, commas, semicolons or spaces). Lines that do not start with a dilution are skipped. */
export function readSeries(text: string): { dil: number; ods: number[] }[] {
  const out: { dil: number; ods: number[] }[] = [];
  for (const line of text.replace(/\r\n?/g, '\n').split('\n')) {
    const cells = line.trim().split(/[\t;,]+|\s+/).filter(Boolean);
    if (cells.length < 2) continue;
    const d = readDil(cells[0]);
    if (!Number.isFinite(d)) continue;
    out.push({ dil: d, ods: cells.slice(1).map(Number).filter(Number.isFinite) });
  }
  return out;
}

export type Need = { perUnitUl: number; workingUl: number; stockUl: number; ug: number; unitsPerVial: number; vialLeftUl: number; enough: boolean };

/**
 * Antibody for `units` blots or plates at 1:`factor`, each using `perUnitUl` µL of working dilution, with `sparePct` %
 * spare. With the stock in mg/mL, the mass in µg; with a vial size in µL, how many units the vial covers.
 */
export function needed(o: { units: number; perUnitUl: number; factor: number; sparePct: number; stockMgMl?: number; vialUl?: number }): Need {
  if (!Number.isFinite(o.units) || o.units < 1) throw new Error('Give how many blots or plates (1 or more).');
  if (bad(o.perUnitUl)) throw new Error('The volume per blot or plate must be above zero.');
  if (!Number.isFinite(o.factor) || o.factor < 1) throw new Error('The dilution 1:N needs N of 1 or more.');
  if (!Number.isFinite(o.sparePct) || o.sparePct < 0) throw new Error('Spare must be 0 % or more.');
  const s = 1 + o.sparePct / 100, workingUl = o.units * o.perUnitUl * s, stockUl = workingUl / o.factor;
  const stock = o.stockMgMl ?? NaN, vial = o.vialUl ?? NaN;
  const per = (o.perUnitUl * s) / o.factor;
  return {
    perUnitUl: o.perUnitUl, workingUl, stockUl, ug: bad(stock) ? NaN : stockUl * stock,
    unitsPerVial: bad(vial) ? NaN : Math.floor(vial / per + 1e-9), vialLeftUl: bad(vial) ? NaN : vial - stockUl, enough: bad(vial) ? true : vial >= stockUl - 1e-9,
  };
}

/** A volume in µL as friendly text: "0.25 µL", "12.5 µL", "1.20 mL". */
export function fmtUl(ul: number): string {
  if (!Number.isFinite(ul)) return '–';
  if (Math.abs(ul) >= 1000) { const v = ul / 1000, d = Math.abs(v) < 10 ? 3 : Math.abs(v) < 100 ? 2 : 1; return `${v.toFixed(d).replace(/\.?0+$/, '')} mL`; }
  return `${sig3(ul)} µL`;
}
const sig3 = (x: number) => {
  const a = Math.abs(x);
  if (a >= 100) return String(Math.round(x * 10) / 10).replace(/\.0$/, '');
  if (a >= 10) return x.toFixed(1).replace(/\.0$/, '');
  if (a >= 1) return x.toFixed(2).replace(/\.?0+$/, '');
  return x.toPrecision(2).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
};

/** A concentration in µg/mL as friendly text, switching to ng/mL below 1 µg/mL. */
export function fmtConc(ugMl: number): string {
  if (!Number.isFinite(ugMl)) return '–';
  if (ugMl >= 1000) return `${sig3(ugMl / 1000)} mg/mL`;
  if (ugMl >= 1) return `${sig3(ugMl)} µg/mL`;
  return `${sig3(ugMl * 1000)} ng/mL`;
}

/** The made-up example ELISA: 3-fold dilutions from 1:100, duplicate ODs, six blank wells. */
export const EXAMPLE_SERIES = `100\t2.391\t2.377
300\t2.336\t2.315
900\t2.081\t2.052
2700\t1.302\t1.331
8100\t0.491\t0.470
24300\t0.152\t0.141
72900\t0.068\t0.064
218700\t0.055\t0.051`;
export const EXAMPLE_BLANKS = '0.052 0.048 0.061 0.055 0.046 0.058';
