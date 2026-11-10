// #1356 periodic trends
export const path = '/learn/periodic-trends/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/periodic-trends/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.ptr .ptr-facts'), flags = () => page.textContent('.ptr .ptr-flags');
  check((await page.$$('.ptr .ptr-cell')).length === 72, 'periodic-trends: 72 cells (periods 1 to 6, no f-block)');
  { const f = await facts(); check(f.includes('about 75 pm') && f.includes('1086 kJ/mol') && f.includes('11.26 eV') && f.includes('2.55') && (await page.textContent('.ptr .ptr-h')).startsWith('Carbon'), 'periodic-trends: carbon facts'); }
  check((await flags()).includes('radius falls across period 2'), 'periodic-trends: radius falls across period 2');
  check((await page.$eval('.ptr .ptr-c', (c) => c.getAttribute('aria-label'))).includes('Li 130, Be 95, B 85, C 75, N 70, O 65, F 55, Ne none'), 'periodic-trends: period 2 radii graphed');
  check(await page.$eval('.ptr .ptr-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 100; }), 'periodic-trends: graph drawn');
  await page.click('.ptr .ptr-prop [data-v="ie"]'); await page.waitForTimeout(100);
  { const f = await flags(); check(f.includes('Exception, Be → B') && f.includes('Exception, N → O') && f.includes('ionisation energy rises'), 'periodic-trends: IE exceptions Be→B and N→O'); }
  await page.click('.ptr .ptr-cell[data-z="13"]'); await page.click('.ptr .ptr-along [data-v="group"]'); await page.click('.ptr .ptr-prop [data-v="radius"]'); await page.waitForTimeout(100);
  check((await flags()).includes('Exception, Al → Ga') && (await page.textContent('.ptr .ptr-h')).startsWith('Aluminium'), 'periodic-trends: Al → Ga radius flagged');
  await page.click('.ptr .ptr-cell[data-z="55"]'); await page.click('.ptr .ptr-prop [data-v="en"]'); await page.waitForTimeout(100);
  check((await facts()).includes('0.79') && (await flags()).includes('electronegativity falls down group 1'), 'periodic-trends: caesium, electronegativity down group 1');
  await page.click('.ptr .ptr-cell[data-z="18"]'); await page.click('.ptr .ptr-prop [data-v="radius"]'); await page.waitForTimeout(100);
  check((await facts()).includes('noble gases form almost no bonds'), 'periodic-trends: argon has no radius shown');
  const ans = await page.$eval('.ptr .sq-q', (e) => e.dataset.ans);
  await page.fill('.ptr .sq-q .sq-in', ans); await page.click('.ptr .sq-q .sq-check');
  check((await page.textContent('.ptr .sq-q .sq-res')) === 'Right!' && (await page.$$('.ptr .sq-q')).length === 4, 'periodic-trends: quiz');
};
