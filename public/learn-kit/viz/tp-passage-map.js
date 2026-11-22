// Map a reading passage. A short original passage in five paragraphs; tap each paragraph to give it a job (background, main
// claim, evidence, objection, response). Check to see the passage as a bar made of the paragraphs, coloured by job, with
// the one-line "what it does" note for each. Mapping like this is how you find the main point and answer structure questions.
import { canvas, row, button, readout, text, title, put } from '../kit.js';

const PARA = [
  ['Cities have long treated flat rooftops as wasted space, used only for water tanks and antennas.', 'B', 'sets the scene'],
  ['Rooftop gardens deserve a place in city planning, because they cool the buildings below and soak up rain that would otherwise flood the streets.', 'M', 'states the main claim'],
  ['In a small pilot on twelve buildings, the rooms under planted roofs stayed several degrees cooler in summer than rooms under bare roofs.', 'E', 'gives evidence'],
  ['Critics reply that soil is heavy and watering is costly, and that old buildings cannot carry the load.', 'O', 'raises an objection'],
  ['These costs are real, but they fall sharply when light soil mixes are used and the roof is planned from the start, so cities should require gardens on new buildings first.', 'R', 'answers it and narrows the claim'],
];
const NAME = { '': '?', B: 'Background', M: 'Main claim', E: 'Evidence', O: 'Objection', R: 'Response' };
const NEXT = { '': 'B', B: 'M', M: 'E', E: 'O', O: 'R', R: '' };
export default function (host) {
  let lab = PARA.map(() => ''), checked = false;
  const cv = canvas(host, { aspect: 0.5, max: 230, min: 200, label: 'The passage drawn as a bar of paragraphs coloured by job' });
  const list = document.createElement('div'); list.className = 'lk-controls'; list.style.flexDirection = 'column'; list.style.alignItems = 'stretch'; put(host, list);
  const c = row(host); button(c, 'Check ✓', () => { checked = true; build(); cv.redraw(); show(); }); button(c, 'Clear', () => { lab = PARA.map(() => ''); checked = false; build(); cv.redraw(); show(); });
  const out = readout(host);
  const build = () => { list.innerHTML = ''; PARA.forEach((p, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'lk-btn'; b.style.textAlign = 'left'; const bad = checked && lab[i] !== p[1];
    b.textContent = `[${i + 1}: ${NAME[lab[i]]}${checked ? (bad ? ' ✗ ' + NAME[p[1]] : ' ✓') : ''}] ${p[0]}`; if (checked) b.style.borderColor = bad ? 'var(--bad)' : 'var(--good)';
    b.addEventListener('click', () => { if (checked) return; lab[i] = NEXT[lab[i]]; build(); cv.redraw(); show(); }); list.appendChild(b); }); };
  const show = () => { const ok = PARA.filter((p, i) => lab[i] === p[1]).length;
    out.innerHTML = checked ? `${ok} of 5 right. The shape: set the scene, claim, evidence, objection, response. The <b>main point</b> is the claim as narrowed by the response: gardens on <i>new</i> buildings first. Author attitude: supportive but realistic.` : 'Tap a paragraph to cycle its job, then press Check. Ask of each paragraph: what is it doing for the argument?'; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Shape of the passage', col);
    const L = 10, W = w - 20, tot = PARA.reduce((s, p) => s + p[0].length, 0); let x = L;
    const key = { B: 7, M: 1, E: 2, O: 5, R: 0, '': 7 };
    PARA.forEach((p, i) => { const pw = p[0].length / tot * W, j = checked ? p[1] : lab[i]; ctx.fillStyle = j ? col.s[key[j] % 8] : col.line; ctx.globalAlpha = j ? 0.75 : 1; ctx.fillRect(x, 50, pw - 3, 54); ctx.globalAlpha = 1;
      text(ctx, String(i + 1), x + pw / 2, 68, { color: col.ink, size: 13, weight: 800, align: 'center' }); text(ctx, j ? NAME[j].split(' ')[0] : '', x + pw / 2, 90, { color: col.ink, size: 9.5, weight: 600, align: 'center', fit: false });
      if (checked) text(ctx, PARA[i][2], x + pw / 2, 124 + (i % 2) * 16, { color: col.muted, size: 10, align: 'center' }); x += pw; });
    text(ctx, 'bar width = paragraph length', L, h - 10, { color: col.muted, size: 10.5 });
  };
  build(); show();
}
