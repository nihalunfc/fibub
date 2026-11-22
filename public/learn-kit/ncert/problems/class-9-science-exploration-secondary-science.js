// Class 9 Science, Chapter 1 Exploration: live problems (original fibub questions). Ids start with c9s-sci-.
import { pick, choose, n, steps } from './_util.js';

const sigCount = (s) => { const h = s.includes('.'); const d = s.replace('.', ''); const a = d.replace(/^0+/, ''); return h ? a.length : a.replace(/0+$/, '').length; };

export default {
  'c9s-sci-sigfig': {
    title: 'count significant figures',
    make(r) {
      const s = choose(r, ['4005', '0.00450', '3.200', '1200', '0.0807', '120.50', '60.0', '700', '2.005', '0.10', '5008.0', '90000', '0.000230', '1.0050']);
      const answer = sigCount(s);
      return { s, q: `<p>How many significant figures does the measurement <b>${s}</b> have?</p>`, answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Non-zero digits count. Zeros between them count. Leading zeros never count. Trailing zeros count only if there is a decimal point.',
        solution: steps(`Strip the leading zeros of ${s}.`, `Decide about trailing zeros: ${s.includes('.') ? 'there is a decimal point, so they count' : 'there is no decimal point, so they do not count'}.`, `Total = <b>${answer}</b>.`) };
    },
    verify: (x) => [...x.s.replace('.', '')].map((c, i, a) => c).filter((c, i, a) => { const h = x.s.includes('.'); const firstNZ = a.findIndex((k) => k !== '0'); const lastNZ = a.map((k) => k !== '0').lastIndexOf(true); if (i < firstNZ) return false; if (i <= lastNZ) return true; return h; }).length,
  },
  'c9s-sci-convert': {
    title: 'convert units with powers of ten',
    make(r) {
      const kind = choose(r, ['kmh', 'mm', 'min']);
      if (kind === 'kmh') { const v = pick(r, 18, 108, 18); return { kind, v, q: `<p>A bus travels at ${v} km/h. Express this speed in m/s.</p>`, answer: v / 3.6, unit: 'm/s', tol: 0.01, hint: '1 km = 1000 m and 1 h = 3600 s, so divide km/h by 3.6.', solution: steps(`${v} km/h = ${v} × 1000 m ÷ 3600 s.`, `= <b>${n(v / 3.6)} m/s</b>.`) }; }
      if (kind === 'mm') { const v = pick(r, 12, 480, 12); return { kind, v, q: `<p>A leaf is ${v} mm long. How long is it in metres?</p>`, answer: v / 1000, unit: 'm', tol: 0.01, hint: '1 mm = 10⁻³ m.', solution: steps(`${v} mm × 10⁻³ m/mm.`, `= <b>${n(v / 1000)} m</b>.`) }; }
      const v = pick(r, 3, 45, 3); return { kind, v, q: `<p>A school bell rings for ${v} minutes. How many seconds is that?</p>`, answer: v * 60, unit: 's', tol: 0.01, hint: '1 minute = 60 s.', solution: steps(`${v} × 60 s.`, `= <b>${v * 60} s</b>.`) };
    },
    verify: (x) => (x.kind === 'kmh' ? x.v * (1000 / 3600) : x.kind === 'mm' ? x.v * 1e-3 : x.v * 60),
  },
  'c9s-sci-mean': {
    title: 'mean of repeated readings and percentage error',
    make(r) {
      const base = pick(r, 1.8, 2.4, 0.1), d = [0.04, -0.03, 0.06, -0.05, 0.02];
      const rd = d.map((e) => +(base + e).toFixed(2)), tru = base;
      const mean = rd.reduce((a, b) => a + b, 0) / rd.length, answer = Math.abs(mean - tru) / tru * 100;
      return { base, rd, q: `<p>Five readings of the time period of a pendulum are ${rd.join(', ')} s. The accepted value is ${n(base, 3)} s. Find the percentage error of the mean, to 2 decimal places.</p>`, answer, unit: '%', tol: 0.01, abs: 0.02,
        hint: 'Find the mean of the five readings, then percentage error = |mean − accepted| ÷ accepted × 100.',
        solution: steps(`Mean = (${rd.join(' + ')}) ÷ 5 = ${n(mean, 4)} s.`, `Difference = ${n(Math.abs(mean - tru), 3)} s.`, `Percentage error = ${n(Math.abs(mean - tru), 3)} ÷ ${n(tru)} × 100 = <b>${answer.toFixed(2)} %</b>.`) };
    },
    verify: (x) => Math.abs(x.rd.reduce((a, b) => a + b) / 5 - x.base) / x.base * 100,
  },
  'c9s-sci-slope': {
    title: 'read the slope of a straight line graph',
    make(r) {
      const m = pick(r, 2, 9, 1) / 2, c = pick(r, 0, 3, 1), x1 = pick(r, 1, 3), x2 = x1 + pick(r, 3, 6);
      const y1 = m * x1 + c, y2 = m * x2 + c;
      return { m, x1, x2, y1, y2, q: `<p>A straight-line graph of stretch (cm) against load (N) passes through the points (${x1} N, ${n(y1)} cm) and (${x2} N, ${n(y2)} cm). What is its slope, in cm per N?</p>`, answer: m, unit: 'cm/N', tol: 0.01,
        hint: 'Slope = rise ÷ run = (y₂ − y₁) ÷ (x₂ − x₁).',
        solution: steps(`Rise = ${n(y2)} − ${n(y1)} = ${n(y2 - y1)} cm.`, `Run = ${x2} − ${x1} = ${x2 - x1} N.`, `Slope = ${n(y2 - y1)} ÷ ${x2 - x1} = <b>${n(m)} cm/N</b>.`) };
    },
    verify: (x) => (x.y2 - x.y1) / (x.x2 - x.x1),
  },
  'c9s-sci-vernier': {
    title: 'read a vernier caliper',
    make(r) {
      const msr = pick(r, 8, 30), k = pick(r, 1, 9), zero = choose(r, [0, 0.1]), lc = 0.1;
      const answer = msr + k * lc;
      return { msr, k, q: `<p>A vernier caliper has a main scale in mm and 10 vernier divisions equal to 9 main divisions. The zero of the vernier is just past the ${msr} mm mark and the <b>${k}th</b> vernier division lines up with a main-scale line. What is the reading in mm?</p>`, answer, unit: 'mm', tol: 0.002,
        hint: 'Least count = 1 mm − 0.9 mm = 0.1 mm. Reading = main scale + (vernier division × least count).',
        solution: steps(`Least count = 0.1 mm.`, `Reading = ${msr} + ${k} × 0.1 = <b>${n(answer, 4)} mm</b>.`) };
    },
    verify: (x) => (x.msr * 10 + x.k) / 10,
  },
};
