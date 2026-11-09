// Köppen-Geiger climate class from 12 monthly mean temperatures and precipitation totals, with the reasoning, and
// the numbers behind a Walter-Lieth climate diagram. No DOM.
// Rules follow Peel, Finlayson and McMahon (2007), with E checked before B (so ice caps stay EF) and options for the
// older Köppen C/D boundary (−3 °C) and the h/k split by the coldest month.

export type KoppenOpts = { cdBoundary?: 0 | -3; hk?: 'mat' | 'cold' };
export type Koppen = { code: string; name: string; steps: { test: string; result: string }[]; m: ReturnType<typeof metrics> };

const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);

/** Summary numbers: the summer half is whichever of Apr–Sep and Oct–Mar is warmer (so it works in either hemisphere). */
export function metrics(T: number[], P: number[]) {
  if (T.length !== 12 || P.length !== 12) throw new Error('Need 12 monthly temperatures and 12 monthly precipitation totals.');
  const MAT = sum(T) / 12, MAP = sum(P), Thot = Math.max(...T), Tcold = Math.min(...T);
  const amjjas = [3, 4, 5, 6, 7, 8], ondjfm = [9, 10, 11, 0, 1, 2];
  const nhSummer = sum(amjjas.map((i) => T[i])) >= sum(ondjfm.map((i) => T[i]));
  const sm = nhSummer ? amjjas : ondjfm, wm = nhSummer ? ondjfm : amjjas;
  const Ps = sm.map((i) => P[i]), Pw = wm.map((i) => P[i]);
  return {
    MAT, MAP, Thot, Tcold, Tmon10: T.filter((t) => t > 10).length,
    Pdry: Math.min(...P), Pwet: Math.max(...P),
    Psdry: Math.min(...Ps), Pswet: Math.max(...Ps), Pwdry: Math.min(...Pw), Pwwet: Math.max(...Pw),
    Psum: sum(Ps), Pwin: sum(Pw), summer: sm, winter: wm, nhSummer,
    dryMonth: P.indexOf(Math.min(...P)),
  };
}

/** The aridity threshold Pthreshold (mm) of Peel et al.: 2·MAT, plus 28 if ≥ 70 % of the rain falls in summer, plus 14 if neither half has 70 %. */
export function pThreshold(m: ReturnType<typeof metrics>) {
  if (m.MAP > 0 && m.Pwin >= 0.7 * m.MAP) return { v: 2 * m.MAT, why: '70 % or more of the precipitation falls in winter' };
  if (m.MAP > 0 && m.Psum >= 0.7 * m.MAP) return { v: 2 * m.MAT + 28, why: '70 % or more falls in summer' };
  return { v: 2 * m.MAT + 14, why: 'neither half gets 70 %' };
}

const NAMES: Record<string, string> = {
  Af: 'Tropical rainforest', Am: 'Tropical monsoon', Aw: 'Tropical savanna, dry winter', As: 'Tropical savanna, dry summer',
  BWh: 'Hot desert', BWk: 'Cold desert', BSh: 'Hot semi-arid (steppe)', BSk: 'Cold semi-arid (steppe)',
  Csa: 'Mediterranean, hot summer', Csb: 'Mediterranean, warm summer', Csc: 'Mediterranean, cold summer',
  Cwa: 'Humid subtropical, dry winter', Cwb: 'Subtropical highland, dry winter', Cwc: 'Subtropical highland, cold summer',
  Cfa: 'Humid subtropical', Cfb: 'Oceanic', Cfc: 'Subpolar oceanic',
  Dsa: 'Continental, dry hot summer', Dsb: 'Continental, dry warm summer', Dsc: 'Subarctic, dry summer', Dsd: 'Subarctic, dry summer, very cold winter',
  Dwa: 'Continental, dry winter, hot summer', Dwb: 'Continental, dry winter, warm summer', Dwc: 'Subarctic, dry winter', Dwd: 'Subarctic, dry winter, very cold winter',
  Dfa: 'Humid continental, hot summer', Dfb: 'Humid continental, warm summer', Dfc: 'Subarctic', Dfd: 'Subarctic, very cold winter',
  ET: 'Tundra', EF: 'Ice cap',
};
export const koppenName = (code: string) => NAMES[code] ?? code;

