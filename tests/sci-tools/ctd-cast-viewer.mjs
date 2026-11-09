// #208 CTD cast viewer. References: an independent NumPy script (scratch, numpy 2) that reads the made-up example
// cast with genfromtxt, turns pressure into depth (p·10⁴/(ρ₀g)), splits at argmax depth, bins with
// floor(z/size + ½) and group means, applies the linear equation of state, finds the threshold mixed layer by
// np.interp and the gradients and N² as lagged differences. Wider checks (scratch): 5 random casts (40 to 600 dbar,
// irregular sampling, depth or pressure headers, with and without oxygen, bins of 1 and 2 m, other EOS values):
// depths, bins, counts, density and N² agree to 1e-12, mixed layer depths to the 4e-5 m step of a brute-force
// search, thermocline depth and gradient exactly.
import * as C from '../../src/lib/sci/ctd.ts';

const R = {"down": {"nbins": 248, "first": [1.0, 17.9826, 34.60063333333334, 249.95000000000002, 0.29, 1025.0322543066666], "last": [248.0, 8.004266666666666, 35.199733333333334, 1027.5740245333334], "mldT": 20.187975646879725, "mldR": 16.314522885820377, "thz": 40.0, "thg": 0.3936562499999998, "pz": 39.0, "pn2": 0.0009351872999995873, "Tat10": 17.868775, "Fmaxz": 45.0, "Fmax": 2.5025000000000004, "Ominz": 157.0}, "up": {"nbins": 247, "first": [2.0, 17.99035, 34.60085, 250.03, 0.29, 1025.03084047], "last": [248.0, 8.011600000000001, 35.19945, 1027.5722854800001], "mldT": 20.92095588235293, "mldR": 16.825734254301103, "thz": 41.0, "thg": 0.39418750000000014, "pz": 40.0, "pn2": 0.000933004574999883, "Tat10": 17.88795, "Fmaxz": 46.0, "Fmax": 2.5005, "Ominz": 158.0}};
const near = (a, b, t) => Math.abs(a - b) <= t;
const argmax = (v) => v.reduce((b, x, i) => (x > v[b] ? i : b), 0);

