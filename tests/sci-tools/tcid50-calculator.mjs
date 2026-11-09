// #198 TCID50 and plaque assay calculator. Reed–Muench (table form) and Spearman–Kärber (the even-step textbook
// formula d₀ − step/2 + step·Σp and its standard error) were checked against an independent NumPy script on the
// made-up example and five random series (whole, half-log, 2-fold and 3-fold steps); the exact Poisson interval
// against the same script, which sums Poisson probabilities and bisects (no gamma functions), and the textbook
// values for 0 and 1 counts (0 to 3.689, 0.0253 to 5.572). The example worked by hand: RM 5 + 33.33/46.97 = 5.710,
// SK 4 − 0.5 + 2.25 = 5.75.
import { parseDilution, dilutionLabel, dilutionText, reedMuench, spearmanKarber, reversals, perMl, PFU_PER_TCID50, poissonCI, gammaP, plaqueTitre, parsePlate, parseWells, parsePlates, EXAMPLE_WELLS, EXAMPLE_PLATES } from '../../src/lib/sci/tcid50.ts';
import { num, parseTable } from '../../src/lib/sci/num.ts';

const PY = {"ex_rm": 5.709677419354839, "ex_pct": [100.0, 100.0, 100.0, 100.0, 83.33333333333333, 36.36363636363637, 6.666666666666667, 0.0], "ex_sk": 5.75, "ex_se": 0.27548658250966984, "rand": [{"d": [1.0, 1.4771212547196624, 1.9542425094393248, 2.4313637641589874, 2.9084850188786495, 3.385606273598312, 3.8627275283179747], "pos": [10, 8, 5, 3, 0, 0, 0], "n": 10, "rm": 1.998808780484568, "sk": 2.0019546349112907, "se": 0.12522855055070056}, {"d": [1.0, 1.3010299956639813, 1.6020599913279625, 1.9030899869919435, 2.204119982655925, 2.5051499783199063, 2.806179973983887, 3.1072099696478683, 3.4082399653118496], "pos": [8, 8, 8, 8, 7, 7, 0, 0, 0], "n": 8, "rm": 2.6126606910570422, "sk": 2.5804074772359016, "se": 0.05321508781863953}, {"d": [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0], "pos": [6, 6, 3, 1, 1, 0, 0, 0, 0], "n": 6, "rm": 3.2941176470588234, "sk": 3.333333333333333, "se": 0.32489314482696546}, {"d": [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0], "pos": [4, 1, 2, 1, 0, 0, 0, 0, 0], "n": 4, "rm": 2.3636363636363638, "sk": 2.5, "se": 0.4564354645876384}, {"d": [1.0, 2.0, 3.0, 4.0, 5.0, 6.0], "pos": [7, 5, 0, 2, 0, 0], "n": 7, "rm": 2.4661016949152543, "sk": 2.5, "se": 0.26082026547865056}], "ci": {"0": [0.0, 3.688879454113935], "1": [0.025317807984289842, 5.571643390938897], "5": [1.6234863901184209, 11.668332079322667], "27": [17.793170131764676, 39.28358244516208], "264": [233.1118247512971, 297.84224215638676], "291": [258.5225113107921, 326.42874229177175], "1000": [938.9730184076648, 1063.952136016304]}, "ci90_264": [237.85476279709422, 292.332625197478]};

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  // Reading dilutions.
  check('tcid50: dilutions in every common form', ['1:1000', '1/1000', '10^-3', '10⁻³', '10-3', '1e-3', '0.001', '1000', '-3', '1:1,000', '1 : 1000'].every((s) => near(parseDilution(s), 3)) && near(parseDilution('10^-2.5'), 2.5) && near(parseDilution('1:2'), Math.log10(2)) && near(parseDilution('0,01'), 2));
  check('tcid50: unreadable dilutions are NaN', ['', 'abc', '0', '1:0.5', '10^', '1:'].every((s) => Number.isNaN(parseDilution(s))));
  check('tcid50: dilution labels', dilutionLabel(3) === '10⁻³' && dilutionLabel(2.5) === '10⁻²·⁵' && dilutionLabel(Math.log10(2)) === '1:2' && dilutionLabel(Math.log10(316.2)) === '1:316' && dilutionLabel(0) === 'undiluted' && near(parseDilution(dilutionText(Math.log10(3))), Math.log10(3), 1e-6) && dilutionText(4) === '10^-4');
  // The example against hand working and NumPy.
  const rm = reedMuench(EXAMPLE_WELLS), sk = spearmanKarber(EXAMPLE_WELLS);
  check('tcid50: example Reed–Muench 5.710 (by hand 5 + 33.33/46.97; NumPy)', near(rm.log50, PY.ex_rm) && near(rm.log50, 5 + (100 * 10 / 12 - 50) / (100 * 10 / 12 - 400 / 11)) && near(rm.log50, 5.70968, 1e-6) && near(rm.pd, (100 * 10 / 12 - 50) / (100 * 10 / 12 - 400 / 11)) && rm.above === 4 && rm.below === 5);
  check('tcid50: example cumulative percentages (NumPy)', rm.rows.every((r, i) => near(r.pct, PY.ex_pct[i])) && rm.rows[4].cumPos === 10 && rm.rows[4].cumNeg === 2 && rm.rows[5].cumPos === 4 && rm.rows[5].cumNeg === 7);
  check('tcid50: example Spearman–Kärber 5.75 ± 0.2755 (by hand; NumPy)', near(sk.log50, 5.75) && near(sk.se, PY.ex_se) && near(sk.lo, 5.75 - 1.959963984540054 * PY.ex_se, 1e-8) && near(sk.hi, 5.75 + 1.959963984540054 * PY.ex_se, 1e-8) && sk.from === 3 && sk.to === 7);
  check('tcid50: example titres per mL (0.1 mL wells) and PFU', near(perMl(5.75, 0.1), 10 ** 6.75) && near(perMl(5.75, 0.1) * PFU_PER_TCID50, 3897853.04, 1e-8) && near(PFU_PER_TCID50, 0.6931471805599453));
  PY.rand.forEach((c, i) => {
    const rows = c.d.map((d, j) => ({ d, pos: c.pos[j], n: c.n }));
    const a = reedMuench(rows), b = spearmanKarber(rows);
    check(`tcid50: random series ${i + 1} (${c.d.length} dilutions, step ${(c.d[1] - c.d[0]).toFixed(3)}) matches NumPy`, near(a.log50, c.rm) && near(b.log50, c.sk) && near(b.se, c.se));
  });
  check('tcid50: order of rows does not matter', near(reedMuench([...EXAMPLE_WELLS].reverse()).log50, rm.log50) && near(spearmanKarber([...EXAMPLE_WELLS].reverse()).log50, 5.75));
  // Unequal steps: SK is the trapezium area, worked by hand.
  const uneq = [{ d: 1, pos: 4, n: 4 }, { d: 2, pos: 2, n: 4 }, { d: 4, pos: 0, n: 4 }];
  check('tcid50: uneven steps (1 + 1·0.75 + 2·0.25 = 2.25; se from half-gaps)', near(spearmanKarber(uneq).log50, 2.25) && near(spearmanKarber(uneq).se, Math.sqrt(1.5 * 1.5 * 0.25 / 3)) && near(reedMuench(uneq).log50, 2));
  // Exactly 50 %: no interpolation needed.
  check('tcid50: 50 % reached exactly', near(reedMuench([{ d: 1, pos: 4, n: 4 }, { d: 2, pos: 2, n: 4 }, { d: 3, pos: 0, n: 4 }]).log50, 2));
  check('tcid50: one well per dilution (se 0)', near(spearmanKarber([{ d: 1, pos: 1, n: 1 }, { d: 2, pos: 1, n: 1 }, { d: 3, pos: 0, n: 1 }]).log50, 2.5) && spearmanKarber([{ d: 1, pos: 1, n: 1 }, { d: 2, pos: 0, n: 1 }]).se === 0);
  check('tcid50: rows stronger than the last all-infected one are left out of SK', near(spearmanKarber([{ d: 1, pos: 3, n: 4 }, { d: 2, pos: 4, n: 4 }, { d: 3, pos: 0, n: 4 }]).log50, 2.5) && spearmanKarber([{ d: 1, pos: 3, n: 4 }, { d: 2, pos: 4, n: 4 }, { d: 3, pos: 0, n: 4 }]).from === 1);
  check('tcid50: reversals found', JSON.stringify(reversals(PY.rand[4].d.map((d, j) => ({ d, pos: PY.rand[4].pos[j], n: 7 })))) === '[3]' && reversals(EXAMPLE_WELLS).length === 0);
  const thrown = (f) => { try { f(); return ''; } catch (e) { return e.message; } };
  check('tcid50: errors (too few, bad wells, twice, no crossing, SK ends)',
    /at least two/.test(thrown(() => reedMuench([{ d: 1, pos: 1, n: 2 }]))) && /more infected wells/.test(thrown(() => reedMuench([{ d: 1, pos: 5, n: 4 }, { d: 2, pos: 0, n: 4 }]))) && /whole number, 1 or more/.test(thrown(() => reedMuench([{ d: 1, pos: 0, n: 0 }, { d: 2, pos: 0, n: 4 }])))
    && /listed twice/.test(thrown(() => reedMuench([{ d: 1, pos: 4, n: 4 }, { d: 1, pos: 0, n: 4 }]))) && /Add stronger/.test(thrown(() => reedMuench([{ d: 1, pos: 1, n: 4 }, { d: 2, pos: 0, n: 4 }]))) && /Add weaker/.test(thrown(() => reedMuench([{ d: 1, pos: 4, n: 4 }, { d: 2, pos: 3, n: 4 }])))
    && /every well is infected/.test(thrown(() => spearmanKarber([{ d: 1, pos: 3, n: 4 }, { d: 2, pos: 0, n: 4 }]))) && /no infected wells/.test(thrown(() => spearmanKarber([{ d: 1, pos: 4, n: 4 }, { d: 2, pos: 1, n: 4 }]))) && /write the dilution/.test(thrown(() => reedMuench([{ d: NaN, pos: 4, n: 4 }, { d: 2, pos: 1, n: 4 }]))));
  // Poisson interval against NumPy and the textbook values.
  check('plaque: gammaP sanity (P(1, x) = 1 − e^−x)', near(gammaP(1, 2), 1 - Math.exp(-2), 1e-13) && near(gammaP(5, 3), 1 - Math.exp(-3) * (1 + 3 + 4.5 + 4.5 + 3.375), 1e-12) && near(gammaP(300, 320), 1 - [...Array(300).keys()].reduce((s, k) => s + Math.exp(-320 + k * Math.log(320) - [...Array(k).keys()].reduce((a, j) => a + Math.log(j + 1), 0)), 0), 1e-9));
  check('plaque: exact Poisson intervals match NumPy (0, 1, 5, 27, 264, 291, 1000)', Object.entries(PY.ci).every(([c, [lo, hi]]) => { const [a, b] = poissonCI(Number(c)); return near(a, lo, 1e-9) && near(b, hi, 1e-9); }) && near(poissonCI(0)[1], 3.688879454113936, 1e-9) && near(poissonCI(1)[0], 0.0253178079842899, 1e-8));
  check('plaque: 90 % interval for 264', near(poissonCI(264, 0.9)[0], PY.ci90_264[0], 1e-9) && near(poissonCI(264, 0.9)[1], PY.ci90_264[1], 1e-9));
  // Plaque titres.
  const p = plaqueTitre(EXAMPLE_PLATES, 0.1, 10, 100);
  check('plaque: example 264 / (3 × 0.1 × 10⁻⁵ mL) = 8.8 × 10⁷ PFU/mL', near(p.titre, 8.8e7) && p.total === 264 && near(p.volume, 3e-6) && p.usedPlates === 3 && !p.fallback && near(p.lo, PY.ci['264'][0] / 3e-6, 1e-9) && near(p.hi, PY.ci['264'][1] / 3e-6, 1e-9));
  check('plaque: example rows (TNTC, in range, below range)', p.rows.map((r) => r.why).join('|') === 'too many to count|in range|below the range|below the range' && near(p.rows[2].titre, 9e7) && near(p.rows[3].titre, 1e8) && Number.isNaN(p.rows[0].titre) && p.rows[0].tntc === 3);
  const p5 = plaqueTitre(EXAMPLE_PLATES, 0.1, 5, 100);
  check('plaque: lowest count 5 pools 10⁻⁵ and 10⁻⁶: 291 / 3.3 × 10⁻⁶ mL', near(p5.titre, 291 / 3.3e-6) && p5.usedPlates === 6 && near(p5.lo, PY.ci['291'][0] / 3.3e-6, 1e-9));
  const pf = plaqueTitre(EXAMPLE_PLATES, 0.1, 100, 300);
  check('plaque: nothing in range falls back to the nearest dilution', pf.fallback && near(pf.titre, 8.8e7) && pf.rows[1].used && !pf.rows[2].used);
  check('plaque: volume 0.2 mL halves the titre', near(plaqueTitre(EXAMPLE_PLATES, 0.2, 10, 100).titre, 4.4e7));
  check('plaque: plate parsing', parsePlate('TNTC') === 'tntc' && parsePlate('>300') === 'tntc' && parsePlate(' 42 ') === 42 && parsePlate('') === null && Number.isNaN(parsePlate('4.5')) && Number.isNaN(parsePlate('-1')));
  check('plaque: errors', /Every plate is too crowded/.test(thrown(() => plaqueTitre([{ d: 3, counts: ['tntc'] }], 0.1, 10, 100))) && /No plaques/.test(thrown(() => plaqueTitre([{ d: 3, counts: [0, 0] }], 0.1, 10, 100))) && /volume/.test(thrown(() => plaqueTitre(EXAMPLE_PLATES, 0, 10, 100))) && /countable range/.test(thrown(() => plaqueTitre(EXAMPLE_PLATES, 0.1, 100, 10))) && /whole numbers/.test(thrown(() => plaqueTitre([{ d: 3, counts: [1.5] }], 0.1, 1, 100))) && /listed twice/.test(thrown(() => plaqueTitre([{ d: 3, counts: [10] }, { d: 3, counts: [12] }], 0.1, 1, 100))));
  // Pasted tables.
  const w = parseWells(parseTable('dilution\tinfected\twells\n10^-1\t4\t4\n1:100\t2\t4\n0.001\t0\t4\nbad\t1'), num);
  check('paste: wells table', w.rows.length === 3 && near(w.rows[1].d, 2) && w.rows[1].pos === 2 && w.errors.length === 1 && /Line 5/.test(w.errors[0]));
  const pp = parsePlates(parseTable('dilution,a,b\n1e-5,88,97\n1e-6,11,TNTC\n1e-7,x'));
  check('paste: plates table', pp.rows.length === 2 && pp.rows[1].counts[1] === 'tntc' && pp.errors.length === 1);
};
