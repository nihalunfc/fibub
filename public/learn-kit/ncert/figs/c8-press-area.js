// Class 8 Pressure: pressure = force / area. The same force on a small area (a nail tip) gives a large pressure and
// sinks in deep; spread over a big area (a flat board) the pressure is small and it barely sinks.
// Units: 1 pascal (Pa) = 1 newton per square metre. Sinking depth drawn proportional to pressure (illustration).
import { canvas, text, title, line, arrow, row, slider, choice, readout } from '../../kit.js';

const OBJ = { nail: ['Nail point', 0.000001], pin: ['Drawing pin tip', 0.00001], board: ['Flat board', 0.01] };
export default function (host) {
  let F = 50, key = 'nail';
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'A nail point and a flat board pressing on sand with the same force' });
  const ctl = row(host);
  choice(ctl, 'Pressed by', [['nail', 'Nail'], ['pin', 'Pin'], ['board', 'Board']], key, (v) => { key = v; upd(); });
  slider(ctl, { label: 'Force', min: 10, max: 100, step: 10, value: F, fmt: (z) => `${z} N`, oninput: (z) => { F = z; upd(); } });
  const out = readout(host);
  const P = () => F / OBJ[key][1];
  function upd() { const p = P(); out.innerHTML = `Pressure = force ÷ area = ${F} ÷ ${OBJ[key][1]} = <b>${p.toLocaleString('en-IN')} Pa</b> (${OBJ[key][0].toLowerCase()}). Small area, big pressure.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Same force, different area', col);
    const gy = h * 0.55, p = P(), depth = Math.min(h * 0.32, Math.log10(p + 1) * 7 * (F / 60 + 0.4)), cx = w / 2;
    ctx.fillStyle = col.line; ctx.fillRect(10, gy, w - 20, h - gy - 10);
    const aw = key === 'board' ? w * 0.46 : key === 'pin' ? 8 : 3;
    const y = gy + depth - 70;
    if (key === 'board') { ctx.fillStyle = col.s[2]; ctx.fillRect(cx - aw / 2, y + 56, aw, 14); }
    else { ctx.fillStyle = col.s[2]; ctx.fillRect(cx - 14, y, 28, 42); ctx.beginPath(); ctx.moveTo(cx - aw / 2 - 1, y + 42); ctx.lineTo(cx + aw / 2 + 1, y + 42); ctx.lineTo(cx, y + 70); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = col.panel; ctx.fillRect(cx - aw / 2 - 20, gy - 2, 2, 2);
    arrow(ctx, cx, Math.max(32, y - 34), cx, y - 2 + (key === 'board' ? 54 : 0) , col.s[1], 4, 9);
    text(ctx, `${F} N`, cx + 12, Math.max(34, y - 30), { color: col.s[1], size: 12, weight: 700 });
    text(ctx, 'sand', 16, gy + 16, { color: col.muted, size: 11 });
    text(ctx, `sinks ${depth.toFixed(0)} px`, w - 14, h - 18, { color: col.ink, size: 11.5, weight: 700, align: 'right' });
    text(ctx, `${(OBJ[key][1] * 10000).toFixed(OBJ[key][1] < 0.001 ? 2 : 0)} cm²`, 16, h - 18, { color: col.muted, size: 11 });
  };
  upd();
}
