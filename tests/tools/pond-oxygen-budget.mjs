// #402 pond oxygen budget
export const path = '/science/pond-oxygen-budget/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/pond-oxygen-budget/`); await page.waitForTimeout(500);
  check(await page.isHidden('.pob .po-out') && await page.isHidden('.pob .po-sat'), 'pond O2: quiet before input');
  await page.fill('.pob .po-temp', '20'); await page.waitForTimeout(400);
  check((await page.textContent('.pob .po-sat')).includes('9.09 mg/L') && (await page.textContent('.pob .po-sat')).includes('101.3 kPa'), 'pond O2: saturation at 20 °C');
  await page.fill('.pob .po-alt', '1500'); await page.waitForTimeout(400);
  check((await page.textContent('.pob .po-sat')).includes('7.55 mg/L') && (await page.textContent('.pob .po-sat')).includes('84.6 kPa'), `pond O2: saturation at 1500 m (${await page.textContent('.pob .po-sat')})`);
  await page.fill('.pob .po-alt', '0'); await page.fill('.pob .po-sal', '35'); await page.waitForTimeout(400);
  check((await page.textContent('.pob .po-sat')).includes('7.40 mg/L'), `pond O2: sea water (${await page.textContent('.pob .po-sat')})`);
  await page.fill('.pob .po-temp', '50'); await page.waitForTimeout(400);
  check((await page.textContent('.pob .po-err')).includes('0 to 40 °C') && await page.isHidden('.pob .po-sat'), 'pond O2: temperature out of range');
  await page.click('.pob .po-ex'); await page.waitForTimeout(400);
  check((await page.textContent('.pob .po-big')) === 'Add about 0.442 kg O₂ per hour to stay above 3 mg/L', `pond O2: example aeration (${await page.textContent('.pob .po-big')})`);
  { const t = await page.textContent('.pob .po-facts'); check(t.includes('DO at dawn2.23 mg/L') && t.includes('after 9 h 41 min') && t.includes('0.635 mg/L per hour') && t.includes('sediment 0.0347') && t.includes('115 % of saturation') && t.includes('7.83 mg/L') && t.includes('0.0737 mg/L per hour in 6000 m³; about 0.442 kW'), `pond O2: example facts (${t})`); }
  check((await page.$$('.pob .po-tab tr')).length === 13 && (await page.textContent('.pob .po-tab tr:last-child')) === '112.233.00', `pond O2: hourly table (${await page.textContent('.pob .po-tab tr:last-child')})`);
  check((await page.getAttribute('.pob .po-fig', 'aria-label')) === 'Dissolved oxygen from dusk to dawn, 9.00 to 2.23 mg/L', 'pond O2: figure');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pob .po-csv')]); const f = OUT + 'pond.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(t.length === 13 && t[0] === 'hours_after_dusk,do_mg_l,do_with_extra_aeration_mg_l' && t[12] === '11,2.23,3.00', 'pond O2: CSV download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pob .dl [data-f=pdf]')]); check(d.suggestedFilename() === 'pond-oxygen-budget.pdf', 'pond O2: PDF report'); }
  await page.fill('.pob .po-aer', '5'); await page.waitForTimeout(400);
  check((await page.textContent('.pob .po-big')) === 'DO stays above 3 mg/L until dawn' && (await page.textContent('.pob .po-facts')).includes('not before dawn') && (await page.$$('.pob .po-tab tr:first-child th')).length === 2, 'pond O2: enough aeration already');
  await page.fill('.pob .po-aer', '0'); await page.fill('.pob .po-kl', '0'); await page.waitForTimeout(400);
  check((await page.textContent('.pob .po-facts')).includes('DO at dawn2.02 mg/L'), 'pond O2: no surface reaeration');
  await page.fill('.pob .po-fish', '20000'); await page.waitForTimeout(400);
  check((await page.textContent('.pob .po-facts')).includes('oxygen runs out after'), 'pond O2: oxygen runs out');
  await page.fill('.pob .po-c0', '2'); await page.waitForTimeout(400);
  check((await page.textContent('.pob .po-big')) === 'DO is already below 3 mg/L at dusk', 'pond O2: below the minimum at dusk');
  await page.fill('.pob .po-water', '-1'); await page.waitForTimeout(400);
  check((await page.textContent('.pob .po-err')).includes('cannot be negative') && await page.isHidden('.pob .po-out'), 'pond O2: negative rate message');
  await page.fill('.pob .po-water', '0.3'); await page.fill('.pob .po-depth', ''); await page.waitForTimeout(400);
  check((await page.textContent('.pob .po-err')).includes('Give the area, depth'), 'pond O2: missing depth message');
};