const f1 = (x: number) => (Math.round(x * 10) / 10).toFixed(1).replace('-0.0', '0.0');

/** Classifies a climate and explains each test in plain words. */
export function koppen(T: number[], P: number[], opts: KoppenOpts = {}): Koppen {
  const m = metrics(T, P), cd = opts.cdBoundary ?? 0, hk = opts.hk ?? 'mat';
  const steps: { test: string; result: string }[] = [];
  const done = (code: string) => ({ code, name: koppenName(code), steps, m });
  // E: no month reaches 10 °C.
  if (m.Thot < 10) {
    steps.push({ test: `Warmest month ${f1(m.Thot)} °C is below 10 °C`, result: 'E (polar)' });
    const code = m.Thot > 0 ? 'ET' : 'EF';
    steps.push({ test: m.Thot > 0 ? `Warmest month is above 0 °C` : `Warmest month is 0 °C or below`, result: code });
    return done(code);
  }
  steps.push({ test: `Warmest month ${f1(m.Thot)} °C is 10 °C or more`, result: 'not E' });
  // B: dry.
  const th = pThreshold(m);
  steps.push({ test: `Aridity threshold: ${th.why}, so Pthreshold = ${f1(th.v)} mm and 10 × Pthreshold = ${f1(10 * th.v)} mm`, result: '' });
  if (m.MAP < 10 * th.v) {
    const W = m.MAP < 5 * th.v;
    steps.push({ test: `Annual precipitation ${Math.round(m.MAP)} mm is below ${f1(10 * th.v)} mm`, result: 'B (dry)' });
    steps.push({ test: W ? `It is also below 5 × Pthreshold = ${f1(5 * th.v)} mm` : `It is at least 5 × Pthreshold = ${f1(5 * th.v)} mm`, result: W ? 'BW (desert)' : 'BS (steppe)' });
    const h = hk === 'mat' ? m.MAT >= 18 : m.Tcold > 0;
    steps.push({ test: hk === 'mat' ? `Mean annual temperature ${f1(m.MAT)} °C is ${h ? 'at least' : 'below'} 18 °C` : `Coldest month ${f1(m.Tcold)} °C is ${h ? 'above' : 'at or below'} 0 °C`, result: h ? 'h (hot)' : 'k (cold)' });
    return done(`B${W ? 'W' : 'S'}${h ? 'h' : 'k'}`);
  }
  steps.push({ test: `Annual precipitation ${Math.round(m.MAP)} mm is at least ${f1(10 * th.v)} mm`, result: 'not B' });
  // A: tropical.
  if (m.Tcold >= 18) {
    steps.push({ test: `Coldest month ${f1(m.Tcold)} °C is 18 °C or more`, result: 'A (tropical)' });
    if (m.Pdry >= 60) { steps.push({ test: `Driest month ${f1(m.Pdry)} mm is 60 mm or more`, result: 'Af' }); return done('Af'); }
    const lim = 100 - m.MAP / 25;
    if (m.Pdry >= lim) { steps.push({ test: `Driest month ${f1(m.Pdry)} mm is below 60 mm but at least 100 − MAP/25 = ${f1(lim)} mm`, result: 'Am' }); return done('Am'); }
    const sDry = m.summer.includes(m.dryMonth);
    steps.push({ test: `Driest month ${f1(m.Pdry)} mm is below 100 − MAP/25 = ${f1(lim)} mm, and it falls in the ${sDry ? 'summer' : 'winter'} half`, result: sDry ? 'As' : 'Aw' });
    return done(sDry ? 'As' : 'Aw');
  }
  // C or D.
  const C = m.Tcold > cd;
  steps.push({ test: `Coldest month ${f1(m.Tcold)} °C is ${C ? 'above' : 'at or below'} ${cd} °C${C ? ' and below 18 °C' : ''}`, result: C ? 'C (temperate)' : 'D (continental)' });
  const s = m.Psdry < 40 && m.Psdry < m.Pwwet / 3, w = m.Pwdry < m.Pswet / 10;
  let second = 'f';
  if (s) { second = 's'; steps.push({ test: `Driest summer month ${f1(m.Psdry)} mm is below 40 mm and below a third of the wettest winter month (${f1(m.Pwwet / 3)} mm)${w ? '; the dry-winter test also passes, the dry summer is used' : ''}`, result: 's (dry summer)' }); }
  else if (w) { second = 'w'; steps.push({ test: `Driest winter month ${f1(m.Pwdry)} mm is below a tenth of the wettest summer month (${f1(m.Pswet / 10)} mm)`, result: 'w (dry winter)' }); }
  else steps.push({ test: `No dry summer (driest summer month ${f1(m.Psdry)} mm) and no dry winter (driest winter month ${f1(m.Pwdry)} mm)`, result: 'f (no dry season)' });
  let third: string;
  if (m.Thot >= 22) { third = 'a'; steps.push({ test: `Warmest month ${f1(m.Thot)} °C is 22 °C or more`, result: 'a (hot summer)' }); }
  else if (m.Tmon10 >= 4) { third = 'b'; steps.push({ test: `Warmest month below 22 °C; ${m.Tmon10} months above 10 °C (4 or more)`, result: 'b (warm summer)' }); }
  else if (!C && m.Tcold < -38) { third = 'd'; steps.push({ test: `Only ${m.Tmon10} months above 10 °C and the coldest month ${f1(m.Tcold)} °C is below −38 °C`, result: 'd (very cold winter)' }); }
  else { third = 'c'; steps.push({ test: `Warmest month below 22 °C; only ${m.Tmon10} month${m.Tmon10 === 1 ? '' : 's'} above 10 °C`, result: 'c (cold summer)' }); }
  return done(`${C ? 'C' : 'D'}${second}${third}`);
}

