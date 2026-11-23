// Class 8 Science, Health: how infections travel from a source to a person, and where to cut the chain.
// Routes: air (droplets), water, food, touch (contact) and vectors (mosquito). Tap a route, then "Break the chain"
// to see the step that stops it. Examples: cold and flu (air), cholera and typhoid (water or food), skin infections (touch), malaria and dengue (mosquito).
import { canvas, text, title, dot, line, arrow, row, choice, button, readout } from '../../kit.js';

const R = {
  air: ['Air (droplets)', 'Sick person', 'coughs and sneezes', 'Cold, flu, COVID-19, TB', 'Cover your mouth, wear a mask in crowds, open windows'],
  water: ['Water', 'Dirty water', 'is drunk', 'Cholera, typhoid, hepatitis A', 'Boil or filter water, keep it covered, use a toilet'],
  food: ['Food', 'Stale or unwashed food', 'is eaten', 'Food poisoning, diarrhoea', 'Wash hands and food, cook well, keep food covered and cold'],
  touch: ['Touch', 'Infected skin or shared things', 'are touched', 'Ringworm, scabies, conjunctivitis', 'Do not share towels, wash hands, keep skin clean'],
  vector: ['Mosquito', 'Mosquito bite', 'carries germs from person to person', 'Malaria, dengue, chikungunya', 'No still water, nets, repellent, long sleeves'],
};
export default function (host) {
  let k = 'air', brk = false;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 290, label: 'A chain from germ source to carrier to a healthy person, with a break in the chain' });
  const ctl = row(host);
  choice(ctl, 'Route', Object.entries(R).map(([a, b]) => [a, b[0]]), k, (v) => { k = v; brk = false; bb.textContent = 'Break the chain'; upd(); });
  const bb = button(ctl, 'Break the chain', () => { brk = !brk; bb.textContent = brk ? 'Restore' : 'Break the chain'; upd(); });
  const out = readout(host);
  function upd() { out.innerHTML = brk ? `<b>Chain broken:</b> ${R[k][4]}.` : `<b>${R[k][0]}</b> route: ${R[k][1].toLowerCase()} ${R[k][2]}, and a person falls ill. Examples: ${R[k][3]}.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'The chain of infection', col);
    const y = h * 0.46, xs = [w * 0.16, w * 0.5, w * 0.84], lab = ['Germ source', R[k][0], 'Healthy person'];
    [0, 1, 2].forEach((i) => { dot(ctx, xs[i], y, 26, i === 2 && !brk ? col.bad : i === 2 ? col.good : col.soft, col.ink); text(ctx, lab[i], xs[i], y + 42, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); });
    text(ctx, i0(k), xs[0], y, { color: col.ink, size: 20, align: 'center' }); text(ctx, i1(k), xs[1], y, { color: col.ink, size: 20, align: 'center' }); text(ctx, brk ? '🙂' : '🤒', xs[2], y, { color: col.ink, size: 22, align: 'center' });
    arrow(ctx, xs[0] + 30, y, xs[1] - 30, y, col.bad, 2.5, 8);
    if (!brk) arrow(ctx, xs[1] + 30, y, xs[2] - 30, y, col.bad, 2.5, 8);
    else { line(ctx, [[xs[1] + 30, y], [xs[1] + 50, y]], col.bad, 2.5); text(ctx, '✕', (xs[1] + xs[2]) / 2 + 6, y, { color: col.good, size: 26, weight: 700, align: 'center' }); }
    text(ctx, brk ? 'Blocked!' : 'Germs reach a new person', w / 2, y + 74, { color: brk ? col.good : col.bad, size: 12, weight: 700, align: 'center' });
  };
  const i0 = (a) => ({ air: '🤧', water: '💧', food: '🍲', touch: '✋', vector: '🦟' }[a]), i1 = (a) => ({ air: '💨', water: '🥛', food: '🍽', touch: '🤝', vector: '🦟' }[a]);
  upd();
}
