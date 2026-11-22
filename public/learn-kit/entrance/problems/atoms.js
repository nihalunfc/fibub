// Live problems for Atoms.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const K = 8.99e9, QE = 1.602e-19, E0 = 8.854e-12, H = 6.626e-34, ME = 9.109e-31, C = 2.998e8;
const ION = ['hydrogen (Z = 1)', 'He<sup>+</sup> (Z = 2)', 'Li<sup>2+</sup> (Z = 3)', 'Be<sup>3+</sup> (Z = 4)'];

export default {
  'at-closest-approach': {
    title: 'distance of closest approach of an alpha particle',
    make(r) {
      const [Z, name] = [[79, 'gold'], [47, 'silver'], [29, 'copper'], [82, 'lead'], [13, 'aluminium']][Math.floor(r() * 5)], Kmev = pick(r, 2, 10, 0.5);
      const answer = (1.44 * 2 * Z) / Kmev;
      return { Z, Kmev,
        q: `<p>An alpha particle with kinetic energy ${Kmev} MeV heads straight at a ${name} nucleus (Z = ${Z}). How close does it get before it turns back, in fm? (Use ke² = 1.44 MeV fm.)</p>`,
        answer, unit: 'fm', tol: 0.005,
        hint: 'All its kinetic energy becomes electric potential energy: K = k(2e)(Ze)/r₀. So r₀ = 2Z × ke²/K.',
        solution: steps(`r₀ = 2 × ${Z} × 1.44 / ${Kmev}.`, `r₀ = <b>${n(answer)} fm</b>. This sets an upper limit on the size of the nucleus.`) };
    },
    verify: (x) => ((K * 2 * x.Z * QE * QE) / (x.Kmev * 1e6 * QE)) * 1e15, // SI units throughout
  },
  'at-orbit-radius': {
    title: 'radius of a Bohr orbit in a hydrogen-like ion',
    make(r) {
      const iz = Math.floor(r() * 4), Z = iz + 1, nn = pick(r, 1, 5);
      const answer = (0.529 * nn * nn) / Z;
      return { Z, nn,
        q: `<p>In the Bohr model, what is the radius of the n = ${nn} orbit of ${ION[iz]}, in Å? (Radius of the first orbit of hydrogen = 0.529 Å.)</p>`,
        answer, unit: 'Å', tol: 0.005,
        hint: 'rₙ = 0.529 n²/Z Å: larger n spreads the orbit out as n², a larger nuclear charge pulls it in as 1/Z.',
        solution: steps(`rₙ = 0.529 × ${nn}²/${Z}.`, `r = <b>${n(answer)} Å</b>.`) };
    },
    verify: (x) => ((E0 * H * H * x.nn * x.nn) / (Math.PI * ME * x.Z * QE * QE)) * 1e10, // from mvr = nh/2π and kZe²/r² = mv²/r
  },
  'at-xray-cutoff': {
    title: 'shortest wavelength from an X-ray tube',
    make(r) {
      const V = pick(r, 10, 100, 5);
      const answer = 1240 / V;
      return { V,
        q: `<p>An X-ray tube runs at ${V} kV. What is the shortest wavelength in the X-rays it gives out, in pm? (hc = 1240 eV nm)</p>`,
        answer, unit: 'pm', tol: 0.005,
        hint: 'The shortest wavelength comes from an electron that gives all its energy eV to one photon: hc/λ<sub>min</sub> = eV.',
        solution: steps(`Electron energy = ${V} keV.`, `λ<sub>min</sub> = 1240 eV nm / ${V * 1000} eV = ${n(answer / 1000)} nm = <b>${n(answer)} pm</b>.`, 'It depends only on the voltage, not on the target metal (the characteristic lines depend on the metal).') };
    },
    verify: (x) => ((H * C) / (QE * x.V * 1e3)) * 1e12,
  },
};
