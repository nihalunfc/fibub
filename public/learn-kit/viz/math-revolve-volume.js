// Volume of revolution by discs. Spin the curve y = f(x) about the x-axis: each thin slice is a disc of area π f(x)²
// and thickness Δx. Slide the number of discs and compare their total volume with the exact answer π∫f²dx. The
// semicircle gives a sphere (4πR³/3), a straight line a cone (πR²H/3). Drag the view to turn it.
import { canvas, row, slider, choice, readout, text } from '../kit.js';
import { orbit } from './_3d.js';
import { f2 } from './_math.js';

const SH = {
  sphere: ['Sphere (semicircle)', (x) => Math.sqrt(Math.max(0, 1 - x * x)), -1, 1, (4 * Math.PI) / 3, 'sphere 4πR³/3 with R = 1'],
  cone: ['Cone (line y = x)', (x) => x, 0, 1.5, (Math.PI * 1.5 ** 3) / 3, 'cone πR²H/3 with R = H = 1.5'],
  para: ['Paraboloid (y = √x)', Math.sqrt, 0, 1.6, (Math.PI * 1.6 ** 2) / 2, 'paraboloid, ∫π x dx'],
  vase: ['Vase (y = 1 + ½ sin 2x)', (x) => 1 + 0.5 * Math.sin(2 * x), 0, 3, null, 'numerical'],
};
export default function (host) {
  let k = 'sphere', n = 8;
  const cv = canvas(host, { aspect: 0.8, max: 400, min: 280, label: 'A curve spun about the x-axis into a solid built from discs' });
  const cam = orbit(cv, { yaw: 0.4, pitch: 0.3 });
  const c = row(host);
  choice(c, 'Shape', Object.entries(SH).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; re(); });
  slider(c, { label: 'discs n', min: 1, max: 40, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = v; re(); } });
  const out = readout(host);
  const exact = () => { const [, f, a, b, e] = SH[k]; if (e !== null) return e; let s = 0; const N = 4000, dx = (b - a) / N; for (let i = 0; i < N; i++) { const y = f(a + (i + 0.5) * dx); s += Math.PI * y * y * dx; } return s; };
  const discs = () => { const [, f, a, b] = SH[k], dx = (b - a) / n; let s = 0; for (let i = 0; i < n; i++) { const y = f(a + (i + 0.5) * dx); s += Math.PI * y * y * dx; } return s; };
  function re() { cv.redraw(); const e = exact(), d = discs(); out.innerHTML = `${n} discs, each of volume π·f(x)²·Δx. Total = <b>${f2(d, 4)}</b>. Exact V = π∫f(x)²dx = <b>${f2(e, 4)}</b> (${SH[k][5]}). Error ${f2(Math.abs(d - e) / e * 100, 2)}%.`; }
  cv.draw = (ctx, w, h, col) => {
    const [, f, a, b] = SH[k], sc = Math.min(w / (b - a + 1.2), h / 3.2) * 0.9, mid = (a + b) / 2;
    const P = cam.proj(w, h, sc, w / 2, h / 2 + 4), pt = (x, y, t) => P([x - mid, y * Math.cos(t), y * Math.sin(t)]);
    const dx = (b - a) / n, ring = (x, y, c, wd, al) => { ctx.beginPath(); for (let i = 0; i <= 36; i++) { const p = pt(x, y, (i / 36) * 2 * Math.PI); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.globalAlpha = al; ctx.strokeStyle = c; ctx.lineWidth = wd; ctx.stroke(); ctx.globalAlpha = 1; };
    // discs: draw each as two rings (faces) and the side outline, back to front by x depth
    for (let i = 0; i < n; i++) { const x0 = a + i * dx, y = f(a + (i + 0.5) * dx); ctx.beginPath(); for (let j = 0; j <= 36; j++) { const p = pt(x0, y, (j / 36) * 6.2832); j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.12; ctx.fill(); ctx.globalAlpha = 1; ring(x0, y, col.s[0], 1, 0.7); ring(x0 + dx, y, col.s[0], 1, 0.7); }
    // axis and the generating curve
    const A0 = P([a - mid - 0.3, 0, 0]), A1 = P([b - mid + 0.3, 0, 0]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(A0[0], A0[1]); ctx.lineTo(A1[0], A1[1]); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); for (let i = 0; i <= 80; i++) { const x = a + ((b - a) * i) / 80, p = pt(x, f(x), 0); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.stroke();
    text(ctx, 'orange: y = f(x)', 10, h - 12, { color: col.s[1], size: 11, weight: 600 }); text(ctx, 'Drag to turn', w - 8, h - 12, { color: col.muted, size: 10, align: 'right' });
  };
  re();
}
