// Class 11 Chemistry, Chapter 8 Organic Chemistry: Some Basic Principles and Techniques: live problems (original fibub questions). Ids start with c11c-org-.
import { pick, choose, n, steps } from './_util.js';

const X = [['Cl', 35.5, 143.5], ['Br', 80, 188], ['I', 127, 235]];
export default {
  'c11c-org-carbon': {
    title: 'percentage of carbon by combustion',
    make(r) {
      const w = choose(r, [0.20, 0.25, 0.30, 0.40]), co2 = choose(r, [0.22, 0.33, 0.44, 0.55, 0.66]), pc = (12 / 44) * co2 / w * 100;
      return { w, co2, q: `<p>${w} g of an organic compound on complete combustion gives ${co2} g of CO₂. Find the percentage of carbon in the compound (C = 12, CO₂ = 44).</p>`, answer: pc, unit: '%', tol: 0.01,
        hint: 'All carbon of the compound ends up in CO₂: 12 g of C in every 44 g of CO₂.',
        solution: steps(`Mass of C = 12/44 × ${co2} = ${n(12 / 44 * co2, 3)} g.`, `% C = ${n(12 / 44 * co2, 3)} ÷ ${w} × 100 = <b>${n(pc)} %</b>.`) };
    },
    verify: (x) => { const molC = x.co2 / 44; return (molC * 12 / x.w) * 100; },
  },
  'c11c-org-dumas': {
    title: 'Dumas method for nitrogen',
    make(r) {
      const w = choose(r, [0.28, 0.35, 0.42, 0.56]), V = choose(r, [28, 44.8, 56, 67.2, 33.6]), pn = (28 * V / 22400) / w * 100;
      return { w, V, q: `<p>In the Dumas method, ${w} g of an organic compound gives ${V} mL of nitrogen gas collected at STP (1 mole of gas = 22 400 mL; N₂ = 28 g/mol). Find the percentage of nitrogen.</p>`, answer: pn, unit: '%', tol: 0.01,
        hint: 'Moles of N₂ = V ÷ 22 400. Mass of N = moles × 28.',
        solution: steps(`Moles of N₂ = ${V} ÷ 22400 = ${n(V / 22400, 3)} mol.`, `Mass of N = ${n(V / 22400, 3)} × 28 = ${n(28 * V / 22400, 3)} g.`, `% N = ${n(28 * V / 22400, 3)} ÷ ${w} × 100 = <b>${n(pn)} %</b>.`) };
    },
    verify: (x) => { const molAtoms = 2 * (x.V / 22400); return molAtoms * 14 / x.w * 100; },
  },
  'c11c-org-kjeldahl': {
    title: 'Kjeldahl method for nitrogen',
    make(r) {
      const w = choose(r, [0.25, 0.30, 0.50, 0.60]), M = choose(r, [0.05, 0.10, 0.20]), V = choose(r, [10, 15, 20, 25]), pn = 1.4 * (2 * M) * V / w;
      return { w, M, V, q: `<p>In the Kjeldahl method, the ammonia from ${w} g of an organic compound neutralises ${V} mL of ${M} M H₂SO₄ (each mole of H₂SO₄ neutralises 2 mol of NH₃). Find the percentage of nitrogen (N = 14).</p>`, answer: pn, unit: '%', tol: 0.01,
        hint: 'Moles of NH₃ = 2 × moles of H₂SO₄; each NH₃ holds one N atom.',
        solution: steps(`Moles of H₂SO₄ = ${M} × ${V}/1000 = ${n(M * V / 1000, 3)} mol.`, `Moles of NH₃ = ${n(2 * M * V / 1000, 3)} mol, so mass of N = ${n(2 * M * V / 1000 * 14, 3)} g.`, `% N = ${n(2 * M * V / 1000 * 14, 3)} ÷ ${w} × 100 = <b>${n(pn)} %</b>.`) };
    },
    verify: (x) => ((2 * x.M * x.V) / 1000 * 14 / x.w) * 100,
  },
  'c11c-org-carius': {
    title: 'Carius method for a halogen',
    make(r) {
      const [hal, ar, mm] = choose(r, X), w = choose(r, [0.15, 0.20, 0.30, 0.40]), y = choose(r, [0.20, 0.30, 0.40, 0.50]), pc = (ar / mm) * y / w * 100;
      return { hal, ar, mm, w, y, q: `<p>In the Carius method, ${w} g of an organic compound containing ${hal} gives ${y} g of silver halide (Ag${hal}, molar mass ${mm} g/mol; ${hal} = ${ar}). Find the percentage of ${hal}.</p>`, answer: pc, unit: '%', tol: 0.01,
        hint: `Each mole of Ag${hal} contains one mole of ${hal} atoms (${ar} g).`,
        solution: steps(`Moles of Ag${hal} = ${y} ÷ ${mm} = ${n(y / mm, 3)} mol = moles of ${hal}.`, `Mass of ${hal} = ${n(y / mm, 3)} × ${ar} = ${n(y / mm * ar, 3)} g.`, `% ${hal} = ${n(y / mm * ar, 3)} ÷ ${w} × 100 = <b>${n(pc)} %</b>.`) };
    },
    verify: (x) => (x.y / x.mm) * x.ar / x.w * 100,
  },
  'c11c-org-rf': {
    title: 'retention factor Rf',
    make(r) {
      const front = choose(r, [8.0, 9.0, 10.0, 12.0]), spot = choose(r, [2.0, 3.0, 4.5, 6.0, 7.2]), rf = spot / front;
      return { front, spot, q: `<p>On a TLC plate the solvent front moved ${front} cm from the start line and a spot moved ${spot} cm. Find its Rf value.</p>`, answer: rf, tol: 0.01,
        hint: 'Rf = distance moved by the spot ÷ distance moved by the solvent front (no units).',
        solution: steps(`Rf = ${spot} ÷ ${front} = <b>${n(rf)}</b>.`, 'Rf is always between 0 and 1: a spot cannot move farther than the solvent.') };
    },
    verify: (x) => 1 / (x.front / x.spot),
  },
};
