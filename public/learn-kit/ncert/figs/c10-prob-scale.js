// Class 10 Probability: the probability scale. Every probability lies from 0 (impossible) to 1 (certain). Choose an everyday
// event and the marker glides to its probability; an event with probability near 1 is very likely, near 0 very unlikely,
// and 1/2 is an even chance. The probability can never be negative or more than 1.
import { canvas, text, title, row, choice, readout, loop } from '../../kit.js';

const EV = {
  sun: ['Sun rises in the east tomorrow', 1, 'certain', 'Sunrise'],
  num: ['A die shows a number below 5', 4 / 6, 'likely', 'Die below 5'],
  coin: ['A fair coin lands heads', 0.5, 'an even chance', 'Coin heads'],
  mon: ['A random day of the week is a Sunday', 1 / 7, 'unlikely', 'A Sunday'],
  seven: ['A die shows 7', 0, 'impossible', 'Die shows 7'],
  card: ['A card from a deck is the ace of spades', 1 / 52, 'very unlikely', 'Ace of spades'],
};
export default function (host) {
  let key = 'coin', pos = 0.5, target = 0.5;
  const cv = canvas(host, { aspect: 0.42, max: 440, min: 290, label: 'A scale from 0 impossible to 1 certain with a marker for the probability of an event' });
  const ctl = row(host);
  choice(ctl, 'Event', Object.entries(EV).map(([k, v]) => [k, v[3]]), key, (v) => { key = v; target = EV[v][1]; say(); });
  const out = readout(host);
  loop(host, () => { if (Math.abs(pos - target) > 0.001) { pos += (target - pos) * 0.12; cv.redraw(); } });
  function say() { const e = EV[key]; out.innerHTML = `“${e[0]}”: P = <b>${+e[1].toFixed(3)}</b>, which is ${e[2]}.`; }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'The probability scale', col), L = 22, R = w - 22, X = (v) => L + v * (R - L), y = top + 62;
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.25; ctx.fillRect(L, y - 8, (R - L) * 0.5, 16); ctx.fillStyle = col.s[2]; ctx.fillRect(X(0.5), y - 8, (R - L) * 0.5, 16); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
    [[0, 'impossible', 'left'], [0.5, 'even chance', 'center'], [1, 'certain', 'right']].forEach(([v, s, a]) => { ctx.beginPath(); ctx.moveTo(X(v), y - 9); ctx.lineTo(X(v), y + 9); ctx.stroke(); text(ctx, String(v), X(v), y + 22, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, s, X(v), y + 38, { color: col.muted, size: 10.5, align: a }); });
    text(ctx, 'unlikely', X(0.25), y - 20, { color: col.s[3], size: 11, weight: 700, align: 'center' }); text(ctx, 'likely', X(0.75), y - 20, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.moveTo(X(pos), y - 9); ctx.lineTo(X(pos) - 8, y - 30); ctx.lineTo(X(pos) + 8, y - 30); ctx.closePath(); ctx.fill();
    text(ctx, pos.toFixed(2), X(pos), y - 42, { color: col.ink, size: 13, weight: 700, align: 'center' });
  };
  say(); cv.redraw();
}
