// #1066 kinetic-theory
export const path = '/learn/kinetic-theory/';
export default async ({ page, check, BASE }) => {
  const R = '.kth ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  { const e = await t('.kt-eq'), f = await t('.kt-real');
    check(e.includes('√(3 × 8.314 × 300 / 0.0280) = 516.8 m/s') && e.includes('6.213 × 10⁻²¹ J'), 'gas: N₂ at 300 K v_rms 516.8 m/s, (3/2)kT 6.213e-21 J (Python)');
    check(f.includes('1861 km/h') && f.includes('476.2 m/s') && f.includes('422 m/s') && f.includes('111.4 kPa'), 'gas: mean 476.2, most likely 422 m/s, 111.4 kPa'); }
  check((await t('.kt-facts')).includes('Ideal-gas value1'), 'gas: ideal value 1 at the start');
  // Let the wall count build up: it should agree with the ideal value within the disc correction and noise.
  await page.waitForTimeout(6000);
  { const txt = await t('.kt-facts'); const m = txt.match(/wall hits(\d+\.\d+)/); const v = m ? +m[1] : NaN;
    check(v > 0.85 && v < 1.3, `gas: counted pressure near the ideal value (${v})`); }
  const inked = await page.$eval(R + '.kt-hist', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 140 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
  check(inked > 300, `gas: histogram drawn (${inked})`);
  await slide('.kt-T', 1200);
  check((await t('.kt-facts')).includes('Ideal-gas value4.00') && (await t('.kt-eq')).includes('= 1034 m/s') && (await t('.kt-Tv')) === '1200 K (927 °C)', 'gas: 4× temperature, 4× pressure, 2× speed');
  await slide('.kt-T', 300); await slide('.kt-W', 50);
  check((await t('.kt-facts')).includes('Ideal-gas value2.00') && (await t('.kt-Wv')) === '50%', 'gas: half width, double pressure');
  await slide('.kt-W', 100); await slide('.kt-N', 120);
  check((await t('.kt-facts')).includes('Ideal-gas value2.00') && (await t('.kt-peq')).includes('120 × 300'), 'gas: twice the particles, double pressure');
  await page.selectOption(R + '.kt-gas', 'he'); await page.waitForTimeout(150);
  check((await t('.kt-eq')).includes('= 1367 m/s'), 'gas: helium 1367 m/s');
  await page.click(R + '.kt-reset'); await page.waitForTimeout(150);
  check((await t('.kt-facts')).includes('counting'), 'gas: start again resets the count');
  await page.click(R + '.kt-play');
  check((await t('.kt-play')) === 'Play', 'gas: pause');
  await page.click(R + '.kt-play');
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'gas: five questions');
  for (const i of [0, 1, 2, 3]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  check((await t('.lq-score')).startsWith('4 of 5'), 'gas: four numeric answers accepted');

  // ---- Solve my numbers ----
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  {
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals, units = {}) => {
    await page.selectOption('.ps-host [data-k="prob"]', id);
    for (const [k, v] of Object.entries(vals)) { const sel = await page.$eval(`.ps-host [data-k="${id}-${k}"]`, (e) => e.tagName === 'SELECT'); if (sel) await page.selectOption(`.ps-host [data-k="${id}-${k}"]`, v); else await page.fill(`.ps-host [data-k="${id}-${k}"]`, v); }
    for (const [k, u] of Object.entries(units)) await page.selectOption(`.ps-host [data-k="${id}-${k}-u"]`, u);
    await page.waitForTimeout(80);
  };
  const T = (cond, msg) => check(cond, `kinetic-theory: ${msg}`);
  await psPre('Nitrogen at 27 °C'); T((await psAns()).includes('The root-mean-square speed is 517 m/s (1860 km/h)'), 'example Nitrogen at 27 °C');
  await psPre('Hydrogen vs oxygen'); T((await psAns()).includes('Gas 1 molecules move 4 times as fast'), 'example Hydrogen vs oxygen');
  await psPre('Energy of a molecule'); T((await psAns()).includes('6.22 × 10^-21 J (0.0388 eV); a mole has 3740 J'), 'example Energy of a molecule');
  await psPre('Speed at STP'); T((await psAns()).includes('The rms speed is 493 m/s'), 'example Speed at STP');
  await psPre('Gas in a flask'); T((await psAns()).includes('The pressure is 101 kPa (1 atm), from 6.02 × 10^23 molecules'), 'example Gas in a flask');
  await psSet('T', {'v': '517', 'M': '28'}, {'v': 'm/s', 'M': 'g/mol'}); T((await psAns()).includes('The temperature is 300 K (26.9 °C).'), 'speed 517 m/s for N2 gives 300 K');
  await psSet('P', {'rho': '1.25', 'v': '500'}, {}); T((await psAns()).includes('The pressure is 104 kPa (1.03 atm).'), 'P = rho v^2 / 3');
  await psSet('vrms', {'u': '1', 'T': '27', 'M': '0.028'}, {'M': 'kg/mol'}); T((await psAns()).includes('The root-mean-square speed is 517 m/s'), 'kg/mol unit gives 517 m/s');
  await psSet('vP', {'P': '101325', 'rho': '1.25'}, {'P': 'Pa'}); T((await psAns()).includes('The rms speed is 493 m/s'), 'Pa unit gives 493 m/s');
  await psSet('vrms', {'u': '1', 'T': '-300', 'M': '28'}); T((await psAns()).includes('above absolute zero'), 'below absolute zero gives a friendly message');
  await psSet('ratio', {'M1': '0', 'M2': '32'}); T((await psAns()).includes('must be more than 0'), 'molar mass 0 gives a friendly message');
  await psPre('Nitrogen at 27 °C');
  await psPre('Nitrogen at 27 °C'); T((await psWork()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), 'working shown, no NaN');
  }
};
