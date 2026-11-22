// Class 10 Probability: a standard deck has 52 cards: 4 suits (spades, hearts, diamonds, clubs) of 13 ranks each. 26 are red
// and 26 black, there are 12 face cards (J, Q, K) and 4 aces. Pick an event and the favourable cards light up; probability
// = favourable ÷ 52.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const SU = ['♠', '♥', '♦', '♣'], RK = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const EV = {
  red: ['Red card', (s, r) => s === 1 || s === 2],
  spade: ['A spade', (s) => s === 0],
  king: ['A king', (s, r) => r === 12],
  face: ['Face card', (s, r) => r >= 10],
  redface: ['Red face card', (s, r) => r >= 10 && (s === 1 || s === 2)],
  as: ['Ace of spades', (s, r) => s === 0 && r === 0],
  num: ['Number 2–10', (s, r) => r >= 1 && r <= 9],
  nothearts: ['Not a heart', (s) => s !== 1],
};
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export default function (host) {
  let ev = 'red';
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 290, label: 'A deck of 52 cards in four rows with the favourable cards highlighted' });
  const ctl = row(host);
  choice(ctl, 'Event', Object.entries(EV).map(([k, v]) => [k, v[0]]), ev, (v) => { ev = v; say(); });
  const out = readout(host);
  const count = () => { let k = 0; for (let s = 0; s < 4; s++) for (let r = 0; r < 13; r++) if (EV[ev][1](s, r)) k++; return k; };
  function say() { const k = count(), g = gcd(k, 52); out.innerHTML = `“${EV[ev][0]}”: <b>${k}</b> favourable cards out of 52, so P = ${k}/52 = <b>${k / g}/${52 / g}</b> ≈ ${(k / 52).toFixed(3)}.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'A pack of 52 playing cards', col), L = 22, cw = (w - L - 8) / 13, ch = Math.min(cw * 1.5, (h - top - 40) / 4), y0 = top + 14;
    for (let s = 0; s < 4; s++) {
      text(ctx, SU[s], 10, y0 + s * (ch + 3) + ch / 2, { color: s === 1 || s === 2 ? col.s[1] : col.ink, size: 16, weight: 700, align: 'center' });
      for (let r = 0; r < 13; r++) {
        const on = EV[ev][1](s, r), x = L + r * cw, y = y0 + s * (ch + 3);
        ctx.fillStyle = on ? col.s[2] : col.soft; ctx.globalAlpha = on ? 0.9 : 1; ctx.fillRect(x + 1, y, cw - 2, ch); ctx.globalAlpha = 1;
        ctx.strokeStyle = on ? col.ink : col.line; ctx.lineWidth = 1; ctx.strokeRect(x + 1, y, cw - 2, ch);
        text(ctx, RK[r], x + cw / 2, y + ch / 2, { color: on ? col.panel : (s === 1 || s === 2 ? col.s[1] : col.muted), size: 10.5, weight: 700, align: 'center' });
      }
    }
    text(ctx, 'ace = A; 12 face cards: J, Q, K in every suit', w / 2, y0 + 4 * (ch + 3) + 10, { color: col.muted, size: 10.5, align: 'center' });
  };
  say();
}
