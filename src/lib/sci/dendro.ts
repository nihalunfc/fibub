// Tree-ring cross-dating: reading ring-width series (Tucson .rwl, a year table, or a plain list), the
// Baillie-Pilcher (1973) and Hollstein (1980) standardisations, t-values, Gleichläufigkeit with its significance,
// and sliding an undated sample along a dated master chronology. Plain TypeScript, no DOM.
import { normCdf } from './stats.ts';

export type Series = { name: string; start: number; w: number[] };

const isNum = (s: string) => /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s.trim());

/**
 * Tucson decadal format: an ID (8 columns), the year of the line's first ring (4 columns), then up to ten values of
 * 6 columns. A series ends with 999 (values in 0.01 mm) or −9999 (values in 0.001 mm). Lines that do not fit are
 * skipped (header lines). Widths come back in mm.
 */
export function parseRwl(text: string): { series: Series[]; notes: string[] } {
  const out = new Map<string, { start: number; vals: Map<number, number>; unit: number }>(), order: string[] = [];
  let skipped = 0;
  for (const raw of text.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) continue;
    let id = '', year = NaN, vals: string[] = [];
    const fy = line.slice(8, 12).trim();
    if (line.length >= 18 && /^-?\d+$/.test(fy) && /^[\s\d-]*$/.test(line.slice(12))) {
      id = line.slice(0, 8).trim(); year = Number(fy);
      for (let k = 12; k < line.length; k += 6) vals.push(line.slice(k, k + 6));
    } else {
      const t = line.trim().split(/\s+/);
      if (t.length >= 3 && /^-?\d+$/.test(t[1]) && t.slice(2).every((v) => /^-?\d+$/.test(v))) { id = t[0]; year = Number(t[1]); vals = t.slice(2); }
    }
    vals = vals.map((v) => v.trim()).filter((v) => v !== '');
    if (!id || !Number.isFinite(year) || !vals.length) { skipped++; continue; }
    if (!out.has(id)) { out.set(id, { start: year, vals: new Map(), unit: 0.01 }); order.push(id); }
    const s = out.get(id)!;
    vals.forEach((v, k) => {
      const n = Number(v);
      if (n === 999) { s.unit = 0.01; return; }
      if (n === -9999) { s.unit = 0.001; return; }
      s.vals.set(year + k, n);
    });
  }
  // Drop anything after a stop marker is not needed: stop markers are not stored as values.
  const series = order.map((id) => {
    const s = out.get(id)!, years = [...s.vals.keys()].sort((a, b) => a - b), start = years[0], end = years[years.length - 1];
    const w: number[] = [];
    for (let y = start; y <= end; y++) { const v = s.vals.get(y); w.push(v === undefined || v < 0 ? NaN : v * s.unit); }
    return { name: id, start, w };
  }).filter((s) => s.w.length);
  return { series, notes: skipped ? [`${skipped} line${skipped === 1 ? '' : 's'} that are not ring widths (such as headers) were skipped.`] : [] };
}

/**
 * Any of: Tucson .rwl; a table with a year column then one column per series (header row names them); or a plain
 * list of widths (one series, starting at `start`). Throws an Error with a plain message.
 */
export function parseSeries(text: string, start = 1): { series: Series[]; format: 'Tucson' | 'table' | 'list'; notes: string[] } {
  const lines = text.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  if (!lines.length) return { series: [], format: 'list', notes: [] };
  const rows = lines.map((l) => l.split(l.includes('\t') ? /\t/ : l.includes(';') ? /;/ : l.includes(',') ? /,/ : /\s+/).map((c) => c.trim()));
  // Tucson: most lines start with a non-numeric ID and a year, followed by integers, and there is a stop marker.
  if (/(^|\s)(999|-9999)\s*$/m.test(text) && rows.filter((r) => r.length >= 3 && !isNum(r[0])).length >= lines.length / 2) {
    const r = parseRwl(text);
    if (r.series.length) return { ...r, format: 'Tucson' };
  }
  const head = rows[0].some((c) => c !== '' && !isNum(c));
  const body = head ? rows.slice(1) : rows;
  const width = Math.max(...body.map((r) => r.length));
  const isTable = width > 1 && body.every((r, i) => /^-?\d+$/.test(r[0]) && (i === 0 || Number(r[0]) === Number(body[i - 1][0]) + 1));
  if (width === 1 || (!head && !isTable)) {
    // A plain list of widths (possibly several per line).
    const vals = body.flat().filter((c) => c !== '');
    const bad = vals.find((c) => !isNum(c));
    if (bad !== undefined) throw new Error(`"${bad}" is not a ring width.`);
    return { series: [{ name: head ? rows[0][0] : 'Sample', start, w: vals.map(Number) }], format: 'list', notes: [] };
  }
  const years = body.map((r) => Number(r[0]));
  if (years.some((y) => !Number.isInteger(y))) throw new Error('The first column should hold whole years.');
  for (let i = 1; i < years.length; i++) if (years[i] !== years[i - 1] + 1) throw new Error(`Years must follow each other with no gaps: ${years[i - 1]} is followed by ${years[i]}.`);
  const series: Series[] = [];
  for (let j = 1; j < width; j++) {
    const w = body.map((r) => (r[j] === undefined || r[j] === '' ? NaN : Number(r[j])));
    if (body.some((r) => r[j] !== undefined && r[j] !== '' && !isNum(r[j]))) throw new Error(`Column ${j + 1} has a value that is not a number.`);
    let a = 0, b = w.length - 1;
    while (a <= b && Number.isNaN(w[a])) a++;
    while (b >= a && Number.isNaN(w[b])) b--;
    if (a > b) continue;
    series.push({ name: head ? rows[0][j] || `Series ${j}` : `Series ${j}`, start: years[a], w: w.slice(a, b + 1) });
  }
  return { series, format: 'table', notes: [] };
}

