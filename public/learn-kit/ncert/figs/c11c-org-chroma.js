// Class 11 Chemistry, Organic Chemistry basics: chromatography. A solvent climbs a paper or silica plate and carries each component of a mixture a different distance:
// compounds that stick to the plate move little, those that dissolve well in the solvent move far. Rf = distance moved by the spot / distance moved by the solvent front (always between 0 and 1).
// Illustrative Rf values for leaf pigments in petroleum ether-acetone; a more polar solvent carries polar spots further (modelled as Rf^p).
import { canvas, text, title, slider, choice, readout, row, loop } from '../../kit.js';

const MIX = {
  leaf: { n: 'leaf pigments', c: [['carotene', 0.95, 0], ['xanthophyll', 0.7, 1], ['chlorophyll a', 0.55, 2], ['chlorophyll b', 0.4, 3]] },
  ink: { n: 'black ink', c: [['yellow dye', 0.85, 1], ['red dye', 0.6, 3], ['blue dye', 0.3, 0]] },
};
const P = { low: ['weaker solvent', 1.7], mid: ['medium solvent', 1], high: ['stronger solvent', 0.55] };
export default function (host) {
  let mk = 'leaf', sv = 'mid', t = 0.6, playing = false;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'A chromatography plate with a solvent front rising and coloured spots at different heights' });
  const ctl = row(host), ro = readout(host);
  const anim = loop(host, (dt) => { if (playing) { t = Math.min(1, t + dt * 0.12); sl.set(t); if (t >= 1) playing = false; go(); } }, { autoplay: true });
  choice(ctl, 'mixture', Object.entries(MIX).map(([a, d]) => [a, d.n]), mk, (v) => { mk = v; go(); });
  choice(ctl, 'solvent', Object.entries(P).map(([a, d]) => [a, d[0]]), sv, (v) => { sv = v; go(); });
  const sl = slider(ctl, { label: 'time (solvent front rise)', min: 0, max: 1, step: 0.01, value: t, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { t = v; playing = false; go(); } });
  const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'lk-btn'; bt.textContent = '▶ Run'; bt.addEventListener('click', () => { t = 0; playing = true; sl.set(0); go(); }); ctl.appendChild(bt);
  const rf = (b) => Math.pow(b, P[sv][1]);
  const go = () => { const d = MIX[mk]; ro.textContent = d.c.map(([n, b]) => `${n} Rf = ${rf(b).toFixed(2)}`).join('; ') + '. Rf = spot distance ÷ solvent distance, so it does not depend on how long you wait (once the front has moved).'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Chromatography: Rf = d(spot) ÷ d(solvent)', col);
    const x0 = w * 0.18, pw = w * 0.34, ytop = 54, ybase = h - 54, H = ybase - ytop, front = ytop + H * (1 - t * 0.95);
    ctx.fillStyle = col.soft; ctx.fillRect(x0, ytop, pw, H); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x0, ytop, pw, H);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(x0, front, pw, ybase - front); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(x0 - 6, front); ctx.lineTo(x0 + pw + 6, front); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'solvent front', x0 + pw + 10, front, { color: col.s[0], size: 10.5, weight: 700 });
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(x0 - 6, ybase - 10); ctx.lineTo(x0 + pw + 6, ybase - 10); ctx.stroke(); text(ctx, 'start line', x0 + pw + 10, ybase - 10, { color: col.muted, size: 10 });
    const d = MIX[mk], fd = ybase - 10 - front;
    d.c.forEach(([n, b, ci], i) => {
      const dist = fd * rf(b), y = ybase - 10 - dist, x = x0 + pw * (0.2 + 0.6 * ((i + 0.5) / d.c.length));
      ctx.beginPath(); ctx.ellipse(x, y, 9, 6, 0, 0, 7); ctx.fillStyle = col.s[ci]; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
      if (fd > 80) { ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(x + 10, y); ctx.lineTo(x0 + pw + 46, y); ctx.stroke(); ctx.setLineDash([]); text(ctx, `${n}  ${rf(b).toFixed(2)}`, x0 + pw + 50, y, { color: col.ink, size: 10, weight: 700 }); }
    });
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(x0 + pw / 2, ybase - 10, 3, 0, 7); ctx.fill();
    text(ctx, fd > 80 ? 'each spot moved Rf × the distance the solvent moved' : 'let the solvent climb: drag the time slider or press Run', w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
