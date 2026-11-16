// #1340 stress-strain tester and Searle's experiment
export const path = '/learn/stress-strain-test/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/stress-strain-test/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.sst .sst-facts'), pill = () => page.textContent('.sst .sst-pill');
  const setR = async (v) => { await page.$eval('.sst .sst-m', (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(120); };
  { const f = await facts(); check(f.includes('124.78 MPa') && f.includes('6.24 × 10⁻⁴') && f.includes('1.248 mm') && f.includes('33.7 kg') && (await pill()).startsWith('Elastic'), 'stress-strain-test: steel 10 kg example'); }
  check(await page.$eval('.sst .sst-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 500; }), 'stress-strain-test: picture drawn');
  await setR(25);
  check((await pill()).startsWith('Plastic') && (await facts()).includes('311.94 MPa') && (await facts()).includes('59.7 mm longer'), 'stress-strain-test: 25 kg: plastic, 59.7 mm permanent set');
  await setR(0);
  check((await pill()).startsWith('Unloaded after yielding') && (await facts()).includes('59.7 mm'), 'stress-strain-test: unloaded keeps a permanent stretch');
  await setR(36);
  check((await pill()).includes('broken'), 'stress-strain-test: 36 kg breaks the wire');
  await setR(10);
  check((await pill()).includes('broken'), 'stress-strain-test: a broken wire stays broken');
  await page.click('.sst .sst-new'); await page.waitForTimeout(100);
  check((await pill()).startsWith('Elastic'), 'stress-strain-test: new wire');
  await page.click('.sst .sst-zoom [data-v="start"]'); await page.waitForTimeout(100);
  await page.click('.sst .sst-mat [data-v="copper"]'); await page.waitForTimeout(100);
  check((await facts()).includes('120 GPa') && (await facts()).includes('17.6 kg'), 'stress-strain-test: copper: 120 GPa, breaks at 17.6 kg');
  await page.click('.sst .sst-mat [data-v="rubber"]'); await page.waitForTimeout(100);
  check((await facts()).includes('0.002 GPa') && Number(await page.$eval('.sst .sst-m', (e) => e.max)) === 1, 'stress-strain-test: rubber');
  await page.selectOption('.sst .sst-d', '5'); await page.waitForTimeout(100);
  await setR(5);
  check((await pill()).startsWith('Elastic but not a straight line'), 'stress-strain-test: rubber stretches far and springs back');
  // Searle's experiment
  await page.click('.sst .sst-mode [data-v="searle"]'); await page.waitForTimeout(100);
  check(!(await page.isVisible('.sst .sst-rubber')) && (await page.isVisible('.sst .sst-myst')), 'stress-strain-test: Searle hides rubber, shows mystery');
  await page.selectOption('.sst .sst-d', '1'); await page.waitForTimeout(100);
  for (let i = 0; i < 8; i++) await page.click('.sst .sst-add');
  await page.waitForTimeout(100);
  const rows = await page.$$eval('.sst .sst-table tbody tr', (t) => t.map((r) => [...r.children].map((c) => c.textContent)));
  check(rows.length === 9 && rows[8][0] === '4' && Math.abs(Number(rows[8][1]) - 0.5) <= 0.02, `stress-strain-test: Searle readings (4 kg → ${rows[8] && rows[8][1]} mm)`);
  { const f = await facts(), m = f.match(/Your Young's modulus([\d.]+) GPa/); check(m && Math.abs(Number(m[1]) - 200) < 12, `stress-strain-test: Y from the readings near 200 GPa (${m && m[1]})`); }
  await page.click('.sst .sst-off'); await page.waitForTimeout(80);
  check((await page.$$('.sst .sst-table tbody tr')).length === 10, 'stress-strain-test: take a load off adds a reading');
  await page.click('.sst .sst-mat [data-v="mystery"]'); await page.waitForTimeout(100);
  for (let i = 0; i < 6; i++) await page.click('.sst .sst-add');
  check((await facts()).includes('? (find it)') && (await facts()).includes('reveal to compare'), 'stress-strain-test: mystery wire hides Y');
  await page.click('.sst .sst-reveal'); await page.waitForTimeout(80);
  check(/set value \d+ GPa/.test(await facts()), 'stress-strain-test: reveal');
  await page.click('.sst .sst-clear'); await page.waitForTimeout(80);
  check((await page.$$('.sst .sst-table tbody tr')).length === 1, 'stress-strain-test: start again');
  const ans = await page.$eval('.sst .sq-q', (e) => e.dataset.ans);
  await page.fill('.sst .sq-q .sq-in', ans); await page.click('.sst .sq-q .sq-check');
  check((await page.textContent('.sst .sq-q .sq-res')) === 'Right!' && (await page.$$('.sst .sq-q')).length === 4, 'stress-strain-test: quiz');

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
  const T = (cond, msg) => check(cond, `stress-strain-test: ${msg}`);
  await psPre('Steel wire stress'); T((await psAns()).includes('The stress is 63.7 MPa'), 'example Steel wire stress');
  await psPre("Searle's Y"); T((await psAns()).includes("Young's modulus is 201 GPa"), 'example Searle Y');
  await psPre('Copper, 10 kg load'); T((await psAns()).includes('stretches by 3.12 mm under a 98 N pull'), 'example Copper, 10 kg load');
  await psPre('Safe load'); T((await psAns()).includes('It breaks at 1320 N; the largest safe load is 330 N (about 33.7 kg)'), 'example Safe load');
  await psPre('Past the yield'); T((await psAns()).includes('above the yield strength (250 MPa)'), 'example Past the yield');
  await psSet('strain', {'dL': '1.5', 'L': '2'}, {'dL': 'mm', 'L': 'm'}); T((await psAns()).includes('(0.075 %)'), 'strain 1.5 mm over 2 m is 0.075 %');
  await psSet('ext', {'F': '100', 'L': '2', 'd': '1', 'Y': '200'}, {'d': 'mm', 'Y': 'GPa'}); T((await psAns()).includes('The wire stretches by 1.27 mm.'), 'extension 1.27 mm');
  await psSet('U', {'F': '100', 'dL': '1.27'}, {'dL': 'mm'}); T((await psAns()).includes('stores 0.0635 J'), 'elastic energy 0.0635 J');
  await psSet('stress', {'F': '0.05', 'd': '0.1'}, {'F': 'kN', 'd': 'cm'}); T((await psAns()).includes('The stress is 63.7 MPa'), 'kN and cm units give 63.7 MPa');
  await psSet('elastic', {'F': '500', 'd': '2', 'sy': '250'}, {}); T((await psAns()).includes('stays elastic, with a safety factor of 1.57'), '500 N on 2 mm stays elastic');
  await psSet('stress', {'F': '50', 'd': '0'}); T((await psAns()).includes('must be more than 0'), 'd = 0 gives a friendly message');
  await psPre('Steel wire stress');
  await psPre('Steel wire stress'); T((await psWork()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), 'working shown, no NaN');
  }
};
