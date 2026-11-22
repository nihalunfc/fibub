// Checks for the Cosmology A to Z course: the physics in public/learn-kit/cosmology/phys.js against textbook
// values, every live problem (its numbers and its own answer), and that every figure and problem named in a
// lesson exists. Run: node tests/cosmo.mjs (part of npm test).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';
const P = await import('../public/learn-kit/cosmology/phys.js');
const PROBLEMS = (await import('../public/learn-kit/cosmology/problems.js')).default;

let pass = 0, fail = 0;
const near = (name, got, want, tol = 0.01) => {
  const ok = Math.abs(got - want) <= Math.abs(want) * tol;
  ok ? pass++ : fail++;
  if (!ok) console.error(`FAIL ${name}: got ${got}, want ${want} (±${tol * 100}%)`);
};
const ok = (name, cond) => { cond ? pass++ : (fail++, console.error('FAIL ' + name)); };

// Units
near('1 pc in ly', P.PC / P.LY, 3.2616, 1e-4);
near('1 ly in m', P.LY, 9.4607e15, 1e-4);
near('1 Mpc in m', P.MPC, 3.0857e22, 1e-4);
// Light
near('Sun peak (5772 K) in nm', P.wienPeak(5772) * 1e9, 502, 0.005);
near('CMB peak in mm', P.wienPeak(P.T_CMB) * 1e3, 1.063, 0.005);
near('H-alpha in nm (air ~656.3, vacuum 656.5)', P.hydrogenLine(2, 3) * 1e9, 656.5, 0.001);
near('Lyman-alpha in nm', P.hydrogenLine(1, 2) * 1e9, 121.6, 0.001);
near('Sun luminosity from R and T', P.luminosity(P.R_SUN, 5772), P.L_SUN, 0.005);
near('Solar constant at 1 AU (W/m²)', P.flux(P.L_SUN, P.AU), 1361, 0.005);
near('550 nm photon in eV', P.photonEv(550e-9), 2.254, 0.002);
near('relativistic z at 0.6c', P.relDopplerZ(0.6 * P.C), 1, 1e-9);
near('Hubble resolution at 500 nm (arcsec)', P.resolutionArcsec(500e-9, 2.4), 0.0524, 0.01);
// Gravity
near('ISS speed at 400 km (km/s)', P.orbitSpeed(P.M_EARTH, P.R_EARTH + 400e3) / 1000, 7.67, 0.005);
near('Earth escape speed (km/s)', P.escapeSpeed(P.M_EARTH, P.R_EARTH) / 1000, 11.19, 0.005);
near('Mars period (1.524 AU) in years', P.keplerPeriodYears(1.5237), 1.881, 0.002);
near('Earth year from Newton (days)', P.orbitPeriod(P.AU, P.M_SUN) / 86400, 365.25, 0.002);
near('Eratosthenes 7.2° and 800 km', P.eratosthenes(7.2, 800), 40000, 1e-9);
near('Aristarchus 87°', P.aristarchusRatio(87), 19.1, 0.005);
near('true half-moon ratio at 89.85°', P.aristarchusRatio(89.85), 382, 0.01);
// Cosmology
near('Hubble time for H0 = 70 (Gyr)', P.hubbleTimeGyr(70), 13.97, 0.002);
near('critical density for H0 = 70 (kg/m³)', P.criticalDensity(70), 9.20e-27, 0.005);
near('Einstein-de Sitter age = 2/3 tH', P.ageGyr(0, { H0: 70, Om: 1, OL: 0 }), (2 / 3) * P.hubbleTimeGyr(70), 0.002);
near('flat Om 0.3, H0 70 age (Gyr)', P.ageGyr(0, { H0: 70, Om: 0.3, OL: 0.7 }), 13.47, 0.005);
near('Planck-like age (Gyr)', P.ageGyr(0, P.PLANCK18), 13.8, 0.01);
near('comoving distance z=1, Om 0.3, H0 70 (Mpc)', P.comovingMpc(1, { H0: 70, Om: 0.3, OL: 0.7 }), 3303, 0.005);
near('luminosity distance z=1 (Mpc)', P.luminosityMpc(1, { H0: 70, Om: 0.3, OL: 0.7 }), 6607, 0.005);
near('lookback to z=1 (Gyr)', P.lookbackGyr(1, { H0: 70, Om: 0.3, OL: 0.7 }), 7.72, 0.01);
near('empty universe age = tH', P.ageGyr(0, { H0: 70, Om: 0, OL: 0 }), P.hubbleTimeGyr(70), 0.005);
near('CMB temperature at z=1100 (K)', P.cmbTemp(1100), 2999, 0.001);

// Live problems: each makes numbers, has an answer, and its pieces are filled in.
const rnds = [() => 0, () => 0.5, () => 0.999, Math.random];
for (const [id, pr] of Object.entries(PROBLEMS)) {
  ok(`problem ${id} has a title`, typeof pr.title === 'string' && pr.title.length > 3);
  for (const r of rnds) {
    const p = pr.make(r);
    ok(`problem ${id} answer is a finite number`, Number.isFinite(p.answer));
    ok(`problem ${id} has question, hint and solution`, [p.q, p.hint, p.solution].every((s) => typeof s === 'string' && s.length > 10 && !/undefined|NaN/.test(s)));
    if (pr.verify) near(`problem ${id} independent answer`, p.answer, pr.verify(p), 0.005);
  }
}

// Lessons: every figure and problem they name exists, and every lesson has the kit's boxes.
const dir = new URL('../src/courses/cosmology/', import.meta.url);
const figDir = new URL('../public/learn-kit/cosmology/figs/', import.meta.url);
for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const md = readFileSync(new URL(f, dir), 'utf8');
  for (const m of md.matchAll(/data-fig="([a-z0-9-]+)"/g)) ok(`${f}: figure ${m[1]} exists`, existsSync(new URL(m[1] + '.js', figDir)));
  for (const m of md.matchAll(/data-problem="([a-z0-9-]+)"/g)) ok(`${f}: problem ${m[1]} exists`, !!PROBLEMS[m[1]]);
  let fm = null; try { fm = yaml.load(md.split('\n---\n')[0].replace(/^---\n/, '')); } catch (e) { console.log(String(e).split('\n')[0]); }
  ok(`${f}: front matter is valid YAML with a 3-question quiz`, fm?.quiz?.length === 3 && fm.seoTitle.length <= 60);
  ok(`${f}: has key points`, md.includes('class="keypoints"'));
  ok(`${f}: has a figure or animation`, /data-fig="/.test(md));
  ok(`${f}: has a live problem`, /data-problem="/.test(md));
  ok(`${f}: has sources`, /\nsources:\n\s+- /.test(md));
  ok(`${f}: every image has alt text`, !/<img(?![^>]*alt=)/.test(md));
}
console.log(`cosmology: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