/** Baillie-Pilcher index: 100 × width / centred 5-year mean. The first and last two rings get NaN. */
export function bpIndex(w: number[]): number[] {
  return w.map((x, i) => {
    if (i < 2 || i > w.length - 3) return NaN;
    const m = (w[i - 2] + w[i - 1] + x + w[i + 1] + w[i + 2]) / 5;
    return m > 0 ? (100 * x) / m : NaN;
  });
}
/** Hollstein's Wuchswerte: 100 × ln(w_i / w_{i−1}). The first ring gets NaN. */
export function hollstein(w: number[]): number[] {
  return w.map((x, i) => (i === 0 || !(x > 0) || !(w[i - 1] > 0) ? NaN : 100 * Math.log(x / w[i - 1])));
}

/** Pearson correlation of the pairs where both values are finite; n is the number of such pairs. */
export function corr(a: number[], b: number[]): { r: number; n: number } {
  let n = 0, sa = 0, sb = 0;
  for (let i = 0; i < a.length; i++) if (Number.isFinite(a[i]) && Number.isFinite(b[i])) { n++; sa += a[i]; sb += b[i]; }
  if (n < 3) return { r: NaN, n };
  const ma = sa / n, mb = sb / n;
  let sab = 0, saa = 0, sbb = 0;
  for (let i = 0; i < a.length; i++) if (Number.isFinite(a[i]) && Number.isFinite(b[i])) { const x = a[i] - ma, y = b[i] - mb; sab += x * y; saa += x * x; sbb += y * y; }
  return { r: saa > 0 && sbb > 0 ? sab / Math.sqrt(saa * sbb) : NaN, n };
}
/** Student t of a correlation: r √(n − 2) / √(1 − r²). */
export const tOf = (r: number, n: number) => (Number.isFinite(r) && n > 2 ? (r * Math.sqrt(n - 2)) / Math.sqrt(Math.max(1e-300, 1 - r * r)) : NaN);

/**
 * Gleichläufigkeit: the share of year-to-year intervals in which both series change in the same direction. An
 * interval where one series does not change counts as half. Inputs are year-to-year changes (sign matters only).
 * Significance: z = (G − 0.5) · 2√n, one-sided p from the normal distribution.
 */
export function glk(da: number[], db: number[]): { g: number; n: number; z: number; p: number } {
  let n = 0, s = 0;
  for (let i = 0; i < da.length; i++) {
    if (!Number.isFinite(da[i]) || !Number.isFinite(db[i])) continue;
    n++;
    const x = Math.sign(da[i]), y = Math.sign(db[i]);
    s += x === 0 || y === 0 ? 0.5 : x === y ? 1 : 0;
  }
  const g = n ? s / n : NaN, z = n ? (g - 0.5) * 2 * Math.sqrt(n) : NaN;
  return { g, n, z, p: Number.isFinite(z) ? 1 - normCdf(z) : NaN };
}

export type Master = { start: number; bp: number[]; ho: number[]; raw: number[]; count: number[] };
/**
 * A master chronology from dated series: per year, the mean Baillie-Pilcher index (before the log), the mean
 * Hollstein value and the mean raw width, over the series that have a value there.
 */
