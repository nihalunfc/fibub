// Biotechnology and its applications: why Bt toxin kills a caterpillar but not the bacterium or us. The protein is
// made as an inactive protoxin crystal; the alkaline pH of an insect's midgut dissolves and activates it, and the
// active toxin binds the gut lining and makes pores, so the cells swell and burst. Choose the gut to compare.
import { canvas, text, row, choice, readout, arrow } from '../../kit.js';

const GUT = {
  insect: { name: 'Caterpillar midgut', ph: 'alkaline (pH about 10)', active: true },
  human: { name: 'Human stomach', ph: 'acidic (pH about 2)', active: false },
  bact: { name: 'Inside the bacterium', ph: 'neutral', active: false },
};
export default function (host) {
  let cur = 'insect';
  const cv = canvas(host, { aspect: 0.48, max: 280, min: 220, label: 'Bt protoxin activated in an alkaline insect gut and making pores in gut cells' });
  const ctl = row(host);
  choice(ctl, 'Where', Object.entries(GUT).map(([k, g]) => [k, g.name]), cur, (v) => { cur = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    const g = GUT[cur];
    out.innerHTML = g.active
      ? `<b>${g.name}, ${g.ph}:</b> the crystal dissolves, the protoxin is cut into the active toxin, which binds receptors on midgut epithelial cells and makes pores. The cells swell and burst, and the insect dies. Cry proteins are specific: cryIAc and cryIIAb act on cotton bollworms, cryIAb on corn borer.`
      : `<b>${g.name}, ${g.ph}:</b> the protoxin stays an inactive crystal${cur === 'human' ? ' and is digested like any other protein; humans also lack the gut receptors it binds' : ', so the bacterium is not harmed by its own toxin'}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const g = GUT[cur], y = h * 0.42, x1 = w * 0.14, x2 = w * 0.45, x3 = w * 0.8;
    text(ctx, g.name, 10, 16, { color: col.ink, size: 12.5, weight: 700 });
    // protoxin crystal
    ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(x1, y - 22); ctx.lineTo(x1 + 18, y); ctx.lineTo(x1, y + 22); ctx.lineTo(x1 - 18, y); ctx.closePath(); ctx.fill();
    text(ctx, 'protoxin', x1, y + 36, { color: col.ink, size: 11, align: 'center' });
    text(ctx, '(inactive crystal)', x1, y + 50, { color: col.muted, size: 10, align: 'center' });
    arrow(ctx, x1 + 26, y, x2 - 30, y, g.active ? col.ink : col.line, 2, 8);
    text(ctx, g.ph.split(' (')[0], (x1 + x2) / 2, y - 14, { color: g.active ? col.ink : col.muted, size: 11, align: 'center' });
    if (!g.active) {
      text(ctx, '✕ no activation', x2 + 10, y, { color: col.bad || col.s[1], size: 12, weight: 700 });
      return;
    }
    ctx.fillStyle = col.s[1]; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x2 - 10 + i * 12, y, 5, 0, 7); ctx.fill(); }
    text(ctx, 'active toxin', x2, y + 36, { color: col.ink, size: 11, align: 'center' });
    arrow(ctx, x2 + 30, y, x3 - 46, y, col.ink, 2, 8);
    // gut cells with pores
    const cw = 30, ch = 46;
    for (let i = 0; i < 3; i++) {
      const cx = x3 - 45 + i * cw, sw = 1 + 0.12 * (i === 1);
      ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.fillStyle = col.soft;
      ctx.beginPath(); ctx.ellipse(cx + cw / 2, y, (cw / 2) * sw, (ch / 2) * sw, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = col.s[1]; ctx.fillRect(cx + cw / 2 - 2, y - ch / 2 * sw - 2, 4, 6);
    }
    text(ctx, 'gut cells: pores,', x3, y + 36, { color: col.ink, size: 11, align: 'center' });
    text(ctx, 'swell and burst', x3, y + 50, { color: col.ink, size: 11, align: 'center' });
  };
  cv.redraw(); show();
}
