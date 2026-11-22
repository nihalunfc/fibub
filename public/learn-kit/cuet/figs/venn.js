// 4.6 Syllogisms with circles: "All A are B", "Some A are B", "No A is B". Pick the statement type and see the
// possible diagrams; a conclusion follows only if it is true in every possible diagram.
import { canvas, text, row, choice, readout } from '../../kit.js';

const CASES = {
  'All A are B': { draws: [[0.5, 0.5, 0.18, 0.5, 0.5, 0.36]], note: 'A sits inside B. Then "Some B are A" must follow, but "All B are A" need not.' },
  'Some A are B': { draws: [[0.4, 0.5, 0.25, 0.62, 0.5, 0.25]], note: 'A and B overlap at least partly. "Some B are A" follows; "All A are B" and "Some A are not B" do not have to.' },
  'No A is B': { draws: [[0.3, 0.5, 0.2, 0.72, 0.5, 0.2]], note: 'A and B never touch. "No B is A" follows; so does "Some A are not B".' },
  'Some A are not B': { draws: [[0.38, 0.5, 0.25, 0.66, 0.5, 0.22]], note: 'Part of A lies outside B. Nothing follows about B and A beyond that; "Some B are not A" does not follow.' },
};
export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 210, label: 'Two circles, A and B, drawn for the chosen statement' });
  let pick = 'All A are B';
  const ctl = row(host);
  choice(ctl, 'Statement', Object.keys(CASES), pick, (v) => { pick = v; cv.redraw(); out.innerHTML = CASES[pick].note; });
  const out = readout(host); out.innerHTML = CASES[pick].note;
  cv.draw = (ctx, w, h, col) => {
    const [ax, ay, ar, bx, by, br] = CASES[pick].draws[0], s = Math.min(w, h * 1.6);
    const circ = (x, y, r, c, lab, lx) => { ctx.globalAlpha = 0.2; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x * w, y * h, r * s, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.stroke(); text(ctx, lab, lx, y * h - r * s - 8, { color: col.ink, size: 14, weight: 700, align: 'center' }); };
    circ(bx, by, br, col.s[2], 'B', bx * w + (pick === 'All A are B' ? br * s * 0.7 : 0));
    circ(ax, ay, ar, col.s[0], 'A', ax * w);
  };
  cv.redraw();
}
