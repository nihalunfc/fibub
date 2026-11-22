// Fluids: a Venturi tube. Water flows through a pipe that narrows. Continuity (A₁v₁ = A₂v₂) makes it speed up
// in the throat, and Bernoulli's equation says the pressure there must drop: the water in the throat's side tube
// stands lower. The tracer dots move at the local speed.
import { canvas, line, text, row, slider, readout, loop } from '../../kit.js';

const RHO = 1000, G = 9.8;
export default function (host) {
  let v1 = 1, ratio = 2, t = 0, P1 = 1.4e4; // gauge pressure in the wide part, Pa
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 250, label: 'A pipe that narrows in the middle with vertical tubes showing the pressure in each part' });
  const ctl = row(host);
  slider(ctl, { label: 'Speed in wide part', min: 0.2, max: 1.6, step: 0.05, value: v1, fmt: (v) => `${v.toFixed(2)} m/s`, oninput: (v) => { v1 = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Area ratio A₁/A₂', min: 1, max: 3, step: 0.1, value: ratio, fmt: (v) => v.toFixed(1), oninput: (v) => { ratio = v; cv.redraw(); show(); } });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  const v2 = () => v1 * ratio;
  const dP = () => 0.5 * RHO * (v2() ** 2 - v1 ** 2);
  const show = () => {
    const P2 = P1 - dP();
    out.innerHTML = `Continuity: v₂ = v₁ × A₁/A₂ = <b>${v2().toFixed(2)} m/s</b>. Bernoulli: P₁ − P₂ = ½ρ(v₂² − v₁²) = <b>${(dP() / 1000).toFixed(2)} kPa</b>, ` +
      `so the side tubes differ by h = ΔP/ρg = <b>${((dP() / (RHO * G)) * 100).toFixed(1)} cm</b>.` + (P2 < 0 ? ' The throat pressure has fallen below the outside air: air would be sucked in (this is how a sprayer works).' : '');
  };
  cv.draw = (ctx, w, h, col) => {
    const yc = h * 0.72, H1 = Math.min(56, h * 0.18), H2 = H1 / ratio, x0 = 10, x1 = w - 10;
    const a = w * 0.3, b = w * 0.42, c = w * 0.58, d = w * 0.7; // wide, taper, throat, taper, wide
    const half = (x) => (x < a || x > d ? H1 : x > b && x < c ? H2 : x <= b ? H1 + ((H2 - H1) * (x - a)) / (b - a) : H2 + ((H1 - H2) * (x - c)) / (d - c));
    const top = [], bot = []; for (let i = 0; i <= 120; i++) { const x = x0 + ((x1 - x0) * i) / 120; top.push([x, yc - half(x)]); bot.push([x, yc + half(x)]); }
    ctx.fillStyle = col.soft; ctx.beginPath(); top.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); bot.slice().reverse().forEach(([x, y]) => ctx.lineTo(x, y)); ctx.closePath(); ctx.fill();
    line(ctx, top, col.ink, 2); line(ctx, bot, col.ink, 2);
    // tracer dots: speed ∝ 1/area. Table of the time taken to reach each x, then each dot is placed by its own clock.
    const px = 70, N = 200, xs = [], ts = [0];
    for (let i = 0; i <= N; i++) xs.push(x0 + ((x1 - x0) * i) / N);
    for (let i = 1; i <= N; i++) { const xm = (xs[i] + xs[i - 1]) / 2, v = v1 * (H1 / half(xm)) * px; ts.push(ts[i - 1] + (xs[i] - xs[i - 1]) / v); }
    const Tall = ts[N], dots = 16;
    for (let k = 0; k < dots; k++) for (const f of [-0.6, 0, 0.6]) {
      const tau = (t + (k / dots) * Tall + (f + 1) * 0.07) % Tall;
      let i = 1; while (i < N && ts[i] < tau) i++;
      const x = xs[i - 1] + ((xs[i] - xs[i - 1]) * (tau - ts[i - 1])) / (ts[i] - ts[i - 1] || 1);
      ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(x, yc + f * half(x), 2.5, 0, Math.PI * 2); ctx.fill();
    }
    // pressure tubes
    const scale = Math.min(1.6, (yc - H1 - 30) / ((P1 / (RHO * G)) * 100)); // px per cm of water
    const tube = (x, P, lab) => {
      const hcm = Math.max(0, (P / (RHO * G)) * 100), top0 = yc - half(x);
      ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.strokeRect(x - 5, 22, 10, top0 - 22);
      ctx.fillStyle = col.s[1]; ctx.fillRect(x - 4, top0 - hcm * scale, 8, hcm * scale);
      text(ctx, `${lab} ${hcm.toFixed(0)} cm`, x, 14, { color: col.ink, size: 11, align: 'center' });
    };
    tube(w * 0.15, P1, 'P₁:'); tube(w * 0.5, P1 - dP(), 'P₂:'); tube(w * 0.85, P1, 'P₁:');
    text(ctx, `v₁ = ${v1.toFixed(2)} m/s`, w * 0.15, yc + H1 + 16, { color: col.muted, size: 11, align: 'center' });
    text(ctx, `v₂ = ${v2().toFixed(2)} m/s`, w * 0.5, yc + H1 + 16, { color: col.muted, size: 11, align: 'center' });
  };
  cv.redraw(); show();
}
