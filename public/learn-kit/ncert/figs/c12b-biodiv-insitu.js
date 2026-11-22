// Class 12 Biology, Biodiversity and Conservation: in situ (on site, in the natural habitat) and ex situ (off site, outside the natural habitat) conservation.
// Click In situ or Ex situ for each card. In situ: national parks, wildlife sanctuaries, biosphere reserves, sacred groves, protected hotspots. Ex situ: zoos, botanical gardens,
// seed banks, cryopreservation of gametes, in vitro fertilisation and tissue culture.
import { canvas, text, title, row, button, readout, rng } from '../../kit.js';

export default function (host) {
  const CARDS = [['A national park', 'in'], ['A zoo breeding programme', 'ex'], ['A sacred grove protected by a village', 'in'], ['A seed bank storing rice varieties', 'ex'], ['A biosphere reserve', 'in'], ['Sperm stored in liquid nitrogen at −196 °C', 'ex'], ['A wildlife sanctuary', 'in'], ['A botanical garden growing rare plants', 'ex'], ['A tissue culture lab making plantlets of a rare orchid', 'ex'], ['Protecting a biodiversity hotspot forest', 'in']];
  const WHY = { in: 'In situ: the species is protected in its own natural habitat, so it keeps evolving with its environment.', ex: 'Ex situ: the species is protected outside its natural habitat, in a safe place or as stored cells.' };
  let order = CARDS.map((c, i) => i), i = 0, score = 0, done = 0, msg = 'Is this in situ or ex situ conservation?';
  const r = rng(11); order.sort(() => r() - 0.5);
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'A card naming a conservation method, to be sorted into in situ or ex situ' });
  const ctl = row(host), ro = readout(host);
  const answer = (v) => { if (i >= order.length) return; const c = CARDS[order[i]]; const ok = c[1] === v; done++; if (ok) score++; msg = (ok ? 'Correct. ' : 'Not quite. ') + WHY[c[1]]; i++; go(); };
  button(ctl, 'In situ (on site)', () => answer('in')); button(ctl, 'Ex situ (off site)', () => answer('ex'));
  button(ctl, 'Start again', () => { order.sort(() => r() - 0.5); i = 0; score = 0; done = 0; msg = 'Is this in situ or ex situ conservation?'; go(); });
  const go = () => { ro.textContent = `${msg} Score: ${score} out of ${done}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'In situ or ex situ?', col) + 14;
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillRect(20, top, w - 40, h - top - 24); ctx.strokeRect(20, top, w - 40, h - top - 24);
    const t = i < order.length ? CARDS[order[i]][0] : 'All ' + order.length + ' cards done. Score ' + score + '.';
    t.match(/.{1,28}(\s|$)/g).forEach((ln, k, arr) => text(ctx, ln.trim(), w / 2, top + (h - top - 24) / 2 - (arr.length - 1) * 11 + k * 22, { color: col.ink, size: 15, weight: 700, align: 'center' }));
    text(ctx, `card ${Math.min(i + 1, order.length)} of ${order.length}`, w - 28, h - 34, { color: col.muted, size: 10, align: 'right' });
  };
  go();
}
