// Class 12 Wave Optics: why polarisation shows that light is a transverse wave. A rope shaken in one plane passes through a slit only as far as its shaking
// lines up with the slit: the part of the shake along the slit (A cos(difference of angles)) gets through, the part across is blocked.
// A sound-like longitudinal wave shakes along the rope and goes through any slit unchanged, so it cannot be polarised.
import { canvas, text, title, row, slider, choice, readout, line, loop } from '../../kit.js';
import { rad } from '../c12p-optlib.js';

export default function (host) {
  let kind = 'tr', al = 0, be = 0, t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'A wave on a rope passing through a slit at an angle' });
  const ctl = row(host);
  choice(ctl, 'Wave', [['tr', 'Transverse'], ['lo', 'Longitudinal']], kind, (v) => { kind = v; cv.redraw(); });
  slider(ctl, { label: 'Shaking direction', min: 0, max: 90, step: 5, value: al, fmt: (v) => `${v}° from up`, oninput: (v) => { al = v; cv.redraw(); } });
  slider(ctl, { label: 'Slit direction', min: 0, max: 90, step: 5, value: be, fmt: (v) => `${v}° from up`, oninput: (v) => { be = v; cv.redraw(); } });
  const anim = loop(host, (dt) => { t += dt * 5; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'A rope through a slit', col) + 6, cy = top + (h - top) * 0.55, sx = w * 0.5, x0 = 10, x1 = w - 10, k = 0.11, A = (h - top) * 0.26;
    const f = Math.cos(rad(al - be)), amp = kind === 'tr' ? Math.abs(f) : 1;
    // slit: two bars leaving a gap along the direction be
    const b = rad(be), ux = Math.sin(b), uy = -Math.cos(b);
    line(ctx, [[sx - ux * 70, cy - uy * 70], [sx - ux * 8, cy - uy * 8]], col.ink, 5); line(ctx, [[sx + ux * 8, cy + uy * 8], [sx + ux * 70, cy + uy * 70]], col.ink, 5);
    ctx.save(); ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(sx - ux * 46 - 0, cy - uy * 46); ctx.lineTo(sx + ux * 46, cy + uy * 46); ctx.stroke(); ctx.restore();
    const a = rad(al), dx = Math.sin(a), dy = -Math.cos(a);
    // transverse: displacement s*A along direction (dx, dy) drawn as an oblique offset
    const draw = (xa, xb, am, c) => {
      const pts = []; for (let x = xa; x <= xb; x += 2) { const s = am * Math.sin(k * x - t); pts.push(kind === 'tr' ? [x + dx * A * s, cy + dy * A * s] : [x + 9 * s, cy]); }
      line(ctx, pts, c, 3);
    };
    draw(x0, sx - 6, 1, col.s[0]); draw(sx + 6, x1, amp, col.s[2]);
    text(ctx, 'rope', x0 + 2, h - 8, { color: col.muted, size: 10.5 }); text(ctx, 'slit', sx, top + 10, { color: col.muted, size: 10.5, align: 'center' });
    out.innerHTML = kind === 'tr' ? `The shake is ${al}° from vertical and the slit is ${be}° from vertical. Only the part along the slit gets through: amplitude × cos ${Math.abs(al - be)}° = <b>${amp.toFixed(2)}</b>. At 90° apart nothing gets through.` : 'A longitudinal wave shakes <b>along</b> the rope, so the slit never blocks it, whatever its direction. Light <i>can</i> be blocked by a polaroid, so light is a transverse wave.';
  };
  cv.redraw();
}
