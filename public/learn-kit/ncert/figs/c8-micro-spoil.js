// Class 8 Science, Microscopic world: food preservation. Microbes spoil food when they have food, water, warmth and
// time. Each method takes one of these away or kills the microbes. Doubling time (hours) is an illustrative guide:
// nothing 1 h at room temperature, fridge 6 h, salt or sugar 12 h (water drawn out), dried 100 h, boiled and sealed: no growth.
import { canvas, text, title, dot, row, slider, choice, readout } from '../../kit.js';

const M = { none: ['No treatment', 1], fridge: ['Fridge', 6], salt: ['Salting (pickle)', 12], dry: ['Drying (sun)', 100], seal: ['Boil and seal', 0] };
export default function (host) {
  let m = 'none', d = 12;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 290, label: 'A food jar with microbe level over time depending on how it is preserved' });
  const ctl = row(host);
  choice(ctl, 'Method', Object.entries(M).map(([k, v]) => [k, v[0]]), m, (v) => { m = v; upd(); });
  slider(ctl, { label: 'Time kept', min: 0, max: 48, step: 1, value: d, fmt: (v) => `${v} h`, oninput: (v) => { d = v; upd(); } });
  const out = readout(host);
  const level = (hrs) => (M[m][1] ? Math.min(1, Math.pow(2, hrs / M[m][1]) / 5000) : 0);
  function upd() { const l = level(d); out.innerHTML = `<b>${M[m][0]}</b>, ${d} hours: ${l === 0 ? 'no microbes grow. The food stays good.' : l < 0.05 ? 'very few microbes. Still safe.' : l < 0.4 ? 'microbes are multiplying. The food starts to go off.' : 'spoiled: smell, slime or mould.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Keeping food from spoiling', col);
    const l = level(d), jx = 30, jy = 50, jw = 70, jh = 90;
    ctx.fillStyle = l > 0.4 ? col.warn || '#b60' : col.good; ctx.globalAlpha = 0.35; ctx.fillRect(jx, jy + 10, jw, jh - 10); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(jx, jy + 10, jw, jh - 10); ctx.strokeRect(jx - 4, jy, jw + 8, 10);
    const k = Math.round(l * 40);
    for (let i = 0; i < k; i++) dot(ctx, jx + 8 + ((i * 37) % 54), jy + 22 + ((i * 53) % 62), 2.2, col.bad);
    text(ctx, M[m][0], jx + jw / 2, jy + jh + 16, { color: col.ink, size: 11, weight: 700, align: 'center' });
    const bx = 130, bw = w - bx - 20;
    text(ctx, 'Microbe level', bx, 62, { color: col.ink, size: 11, weight: 700 });
    ctx.fillStyle = col.soft; ctx.fillRect(bx, 72, bw, 18); ctx.fillStyle = l > 0.4 ? col.bad : l > 0.05 ? col.s[2] : col.good; ctx.fillRect(bx, 72, Math.max(2, bw * l), 18);
    text(ctx, 'safe', bx, 104, { color: col.muted, size: 10 }); text(ctx, 'spoiled', bx + bw, 104, { color: col.muted, size: 10, align: 'right' });
    const why = { none: 'Food, water and warmth are all there.', fridge: 'Cold slows the microbes down.', salt: 'Salt pulls water out of microbes.', dry: 'No water, so they cannot grow.', seal: 'Heat kills microbes; the seal keeps new ones out.' }[m];
    text(ctx, why, bx, 130, { color: col.ink, size: 10.5 });
    text(ctx, 'Why do pickles and dried fish last for months?', 14, h - 30, { color: col.muted, size: 10.5 });
    text(ctx, 'Microbes need water, warmth and food.', 14, h - 12, { color: col.muted, size: 10.5 });
  };
  upd();
}