export default async (check) => {
  const E = C.EOS_DEFAULT;
  check('ctd: linear EOS gives ρ₀ at T₀, S₀', C.density(E.T0, E.S0, E) === E.rho0);
  check('ctd: linear EOS by hand (T 20, S 36: 1027 × (1 − 0.002 + 0.0008) = 1025.7676)', near(C.density(20, 36, E), 1025.7676, 1e-9));
  check('ctd: 100 dbar is 100·10⁴/(1027·9.81) = 99.257 m', near(C.pressureToDepth(100, 1027), 99.2569, 1e-4));
  check('ctd: isopycnal line meets the EOS', [33, 35, 37].every((s) => near(C.density(C.isoT(1026, s, E), s, E), 1026, 1e-9)));

  const p = C.parseCast(C.exampleCast(), E.rho0);
  check('ctd: example read by header names (pressure, all five columns)', !p.error && p.zFrom === 'pressure' && p.hasO && p.hasF && p.cast.z.length === 1493 && !p.skipped.length);
  const s = C.splitCast(p.cast);
  check('ctd: split at the deepest scan', s.iMax === 996 && s.down.z.length === 997 && s.up.z.length === 497);
  for (const nm of ['down', 'up']) {
    const r = R[nm], b = C.binCast(s[nm], 1), rho = b.T.map((t, i) => C.density(t, b.S[i], E));
    check(`ctd ${nm}: 1 m bins as numpy group means`, b.z.length === r.nbins && b.z[0] === r.first[0] && near(b.T[0], r.first[1], 1e-12) && near(b.S[0], r.first[2], 1e-12) && near(b.O[0], r.first[3], 1e-10) && near(b.F[0], r.first[4], 1e-12) && near(rho[0], r.first[5], 1e-10) && b.z.at(-1) === r.last[0] && near(b.T.at(-1), r.last[1], 1e-12) && near(rho.at(-1), r.last[3], 1e-10));
    check(`ctd ${nm}: temperature at the 10 m reference`, near(C.interpAt(b.z, b.T, 10), r.Tat10, 1e-12));
    const mT = C.mixedLayer(b.z, b.T, 10, 0.2, 'abs'), mR = C.mixedLayer(b.z, rho, 10, 0.03, 'up');
    check(`ctd ${nm}: mixed layer depth (ΔT 0.2 °C, Δρ 0.03 kg/m³) as numpy`, mT.found && mR.found && near(mT.depth, r.mldT, 1e-9) && near(mR.depth, r.mldR, 1e-9));
    const th = C.thermocline(b.z, b.T, 4), N = C.buoyancy(b.z, rho, E.rho0, 4), pc = C.pycnocline(N.z, N.n2);
    check(`ctd ${nm}: thermocline (−dT/dz over 4 m) as numpy`, th.depth === r.thz && near(th.grad, r.thg, 1e-12));
    check(`ctd ${nm}: N² peak as numpy`, pc.depth === r.pz && near(pc.n2, r.pn2, 1e-15));
    check(`ctd ${nm}: fluorescence peak and oxygen low where they were drawn`, b.z[argmax(b.F)] === r.Fmaxz && near(Math.max(...b.F), r.Fmax, 1e-12) && b.z[argmax(b.O.map((x) => -x))] === r.Ominz);
  }

  // Hand-made profiles.
  const z = [0, 5, 10, 15, 20, 25, 30], T = [20, 20, 20, 19.9, 19.5, 18, 15];
  check('ctd: MLD by hand: 0.2 °C below 20 at 10 m is reached between 15 and 20 m at 16.25 m', near(C.mixedLayer(z, T, 10, 0.2, 'abs').depth, 16.25, 1e-12));
  check('ctd: a warmer layer below counts for the temperature test (either way)', near(C.mixedLayer(z, [20, 20, 20, 20, 21, 21, 21], 10, 0.2, 'abs').depth, 16, 1e-12));
  check('ctd: density test only counts an increase', !C.mixedLayer(z, [1025, 1025, 1025, 1024, 1023, 1022, 1021], 10, 0.03, 'up').found);
  check('ctd: no crossing: reports the bottom, found = false', (() => { const m = C.mixedLayer(z, z.map(() => 20), 10, 0.2, 'abs'); return !m.found && m.depth === 30; })());
  check('ctd: reference above the first level uses the first level', C.mixedLayer([12, 14, 16], [20, 20, 19], 10, 0.2, 'abs').refDepth === 12);
  check('ctd: thermocline by hand: fastest fall 3 °C over 5 m at 27.5 m', (() => { const t = C.thermocline(z, T, 1); return t.depth === 27.5 && near(t.grad, 0.6, 1e-12); })());
  check('ctd: N² by hand: 0.5 kg/m³ over 10 m with ρ₀ 1025 is 9.81·0.05/1025', near(C.buoyancy([0, 10], [1025, 1025.5], 1025).n2[0], (9.81 * 0.05) / 1025, 1e-15));
  check('ctd: bins of 2 m: scans at 0.9, 1.1, 2.9 go to 0 (½ m rule), 2 and 2', (() => { const b = C.binCast({ z: [0.9, 1.1, 2.9], T: [1, 2, 3], S: [1, 1, 1] }, 2); return b.z.join() === '0,2' && b.T.join() === '1,2.5' && b.n.join() === '1,2'; })());

  // Reading files.
  check('ctd: no header: depth-or-pressure, T, S order; depth kept as is', (() => { const q = C.parseCast('1 10 35\n2 9 35\n3 8 35.1', 1027, 'depth'); return !q.error && q.zFrom === 'depth' && q.cast.z.join() === '1,2,3' && !q.hasO; })());
  check('ctd: header with a depth column wins over pressure', (() => { const q = C.parseCast('Pressure,Depth,Temp,Sal\n5,4.97,10,35\n6,5.96,10,35\n7,6.95,9,35'); return q.zFrom === 'depth' && q.cast.z[0] === 4.97 && q.names.T === 'Temp'; })());
  check('ctd: bad rows skipped and listed', (() => { const q = C.parseCast('depth,temperature,salinity\n1,10,35\n2,x,35\n3,9,35\n4,8,35'); return q.skipped.join() === '2' && q.cast.z.length === 3; })());
  check('ctd: missing salinity column is a clear error', /salinity/.test(C.parseCast('depth,temperature,oxygen\n1,10,200\n2,9,200\n3,8,200').error ?? ''));
  check('ctd: empty paste is a clear error', /Paste a cast/.test(C.parseCast('  ').error ?? ''));
};