/**
 * Walter-Lieth diagram numbers: precipitation is drawn on a scale where 20 mm matches 10 °C (P = 2T); above 100 mm the
 * scale is compressed ten times. Arid months are where the precipitation line is below the temperature line.
 * Returns the y value (in °C units) of each month's precipitation and which months are arid.
 */
export function walterLieth(T: number[], P: number[]) {
  const py = P.map((p) => (p <= 100 ? p / 2 : 50 + (p - 100) / 20));
  return { py, arid: P.map((p, i) => p < 2 * T[i]), wet: P.map((p) => p > 100) };
}

/** Where the two curves cross between month i and i+1 (fraction 0..1), using the uncompressed P/2 scale, or null. */
export function crossing(Ta: number, Tb: number, Pa: number, Pb: number) {
  const a = Pa / 2 - Ta, b = Pb / 2 - Tb;
  if (a === 0 || b === 0 || a * b > 0) return null;
  return a / (a - b);
}

/**
 * Reads 12 monthly temperatures and precipitation totals from table rows (already split into cells): either 12 rows
 * whose last two numbers are T and P (a month name or number may come first; rows for the year, annual or total are
 * skipped), or two rows of 12 numbers (the row whose label mentions precipitation, rain or P is precipitation).
 */
export function parseMonthly(rows: string[][], toNum: (s: string) => number): { T: number[]; P: number[] } | { error: string } {
  const label = (r: string[]) => r.filter((c) => !Number.isFinite(toNum(c))).join(' ');
  const nums = (r: string[]) => r.map(toNum).filter((x) => Number.isFinite(x));
  const keep = rows.filter((r) => !/\b(year|annual|total|mean|avg|average)\b/i.test(label(r)) || nums(r).length >= 12);
  const wide = keep.filter((r) => nums(r).length >= 12);
  if (wide.length >= 2) {
    const pi = wide.findIndex((r) => /prec|rain|ppt|^\s*p\b|mm|inch/i.test(label(r)));
    const pr = pi >= 0 ? wide[pi] : wide[1], tr = pi >= 0 ? wide.find((_, i) => i !== pi)! : wide[0];
    return { T: nums(tr).slice(-12), P: nums(pr).slice(-12) };
  }
  const long = keep.filter((r) => nums(r).length >= 2);
  if (long.length === 12) return { T: long.map((r) => nums(r).slice(-2)[0]), P: long.map((r) => nums(r).slice(-1)[0]) };
  if (long.length > 12) return { error: `Found ${long.length} rows with two numbers; give exactly 12 months (January to December).` };
  return { error: long.length ? `Found only ${long.length} months; give all 12 (January to December).` : 'Give 12 rows of month, temperature and precipitation (or two rows of 12 values).' };
}
