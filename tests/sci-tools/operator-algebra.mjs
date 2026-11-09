// #929 operator algebra: angular momentum, Pauli, two-spin and oscillator matrices and the expression reader,
// against NumPy (numpy.linalg.eigvals, eigvalsh, det) and the textbook commutation relations.
import * as O from '../../src/lib/sci/phops.ts';
import { cmdiff, cmscale, ceye } from '../../src/lib/sci/phq.ts';

export default async (check) => {
  const near = (a, b, t = 1e-12) => Math.abs(a - b) <= t;
  const ev = (src, ops) => O.evaluate(src, ops);
  for (const j of [0.5, 1, 1.5, 2, 3.5]) {
    const s = O.operators({ kind: 'spin', j });
    const ok = cmdiff(ev('[Jx, Jy]', s).v, cmscale(s.Jz, [0, 1])) < 1e-12 && cmdiff(ev('[Jy, Jz]', s).v, cmscale(s.Jx, [0, 1])) < 1e-12 && cmdiff(ev('[Jz, Jx]', s).v, cmscale(s.Jy, [0, 1])) < 1e-12 && cmdiff(s.J2, cmscale(ceye(2 * j + 1), [j * (j + 1), 0])) < 1e-12 && cmdiff(ev('[Jz, Jp]', s).v, s.Jp) < 1e-12;
    check(`ops: spin ${j}: [Jx,Jy] = iJz (cyclic), J² = j(j+1), [Jz,J+] = J+`, ok);
  }
  const s = O.operators({ kind: 'spin', j: 1.5 });
  { const a = O.analyse(ev('[Jx, Jy]', s).v, s); check('ops: [Jx,Jy] recognised as i × Jz, anti-Hermitian, det 0.5625 (NumPy)', a.antiHermitian && !a.hermitian && a.multipleOf.some((m) => m.name === 'Jz' && near(m.c[1], 1) && near(m.c[0], 0)) && near(a.det[0], 0.5625)); }
  { const a = O.analyse(s.Jx, s); check('ops: Jx eigenvalues −3/2 … 3/2', a.eigen.values.map((z) => z[0]).every((x, i) => near(x, -1.5 + i))); }
  { const a = O.analyse(ev('Jx + i*Jz^2', s).v, s), ref = [[-1.2071067811865468, 0.5428932188134521], [-0.20710678118654752, 1.957106781186548], [0.2071067811865474, 1.9571067811865488], [1.2071067811865455, 0.5428932188134512]];
    check('ops: non-Hermitian eigenvalues match numpy.linalg.eigvals', ref.every(([r, i], k) => near(a.eigen.values[k][0], r, 1e-10) && near(a.eigen.values[k][1], i, 1e-10)) && near(a.det[0], 6.78515625, 1e-10)); }
  check('ops: tr(Jz²) = 5 for j = 3/2', near(ev('tr(Jz^2)', s).v[0], 5));
  const p = O.operators({ kind: 'spin', j: 0.5 });
  { const a = O.analyse(ev('{X, Y}', p).v, p); check('ops: Pauli anticommutator {X,Y} = 0', a.zero); }
  { const a = O.analyse(ev('{X, X}', p).v, p); check('ops: {X,X} = 2I', a.identityMultiple && near(a.identityMultiple[0], 2)); }
  { const a = O.analyse(ev('X*Y', p).v, p); check('ops: XY = iZ, unitary', a.unitary && a.multipleOf.some((m) => m.name === 'Z' && near(m.c[1], 1))); }
  check('ops: Jz = Z/2 for spin ½', cmdiff(p.Jz, cmscale(p.Z, [0.5, 0])) < 1e-15);
  { const t = O.operators({ kind: 'two' }); const a = O.analyse(t.S2, t); check('ops: two spins ½: S² eigenvalues 0 (×1) and 2 (×3)', a.eigen.grouped.length === 2 && near(a.eigen.grouped[0].v[0], 0) && a.eigen.grouped[0].mult === 1 && near(a.eigen.grouped[1].v[0], 2) && a.eigen.grouped[1].mult === 3);
    check('ops: SWAP squared is the identity', cmdiff(ev('SWAP^2', t).v, ceye(4)) < 1e-14); }
  { const o = O.operators({ kind: 'osc', N: 6 }); const c = ev('[x, p]', o).v;
    check('ops: truncated oscillator [x,p] = i except −5i in the last place (NumPy)', [0, 1, 2, 3, 4].every((k) => near(c[k][k][1], 1) && near(c[k][k][0], 0)) && near(c[5][5][1], -5));
    check('ops: [a, a†] = 1 except the last entry', near(ev('[a, ad]', o).v[0][0][0], 1) && near(ev('[a, ad]', o).v[5][5][0], -5));
    const a = O.analyse(o.x, o); check('ops: eigenvalues of truncated x match NumPy (±0.43608, ±1.33585, ±2.35060)', [-2.3506049736744914, -1.335849074013697, -0.4360774119276163, 0.43607741192761684, 1.3358490740136972, 2.3506049736744905].every((x, k) => near(a.eigen.values[k][0], x, 1e-12)));
    check('ops: H = a†a + ½ and ad = a\'', cmdiff(ev("ad*a + 1/2", o).v, o.H) < 1e-14 && cmdiff(ev("a'", o).v, o.ad) < 1e-14); }
  const bad = (src, ops) => { try { ev(src, ops); return ''; } catch (e) { return e.message; } };
  check('ops: unknown operator listed', bad('Q', s).includes('"Q" is not an operator') && bad('Q', s).includes('Jx'));
  check('ops: unclosed commutator reported', bad('[Jx, Jy', s).includes('Expected "]"'));
  check('ops: matrix division refused', bad('Jx / Jy', s).includes('only divide by a number'));
  check('ops: scalar results', near(ev('2*3 - i*i', s).v[0], 7) && near(ev('sqrt(-4)', s).v[1], 2));
};
