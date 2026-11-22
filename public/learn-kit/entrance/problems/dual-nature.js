// Live problems for Dual nature of radiation and matter.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const sci = (v, d = 3) => { const e = Math.floor(Math.log10(Math.abs(v))); return `${+(v / 10 ** e).toPrecision(d)} × 10<sup>${e}</sup>`; };
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const H = 6.63e-34, ME = 9.1e-31, QE = 1.6e-19, C = 3e8;

export default {
  'dn-stopping': {
    title: 'stopping potential in a photocell',
    make(r) {
      const phi = pick(r, 1.8, 4.5, 0.1), lam = pick(r, 150, Math.floor(1240 / (phi + 0.3) / 10) * 10, 10);
      const answer = 1240 / lam - phi;
      return { phi, lam,
        q: `<p>Light of wavelength ${lam} nm falls on a metal with work function ${phi} eV. What is the stopping potential, in V? (hc = 1240 eV nm)</p>`,
        answer, unit: 'V', tol: 0.005,
        hint: 'Photon energy E = 1240/λ(nm) eV. K<sub>max</sub> = E − φ, and eV₀ = K<sub>max</sub>.',
        solution: steps(`E = 1240/${lam} = ${n(1240 / lam, 4)} eV.`, `K<sub>max</sub> = ${n(1240 / lam, 4)} − ${phi} = ${n(answer, 4)} eV.`, `V₀ = <b>${n(answer)} V</b>. Brighter light of the same colour would give more electrons, not a bigger V₀.`) };
    },
    verify: (x) => { const hEv = 1240e-9 / C, f = C / (x.lam * 1e-9), f0 = x.phi / hEv; return hEv * (f - f0); }, // hν − hν₀
  },
  'dn-debroglie-v': {
    title: 'de Broglie wavelength of an accelerated electron',
    make(r) {
      const V = [25, 50, 100, 150, 200, 400, 600, 900, 1000, 2500, 5000, 10000][Math.floor(r() * 12)];
      const answer = (H / Math.sqrt(2 * ME * QE * V)) * 1e9;
      return { V,
        q: `<p>An electron starts from rest and is accelerated through ${V} V. What is its de Broglie wavelength, in nm? (h = 6.63 × 10⁻³⁴ J s, m = 9.1 × 10⁻³¹ kg, e = 1.6 × 10⁻¹⁹ C)</p>`,
        answer, unit: 'nm', tol: 0.005,
        hint: 'Kinetic energy eV = p²/2m, so p = √(2meV). Then λ = h/p. The shortcut is λ ≈ 1.227/√V nm.',
        solution: steps(`p = √(2 × 9.1 × 10⁻³¹ × 1.6 × 10⁻¹⁹ × ${V}) = ${sci(Math.sqrt(2 * ME * QE * V))} kg m/s.`, `λ = h/p = <b>${n(answer)} nm</b>.`, `Shortcut: 1.227/√${V} = ${n(1.227 / Math.sqrt(V))} nm. Wavelengths this small are why electron microscopes see finer detail than light.`) };
    },
    verify: (x) => 1.227 / Math.sqrt(x.V),
  },
  'dn-photon-rate': {
    title: 'photons per second from a lamp or laser',
    make(r) {
      const P = pick(r, 1, 100), lam = pick(r, 400, 700, 10);
      const answer = (P * 1e-3 * lam * 1e-9) / (H * C) / 1e15;
      return { P, lam,
        q: `<p>A source gives out ${P} mW of light of wavelength ${lam} nm. How many photons does it emit each second? Give your answer in units of 10<sup>15</sup>. (h = 6.63 × 10⁻³⁴ J s, c = 3 × 10⁸ m/s)</p>`,
        answer, unit: '× 10¹⁵ per second', tol: 0.005,
        hint: 'Each photon carries E = hc/λ. Photons per second = power ÷ energy of one photon.',
        solution: steps(`E = hc/λ = 6.63 × 10⁻³⁴ × 3 × 10⁸ / (${lam} × 10⁻⁹) = ${sci((H * C) / (lam * 1e-9))} J.`, `N = ${P} × 10⁻³ / ${sci((H * C) / (lam * 1e-9))} = <b>${n(answer)} × 10¹⁵ per second</b>.`) };
    },
    verify: (x) => { const EeV = 1243.1 / x.lam; return (x.P * 1e-3) / (EeV * QE) / 1e15; }, // photon energy in eV with hc = 1243 eV nm (from the same h and c)
  },
};
