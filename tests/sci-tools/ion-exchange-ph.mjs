// #184 ion exchange and IEF pH picker. Expected values come from pyteomics.electrochem (charge and pI with the same
// pKa values typed in) and an independent NumPy scan for the best separation pH, run on the page's example proteins.
import { pickBuffers, separation, iefSpots, iefGaps, binding, phGrid, EXAMPLE } from '../../src/lib/sci/ionexchange.ts';
import { readProtein } from '../../src/lib/sci/protparam.ts';

export default async (check) => {
  const near = (name, got, want, tol) => check(`${name} (got ${got}, want ${want})`, Math.abs(got - want) <= tol);
  const ps = readProtein(EXAMPLE);
  check('iex: example has three made-up proteins', ps.length === 3 && ps[0].seq.length === 96 && ps[1].seq.length === 88 && ps[2].seq.length === 80);
  const want = [
    { pI: 4.1542202909, a: 5.2, c: 3.2, zA: -6.9720312537, zC: 8.0692098502 },
    { pI: 6.9098239834, a: 7.9, c: 5.9, zA: -2.3916447842, zC: 3.4297913001 },
    { pI: 10.4249977716, a: 11.4, c: 9.4, zA: -3.9768895965, zC: 4.7020587997 },
  ];
  ps.forEach((p, i) => {
    const b = pickBuffers(p.seq), w = want[i];
    near(`iex: pI of example ${i + 1} vs pyteomics`, b.pI, w.pI, 1e-6);
    check(`iex: buffer pH of example ${i + 1}`, b.anionPH === w.a && b.cationPH === w.c);
    near(`iex: charge at anion pH, example ${i + 1}`, b.zAnion, w.zA, 1e-9);
    near(`iex: charge at cation pH, example ${i + 1}`, b.zCation, w.zC, 1e-9);
  });
  // Another pKa set (the Lehninger values pyteomics ships) typed in: pI 4.057156 in pyteomics.
  const leh = { nTerm: 9.69, cTerm: 2.34, D: 3.65, E: 4.25, H: 6.0, C: 8.18, Y: 10.07, K: 10.53, R: 12.48, U: 5.5 };
  near('iex: pI with another pKa set vs pyteomics', pickBuffers(ps[0].seq, leh).pI, 4.0571555798, 1e-6);
  { const b = pickBuffers(ps[1].seq, undefined, 0.5); check('iex: half a unit from the pI', b.anionPH === 7.4 && b.cationPH === 6.4); }

  const seqs = ps.map((p) => p.seq);
  const an = separation(seqs, 'anion', 4, 9), ca = separation(seqs, 'cation', 4, 9);
  check('iex: anion best pH 9.0, range 8.85 to 9.0 (NumPy scan)', an.best.pH === 9 && an.range[0] === 8.85 && an.range[1] === 9);
  near('iex: anion best charge difference', an.best.score, 6.585071120120816, 1e-9);
  check('iex: anion hardest pair is neutral and basic', an.best.pair[0] === 1 && an.best.pair[1] === 2);
  check('iex: cation best pH 4.3, range 4.05 to 4.45 (NumPy scan)', ca.best.pH === 4.3 && ca.range[0] === 4.05 && ca.range[1] === 4.45);
  near('iex: cation best charge difference', ca.best.score, 8.782937112553755, 1e-9);
  check('iex: one protein gives no separation', separation([seqs[0]], 'anion').best === null);
  check('iex: nothing binds gives no separation', separation([seqs[2], seqs[2]], 'anion', 4, 6).best === null);
  check('iex: binding charge sign', binding(-3, 'anion') === 3 && binding(-3, 'cation') === 0 && binding(2, 'cation') === 2 && binding(2, 'anion') === 0);
  check('iex: pH grid', phGrid(4, 9).length === 101 && phGrid(4, 9)[100] === 9 && phGrid(4, 9)[7] === 4.35);

  // IEF by hand: pI 6.9098 on pH 3 to 11 over 70 mm stops 3.9098 / 8 × 70 = 34.211 mm from the + end.
  const sp = iefSpots(want.map((w) => w.pI), 3, 11, 70);
  near('iex: IEF spot of the neutral example', sp[1].mm, 34.2109598548, 1e-6);
  near('iex: IEF spot of the acidic example', sp[0].mm, (1.1542202909 / 8) * 70, 1e-6);
  const off = iefSpots([2.5, 12], 3, 10, 70);
  check('iex: IEF off the ends', off[0].side === 'acid' && off[0].mm === null && off[1].side === 'base');
  const g = iefGaps(iefSpots([6, 4, 9], 3, 10, 70));
  check('iex: IEF gaps in strip order', g.length === 2 && g[0].a === 1 && g[0].b === 0 && Math.abs(g[0].mm - 20) < 1e-9 && Math.abs(g[1].mm - 30) < 1e-9);
};
