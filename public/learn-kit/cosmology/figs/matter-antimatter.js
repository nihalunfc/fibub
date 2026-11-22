// 11.5 The great annihilation, as a tally. Each filled dot stands for many particles of matter, each ring for the
// same number of antiparticles. In the hot early universe they are made and destroyed in pairs all the time.
// As it cools below the energy needed to make them, the pairs annihilate into light. Roughly one extra particle
// of matter per billion pairs (the measured baryon-to-photon ratio today is η ≈ 6 × 10⁻¹⁰, so there are about
// 1.6 billion CMB photons per proton or neutron) is all that is left: every atom today.
// The picture is a toy: the real excess is far too small to draw, so one dot in 30 stands for it.
import { canvas, text, title, dot, rng, loop, lerp, clamp, calm, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 300, label: 'Matter and antimatter particles annihilating into light, leaving a tiny excess of matter' });
  const r = rng(5), NP = 30;
  const pairs = Array.from({ length: NP }, () => ({ x: 0.08 + 0.84 * r(), y: 0.08 + 0.84 * r(), a: r() * 6.283, d: 0.05 + 0.05 * r(), ph: r() * 6.283 }));
  const extra = { x: 0.52, y: 0.48 };
  const photons = Array.from({ length: 160 }, () => ({ x: r(), y: r(), ph: r() * 6.283 }));
  let step = 0, prog = 0, target = 0, t = 0;
  const anim = loop(host, (dt) => { t += dt; prog = lerp(prog, target, Math.min(1, dt * 0.6)); if (Math.abs(prog - target) < 0.002) prog = target; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['A hot soup of matter and antimatter', 'Cooling: pairs annihilate into light', 'One in a billion is left over', 'Today: about 1.6 billion photons per atom'][step], col);
    const L = 10, T = top + 10, W = w - 20, H = h - T - 26;
    const X = (x) => L + 10 + x * (W - 20), Y = (y) => T + 10 + y * (H - 20);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(L + 0.5, T + 0.5, W - 1, H - 1);
    const gone = clamp((prog - 0.55) / 0.3, 0, 1);
    // photons: few in the soup, many once pairs annihilate
    const nPh = Math.round(lerp(24, step >= 3 ? 160 : 110, gone));
    for (let i = 0; i < nPh; i++) {
      const p = photons[i], wob = Math.sin(t * 2 + p.ph) * 3;
      dot(ctx, X(p.x) + wob, Y(p.y), 2, col.s[2]);
    }
    // the pairs
    for (const p of pairs) {
      const sep = p.d * (1 - clamp(prog / 0.55, 0, 1)) + 0.012, jit = Math.sin(t * 3 + p.ph) * 0.01;
      const dx = Math.cos(p.a + t * 0.4) * sep, dy = Math.sin(p.a + t * 0.4) * sep;
      if (gone < 1) {
        ctx.globalAlpha = 1 - gone;
        dot(ctx, X(p.x + dx + jit), Y(p.y + dy), 5, col.s[0]);
        dot(ctx, X(p.x - dx - jit), Y(p.y - dy), 4, col.panel, col.s[3]);
        ctx.globalAlpha = 1;
      }
      if (gone > 0 && gone < 1) { ctx.globalAlpha = Math.sin(gone * Math.PI); dot(ctx, X(p.x), Y(p.y), 10 * gone + 3, col.s[2]); ctx.globalAlpha = 1; }
    }
    // the extra particle of matter
    const ex = X(extra.x) + Math.sin(t * 2.2) * 3, ey = Y(extra.y);
    dot(ctx, ex, ey, step >= 2 ? 7 : 5, col.s[0], step >= 2 ? col.ink : null);
    if (step >= 2) text(ctx, 'the leftover: matter', ex, ey - 17, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
    // legend
    const ly = h - 12;
    dot(ctx, L + 8, ly, 5, col.s[0]); text(ctx, 'matter', L + 17, ly, { color: col.ink, size: 11 });
    dot(ctx, L + 80, ly, 4, col.panel, col.s[3]); text(ctx, 'antimatter', L + 89, ly, { color: col.ink, size: 11 });
    dot(ctx, L + 172, ly, 2.5, col.s[2]); text(ctx, 'light', L + 180, ly, { color: col.ink, size: 11 });
  };
  const out = readout(host);
  const show = () => {
    out.innerHTML = [
      'Tally: roughly <b>1,000,000,001</b> quarks for every <b>1,000,000,000</b> antiquarks. In the heat, light makes pairs and pairs make light, in balance.',
      'In the first thousandth of a second or so, as the temperature fell from about 10<sup>12</sup> to 10<sup>11</sup> K, light was no longer hot enough to make proton-antiproton pairs. Matter and antimatter met and turned into light. Electrons and positrons did the same at about one second.',
      'Tally after: matter <b>1</b>, antimatter <b>0</b>, light about <b>2,000,000,000</b> photons. One extra particle in a billion made everything we see. (The drawing shows one in 30; a true one in a billion is too small to draw.)',
      'The leftover ratio is measured: η = n<sub>b</sub>/n<sub>γ</sub> ≈ 6 × 10<sup>−10</sup>, about one proton or neutron per 1.6 billion CMB photons. Why there was any excess is unsolved.',
    ][step];
  };
  cv.redraw(); show();
  return {
    step(i) {
      step = Math.min(3, i); target = step >= 1 ? 1 : 0;
      if (calm()) prog = target;
      cv.redraw(); show();
    },
  };
}
