// Class 11 Biology, The Living World: a dichotomous key as a ladder of yes/no couplets. Each question splits the remaining organisms in two until only one is left.
// Pick the specimen; use the slider to reveal the couplets one at a time and see why a good key needs at most (number of organisms - 1) questions.
import { canvas, text, title, row, choice, slider, readout } from '../../kit.js';
import { rr, note } from '../c11b-lib.js';

const Q = [['Has a backbone?', false, 'House fly'], ['Has feathers?', true, 'Crow'], ['Lives in water with fins?', true, 'Goldfish'], ['Has hair or fur?', true, 'Cat']];
const LAST = 'Frog';
const ORDER = ['House fly', 'Crow', 'Goldfish', 'Cat', 'Frog'];
export default function (host) {
  let sp = 'Cat', shown = 4;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'A dichotomous key ladder with yes or no couplets leading to five animals' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Specimen', ORDER.map((x) => [x, x]), sp, (v) => { sp = v; shown = 4; sl.set(4); go(); });
  const sl = slider(ctl, { label: 'couplets shown', min: 1, max: 4, step: 1, value: 4, oninput: (v) => { shown = v; go(); } });
  const depth = () => Math.min(3, ORDER.indexOf(sp));
  const go = () => { const d = depth() + 1; ro.textContent = `${sp} is found after ${ORDER.indexOf(sp) === 4 ? 4 : d} question${d > 1 ? 's' : ''}. Five animals need at most four yes or no questions.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, 'Key to five animals', col) + 8, rh = (h - y0 - 30) / 5, tgt = ORDER.indexOf(sp);
    for (let i = 0; i < 5; i++) {
      const y = y0 + i * rh, on = i <= tgt && i < shown, last = i === 4, here = i === tgt && (i < shown || (i === 4 && shown >= 4));
      if (!last) { rr(ctx, 10, y, w * 0.55, rh - 10, 8, on ? col.s[0] : col.soft, on ? col.ink : col.line, on ? 2 : 1); text(ctx, `${i + 1}. ${Q[i][0]}`, 18, y + (rh - 10) / 2, { color: on ? col.panel : col.ink, size: 11.5, weight: 600 }); }
      const ans = last ? '' : (Q[i][1] ? 'YES' : 'NO'), leaf = last ? LAST : Q[i][2], X = w * 0.55 + 14;
      if (!last) { ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(10 + w * 0.55, y + (rh - 10) / 2); ctx.lineTo(w * 0.55 + 46, y + (rh - 10) / 2); ctx.stroke(); text(ctx, ans, w * 0.55 + 28, y + (rh - 10) / 2 - 9, { color: col.muted, size: 10, weight: 700, align: 'center' }); }
      rr(ctx, last ? 10 : w * 0.55 + 48, y, last ? w * 0.55 : w * 0.45 - 58, rh - 10, 8, here ? col.s[1] : col.soft, here ? col.ink : col.line, here ? 2 : 1);
      text(ctx, last ? 'Otherwise: ' + leaf : leaf, last ? 18 : w * 0.55 + 56, y + (rh - 10) / 2, { color: here ? col.panel : col.ink, size: 11.5, weight: 700 });
      if (!last && i < 4 && i < tgt) { ctx.strokeStyle = on ? col.s[0] : col.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(30, y + rh - 10); ctx.lineTo(30, y + rh); ctx.stroke(); }
    }
  };
  go();
}
