// Class 12 Dual Nature: why the wave theory of light failed the photoelectric experiment. Wave theory: light energy arrives smoothly, spread over the
// plate, so an electron must soak up energy for a while (the dimmer the light, the longer) until it holds phi, at ANY frequency. Experiment: emission is
// instant (< 1e-9 s), and it never happens below the threshold frequency however bright or long. Photon theory: one photon hands over all of h nu at once.
// Press Restart and compare the two energy bars.
import { canvas, text, title, row, slider, choice, button, readout, line, loop } from '../../kit.js';

export default function (host) {
  let th = 'wave', I = 50, f = 8, t = 0, done = -1;
  const phi = 2.3, hv = () => 4.136e-15 * f * 1e14;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 280, label: 'Energy building up in an electron: wave theory against photon theory' });
  const ctl = row(host);
  choice(ctl, 'Theory', [['wave', 'Wave'], ['photon', 'Photon']], th, (v) => { th = v; t = 0; done = -1; cv.redraw(); });
  slider(ctl, { label: 'Brightness', min: 10, max: 100, step: 5, value: I, fmt: (v) => `${v}%`, oninput: (v) => { I = v; t = 0; done = -1; } });
  slider(ctl, { label: 'Frequency ν', min: 3, max: 12, step: 0.1, value: f, fmt: (v) => `${v.toFixed(1)}×10¹⁴ Hz`, oninput: (v) => { f = v; t = 0; done = -1; } });
  button(ctl, 'Restart', () => { t = 0; done = -1; });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, th === 'wave' ? 'Wave theory: energy fills up slowly' : 'Photon theory: one photon pays at once', col) + 6;
    const bx = w * 0.2, bw = w * 0.22, by1 = h - 44, bh = h - top - 80, Y = (e) => by1 - (e / 5) * bh;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, by1 - bh, bw, bh);
    line(ctx, [[bx - 10, Y(phi)], [bx + bw + 40, Y(phi)]], col.s[3], 2, [6, 3]); text(ctx, `φ = ${phi} eV`, bx + bw + 44, Y(phi), { color: col.s[3], size: 11.5, weight: 700 });
    const Tw = 40 / (I / 10), clock = (t * 5) % (Tw * 1.6 + 6); // simulated seconds (5x speed)
    let e = 0, msg = '';
    if (th === 'wave') { e = Math.min(phi, (clock / Tw) * phi); if (clock >= Tw && done < 0) done = clock; msg = clock >= Tw ? 'enough: the electron leaves, after a long wait' : 'electron still soaking up energy…'; }
    else { if (hv() >= phi) { e = clock > 0.02 ? hv() : 0; msg = 'a photon hν arrives and the electron leaves at once'; } else { e = 0; msg = 'each photon is smaller than φ: it bounces off, nothing ever happens'; } }
    const eShow = Math.min(5, e);
    ctx.fillStyle = e >= phi ? col.s[2] : col.s[0]; ctx.fillRect(bx, Y(eShow), bw, by1 - Y(eShow));
    text(ctx, 'energy in the electron', bx + bw / 2, by1 + 14, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, msg, w * 0.5, top + 8, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    text(ctx, `clock: ${clock.toFixed(1)} s (simulated)`, w - 10, by1 - bh + 6, { color: col.muted, size: 10.5, align: 'right' });
    if (th === 'wave') { text(ctx, `wait ≈ ${Tw.toFixed(0)} s`, w - 10, by1 - bh + 22, { color: col.s[1], size: 11.5, weight: 700, align: 'right' }); text(ctx, 'for any frequency', w - 10, by1 - bh + 38, { color: col.s[1], size: 11, align: 'right' }); }
    else { text(ctx, `photon: hν = ${hv().toFixed(2)} eV`, w - 10, by1 - bh + 22, { color: col.s[1], size: 11.5, weight: 700, align: 'right' }); text(ctx, hv() >= phi ? 'bigger than φ: emits' : 'smaller than φ: nothing', w - 10, by1 - bh + 38, { color: col.s[1], size: 11, align: 'right' }); }
    out.innerHTML = th === 'wave' ? 'Wave theory predicts a <b>time lag</b> that grows when the light is dimmed, and emission at <b>every</b> frequency if you wait. Experiments show neither.' : 'Photon theory predicts <b>no lag</b> and <b>no emission below ν₀</b> however bright the light: exactly what the experiments show. (Sodium: ν₀ = 5.6×10¹⁴ Hz.)';
  };
  cv.redraw();
}
