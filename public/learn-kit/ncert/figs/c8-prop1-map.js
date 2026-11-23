// Class 8 Proportional Reasoning 1: a map scale 1 : N means 1 cm on the map is N cm on the ground. Drag the slider to measure a road
// on the map with a ruler and read the real distance: real = map length x N (then change cm to km: divide by 100 000).
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let L = 6, N = 500000;
  const cv = canvas(host, { aspect: 0.55, max: 440, min: 240, label: 'A ruler measuring a road on a map and the real distance it stands for' });
  const ctl = row(host);
  slider(ctl, { label: 'Map length (cm)', min: 1, max: 10, step: 0.5, value: L, fmt: (v) => v.toFixed(1), oninput: (v) => { L = v; upd(); } });
  choice(ctl, 'Scale 1 :', [[50000, '50 000'], [500000, '5 lakh'], [2500000, '25 lakh']], N, (v) => { N = v; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const km = L * N / 100000, t = title(ctx, 'Scale 1 : ' + N.toLocaleString('en-IN'), col), x0 = 24, cm = (w - 48) / 10, ry = t + 60;
    ctx.fillStyle = col.soft; ctx.fillRect(x0 - 8, t + 14, w - 32, 96); ctx.strokeStyle = col.line; ctx.strokeRect(x0 - 8, t + 14, w - 32, 96);
    ctx.beginPath(); ctx.moveTo(x0, ry - 20); ctx.bezierCurveTo(x0 + L * cm * 0.3, ry - 40, x0 + L * cm * 0.6, ry, x0 + L * cm, ry - 20); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(x0, ry - 20, 5, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(x0 + L * cm, ry - 20, 5, 0, 7); ctx.fill();
    const y = t + 128; ctx.fillStyle = col.panel; ctx.fillRect(x0, y, 10 * cm, 22); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.3; ctx.strokeRect(x0, y, 10 * cm, 22);
    for (let i = 0; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(x0 + i * cm, y); ctx.lineTo(x0 + i * cm, y + (i % 1 ? 6 : 10)); ctx.stroke(); text(ctx, String(i), x0 + i * cm, y + 17, { color: col.muted, size: 10, align: 'center' }); }
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.4; ctx.fillRect(x0, y, L * cm, 22); ctx.globalAlpha = 1;
    text(ctx, L.toFixed(1) + ' cm on the map  =  ' + (km >= 10 ? Math.round(km) : +km.toFixed(2)) + ' km on the ground', w / 2, h - 16, { color: col.ink, size: 14, weight: 700, align: 'center' });
  };
  function upd() { const km = L * N / 100000; out.innerHTML = `${L.toFixed(1)} cm × ${N.toLocaleString('en-IN')} = ${(L * N).toLocaleString('en-IN')} cm = <b>${+km.toFixed(2)} km</b>. (100 000 cm make 1 km.)`; cv.redraw(); }
  upd();
}
