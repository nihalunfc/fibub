// Ethane seen end-on (Newman projection): the front carbon's three C–H bonds meet in the middle, the back carbon's start at
// the circle. Turn the back carbon with the slider or press Play. Staggered (60°, 180°, 300°) is lowest in energy,
// eclipsed (0°, 120°, 240°) highest, by about 12 kJ/mol. The graph shows the torsional energy E = 6(1 + cos 3θ) kJ/mol.
import { canvas, axes, line, dot, text, row, slider, button, readout, loop, title } from '../kit.js';

const BARRIER = 12;
export default function (host) {
  let th = 0;
  const cv = canvas(host, { aspect: 1.0, max: 460, min: 340, label: 'Newman projection of ethane and its torsional energy curve' });
  const c = row(host);
  const s = slider(c, { label: 'Back carbon rotated by', min: 0, max: 360, step: 1, value: 0, fmt: (v) => v + '°', oninput: (v) => { th = v; set(); } });
  const an = loop(host, (dt) => { th = (th + dt * 40) % 360; s.set(th); set(); }, { autoplay: false });
  an.button(c);
  button(c, 'Staggered', () => { th = 60; s.set(th); set(); }); button(c, 'Eclipsed', () => { th = 120; s.set(th); set(); });
  const out = readout(host);
  const E = (a) => (BARRIER / 2) * (1 + Math.cos((3 * a * Math.PI) / 180));
  function set() {
    const a = th % 120, kind = a < 3 || a > 117 ? 'eclipsed (highest energy)' : Math.abs(a - 60) < 3 ? 'staggered (lowest energy)' : 'in between';
    out.innerHTML = `Dihedral angle <b>${Math.round(th)}°</b>: <b>${kind}</b>, E = ${E(th).toFixed(1)} kJ/mol above the staggered form. At 298 K the fraction of molecules eclipsed at any instant is only about e<sup>−12000/(8.314×298)</sup> ≈ ${(Math.exp(-12000 / (8.314 * 298)) * 100).toFixed(1)}% as likely as staggered, so the three-fold barrier of ${BARRIER} kJ/mol is crossed easily: ethane rotates freely (about 10¹⁰ times a second).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Ethane: Newman projection and energy', col);
    const R = Math.min(w * 0.22, 62), cx = w / 2, cy = 44 + R + 8, L = 30;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    for (let k = 0; k < 3; k++) {
      const a = (-90 + k * 120 + th) * Math.PI / 180, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
      ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(cx + Math.cos(a) * (R + L), cy + Math.sin(a) * (R + L)); ctx.stroke();
      dot(ctx, cx + Math.cos(a) * (R + L + 4), cy + Math.sin(a) * (R + L + 4), 5, col.s[1]);
    }
    for (let k = 0; k < 3; k++) {
      const a = (-90 + k * 120) * Math.PI / 180;
      ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * (R + L - 4), cy + Math.sin(a) * (R + L - 4)); ctx.stroke();
      dot(ctx, cx + Math.cos(a) * (R + L + 2), cy + Math.sin(a) * (R + L + 2), 5, col.s[0]);
    }
    text(ctx, 'blue: front C–H', 10, cy - R - 4, { color: col.s[0], size: 10, weight: 700 }); text(ctx, 'orange: back C–H', 10, cy - R + 10, { color: col.s[1], size: 10, weight: 700 });
    const A = axes(ctx, w, h, col, { x: [0, 360], y: [0, 14], t: cy + R + L + 24, l: 40, xlabel: 'rotation (°)', ylabel: 'E (kJ/mol)', xt: [0, 60, 120, 180, 240, 300, 360], yt: [0, 6, 12] });
    const pts = []; for (let a = 0; a <= 360; a += 3) pts.push([A.X(a), A.Y(E(a))]);
    line(ctx, pts, col.s[0], 2.5); dot(ctx, A.X(th), A.Y(E(th)), 6, col.s[1], col.panel);
  };
  set();
}
