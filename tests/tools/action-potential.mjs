// #1128 Nerve impulse lab
export const path = '/learn/action-potential/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.apt ';
  await page.goto(`${BASE}/learn/action-potential/`); await page.waitForTimeout(800);
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(250); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(300); };
  const big = () => page.textContent(R + '.apt-big');
  check((await big()) === 'Spike! It peaks at +39 mV', `nerve: example spike (${await big()})`);
  await slide('.apt-i', 6);
  check((await big()) === 'Too weak: no impulse' && (await page.textContent(R + '.apt-facts')).includes('below threshold'), 'nerve: 6 is below threshold');
  await slide('.apt-i', 7);
  check((await big()).startsWith('Spike!') && (await page.textContent(R + '.apt-say')).includes('all-or-none'), 'nerve: 7 fires, all or none');
  await slide('.apt-i', 0);
  check((await big()) === 'No push, no impulse', 'nerve: no stimulus');
  await slide('.apt-i', 10);
  check(await page.isHidden(R + '.apt-g'), 'nerve: no channel graph at Class 10');
  check((await page.textContent(R + '.apt-formula')).includes('0.1 m ÷ 2.0 m/s = 50.0 ms without myelin; 0.1 m ÷ 24 m/s = 4.17 ms with myelin'), 'nerve: Class 10 speed sum');
  // Race
  const before = await page.$eval(R + '.apt-fig', (c) => c.toDataURL());
  await tap('.apt-race'); await page.waitForTimeout(800);
  const mid = await page.$eval(R + '.apt-fig', (c) => c.toDataURL());
  check(before !== mid, 'nerve: impulse moves along the axon');
  await page.waitForTimeout(2400);
  const end = await page.$eval(R + '.apt-fig', (c) => c.toDataURL());
  check(end !== mid, 'nerve: race goes on to the end');
  // Class 11
  await tap('.apt-level button[data-v="11"]');
  check(await page.isVisible(R + '.apt-g') && (await page.textContent(R + '.apt-facts')).includes('hyperpolarisation') && (await page.textContent(R + '.apt-facts')).includes('µA/cm²'), 'nerve: Class 11 channels and facts');
  check((await page.textContent(R + '.apt-formula')).includes('√4 = 2.00 m/s') && (await page.textContent(R + '.apt-formula')).includes('(12 times faster)'), 'nerve: Class 11 speed rules');
  await slide('.apt-d', 9);
  check((await page.textContent(R + '.apt-formula')).includes('6 × 9 = 54 m/s') && (await page.textContent(R + '.apt-dv')) === '9 µm', 'nerve: thicker axon');
  // Reaction test: early tap, then two real goes
  await page.locator(R + '.apt-rt').scrollIntoViewIfNeeded();
  await page.click(R + '.apt-rt'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.apt-rt')) === 'Wait for it…', 'nerve: reaction test waits');
  await page.click(R + '.apt-rt'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.apt-rt')).startsWith('Too soon'), 'nerve: early tap caught');
  for (let k = 0; k < 2; k++) {
    await page.click(R + '.apt-rt');
    await page.waitForSelector(R + '.apt-rt[data-s=go]', { timeout: 6000 });
    await page.waitForTimeout(120);
    await page.click(R + '.apt-rt'); await page.waitForTimeout(150);
  }
  const t = await page.textContent(R + '.apt-times');
  check(/^Your times: \d+, \d+ ms$/.test(t) && (await page.textContent(R + '.apt-rt')).includes('go 3 of 5') && (await page.textContent(R + '.apt-rfacts')).includes('about 25 ms'), `nerve: reaction times (${t})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'nerve.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'nerve: image report'); }
  for (const lv of ['11', '10']) {
    await tap(`.apt-level button[data-v="${lv}"]`);
    const n = await page.$$eval(R + '.apt-qs li', (l) => l.length);
    await tap('.apt-check');
    check((await page.textContent(R + '.apt-score')) === `0 of ${n} right.`, `nerve: Class ${lv} blanks wrong`);
    await page.$$eval(R + '.apt-qs li', (lis) => lis.forEach((li) => { li.querySelector('.apt-ans').value = li.dataset.a; }));
    await tap('.apt-check');
    check((await page.textContent(R + '.apt-score')) === `${n} of ${n} right.` && n === (lv === '11' ? 5 : 4), `nerve: Class ${lv} quiz (${n})`);
  }
};
