// Chemical coordination: a map of the human endocrine glands. Pick a gland: it lights up on the body outline, and the
// readout lists its hormones, what each does and the disorder linked to too much or too little (NCERT Class 11).
import { canvas, text, row, choice, readout, dot } from '../../kit.js';

const G = {
  hyp: { name: 'Hypothalamus', at: [0.5, 0.09], h: 'releasing hormones (e.g. GnRH) and inhibiting hormones (e.g. somatostatin, which stops growth hormone release); they reach the anterior pituitary through a portal system. Its neurons also make oxytocin and vasopressin.', d: 'controls the pituitary, so its faults spread to many glands' },
  pit: { name: 'Pituitary', at: [0.5, 0.13], h: 'anterior (pars distalis): GH, prolactin, TSH, ACTH, LH, FSH; pars intermedia: MSH; posterior (pars nervosa) stores and releases oxytocin and vasopressin (ADH)', d: 'GH excess: gigantism (child), acromegaly (adult); GH lack: pituitary dwarfism; ADH lack: diabetes insipidus' },
  pin: { name: 'Pineal', at: [0.5, 0.06], h: 'melatonin: sets the 24-hour (diurnal) rhythm of sleep and waking and body temperature; also affects metabolism, pigmentation, the menstrual cycle and defence', d: '' },
  thy: { name: 'Thyroid', at: [0.5, 0.22], h: 'T₄ (thyroxine) and T₃: basal metabolic rate, red cell formation, carbohydrate, protein and fat metabolism, water and electrolyte balance; thyrocalcitonin (TCT): lowers blood calcium', d: 'iodine lack: goitre, hypothyroidism; in pregnancy: cretinism in the baby; excess: hyperthyroidism, exophthalmic goitre (Graves\' disease)' },
  para: { name: 'Parathyroid', at: [0.5, 0.235], h: 'parathyroid hormone (PTH): raises blood Ca²⁺ by dissolving bone, increasing Ca²⁺ reabsorption in kidney tubules and Ca²⁺ absorption from food (hypercalcaemic); works with TCT', d: 'low PTH lowers blood Ca²⁺ (tetany)' },
  thym: { name: 'Thymus', at: [0.5, 0.3], h: 'thymosins: differentiation of T lymphocytes (cell-mediated immunity) and help with antibody production (humoral immunity)', d: 'shrinks with age, so immunity weakens in old people' },
  adr: { name: 'Adrenal', at: [0.38, 0.47], h: 'medulla: adrenaline and noradrenaline (catecholamines, fight or flight: alertness, pupils dilate, hairs rise, sweating, faster heart and breathing, glycogen breakdown); cortex: glucocorticoids (cortisol: gluconeogenesis, anti-inflammatory, suppresses immunity, RBC production), mineralocorticoids (aldosterone: Na⁺ and water kept, K⁺ lost), small amounts of androgens', d: '' },
  pan: { name: 'Pancreas', at: [0.56, 0.52], h: 'islets of Langerhans: α cells make glucagon (raises blood glucose: glycogenolysis, gluconeogenesis); β cells make insulin (lowers blood glucose: uptake by liver and fat cells, glycogenesis)', d: 'lack of insulin action: diabetes mellitus (glucose and ketone bodies in urine)' },
  gon: { name: 'Gonads', at: [0.5, 0.66], h: 'testis (Leydig cells): androgens, mainly testosterone: male accessory organs, secondary sex characters, spermatogenesis, libido, anabolic effects; ovary: oestrogen (from growing follicles: female sex organs and characters, mammary growth) and progesterone (from the corpus luteum: supports pregnancy, milk alveoli)', d: '' },
  other: { name: 'Heart, kidney, gut', at: [0.44, 0.36], h: 'heart (atrial wall): ANF lowers blood pressure; kidney (JG cells): erythropoietin makes more red cells; gut: gastrin (HCl, pepsinogen), secretin (water and bicarbonate from pancreas), CCK (pancreatic enzymes and bile), GIP (slows the stomach)', d: '' },
};
export default function (host) {
  let cur = 'pit';
  const cv = canvas(host, { aspect: 0.75, max: 420, min: 300, label: 'Outline of the human body with the endocrine glands marked' });
  const ctl = row(host);
  choice(ctl, 'Gland', Object.entries(G).map(([k, g]) => [k, g.name]), cur, (v) => { cur = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => { const g = G[cur]; out.innerHTML = `<b>${g.name}</b>: ${g.h}.${g.d ? ` <i>Disorders:</i> ${g.d}.` : ''}`; };
  cv.draw = (ctx, w, h, col) => {
    const bw = Math.min(w * 0.5, h * 0.5), x0 = w * 0.3 - bw / 2, P = ([u, v]) => [x0 + u * bw, 10 + v * (h - 20)];
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.fillStyle = col.soft;
    const [hx, hy] = P([0.5, 0.09]);
    ctx.beginPath(); ctx.arc(hx, hy, bw * 0.13, 0, 7); ctx.fill(); ctx.stroke();
    const [nx, ny] = P([0.5, 0.2]);
    ctx.fillRect(nx - bw * 0.05, ny - 8, bw * 0.1, 18);
    const [tx, ty] = P([0.18, 0.26]), [bx, by] = P([0.82, 0.74]);
    ctx.beginPath(); ctx.roundRect(tx, ty, bx - tx, by - ty, 18); ctx.fill(); ctx.stroke();
    Object.entries(G).forEach(([k, g]) => {
      const [x, y] = P(g.at), on = k === cur;
      if (k === 'adr') { const [x2] = P([0.62, 0.47]); dot(ctx, x2, y, on ? 7 : 4, on ? col.s[1] : col.muted); }
      dot(ctx, x, y, on ? 7 : 4, on ? col.s[1] : col.muted);
    });
    const g = G[cur], [x, y] = P(g.at), lx = w * 0.62;
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 8, y); ctx.lineTo(lx - 6, y); ctx.stroke();
    text(ctx, g.name, lx, y, { color: col.ink, size: 13, weight: 700 });
  };
  cv.redraw(); show();
}
