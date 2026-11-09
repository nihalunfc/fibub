// #397 feed ration balancer
export const path = '/science/feed-ration-balancer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/feed-ration-balancer/`); await page.waitForTimeout(500);
  check(await page.isHidden('.frb .fr-out'), 'ration: nothing shown before feeds are given');
  await page.click('.frb .fr-ex'); await page.waitForTimeout(200);
  check((await page.textContent('.frb .fr-big')) === 'Cost 4.44 per day for 21 kg DM (41.01 kg as fed)', `ration: example least cost (${await page.textContent('.frb .fr-big')})`);
  { const t = await page.textContent('.frb .fr-tab'); check(t.includes('Grass hay (example)8.019.11') && t.includes('Maize silage (example)10.0028.57') && t.includes('Barley grain (example)0.000.00') && t.includes('Soybean meal (example)2.913.27'), 'ration: example feed amounts'); }
  { const t = await page.textContent('.frb .fr-ntab'); check(t.includes('Crude protein (g)3000') && t.includes('Energy (MJ ME)220') && t.includes('Phosphorus (g)65.43') && t.includes('14.30 %') && t.includes('10.5 per kg'), 'ration: nutrients supplied'); }
  check((await page.textContent('.frb .fr-note')).includes('Crude protein minimum; Energy minimum; Calcium minimum; Maize silage (example) maximum'), 'ration: binding limits listed');
  // Pearson square: hay and soybean meal to 16 % CP.
  check((await page.textContent('.frb .fr-sqout')) === 'Mix 84.2 % Grass hay (example) with 15.8 % Soybean meal (example) (dry-matter basis). As fed, that is 84.4 % and 15.6 %.', 'ration: Pearson square example');
  check((await page.textContent('.frb .fr-square')).includes('Parts of Grass hay (example)32'), 'ration: Pearson square parts');
  await page.fill('.frb .fr-target', '60'); await page.waitForTimeout(100);
  check((await page.textContent('.frb .fr-sqout')).startsWith('The target must lie between'), 'ration: Pearson target out of range');
  await page.selectOption('.frb .fr-nut', 'energy'); await page.fill('.frb .fr-target', '12'); await page.selectOption('.frb .fr-b', '2'); await page.waitForTimeout(100);
  check((await page.textContent('.frb .fr-sqout')).startsWith('Mix 25.0 % Grass hay (example) with 75.0 % Barley grain'), `ration: Pearson square on energy (${await page.textContent('.frb .fr-sqout')})`);
  await page.selectOption('.frb .fr-b', '0'); await page.waitForTimeout(100);
  check((await page.textContent('.frb .fr-sqout')) === 'Pick two different feeds.', 'ration: same feed twice');
  // Energy unit and a maximum.
  await page.fill('.frb .fr-unit', 'Mcal NEL'); await page.waitForTimeout(400);
  check((await page.textContent('.frb .fr-ntab')).includes('Energy (Mcal NEL)'), 'ration: energy unit label');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.frb .fr-csv')]); const f = OUT + 'ration.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('feed,kg_DM_per_day') && t.includes('Maize silage (example),10.0000,28.5714') && t.includes('total,') && t.includes('Crude protein (g),3000.0000,3000,'), 'ration: CSV download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.frb .dl [data-f=pdf]')]); check((await d.suggestedFilename()) === 'least-cost-ration.pdf', 'ration: PDF report'); }
  // Impossible requirement.
  await page.fill('.frb .fr-cpMin', '12000'); await page.waitForTimeout(400);
  check((await page.textContent('.frb .fr-big')) === 'No ration meets every limit' && (await page.textContent('.frb .fr-note')).includes('Crude protein minimum') && await page.isDisabled('.frb .fr-csv'), 'ration: infeasible requirement explained');
  await page.fill('.frb .fr-cpMin', 'abc'); await page.waitForTimeout(400);
  check((await page.textContent('.frb .fr-err')).includes('"abc" is not a number'), 'ration: bad requirement message');
  await page.fill('.frb .fr-cpMin', '3000');
  await page.fill('.frb .fr-in', 'Hay, 120, 10, 9, 0.5, 0.2, 0.1\nOats, 89, 11, 12, 0.1, 0.35, 0.2'); await page.waitForTimeout(400);
  check((await page.textContent('.frb .fr-err')).includes('at most 100 %') && await page.isVisible('.frb .fr-out'), 'ration: bad feed row message, other feeds still used');
  // Open a file.
  writeFileSync(OUT + 'feeds.csv', 'Feed,DM,CP,Energy,Ca,P,Price\nA,90,10,10,0.5,0.3,0.1\nB,90,40,12,0.4,0.6,0.4\n');
  await page.setInputFiles('.frb .dfb-in', OUT + 'feeds.csv'); await page.waitForTimeout(500);
  check((await page.inputValue('.frb .fr-in')).startsWith('Feed\tDM') && (await page.textContent('.frb .fr-a')).includes('A'), 'ration: feeds opened from a file');
};
