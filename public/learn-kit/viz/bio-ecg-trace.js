// An ECG drawn live: the P wave is the atria depolarising (they squeeze), the QRS complex is the ventricles
// depolarising (they squeeze, and the atria relax), the T wave is the ventricles resetting. Slide the heart rate and
// notice that the picture compresses but the waves keep their order. The small heart colours the chambers that are
// being activated right now.
import { canvas, loop, row, slider, choice, readout, text, title } from '../kit.js';

const g = (t, c, w, a) => a * Math.exp(-(((t - c) / w) ** 2));
const ecg = (u) => g(u, 0.12, 0.025, 0.15) + g(u, 0.235, 0.008, -0.12) + g(u, 0.26, 0.011, 1.0) + g(u, 0.285, 0.009, -0.25) + g(u, 0.5, 0.05, 0.3);

export default function (host) {
  let bpm = 70, t = 0, block = 'normal';
  const cv = canvas(host, { aspect: 0.7, max: 340, min: 260, label: 'A moving ECG trace with the heart chambers lit as each wave occurs' });
  const ctl = row(host);
  loop(host, (dt) => { t += dt; cv.redraw(); }).button(ctl);
  slider(ctl, { label: 'Heart rate', min: 40, max: 180, step: 1, value: bpm, fmt: (v) => `${v}/min`, oninput: (v) => { bpm = v; show(); } });
  const c2 = row(host);
  choice(c2, 'Show', [['normal', 'Normal'], ['dropped', 'Dropped beat (block)']], block, (v) => { block = v; show(); });
  const out = readout(host);
  const show = () => { out.innerHTML = `${bpm} beats/min, one beat = <b>${(60 / bpm).toFixed(2)} s</b> (RR interval). P: atria depolarise. QRS: ventricles depolarise (strong, fast). T: ventricles repolarise. ${block === 'dropped' ? 'Every 3rd beat the P wave is not followed by a QRS: the signal was blocked between atria and ventricles.' : ''}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Electrocardiogram (lead II)', col);
    const L = 10, R = w - 10, B = h * 0.72, sc = h * 0.3, span = 2.4, beat = 60 / bpm;
    const val = (tt) => { const k = Math.floor(tt / beat), u = (tt - k * beat) / beat; if (block === 'dropped' && k % 3 === 2) return g(u, 0.12, 0.025 * 1, 0.15); return ecg(u); };
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(L + (R - L) * i / 12, 30); ctx.lineTo(L + (R - L) * i / 12, B + 20); ctx.stroke(); }
    ctx.strokeStyle = col.s[5]; ctx.lineWidth = 2; ctx.beginPath();
    for (let x = 0; x <= R - L; x += 1.5) { const tt = t - span + (x / (R - L)) * span; if (tt < 0) { x ? ctx.lineTo(L + x, B) : ctx.moveTo(L + x, B); continue; } const y = B - val(tt) * sc; x ? ctx.lineTo(L + x, y) : ctx.moveTo(L + x, y); }
    ctx.stroke();
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(R, B - val(t) * sc, 4, 0, 7); ctx.fill();
    const k = Math.floor(t / beat), u = (t - k * beat) / beat, drop = block === 'dropped' && k % 3 === 2;
    const ph = u < 0.09 ? 'rest' : u < 0.17 ? 'P' : u < 0.23 ? 'PR' : u < 0.3 ? 'QRS' : u < 0.43 ? 'ST' : u < 0.6 ? 'T' : 'rest';
    const label = { rest: 'resting (diastole)', P: 'P wave: atria depolarising', PR: 'pause at the AV node', QRS: drop ? 'no QRS: blocked' : 'QRS: ventricles depolarising', ST: 'ventricles contracting', T: 'T wave: ventricles resetting' }[ph];
    text(ctx, label, L + 2, h - 10, { color: col.ink, size: 12, weight: 700 });
    // mini heart
    const hx = w - 52, hy = 52, on = (a, v) => { ctx.beginPath(); ctx.ellipse(hx + a * 14, hy + (v ? 14 : -10), 13, v ? 15 : 10, 0, 0, 7); ctx.fillStyle = (v ? (ph === 'QRS' && !drop) || ph === 'ST' : ph === 'P') ? col.bad : col.line; ctx.fill(); ctx.strokeStyle = col.muted; ctx.stroke(); };
    on(-1, 0); on(1, 0); on(-1, 1); on(1, 1);
    text(ctx, 'red = active', hx, hy + 40, { color: col.muted, size: 9.5, align: 'center', fit: false });
  };
  show();
}
