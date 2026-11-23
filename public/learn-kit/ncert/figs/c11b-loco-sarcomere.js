// Class 11 Biology, Locomotion: the sarcomere in the sliding filament theory. Thin (actin) filaments hang from the Z lines and thick (myosin) filaments sit in the middle.
// When the muscle contracts the thin filaments slide inward between the thick ones: the sarcomere (Z to Z) shortens, the I band and H zone shrink, but the A band (length of the myosin) stays the same.
import { canvas, text, title, line, row, slider, button, readout, loop } from '../../kit.js';

export default function (host) {
  let c = 0, dir = 1;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'A sarcomere with thin and thick filaments; slide to contract and see the I band and H zone shrink while the A band stays the same' });
  const ctl = row(host), ro = readout(host);
  const sl = slider(ctl, { label: 'Contraction', min: 0, max: 1, step: 0.01, value: c, fmt: (v) => Math.round(v * 100) + ' %', oninput: (v) => { c = v; anim.pause(); go(); } });
  const anim = loop(host, (dt) => { c += dir * dt * 0.35; if (c >= 1) { c = 1; dir = -1; } if (c <= 0) { c = 0; dir = 1; } sl.set(c); go(); }, { autoplay: false });
  anim.button(ctl);
  const go = () => { const L = 3 - c, H = Math.max(0, L - 2), I = L - 1.6; ro.textContent = `Sarcomere ${L.toFixed(2)} µm. A band 1.60 µm (never changes). I band ${I.toFixed(2)} µm ${I < 0.4 ? '' : ''}and H zone ${H.toFixed(2)} µm both shrink as the thin filaments slide in. At full contraction the H zone disappears.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Sarcomere: sliding filaments', col), L = 3 - c, u = (w - 40) / 3.2, x0 = w / 2 - L * u / 2, xm = w / 2, y = t0 + 30;
    const rows = 4, gap = 20;
    for (let r = 0; r < rows; r++) {
      const yy = y + 20 + r * gap;
      ctx.fillStyle = col.s[3]; ctx.fillRect(xm - 0.8 * u, yy, 1.6 * u, 7);                          // thick
      line(ctx, [[x0, yy + 3.5 + (r % 2 ? 7 : -7)], [x0 + u * 1.0, yy + 3.5 + (r % 2 ? 7 : -7)]], col.s[0], 3);       // left thin
      line(ctx, [[x0 + L * u, yy + 3.5 + (r % 2 ? 7 : -7)], [x0 + L * u - u * 1.0, yy + 3.5 + (r % 2 ? 7 : -7)]], col.s[0], 3);
    }
    [x0, x0 + L * u].forEach((x) => { line(ctx, [[x, y + 6], [x, y + 20 + rows * gap]], col.ink, 3); });
    text(ctx, 'Z', x0, y - 4, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'Z', x0 + L * u, y - 4, { color: col.ink, size: 11, weight: 700, align: 'center' });
    const by = y + 36 + rows * gap, br = (a, b, name, c1, yo) => { ctx.fillStyle = c1; ctx.globalAlpha = 0.9; ctx.fillRect(a, by + yo, Math.max(0, b - a), 14); ctx.globalAlpha = 1; if (b - a > 14) text(ctx, name, (a + b) / 2, by + yo + 7, { color: col.bg, size: 10.5, weight: 700, align: 'center' }); };
    br(xm - 0.8 * u, xm + 0.8 * u, 'A band', col.s[3], 0);
    br(x0, xm - 0.8 * u, 'I', col.s[0], 20); br(xm + 0.8 * u, x0 + L * u, 'I', col.s[0], 20);
    br(xm - Math.max(0, L - 2) * u / 2, xm + Math.max(0, L - 2) * u / 2, 'H', col.s[2], 40);
    text(ctx, 'thin = actin', 12, h - 40, { color: col.s[0], size: 10.5, weight: 700 }); text(ctx, 'thick = myosin', 12, h - 24, { color: col.s[3], size: 10.5, weight: 700 });
    text(ctx, `Z to Z: ${L.toFixed(2)} µm`, w - 12, h - 32, { color: col.ink, size: 11, weight: 700, align: 'right' });
  };
  go();
}
