// Class 8 Light: lenses. A convex lens bends parallel rays together at its focus F (it converges); a concave lens spreads them
// so they seem to come from a focus on the incoming side. Drag the object (or use the slider) in image mode: for a convex lens
// an object beyond F gives a real, upside-down image that moves and changes size; inside F it gives a virtual, upright,
// magnified image (a magnifying glass). Thin lens: 1/v = 1/f + 1/u with u negative for real objects (v = u f / (u - f) here).
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let kind = 'convex', mode = 'beam', u = 90;
  const f = 50;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 270, label: 'Parallel rays through convex and concave lenses, and the image of an object' });
  const ctl = row(host);
  choice(ctl, 'Lens', [['convex', 'Convex'], ['concave', 'Concave']], kind, (v) => { kind = v; say(); });
  choice(ctl, 'Show', [['beam', 'Parallel rays'], ['image', 'Image of an object']], mode, (v) => { mode = v; say(); });
  slider(ctl, { label: 'Object distance (image mode, f = 50)', min: 20, max: 140, step: 5, value: u, fmt: (v) => `${v}`, oninput: (v) => { u = v; say(); } });
  const out = readout(host);
  const say = () => {
    if (mode === 'beam') out.innerHTML = kind === 'convex' ? '<b>Convex lens</b> is thicker in the middle. Parallel rays meet at the focus F. Used in magnifiers, cameras and spectacles for long sight.' : '<b>Concave lens</b> is thinner in the middle. Parallel rays spread out; traced back (dotted) they seem to come from F. Used for short-sight spectacles.';
    else if (kind === 'concave') { const v = u * f / (u + f); out.innerHTML = `Concave lens: whatever the object distance, the image is <b>virtual, upright and smaller</b>, on the same side as the object (here ${v.toFixed(0)} from the lens).`; }
    else if (Math.abs(u - f) < 2.6) out.innerHTML = 'Object at F: the rays leave the lens parallel, so no image forms (it would be at infinity).';
    else if (u > f) { const v = u * f / (u - f); out.innerHTML = `Object ${u} away (beyond F): <b>real, upside-down</b> image ${v.toFixed(0)} on the other side, ${v / u > 1 ? 'bigger than' : v / u === 1 ? 'the same size as' : 'smaller than'} the object (size ratio ${(v / u).toFixed(2)}).`; }
    else { const v = u * f / (f - u); out.innerHTML = `Object ${u} away (inside F): <b>virtual, upright, magnified</b> image ${v.toFixed(0)} behind it, ${(v / u).toFixed(1)} times bigger. This is a magnifying glass.`; }
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `${kind[0].toUpperCase() + kind.slice(1)} lens`, col);
    const cy = h * 0.55, lx = w / 2, s = Math.min(1.5, (w / 2 - 16) / 150), fs = f * s, lh = h * 0.36;
    line(ctx, [[8, cy], [w - 8, cy]], col.muted, 1, [4, 4]);
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.fillStyle = col.soft; ctx.beginPath();
    if (kind === 'convex') { ctx.moveTo(lx, cy - lh); ctx.quadraticCurveTo(lx + 14, cy, lx, cy + lh); ctx.quadraticCurveTo(lx - 14, cy, lx, cy - lh); }
    else { ctx.moveTo(lx - 10, cy - lh); ctx.quadraticCurveTo(lx + 2, cy, lx - 10, cy + lh); ctx.lineTo(lx + 10, cy + lh); ctx.quadraticCurveTo(lx - 2, cy, lx + 10, cy - lh); ctx.closePath(); }
    ctx.fill(); ctx.stroke(); ctx.restore();
    const fl = kind === 'convex' ? lx + fs : lx - fs, fl2 = kind === 'convex' ? lx - fs : lx + fs;
    [[fl, 'F'], [fl2, 'F']].forEach(([x, l]) => { dot(ctx, x, cy, 4, col.s[3], col.ink); text(ctx, l, x, cy + 15, { color: col.s[3], size: 11, weight: 700, align: 'center' }); });
    if (mode === 'beam') {
      [-0.9, -0.5, 0.5, 0.9].forEach((k) => {
        const y = cy + k * lh * 0.8; arrow(ctx, 10, y, lx - 1, y, col.s[1], 1.7, 7);
        if (kind === 'convex') { const sl = (cy - y) / fs; line(ctx, [[lx, y], [w - 8, y + sl * (w - 8 - lx)]], col.s[1], 1.7); }
        else { const sl = (y - cy) / fs; line(ctx, [[lx, y], [w - 8, y + sl * (w - 8 - lx)]], col.s[1], 1.7); line(ctx, [[lx, y], [lx - fs, cy]], col.s[2], 1, [3, 4]); }
      });
      return;
    }
    const us = u * s, oh = 26 * s, ox = lx - us, top = cy - oh, endX = w - 8;
    arrow(ctx, ox, cy, ox, top, col.s[1], 4, 9); text(ctx, 'object', ox, cy + 15, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
    const slA = kind === 'convex' ? (cy - top) / fs : (top - cy) / fs, slB = (cy - top) / (lx - ox);
    line(ctx, [[ox, top], [lx, top]], col.s[0], 1.7); line(ctx, [[lx, top], [endX, top + slA * (endX - lx)]], col.s[0], 1.7);
    line(ctx, [[ox, top], [endX, top + slB * (endX - ox)]], col.s[2], 1.7);
    const atF = kind === 'convex' && Math.abs(u - f) < 2.6;
    if (atF) return;
    let vv, iy, virt;
    if (kind === 'convex' && u > f) { vv = u * f / (u - f); iy = cy + oh * vv / u; virt = false; }
    else { const m = kind === 'convex' ? f / (f - u) : f / (u + f); vv = -m * u; iy = cy - oh * m; virt = true; }
    const ix = lx + vv * s;
    if (virt) { line(ctx, [[lx, top], [ix, iy]], col.s[0], 1, [3, 4]); line(ctx, [[ox, top], [ix, iy]], col.s[2], 1, [3, 4]); ctx.save(); ctx.setLineDash([4, 3]); arrow(ctx, ix, cy, ix, iy, col.warn, 3, 9); ctx.restore(); }
    else arrow(ctx, ix, cy, ix, iy, col.warn, 4, 9);
    text(ctx, virt ? 'virtual image' : 'real image', ix, virt ? Math.min(iy, top) - 12 : iy + 14, { color: col.warn, size: 10.5, weight: 700, align: 'center' });
  };
  say();
}
