// Class 9 Sound: pitch and loudness. Frequency (vibrations per second, hertz) sets the pitch: more vibrations, higher
// pitch. Amplitude (the biggest displacement) sets the loudness: bigger amplitude, louder sound, and the sound carries
// more energy. The picture is a snapshot of air-pressure against distance, scrolling to the right. The loudness meter
// is an illustrative scale of 60 + 20 log10(amplitude) decibels, not a calibrated measurement.
import { canvas, text, title, line, arrow, row, slider, button, loop, readout, font } from '../../kit.js';

export default function (host) {
  let f = 440, A = 0.6, t = 0, ac = null, osc = null, gain = null, on = false;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'A sound wave whose frequency and amplitude you set, with pitch and loudness meters' });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  slider(ctl, { label: 'Frequency', min: 100, max: 2000, value: f, log: true, fmt: (v) => `${Math.round(v)} Hz`, oninput: (v) => { f = v; upd(); } });
  slider(ctl, { label: 'Amplitude', min: 0.1, max: 1, step: 0.05, value: A, fmt: (v) => v.toFixed(2), oninput: (v) => { A = v; upd(); } });
  const btn = button(ctl, '🔊 Hear it', () => {
    try {
      if (!on) { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); osc = ac.createOscillator(); gain = ac.createGain(); osc.frequency.value = f; gain.gain.value = 0.2 * A * 0.5; osc.connect(gain).connect(ac.destination); osc.start(); on = true; btn.textContent = '■ Stop sound'; }
      else { osc.stop(); on = false; btn.textContent = '🔊 Hear it'; }
    } catch (e) { btn.textContent = 'Sound not available'; }
  });
  const out = readout(host);
  function upd() {
    if (on && osc) { osc.frequency.value = f; gain.gain.value = 0.2 * A * 0.5; }
    const db = 60 + 20 * Math.log10(A);
    out.innerHTML = `<b>${Math.round(f)} Hz</b> = ${Math.round(f)} vibrations every second, period T = 1/f = ${(1000 / f).toFixed(2)} ms. Amplitude ${A.toFixed(2)} gives about ${Math.round(db)} dB on this scale. Change the frequency and only the pitch moves; change the amplitude and only the loudness moves.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Pitch and loudness of a sound', col);
    const x0 = 14, L = w - 28, cy = h * 0.3, amp = h * 0.17 * A;
    const cyc = 1.5 + 6 * (Math.log10(f) - 2) / (Math.log10(2000) - 2);
    line(ctx, [[x0, cy], [x0 + L, cy]], col.line, 1);
    const ph = t * 4, pts = [];
    for (let i = 0; i <= L; i += 2) pts.push([x0 + i, cy - amp * Math.sin(2 * Math.PI * cyc * i / L - ph)]);
    line(ctx, pts, col.s[2], 2.6);
    const ya = cy + h * 0.2, lw = L / cyc;
    arrow(ctx, x0, ya, x0 + lw, ya, col.s[3], 1.5, 6); arrow(ctx, x0 + lw, ya, x0, ya, col.s[3], 1.5, 6);
    text(ctx, 'one wavelength', x0 + lw / 2, ya + 11, { color: col.s[3], size: 10, weight: 700, align: 'center' });
    // amplitude
    const xm = x0 + L - 20, ym = cy - amp;
    arrow(ctx, xm, cy, xm, ym, col.s[1], 1.8, 6);
    text(ctx, 'amplitude', xm - 4, Math.min(ym, cy - 10) - 8, { color: col.s[1], size: 10, weight: 700, align: 'right' });
    // meters
    const my = h * 0.66, mh = 12;
    text(ctx, `Pitch: ${Math.round(f)} Hz`, x0, my - 12, { color: col.ink, size: 11, weight: 700 });
    ctx.fillStyle = col.soft; ctx.fillRect(x0, my, L, mh);
    const px = x0 + L * (Math.log10(f) - 2) / (Math.log10(2000) - 2);
    ctx.fillStyle = col.s[2]; ctx.fillRect(x0, my, Math.max(3, px - x0), mh);
    text(ctx, 'low (bass drum)', x0, my + mh + 10, { color: col.muted, size: 10 });
    text(ctx, 'high (whistle)', x0 + L, my + mh + 10, { color: col.muted, size: 10, align: 'right' });
    const ly = h * 0.86, db = 60 + 20 * Math.log10(A);
    text(ctx, `Loudness: about ${Math.round(db)} dB`, x0, ly - 12, { color: col.ink, size: 11, weight: 700 });
    ctx.fillStyle = col.soft; ctx.fillRect(x0, ly, L, mh);
    ctx.fillStyle = col.s[1]; ctx.fillRect(x0, ly, L * (db - 40) / 40, mh);
    text(ctx, 'soft', x0, ly + mh + 10, { color: col.muted, size: 10 });
    text(ctx, 'loud', x0 + L, ly + mh + 10, { color: col.muted, size: 10, align: 'right' });
  };
  upd();
  return {};
}
