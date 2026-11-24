// #624 PCB trace width and impedance. IPC-2221 fit checked by inverting it; impedances checked against an
// independent 2-D finite-volume Laplace solve in SciPy (two grids, Richardson; shielded box, so open microstrip
// reads a little low) and the exact conformal-mapping stripline Z0 = η0/(4√εr) K(k)/K(k'), k = sech(πW/2b).
import * as P from '../../src/lib/sci/eng-pcb.ts';
export default async (check) => {
  const rel = (a, b, t) => Math.abs(a / b - 1) <= t;
  check('pcb: IPC-2221 1 A, 10 °C, 1 oz outer ≈ 11.9 mil', rel(P.ipcWidth(1, 10, P.OZ, false) / P.MIL, 11.8976, 1e-4));
  check('pcb: inner layers need (2)^(1/0.725) = 2.6 × the area', rel(P.ipcArea(1, 10, true) / P.ipcArea(1, 10, false), 2 ** (1 / 0.725), 1e-12));
  check('pcb: current from area inverts width', rel(P.ipcCurrent(P.ipcArea(3.2, 20, false), 20, false), 3.2, 1e-12));
  check('pcb: copper resistance 1 m of 1 mm × 35 µm', rel(P.traceR(1e-3, 35e-6, 1), 1.724e-8 / 35e-9, 1e-12) && rel(P.traceR(1e-3, 35e-6, 1, 70) / P.traceR(1e-3, 35e-6, 1, 20), 1 + 0.00393 * 50, 1e-12));
  const fd = [['ms', 2, 0, 4.4, 48.407, 3.3192], ['ms', 0.5, 0, 10, 65.708, 6.362], ['ms', 1, 0, 1, 125.534, 1], ['ms', 2, 0.05, 4.4, 47.623, 3.2753], ['ms', 4, 0.1, 3.5, 33.042, 2.8269]];
  for (const [k, w, t, er, z, ee] of fd) { const r = P.microstrip(w, 1, t, er); check(`pcb: microstrip W/h ${w}, t/h ${t}, εr ${er} vs finite-volume (Z0 ${r.z0.toFixed(2)} vs ${z})`, rel(r.z0, z, 0.012) && rel(r.eeff, ee, 0.012) && r.z0 > z); }
  const sl = [[0.5, 0, 4, 50.21622539252666], [1, 0, 4, 32.6768125728855], [0.5, 0.1, 4, 41.67]];
  for (const [w, t, er, z] of sl) { const r = P.stripline(w, 1, t, er); check(`pcb: stripline W/b ${w}, t/b ${t} vs ${t ? 'finite-volume' : 'exact elliptic'} (Z0 ${r.z0.toFixed(2)} vs ${z.toFixed(2)})`, rel(r.z0, z, 0.006)); }
  check('pcb: thicker copper lowers Z0', P.microstrip(1, 1, 0.05, 4.4).z0 < P.microstrip(1, 1, 0, 4.4).z0 && P.stripline(0.5, 1, 0.05, 4).z0 < P.stripline(0.5, 1, 0, 4).z0);
  { const w = P.widthFor(50, (x) => P.microstrip(x, 1.6e-3, 35e-6, 4.4).z0, 1e-5, 0.1); check('pcb: 50 Ω on 1.6 mm FR-4 ≈ 3 mm wide', rel(P.microstrip(w, 1.6e-3, 35e-6, 4.4).z0, 50, 1e-9) && w > 2.9e-3 && w < 3.1e-3); }
  { const p = P.perLength(50, 4); check('pcb: delay, L and C per metre', rel(p.delay, 2 / 299792458, 1e-12) && rel(p.L, 50 * p.delay, 1e-12) && rel(Math.sqrt(p.L / p.C), 50, 1e-12)); }
  check('pcb: no width when the target is out of reach', Number.isNaN(P.widthFor(500, (x) => P.microstrip(x, 1e-3, 0, 4.4).z0, 1e-5, 0.1)));
  // The FR-4 patch antenna of Aslan et al. (2026), Electronics 15: 5054 (doi:10.3390/electronics15215054, CC BY 4.0):
  // 36 mm patch on 1.6 mm FR-4, εr 4.4, 1 oz copper; the paper's own εeff is 4.07 and its patch mode 2.40 GHz.
  const pa = P.microstrip(36e-3, 1.6e-3, P.OZ, 4.4);
  check('pcb: the paper\'s 36 mm patch gives εeff 4.0724 and Z0 7.187 Ω', Math.abs(pa.eeff - 4.0724) < 5e-5 && Math.abs(pa.z0 - 7.1867) < 5e-4);
  const wp = P.widthFor(50, (x) => P.microstrip(x, 1.6e-3, P.OZ, 4.4).z0, 1e-5, 0.02);
  check('pcb: 50 Ω on that board is 3.017 mm wide with εeff 3.303', Math.abs(wp * 1000 - 3.0171) < 5e-4 && Math.abs(P.microstrip(wp, 1.6e-3, P.OZ, 4.4).eeff - 3.3026) < 5e-5);
  const fPatch = 299792458 / (2 * (29.5e-3 + 2 * 0.74e-3) * Math.sqrt(pa.eeff));
  check('pcb: 29.5 mm plus the paper\'s edge extension resonates at 2.3976 GHz', Math.abs(fPatch / 1e9 - 2.3976) < 5e-5);
};
