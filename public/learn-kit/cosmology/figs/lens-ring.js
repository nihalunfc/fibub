// 3.8 Gravitational lensing by a single compact mass. Move a background source across behind the lens: the
// lens makes two images, one each side, at θ = (β ± √(β² + 4θE²)) / 2, and when the source lines up exactly
// the images merge into an Einstein ring of radius θE. The images are stretched along the ring and are
// brighter than the source. Angles are in units of the Einstein radius.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 260, label: 'A background galaxy lensed into two images or a ring by a foreground mass' });
  let beta = 0.5;
  const ctl = row(host);
  slider(ctl, { label: 'How far the source is from the line of sight', min: 0, max: 2, step: 0.01, value: beta, fmt: (v) => (v === 0 ? 'lined up' : `${v.toFixed(2)} θE`), oninput: (v) => { beta = v; cv.redraw(); show(); } });
  const out = readout(host);
  const imgs = () => { const s = Math.sqrt(beta * beta + 4); return [(beta + s) / 2, (beta - s) / 2]; };
  const mag = (th) => Math.abs(1 / (1 - Math.pow(1 / th, 4))); // brightness boost of an image at θ (in θE)
  const show = () => {
    if (beta < 0.02) { out.innerHTML = 'Lined up exactly: the light comes round every side of the lens equally, making an <b>Einstein ring</b>.'; return; }
    const [a, b] = imgs(), u = beta, tot = (u * u + 2) / (u * Math.sqrt(u * u + 4));
    out.innerHTML = `Two images, at ${a.toFixed(2)} and ${Math.abs(b).toFixed(2)} Einstein radii on opposite sides. Together they are <b>${tot.toFixed(2)}×</b> brighter than the source would be without the lens. Real lensing galaxies make arcs, crosses of four images and rings.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h * 0.52, E = Math.min(w * 0.3, h * 0.3);
    ctx.beginPath(); ctx.arc(cx, cy, E, 0, Math.PI * 2); ctx.setLineDash([4, 4]); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'Einstein radius', cx, cy - E - 8, { color: col.muted, size: 10.5, align: 'center' });
    dot(ctx, cx + beta * E, cy, 5, col.muted);
    text(ctx, 'true position', cx + beta * E, cy - 14, { color: col.muted, size: 10.5, align: 'center', halo: col.panel });
    const src = 0.12; // source size in θE
    const arc = (th) => {
      // each image is stretched along the ring: its half-angle is about asin(source size / source offset)
      const r = Math.abs(th) * E, side = th >= 0 ? 0 : Math.PI;
      const ang = Math.min(Math.PI * 0.95, Math.asin(Math.min(1, src / Math.max(beta, src))));
      const bright = Math.min(1, 0.35 + 0.25 * mag(Math.abs(th)));
      ctx.save(); ctx.globalAlpha = bright;
      ctx.beginPath(); ctx.arc(cx, cy, r, side - ang, side + ang); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
      ctx.restore();
    };
    if (beta < 0.02) { out.innerHTML = 'Lined up exactly: the light comes round every side of the lens equally, making an <b>Einstein ring</b>.'; return; }
    const [a, b] = imgs(), u = beta, tot = (u * u + 2) / (u * Math.sqrt(u * u + 4));
    out.innerHTML = `Two images, at ${a.toFixed(2)} and ${Math.abs(b).toFixed(2)} Einstein radii on opposite sides. Together they are <b>${tot.toFixed(2)}×</b> brighter than the source would be without the lens. Real lensing galaxies make arcs, crosses of four images and rings.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h * 0.52, E = Math.min(w * 0.3, h * 0.3);
    ctx.beginPath(); ctx.arc(cx, cy, E, 0, Math.PI * 2); ctx.setLineDash([4, 4]); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'Einstein radius', cx, cy - E - 8, { color: col.muted, size: 10.5, align: 'center' });
    dot(ctx, cx + beta * E, cy, 5, col.muted);
    text(ctx, 'true position', cx + beta * E, cy - 14, { color: col.muted, size: 10.5, align: 'center', halo: col.panel });
    const src = 0.12; // source size in θE
    const arc = (th) => {
      const r = Math.abs(th) * E, side = th >= 0 ? 0 : Math.PI;
      const m = Math.min(12, mag(Math.abs(th)));
      const half = Math.min(Math.PI, (src / Math.max(0.05, Math.abs(beta))) * Math.min(1, 1));
      const ang = beta < 0.02 ? Math.PI : Math.min(Math.PI * 0.95, Math.asin(Math.min(1, src / Math.max(beta, src))) );
      ctx.beginPath(); ctx.arc(cx, cy, r, side - ang, side + ang); ctx.strokeStyle = col.s[0]; ctx.lineWidth = Math.max(3, Math.min(10, src * E * 0.6 * Math.sqrt(m) / (1 + 0 * half))); ctx.lineCap = 'round'; ctx.stroke();
    };
    if (beta < 0.02) {
      ctx.beginPath(); ctx.arc(cx, cy, E, 0, Math.PI * 2); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 6; ctx.stroke();
    } else { const [a, b] = imgs(); arc(a); arc(b); }
    dot(ctx, cx, cy, 9, col.s[3]);
    text(ctx, 'lens galaxy', cx, cy + 24, { color: col.ink, size: 11, align: 'center', halo: col.panel });
    title(ctx, 'What a telescope sees: one source, two images or a ring', col);
  };
  cv.redraw(); show();
}
