// #837 Tanabe–Sugano: the determinant calculation checked against an independent NumPy build (complex Y_lm basis,
// all determinants of every Ms, sympy Wigner 3j, numpy.linalg.eigh): every level of d2–d8 at Δ/B = 0, 7.3, 25, 33
// agreed to 3e-13 B; the lowest ten (energy, degeneracy, spin) at 7.3 and 25 are kept below. Also: textbook
// free-ion term energies in B and C, the d3/d8 closed forms for the T1 bands, spin crossovers (NumPy bisection).
import { levels, levelsByCharacters, freeIonTerms, diagram, readAt, fitTwoBands, realIntegrals, threeJ, GROUP } from '../../src/lib/sci/tanabe.ts';

const PY = {"2":{"25":[[0,9,1],[15.537760381,3,0],[15.784070314,2,0],[23.027756377,9,1],[33.322933061,1,0],[36.055512755,9,1],[40.517752374,3,0],[44.027756377,3,0],[48.027756377,3,1],[65.271442441,2,0]],"7.3":[[0,9,1],[6.27040019,9,1],[13.57040019,3,1],[15.438253246,3,0],[16.138886578,2,0],[20.240800379,9,1],[24.802547133,3,0],[27.091690563,1,0],[27.27040019,3,0],[31.401913801,2,0]]},"3":{"25":[[0,4,1.5],[20.882698567,4,0.5],[21.766095608,6,0.5],[25,12,1.5],[31.455884872,6,0.5],[35,12,1.5],[42.5,2,0.5],[45.67997609,6,0.5],[46.262282211,6,0.5],[48.712417706,4,0.5]],"7.3":[[0,4,1.5],[7.3,12,1.5],[12.39009076,12,1.5],[19.958508202,4,0.5],[20.783684527,6,0.5],[24.50990924,12,1.5],[24.8,2,0.5],[25.578134335,6,0.5],[27.980842737,6,0.5],[28.652964215,6,0.5]]},"4":{"25":[[0,10,2],[1.725717871,9,1],[14.206346056,3,0],[15.590645995,2,0],[23.023708299,6,1],[24.215675693,9,1],[25,15,2],[25.280312276,9,1],[26.270947677,1,0],[27,3,1]],"7.3":[[0,10,2],[7.3,15,2],[17.8830617,9,1],[22.708870032,6,1],[24.170090393,9,1],[24.649625734,9,1],[26.412226375,3,1],[27,3,1],[29.38768065,3,0],[29.85018347,2,0]]},"5":{"25":[[0,6,2.5],[6.569051195,6,0.5],[11.217171551,12,1.5],[18.135723865,12,1.5],[26.75540571,2,0.5],[27.087858337,6,0.5],[29.357212921,6,0.5],[31.748906944,4,0.5],[32.5,12,1.5],[35.845355497,12,1.5]],"7.3":[[0,6,2.5],[28.015565555,12,1.5],[31.267699585,12,1.5],[32.5,12,1.5],[37.95651752,12,1.5],[39.358596493,6,0.5],[39.5,8,1.5],[42.418342157,12,1.5],[43.203547495,2,0.5],[43.426269325,6,0.5]]},"6":{"25":[[0,1,0],[11.790653646,15,2],[12.57377995,9,1],[18.580486713,9,1],[22.296236762,3,0],[34.485258379,3,0],[34.959550699,9,1],[36.36564005,9,1],[36.790653646,10,2],[39.098785838,6,1]],"7.3":[[0,15,2],[7.3,10,2],[17.250527615,9,1],[20.253848965,9,1],[21.817537717,1,0],[23.110371993,9,1],[25.123653502,9,1],[25.836476928,6,1],[26.591001636,9,1],[27.383884166,3,0]]},"7":{"25":[[0,4,0.5],[3.724403923,12,1.5],[22.069339027,6,0.5],[22.996281804,6,0.5],[26.7521603,12,1.5],[28.549396914,6,0.5],[39.779916677,12,1.5],[41.708665348,6,0.5],[44.2521603,2,0.5],[48.026088856,6,0.5]],"7.3":[[0,12,1.5],[6.27040019,12,1.5],[13.410939265,4,0.5],[13.57040019,4,1.5],[18.848208509,6,0.5],[19.095434066,6,0.5],[20.240800379,12,1.5],[23.74654198,6,0.5],[23.77040019,2,0.5],[26.899066314,6,0.5]]},"8":{"25":[[0,3,1],[16.765781535,2,0],[25,9,1],[29.822195572,1,0],[35,9,1],[41.546375953,3,0],[46,3,0],[55,9,1],[68.234218465,2,0],[68.453624047,3,0]],"7.3":[[0,3,1],[7.3,9,1],[12.39009076,9,1],[16.265364683,2,0],[23.044216061,3,0],[24.50990924,9,1],[25.450196336,1,0],[28.3,3,0],[33.334635317,2,0],[33.855783939,3,0]]}};

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const DIM = { A1: 1, A2: 1, E: 2, T1: 3, T2: 3 };
  check('ts: real-orbital Coulomb integrals come out real (phases right)', realIntegrals(2).imag < 1e-14 && realIntegrals(4).imag < 1e-14);
  check('ts: 3j symbols (2 2 2; 0 0 0) = −√(2/35), (2 4 2; 0 0 0) = √(2/35)', near(threeJ(2, 2, 2, 0, 0, 0), -Math.sqrt(2 / 35), 1e-15) && near(threeJ(2, 4, 2, 0, 0, 0), Math.sqrt(2 / 35), 1e-15));
  check('ts: 24 rotations in classes 1, 8, 3, 6, 6', GROUP.length === 24 && [0, 1, 2, 3, 4].map((c) => GROUP.filter((g) => g.cls === c).length).join() === '1,8,3,6,6');
  // Against NumPy: lowest ten distinct levels with total degeneracy (2S+1)·dim and spin.
  let ok = true, bad = '';
  for (const n of Object.keys(PY)) for (const x of Object.keys(PY[n])) {
    const L = levels(+n, +x, 4.5), e0 = L[0].E;
    const groups = [];
    for (const l of L) { const g = groups.find((q) => near(q[0], l.E - e0, 1e-7) && q[2] === l.S); if (g) g[1] += l.mult * DIM[l.irrep]; else groups.push([l.E - e0, l.mult * DIM[l.irrep], l.S]); }
    groups.sort((a, b) => a[0] - b[0] || b[2] - a[2]);
    PY[n][x].forEach((p, i) => { const g = groups[i]; if (!g || !near(g[0], p[0], 1e-8) || g[1] !== p[1] || g[2] !== p[2]) { ok = false; bad = `d${n} x=${x} level ${i}: ${g} vs ${p}`; } });
  }
  check(`ts: levels, degeneracies and spins match NumPy for d2–d8 ${bad}`, ok);
  // Two ways of naming: symmetry-blocked matrices vs characters of the full spin space.
  let same = true;
  for (let n = 2; n <= 8; n++) for (const x of [0, 3.1, 19, 37]) { const a = levels(n, x, 4.2), b = levelsByCharacters(n, x, 4.2); if (a.length !== b.length || !a.every((l) => b.some((m) => m.mult === l.mult && m.irrep === l.irrep && m.k === l.k && near(m.E, l.E, 1e-8)))) same = false; }
  check('ts: symmetry blocks and character analysis give the same named levels', same);
  // Free-ion terms (textbook, in B and C, relative to the ground term).
  const T = (n, g) => Object.fromEntries(freeIonTerms(n, g).map((t) => [t.name + (t.E > 40 && t.name === '2D' ? 'b' : ''), t.E]));
  for (const g of [4.5, 3.7]) {
    const d2 = T(2, g), d3 = T(3, g), r = Math.sqrt(193 + 8 * g + 4 * g * g);
    check(`ts: d2 free-ion terms, C/B = ${g}: ³P 15B, ¹D 5B+2C, ¹G 12B+2C, ¹S 22B+7C`, near(d2['3P'], 15, 1e-9) && near(d2['1D'], 5 + 2 * g, 1e-9) && near(d2['1G'], 12 + 2 * g, 1e-9) && near(d2['1S'], 22 + 7 * g, 1e-9));
    check(`ts: d3 free-ion terms, C/B = ${g}: ⁴P 15B, ²G 4B+3C, ²H = ²P 9B+3C, ²F 24B+3C, ²D 20B+5C ± √(193B²+8BC+4C²)`, near(d3['4P'], 15, 1e-9) && near(d3['2G'], 4 + 3 * g, 1e-9) && near(d3['2H'], 9 + 3 * g, 1e-9) && near(d3['2P'], 9 + 3 * g, 1e-9) && near(d3['2F'], 24 + 3 * g, 1e-9) && near(d3['2D'], 20 + 5 * g - r, 1e-9) && near(d3['2Db'], 20 + 5 * g + r, 1e-9));
  }
  { const d5 = Object.fromEntries(freeIonTerms(5, 4.5).filter((t) => t.mult === 4).map((t) => [t.name, t.E]));
    check('ts: d5 quartets: ⁴G 10B+5C, ⁴P 7B+7C, ⁴D 17B+5C, ⁴F 22B+7C above ⁶S', near(d5['4G'], 10 + 22.5, 1e-9) && near(d5['4P'], 7 + 31.5, 1e-9) && near(d5['4D'], 17 + 22.5, 1e-9) && near(d5['4F'], 22 + 31.5, 1e-9)); }
  check('ts: term counts d2 5, d3 8, d4 16, d5 16', [2, 3, 4, 5].map((n) => freeIonTerms(n, 4.5).length).join() === '5,8,16,16');
  // d3 and d8: T2 at Δ exactly; T1(F), T1(P) = 7.5B + 15Dq ∓ ½√(225B² + 100Dq² − 180B·Dq).
  let cf = true;
  for (const n of [3, 8]) for (const x of [2, 10, 23.7, 40]) {
    const m = n === 3 ? 4 : 3, L = readAt(n, x, 4.5), Dq = x / 10, s = Math.sqrt(225 + 100 * Dq * Dq - 180 * Dq);
    const get = (ir, k) => L.find((l) => l.mult === m && l.irrep === ir && l.k === k).E;
    if (!(L[0].irrep === 'A2' && L[0].mult === m && near(get('T2', 1), x, 1e-9) && near(get('T1', 1), 7.5 + 15 * Dq - s / 2, 1e-9) && near(get('T1', 2), 7.5 + 15 * Dq + s / 2, 1e-9))) cf = false;
  }
  check('ts: d3 and d8 spin-allowed bands match the closed forms', cf);
  // d2: ³T1(F) ground; ³T2 and ³A2 from it (Δ/B = 10): ³T2 − ³T1 = ½(Δ − 15B + √(225B² + 18BΔ + Δ²)) ... check via 3A2 − 3T2 = Δ.
  { const L = readAt(2, 10, 4.5), g = (ir) => L.find((l) => l.mult === 3 && l.irrep === ir).E; check('ts: d2 ground ³T1g(F) and ³A2g − ³T2g = Δ', L[0].irrep === 'T1' && L[0].mult === 3 && near(g('A2') - g('T2'), 10, 1e-9)); }
  // Spin crossovers: NumPy bisection on the ground-state spin at C/B = 4.5.
  const cr = { 4: 26.803573565305214, 5: 28.40681596737113, 6: 18.898126617614253, 7: 21.209565828294217 };
  const gs = { 4: ['5E#1', '3T1#1'], 5: ['6A1#1', '2T2#1'], 6: ['5T2#1', '1A1#1'], 7: ['4T1#1', '2E#1'] };
  for (const n of [4, 5, 6, 7]) { const D = diagram(n, 4.5, 40, 100); check(`ts: d${n} spin crossover at Δ/B = ${cr[n].toFixed(3)} (NumPy), ${gs[n].join(' → ')}`, D.crossings.length === 1 && near(D.crossings[0], cr[n], 1e-7) && D.ground.join() === gs[n].join()); }
  check('ts: d2, d3, d8 never change ground state', [2, 3, 8].every((n) => diagram(n, 4.5, 60, 60).crossings.length === 0));
  { const D = diagram(5, 4.5, 40, 100), c = D.curves.find((q) => q.key === '6A1#1' && q.seg === 0); check('ts: diagram zero is the ground state; the jump is a clean break', c && c.y.every((y) => near(y, 0, 1e-9)) && near(c.x[c.x.length - 1], cr[5], 1e-7) && D.curves.some((q) => q.key === '6A1#1' && q.seg === 1 && near(q.y[0], 0, 1e-6) && q.y[q.y.length - 1] > 5)); }
  // Fit: d3 closed form B = (2ν1² + ν2² − 3ν1ν2)/(15ν2 − 27ν1).
  for (const [n, a, b] of [[3, 17000, 24000], [8, 8500, 13800], [3, 21600, 28500], [8, 10750, 17500]]) {
    const f = fitTwoBands(n, a, b, 4.5), B = (2 * a * a + b * b - 3 * a * b) / (15 * b - 27 * a);
    check(`ts: d${n} fit of ${a}, ${b} gives the closed-form B`, near(f.B, B, 1e-6 * B) && near(f.Delta, a, 1e-6) && near(f.nu2, b, 1e-5));
  }
  let threw = false; try { fitTwoBands(3, 17000, 40000); } catch { threw = true; }
  check('ts: impossible band ratio is refused', threw);
};