export function buildMaster(series: Series[]): Master {
  const start = Math.min(...series.map((s) => s.start)), end = Math.max(...series.map((s) => s.start + s.w.length - 1)), L = end - start + 1;
  const sum = { bp: new Array(L).fill(0), ho: new Array(L).fill(0), raw: new Array(L).fill(0) }, cnt = { bp: new Array(L).fill(0), ho: new Array(L).fill(0), raw: new Array(L).fill(0) };
  for (const s of series) {
    const b = bpIndex(s.w), h = hollstein(s.w), o = s.start - start;
    s.w.forEach((x, i) => {
      if (Number.isFinite(x)) { sum.raw[o + i] += x; cnt.raw[o + i]++; }
      if (Number.isFinite(b[i])) { sum.bp[o + i] += b[i]; cnt.bp[o + i]++; }
      if (Number.isFinite(h[i])) { sum.ho[o + i] += h[i]; cnt.ho[o + i]++; }
    });
  }
  const mean = (k: 'bp' | 'ho' | 'raw') => sum[k].map((v, i) => (cnt[k][i] ? v / cnt[k][i] : NaN));
  return { start, bp: mean('bp'), ho: mean('ho'), raw: mean('raw'), count: cnt.raw };
}

export type Match = { end: number; first: number; overlap: number; rBP: number; tBP: number; nBP: number; rH: number; tH: number; nH: number; glk: number; glkN: number; glkZ: number; glkP: number };

/**
 * Slide the sample along the master. `end` is the calendar year of the sample's last ring. Every position with at
 * least `minOverlap` rings in common is scored: t-values after Baillie-Pilcher (ln of the indices) and Hollstein
 * standardisation, and the Gleichläufigkeit of the Hollstein values (the signs of the year-to-year changes).
 */
export function slide(master: Master, sample: number[], minOverlap = 30): Match[] {
  const sbp = bpIndex(sample).map((v) => (v > 0 ? Math.log(v) : NaN)), sho = hollstein(sample);
  const mbp = master.bp.map((v) => (v > 0 ? Math.log(v) : NaN)), mho = master.ho, M = mbp.length, S = sample.length;
  const out: Match[] = [];
  for (let off = -(S - minOverlap); off <= M - minOverlap; off++) {
    // Sample ring i sits at master index off + i.
    const i0 = Math.max(0, -off), i1 = Math.min(S, M - off);
    const overlap = i1 - i0;
    if (overlap < minOverlap) continue;
    const a1: number[] = [], b1: number[] = [], a2: number[] = [], b2: number[] = [];
    for (let i = i0; i < i1; i++) { a1.push(sbp[i]); b1.push(mbp[off + i]); a2.push(sho[i]); b2.push(mho[off + i]); }
    const c1 = corr(a1, b1), c2 = corr(a2, b2), g = glk(a2, b2);
    out.push({ end: master.start + off + S - 1, first: master.start + off, overlap, rBP: c1.r, tBP: tOf(c1.r, c1.n), nBP: c1.n, rH: c2.r, tH: tOf(c2.r, c2.n), nH: c2.n, glk: g.g, glkN: g.n, glkZ: g.z, glkP: g.p });
  }
  return out;
}

/** Stars for a one-sided p: *** below 0.001, ** below 0.01, * below 0.05. */
export const stars = (p: number) => (p < 0.001 ? '***' : p < 0.01 ? '**' : p < 0.05 ? '*' : '');

