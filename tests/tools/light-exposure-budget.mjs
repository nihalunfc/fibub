// #419 light exposure budget for museum objects
export const path = '/science/light-exposure-budget/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.leb ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check((await page.textContent(R + '.le-big')) === '120,000 lux-hours a year: 120.0 % of the budget', 'light: example display 120,000 lx·h, 120 %');
  { const f = await page.textContent(R + '.le-facts'); check(f.includes('Over the budget by20,000 lx·h') && f.includes('250 days') && f.includes('41.7 lux') && f.includes('1.50 mW/m²') && f.includes('13 kJ/m²'), 'light: over by, days and lux allowed, UV'); }
  check((await page.textContent(R + '.le-note')).includes('over the yearly budget'), 'light: over-budget advice');
  check((await page.textContent(R + '.le-pbig')) === '124,800 of 200,000 lux-hours used (62.4 %)', 'light: example plan total');
  { const f = await page.textContent(R + '.le-pfacts'); check(f.includes('Budget left75,200') && f.includes('up to 188 days') && f.includes('Average per year62,400'), 'light: plan budget left and next display'); }
  check((await page.textContent(R + '.le-tab')).includes('123,800') && await page.isVisible(R + '.le-fig'), 'light: plan table and chart');
  await page.fill(R + '.le-d', '200'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.le-big')).startsWith('80,000 lux-hours') && (await page.textContent(R + '.le-note')).includes('20,000 lux-hours to spare'), 'light: fits the budget');
  await page.fill(R + '.le-uvmax', '20'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.le-note')).includes('over your limit of 20 µW/lm'), 'light: UV over the user limit');
  await page.fill(R + '.le-uvmax', '75'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.le-note')).includes('within your limit of 75'), 'light: UV within the limit');
  await page.fill(R + '.le-uv', ''); await page.waitForTimeout(400);
  check(!(await page.textContent(R + '.le-facts')).includes('UV'), 'light: UV left out when empty');
  await page.fill(R + '.le-h', '30'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.le-err')).includes('hours per day run from 0 to 24') && await page.isHidden(R + '.le-out'), 'light: bad hours message');
  await page.fill(R + '.le-h', '8');
  await page.fill(R + '.le-budget', '50000'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.le-pbig')).includes('of 100,000') && (await page.textContent(R + '.le-pfacts')).includes('Over the budget by24,800') && (await page.textContent(R + '.le-tab')).includes('(over)'), 'light: smaller budget, plan over');
  await page.fill(R + '.le-budget', '0'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.le-err')).includes('yearly budget') && await page.isHidden(R + '.le-pout'), 'light: bad budget message');
  await page.fill(R + '.le-budget', '100000'); await page.fill(R + '.le-years', '1'); await page.fill(R + '.le-nlux', '100'); await page.fill(R + '.le-nh', '10'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.le-pbig')).includes('124,800 of 100,000') && (await page.textContent(R + '.le-pfacts')).includes('no budget left'), 'light: one-year plan over budget');
  await page.fill(R + '.le-years', '3'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.le-pfacts')).includes('up to 175 days'), 'light: next display at 100 lux, 10 h: 175 days');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.le-csv')]); const f = OUT + 'plan.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 6 && rows[0].startsWith('period,lux') && rows[1] === 'Opening display,50,8,180,72000,72000,24.00' && rows[5] === 'plan budget,,,,300000,,', 'light: plan CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=docx]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'light: Word report'); }
  await page.fill(R + '.le-in', 'Show\t50\t8\t10\nBroken\t50'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.le-perr')).includes('Line 2') && (await page.textContent(R + '.le-pbig')).startsWith('4,000 of'), 'light: bad plan row message');
  writeFileSync(OUT + 'plan-in.csv', 'Period,Lux,Hours,Days\nGallery,40,9,100\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'plan-in.csv'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.le-pbig')).startsWith('36,000 of 300,000'), 'light: open a plan CSV');
  await page.click(R + '.le-ex'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.le-pbig')) === '124,800 of 200,000 lux-hours used (62.4 %)', 'light: example button');
};
