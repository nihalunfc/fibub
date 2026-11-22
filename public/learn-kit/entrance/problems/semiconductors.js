// Live problems for Semiconductor electronics.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const QE = 1.6e-19;

export default {
  'sc-zener': {
    title: 'current through a Zener regulator',
    make(r) {
      const Vz = [5, 6, 9, 12][Math.floor(r() * 4)], Vs = pick(r, Vz + 4, Vz + 14), R = pick(r, 100, 500, 50);
      const Is = ((Vs - Vz) / R) * 1e3, RL = pick(r, Math.ceil((Vz / Is) * 1.3 * 1e3 / 100) * 100, Math.ceil((Vz / Is) * 1.3 * 1e3 / 100) * 100 + 2000, 100);
      const answer = Is - (Vz / RL) * 1e3;
      return { Vz, Vs, R, RL,
        q: `<p>A ${Vz} V Zener diode is used with a ${R} Ω series resistor on a ${Vs} V supply. A ${RL} Ω load is connected across the Zener. What current flows through the Zener, in mA?</p>`,
        answer, unit: 'mA', tol: 0.005,
        hint: 'The Zener holds the load at ' + Vz + ' V. Current through the series resistor = (V<sub>s</sub> − V<sub>z</sub>)/R; load current = V<sub>z</sub>/R<sub>L</sub>; the Zener takes the difference.',
        solution: steps(`I through R = (${Vs} − ${Vz})/${R} = ${n(Is, 4)} mA.`, `I<sub>L</sub> = ${Vz}/${RL} = ${n((Vz / RL) * 1e3, 4)} mA.`, `I<sub>Z</sub> = ${n(Is, 4)} − ${n((Vz / RL) * 1e3, 4)} = <b>${n(answer)} mA</b>.`) };
    },
    verify: (x) => (x.Vs / x.R - x.Vz * (1 / x.R + 1 / x.RL)) * 1e3, // node equation at the Zener's top terminal
  },
  'sc-conductivity': {
    title: 'conductivity of doped silicon',
    make(r) {
      const Nd = pick(r, 1, 9), mu = [0.135, 0.13, 0.12][Math.floor(r() * 3)];
      const answer = Nd * 1e21 * QE * mu;
      return { Nd, mu,
        q: `<p>Silicon is doped with ${Nd} × 10²¹ phosphorus atoms per m³, each giving one free electron. The electron mobility is ${mu} m²/(V s). Ignoring holes and intrinsic carriers, what is its conductivity, in S/m? (e = 1.6 × 10⁻¹⁹ C)</p>`,
        answer, unit: 'S/m', tol: 0.005,
        hint: 'σ = e(n μ<sub>e</sub> + p μ<sub>h</sub>). Here n = N<sub>d</sub> and p is negligible.',
        solution: steps(`σ ≈ n e μ<sub>e</sub> = ${Nd} × 10²¹ × 1.6 × 10⁻¹⁹ × ${mu}.`, `σ = <b>${n(answer)} S/m</b>, so ρ = 1/σ = ${n(1 / answer)} Ω m.`, 'Pure silicon is about 4 × 10⁻⁴ S/m: a few parts per million of dopant raise it hundreds of thousands of times.') };
    },
    verify: (x) => { const rho = 1 / (x.Nd * 1e21 * QE * x.mu); return 1 / rho; },
  },
  'sc-holes': {
    title: 'minority carriers in an n-type semiconductor',
    make(r) {
      const Nd = pick(r, 1, 9), ni = 1.5;
      const answer = (ni * 1e16) ** 2 / (Nd * 1e21) / 1e10;
      return { Nd, ni,
        q: `<p>Silicon (intrinsic carrier concentration 1.5 × 10¹⁶ m⁻³) is doped with ${Nd} × 10²¹ donor atoms per m³. Find the hole concentration, in units of 10¹⁰ m⁻³.</p>`,
        answer, unit: '× 10¹⁰ m⁻³', tol: 0.005,
        hint: 'Law of mass action: n p = n<sub>i</sub>². With so many donors, n ≈ N<sub>d</sub>.',
        solution: steps(`n ≈ N<sub>d</sub> = ${Nd} × 10²¹ m⁻³.`, `p = n<sub>i</sub>²/n = (1.5 × 10¹⁶)² / (${Nd} × 10²¹) = <b>${n(answer)} × 10¹⁰ m⁻³</b>.`, 'Doping makes holes far rarer than in pure silicon: adding electrons increases recombination.') };
    },
    verify: (x) => { // exact: charge neutrality n = p + N_d with n p = n_i²
      const ni = x.ni * 1e16, Nd = x.Nd * 1e21, nn = Nd / 2 + Math.sqrt((Nd * Nd) / 4 + ni * ni); return (ni * ni) / nn / 1e10;
    },
  },
};