/** Made-up example: a master of four invented oak series (Tucson format, 0.01 mm), 1601 to 1800. */
export const EXAMPLE_MASTER = `OAK01A  1601   220   330   363   145   307   165   281   149   171
OAK01A  1610   247   187   229   208   206   114   196   319   338   229
OAK01A  1620   441   161   262   226   202   116   134   348   231   231
OAK01A  1630   216   198   189   180   217   209   267   330   114   115
OAK01A  1640   220   191   112    80   148   138   249   160   268   174
OAK01A  1650   156   225   109   180   182   155   205   266   341   180
OAK01A  1660   156   114   144   257   167   151   288   144   127   236
OAK01A  1670   143   224   159   182   156   291   248    78   213   125
OAK01A  1680   121   182   139   148   152   217   154   341   131   130
OAK01A  1690   180   205   157   136   157   184   165   152    81    62
OAK01A  1700   134    98   159   124    59   190   149    61   116   102
OAK01A  1710    89    73    99   121   183   124    72   147   281   145
OAK01A  1720   120    82   144   217    77   147   145    78   153    99
OAK01A  1730    81   124    89   139    79    97   132   166   160   147
OAK01A  1740    91    79   138   104   105    93   127    81   119   102
OAK01A  1750    94    87    53    95   122    94   151    82   106    92
OAK01A  1760    79    83    69   105   119   169    71    64   142   110
OAK01A  1770    71   122   152   999
OAK02A  1618   410   256
OAK02A  1620   352   164   148   279   206   112   150   246   298   251
OAK02A  1630   137   257   170   164   355   192   164   257   127   198
OAK02A  1640   219   241   146    88   165   159   286   191   249   228
OAK02A  1650   148   269   135   194   197   195   134   284   323   231
OAK02A  1660   169    99   166   183   191   102   231   130   123   184
OAK02A  1670   166   269   135   168    99   181   181   120   168   115
OAK02A  1680   120   268   107   143   152   245   146   361   148   120
OAK02A  1690   118   139   105   127   135   195   177   136    99   101
OAK02A  1700   122   176   133   172    70   148   165   105    87    97
OAK02A  1710    87    92    99    93   155   113    92   137   113   111
OAK02A  1720   119    92   121   183   113   134   189    83   131   143
OAK02A  1730    83   135   142   140   109    90    92   105   160   124
OAK02A  1740    96    63   174   106   124   109   131    62    83    91
OAK02A  1750   104    89    62   122   102    71   123    98   103    82
OAK02A  1760    76    56    66   156   154   122   100    41   120   112
OAK02A  1770    85    88   136    76    96   111    74   115    74    78
OAK02A  1780   127   104    57    75    91    85    85   145    87   163
OAK02A  1790    76    68   103    54    98   105   116    65    73    80
OAK02A  1800    51   999
OAK03B  1640   418   329   238   131   262   319   421   377   456   328
OAK03B  1650   301   414   222   223   280   214   186   312   397   421
OAK03B  1660   243   117   252   313   254   205   460   224   185   300
OAK03B  1670   254   325   254   199   190   369   246   127   321   223
OAK03B  1680   179   283   193   204   343   397   173   643   192   213
OAK03B  1690   279   172   224   178   145   281   288   157   214   122
OAK03B  1700   260   183   248   208   108   218   201   183   181   100
OAK03B  1710   117   124   162   165   206   131   109   223   151   181
OAK03B  1720   167   110   203   229   183   161   222   141   234   119
OAK03B  1730   158   276   167   187   132   165   135   182   187   160
OAK03B  1740   171   103   190   159   135   166   177   101   137   122
OAK03B  1750    89    68   101   144   174    93   215   140   143   110
OAK03B  1760    92   115    80   177   168   201   113    93   126   116
OAK03B  1770    91   126   146    99   110   128    94   149   122   184
OAK03B  1780   176   138   102   147   111   149    89   136    90   152
OAK03B  1790    90    99   157    84   149   121   999
OAK04A  1605   170   205   264   182   185
OAK04A  1610   226   208   289   235   124   130   131   117   220   184
OAK04A  1620   266   139   135   209   199    77   131   236   165   207
OAK04A  1630   197   175   135   149   281   218   225   176    88   131
OAK04A  1640   234   182   115    82   126   128   338   204   231   194
OAK04A  1650   100   183    79   128   171   121   101   258   211   200
OAK04A  1660   187    88   150   235   123   105   194   111   135   154
OAK04A  1670   117   168   113   166    98   195   192    69   183    87
OAK04A  1680   125   219    75   104   169   185   116   539   188   125
OAK04A  1690   246    84    95    91   112   196   141   103   107    90
OAK04A  1700    88    87   116   145    53   127   103   109    72    66
OAK04A  1710    65    83    85    86   166    98    59   143   124   113
OAK04A  1720   116    85    83   151   133   157   115    64   127   122
OAK04A  1730    82   104   143    94   102    94    91   108   107    97
OAK04A  1740    86    55   125    79    72   116   999
`;
/** Made-up example: an undated sample of 80 rings (mm). It belongs to 1691 to 1770. */
export const EXAMPLE_SAMPLE = `3.09
2.30
3.22
1.82
2.82
3.23
2.48
2.09
1.44
1.91
2.68
2.42
2.22
1.18
2.68
3.84
1.72
2.22
1.03
2.25
2.17
1.45
2.10
2.28
2.26
1.07
1.87
2.29
2.44
2.26
1.08
2.57
2.66
2.33
2.01
3.20
1.25
2.75
1.71
1.72
2.20
2.41
1.58
1.12
1.44
1.55
2.73
2.72
1.59
1.22
1.09
1.51
1.09
1.11
2.51
1.93
0.87
1.61
1.92
1.44
0.85
1.61
1.46
1.92
1.48
2.47
1.24
1.46
1.26
1.02
0.94
0.91
1.35
2.43
2.23
1.39
0.89
1.83
1.66
2.10
`;
