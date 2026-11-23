// Class 11 Biology, Locomotion: bone mass through life and osteoporosis. Bone is rebuilt all life long; mass peaks near 30 years and then falls. In women the fall speeds up after menopause
// (less oestrogen). Below about 70 % of the peak the bones break easily (osteoporosis). Calcium, vitamin D and weight-bearing exercise raise the peak and slow the loss. A simple illustrative model, not patient data.
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let who = 'f', age = 60;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Bone mass against age for men, women, and women with good calcium and exercise, with an osteoporosis danger line at 70 per cent' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Person', [['m', 'Man'], ['f', 'Woman'], ['g', 'Woman, calcium + exercise']], who, (v) => { who = v; go(); });
  slider(ctl, { label: 'Age', min: 10, max: 90, step: 1, value: age, fmt: (v) => v + ' y', oninput: (v) => { age = v; go(); } });
  const mass = (kind, a) => { const peak = kind === 'g' ? 108 : 100; if (a <= 30) return peak * (0.55 + 0.45 * Math.min(1, (a - 10) / 20) ** 0.8); let m = peak; const slow = kind === 'g' ? 0.35 : 0.5; m -= slow * (Math.min(a, 90) - 30); if (kind !== 'm' && a > 50) m -= (kind === 'g' ? 0.9 : 1.8) * (Math.min(a, 58) - 50) + (kind === 'g' ? 0.25 : 0.7) * Math.max(0, a - 58); else if (kind === 'm' && a > 60) m -= 0.2 * (a - 60); return m; };
  const go = () => { const m = mass(who, age); ro.textContent = `Age ${age}: bone mass about ${m.toFixed(0)} % of a 30-year-old's. ${m < 70 ? 'Below 70 %: bones are fragile (osteoporosis), and a small fall can break the hip or wrist.' : 'Above the danger line.'} Lines: blue man, orange woman, green woman with calcium and exercise.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Bone mass through life', col), A = axes(ctx, w, h, col, { x: [10, 90], y: [40, 110], xlabel: 'age (years)', ylabel: 'bone mass (%)', l: 48, t: t0 + 8, b: 40, xt: [10, 30, 50, 70, 90], yt: [40, 70, 100] });
    line(ctx, [[A.X(10), A.Y(70)], [A.X(90), A.Y(70)]], col.bad ?? col.s[3], 1.5, [5, 4]); text(ctx, 'osteoporosis below 70', A.X(90), A.Y(70) + 10, { color: col.bad ?? col.s[3], size: 10, align: 'right' });
    [['m', col.s[0], 'man'], ['f', col.s[3], 'woman'], ['g', col.s[2], 'woman, calcium + exercise']].forEach(([kd, c], i) => { const pts = []; for (let a = 10; a <= 90; a += 2) pts.push([A.X(a), A.Y(mass(kd, a))]); line(ctx, pts, c, kd === who ? 3.5 : 1.8); if (kd === who) dot(ctx, A.X(age), A.Y(mass(kd, age)), 5.5, c, col.bg); void i; });
  };
  go();
}
