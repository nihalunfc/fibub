// Class 12 Biology, Biotechnology and its Applications: what genetically modified (GM) crops are made for. Pick a problem to see the GM answer and an example.
// Examples: Bt cotton (pest resistance, India 2002), Golden Rice (provitamin A, beta-carotene), delayed ripening tomato (Flavr Savr), herbicide-tolerant crops,
// stress-tolerant crops, and plants that make oils, starch or medicines.
import { canvas, text, title, line, dot, row, choice, readout } from '../../kit.js';

export default function (host) {
  let k = 'pest';
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 270, label: 'A crop plant with a highlighted trait for the chosen problem' });
  const ctl = row(host), ro = readout(host);
  const U = {
    pest: ['Pests', 'Bt cotton: the cry gene of a soil bacterium makes a protein that kills bollworms, so farmers spray fewer insecticides. Approved in India in 2002.'],
    stress: ['Stress', 'Crops made tolerant to cold, drought, salt or heat so they can grow in poor conditions and need less irrigation or fertiliser.'],
    shelf: ['After harvest', 'Delayed ripening (Flavr Savr tomato) means less food is lost to rotting before it reaches the market.'],
    nutri: ['Nutrition', 'Golden Rice has genes for making beta-carotene (provitamin A), meant to prevent vitamin A deficiency that damages eyesight.'],
    fert: ['Fertiliser use', 'Crops that take up minerals better need less fertiliser, saving money and cutting pollution of rivers.'],
    custom: ['Made to order', 'Plants that make useful oils or starch, or that make medicines such as vaccines, so they can act as small factories.'],
  };
  choice(ctl, 'Problem', Object.entries(U).map(([id, v]) => [id, v[0]]), 'pest', (v) => { k = v; go(); });
  const go = () => { ro.textContent = U[k][1]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'GM crops: ' + U[k][0], col) + 10, cx = w * 0.5, gy = h - 40;
    line(ctx, [[0, gy], [w, gy]], col.muted, 2); ctx.fillStyle = col.soft; ctx.fillRect(0, gy, w, 40);
    const mainc = k === 'nutri' ? col.warn : col.good;
    line(ctx, [[cx, gy], [cx, top + 40]], col.good, 6);
    [[-1, 0.3], [1, 0.45], [-1, 0.65], [1, 0.8]].forEach(([s, f]) => { const y = gy - (gy - top - 40) * f; ctx.fillStyle = col.good; ctx.beginPath(); ctx.ellipse(cx + s * 34, y, 30, 12, s * -0.4, 0, 7); ctx.fill(); });
    if (k === 'nutri') for (let i = 0; i < 5; i++) { dot(ctx, cx - 14 + i * 7, top + 30, 5, col.warn, col.ink); }
    else if (k === 'pest') { dot(ctx, cx + 58, gy - (gy - top - 40) * 0.45 - 6, 4, col.bad); line(ctx, [[cx + 52, gy - (gy - top - 40) * 0.45 - 14], [cx + 64, gy - (gy - top - 40) * 0.45 + 2]], col.bad, 2); text(ctx, 'bollworm', cx + 70, gy - (gy - top - 40) * 0.45 - 6, { color: col.bad, size: 10, weight: 700 }); text(ctx, 'dies after eating Bt leaf', cx - 30, top + 20, { color: col.good, size: 10.5, weight: 700, align: 'right' }); }
    else if (k === 'stress') { for (let i = 0; i < 5; i++) line(ctx, [[cx - 40 + i * 20, gy + 6], [cx - 34 + i * 20, gy + 28]], col.s[0], 2); text(ctx, 'dry, salty or cold soil', w / 2, gy + 20, { color: col.muted, size: 10, align: 'center' }); }
    else if (k === 'shelf') { dot(ctx, cx + 4, top + 34, 11, col.bad, col.ink); text(ctx, 'stays firm for days', cx + 20, top + 34, { color: col.ink, size: 10.5, weight: 700 }); }
    else if (k === 'fert') { for (let i = 0; i < 4; i++) { const x = cx - 50 + i * 30; line(ctx, [[x, gy + 4], [x + 10, gy + 30]], col.s[3], 2); } text(ctx, 'roots take up minerals better', cx, gy + 20, { color: col.muted, size: 10, align: 'center' }); }
    else { ctx.fillStyle = col.s[2]; ctx.fillRect(cx - 12, top + 30, 24, 14); text(ctx, 'oil / starch / medicine', cx + 20, top + 36, { color: col.s[2], size: 10.5, weight: 700 }); }
    void mainc;
    text(ctx, 'GM = the genome is changed with a gene from another organism', w / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
