// VSEPR shapes: choose the number of electron pairs round the central atom and how many are lone pairs. The sketch
// shows bonded atoms (circles) and lone pairs (lobes) in a simple 3D view; the readout names the shape, the bond angle,
// the hybridisation and an example.
import { canvas, text, row, choice, readout, dot } from '../../kit.js';

const POS = {
  2: [[1, 0, 0], [-1, 0, 0]],
  3: [[0, 1, 0], [-0.87, -0.5, 0], [0.87, -0.5, 0]],
  4: [[0, 1, 0], [0.94, -0.33, 0], [-0.47, -0.33, 0.82], [-0.47, -0.33, -0.82]],
  // trigonal bipyramid: three equatorial first (lone pairs go there), then two axial
  5: [[1, 0, 0], [-0.5, 0, 0.87], [-0.5, 0, -0.87], [0, 1, 0], [0, -1, 0]],
  // octahedron: two trans positions first (a second lone pair goes opposite the first)
  6: [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]],
};
const MAXLP = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 2 };
const INFO = {
  '2,0': ['Linear', '180°', 'sp', 'BeCl₂, CO₂'],
  '3,0': ['Trigonal planar', '120°', 'sp²', 'BF₃, SO₃'],
  '3,1': ['Bent (V-shaped)', 'a little under 120°', 'sp²', 'SO₂, O₃'],
  '4,0': ['Tetrahedral', '109.5°', 'sp³', 'CH₄, NH₄⁺'],
  '4,1': ['Trigonal pyramidal', 'about 107°', 'sp³', 'NH₃, PCl₃'],
  '4,2': ['Bent (V-shaped)', 'about 104.5°', 'sp³', 'H₂O, OF₂'],
  '5,0': ['Trigonal bipyramidal', '120° and 90°', 'sp³d', 'PCl₅'],
  '5,1': ['See-saw', 'under 120° and 90°', 'sp³d', 'SF₄'],
  '5,2': ['T-shaped', 'under 90°', 'sp³d', 'ClF₃'],
  '5,3': ['Linear', '180°', 'sp³d', 'XeF₂, I₃⁻'],
  '6,0': ['Octahedral', '90°', 'sp³d²', 'SF₆'],
  '6,1': ['Square pyramidal', 'under 90°', 'sp³d²', 'BrF₅'],
  '6,2': ['Square planar', '90°', 'sp³d²', 'XeF₄'],
};

export default function (host) {
  let sn = 4, lp = 1;
  const cv = canvas(host, { aspect: 0.6, max: 320, min: 230, label: 'Shape of a molecule from its bonded and lone electron pairs' });
  const ctl = row(host);
  choice(ctl, 'Electron pairs', [2, 3, 4, 5, 6].map((v) => [v, String(v)]), sn, (v) => { sn = v; cv.redraw(); show(); });
  choice(ctl, 'Lone pairs', [0, 1, 2, 3].map((v) => [v, String(v)]), lp, (v) => { lp = v; cv.redraw(); show(); });
  const out = readout(host);
  const L = () => Math.min(lp, MAXLP[sn]);
  const show = () => {
    const l = L(), [shape, ang, hyb, ex] = INFO[`${sn},${l}`];
    out.innerHTML = `${sn} pairs (${sn - l} bonded, ${l} lone) → <b>${shape}</b>; angle ${ang}; hybridisation ${hyb}; e.g. ${ex}.${l < lp ? ` (${sn} pairs allow at most ${MAXLP[sn]} lone pair${MAXLP[sn] === 1 ? '' : 's'} for a molecule with bonds on both sides.)` : ''}${sn === 5 && l ? ' Lone pairs take the roomier equatorial positions.' : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const l = L(), cx = w / 2, cy = h / 2 + 6, R = Math.min(w, h) * 0.36;
    const P = ([x, y, z]) => [cx + R * (x + 0.38 * z), cy - R * (y - 0.22 * z)];
    const items = POS[sn].map((p, i) => ({ p, lone: i < l })).sort((a, b) => a.p[2] - b.p[2]);
    // back items first, then the centre, then front items
    const drawItem = ({ p, lone }) => {
      const [x, y] = P(p);
      if (lone) {
        const a = Math.atan2(y - cy, x - cx), d = Math.hypot(x - cx, y - cy) * 0.62;
        ctx.save(); ctx.translate(cx + Math.cos(a) * d * 0.62, cy + Math.sin(a) * d * 0.62); ctx.rotate(a);
        ctx.fillStyle = col.soft; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(0, 0, d * 0.62, d * 0.32, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        dot(ctx, d * 0.15, -5, 2.5, col.ink); dot(ctx, d * 0.15, 5, 2.5, col.ink);
        ctx.restore();
      } else {
        ctx.strokeStyle = col.ink; ctx.lineWidth = p[2] < -0.1 ? 1.5 : 3;
        if (p[2] < -0.1) ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
        dot(ctx, x, y, 13, col.s[0], col.panel);
        text(ctx, 'X', x, y + 1, { color: col.panel, size: 11, weight: 700, align: 'center' });
      }
    };
    items.filter((i) => i.p[2] < 0).forEach(drawItem);
    dot(ctx, cx, cy, 16, col.s[2], col.panel);
    text(ctx, 'A', cx, cy + 1, { color: col.panel, size: 12, weight: 700, align: 'center' });
    items.filter((i) => i.p[2] >= 0).forEach(drawItem);
    text(ctx, `AX${sn - l > 1 ? sn - l : ''}${l ? 'E' + (l > 1 ? l : '') : ''}: ${INFO[`${sn},${l}`][0]}`, 10, 14, { color: col.ink, size: 12.5, weight: 700 });
    text(ctx, 'dashed = behind the page', 10, h - 10, { color: col.muted, size: 10.5 });
  };
  cv.redraw(); show();
}
