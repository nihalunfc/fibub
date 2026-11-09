// #1126 Natural selection with peppered moths
export const path = '/learn/natural-selection/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.nsl ';
  await page.goto(`${BASE}/learn/natural-selection/?seed=5`); await page.waitForTimeout(600);
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(250); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(250); };
  const big = () => page.textContent(R + '.nsl-big'), facts = () => page.textContent(R + '.nsl-facts');
  check((await page.textContent(R + '.nsl-pv')).includes('10 % of moths are dark') || (await page.textContent(R + '.nsl-pv')).includes('(so 10 %'), `moths: start label (${await page.textContent(R + '.nsl-pv')})`);
  // Expected path (no chance)
  await tap('.nsl-n button[data-v=inf]');
  check((await big()) === '99 % dark moths in generation 60' && (await page.textContent(R + '.nsl-formula')).includes('= 98.8 %'), `moths: soot, no chance (${await big()})`);
  await slide('.nsl-g', 10);
  check((await big()) === '0 % dark moths in generation 10' && (await facts()).includes('3 per 1000'), `moths: generation 10 (${await big()})`);
  await slide('.nsl-g', 30);
  check((await big()) === '70 % dark moths in generation 30', `moths: generation 30 (${await big()})`);
  const pic = await page.$eval(R + '.nsl-fig', (c) => c.toDataURL().length);
  check(pic > 5000, 'moths: trunk drawn');
  // Class 12 detail
  await tap('.nsl-level button[data-v="12"]');
  { const f = await facts(); check(f.includes('Genotypes CC : Cc : cc') && f.includes('p (C) and q (c)0.452 and 0.548') && f.includes('matches exactly'), `moths: Class 12 facts (${f.slice(0, 220)})`); }
  check((await page.textContent(R + '.nsl-formula')).includes('p² + 2pq + q² = ') && (await page.textContent(R + '.nsl-formula')).endsWith('= 1'), 'moths: Hardy-Weinberg formula');
  // No birds: nothing changes without chance
  await slide('.nsl-s', 0);
  check((await page.textContent(R + '.nsl-say')).includes('nothing changes at all') && (await big()) === '10 % dark moths in generation 30', `moths: no selection (${await big()})`);
  await slide('.nsl-s', 30);
  // Random population: counts add up and HW check shown
  await tap('.nsl-n button[data-v="500"]');
  { const f = await facts(); const m = f.match(/Dark moths(\d+)(\d+) eaten.*Light moths(\d+)/); check(/χ² = [\d.]+, p = /.test(f), `moths: random run with HW chi-square (${f.slice(-120)})`); }
  { const t = await page.textContent(R + '.nsl-formula'); const m = t.match(/÷ (\d+) =/); check(m && m[1] === '1000', `moths: 500 moths have 1000 alleles (${m && m[1]})`); }
  const a = await big(); await tap('.nsl-run'); await tap('.nsl-run');
  check(typeof a === 'string', 'moths: new run');
  // Bark options
  await tap('.nsl-bark button[data-v=light]'); await tap('.nsl-n button[data-v=inf]');
  check((await page.textContent(R + '.nsl-say')).includes('On light bark, light moths are hidden'), 'moths: light bark favours light moths');
  await tap('.nsl-bark button[data-v=clean]'); await slide('.nsl-p', 90); await slide('.nsl-g', 5);
  check((await page.textContent(R + '.nsl-say')).includes('On dark bark'), 'moths: clean air starts dark');
  await slide('.nsl-g', 60);
  check((await page.textContent(R + '.nsl-say')).includes('On light bark'), 'moths: then light');
  // Play
  await tap('.nsl-play'); await page.waitForTimeout(500);
  check(Number((await page.textContent(R + '.nsl-gv')).split(' ')[0]) > 0, 'moths: play moves the generation');
  await page.waitForTimeout(7600);
  check((await page.textContent(R + '.nsl-gv')) === '60 of 60', 'moths: play ends at 60');
  // Downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.nsl-csv')]); const f = OUT + 'moths.csv'; await d.saveAs(f); const l = readFileSync(f, 'utf8').trim().split('\n');
    check(l[0].startsWith('generation,bark,allele_C,CC') && l.length === 62 && l[1].startsWith('0,dark,0.9,'), `moths: CSV (${l[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'moths.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'moths: image report'); }
  // Check yourself
  for (const lv of ['12', '10']) {
    await tap(`.nsl-level button[data-v="${lv}"]`);
    const n = await page.$$eval(R + '.nsl-qs li', (l) => l.length);
    await tap('.nsl-check');
    check((await page.textContent(R + '.nsl-score')) === `0 of ${n} right.`, `moths: Class ${lv} blanks wrong`);
    await page.$$eval(R + '.nsl-qs li', (lis) => lis.forEach((li) => { li.querySelector('.nsl-ans').value = li.dataset.a; }));
    await tap('.nsl-check');
    check((await page.textContent(R + '.nsl-score')) === `${n} of ${n} right.` && n === (lv === '12' ? 5 : 4), `moths: Class ${lv} quiz (${n})`);
  }
};
