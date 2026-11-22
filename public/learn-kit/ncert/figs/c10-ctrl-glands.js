// Class 10 Control and Coordination: the endocrine glands and their hormones. Pick a gland to light it on the body and read
// what it releases and does. Pituitary: growth hormone (and it controls other glands); thyroid: thyroxine (needs iodine,
// shortage gives goitre); pancreas: insulin; adrenals: adrenaline; testes: testosterone; ovaries: oestrogen.
import { canvas, text, title, line, dot, row, choice, readout } from '../../kit.js';

const G = {
  pit: { n: 'Pituitary', x: 0.5, y: 0.1, h: 'Growth hormone (and hormones that control other glands)', f: 'Controls growth of bones and body. Too little in childhood gives dwarfism; too much gives gigantism.', c: 4 },
  thy: { n: 'Thyroid', x: 0.5, y: 0.22, h: 'Thyroxine', f: 'Controls the rate at which the body uses carbohydrates, proteins and fats (metabolism). It needs <b>iodine</b>: shortage causes <b>goitre</b>, a swollen neck. Iodised salt prevents it.', c: 3 },
  adr: { n: 'Adrenal', x: 0.56, y: 0.45, h: 'Adrenaline', f: 'The emergency hormone: before an exam, a fright or a race the heart beats faster, breathing quickens and blood goes to the muscles (fight or flight).', c: 7 },
  pan: { n: 'Pancreas', x: 0.46, y: 0.52, h: 'Insulin', f: 'Lowers blood sugar by letting cells and liver take it up. Too little insulin causes diabetes.', c: 1 },
  tes: { n: 'Testes', x: 0.5, y: 0.7, h: 'Testosterone', f: 'In boys, brings changes at puberty: moustache and beard, a deeper voice, muscle growth.', c: 0 },
  ova: { n: 'Ovaries', x: 0.5, y: 0.64, h: 'Oestrogen', f: 'In girls, brings changes at puberty: breast development and the menstrual cycle.', c: 5 },
};
export default function (host) {
  let k = 'thy';
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A body outline with endocrine glands and the hormones each releases' });
  const ctl = row(host);
  choice(ctl, 'Gland', Object.entries(G).map(([v, o]) => [v, o.n]), k, (v) => { k = v; say(); });
  const out = readout(host);
  function say() { out.innerHTML = `<b>${G[k].n}</b> releases <b>${G[k].h}</b>. ${G[k].f}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, G[k].n + ' gland: ' + G[k].h.split(' (')[0], col) + 6, ph = h - top - 14, cx = w * 0.32;
    // body
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, top + ph * 0.1, ph * 0.07, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 8, top + ph * 0.17); ctx.lineTo(cx - 40, top + ph * 0.24); ctx.lineTo(cx - 50, top + ph * 0.55); ctx.moveTo(cx + 8, top + ph * 0.17); ctx.lineTo(cx + 40, top + ph * 0.24); ctx.lineTo(cx + 50, top + ph * 0.55); ctx.moveTo(cx - 40, top + ph * 0.24); ctx.lineTo(cx - 28, top + ph * 0.58); ctx.lineTo(cx - 34, top + ph * 0.98); ctx.moveTo(cx + 40, top + ph * 0.24); ctx.lineTo(cx + 28, top + ph * 0.58); ctx.lineTo(cx + 34, top + ph * 0.98); ctx.moveTo(cx - 28, top + ph * 0.58); ctx.lineTo(cx + 28, top + ph * 0.58); ctx.stroke();
    // glands
    Object.entries(G).forEach(([id, o]) => {
      const gx = cx + (o.x - 0.5) * 70, gy = top + o.y * ph * 1.2 + (id === 'pit' ? 0 : 0);
      dot(ctx, gx, gy, id === k ? 8 : 5, id === k ? col.s[o.c] : col.muted, id === k ? col.ink : null);
      text(ctx, o.n, id === 'pan' || id === 'ova' ? gx - 12 : gx + 14, gy, { color: id === k ? col.ink : col.muted, size: id === k ? 11 : 10, weight: id === k ? 700 : 400, align: id === 'pan' || id === 'ova' ? 'right' : 'left' });
    });
    // hormone pill at right
    const rx = w * 0.62; ctx.fillStyle = col.soft; ctx.fillRect(rx, top + 30, w - rx - 10, ph * 0.5); ctx.strokeStyle = col.s[G[k].c]; ctx.lineWidth = 2; ctx.strokeRect(rx, top + 30, w - rx - 10, ph * 0.5);
    text(ctx, 'hormone:', rx + 8, top + 46, { color: col.muted, size: 10 }); const hw = G[k].h.split(' (')[0].split(' '); hw.forEach((x, i) => text(ctx, x, rx + 8, top + 64 + i * 16, { color: col.ink, size: 13, weight: 700 }));
    text(ctx, 'travels in the blood', rx + 8, top + 30 + ph * 0.5 - 12, { color: col.s[G[k].c], size: 10, weight: 700 });
    text(ctx, 'tap a gland below', w / 2, h - 6, { color: col.muted, size: 10, align: 'center' });
  };
  say();
}
