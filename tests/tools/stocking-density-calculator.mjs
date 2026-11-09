// #401 stocking density and FCR calculator
export const path = '/science/stocking-density-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/stocking-density-calculator/`); await page.waitForTimeout(500);
  check(await page.isHidden('.sdc .sd-f1') && await page.isHidden('.sdc .sd-out') && await page.isHidden('.sdc .sd-err1'), 'stock: quiet before input');
  await page.click('.sdc .sd-ex'); await page.waitForTimeout(400);
  { const t = await page.textContent('.sdc .sd-f1'); check(t.includes('15.08 m³') && t.includes('180 kg') && t.includes('11.94 kg/m³') && t.includes('Fish at your target5,026') && t.includes('room for 3,526 more'), `stock: volume, biomass, density, max fish (${t})`); }
  { const t = await page.textContent('.sdc .sd-f2'); check(t.includes('FCR1.17') && t.includes('1.831 % per day') && t.includes('119.4 kg') && t.includes('98.0 %'), `stock: FCR and SGR (${t})`); }
  check((await page.textContent('.sdc .sd-big')) === '400 g in 65.8 days: 586.9 kg at 38.9 kg/m³', `stock: harvest projection (${await page.textContent('.sdc .sd-big')})`);
  { const n = await page.textContent('.sdc .sd-note'); check(n.includes('About 1,467 fish left, 452.8 kg of feed') && n.includes('stays under your target'), 'stock: projection note'); }
  check((await page.$$('.sdc .sd-tab tr')).length === 12 && (await page.textContent('.sdc .sd-tab tr:last-child')).startsWith('66'), 'stock: weekly table ends at harvest');
  await page.fill('.sdc .sd-t', '30'); await page.waitForTimeout(400);
  check((await page.textContent('.sdc .sd-note')).includes('passes your target of 30 kg/m³ by day 56') && (await page.$$('.sdc .sd-tab tr.over')).length === 3 && (await page.textContent('.sdc .sd-f1')).includes('room for 2,269 more'), 'stock: over-target warning');
  await page.selectOption('.sdc .sd-step', '1'); await page.waitForTimeout(200);
  check((await page.$$('.sdc .sd-tab tr')).length === 68, 'stock: daily rows');
  await page.fill('.sdc .sd-sgr', '2'); await page.waitForTimeout(400);
  check((await page.textContent('.sdc .sd-big')).startsWith('400 g in 60.2 days'), 'stock: typed SGR');
  await page.selectOption('.sdc .sd-shape', 'rect'); await page.fill('.sdc .sd-L', '10'); await page.fill('.sdc .sd-W', '5'); await page.fill('.sdc .sd-D', '1.5'); await page.waitForTimeout(400);
  check(await page.isHidden('.sdc .sd-d') && (await page.textContent('.sdc .sd-f1')).includes('75 m³') && (await page.textContent('.sdc .sd-f1')).includes('2.4 kg/m³'), 'stock: rectangular pond');
  await page.selectOption('.sdc .sd-shape', 'volume'); await page.fill('.sdc .sd-V', '6'); await page.waitForTimeout(400);
  check((await page.textContent('.sdc .sd-f1')).includes('30 kg/m³') && (await page.textContent('.sdc .sd-f1')).includes('too many') === false, 'stock: volume typed');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sdc .sd-csv')]); const f = OUT + 'stock.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(t[0] === 'day,mean_weight_g,fish,biomass_kg,density_kg_m3,feed_per_day_kg,feed_cumulative_kg' && t[1] === '0,120.000,1500.0,180.000,30.0000,3.6000,0.000', 'stock: CSV download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sdc .dl [data-f=docx]')]); check(d.suggestedFilename() === 'stocking-density.docx', 'stock: Word report'); }
  // Bad input.
  await page.fill('.sdc .sd-hw', '100'); await page.waitForTimeout(400);
  check((await page.textContent('.sdc .sd-err3')).includes('harvest weight above') && await page.isHidden('.sdc .sd-out'), 'stock: harvest weight below the present weight');
  await page.fill('.sdc .sd-g1', 'abc'); await page.waitForTimeout(400);
  check((await page.textContent('.sdc .sd-err2')).includes('start and end mean weights'), 'stock: bad growth input');
  await page.fill('.sdc .sd-g1', '120'); await page.fill('.sdc .sd-feed', '140'); await page.fill('.sdc .sd-n1', '400'); await page.waitForTimeout(400);
  check((await page.textContent('.sdc .sd-f2')).includes('no biomass was gained'), 'stock: no gain, no FCR');
};
