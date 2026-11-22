// Build an argument by tapping. Each tap on a sentence cycles its job: background, premise (a reason) or conclusion (what
// the reasons are meant to prove). Press Check to see the argument drawn as reasons pointing at a conclusion, with the
// hidden assumption that bridges the gap. Three short original arguments; try to spot the unstated link before you check.
import { canvas, row, choice, button, readout, text, title, put } from '../kit.js';

const SETS = [
  { name: 'Library hours', s: [['Almost no student visits the library after 3 pm.', 'P'], ['Keeping it open until 6 pm would cost the school extra staff pay.', 'P'], ['So the library should keep closing at 3 pm.', 'C']], gap: 'No benefit of a later closing (such as quiet exam study) is worth that cost.' },
  { name: 'App sales', s: [['Sales rose 12% in the month after the app was redesigned.', 'P'], ['Reviews that month often praised the new look.', 'P'], ['Clearly, the redesign is what raised sales.', 'C']], gap: 'Nothing else that month (a festival, a price cut) explains the rise.' },
  { name: 'Paper or tablet', s: [['Many people enjoy collecting old books.', 'B'], ['A small study of 40 students found better recall from paper than from screens.', 'P'], ['Our class should therefore switch from tablets to printed textbooks.', 'C']], gap: 'The 40 students resemble our class, and recall is the thing that matters most.' },
];
const LAB = { '': 'Tap: ?', B: 'Background', P: 'Premise', C: 'Conclusion' };
export default function (host) {
  let k = Math.min(2, +host.dataset.set || 0), lab = [], checked = false;
  const cv = canvas(host, { aspect: 0.62, max: 300, min: 230, label: 'The argument drawn as premises pointing at a conclusion' });
  const c0 = row(host); choice(c0, 'Argument', SETS.map((x, i) => [i, x.name]), k, (v) => { k = v; lab = SETS[k].s.map(() => ''); checked = false; build(); cv.redraw(); show(); });
  const list = document.createElement('div'); list.className = 'lk-controls'; list.style.flexDirection = 'column'; list.style.alignItems = 'stretch'; put(host, list);
  const c = row(host); button(c, 'Check ✓', () => { checked = true; build(); cv.redraw(); show(); }); button(c, 'Clear', () => { lab = SETS[k].s.map(() => ''); checked = false; build(); cv.redraw(); show(); });
  const out = readout(host);
  const build = () => { list.innerHTML = ''; SETS[k].s.forEach(([t, ans], i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'lk-btn'; b.style.textAlign = 'left';
    const bad = checked && lab[i] !== ans; b.textContent = `[${LAB[lab[i]]}${checked ? (bad ? ' ✗ it is ' + LAB[ans].toLowerCase() : ' ✓') : ''}] ${t}`; if (checked) b.style.borderColor = bad ? 'var(--bad)' : 'var(--good)';
    b.addEventListener('click', () => { if (checked) return; lab[i] = { '': 'B', B: 'P', P: 'C', C: '' }[lab[i]]; build(); show(); cv.redraw(); }); list.appendChild(b); }); };
  const show = () => { const n = lab.filter((x) => x).length;
    out.innerHTML = checked ? `Premises give the reasons; the conclusion is the point. Between them sits an <b>unstated assumption</b>: "${SETS[k].gap}" If that is false, the argument fails, which is how strengthen, weaken and assumption questions work.` : `Tap each sentence to set its job (${n} of ${SETS[k].s.length} set), then press Check. Tip: the conclusion is what you could put "therefore" in front of.`; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, checked ? 'Reasons, gap, conclusion' : 'Your labels so far', col);
    const S = SETS[k].s, ps = S.filter((x, i) => (checked ? x[1] : lab[i]) === 'P'), cs = S.filter((x, i) => (checked ? x[1] : lab[i]) === 'C');
    const colX = [w * 0.05, w * 0.62], bw = w * 0.33;
    const box = (x, y, bh, t2, k2, dash) => { ctx.fillStyle = col.soft; ctx.fillRect(x, y, bw, bh); ctx.setLineDash(dash ? [4, 3] : []); ctx.strokeStyle = col.s[k2]; ctx.lineWidth = 2; ctx.strokeRect(x, y, bw, bh); ctx.setLineDash([]); text(ctx, t2, x + bw / 2, y + bh / 2, { color: col.ink, size: 10.5, weight: 600, align: 'center' }); };
    ps.forEach((p, i) => { const y = 54 + i * 52; box(colX[0], y, 40, 'Premise ' + (i + 1), 0); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(colX[0] + bw, y + 20); ctx.lineTo(colX[1] - 6, h / 2 + 10); ctx.stroke(); });
    if (cs.length) box(colX[1], h / 2 - 10, 40, 'Conclusion', 1);
    if (checked) { ctx.fillStyle = col.warn; ctx.globalAlpha = 0.18; ctx.fillRect(w * 0.38, h * 0.18, w * 0.22, h * 0.7); ctx.globalAlpha = 1; text(ctx, 'gap', w * 0.49, h * 0.3, { color: col.warn, size: 11, weight: 700, align: 'center' }); text(ctx, 'assumption', w * 0.49, h * 0.3 + 14, { color: col.warn, size: 10, align: 'center' }); }
    if (!ps.length && !cs.length) text(ctx, 'Label the sentences to see the shape', w / 2, h / 2, { color: col.muted, size: 12, align: 'center' });
  };
  lab = SETS[k].s.map(() => ''); build(); show();
}
