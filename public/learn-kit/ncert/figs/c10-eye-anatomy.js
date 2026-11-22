// Class 10 Human Eye: the parts of the eye and what each does. Pick a part to light it up and read its job; move the
// brightness slider and watch the iris change the size of the pupil (bright light: small pupil, dim light: wide pupil,
// controlled by the muscles of the iris). Light enters at the cornea (which does most of the bending), passes the
// aqueous humour, the pupil and the lens, crosses the vitreous humour and forms an inverted image on the retina.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

const PARTS = {
  cornea: ['Cornea', 'The clear bulge at the front. Light is first refracted here, and the cornea does about two thirds of all the bending in the eye.'],
  iris: ['Iris and pupil', 'The iris is the coloured ring of muscle. It makes the pupil (the hole in the middle) smaller in bright light and larger in dim light.'],
  lens: ['Eye lens', 'A flexible convex lens. It fine-tunes the focus so the image falls exactly on the retina, for near and far objects.'],
  ciliary: ['Ciliary muscles', 'Muscles around the lens. They change its curvature: this is how the eye focuses (accommodation).'],
  retina: ['Retina', 'The screen at the back. Millions of rod cells (dim light, black and white) and cone cells (bright light, colour) turn light into electrical signals.'],
  nerve: ['Optic nerve', 'Carries the signals from the retina to the brain, which turns the inverted image into what you perceive. Where it leaves the eye there are no light cells: the blind spot.'],
  humour: ['Aqueous and vitreous humour', 'Clear fluids. The aqueous humour (front) and the vitreous humour (back) keep the eyeball in shape and let light pass.'],
};
export default function (host) {
  let part = 'cornea', bright = 0.5, t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'Cross-section of the human eye with its parts labelled' });
  const ctl = row(host);
  choice(ctl, 'Part', Object.entries(PARTS).map(([k, v]) => [k, v[0].split(' and ')[0]]), part, (v) => { part = v; update(); });
  slider(ctl, { label: 'Brightness of light', min: 0, max: 1, step: 0.05, value: bright, fmt: (v) => (v < 0.3 ? 'dim' : v > 0.7 ? 'bright' : 'normal'), oninput: (v) => { bright = v; update(); } });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  function update() { out.innerHTML = `<b>${PARTS[part][0]}.</b> ${PARTS[part][1]}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'The human eye (side view)', col);
    const R = Math.min(h * 0.34, w * 0.27), cx = w * 0.56, cy = h * 0.52, pup = R * (0.34 - 0.24 * bright);
    const hi = (k) => (part === k ? col.s[3] : col.ink), lw = (k) => (part === k ? 4 : 2.2);
    // eyeball (sclera) and the fluids
    ctx.save(); ctx.fillStyle = col.soft; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    if (part === 'humour') { ctx.globalAlpha = 0.3; ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(cx, cy, R - 2, 0, 7); ctx.fill(); }
    ctx.restore();
    // cornea: a bulge on the front (left)
    ctx.save(); ctx.strokeStyle = hi('cornea'); ctx.lineWidth = lw('cornea'); ctx.beginPath(); ctx.arc(cx + R * 0.55, cy, R * 1.55, Math.PI - 0.4, Math.PI + 0.4); ctx.stroke(); ctx.restore();
    // iris (two segments) and pupil
    const ix = cx - R * 0.5; ctx.save(); ctx.strokeStyle = hi('iris'); ctx.lineWidth = part === 'iris' ? 6 : 4.5;
    ctx.beginPath(); ctx.moveTo(ix, cy - R * 0.62); ctx.lineTo(ix, cy - pup); ctx.moveTo(ix, cy + pup); ctx.lineTo(ix, cy + R * 0.62); ctx.stroke(); ctx.restore();
    // lens
    const lx = cx - R * 0.32; ctx.save(); ctx.fillStyle = part === 'lens' ? col.s[3] : col.panel; ctx.globalAlpha = part === 'lens' ? 0.5 : 0.8; ctx.strokeStyle = hi('lens'); ctx.lineWidth = lw('lens');
    ctx.beginPath(); ctx.ellipse(lx, cy, R * 0.14, R * 0.34, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); ctx.restore();
    // ciliary muscles
    ctx.save(); ctx.strokeStyle = hi('ciliary'); ctx.lineWidth = part === 'ciliary' ? 5 : 3.5;
    for (const sgn of [-1, 1]) { ctx.beginPath(); ctx.moveTo(lx, cy + sgn * R * 0.34); ctx.lineTo(ix - 4, cy + sgn * R * 0.62); ctx.stroke(); }
    ctx.restore();
    // retina and the optic nerve
    ctx.save(); ctx.strokeStyle = hi('retina'); ctx.lineWidth = part === 'retina' ? 6 : 4; ctx.beginPath(); ctx.arc(cx, cy, R - 2, -1.05, 1.05); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.strokeStyle = hi('nerve'); ctx.lineWidth = part === 'nerve' ? 7 : 5; ctx.beginPath(); const ax = cx + (R - 2) * Math.cos(0.5), ay = cy + (R - 2) * Math.sin(0.5); ctx.moveTo(ax, ay); ctx.lineTo(Math.min(w - 12, ax + 34), ay + 30); ctx.stroke(); ctx.restore();
    // rays from the left: through cornea, pupil, lens, onto the retina (inverted image)
    const ph = (t * 0.5) % 1, ys = [-0.5, 0, 0.5];
    for (const y of ys) {
      const y0 = cy + y * pup * 1.6, xs = cx - R - 30, xr = cx + R * 0.97, yr = cy - y * R * 0.18; // converge to a point on the retina
      const cxp = cx - R * 0.62, pts = [[xs, y0], [cxp, y0 + (yr - y0) * 0.08], [lx, y0 + (yr - y0) * 0.35], [xr, yr]];
      line(ctx, pts, col.s[1], 1.4);
    }
    for (const y of ys) { const f = ph; dot(ctx, cx - R - 30 + f * (R * 2.1 + 24), cy + y * pup * 1.6 * (1 - f) + -y * R * 0.18 * f, 3, col.s[3]); }
    text(ctx, 'light', 8, cy - 26, { color: col.s[1], size: 11, weight: 700 }); arrow(ctx, 8, cy - 12, 30, cy - 12, col.s[1], 2, 7);
    // labels
    const L = (s, x, y, k, al = 'left') => text(ctx, s, x, y, { color: part === k ? col.s[3] : col.muted, size: 10.5, weight: part === k ? 700 : 400, align: al, halo: col.panel });
    L('cornea', cx - R - 6, cy - R * 0.62, 'cornea', 'right'); L('pupil', ix - 2, cy - 8, 'iris', 'right'); L('lens', lx, cy - R * 0.42, 'lens', 'center');
    L('iris', ix + 6, cy - R * 0.7, 'iris'); L('retina', cx + R * 0.5, cy - R * 0.9, 'retina'); L('optic nerve', w - 6, cy + R * 0.55 + 30, 'nerve', 'right'); L('ciliary muscle', lx - 4, cy + R * 0.74, 'ciliary', 'center');
    text(ctx, 'pupil width follows the brightness', 8, h - 10, { color: col.muted, size: 10 });
  };
  update();
}
