// Class 12 Biology, Biotechnology and its Applications: uses of transgenic animals (animals with a foreign gene in their genome).
// Click a use to see the example. Rosie the cow (1997) made human alpha-lactalbumin-enriched milk; transgenic mice are used as disease models,
// for vaccine safety tests (polio vaccine) and for toxicity testing of chemicals.
import { canvas, text, title, line, dot, row, choice, readout } from '../../kit.js';

export default function (host) {
  let k = 'milk';
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 270, label: 'A transgenic animal with a foreign gene and a label for the use chosen: milk, disease model, vaccine safety, chemical safety or a human protein' });
  const ctl = row(host), ro = readout(host);
  const U = {
    milk: ['Better milk', 'Rosie (1997) was the first transgenic cow. Her milk had the human protein alpha-lactalbumin (2.4 grams per litre), a more balanced food for babies than ordinary cow milk.', 'cow'],
    model: ['Disease models', 'Transgenic mice carrying genes linked to cancer, cystic fibrosis, rheumatoid arthritis or Alzheimer disease let scientists study the disease and test new drugs.', 'mouse'],
    vaccine: ['Vaccine safety', 'Transgenic mice are used to test the safety of the polio vaccine, which reduces the need to use monkeys and cuts cost.', 'mouse'],
    chem: ['Chemical safety', 'Transgenic animals are made more sensitive to toxic substances, so a chemical can be tested for toxicity on fewer animals and in less time.', 'mouse'],
    protein: ['Biological products', 'Transgenic animals can make human proteins that are useful medicines, for example alpha-1-antitrypsin used for emphysema.', 'sheep'],
  };
  choice(ctl, 'Use', Object.entries(U).map(([id, v]) => [id, v[0]]), 'milk', (v) => { k = v; go(); });
  const go = () => { ro.textContent = U[k][1]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Transgenic animals: ' + U[k][0], col) + 10, cx = w * 0.4, cy = top + (h - top) * 0.5, kind = U[k][2];
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5;
    if (kind === 'cow') { ctx.fillRect(cx - 52, cy - 22, 104, 50); ctx.strokeRect(cx - 52, cy - 22, 104, 50); ctx.fillRect(cx + 42, cy - 38, 36, 30); ctx.strokeRect(cx + 42, cy - 38, 36, 30); [-40, -22, 22, 40].forEach((x) => line(ctx, [[cx + x, cy + 28], [cx + x, cy + 54]], col.ink, 4)); dot(ctx, cx + 70, cy - 28, 2.5, col.ink); ctx.fillStyle = col.panel; ctx.fillRect(cx - 12, cy + 28, 20, 10); for (let i = 0; i < 3; i++) dot(ctx, cx - 2, cy + 46 + i * 6, 2, col.s[0]); text(ctx, 'milk with a human protein', cx - 10, cy + 74, { color: col.s[0], size: 10.5, weight: 700, align: 'center' }); }
    else if (kind === 'mouse') { ctx.beginPath(); ctx.ellipse(cx, cy, 44, 24, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx + 44, cy - 6, 18, 14, 0, 0, 7); ctx.fill(); ctx.stroke(); dot(ctx, cx + 52, cy - 14, 9, col.soft, col.ink); dot(ctx, cx + 56, cy - 8, 2, col.ink); ctx.beginPath(); ctx.moveTo(cx - 44, cy); ctx.bezierCurveTo(cx - 80, cy - 20, cx - 90, cy + 20, cx - 110, cy - 6); ctx.stroke(); text(ctx, k === 'vaccine' ? 'polio vaccine test' : k === 'chem' ? 'toxin test' : 'disease gene', cx, cy + 46, { color: col.s[2], size: 10.5, weight: 700, align: 'center' }); }
    else { ctx.beginPath(); ctx.ellipse(cx, cy, 50, 28, 0, 0, 7); ctx.fill(); ctx.stroke(); dot(ctx, cx + 56, cy - 16, 15, col.soft, col.ink); [-30, -12, 12, 30].forEach((x) => line(ctx, [[cx + x, cy + 26], [cx + x, cy + 52]], col.ink, 4)); text(ctx, 'human protein in milk', cx, cy + 74, { color: col.s[0], size: 10.5, weight: 700, align: 'center' }); }
    // DNA strip inside the cell box
    const bx = w * 0.72, by = cy - 40; ctx.fillStyle = col.panel; ctx.fillRect(bx - 34, by, 68, 80); ctx.lineWidth = 1.5; ctx.strokeRect(bx - 34, by, 68, 80);
    text(ctx, 'genome', bx, by + 10, { color: col.muted, size: 10, align: 'center' });
    line(ctx, [[bx - 24, by + 34], [bx + 24, by + 34]], col.ink, 4); line(ctx, [[bx - 24, by + 34], [bx - 6, by + 34]], col.ink, 4); line(ctx, [[bx - 6, by + 34], [bx + 10, by + 34]], col.s[2], 8); text(ctx, 'foreign gene', bx, by + 56, { color: col.s[2], size: 10, weight: 700, align: 'center' });
    text(ctx, 'transgenic = carries a gene from another species', w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
