// #301 mark-recapture estimator
export const path = '/science/mark-recapture/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const T = (s) => page.textContent('.mrc ' + s);
  await page.goto(`${BASE}/science/mark-recapture/`); await page.waitForTimeout(500);
  check((await T('.mr-big')) === 'N ≈ 642 (95 % interval 464 to 943)', 'mark-recapture: example Chapman estimate with log-normal interval');
  { const f = await T('.mr-facts'); check(f.includes('642.21') && f.includes('666.67') && f.includes('error119') && f.includes('18.5 %') && f.includes('202'), 'mark-recapture: example facts'); }
  await page.selectOption('.mrc .mr-ci', 'normal'); await page.waitForTimeout(350);
  check((await T('.mr-big')).includes('409 to 875'), 'mark-recapture: normal interval');
  await page.selectOption('.mrc .mr-ci', 'poisson'); await page.waitForTimeout(350);
  check((await T('.mr-big')).includes('414 to 1,046'), 'mark-recapture: Poisson interval');
  await page.selectOption('.mrc .mr-conf', '0.99'); await page.waitForTimeout(350);
  check((await T('.mr-big')).includes('99 % interval'), 'mark-recapture: 99 % confidence');
  await page.selectOption('.mrc .mr-conf', '0.95'); await page.selectOption('.mrc .mr-ci', 'lognormal');
  await page.fill('.mrc .mr-R', '3'); await page.fill('.mrc .mr-M', '50'); await page.fill('.mrc .mr-C', '40'); await page.waitForTimeout(350);
  check((await T('.mr-big')) === 'N ≈ 522 (95 % interval 262 to 1,167)' && (await T('.mr-facts')).includes('fewer than 7'), 'mark-recapture: few recaptures warned');
  await page.fill('.mrc .mr-R', '0'); await page.waitForTimeout(350);
  check((await T('.mr-facts')).includes('not defined') && (await T('.mr-big')).startsWith('N ≈ 2,090'), 'mark-recapture: no recaptures still gives Chapman');
  await page.fill('.mrc .mr-R', '60'); await page.waitForTimeout(350);
  check((await T('.mr-err')).includes('cannot be more than the number caught') && await page.isHidden('.mrc .mr-out'), 'mark-recapture: R above C rejected');
  await page.fill('.mrc .mr-R', '2.5'); await page.waitForTimeout(350);
  check((await T('.mr-err')).includes('whole numbers'), 'mark-recapture: fractional count rejected');
  await page.fill('.mrc .mr-R', '18'); await page.fill('.mrc .mr-M', '120'); await page.fill('.mrc .mr-C', '100'); await page.waitForTimeout(350);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mrc .mr-csv')]); const f = OUT + 'mr2.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.includes('Chapman,642.2105') && t.includes('Lower 95 %,463.59'), 'mark-recapture: two-sample CSV'); }
  await page.locator('.mrc .mr-mode button[data-m=many]').scrollIntoViewIfNeeded(); await page.click('.mrc .mr-mode button[data-m=many]'); await page.waitForTimeout(300);
  check((await T('.mr-big')) === 'N ≈ 217 (95 % interval 163 to 294)', 'mark-recapture: Schnabel example');
  { const t = await T('.mr-tab'); check(t.includes('4104') && t.includes('108') && t.includes('217'), 'mark-recapture: occasions table'); check(await page.isVisible('.mrc .mr-fig') && (await T('.mr-facts')).includes('212.29'), 'mark-recapture: Schnabel chart and adjusted estimate'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mrc .mr-csv')]); const f = OUT + 'mr5.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0].startsWith('Occasion,Caught C') && rows.length === 12 && rows.some((r) => r.startsWith('Schnabel N,216.708')), 'mark-recapture: Schnabel CSV'); }
  await page.fill('.mrc .mr-data', '60\t0\n70\t12\n80\t25\n75\t30\n90\t45\n85\t48'); await page.waitForTimeout(400);
  check((await T('.mr-big')) === 'N ≈ 429 (95 % interval 356 to 538)' && (await T('.mr-facts')).includes('t interval'), 'mark-recapture: 50+ recaptures use the t interval');
  await page.fill('.mrc .mr-data', '10\t2\n5\t1'); await page.waitForTimeout(400);
  check((await T('.mr-err')).includes('only 0 marked'), 'mark-recapture: impossible recaptures message');
  await page.fill('.mrc .mr-data', '10\t0\n12\t0'); await page.waitForTimeout(400);
  check((await T('.mr-err')).includes('No recaptures'), 'mark-recapture: no recaptures message');
  await page.fill('.mrc .mr-data', '30\t0\t30\n35\t5\t30\n40\t11\t29\n32\t13\t19\n38\t19\t19'); await page.waitForTimeout(400);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mrc .dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'mark-recapture: PDF report'); }
};
