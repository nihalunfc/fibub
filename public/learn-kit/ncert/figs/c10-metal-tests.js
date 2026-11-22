// Class 10 Metals and Non-metals: physical properties by test. Metals are malleable (hammer into sheets), ductile (draw
// into wire), good conductors, sonorous (ring when struck) and lustrous. Non-metals such as sulphur are brittle, snap,
// do not conduct, sound dull and have no shine. Graphite (a form of carbon) is the famous exception: it conducts.
import { canvas, text, title, line, dot, row, choice, readout, loop, ease, clamp, lerp } from '../../kit.js';

const M = {
  cu: { n: 'Copper', c: '#c8773a', metal: true, cond: true, lus: true }, al: { n: 'Aluminium', c: '#b9c0c8', metal: true, cond: true, lus: true },
  s: { n: 'Sulphur', c: '#e0cf3a', metal: false, cond: false, lus: false }, gr: { n: 'Graphite', c: '#4a4a4f', metal: false, cond: true, lus: false },
};
const TESTS = { ham: 'Hammer', wire: 'Stretch', cond: 'Conduct', ring: 'Strike', lus: 'Shine' };
export default function (host) {
  let m = 'cu', k = 'ham', t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 290, label: 'A hammer, stretching, electric circuit, striking and shine tests on metals and non-metals' });
  const ctl = row(host);
  choice(ctl, 'Material', Object.entries(M).map(([v, o]) => [v, o.n]), m, (v) => { m = v; t = 0; say(); });
  choice(ctl, 'Test', Object.entries(TESTS), k, (v) => { k = v; t = 0; say(); });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const out = readout(host);
  function say() {
    const o = M[m];
    out.innerHTML = { ham: o.metal ? `${o.n} is <b>malleable</b>: it flattens into a sheet (aluminium foil, silver foil on sweets).` : `${o.n} is <b>brittle</b>: it shatters into pieces and powder.`,
      wire: o.metal ? `${o.n} is <b>ductile</b>: it can be drawn into a thin wire (gold can make a wire 2 km long from just a gram).` : `${o.n} <b>snaps</b>: it cannot be drawn into wire.`,
      cond: o.cond ? `${o.n} <b>conducts</b> electricity: the bulb lights.${o.metal ? '' : ' This is the exception: graphite has free electrons between its layers.'}` : `${o.n} is an <b>insulator</b>: the bulb stays off.`,
      ring: o.metal ? `${o.n} is <b>sonorous</b>: it rings when struck (school bells, temple bells, anklets).` : `${o.n} gives a <b>dull thud</b>.`,
      lus: o.lus ? `${o.n} is <b>lustrous</b>: its fresh surface shines.` : `${o.n} is dull.` }[k];
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const o = M[m], top = title(ctx, `${o.n}: ${TESTS[k]} test`, col) + 8, c = (t % 4) / 4, cx = w / 2, cy = top + (h - top) * 0.5;
    const e = ease(clamp(c / 0.7, 0, 1));
    if (k === 'ham') {
      const wd = o.metal ? lerp(60, 120, e) : 60, ht = o.metal ? lerp(50, 14, e) : 50;
      if (o.metal || c < 0.3) { ctx.fillStyle = o.c; ctx.fillRect(cx - wd / 2, cy + 25 - ht, wd, ht); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(cx - wd / 2, cy + 25 - ht, wd, ht); }
      else for (let i = 0; i < 14; i++) { const a = i * 1.9, r = 14 + 40 * clamp((c - 0.3) / 0.4, 0, 1) * (0.4 + (i % 4) / 4); ctx.fillStyle = o.c; ctx.fillRect(cx + Math.cos(a) * r, cy + 18 + Math.abs(Math.sin(a * 3)) * 8 - 6, 7, 7); }
      const hy = cy - 55 + 50 * (c < 0.4 ? ease(c / 0.4) : 1 - ease((c - 0.4) / 0.4)); ctx.fillStyle = col.muted; ctx.fillRect(cx - 14, hy - 12, 28, 14); line(ctx, [[cx, hy + 2], [cx, hy + 28]], col.ink, 4);
      ctx.fillStyle = col.line; ctx.fillRect(cx - 80, cy + 28, 160, 6);
    } else if (k === 'wire') {
      const L = 70 + (o.metal ? 100 * e : 40 * clamp(e * 1.3, 0, 1)), th = o.metal ? lerp(18, 3, e) : 18;
      const snap = !o.metal && e > 0.75;
      if (!snap) { ctx.fillStyle = o.c; ctx.fillRect(cx - L / 2, cy - th / 2, L, th); } else { const g = 14 * (e - 0.75) * 4; ctx.fillStyle = o.c; ctx.fillRect(cx - L / 2 - g, cy - 9, L / 2 - 4, 18); ctx.fillRect(cx + 4 + g, cy - 9, L / 2 - 4, 18); }
      arrowSimple(ctx, cx - L / 2 - 36, cy, cx - L / 2 - 10, cy, col.ink); arrowSimple(ctx, cx + L / 2 + 36, cy, cx + L / 2 + 10, cy, col.ink);
      text(ctx, snap ? 'snaps' : o.metal ? 'drawn into wire' : 'stretching...', cx, cy + 40, { color: col.muted, size: 11, align: 'center' });
    } else if (k === 'cond') {
      const lx = cx, ly = cy - 36;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(cx - 90, cy - 36, 180, 80); ctx.stroke();
      ctx.fillStyle = col.panel; ctx.fillRect(cx - 28, cy + 36, 56, 16); ctx.fillStyle = o.c; ctx.fillRect(cx - 24, cy + 38, 48, 12); ctx.strokeStyle = col.ink; ctx.strokeRect(cx - 24, cy + 38, 48, 12);
      ctx.save(); ctx.globalAlpha = o.cond ? 0.5 + 0.4 * Math.sin(t * 8) * 0.3 + 0.2 : 0.05; ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(lx, ly, 20, 0, 7); ctx.fill(); ctx.restore();
      ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.arc(lx, ly, 14, 0, 7); ctx.stroke();
      text(ctx, 'cell', cx - 90, cy + 4, { color: col.muted, size: 10, align: 'right' }); text(ctx, o.cond ? 'bulb ON' : 'bulb OFF', cx + 96, cy - 36, { color: o.cond ? col.s[2] : col.bad, size: 11, weight: 700 });
      if (o.cond) for (let i = 0; i < 6; i++) { const f = (t * 0.4 + i / 6) % 1, per = 2 * (180 + 80), d = f * per; let x, y; const W = 180, H = 80; if (d < W) { x = cx - 90 + d; y = cy - 36; } else if (d < W + H) { x = cx + 90; y = cy - 36 + (d - W); } else if (d < 2 * W + H) { x = cx + 90 - (d - W - H); y = cy + 44; } else { x = cx - 90; y = cy + 44 - (d - 2 * W - H); } dot(ctx, x, y, 3, col.s[7]); }
      text(ctx, 'sample in the gap', cx, cy + 66, { color: col.muted, size: 10.5, align: 'center' });
    } else if (k === 'ring') {
      ctx.fillStyle = o.c; ctx.fillRect(cx - 30, cy - 10, 60, 30); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(cx - 30, cy - 10, 60, 30);
      const hit = c > 0.3; const hy = cy - 50 + 34 * (c < 0.3 ? ease(c / 0.3) : 1);
      ctx.fillStyle = col.muted; ctx.fillRect(cx - 7, hy - 8, 14, 10); line(ctx, [[cx, hy + 2], [cx, hy - 28]], col.ink, 3);
      if (hit) { const q = (c - 0.3) / 0.7; for (let i = 0; i < 3; i++) { const r = 20 + (q * 90 + i * 22) % 90; ctx.globalAlpha = o.metal ? (1 - r / 110) : 0.0; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy + 5, r, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; } text(ctx, o.metal ? 'TING!' : 'thud', cx, cy - 66, { color: o.metal ? col.s[0] : col.muted, size: 15, weight: 700, align: 'center' }); }
    } else {
      ctx.fillStyle = o.c; ctx.fillRect(cx - 60, cy - 24, 120, 48);
      if (o.lus) { const sx = cx - 90 + 180 * c; const g = ctx.createLinearGradient(sx - 25, 0, sx + 25, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.85)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.save(); ctx.beginPath(); ctx.rect(cx - 60, cy - 24, 120, 48); ctx.clip(); ctx.fillStyle = g; ctx.fillRect(sx - 25, cy - 24, 50, 48); ctx.restore(); }
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(cx - 60, cy - 24, 120, 48);
      text(ctx, o.lus ? 'fresh surface gleams' : 'no shine: dull', cx, cy + 42, { color: col.muted, size: 11, align: 'center' });
    }
  };
  say();
}
function arrowSimple(ctx, x0, y0, x1, y1, c) { ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); const a = Math.atan2(y1 - y0, x1 - x0); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 8 * Math.cos(a - 0.4), y1 - 8 * Math.sin(a - 0.4)); ctx.lineTo(x1 - 8 * Math.cos(a + 0.4), y1 - 8 * Math.sin(a + 0.4)); ctx.fill(); }
