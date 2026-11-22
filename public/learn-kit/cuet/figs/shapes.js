// 3.9 Mensuration: pick a solid, change its size, see volume and surface area with the formula used.
import { canvas, text, row, slider, readout, choice } from '../../kit.js';

const S = {
  cuboid: { lab: ['length', 'breadth', 'height'], v: (a, b, c) => a * b * c, s: (a, b, c) => 2 * (a * b + b * c + c * a), fv: 'l × b × h', fs: '2(lb + bh + hl)' },
  cylinder: { lab: ['radius', 'height'], v: (r, h) => Math.PI * r * r * h, s: (r, h) => 2 * Math.PI * r * (r + h), fv: 'πr²h', fs: '2πr(r + h)' },
  cone: { lab: ['radius', 'height'], v: (r, h) => (Math.PI * r * r * h) / 3, s: (r, h) => Math.PI * r * (r + Math.hypot(r, h)), fv: '⅓πr²h', fs: 'πr(r + l), l = √(r² + h²)' },
  sphere: { lab: ['radius'], v: (r) => (4 / 3) * Math.PI * r ** 3, s: (r) => 4 * Math.PI * r * r, fv: '4/3 πr³', fs: '4πr²' },
};
export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 210, label: 'Drawing of the chosen solid with its dimensions' });
  let kind = 'cylinder', d = [7, 10, 5];
  const ctl = row(host);
  choice(ctl, 'Solid', Object.keys(S), kind, (v) => { kind = v; build(); });
  const sl = row(host), out = readout(host);
  const build = () => {
    sl.replaceChildren();
    S[kind].lab.forEach((lab, i) => slider(sl, { label: `${lab} (cm)`, min: 1, max: 20, step: 1, value: d[i], fmt: (v) => `${v} cm`, oninput: (v) => { d[i] = v; go(); } }));
    go();
  };
  const go = () => {
    const k = S[kind], args = d.slice(0, k.lab.length);
    out.innerHTML = `Volume = ${k.fv} = <b>${k.v(...args).toFixed(1)} cm³</b>. Total surface area = ${k.fs} = <b>${k.s(...args).toFixed(1)} cm²</b>. (With π = 22/7 and r a multiple of 7, CUET answers come out whole.)`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h / 2 + 10, u = Math.min(w, h) / 50;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25;
    const [a, b, c] = d;
    if (kind === 'sphere') { ctx.beginPath(); ctx.arc(cx, cy, a * u, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, cy, a * u, a * u * 0.3, 0, 0, 7); ctx.stroke(); }
    else if (kind === 'cuboid') { const L = a * u, H = c * u, D = b * u * 0.5; ctx.fillRect(cx - L / 2, cy - H / 2, L, H); ctx.globalAlpha = 1; ctx.strokeRect(cx - L / 2, cy - H / 2, L, H); ctx.beginPath(); ctx.moveTo(cx - L / 2, cy - H / 2); ctx.lineTo(cx - L / 2 + D, cy - H / 2 - D); ctx.lineTo(cx + L / 2 + D, cy - H / 2 - D); ctx.lineTo(cx + L / 2, cy - H / 2); ctx.moveTo(cx + L / 2 + D, cy - H / 2 - D); ctx.lineTo(cx + L / 2 + D, cy + H / 2 - D); ctx.lineTo(cx + L / 2, cy + H / 2); ctx.stroke(); }
    else { const R = a * u, H = b * u, top = cy - H / 2, bot = cy + H / 2; ctx.beginPath(); if (kind === 'cylinder') { ctx.rect(cx - R, top, 2 * R, H); } else { ctx.moveTo(cx, top); ctx.lineTo(cx - R, bot); ctx.lineTo(cx + R, bot); ctx.closePath(); } ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, bot, R, R * 0.25, 0, 0, 7); ctx.stroke(); if (kind === 'cylinder') { ctx.beginPath(); ctx.ellipse(cx, top, R, R * 0.25, 0, 0, 7); ctx.stroke(); } }
    text(ctx, kind, 12, 14, { color: col.muted, size: 12, weight: 600 });
  };
  build();
}
