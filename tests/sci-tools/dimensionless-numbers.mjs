// #956 dimensionless numbers: values checked against an independent NumPy script (scipy.constants g, k, N_A).
import { dimensionless, meanFreePath, FLUIDS } from '../../src/lib/sci/phdimless.ts';
export default async (check) => {
  const near = (a, b, r = 1e-9) => Math.abs(a / b - 1) < r;
  const w = FLUIDS.find((f) => f.id === 'water');
  const n = Object.fromEntries(dimensionless({ ...w, U: 1, L: 0.05, geometry: 'pipe', dT: 10, f: 4 }).map((x) => [x.id, x]));
  const exp = { re: 49900, ma: 0.000675675676, fr: 1.42808698123, we: 685.43956044, ca: 0.0137362637, bo: 336.093293269, oh: 0.000524667348, pr: 6.98996655518, pe: 348799.331104, gr: 2563958.93948, ra: 17921987.2358, ri: 0.00102969825, st: 0.2 };
  for (const [k, v] of Object.entries(exp)) check(`dimless: ${k} = ${v} (NumPy)`, near(n[k].value, v, 1e-8));
  check('dimless: pipe Re 49900 is turbulent; St 0.2 is vortex shedding', n.re.note.startsWith('turbulent pipe') && n.st.note.startsWith('near 0.2'));
  check('dimless: air mean free path 64.94 nm at 20 °C, 1 atm (NumPy)', near(meanFreePath(1.81e-5, 101325, 293.15, 0.02897), 6.4939613e-8, 1e-7));
  const a = FLUIDS.find((f) => f.id === 'air');
  const m = Object.fromEntries(dimensionless({ ...a, U: 0.01, L: 1e-6, geometry: 'other', p: 101325, T: 293.15 }).map((x) => [x.id, x]));
  check('dimless: Kn for a 1 µm gap in air 0.0649, slip flow; no surface-tension numbers for a gas', near(m.kn.value, 0.06493961, 1e-6) && m.kn.note.startsWith('slip') && !m.we);
  const lam = dimensionless({ ...w, U: 0.01, L: 0.05, geometry: 'pipe' })[0];
  check('dimless: Re 499 in a pipe is laminar', lam.note.startsWith('laminar'));
  const ch = dimensionless({ ...w, U: 3, L: 0.5, geometry: 'channel' }).find((x) => x.id === 'fr');
  check('dimless: channel Fr 1.355 is supercritical', near(ch.value, 3 / Math.sqrt(9.80665 * 0.5)) && ch.note.startsWith('supercritical'));
  const fast = dimensionless({ ...a, U: 700, L: 1, geometry: 'other' }).find((x) => x.id === 'ma');
  check('dimless: Mach 2.04 is supersonic', fast.note === 'supersonic');
};
