// Class 8 Science, Investigating: a fair test changes ONE thing and keeps everything else the same.
// Two pots of the same seedling: tap which conditions differ. The plants' real growth depends only on light and water
// (soil type and pot size make no real difference). With one difference the cause is clear; with two or more you
// cannot tell which one caused the result.
import { canvas, text, title, dot, line, row, button, readout } from '../../kit.js';

const VARS = [['light', 'Light'], ['water', 'Water'], ['soil', 'Soil type'], ['pot', 'Pot size']];
const EFFECT = { light: 6, water: 4, soil: 0, pot: 0 };
export default function (host) {
  const diff = { light: true, water: false, soil: false, pot: false };
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Two plant pots A and B, with the conditions that differ between them' });
  const ctl = row(host);
  const bs = VARS.map(([k, nm]) => button(ctl, nm + ': same', () => { diff[k] = !diff[k]; upd(); }));
  const out = readout(host);
  function upd() {
    bs.forEach((b, i) => { const k = VARS[i][0]; b.textContent = VARS[i][1] + (diff[k] ? ': different' : ': same'); b.setAttribute('aria-pressed', String(diff[k])); });
    const n = VARS.filter(([k]) => diff[k]).length;
    out.innerHTML = n === 0 ? 'Everything is the same, so B grows just like A. Nothing to compare yet: change <b>one</b> thing.'
      : n === 1 ? 'Only one thing differs, so any change in growth must be caused by it. This is a <b>fair test</b>.'
      : `<b>${n} things</b> differ. If B grows differently you cannot say which one did it. This is <b>not a fair test</b>: change only one.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Fair test: change one thing only', col);
    const base = 10, ha = base, hb = base + VARS.reduce((s, [k]) => s + (diff[k] ? EFFECT[k] : 0), 0);
    const gy = h * 0.5, cols = [w * 0.27, w * 0.73], hs = [ha, hb];
    ['A (control)', 'B (changed)'].forEach((nm, i) => {
      const x = cols[i], big = i === 1 && diff.pot, ph = big ? 54 : 40, pw = big ? 62 : 48;
      ctx.fillStyle = i === 1 && diff.soil ? col.s[3] : col.s[2]; ctx.globalAlpha = 0.35;
      ctx.fillRect(x - pw / 2, gy, pw, ph); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x - pw / 2, gy, pw, ph);
      const ph2 = hs[i] * 7.5; line(ctx, [[x, gy], [x, gy - ph2]], col.good, 4);
      dot(ctx, x - 9, gy - ph2 + 4, 7, col.good); dot(ctx, x + 9, gy - ph2 + 8, 7, col.good);
      text(ctx, nm, x, gy + ph + 16, { color: col.ink, size: 12, weight: 700, align: 'center' });
      const lt = i === 1 && diff.light ? 'sunny window' : 'dim corner', wt = i === 1 && diff.water ? '100 mL a day' : '50 mL a day';
      const l2 = i === 1 && !diff.light ? 'dim corner' : lt;
      text(ctx, i === 0 ? 'dim corner' : l2, x, gy + ph + 32, { color: col.muted, size: 10.5, align: 'center' });
      text(ctx, i === 0 ? '50 mL a day' : wt, x, gy + ph + 46, { color: col.muted, size: 10.5, align: 'center' });
      text(ctx, `height ${hs[i]} cm`, x, 44, { color: col.ink, size: 11, weight: 700, align: 'center' });
    });
    const n = VARS.filter(([k]) => diff[k]).length;
    text(ctx, n === 1 ? 'Fair test' : n === 0 ? 'Nothing changed' : 'Not a fair test', w / 2, 62, { color: n === 1 ? col.good : n === 0 ? col.muted : col.bad, size: 12, weight: 700, align: 'center' });
  };
  upd();
}
