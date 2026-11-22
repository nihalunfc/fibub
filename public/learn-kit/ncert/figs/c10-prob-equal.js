// Class 10 Probability: count equally likely outcomes, not colours. A bag has 1 red and 4 blue marbles. "Red or blue" are two
// colours, but they are not equally likely, because there are five marbles to pick and each is equally likely:
// P(red) = 1/5, not 1/2. Switch between the wrong count (colours) and the right count (marbles).
import { canvas, text, title, row, choice, readout, button } from '../../kit.js';

const BAGS = { a: ['1 red, 4 blue', [0, 1, 1, 1, 1]], b: ['2 red, 2 blue', [0, 0, 1, 1]], c: ['1 red, 1 blue', [0, 1]], d: ['3 red, 1 blue', [0, 0, 0, 1]] };
export default function (host) {
  let bag = 'a', mode = 'marbles', picked = -1;
  const cv = canvas(host, { aspect: 0.56, max: 440, min: 290, label: 'A bag of marbles showing the wrong count by colours and the right count by marbles' });
  const ctl = row(host);
  choice(ctl, 'Bag', Object.entries(BAGS).map(([k, v]) => [k, v[0]]), bag, (v) => { bag = v; picked = -1; say(); });
  choice(ctl, 'Count', [['colours', 'Colours (wrong)'], ['marbles', 'Marbles (right)']], mode, (v) => { mode = v; say(); });
  button(ctl, 'Pick one', () => { picked = Math.floor(Math.random() * BAGS[bag][1].length); say(); });
  const out = readout(host);
  function say() {
    const M = BAGS[bag][1], n = M.length, r = M.filter((c) => c === 0).length;
    out.innerHTML = mode === 'colours' ? `Counting colours: red is 1 of 2 colours, so “P(red) = 1/2”. This is only right when red and blue are equally likely, i.e. when the numbers are equal.` : `Counting marbles: ${r} red out of ${n} equally likely marbles, so P(red) = <b>${r}/${n}</b> = ${(r / n).toFixed(2)}.` + (r * 2 === n ? ' Here red and blue really are equally likely.' : ' The two colours are not equally likely.');
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'What are the equally likely outcomes?', col), M = BAGS[bag][1], n = M.length, r = Math.min(26, (w - 60) / (n * 2.4));
    const y = top + 50;
    M.forEach((c, i) => {
      const x = w / 2 + (i - (n - 1) / 2) * r * 2.4;
      ctx.fillStyle = col.s[c === 0 ? 1 : 0]; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      if (i === picked) { ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.stroke(); }
    });
    const by = y + r + 30;
    if (mode === 'colours') {
      [[0, 'red'], [1, 'blue']].forEach(([c, nm], i) => { const bx = w / 2 + (i ? 12 : -12 - 110); ctx.fillStyle = col.s[c === 0 ? 1 : 0]; ctx.fillRect(bx, by, 110, 36); text(ctx, nm + ' = 1 outcome?', bx + 55, by + 18, { color: col.panel, size: 11.5, weight: 700, align: 'center' }); });
      text(ctx, '2 colours → “1/2”?', w / 2, by + 62, { color: col.s[3], size: 14, weight: 700, align: 'center' });
    } else {
      const bw = Math.min(r * 2.4, 60);
      M.forEach((c, i) => { const bx = w / 2 + (i - (n - 1) / 2) * r * 2.4 - bw / 2 + 2; ctx.fillStyle = col.s[c === 0 ? 1 : 0]; ctx.fillRect(bx, by, bw - 4, 36); });
      text(ctx, `${n} marbles = ${n} equally likely outcomes`, w / 2, by + 62, { color: col.s[2], size: 13, weight: 700, align: 'center' });
    }
  };
  say();
}
