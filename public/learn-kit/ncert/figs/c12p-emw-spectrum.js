// Class 12 Electromagnetic Waves: the electromagnetic spectrum on a log scale from 1 kHz to 10^22 Hz. Slide through
// real examples from everyday India (AM radio, FM, mobile, Wi-Fi, microwave oven, remote, light, X-rays). For each:
// lambda = c/f and the photon energy E = hf in electronvolts. All are the same wave, differing only in frequency.
import { canvas, line, text, title, row, slider, readout } from '../../kit.js';

const sci = (x, d = 3) => { const e = Math.floor(Math.log10(Math.abs(x))); return e >= -2 && e <= 4 ? String(+x.toPrecision(d)) : `${(x / 10 ** e).toPrecision(d)} × 10<sup>${e}</sup>`; };

export default function (host) {
  const E = [
    ['AM radio (Vividh Bharati)', 1e6, 'radio', 'Carried by the ground and the ionosphere; a big antenna is needed.'],
    ['Short-wave radio', 1.5e7, 'radio', 'Bounces off the ionosphere: All India Radio reaches other countries.'],
    ['FM radio', 1e8, 'radio', 'Line of sight, so a tall tower covers a city.'],
    ['Mobile phone (4G)', 1.8e9, 'microwave', 'Microwaves from a nearby tower; the antenna in your phone is a few cm long.'],
    ['Wi-Fi / microwave oven', 2.45e9, 'microwave', 'This frequency makes water molecules in food rotate and heat up.'],
    ['Radar', 1e10, 'microwave', 'Pulses reflect from aircraft, rain clouds (weather radar) and speeding cars.'],
    ['TV remote', 3.2e14, 'infrared', 'Infrared pulses you cannot see; a phone camera can.'],
    ['Red light', 4.3e14, 'visible', 'Longest wavelength your eye sees.'],
    ['Violet light', 7.5e14, 'visible', 'Shortest wavelength your eye sees.'],
    ['UV sterilizer', 1.2e15, 'ultraviolet', 'Kills germs in water purifiers; also causes sunburn.'],
    ['Dental X-ray', 1e18, 'X-ray', 'Passes through soft tissue but not bone or teeth.'],
    ['Gamma ray (cobalt-60)', 3e20, 'gamma', 'From atomic nuclei; used to sterilise equipment and treat cancer.'],
  ];
  const BANDS = [['radio', 3, 9, 4], ['micro', 9, 11.5, 2], ['IR', 11.5, 14.6, 3], ['vis', 14.6, 14.88, 7], ['UV', 14.88, 16.5, 5], ['X-ray', 16.5, 19.5, 1], ['γ', 19.5, 22, 0]];
  let i = 0;
  const cv = canvas(host, { aspect: 0.58, max: 440, min: 270, label: 'The electromagnetic spectrum on a logarithmic frequency scale with a marker' });
  const ctl = row(host);
  slider(ctl, { label: 'Pick an example', min: 0, max: E.length - 1, step: 1, value: i, fmt: (v) => E[v][0], oninput: (v) => { i = v; upd(); } });
  const out = readout(host);
  const c = 3e8, h = 6.626e-34, ev = 1.602e-19;
  const wl = (lam) => (lam >= 1 ? `${lam.toPrecision(3)} m` : lam >= 1e-2 ? `${(lam * 100).toPrecision(3)} cm` : lam >= 1e-3 ? `${(lam * 1000).toPrecision(3)} mm` : lam >= 1e-6 ? `${(lam * 1e6).toPrecision(3)} µm` : lam >= 1e-9 ? `${(lam * 1e9).toPrecision(3)} nm` : `${(lam * 1e12).toPrecision(3)} pm`);
  function upd() {
    const f = E[i][1], lam = c / f, en = (h * f) / ev;
    out.innerHTML = `<b>${E[i][0]}</b>: f = ${sci(f, 2)} Hz, λ = <b>${wl(lam)}</b>, photon energy hf = <b>${sci(en)} eV</b>. ${E[i][3]}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, hh, col) => {
    const top = title(ctx, `${E[i][2]} band`, col);
    const L = 14, R = w - 14, X = (lg) => L + ((lg - 3) / 19) * (R - L), y = top + 40, bh = 46;
    BANDS.forEach(([n, a, b, ci]) => {
      ctx.fillStyle = col.s[ci]; ctx.globalAlpha = 0.45; ctx.fillRect(X(a), y, X(b) - X(a), bh); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.strokeRect(X(a), y, X(b) - X(a), bh);
      if (X(b) - X(a) > 34) text(ctx, n, (X(a) + X(b)) / 2, y + bh / 2, { color: col.ink, size: 11, weight: 700, align: 'center' });
    });
    text(ctx, 'vis', X(14.74), y - 10, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    for (let g = 3; g <= 22; g += 3) { line(ctx, [[X(g), y + bh], [X(g), y + bh + 5]], col.muted, 1); text(ctx, `10${String(g).replace(/[0-9]/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d])}`, X(g), y + bh + 16, { color: col.muted, size: 10, align: 'center' }); }
    text(ctx, 'frequency (Hz): low energy → high energy', (L + R) / 2, y + bh + 36, { color: col.muted, size: 11, weight: 600, align: 'center' });
    const mx = X(Math.log10(E[i][1]));
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.moveTo(mx, y - 2); ctx.lineTo(mx - 7, y - 16); ctx.lineTo(mx + 7, y - 16); ctx.closePath(); ctx.fill();
    // wavelength strip: lengths drawn as sine wave of fixed 3 cycles, labelled
    const wy = y + bh + 90, lam = c / E[i][1];
    text(ctx, `λ = ${wl(lam)}`, 14, wy - 40, { color: col.s[0], size: 12.5, weight: 700 });
    const p = []; for (let k = 0; k <= 160; k++) p.push([14 + (k / 160) * (w - 28), wy + 20 * Math.sin((k / 160) * 6 * Math.PI)]);
    line(ctx, p, col.s[0], 2.2);
    text(ctx, '(the same 3 cycles drawn at every scale)', 14, wy + 38, { color: col.muted, size: 10.5 });
  };
  upd();
}
