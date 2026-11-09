// #187 crystallisation screen designer. Expected values come from an independent NumPy implementation
// (linspace/geomspace grids, C1V1, and the pH mix found by bisection on the forward Henderson–Hasselbalch pH of
// the mixed stocks, not the closed form), run on the page's example screen, a 24-well version rounded to 0.5 µL,
// a straight-line pH mix and a log-spaced salt screen. Agreement was better than 1e-7 µL in every well.
import { design, levels, highFraction, mixPH, baseFraction, factorErrors, stocksOf, withSpare, dropFactor, EXAMPLE } from '../../src/lib/sci/crystalscreen.ts';

export default async (check) => {
  const near = (name, got, want, tol = 1e-6) => check(`${name} (got ${got}, want ${want})`, Math.abs(got - want) <= tol);
  const d = design(EXAMPLE, { size: 96, volume: 100 });
  check('cxs: example is 8 × 12 with 4 stocks', d.R === 8 && d.C === 12 && d.wells.length === 96 && d.stocks.length === 4);
  check('cxs: example stock labels', d.stocks.map((s) => s.label).join('|') === 'PEG 3350|Buffer pH 6.5|Buffer pH 8.5|Sodium chloride');
  // Wells A1, A12, B1, C3 and H12 against NumPy.
  const want = { A1: [16, 9.744473925, 0.255526075, 5, 69], A12: [60, 9.744473925, 0.255526075, 5, 25], B1: [16, 9.078096846, 0.921903154, 5, 69], E3: [24, 5.700475524, 4.299524476, 5, 61], H12: [60, 1.825315341, 8.174684659, 5, 25] };
  for (const [n, v] of Object.entries(want)) {
    const w = d.wells.find((x) => x.name === n);
    check(`cxs: well ${n} volumes match NumPy`, v.slice(0, 4).every((x, k) => Math.abs(w.vols[k] - x) < 1e-6) && Math.abs(w.water - v[4]) < 1e-6);
  }
  check('cxs: example levels (PEG 8 to 30 in 2s, pH 6.6 to 8.0 in 0.2s)', d.wells.slice(0, 12).map((w) => w.values[0]).join(',') === '8,10,12,14,16,18,20,22,24,26,28,30' && d.wells.filter((w) => w.c === 0).map((w) => w.values[1]).join(',') === '6.6,6.8,7,7.2,7.4,7.6,7.8,8');
  [3648, 585.870849, 374.129151, 480].forEach((t, k) => near(`cxs: plate total for ${d.stocks[k].label} vs NumPy`, d.totals[k], t, 1e-5));
  near('cxs: plate water total', d.water, 4512, 1e-6);
  check('cxs: nothing over-full in the example', d.over.length === 0);
  // By hand: pH 8.0 from 6.5 and 8.5 stocks with pKa 7.5: base fractions 0.0909, 0.9091 and 0.7597, so x = 0.8175.
  near('cxs: high-pH fraction for pH 8.0 by hand', highFraction(8, 6.5, 8.5, 7.5), (1 / (1 + 10 ** -0.5) - 1 / 11) / (10 / 11 - 1 / 11), 1e-12);
  near('cxs: the mix gives back the target pH', mixPH(highFraction(7.23, 6.5, 8.5, 7.5), 6.5, 8.5, 7.5), 7.23, 1e-9);
  near('cxs: half and half of pKa ± 1 stocks is the pKa', mixPH(0.5, 6.5, 8.5, 7.5), 7.5, 1e-12);
  near('cxs: base fraction at the pKa is one half', baseFraction(7.5, 7.5), 0.5, 1e-15);
  near('cxs: straight-line mix', highFraction(7, 6.5, 8.5, 7.5, 'lin'), 0.25, 1e-12);
  { const l = design(EXAMPLE.map((f) => (f.kind === 'ph' ? { ...f, mix: 'lin' } : f)), { size: 96, volume: 100 }); near('cxs: straight-line totals vs NumPy', l.totals[1], 576, 1e-6); near('cxs: straight-line totals vs NumPy (high)', l.totals[2], 384, 1e-6); }

  // 24-well plate, 500 µL, volumes rounded to 0.5 µL.
  const d24 = design(EXAMPLE, { size: 24, volume: 500, round: 0.5 });
  check('cxs: 24-well A1 rounded to 0.5 µL (NumPy)', d24.wells[0].vols.join(',') === '80,48.5,1.5,25' && d24.wells[0].water === 345);
  check('cxs: 24-well D6 rounded (NumPy)', d24.wells[23].vols.join(',') === '300,9,41,25' && d24.wells[23].water === 125);
  check('cxs: 24-well totals (NumPy)', d24.totals.join(',') === '4560,723,477,600' && d24.water === 5640);
  check('cxs: 24-well levels', d24.wells.slice(0, 6).map((w) => w.values[0]).join(',') === '8,12.4,16.8,21.2,25.6,30');

  // Log spacing against numpy.geomspace.
  const lg = levels(0.05, 2, 12, 'log');
  near('cxs: log level 2 vs geomspace', lg[1], 0.069921675, 1e-9);
  near('cxs: log level 10 vs geomspace', lg[9], 1.022695537, 1e-9);
  check('cxs: log ends exact', lg[0] === 0.05 && lg[11] === 2);
  { const g = design([{ kind: 'conc', name: 'Salt', unit: 'M', stock: 5, from: 0.05, to: 2, dir: 'col', spacing: 'log' }, { kind: 'conc', name: 'MPD', unit: '%', stock: 100, from: 10, to: 45, dir: 'row' }], { size: 96, volume: 80 }); near('cxs: log screen salt total (NumPy)', g.totals[0], 882.453357, 1e-5); near('cxs: log screen water (NumPy)', g.water, 4685.546643, 1e-5); }
  check('cxs: one level', levels(3, 9, 1).join() === '3');

  // Warnings: over-full wells and volumes too small to pipette.
  { const o = design([{ kind: 'conc', name: 'PEG', unit: '%', stock: 40, from: 10, to: 38, dir: 'col' }, { kind: 'conc', name: 'Salt', unit: 'M', stock: 2, from: 0.1, to: 0.4, dir: 'row' }], { size: 24, volume: 100 });
    check('cxs: over-full wells found', o.over.join() === 'B6,C6,D5,D6' && o.wells[23].water < 0); }
  check('cxs: small volumes flagged', design(EXAMPLE, { size: 96, volume: 100, minPip: 1 }).small.length === 24);

  // Bad input.
  const e = (f) => factorErrors(f, 0).join(' ');
  check('cxs: weak stock', e({ ...EXAMPLE[0], stock: 20 }).includes('weaker than the highest'));
  check('cxs: pH outside the stocks', e({ ...EXAMPLE[1], to: 9 }).includes('outside the two stocks'));
  check('cxs: stocks in the wrong order', e({ ...EXAMPLE[1], pHlo: 9 }).includes('higher pH'));
  check('cxs: log with 0', e({ ...EXAMPLE[0], from: 0, spacing: 'log' }).includes('above 0'));
  check('cxs: missing number', e({ ...EXAMPLE[0], stock: NaN }).includes('fill in every number'));
  check('cxs: buffer above stock', e({ ...EXAMPLE[1], final: 2 }).includes('above the stock'));
  check('cxs: good factors pass', EXAMPLE.every((f, i) => factorErrors(f, i).length === 0));
  let threw = ''; try { design([], { size: 96, volume: 100 }); } catch (x) { threw = x.message; }
  check('cxs: no factors', threw.includes('at least one factor'));
  check('cxs: stocks of a pH factor', stocksOf([EXAMPLE[1]]).length === 2);
  near('cxs: 10 % spare', withSpare(3648, 10), 4012.8, 1e-9);
  near('cxs: 1 + 1 drop is half strength', dropFactor(1, 1), 0.5, 1e-15);
};
