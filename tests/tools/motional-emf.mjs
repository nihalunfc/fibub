// #1414 Rod on rails (motional emf)
export const path = '/learn/motional-emf/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/motional-emf/`); await page.waitForTimeout(700);
  const R = '.mem ', txt = (s) => page.textContent(R + s);
  const set = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await txt('.mem-big')) === 'ε = Bℓv = 0.5 × 0.5 × 4 = 1 V', `motional: example emf (${await txt('.mem-big')})`);
  check((await txt('.mem-text')).includes('I = ε/R = 0.5 A') && (await txt('.mem-text')).includes('F = BIℓ = 0.125 N'), `motional: current and force (${await txt('.mem-text')})`);
  check((await txt('.mem-facts')).includes('Power to keep it moving0.5 W') && (await txt('.mem-facts')).includes('Heat in R0.5 W'), 'motional: power');
  const inked = (s) => page.$eval(R + s, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60 || Math.abs(d[i + 2] - d[2]) > 60) n++; return n; });
  check((await inked('.mem-fig')) > 1500 && (await inked('.mem-graph')) > 300, 'motional: drawings');
  await set('.mem-v', 8); await page.waitForTimeout(80);
  check((await txt('.mem-big')) === 'ε = Bℓv = 0.5 × 0.5 × 8 = 2 V' && (await txt('.mem-facts')).includes('Power to keep it moving2 W'), 'motional: double speed, four times the power');
  await set('.mem-v', 4);
  await page.click(R + '.mem-mode button[data-v=coast]'); await page.waitForTimeout(80);
  check((await txt('.mem-gtext')).includes('τ = mR/(B²ℓ²) = 6.4 s') && (await txt('.mem-gtext')).includes('½mv₀² = 1.6 J') && !(await page.$eval(R + '.mem-mwrap', (e) => e.hidden)), `motional: coast (${await txt('.mem-gtext')})`);
  await page.click(R + '.mem-go'); await page.waitForTimeout(1200); await page.click(R + '.mem-go');
  const v = parseFloat((await txt('.mem-facts')).match(/Speed now([\d.]+)/)[1]);
  check(v < 4 && v > 3, `motional: the rod slows down (${v} m/s)`);
  await page.click(R + '.mem-reset');
  check((await txt('.mem-facts')).includes('Speed now4 m/s'), 'motional: reset');
  await page.click(R + '.mem-mode button[data-v=pull]'); await page.waitForTimeout(80);
  check((await txt('.mem-gtext')).includes('= 16 m/s') && (await page.$eval(R + '.mem-vwrap', (e) => e.hidden)), `motional: pull top speed (${await txt('.mem-gtext')})`);
  await set('.mem-r', 4); await page.waitForTimeout(80);
  check((await txt('.mem-gtext')).includes('= 32 m/s') && (await txt('.mem-rv')) === '4 Ω', `motional: bigger R, higher top speed (${await txt('.mem-gtext')})`);
  check((await page.$$(R + '.eq-q')).length === 4, 'motional: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), [l, v1, B] = q1.match(/A ([\d.]+) m rod moves at ([\d.]+) m\/s across a ([\d.]+) T/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String(B * l * v1)); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'motional: right answer accepted');

  // ---- Solve my numbers ----
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals, sels = {}) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(sels)) { if (k.startsWith('__u:')) await page.selectOption(`.ps-host [data-k="${id}-${k.slice(4)}-u"]`, v); else await page.selectOption(`.ps-host [data-k="${id}-${k}"]`, v); } for (const [k, v] of Object.entries(vals)) await page.fill(`.ps-host [data-k="${id}-${k}"]`, v); await page.waitForTimeout(80); };
  await psPre("Rod at 5 m/s"); check((await psAns()).includes("The induced emf is 1 V"), "motional-emf: example Rod at 5 m/s: The induced emf is 1 V");
  await psPre("Aeroplane wings"); check((await psAns()).includes("The induced emf is 500 mV"), "motional-emf: example Aeroplane wings: The induced emf is 500 mV");
  await psPre("Rod with a 2"); check((await psAns()).includes("the current 200 mA, the drag force 20 mN and the power 80 mW"), "motional-emf: example Rod with a 2: the current 200 mA, the drag force 20 mN and the power 80 mW");
  await psPre("Speed for 1 V"); check((await psAns()).includes("The speed needed is 20 m/s (72 km/h)"), "motional-emf: example Speed for 1 V: The speed needed is 20 m/s (72 km/h)");
  await psPre("Spinning 1 m rod"); check((await psAns()).includes("The emf between the centre and the rim is 500 mV"), "motional-emf: example Spinning 1 m rod: The emf between the centre and the rim is 500 mV");
  await psSet("emf", {"B": "2", "l": "50", "v": "3"}, {"__u:B": "T", "__u:l": "cm", "__u:v": "m/s"}); check((await psAns()).includes("The induced emf is 3 V."), "motional-emf: typed numbers: The induced emf is 3 V.");
  await psSet("emf", {"B": "0"}, {}); check((await psAns()).includes("must be more than 0"), "motional-emf: friendly message: must be more than 0");
  await psPre("Rod at 5 m/s"); await page.waitForTimeout(80);
  check((await psWork()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), "motional-emf: working shown, no NaN");
};
