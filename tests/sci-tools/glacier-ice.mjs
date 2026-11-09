// #828 Glacier mass balance and ice flow. Checked 2026-11-09 against NumPy/SciPy: 600 random stake networks and
// band sets (np.polyfit / scipy interp1d with extrapolation, band means by quad, ELA by brentq on the highest upward
// crossing, AAR by dense sampling): B within 1e-12, ELA within 5e-12 m, AAR within 4e-5 (sampling). 200 random slabs:
// τb and the velocity profile against quad of du/dz = 2A τ(z)ⁿ (1.4e-15 relative). 200 Stefan cases against
// solve_ivp of the quasi-steady Stefan problem with a half-sine surface temperature (9e-13 relative).
import { pointBalance, fitLine, profileFn, meanOver, massBalance, findEla, flow, velocityAt, basalStress, stefanDepth, thawIndex, EX_STAKES, EX_BANDS } from '../../src/lib/sci/glacier.ts';
import { parseTable, num } from '../../src/lib/sci/num.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('glacier: point balance from height change and density', near(pointBalance(-3.6, 900), -3.24) && near(pointBalance(1.6, 520), 0.832));
  const st = parseTable(EX_STAKES).slice(1).map((r) => ({ name: r[0], z: num(r[1]), b: pointBalance(num(r[2]), num(r[3])) }));
  const bands = parseTable(EX_BANDS).slice(1).map((r) => ({ lo: num(r[0]), hi: num(r[1]), area: num(r[2]) }));
  const j = massBalance(st, bands, 'join'), l = massBalance(st, bands, 'linear');
  check('glacier: example, stakes joined (numpy/scipy: B −0.73207, ELA 2980.45 m, AAR 0.34010)', near(j.B, -0.7320739962667, 1e-9) && near(j.ela, 2980.4477611940297, 1e-9) && near(j.aar, 0.340100649490301, 1e-9) && near(j.area, 6.94));
  check('glacier: example, straight line (numpy: B −0.80925, ELA 3029.94 m, gradient 0.0056514)', near(l.B, -0.8092495071351, 1e-9) && near(l.ela, 3029.9367894992506, 1e-9) && near(l.grad, 0.005651449167355, 1e-9) && near(l.r2, 0.9778347626335, 1e-9));
  check('glacier: straight-line band balance is the value at mid-band', l.bands.every((b) => near(b.b, l.prof((b.lo + b.hi) / 2), 1e-12)));
  check('glacier: band volumes add up to the glacier volume', near(j.bands.reduce((s, b) => s + b.vol, 0), j.volume, 1e-12));
  const f = fitLine([{ z: 0, b: 1 }, { z: 10, b: 3 }, { z: 20, b: 5 }]);
  check('glacier: exact line fit', near(f.a, 1) && near(f.g, 0.2) && near(f.r2, 1));
  const p = profileFn([{ z: 100, b: -2 }, { z: 200, b: 0 }, { z: 200, b: 2 }, { z: 300, b: 3 }], 'join');
  check('glacier: joined profile averages repeats and extrapolates the end lines', near(p(200), 1) && near(p(50), -3.5) && near(p(400), 5) && near(p(250), 2));
  check('glacier: band mean over a kink is exact', near(meanOver(p, 100, 300, [100, 200, 300]), (0.5 * (-2 + 1) * 100 + 0.5 * (1 + 3) * 100) / 200));
  check('glacier: ELA none when all negative / all positive', findEla((z) => -1, 0, 100).z === null && !findEla((z) => -1, 0, 100).allPositive && findEla((z) => 1, 0, 100).allPositive);
  const inv = massBalance([{ name: 'a', z: 100, b: 1 }, { name: 'b', z: 200, b: -1 }], [{ lo: 100, hi: 200, area: 1 }], 'linear');
  check('glacier: balance falling with height: no ELA, AAR from the positive part', inv.ela === null && near(inv.aar, 0.5) && inv.elaNote.includes('falls with height'));
  let threw = 0;
  for (const [s, b] of [[[st[0]], bands], [st, []], [st, [{ lo: 10, hi: 5, area: 1 }]], [st, [{ lo: 0, hi: 10, area: 1 }, { lo: 5, hi: 15, area: 1 }]], [st, [{ lo: 0, hi: 10, area: 0 }]], [[{ name: 'a', z: 5, b: 1 }, { name: 'b', z: 5, b: 2 }], bands]]) { try { massBalance(s, b, 'linear'); } catch { threw++; } }
  check('glacier: bad inputs are refused (1 stake, no bands, top below bottom, overlap, zero area, one elevation)', threw === 6);
  const P = { H: 200, slopeDeg: 3, rho: 917, g: 9.81, A: 2.4e-24, n: 3, f: 1, ub: 0 }, R = flow(P);
  check('glacier: basal shear stress 94.16 kPa (ρ g H sin α)', near(R.tau, 917 * 9.81 * 200 * Math.sin(Math.PI / 60), 1e-12) && near(R.tau, 94160.44501831736, 1e-12));
  check('glacier: surface speed 2A/(n+1) τⁿ H (6.323 m/yr)', near(R.us, 6.322964099238786, 1e-12) && near(R.umean, 0.8 * R.us, 1e-12) && near(R.q, R.umean * 200, 1e-12));
  check('glacier: profile 0 at the bed, surface value at the top, sliding added', velocityAt(P, 0) === 0 && near(velocityAt(P, 200), R.us, 1e-12) && near(velocityAt({ ...P, ub: 5 }, 0), 5) && near(flow({ ...P, ub: 5 }).us, R.us + 5, 1e-12));
  check('glacier: n = 1 gives a parabolic profile (Newtonian)', (() => { const Q = { ...P, n: 1, A: 1e-14 }; const us = flow(Q).us; return near(velocityAt(Q, 100), us * 0.75, 1e-12) && near(flow(Q).umean, (2 / 3) * us, 1e-12); })());
  check('glacier: shape factor scales the stress', near(basalStress({ ...P, f: 0.6 }), 0.6 * R.tau, 1e-12));
  let ft = 0; for (const x of [{ H: 0 }, { slopeDeg: 0 }, { A: 0 }, { n: 7 }, { f: 1.5 }, { ub: -1 }]) { try { flow({ ...P, ...x }); } catch { ft++; } }
  check('glacier: bad flow inputs refused', ft === 6);
  check('glacier: Stefan depth 1.4395 m for 1000 °C·days, k 1.2, θ 0.3', near(stefanDepth({ I: 1000, nt: 1, k: 1.2, theta: 0.3 }), 1.439532228026489, 1e-12));
  check('glacier: Stefan depth grows with √I and √n', near(stefanDepth({ I: 4000, nt: 1, k: 1.2, theta: 0.3 }), 2 * 1.439532228026489, 1e-12) && near(stefanDepth({ I: 1000, nt: 4, k: 1.2, theta: 0.3 }), 2 * 1.439532228026489, 1e-12) && stefanDepth({ I: 0, nt: 1, k: 1, theta: 0.3 }) === 0);
  check('glacier: thawing index from monthly means (859 °C·days)', near(thawIndex([-28, -27, -23, -14, -3, 7, 11, 8, 2, -9, -20, -25]), 859));
  let st2 = 0; for (const x of [{ I: -1 }, { nt: 0 }, { k: 0 }, { theta: 0 }, { theta: 1.2 }]) { try { stefanDepth({ I: 1000, nt: 1, k: 1.2, theta: 0.3, ...x }); } catch { st2++; } }
  check('glacier: bad Stefan inputs refused', st2 === 5);
  check('glacier: thawing index needs 12 months', (() => { try { thawIndex([1, 2]); return false; } catch { return true; } })());
};
