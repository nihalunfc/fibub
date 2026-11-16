// #1344 capillary rise
export const path = '/learn/capillary-rise/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/capillary-rise/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.cr .cr-facts'), pill = () => page.textContent('.cr .cr-pill');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check(f.includes('2.98 cm') && f.includes('0.5 mm') && f.includes('292 Pa') && f.includes('0.229 mN') && (await pill()).startsWith('Rises'), 'capillary-rise: water, 0.5 mm example'); }
  check(await page.$eval('.cr .cr-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 300; }), 'capillary-rise: picture drawn');
  await setR('.cr .cr-r', 0.25);
  check((await facts()).includes('5.959 cm'), 'capillary-rise: half the radius, twice the rise');
  await setR('.cr .cr-r', 0.5);
  await page.click('.cr .cr-liq [data-v="soapy"]'); await page.waitForTimeout(100);
  check((await facts()).includes('1.224 cm'), 'capillary-rise: soapy water rises less');
  await page.click('.cr .cr-liq [data-v="mercury"]'); await page.waitForTimeout(100);
  check((await pill()).startsWith('Pushed down') && (await facts()).includes('Depth it is pushed down1.104 cm'), 'capillary-rise: mercury falls 1.104 cm');
  await page.click('.cr .cr-liq [data-v="water"]'); await setR('.cr .cr-L', 2);
  check((await pill()).includes('too short') && (await facts()).includes('0.745 mm'), 'capillary-rise: short tube: no overflow, flatter meniscus');
  const ans = await page.$eval('.cr .sq-q', (e) => e.dataset.ans);
  await page.fill('.cr .sq-q .sq-in', ans); await page.click('.cr .sq-q .sq-check');
  check((await page.textContent('.cr .sq-q .sq-res')) === 'Right!' && (await page.$$('.cr .sq-q')).length === 4, 'capillary-rise: quiz');

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
  const T = (cond, msg) => check(cond, `capillary-rise: ${msg}`);
  await psPre('Water in 0.5 mm tube'); T((await psAns()).includes('The liquid rises by 2.98 cm'), 'example Water in 0.5 mm tube');
  await psPre('Mercury in glass'); T((await psAns()).includes('is pushed down by 5.52 mm'), 'example Mercury in glass');
  await psPre('Tube for 3 cm rise'); T((await psAns()).includes('inner radius is 0.497 mm'), 'example Tube for 3 cm rise');
  await psPre('Measure T'); T((await psAns()).includes('The surface tension is 0.073 N/m (73 mN/m)'), 'example Measure T');
  await psPre('Wider tube'); T((await psAns()).includes('rises 1 cm'), 'example Wider tube');
  await psSet('h', {'T': '73', 'th': '0', 'r': '0.05', 'rho': '1', 'g': '9.8'}, {'T': 'mN/m', 'r': 'cm', 'rho': 'g/cm³'}); T((await psAns()).includes('The liquid rises by 2.98 cm'), 'mN/m, cm and g/cm3 units give 2.98 cm');
  await psSet('th', {'h': '-5.52', 'T': '0.48', 'r': '1', 'rho': '13600', 'g': '9.8'}, {}); T((await psAns()).includes('The contact angle is 140°.'), 'mercury angle 140 degrees');
  await psSet('h', {'T': '0.073', 'th': '90', 'r': '0.5', 'rho': '1000', 'g': '9.8'}); T((await psAns()).includes('stays level'), '90 degrees gives level liquid');
  await psSet('h', {'T': '0.073', 'th': '200', 'r': '0.5', 'rho': '1000', 'g': '9.8'}); T((await psAns()).includes('cannot be more than 180'), 'angle above 180 gives a friendly message');
  await psSet('r', {'h': '-30', 'T': '0.073', 'th': '0', 'rho': '1000', 'g': '9.8'}); T((await psAns()).includes('same sign'), 'sign mismatch gives a friendly message');
  await psPre('Water in 0.5 mm tube');
  await psPre('Water in 0.5 mm tube'); T((await psWork()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), 'working shown, no NaN');
  }
};
