// #490 heart rate and power zones
export const path = '/science/heart-rate-zones/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/heart-rate-zones/`); await page.waitForTimeout(500);
  const R = '.hrz ';
  check((await page.textContent(R + '.hrz-med')).includes('not medical advice'), 'hrzones: medical line shown');
  check((await page.textContent(R + '.hrz-big')) === 'Max HR 180 beats/min', 'hrzones: example max HR (Tanaka, age 40)');
  { const t = await page.textContent(R + '.hrz-tab'); check(['90–108', '108–126', '126–144', '144–162', '162–180', 'Very light'].every((s) => t.includes(s)), 'hrzones: % of max zones table'); }
  { const f = await page.textContent(R + '.hrz-facts'); check(f.includes('Tanaka') && f.includes('185 beats/min') && f.includes('179 beats/min'), 'hrzones: all four equations shown (Nes 185, Gellish 179)'); }
  check(await page.isVisible(R + '.hrz-fig') && await page.isVisible(R + '.hrz-pfig'), 'hrzones: both bar pictures drawn');
  await page.click(R + '.hrz-meth button[data-m=hrr]'); await page.waitForTimeout(100);
  { const t = await page.textContent(R + '.hrz-tab'); check(['120–132', '132–144', '168–180', '% of reserve'].every((s) => t.includes(s)) && (await page.textContent(R + '.hrz-facts')).includes('Heart rate reserve120'), 'hrzones: Karvonen zones'); }
  for (const [eq, want] of [['fox', 180], ['gellish', 179], ['nes', 185]]) { await page.selectOption(R + '.hrz-eq', eq); await page.waitForTimeout(80); check((await page.textContent(R + '.hrz-big')) === `Max HR ${want} beats/min`, `hrzones: equation ${eq}`); }
  await page.fill(R + '.hrz-age', '70'); await page.selectOption(R + '.hrz-eq', 'nes'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.hrz-big')) === 'Max HR 166 beats/min', 'hrzones: Nes at 70 = 166');
  await page.selectOption(R + '.hrz-eq', 'measured'); await page.fill(R + '.hrz-meas', '190'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.hrz-big')) === 'Max HR 190 beats/min' && (await page.textContent(R + '.hrz-facts')).includes('measured'), 'hrzones: measured maximum');
  await page.fill(R + '.hrz-b', '60, 75, 90, 100'); await page.waitForTimeout(350);
  { const n = await page.$$eval(R + '.hrz-tab tr', (r) => r.length); check(n === 4 && (await page.textContent(R + '.hrz-tab')).includes('138–158') && (await page.textContent(R + '.hrz-tab')).includes('177–190'), 'hrzones: custom 3-zone boundaries (Karvonen, rest 60, max 190)'); }
  await page.click(R + '.hrz-meth button[data-m=max]'); await page.waitForTimeout(100);
  // power
  { const t = await page.textContent(R + '.hrz-ptab'); check(['0–138', '138–188', '263–300', '375+', 'Threshold'].every((s) => t.includes(s)), 'hrzones: power zones from FTP 250'); }
  await page.fill(R + '.hrz-ftp', '300'); await page.fill(R + '.hrz-pb', '60, 80, 100'); await page.waitForTimeout(350);
  { const t = await page.textContent(R + '.hrz-ptab'); check(t.includes('0–180') && t.includes('240–300') && t.includes('300+') && !t.includes('Threshold'), 'hrzones: custom power bands'); }
  // CSV
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hrz-csv')]); const f = OUT + 'hz.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows[0] === 'type,zone,name,low_pct,high_pct,low,high,unit' && rows.length === 1 + 3 + 4 && rows[1] === 'heart rate,1,,60,75,114,142.5,beats/min' && rows[7] === 'power,4,,100,,300,,W', `hrzones: CSV (${rows[1]} | ${rows[7]})`); }
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${f}]`)]); check(d.suggestedFilename().endsWith('.' + f), `hrzones: ${f} download`); }
  // bad input
  await page.fill(R + '.hrz-b', '80, 70'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.hrz-err')).includes('rise') && await page.isHidden(R + '.hrz-out'), 'hrzones: falling boundaries message');
  await page.fill(R + '.hrz-b', '50, 60, 70'); await page.selectOption(R + '.hrz-eq', 'tanaka'); await page.fill(R + '.hrz-age', 'abc'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.hrz-err')).includes('age'), 'hrzones: bad age message');
  await page.fill(R + '.hrz-age', '40'); await page.click(R + '.hrz-meth button[data-m=hrr]'); await page.fill(R + '.hrz-rest', '175'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.hrz-err')).includes('resting'), 'hrzones: resting HR too high message');
  await page.fill(R + '.hrz-ftp', '0'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.hrz-perr')).includes('FTP') && await page.isHidden(R + '.hrz-pout'), 'hrzones: bad FTP message');
};
