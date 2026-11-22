// Complete the words: in a made-up paragraph, some words have lost their second half (like the "Complete the Words" task).
// For each gap pick the word that fits the letters shown AND the sentence around it. The context decides, so read the whole
// sentence first. Right answers fill in; wrong ones tell you why.
import { canvas, text, title, row, button, readout } from '../kit.js';
import { wrap, chip, box } from './_lang.js';

const TXT = [['Many students find that regular', 0], ['exercise', 1], ['helps them', 0], ['conc', 2], ['in class. A short walk before a lesson can improve both', 0], ['mood', 1], ['and', 0], ['mem', 3], ['.', 0]];
// gap: fragment, options, right index
const GAPS = { 3: ['conc', ['concentrate', 'concern', 'concrete'], 0, '"helps them concentrate": a verb fits after "helps them". "Concern" and "concrete" do not.'], 7: ['mem', ['memory', 'member', 'memo'], 0, 'Mood and memory are both things a walk improves; "member" does not fit.'] };
export default function (host) {
  let g = 3; const filled = {};
  const cv = canvas(host, { aspect: 0.6, max: 220, min: 180, label: 'A paragraph with two half-missing words' });
  const pool = box(host, 'margin:4px 0;'), out = readout(host), ctl = row(host);
  button(ctl, 'Restart', () => { for (const k in filled) delete filled[k]; g = 3; opts(); });
  const opts = () => { pool.innerHTML = ''; if (!GAPS[g]) { out.textContent = 'All gaps filled. In the real task you type the missing letters yourself.'; cv.redraw(); return; } GAPS[g][1].forEach((o, i) => chip(pool, o, () => { if (i === GAPS[g][2]) { filled[g] = o; out.textContent = 'Yes. ' + GAPS[g][3]; g = g === 3 ? 7 : 99; opts(); } else out.textContent = `"${o}" does not fit. Read the sentence around the gap again.`; })); if (GAPS[g]) out.textContent = `Gap shown as "${GAPS[g][0]}___". Choose the word that fits.`; cv.redraw(); };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Complete the word in the highlighted gap', col);
    // draw with gap highlighting
    const final = []; TXT.forEach(([t, kind], i) => { if (kind >= 2) final.push([filled[i] || GAPS[i][0] + '___', i]); else t.split(' ').forEach((w) => final.push([w, -1])); });
    const str = final.map((f) => f[0]).join(' ').replace(/ \./g, '.');
    wrap(ctx, str, 14, 54, W - 28, 28, { color: col.ink, size: 16, style: (w) => { const gi = final.find((f) => f[1] >= 0 && (w.startsWith(f[0]) || f[0].startsWith(w.replace('.', '')))); return gi ? { bg: gi[1] === g ? col.s[1] + '55' : null, weight: 700, color: filled[gi[1]] ? col.good : col.ink } : null; } });
  };
  opts();
}
