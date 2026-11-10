// Hormone and gland map (#1308): a teaching model of blood sugar control by negative feedback. Glucose from a meal
// enters the blood; the pancreas answers a rise with insulin (cells and liver take glucose in) and a fall with glucagon
// (the liver lets glucose out). Made-up round rates, simulated minute by minute. Not medical. No DOM.

export type Body = 'healthy' | 'none' | 'weak';
export type Event = { kind: 'meal' | 'run'; at: number }; // at: minutes from the start

export const SET = 90;               // mg/dL the loop aims for
export const P = {
  meal: 160,                          // total rise a meal would give (mg/dL) with no control at all
  tau: 30,                            // minutes: how quickly the meal is absorbed
  run: 0.9,                           // mg/dL a minute used while running
  runFor: 40,                         // minutes
  sIns: 1, tIns: 20, kIns: 0.0005,    // insulin: release per mg/dL above SET, response time, effect
  sGlu: 1, tGlu: 8, kGlu: 0.1,       // glucagon: release per mg/dL below SET, response time, effect
  clear: 0.004,                       // insulin-free clearance a minute (brain, other tissues)
  kidney: 180,                        // above this some glucose is lost in urine
  kidneyK: 0.01,
};

/** Rate of glucose arriving from a meal eaten at minute `at`, at minute t (mg/dL a minute). */
export const mealRate = (t: number, at: number) => { const s = t - at; return s <= 0 ? 0 : (P.meal * s * Math.exp(-s / P.tau)) / (P.tau * P.tau); };

export type Run = { t: number[]; g: number[]; ins: number[]; glu: number[] };

/** Simulate `minutes` minutes in 1-minute steps (with 6 sub-steps for stability). */
export function simulate(events: Event[], body: Body, minutes = 720): Run {
  const out: Run = { t: [], g: [], ins: [], glu: [] };
  let G = SET, I = 0, N = 0;
  const sub = 6, dt = 1 / sub;
  const s = body === 'none' ? 0 : P.sIns, kI = body === 'weak' ? P.kIns * 0.25 : P.kIns;
  for (let m = 0; m <= minutes; m++) {
    out.t.push(m); out.g.push(G); out.ins.push(I); out.glu.push(N);
    for (let k = 0; k < sub; k++) {
      const t = m + k * dt;
      let ra = 0, ex = 0;
      for (const e of events) {
        if (e.kind === 'meal') ra += mealRate(t, e.at);
        else if (t >= e.at && t < e.at + P.runFor) ex += P.run;
      }
      const iTarget = s * Math.max(0, G - SET), nTarget = P.sGlu * Math.max(0, SET - G);
      I += ((iTarget - I) / P.tIns) * dt;
      N += ((nTarget - N) / P.tGlu) * dt;
      const dG = ra - ex - kI * I * G - P.clear * (G - SET) + P.kGlu * N - P.kidneyK * Math.max(0, G - P.kidney);
      G = Math.max(20, G + dG * dt);
    }
  }
  return out;
}

export function summary(r: Run) {
  let peak = -Infinity, low = Infinity, above = 0, peakAt = 0;
  r.g.forEach((g, i) => { if (g > peak) { peak = g; peakAt = r.t[i]; } if (g < low) low = g; if (g > 140) above++; });
  return { peak, peakAt, low, minutesAbove140: above, end: r.g[r.g.length - 1] };
}

/** The glands for the map: Class 10 text and extra Class 11 text. */
export const GLANDS = [
  { id: 'pineal', name: 'Pineal gland', hormone: 'Melatonin', t10: 'Helps set the daily rhythm of sleeping and waking.', t11: 'Melatonin also affects body temperature, metabolism and the timing of puberty.' },
  { id: 'hypothalamus', name: 'Hypothalamus', hormone: 'Releasing hormones', t10: 'Part of the brain that tells the pituitary when to release its hormones.', t11: 'Its releasing and inhibiting hormones reach the front pituitary through a short blood vessel link; it also makes ADH and oxytocin.' },
  { id: 'pituitary', name: 'Pituitary gland', hormone: 'Growth hormone and others', t10: 'The "master gland": growth hormone controls growth; too little in childhood causes dwarfism, too much gigantism. It also controls other glands.', t11: 'Front lobe: GH, TSH, ACTH, FSH, LH, prolactin. Back lobe: ADH (water saving) and oxytocin (birth, milk let-down).' },
  { id: 'thyroid', name: 'Thyroid gland', hormone: 'Thyroxin', t10: 'Controls how fast the body uses carbohydrates, proteins and fats. It needs iodine: too little iodine can cause goitre, a swollen neck, which is why salt is iodised.', t11: 'Thyroxin (T4) and T3 set the metabolic rate; calcitonin lowers blood calcium. The parathyroids behind it make parathormone, which raises blood calcium.' },
  { id: 'thymus', name: 'Thymus', hormone: 'Thymosins', t10: 'Helps the immune system develop in children; it shrinks after puberty.', t11: 'Thymosins help T cells mature, which fight infections.' },
  { id: 'adrenal', name: 'Adrenal glands', hormone: 'Adrenaline', t10: 'On top of the kidneys. Adrenaline gets the body ready for "fight or flight": faster heartbeat and breathing, more blood to the muscles.', t11: 'Inner part (medulla): adrenaline and noradrenaline. Outer part (cortex): cortisol (stress, blood sugar) and aldosterone (salt and water balance).' },
  { id: 'pancreas', name: 'Pancreas', hormone: 'Insulin and glucagon', t10: 'Insulin lowers blood sugar; too little causes diabetes. Glucagon raises it. Together they keep it steady (the loop below).', t11: 'The islets of Langerhans: beta cells make insulin, alpha cells make glucagon. The pancreas also makes digestive juice through a duct.' },
  { id: 'gonads', name: 'Testes or ovaries', hormone: 'Testosterone or oestrogen', t10: 'Testosterone (testes) and oestrogen (ovaries) bring the changes of puberty and control making sperm or eggs.', t11: 'Ovaries also make progesterone, which prepares and keeps the lining of the uterus during pregnancy.' },
];
