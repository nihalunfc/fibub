// Live problems for Chemical bonding and molecular structure.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const clip = (v, a, b) => Math.min(b, Math.max(a, v));

// [formula as HTML, total electrons]
const SPECIES = [
  ['H<sub>2</sub>', 2], ['He<sub>2</sub><sup>+</sup>', 3], ['Li<sub>2</sub>', 6], ['B<sub>2</sub>', 10], ['C<sub>2</sub>', 12],
  ['N<sub>2</sub>', 14], ['N<sub>2</sub><sup>+</sup>', 13], ['N<sub>2</sub><sup>−</sup>', 15], ['O<sub>2</sub>', 16], ['O<sub>2</sub><sup>+</sup>', 15],
  ['O<sub>2</sub><sup>−</sup>', 17], ['O<sub>2</sub><sup>2−</sup>', 18], ['F<sub>2</sub>', 18], ['NO', 15], ['NO<sup>+</sup>', 14], ['CO', 14], ['CN<sup>−</sup>', 14], ['C<sub>2</sub><sup>2−</sup>', 14],
];
// Molecular orbitals in filling order for up to 14 electrons (π2p below σ2p); beyond 14 the order of σ2p and π2p
// swaps, but both are bonding, so the counts of bonding and antibonding electrons are the same.
const MO = [['σ1s', 2, 1], ['σ*1s', 2, 0], ['σ2s', 2, 1], ['σ*2s', 2, 0], ['π2p', 4, 1], ['σ2p', 2, 1], ['π*2p', 4, 0], ['σ*2p', 2, 0]];

export default {
  'cb-bond-order': {
    title: 'bond order from molecular orbital theory',
    make(r) {
      const [f, e] = SPECIES[Math.floor(r() * SPECIES.length)];
      let left = e, b = 0, a = 0; const filled = [];
      for (const [name, cap, bond] of MO) { if (left <= 0) break; const k = Math.min(cap, left); left -= k; bond ? (b += k) : (a += k); filled.push(`${name}<sup>${k}</sup>`); }
      const answer = (b - a) / 2;
      return { e,
        q: `<p>${f} has ${e} electrons in all. Use molecular orbital theory to find its bond order.</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Fill the molecular orbitals in order (1s pair, 2s pair, then the 2p set). Bond order = (bonding electrons − antibonding electrons) ÷ 2.',
        solution: steps(`Configuration: ${filled.join(' ')}.`, `Bonding electrons N<sub>b</sub> = ${b}; antibonding N<sub>a</sub> = ${a}.`, `Bond order = (${b} − ${a}) ÷ 2 = <b>${n(answer)}</b>.`, answer === 0 ? 'Bond order 0: the species does not exist as a stable molecule.' : 'A higher bond order means a shorter, stronger bond.') };
    },
    verify: (x) => {
      const e = x.e, b = clip(e, 0, 2) + clip(e - 4, 0, 2) + clip(e - 8, 0, 6), a = clip(e - 2, 0, 2) + clip(e - 6, 0, 2) + clip(e - 14, 0, 6);
      return (b - a) / 2;
    },
  },
  'cb-ionic-character': {
    title: 'percentage ionic character from a dipole moment',
    make(r) {
      const mu = pick(r, 0.4, 3, 0.01), d = pick(r, 0.9, 2.5, 0.01);
      const full = 4.8 * d, answer = (mu / full) * 100;
      return { mu, d,
        q: `<p>A diatomic molecule AB has a measured dipole moment of ${mu} D and a bond length of ${d} Å. What is its percentage ionic character? (A charge of 1 electron separated by 1 Å gives 4.8 D.)</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'If the bond were fully ionic, the dipole moment would be e × d. Compare the measured value with that.',
        solution: steps(`Fully ionic dipole = 4.8 D/Å × ${d} Å = ${n(full, 4)} D.`, `Ionic character = ${mu} ÷ ${n(full, 4)} × 100 = <b>${n(answer, 3)}%</b>.`) };
    },
    verify: (x) => (x.mu * 3.336e-30) / (1.602e-19 * x.d * 1e-10) * 100,
  },
  'cb-born-haber': {
    title: 'lattice enthalpy from a Born-Haber cycle',
    make(r) {
      const hf = -pick(r, 300, 450), sub = pick(r, 80, 160), ie = pick(r, 400, 520), hd = pick(r, 100, 130), eg = -pick(r, 300, 360);
      const answer = sub + ie + hd + eg - hf;
      return { hf, sub, ie, hd, eg,
        q: `<p>For a salt MX(s): enthalpy of formation ${hf} kJ/mol, sublimation of M ${sub}, ionisation enthalpy of M ${ie}, half the bond dissociation enthalpy of X<sub>2</sub> ${hd}, electron gain enthalpy of X ${eg} kJ/mol. Find the lattice enthalpy, the energy needed to break 1 mol of MX(s) into gaseous ions (a positive number).</p>`,
        answer, unit: 'kJ/mol', tol: 0.001, abs: 0.5,
        hint: 'Going straight from the elements to MX(s) equals going round the cycle: sublime, ionise, atomise, add an electron, then let the gaseous ions form the lattice (which releases the lattice enthalpy).',
        solution: steps(`ΔH<sub>f</sub> = ΔH<sub>sub</sub> + IE + ½D + ΔH<sub>eg</sub> − ΔH<sub>lattice</sub>.`, `ΔH<sub>lattice</sub> = ${sub} + ${ie} + ${hd} + (${eg}) − (${hf}).`, `= <b>${answer} kJ/mol</b>.`) };
    },
    verify: (x) => -(x.hf - (x.sub + x.ie + x.hd + x.eg)),
  },
};
