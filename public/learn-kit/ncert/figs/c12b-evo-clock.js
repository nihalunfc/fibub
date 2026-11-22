// Class 12 Evolution: the history of Earth squeezed into one 24-hour day. Earth forms at 00:00 (4.6 billion years ago) and "now" is midnight. Slide the clock hand to see what has happened by each hour.
// Dates are rounded (billion years ago, bya): oldest cells 3.8, oxygen-producing photosynthesis 2.7, eukaryotes 2.0, animals 0.6, land plants 0.47, dinosaurs 0.23, genus Homo 0.0025, Homo sapiens 0.0003.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

const EV = [
  [4.6, 'Earth forms'], [3.8, 'first cells (prokaryotes)'], [2.7, 'photosynthesis fills the air with oxygen'], [2.0, 'first eukaryotic cells'], [0.6, 'first animals'],
  [0.47, 'plants reach land'], [0.37, 'amphibians'], [0.23, 'dinosaurs appear'], [0.066, 'dinosaurs die out'], [0.0025, 'genus Homo'], [0.0003, 'Homo sapiens'],
];
export default function (host) {
  let t = 0.2;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A 24-hour clock showing when major events in the history of life happened if Earth formed at midnight' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Time on the clock', min: 0, max: 1, step: 0.001, value: t, fmt: (v) => { const m = Math.floor(v * 1440); return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; }, oninput: (v) => { t = v; go(); } });
  const bya = () => 4.6 * (1 - t);
  const go = () => {
    const b = bya(), past = EV.filter((e) => e[0] >= b), last = past[past.length - 1];
    ro.textContent = `${b >= 0.01 ? b.toFixed(2) : b.toFixed(4)} billion years ago. Latest event so far: ${last ? last[1] + ' (' + last[0] + ' bya)' : 'none'}. Notice how late animals, plants and humans arrive: for the first 20 hours of the day there were only microbes.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Earth’s history as one day', col), cx = w / 2, R = Math.min(w / 2 - 60, (h - t0 - 110) / 2), cy = t0 + 28 + R;
    const ang = (f) => -Math.PI / 2 + f * 2 * Math.PI;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.strokeStyle = col.line; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, R, ang(0), ang(t)); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 6; ctx.stroke();
    for (let k = 0; k < 24; k += 6) { const a = ang(k / 24); text(ctx, String(k).padStart(2, '0') + ':00', cx + (R + 16) * Math.cos(a), cy + (R + 16) * Math.sin(a), { color: col.muted, size: 10, align: 'center' }); }
    EV.forEach(([by, nm], i) => {
      const f = (4.6 - by) / 4.6, a = ang(f), x = cx + R * Math.cos(a), y = cy + R * Math.sin(a), on = f <= t + 1e-9;
      dot(ctx, x, y, on ? 5 : 3, on ? col.s[3] : col.line, on ? col.bg : null);
    });
    const a = ang(t); line(ctx, [[cx, cy], [cx + (R - 8) * Math.cos(a), cy + (R - 8) * Math.sin(a)]], col.ink, 3); dot(ctx, cx, cy, 4, col.ink);
    const shown = EV.filter((e) => (4.6 - e[0]) / 4.6 <= t + 1e-9).slice(-3);
    shown.forEach(([by, nm], i) => { const f = (4.6 - by) / 4.6, hh = f * 24, hr = Math.floor(hh), mn = Math.floor((hh - hr) * 60); text(ctx, `${String(hr).padStart(2, '0')}:${String(mn).padStart(2, '0')}  ${nm}`, cx, cy + R + 30 + i * 15, { color: col.ink, size: 10.5, weight: i === shown.length - 1 ? 700 : 400, align: 'center' }); });
  };
  go();
}
