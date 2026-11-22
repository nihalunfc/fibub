// Note-taking in four levels: a sentence from a made-up lecture is squeezed step by step, from the full sentence to short
// notes with symbols. Slide "Compress" and watch the number of characters fall while the meaning stays. Notes are for you, so
// use any short signs you can read back.
import { canvas, text, title, row, choice, slider, readout } from '../kit.js';
import { wrap } from './_lang.js';

const L = {
  a: ['Lecture: bees', ['Honeybees communicate the location of food to the other bees in the hive by performing a waggle dance.', 'honeybees tell other bees where food is: waggle dance', 'bees tell hive food location: waggle dance', 'bees → hive: food loc. = waggle dance'], 'the dance'],
  b: ['Lecture: sleep', ['Researchers found that students who slept for eight hours scored significantly higher on memory tests than students who slept for five hours.', 'researchers: students slept 8 hours scored higher on memory tests than 5 hours', 'sleep 8h > 5h → memory tests higher (researchers)', '8h sleep > 5h = ↑ memory'], 'the result'],
  c: ['Lecture: cities', ['Because the population of the city doubled in thirty years, the government built three new bridges and a second railway line.', 'city population doubled in 30 years, so government built 3 bridges and 2nd railway', 'pop. x2 in 30 yrs → govt: 3 bridges + 2nd railway', 'pop ×2 (30y) → 3 bridges, 2nd rail'], 'cause and effect'],
};
const LV = ['Full sentence', 'Drop the small words', 'Shorten and use numbers', 'Symbols and abbreviations'];
export default function (host) {
  let k = 'a', lv = 0;
  const cv = canvas(host, { aspect: 0.8, max: 260, min: 230, label: 'A lecture sentence squeezed into notes' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Lecture', Object.keys(L).map((x) => [x, L[x][0]]), k, (v) => { k = v; upd(); });
  slider(row(host), { label: 'Compress', min: 0, max: 3, step: 1, value: 0, fmt: (v) => LV[Math.round(v)], oninput: (v) => { lv = Math.round(v); upd(); } });
  const upd = () => { const a = L[k][1][0].length, b = L[k][1][lv].length; out.textContent = `${a} characters become ${b} (${Math.round(100 - 100 * b / a)}% shorter). Check you can still tell someone ${L[k][2]}.`; cv.redraw(); };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, LV[lv], col);
    const y = wrap(ctx, L[k][1][lv], 14, 50, W - 28, 24, { color: col.ink, size: lv === 3 ? 17 : 15, style: () => (lv === 3 ? { weight: 700 } : null) });
    const a = L[k][1][0].length, b = L[k][1][lv].length;
    ctx.fillStyle = col.line; ctx.fillRect(14, H - 40, W - 28, 12); ctx.fillStyle = col.s[0]; ctx.fillRect(14, H - 40, (W - 28) * b / a, 12);
    text(ctx, `${b} of ${a} characters`, 14, H - 14, { color: col.muted, size: 12 });
  };
  upd();
}
