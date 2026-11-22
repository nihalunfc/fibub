// Conformations of ethane and butane. Turn the back carbon with the slider: the Newman projection updates and the dot
// moves along the energy curve. Butane energies (kJ/mol) used: anti 0, gauche 3.8, eclipsed CH3/H 16, fully eclipsed 19;
// ethane barrier 12. The curve is a smooth cosine fit through those points.
import { canvas, text, row, slider, choice, readout, line, dot } from '../../kit.js';

const rad = (d) => (d * Math.PI) / 180;
// E(φ) for butane with φ = 0 at the fully eclipsed (syn) position
const Ebut = (p) => 9.7667 + 2.2667 * Math.cos(rad(p)) - 0.2667 * Math.cos(rad(2 * p)) + 7.2333 * Math.cos(rad(3 * p));
const Eeth = (p) => 6 * (1 + Math.cos(rad(3 * p)));
const nameBut = (p) => { const a = ((p % 360) + 360) % 360, d = Math.min(a, 360 - a); return d < 15 ? 'fully eclipsed (syn)' : Math.abs(d - 60) < 15 ? 'gauche' : Math.abs(d - 120) < 15 ? 'eclipsed (CH₃ over H)' : d > 165 ? 'anti' : 'skew (in between)'; };
const nameEth = (p) => { const a = ((p % 120) + 120) % 120; return a < 15 || a > 105 ? 'eclipsed' : Math.abs(a - 60) < 15 ? 'staggered' : 'skew (in between)'; };

export default function (host) {
  let mol = 'but', phi = 60;
  const cv = canvas(host, { aspect: 0.55, max: 320, min: 240, label: 'Newman projection and energy curve for rotation about a carbon-carbon bond' });
  const ctl = row(host);
  choice(ctl, 'Molecule', [['eth', 'Ethane'], ['but', 'Butane (C2-C3)']], mol, (v) => { mol = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Dihedral angle', min: 0, max: 360, step: 5, value: phi, fmt: (v) => `${Math.round(v)}°`, oninput: (v) => { phi = v; cv.redraw(); show(); } });
  const out = readout(host);
  const E = (p) => (mol === 'but' ? Ebut(p) : Eeth(p));
  const show = () => {
    const nm = mol === 'but' ? nameBut(phi) : nameEth(phi);
    out.innerHTML = `${Math.round(phi)}°: <b>${nm}</b>, about ${E(phi).toFixed(1)} kJ/mol above the most stable form. ${mol === 'but' ? 'Anti (180°) is lowest; gauche costs 3.8 kJ/mol because the two CH₃ groups are close; fully eclipsed is highest.' : 'Staggered is lowest; eclipsed is 12 kJ/mol higher (three H/H eclipsing pairs). At room temperature the molecule turns freely, millions of times a second.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const split = Math.min(w * 0.42, h * 0.95), cx = split / 2 + 4, cy = h / 2 + 4, R = Math.min(split, h) * 0.17, L = R * 2.5;
    // Newman projection: back carbon (circle) with its bonds, then front carbon bonds from the centre
    const back = mol === 'but' ? ['CH₃', 'H', 'H'] : ['H', 'H', 'H'], front = back;
    const ang0 = -90; // up
    ctx.lineWidth = 2;
    back.forEach((g, i) => {
      const a = rad(ang0 + phi + i * 120), x1 = cx + Math.cos(a) * R, y1 = cy + Math.sin(a) * R, x2 = cx + Math.cos(a) * L, y2 = cy + Math.sin(a) * L;
      line(ctx, [[x1, y1], [x2, y2]], col.s[1], 2.5);
      text(ctx, g, cx + Math.cos(a) * (L + 14), cy + Math.sin(a) * (L + 12), { color: g === 'H' ? col.muted : col.s[1], size: 12, weight: 700, align: 'center' });
    });
    ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    front.forEach((g, i) => {
      const a = rad(ang0 + i * 120), x2 = cx + Math.cos(a) * L * 0.92, y2 = cy + Math.sin(a) * L * 0.92;
      line(ctx, [[cx, cy], [x2, y2]], col.s[0], 3);
      text(ctx, g, cx + Math.cos(a) * (L * 0.92 + 14), cy + Math.sin(a) * (L * 0.92 + 12), { color: g === 'H' ? col.muted : col.s[0], size: 12, weight: 700, align: 'center', halo: col.panel });
    });
    dot(ctx, cx, cy, 3, col.ink);
    // energy curve
    const X0 = split + 30, X1 = w - 12, T = 28, B = h - 30, Emax = mol === 'but' ? 21 : 13;
    const X = (p) => X0 + (p / 360) * (X1 - X0), Y = (e) => B - (e / Emax) * (B - T);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X0, T); ctx.lineTo(X0, B); ctx.lineTo(X1, B); ctx.stroke();
    const pts = []; for (let p = 0; p <= 360; p += 3) pts.push([X(p), Y(E(p))]);
    line(ctx, pts, col.s[0], 2.5);
    dot(ctx, X(phi), Y(E(phi)), 6, col.s[2], col.panel);
    [0, 60, 120, 180, 240, 300, 360].forEach((p) => text(ctx, `${p}°`, X(p), B + 12, { color: col.muted, size: 10, align: 'center' }));
    text(ctx, 'energy (kJ/mol)', X0 + 4, T - 12, { color: col.ink, size: 11.5, weight: 600 });
    text(ctx, 'front C', 8, h - 22, { color: col.s[0], size: 10.5, weight: 600 });
    text(ctx, 'back C (circle)', 8, h - 8, { color: col.s[1], size: 10.5, weight: 600 });
  };
  cv.redraw(); show();
}
