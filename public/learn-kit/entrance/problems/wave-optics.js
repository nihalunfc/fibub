// Live problems for Wave optics.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const DEG = Math.PI / 180;

export default {
  'wo-fringe-width': {
    title: 'fringe width in Young\'s double slit',
    make(r) {
      const lam = pick(r, 400, 700, 10), d = pick(r, 0.1, 1, 0.05), D = pick(r, 0.5, 2.5, 0.1);
      const answer = ((lam * 1e-9 * D) / (d * 1e-3)) * 1e3;
      return { lam, d, D,
        q: `<p>In a double slit experiment, light of wavelength ${lam} nm falls on slits ${d} mm apart. The screen is ${D} m away. What is the fringe width, in mm?</p>`,
        answer, unit: 'mm', tol: 0.005,
        hint: 'β = λD/d. Keep all lengths in metres, then change the answer to mm.',
        solution: steps(`β = ${lam} × 10⁻⁹ × ${D} / (${d} × 10⁻³).`, `β = <b>${n(answer)} mm</b>.`, 'Bright fringes sit at y = nβ, dark ones halfway between.') };
    },
    verify: (x) => { // exact positions of the zeroth and first bright fringes: d sin θ = nλ, y = D tan θ
      const th = Math.asin((x.lam * 1e-9) / (x.d * 1e-3)); return x.D * Math.tan(th) * 1e3;
    },
  },
  'wo-malus': {
    title: 'light through three polarisers',
    make(r) {
      const I0 = pick(r, 16, 160, 8), th = [15, 22.5, 30, 45, 60, 67.5, 75][Math.floor(r() * 7)];
      const answer = (I0 / 2) * Math.cos(th * DEG) ** 2 * Math.cos((90 - th) * DEG) ** 2;
      return { I0, th,
        q: `<p>Unpolarised light of intensity ${I0} W/m² passes through two crossed polarisers (axes at 90°). A third polariser is slipped between them with its axis at ${th}° to the first. What intensity comes out, in W/m²?</p>`,
        answer, unit: 'W/m²', tol: 0.005,
        hint: 'The first polariser halves unpolarised light. Then apply Malus\'s law I = I₀cos²θ at each later polariser, using the angle between neighbouring axes.',
        solution: steps(`After the first: ${I0}/2 = ${I0 / 2} W/m².`, `After the middle one (${th}°): × cos²${th}°.`, `After the last (${90 - th}° from the middle): × cos²${90 - th}°.`, `I = ${I0 / 2} × ${n(Math.cos(th * DEG) ** 2, 4)} × ${n(Math.cos((90 - th) * DEG) ** 2, 4)} = <b>${n(answer)} W/m²</b>. Without the middle polariser, nothing would get through.`) };
    },
    verify: (x) => (x.I0 / 8) * Math.sin(2 * x.th * DEG) ** 2,
  },
  'wo-single-slit': {
    title: 'width of the central maximum of a single slit',
    make(r) {
      const lam = pick(r, 400, 700, 10), a = pick(r, 0.05, 0.5, 0.05), D = pick(r, 0.5, 2, 0.1);
      const answer = ((2 * lam * 1e-9 * D) / (a * 1e-3)) * 1e3;
      return { lam, a, D,
        q: `<p>Light of wavelength ${lam} nm passes through a slit ${a} mm wide and falls on a screen ${D} m away. How wide is the central bright band, in mm?</p>`,
        answer, unit: 'mm', tol: 0.005,
        hint: 'The first minima are where a sin θ = λ, at y = ±λD/a. The central band runs from one to the other.',
        solution: steps(`First minimum at y = λD/a = ${lam} × 10⁻⁹ × ${D} / (${a} × 10⁻³) = ${n(answer / 2)} mm.`, `Central width = 2λD/a = <b>${n(answer)} mm</b>, twice the width of the side bands.`) };
    },
    verify: (x) => 2 * x.D * Math.tan(Math.asin((x.lam * 1e-9) / (x.a * 1e-3))) * 1e3,
  },
};
