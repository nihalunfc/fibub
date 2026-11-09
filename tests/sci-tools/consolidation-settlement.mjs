// #657 consolidation settlement and time. U(Tv) checked against the same series in numpy (200 000 terms) and an
// independent Crank–Nicolson finite-difference solution of Terzaghi's equation (scipy); T50, T90, T99 against
// scipy brentq; layered NC/OC settlement (with sublayers and a 2:1 footing spread) against an independent Python
// script on the same made-up profile.
import { Uavg, TvFor, isochrone, settle, spread21, timeFor, cvFromLab } from '../../src/lib/sci/consolidation.ts';
export default async (check) => {
  const P = {"ser": {"0.005": 0.0797884560802864, "0.02": 0.15957691216057313, "0.1": 0.3568234004524541, "0.197": 0.5003381228248266, "0.5": 0.7639503307438489, "0.848": 0.899978924187683, "1.5": 0.9799819293411827}, "fd": {"0.005": [0.07979662402045673, 0.9999993701568537], "0.02": [0.15958393374770807, 0.9875836965049426], "0.1": [0.356828019550508, 0.7356442801701444], "0.197": [0.5003401866106336, 0.5574999211417829], "0.5": [0.7639511226283819, 0.26218772813130353], "0.848": [0.8999793227266196, 0.11109518422262094], "1.5": [0.9799820330717353, 0.022234399504094976]}, "T50": 0.19673073952370498, "T90": 0.8480854080460255, "T99": 1.7812879938669115, "iso": 0.5531758918500855, "S1": [0.19531647599005447, [0, 0.09297919017348617, 0.1023372858165683]], "S5": [0.19476517702475882, [0, 0.092857976203041, 0.10190720082171784]], "Sf": [0.029009090628210586, [0, 0.022960866324788713, 0.0060482243034218714]]};
  let w = 0, wf = 0;
  for (const [T, u] of Object.entries(P.ser)) w = Math.max(w, Math.abs(Uavg(+T) - u));
  for (const [T, [u, mid]] of Object.entries(P.fd)) wf = Math.max(wf, Math.abs(Uavg(+T) - u), Math.abs(isochrone(0.5, +T) - mid));
  check(`consolidation-settlement: U(Tv) matches the numpy series (worst ${w.toExponential(1)})`, w < 1e-12);
  check(`consolidation-settlement: U(Tv) and mid-depth u/u0 match finite differences (worst ${wf.toExponential(1)})`, wf < 1e-4);
  check('consolidation-settlement: T50, T90, T99 match brentq', Math.abs(TvFor(0.5) - P.T50) < 1e-10 && Math.abs(TvFor(0.9) - P.T90) < 1e-10 && Math.abs(TvFor(0.99) - P.T99) < 1e-9);
  check('consolidation-settlement: T50 ≈ 0.197 and T90 ≈ 0.848', Math.abs(TvFor(0.5) - 0.197) < 0.0005 && Math.abs(TvFor(0.9) - 0.848) < 0.0005);
  check('consolidation-settlement: early-time U ≈ √(4Tv/π)', Math.abs(Uavg(0.005) - Math.sqrt(0.02 / Math.PI)) < 1e-9 && Uavg(0) === 0);
  check('consolidation-settlement: isochrone at Tv = 0.2', Math.abs(isochrone(0.5, 0.2) - P.iso) < 1e-12);
  const layers = [{ name: 'Sand', H: 2, gamma: 18, e0: 0.6, Cc: 0, Cr: 0, sp: 0 }, { name: 'Clay A', H: 3, gamma: 17.5, e0: 1.1, Cc: 0.45, Cr: 0.06, sp: 80 }, { name: 'Clay B', H: 4, gamma: 18.5, e0: 0.85, Cc: 0.3, Cr: 0.04, sp: 95 }];
  const near = (a, b) => Math.abs(a - b) < 1e-12;
  { const r = settle(layers, { kind: 'uniform', q: 60 }, 1.5); check('consolidation-settlement: layered settlement matches Python', near(r.S, P.S1[0]) && r.rows.every((x, i) => near(x.S, P.S1[1][i])) && r.compressibleH === 7); 
    check('consolidation-settlement: layer cases', r.rows[0].kind === 'none' && r.rows[1].kind === 'OC to NC' && r.rows[2].kind === 'OC to NC'); }
  { const r = settle(layers, { kind: 'uniform', q: 60 }, 1.5, 5); check('consolidation-settlement: five sublayers match Python', near(r.S, P.S5[0])); }
  { const r = settle(layers, { kind: 'footing', q: 150, B: 2, L: 3, Df: 1 }, 1.5); check('consolidation-settlement: 2:1 footing spread matches Python', near(r.S, P.Sf[0]) && r.rows.every((x, i) => near(x.S, P.Sf[1][i]))); }
  check('consolidation-settlement: 2:1 spread by hand', near(spread21(100, 2, 2, 2), 25) && near(spread21(100, 2, Infinity, 2), 50));
  check('consolidation-settlement: time and lab cv', near(timeFor(0.9, 3.5, 2.5), P.T90 * 12.25 / 2.5) && Math.abs(cvFromLab(0.5, 0.01, 1) - P.T50 * 1e-4) < 1e-15);
  { const r = settle([{ name: 'NC', H: 2, gamma: 18, e0: 1, Cc: 0.4, Cr: 0.05, sp: 0 }], { kind: 'uniform', q: 18 }, 10);
    check('consolidation-settlement: NC layer by hand (s0 = 18, Δσ = 18)', near(r.S, 0.4 * 2 / 2 * Math.log10(2)) && r.rows[0].kind === 'NC'); }
  let threw = false; try { settle([{ name: 'x', H: 0, gamma: 18, e0: 1, Cc: 0.3, Cr: 0.03, sp: 0 }], { kind: 'uniform', q: 10 }, 0); } catch { threw = true; }
  check('consolidation-settlement: zero thickness refused', threw);
};
