// Class 9 Reproduction: fertilisation and development in different animals. External fertilisation (fish, frog): eggs
// and sperm are released into water, many eggs are laid and most young do not survive. Internal fertilisation inside
// the body: birds (hen) make a shelled egg that develops outside; mammals (cow, humans) develop inside the mother and
// are fed and protected, so very few young are born at a time and parents care for them. The counts are typical, rough.
import { canvas, text, title, dot, line, row, choice, loop, readout } from '../../kit.js';

const A = {
  frog: { n: 'Frog', fert: 'outside the body, in water', dev: 'eggs in water, then tadpoles', young: 'hundreds to thousands of eggs', dots: 60, care: 'little or none' },
  hen: { n: 'Hen', fert: 'inside the body', dev: 'a shelled egg, outside the body', young: 'about one egg a day for some days', dots: 3, care: 'warms the eggs and guards the chicks' },
  human: { n: 'Cow or human', fert: 'inside the body', dev: 'inside the mother’s womb', young: 'usually one at a time', dots: 1, care: 'feeds and protects the young for a long time' },
};
export default function (host) {
  let a = 'frog', t = 0;
  const cv = canvas(host, { aspect: 0.75, max: 400, min: 290, label: 'Comparing fertilisation and development in a frog, a hen and a mammal' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  choice(ctl, 'Animal', [['frog', 'Frog'], ['hen', 'Hen'], ['human', 'Cow / human']], a, (v) => { a = v; t = 0; upd(); });
  const out = readout(host);
  function upd() { const d = A[a]; out.innerHTML = `<b>${d.n}</b>: fertilisation ${d.fert}; development ${d.dev}; ${d.young}; parental care ${d.care}. Fewer young survive without care, so animals with little care lay many more eggs.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const d = A[a]; title(ctx, `${d.n}: how a new life begins`, col);
    const rows = [['Fertilisation', d.fert], ['Development', d.dev], ['Young at a time', d.young], ['Parental care', d.care]];
    rows.forEach(([k, v], i) => { const y = 54 + i * 30; text(ctx, k, 12, y, { color: col.muted, size: 10.5 }); text(ctx, v, 12, y + 13, { color: col.ink, size: 11, weight: 700 }); });
    const top = 54 + 4 * 30 + 6, bh = h - top - 14;
    ctx.fillStyle = a === 'frog' ? col.soft : col.panel; ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.fillRect(12, top, w - 24, bh); ctx.strokeRect(12, top, w - 24, bh);
    text(ctx, a === 'frog' ? 'pond water' : a === 'hen' ? 'nest' : 'mother’s body (womb)', 18, top + 12, { color: col.muted, size: 10 });
    const n = d.dots, cols = Math.max(1, Math.min(15, Math.ceil(Math.sqrt(n * 2.5)))), sp = Math.min(18, (w - 50) / cols);
    for (let i = 0; i < n; i++) {
      const x = 28 + (i % cols) * sp + (a === 'frog' ? Math.sin(t * 2 + i) * 2 : 0), y = top + 34 + Math.floor(i / cols) * sp + (a === 'frog' ? Math.cos(t * 2 + i) * 2 : 0);
      if (a === 'human') { ctx.beginPath(); ctx.arc(w / 2, top + bh * 0.55, 20 + Math.sin(t * 2) * 1.5, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); }
      else if (a === 'hen') { ctx.beginPath(); ctx.ellipse(w / 2 + (i - 1) * 44, top + bh * 0.55, 13, 17, 0, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.5; ctx.stroke(); }
      else { dot(ctx, x, y, 4.2, col.s[2]); dot(ctx, x, y, 1.6, col.ink); }
    }
    text(ctx, a === 'frog' ? '60 shown (really far more)' : a === 'hen' ? '3 eggs shown' : '1 baby', w - 18, top + bh - 10, { color: col.muted, size: 10, align: 'right' });
  };
  upd();
}
