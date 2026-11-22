// Gas exchange along one lung capillary. Oxygen moves from alveolar air (high pO2) into blood (low pO2) by diffusion
// until the two match. Red blood cells drift along and turn from dark to bright red. Try exercise (blood passes faster),
// a thickened membrane (fibrosis or fluid) and high altitude (less oxygen in the alveolus) and watch the end-point fall.
import { canvas, loop, row, choice, readout, text, title } from '../kit.js';

export default function (host) {
  let eff = 'rest', mem = 'normal', alt = 'sea', t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 330, label: 'Oxygen diffusing into blood along a lung capillary with a curve of blood pO2' });
  const ctl = row(host), c2 = row(host);
  loop(host, (dt) => { t += dt; cv.redraw(); }).button(ctl);
  choice(ctl, 'Activity', [['rest', 'Rest (0.75 s)'], ['ex', 'Exercise (0.3 s)']], eff, (v) => { eff = v; show(); });
  choice(c2, 'Membrane', [['normal', 'Normal'], ['thick', 'Thickened']], mem, (v) => { mem = v; show(); });
  choice(c2, 'Air', [['sea', 'Sea level'], ['high', '5000 m']], alt, (v) => { alt = v; show(); });
  const out = readout(host);
  const P = () => (alt === 'sea' ? 104 : 50), tr = () => (eff === 'rest' ? 0.75 : 0.3), tau = () => (mem === 'normal' ? 0.12 : 0.5);
  const pO2 = (s) => P() - (P() - 40) * Math.exp(-s / tau());
  const sat = (p) => p ** 2.7 / (p ** 2.7 + 26 ** 2.7);
  const show = () => { const pe = pO2(tr()); out.innerHTML = `Alveolar pO₂ <b>${P()}</b> mmHg, blood enters at 40. After <b>${tr()} s</b> it leaves at <b>${pe.toFixed(0)} mmHg</b> (haemoglobin ${(sat(pe) * 100).toFixed(0)} % saturated). ${pe > P() - 3 ? 'Equilibrium is reached with time to spare.' : 'The blood leaves before it has fully equilibrated.'} Oxygen reserve is large, so a healthy person at rest is rarely limited.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Oxygen along the capillary', col);
    const L = 14, R = w - 14, cy = 80, T = tr();
    // alveolus above, capillary below
    ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.22; ctx.fillRect(L, 40, R - L, 20); ctx.globalAlpha = 1;
    text(ctx, `alveolar air (pO₂ ${P()})`, L + 4, 50, { color: col.ink, size: 10.5, weight: 600 });
    ctx.strokeStyle = col.muted; ctx.lineWidth = mem === 'normal' ? 2 : 7; ctx.beginPath(); ctx.moveTo(L, 62); ctx.lineTo(R, 62); ctx.stroke();
    text(ctx, mem === 'normal' ? 'thin membrane' : 'thick membrane', R - 4, 72, { color: col.muted, size: 9.5, align: 'right', fit: false });
    ctx.strokeStyle = col.s[5]; ctx.lineWidth = 2; ctx.strokeRect(L, 78, R - L, 30);
    // red cells flow left to right in T seconds, colour by pO2 at that position
    for (let i = 0; i < 7; i++) { const f = ((i / 7) + t / (T * 1.4)) % 1, p = pO2(f * T), s = sat(p); ctx.beginPath(); ctx.ellipse(L + 12 + f * (R - L - 24), 93, 9, 6, 0, 0, 7); ctx.fillStyle = `rgb(${Math.round(120 + 100 * s)},${Math.round(30 - 10 * s)},${Math.round(70 - 30 * s)})`; ctx.fill();
      if (i % 2 === 0) { ctx.fillStyle = col.s[4]; ctx.beginPath(); ctx.arc(L + 12 + f * (R - L - 24), 70, 2.5, 0, 7); ctx.fill(); } }
    text(ctx, 'blood in (40)', L, 124, { color: col.muted, size: 10 }); text(ctx, `blood out (${pO2(T).toFixed(0)})`, R, 124, { color: col.ink, size: 10.5, weight: 700, align: 'right' });
    // curve
    const gx = 44, gy = 142, gw = R - gx, gh = h - gy - 36;
    const X = (s) => gx + (s / 0.8) * gw, Y = (p) => gy + gh - (p / 110) * gh;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(gx, gy, gw, gh);
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 0; i <= 50; i++) { const s = 0.8 * i / 50; i ? ctx.lineTo(X(s), Y(pO2(s))) : ctx.moveTo(X(s), Y(pO2(s))); } ctx.stroke();
    ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(gx, Y(P())); ctx.lineTo(R, Y(P())); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = col.s[5]; ctx.beginPath(); ctx.moveTo(X(T), gy); ctx.lineTo(X(T), gy + gh); ctx.stroke();
    ctx.fillStyle = col.s[5]; ctx.beginPath(); ctx.arc(X(T), Y(pO2(T)), 5, 0, 7); ctx.fill();
    [0, 50, 100].forEach((v) => text(ctx, String(v), gx - 6, Y(v), { color: col.muted, size: 10, align: 'right', fit: false }));
    text(ctx, 'pO₂ (mmHg)', 4, gy - 8, { color: col.ink, size: 10.5, weight: 700, fit: false });
    text(ctx, 'time in the capillary (s): red line = how long blood stays', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  show();
}
