// Class 9 Science, Chapter 6: balanced and unbalanced forces on a 10 kg block. Set a push from the left and a push from
// the right. If they are equal the net force is zero and the velocity does not change (at rest stays at rest, moving keeps
// moving). If they differ, the net force is their difference, it points the way of the bigger push, and a = F/m. Turn the
// rough floor on and friction fights the motion: it can balance a small push (block stays still) and a smaller steady
// friction acts once the block slides.
import { canvas, text, title, line, dot, arrow, row, slider, choice, button, loop, readout } from '../../kit.js';

export default function (host) {
  let FL = 20, FR = 20, rough = 'off', x = 0, v = 0;
  const M = 10, FS = 30, FK = 20;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'A block on a floor with a push from each side, a friction arrow and the net force' });
  const ctl = row(host);
  slider(ctl, { label: 'Push from left', min: 0, max: 100, step: 5, value: FL, fmt: (q) => `${q} N`, oninput: (q) => { FL = q; } });
  slider(ctl, { label: 'Push from right', min: 0, max: 100, step: 5, value: FR, fmt: (q) => `${q} N`, oninput: (q) => { FR = q; } });
  choice(ctl, 'Floor', [['off', 'Smooth (ice)'], ['on', 'Rough']], rough, (q) => { rough = q; });
  button(ctl, 'Stop the block', () => { v = 0; });
  const out = readout(host);
  let fr = 0, net = 0;
  const step = (dt) => {
    const push = FR - FL; fr = 0;
    if (rough === 'on') { if (Math.abs(v) < 0.02 && Math.abs(push) <= FS) { v = 0; fr = -push; } else { const dir = Math.abs(v) < 0.02 ? Math.sign(push) : Math.sign(v); fr = -dir * FK; } }
    net = push + fr; v += (net / M) * dt; if (rough === 'on' && Math.sign(v) !== Math.sign(v - (net / M) * dt) && Math.abs(push) <= FK) v = 0;
    x += v * dt;
  };
  loop(host, (dt) => { step(dt); show(); cv.redraw(); });
  const show = () => { const a = net / M; out.innerHTML = `Net force = <b>${net.toFixed(0)} N</b> (${net > 0.5 ? 'to the right' : net < -0.5 ? 'to the left' : 'zero: balanced'}), a = F/m = <b>${a.toFixed(2)} m/s²</b>, speed <b>${Math.abs(v).toFixed(1)} m/s</b>.${Math.abs(net) < 0.5 && Math.abs(v) > 0.05 ? ' Balanced forces, yet it keeps moving: Newton’s first law.' : ''}`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Add up the forces: balanced or unbalanced?', col) + 6, fy = h - 80, cx = w / 2;
    ctx.fillStyle = col.line; ctx.fillRect(0, fy, w, 6); const off = ((x * 30) % 40 + 40) % 40;
    for (let k = -1; k < w / 40 + 2; k++) line(ctx, [[k * 40 - off + (rough === 'on' ? 0 : 0), fy + 14], [k * 40 - off + 14, fy + 14]], rough === 'on' ? col.muted : col.line, 2);
    text(ctx, rough === 'on' ? 'rough floor' : 'smooth floor', 8, fy + 34, { color: col.muted, size: 10.5 });
    const bw = 64, bh = 50, by = fy - bh; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.fillRect(cx - bw / 2, by, bw, bh); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(cx - bw / 2, by, bw, bh);
    text(ctx, '10 kg', cx, by + bh / 2, { color: col.ink, size: 12, weight: 700, align: 'center' });
    const k = 1.0, my = by + bh / 2;
    if (FL > 0) arrow(ctx, cx - bw / 2 - 6 - FL * k * 0.9, my, cx - bw / 2 - 4, my, col.s[1], 4, 11), text(ctx, `${FL} N`, cx - bw / 2 - 8 - FL * 0.9, my - 12, { color: col.s[1], size: 11, weight: 700 });
    if (FR > 0) arrow(ctx, cx + bw / 2 + 6 + FR * k * 0.9, my, cx + bw / 2 + 4, my, col.s[2], 4, 11), text(ctx, `${FR} N`, cx + bw / 2 + 8 + FR * 0.9, my - 12, { color: col.s[2], size: 11, weight: 700, align: 'right' });
    if (Math.abs(fr) > 0.5) { const d = Math.sign(fr); arrow(ctx, cx - d * 10, fy - 6, cx + d * (10 + Math.abs(fr) * 0.9), fy - 6, col.s[3], 3.5, 9); text(ctx, `friction ${Math.abs(fr).toFixed(0)} N`, cx + d * (10 + Math.abs(fr) * 0.45), fy - 16, { color: col.s[3], size: 10.5, weight: 700, align: 'center' }); }
    // net force bar
    const ny = top + 14; text(ctx, 'net force', 10, ny, { color: col.ink, size: 11.5, weight: 700 });
    if (Math.abs(net) > 0.5) arrow(ctx, w / 2, ny + 22, w / 2 + Math.max(-w / 2 + 14, Math.min(w / 2 - 14, net * 1.8)), ny + 22, col.ink, 5, 12); else dot(ctx, w / 2, ny + 22, 5, col.good);
    text(ctx, `${net.toFixed(0)} N`, w / 2, ny + 6, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  show(); cv.redraw();
}
