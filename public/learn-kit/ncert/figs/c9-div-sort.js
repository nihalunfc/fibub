// Class 9 Diversity: why classify? The same 12 living things can be grouped in different ways depending on what you
// look at: where they live, whether they have a backbone, or how many legs they have. Some groupings tell you much more
// than others: "has a backbone" predicts many other features (a skeleton, a spinal cord), while "lives in water" puts
// a fish and a crab together although they are very different inside. Pick a feature and watch the groups form.
import { canvas, text, title, dot, row, choice, loop, readout, lerp } from '../../kit.js';

const ORG = [
  ['Rohu', 'water', 'back', 0], ['Frog', 'both', 'back', 4], ['Crow', 'air', 'back', 2], ['Cow', 'land', 'back', 4], ['Snake', 'land', 'back', 0], ['Dolphin', 'water', 'back', 0],
  ['Crab', 'water', 'no', 10], ['Butterfly', 'air', 'no', 6], ['Spider', 'land', 'no', 8], ['Earthworm', 'land', 'no', 0], ['Snail', 'land', 'no', 0], ['Neem', 'land', 'plant', 0],
];
const MODES = {
  habitat: { label: 'Where it lives', groups: [['land', 'Land'], ['water', 'Water'], ['air', 'Air'], ['both', 'Both']], get: (o) => o[1], note: 'Grouping by habitat is easy, but it puts a fish, a dolphin and a crab together although they differ in almost every way inside.' },
  back: { label: 'Backbone', groups: [['back', 'Has a backbone'], ['no', 'No backbone'], ['plant', 'Not an animal']], get: (o) => o[2], note: 'A backbone says a lot: animals that have one also have a spinal cord and an internal skeleton. A useful feature to classify by.' },
  legs: { label: 'Number of legs', groups: [['0', 'None'], ['2', 'Two'], ['4', 'Four'], ['6', 'Six'], ['8+', 'Eight or more']], get: (o) => (o[3] >= 8 ? '8+' : String(o[3])), note: 'Legs split snakes from cows, but also put a snake with a fish and a worm (no legs). Classifying by one feature only can mislead.' },
};
export default function (host) {
  let mode = 'habitat';
  const pos = ORG.map(() => [0, 0]);
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 320, label: 'Twelve living things grouped by habitat, backbone or number of legs' });
  loop(host, () => cv.redraw());
  const ctl = row(host);
  choice(ctl, 'Group by', [['habitat', 'Habitat'], ['back', 'Backbone'], ['legs', 'Legs']], mode, (v) => { mode = v; upd(); });
  const out = readout(host);
  function upd() { out.textContent = MODES[mode].note; }
  cv.draw = (ctx, w, h, col) => {
    const M = MODES[mode]; title(ctx, `Sorted by: ${M.label}`, col);
    const g = M.groups, n = g.length, perRow = n > 3 ? 3 : n, rows = Math.ceil(n / perRow), cw = (w - 16) / perRow, chh = (h - 50) / rows;
    g.forEach(([k, lab], i) => {
      const gx = 8 + (i % perRow) * cw, gy = 40 + Math.floor(i / perRow) * chh;
      ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.fillStyle = col.soft; ctx.beginPath(); ctx.roundRect(gx + 3, gy + 3, cw - 6, chh - 6, 8); ctx.fill(); ctx.stroke();
      text(ctx, lab, gx + cw / 2, gy + 14, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
      const members = ORG.map((o, j) => [o, j]).filter(([o]) => M.get(o) === k);
      members.forEach(([o, j], m) => {
        const tx = gx + cw / 2, ty = gy + 30 + m * 15 + 0;
        const [px, py] = pos[j]; const nx = px ? lerp(px, tx, 0.12) : tx, ny = py ? lerp(py, ty, 0.12) : ty; pos[j] = [nx, ny];
        dot(ctx, nx - 26, ny, 4, col.s[(j % 6)]); text(ctx, o[0], nx - 18, ny, { color: col.ink, size: 10.5 });
      });
    });
  };
  upd();
}
