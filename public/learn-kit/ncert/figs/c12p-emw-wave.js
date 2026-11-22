// Class 12 Electromagnetic Waves: a plane electromagnetic wave travelling along x. The electric field E (vertical) and
// the magnetic field B (horizontal, drawn slanted to show depth) oscillate in step, at right angles to each other and to
// the direction of travel. In vacuum E0/B0 = c = 3e8 m/s and lambda = c/f. Choose a frequency and the field strength.
import { canvas, line, text, title, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  const BANDS = [['FM radio 100 MHz', 1e8], ['Wi-Fi 2.4 GHz', 2.4e9], ['Red light', 4.3e14], ['X-rays 10¹⁸ Hz', 1e18]];
  let bi = 0, E0 = 10, show = 'both', t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 280, label: 'Electric and magnetic fields of a travelling electromagnetic wave' });
  const ctl = row(host);
  choice(ctl, 'Wave', BANDS.map((b, i) => [i, b[0]]), bi, (v) => { bi = v; upd(); });
  slider(ctl, { label: 'Electric field amplitude E₀', min: 1, max: 100, step: 1, value: E0, fmt: (v) => `${v} V/m`, oninput: (v) => { E0 = v; upd(); } });
  choice(ctl, 'Show', [['both', 'E and B'], ['E', 'E only'], ['B', 'B only']], show, (v) => { show = v; upd(); });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  const c = 3e8;
  function upd() {
    const f = BANDS[bi][1], lam = c / f, B0 = E0 / c;
    const L = lam >= 1 ? `${lam.toPrecision(3)} m` : lam >= 1e-3 ? `${(lam * 100).toPrecision(3)} cm` : lam >= 1e-6 ? `${(lam * 1e6).toPrecision(3)} µm` : `${(lam * 1e9).toPrecision(3)} nm`;
    out.innerHTML = `f = ${(f / 10 ** Math.floor(Math.log10(f))).toFixed(1)} × 10<sup>${Math.floor(Math.log10(f))}</sup> Hz, λ = c/f = <b>${L}</b>. B₀ = E₀/c = <b>${(B0 * 1e9).toFixed(1)} nT</b>. E and B are always in phase: both are zero together, both peak together.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'EM wave: E ⟂ B ⟂ direction of travel', col);
    const ox = 30, oy = top + (h - top) / 2 + 6, len = w - 60, amp = Math.min(70, (h - top) / 2 - 30) * (0.35 + 0.65 * E0 / 100), lam = len / 2.2, k = (2 * Math.PI) / lam;
    const proj = (x, e, b) => [ox + x - 0.5 * b, oy - e + 0.5 * b];
    line(ctx, [[ox, oy], [ox + len, oy]], col.ink, 1.5); arrow(ctx, ox + len - 20, oy, ox + len, oy, col.ink, 1.5, 8);
    text(ctx, 'direction of travel', ox + len, oy + 18, { color: col.muted, size: 11, align: 'right' });
    const val = (x) => Math.sin(k * x - t * 3.2);
    if (show !== 'B') { const a = []; for (let x = 0; x <= len; x += 3) a.push(proj(x, amp * val(x), 0)); line(ctx, a, col.s[0], 2.2); }
    if (show !== 'E') { const a = []; for (let x = 0; x <= len; x += 3) a.push(proj(x, 0, amp * val(x))); line(ctx, a, col.s[1], 2.2); }
    for (let x = 6; x < len; x += lam / 8) {
      const v = val(x);
      if (show !== 'B') arrow(ctx, ...proj(x, 0, 0), ...proj(x, amp * v, 0), col.s[0], 1.4, 5);
      if (show !== 'E') arrow(ctx, ...proj(x, 0, 0), ...proj(x, 0, amp * v), col.s[1], 1.4, 5);
    }
    text(ctx, 'E (electric)', 12, top + 14, { color: col.s[0], size: 11.5, weight: 700 }); text(ctx, 'B (magnetic)', 12, top + 30, { color: col.s[1], size: 11.5, weight: 700 });
    text(ctx, "one wavelength λ", ox + lam, oy + amp + 18, { color: col.muted, size: 10.5, align: 'center' });
    line(ctx, [[ox, oy + amp + 8], [ox + lam, oy + amp + 8]], col.muted, 1.5);
  };
  upd();
}
