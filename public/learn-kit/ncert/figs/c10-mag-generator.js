// Class 10 Magnetic Effects: the AC electric generator. A coil turned in a magnetic field has an emf induced in it that
// changes with the angle: it is largest when the sides cut the field at right angles (coil along the field), zero when the
// coil is across the field, and it reverses every half turn, so one full turn gives one complete cycle of alternating
// current (AC). With slip rings the output alternates (AC). With a split-ring commutator it is made one-way (DC) but
// still pulsing. India's mains: AC at 50 Hz, i.e. 50 cycles every second (the coil in the power station turns 50 times/s
// for a 2-pole machine, usually geared down with more poles). emf ~ cos(angle) here.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let th = 0, kind = 'ac', rps = 0.6, hist = [], t = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'A coil rotating in a magnetic field and the alternating voltage it produces' });
  const ctl = row(host);
  choice(ctl, 'Output', [['ac', 'Slip rings (AC)'], ['dc', 'Split ring (DC)']], kind, (v) => { kind = v; hist = []; update(); });
  slider(ctl, { label: 'Speed of turning', min: 0.2, max: 1.5, step: 0.1, value: rps, fmt: (v) => `${v.toFixed(1)} turns/s`, oninput: (v) => { rps = v; update(); } });
  const out = readout(host);
  function update() { out.innerHTML = kind === 'ac' ? `One full turn gives <b>one complete cycle</b>: the voltage rises to a maximum, falls to zero, reverses, and returns. Faster turning gives more cycles per second (frequency) <i>and</i> a bigger voltage. India’s supply is <b>50 Hz</b>.` : `The split ring flips the connection every half turn, so the output always has the same sign: <b>direct current</b> (but it still pulses; real generators use many coils to smooth it).`; }
  loop(host, (dt) => { t += dt; th += dt * rps * 2 * Math.PI; const e = Math.cos(th), v = kind === 'ac' ? e : Math.abs(e); hist.push([t, v]); while (hist.length && t - hist[0][0] > 4.2) hist.shift(); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Generator: turning a coil makes an emf', col);
    // end view on the left
    const cx = w * 0.2, cy = h * 0.38, r = Math.min(w * 0.11, 44);
    ctx.fillStyle = '#e5241d'; ctx.fillRect(4, cy - 34, 12, 68); ctx.fillStyle = '#2a6df4'; ctx.fillRect(cx * 2 - 16 + 8, cy - 34, 12, 68); text(ctx, 'N', 10, cy, { color: '#fff', size: 11, weight: 700, align: 'center' }); text(ctx, 'S', cx * 2 - 2, cy, { color: '#fff', size: 11, weight: 700, align: 'center' });
    const x1 = cx + r * Math.cos(th), y1 = cy - r * Math.sin(th), x2 = cx - r * Math.cos(th), y2 = cy + r * Math.sin(th);
    for (const dy of [-18, 0, 18]) arrow(ctx, 22, cy + dy, cx * 2 - 20, cy + dy, col.s[0], 0.9, 5);
    line(ctx, [[x1, y1], [x2, y2]], col.ink, 3); dot(ctx, x1, y1, 5.5, col.s[1]); dot(ctx, x2, y2, 5.5, col.s[2]); dot(ctx, cx, cy, 2.5, col.ink);
    text(ctx, 'coil, end view', cx, cy + r + 24, { color: col.muted, size: 10, align: 'center' });
    // the live reading: a bar showing the instantaneous emf
    const e = Math.cos(th), v = kind === 'ac' ? e : Math.abs(e), bx = w * 0.5, by = cy - 4, bw = w * 0.4;
    line(ctx, [[bx, by], [bx + bw, by]], col.line, 1.4); line(ctx, [[bx + bw / 2, by - 30], [bx + bw / 2, by + 30]], col.line, 1.4);
    line(ctx, [[bx + bw / 2, by], [bx + bw / 2 + v * bw / 2, by]], v >= 0 ? col.s[0] : col.s[1], 9);
    text(ctx, 'output voltage now', bx + bw / 2, by - 40, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, Math.abs(e) > 0.97 ? 'maximum: coil along the field' : Math.abs(e) < 0.12 ? 'zero: coil across the field' : '', bx + bw / 2, by + 30, { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
    // the voltage graph, scrolling
    const gx = 14, gw = w - 28, gy = h * 0.8, gh = h * 0.18; line(ctx, [[gx, gy], [gx + gw, gy]], col.line, 1.2); text(ctx, 'voltage', gx, gy - gh - 6, { color: col.muted, size: 10 }); text(ctx, 'time →', gx + gw, gy + 12, { color: col.muted, size: 10, align: 'right' });
    ctx.save(); ctx.beginPath(); ctx.rect(gx, gy - gh - 4, gw, 2 * gh + 8); ctx.clip(); ctx.strokeStyle = kind === 'ac' ? col.s[0] : col.s[1]; ctx.lineWidth = 2.2; ctx.beginPath();
    hist.forEach(([tt, vv], i) => { const px = gx + gw - ((t - tt) / 4.2) * gw, py = gy - vv * gh; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.stroke(); ctx.restore();
    text(ctx, kind === 'ac' ? 'alternating: + then −' : 'direct: always +', gx + gw, gy - gh - 6, { color: col.ink, size: 10.5, weight: 700, align: 'right' });
  };
  update();
}
