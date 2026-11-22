// Live problems for Solid state and surface chemistry.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const NA = 6.022e23;
const LAT = [['simple cubic', 1], ['body-centred cubic', 2], ['face-centred cubic', 4]];

export default {
  'ss-density': {
    title: 'density of a metal from its unit cell',
    make(r) {
      const [lat, Z] = LAT[1 + Math.floor(r() * 2)];
      const a = pick(r, 280, 520, 2), M = pick(r, 20, 200, 0.5);
      const answer = (Z * M) / (NA * (a * 1e-10) ** 3);
      return { Z, a, M,
        q: `<p>A metal (molar mass ${M} g/mol) crystallises in a ${lat} lattice with edge length ${a} pm. What is its density? (N<sub>A</sub> = 6.022 × 10<sup>23</sup> mol<sup>−1</sup>)</p>`,
        answer, unit: 'g/cm³', tol: 0.005,
        hint: `Z = ${Z} for this lattice. d = ZM/(N_A a³), with a in cm (1 pm = 10⁻¹⁰ cm).`,
        solution: steps(`Z = ${Z}; a = ${a} × 10⁻¹⁰ cm, so a³ = ${n((a * 1e-10) ** 3, 4)} cm³.`, `Mass of one cell = ZM/N_A = ${Z} × ${M}/6.022×10²³ = ${n((Z * M) / NA, 4)} g.`, `d = mass/volume = <b>${n(answer)} g/cm³</b>.`) };
    },
    // the same density from the mass of one atom times atoms per cm³
    verify: (x) => (x.M / NA) * (x.Z / (x.a * 1e-10) ** 3),
  },
  'ss-radius': {
    title: 'atomic radius from edge length',
    make(r) {
      const i = Math.floor(r() * 3), [lat] = LAT[i], a = pick(r, 250, 600, 1);
      const answer = [a / 2, (Math.sqrt(3) * a) / 4, a / (2 * Math.sqrt(2))][i];
      const rel = ['atoms touch along the edge: a = 2r', 'atoms touch along the body diagonal: √3 a = 4r', 'atoms touch along the face diagonal: √2 a = 4r'][i];
      return { i, a,
        q: `<p>A metal has a ${lat} unit cell with edge length ${a} pm. What is the radius of its atoms?</p>`,
        answer, unit: 'pm', tol: 0.005,
        hint: 'Find the line along which neighbouring atoms touch: the edge (simple), the body diagonal (bcc) or the face diagonal (fcc).',
        solution: steps(`In ${lat}, ${rel}.`, `r = <b>${n(answer, 4)} pm</b>.`) };
    },
    // diagonal length divided by the number of radii along it
    verify: (x) => [x.a / 2, Math.sqrt(3 * x.a * x.a) / 4, Math.sqrt(2 * x.a * x.a) / 4][x.i],
  },
  'ss-freundlich': {
    title: 'the Freundlich exponent from two measurements',
    make(r) {
      const inv = [0.2, 0.25, 0.4, 0.5, 0.6, 0.75][Math.floor(r() * 6)], k = pick(r, 0.5, 3, 0.1);
      const P1 = pick(r, 0.1, 1, 0.1), f = [2, 4, 5, 10][Math.floor(r() * 4)], P2 = +(P1 * f).toFixed(2);
      const x1 = +(k * P1 ** inv).toFixed(3), x2 = +(k * P2 ** inv).toFixed(3);
      const answer = Math.log10(x2 / x1) / Math.log10(P2 / P1);
      return { P1, P2, x1, x2,
        q: `<p>A gas adsorbs on charcoal following the Freundlich isotherm x/m = kP<sup>1/n</sup>. At ${P1} atm, x/m = ${x1} g/g; at ${P2} atm, x/m = ${x2} g/g. Find 1/n.</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Take logs: log(x/m) = log k + (1/n) log P. Two points give the slope 1/n.',
        solution: steps(`1/n = log(${x2}/${x1}) / log(${P2}/${P1}).`, `= ${n(Math.log10(x2 / x1), 4)} / ${n(Math.log10(P2 / P1), 4)} = <b>${n(answer)}</b>.`, 'A value between 0 and 1 means adsorption rises with pressure, but more and more slowly.') };
    },
    verify: (x) => Math.log(x.x2 / x.x1) / Math.log(x.P2 / x.P1),
  },
};
