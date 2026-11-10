// #1339 g with height, depth and satellites
export const path = '/learn/gravity-height-depth/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/gravity-height-depth/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.gh .gh-facts'), eq = () => page.textContent('.gh .gh-eq');
  { const f = await facts(); check(f.includes('8.694 m/s²') && f.includes('88.5 %') && f.includes('434.7 N') && f.includes('7.673 km/s') && f.includes('92.4 min') && f.includes('10.851 km/s') && f.includes('−29.43 MJ'), 'gravity-height-depth: 400 km example'); }
  check((await eq()).includes('8.587 m/s²'), 'gravity-height-depth: short cut g(1 − 2h/R) shown');
  check(await page.$eval('.gh .gh-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 500; }), 'gravity-height-depth: picture drawn');
  await page.click('.gh .gh-half'); await page.waitForTimeout(150);
  check((await facts()).includes('4.911 m/s²') && (await eq()).includes('g₀ (1 − d/R)') && !(await facts()).includes('Orbit speed'), 'gravity-height-depth: halfway down: 4.91 m/s², no orbit');
  await page.click('.gh .gh-geo'); await page.waitForTimeout(150);
  check((await page.inputValue('.gh .gh-hn')) === '35786' && (await page.textContent('.gh .gh-note')).includes('35786 km') && (await facts()).includes('23.93 h'), 'gravity-height-depth: geostationary 35786 km, 23.93 h');
  await page.fill('.gh .gh-hn', '6371'); await page.waitForTimeout(150);
  check((await facts()).includes('2.455 m/s²') && (await facts()).includes('25 % of'), 'gravity-height-depth: one radius up: a quarter');
  await page.click('.gh .gh-planet [data-v="mars"]'); await page.waitForTimeout(150);
  await page.click('.gh [data-h="0"]'); await page.waitForTimeout(150);
  check((await facts()).includes('3.728 m/s²') && (await facts()).includes('5.03 km/s'), 'gravity-height-depth: Mars surface g and escape speed');
  await page.click('.gh .gh-planet [data-v="moon"]'); await page.click('.gh .gh-geo'); await page.waitForTimeout(150);
  check((await page.textContent('.gh .gh-note')).includes('too far out'), 'gravity-height-depth: no stationary orbit for the Moon');
  await page.click('.gh .gh-planet [data-v="earth"]'); await page.fill('.gh .gh-m', '0'); await page.waitForTimeout(100);
  check(!(await page.$eval('.gh .gh-err', (e) => e.hidden)), 'gravity-height-depth: bad mass message');
  await page.fill('.gh .gh-m', '50');
  { const b = await page.$eval('.gh .gh-c', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.right - 14, y: r.top + 100 }; });
    await page.mouse.move(b.x, b.y); await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(120);
    check(Number(await page.inputValue('.gh .gh-h')) > 40000, 'gravity-height-depth: tap on the graph moves the point'); }
  const ans = await page.$eval('.gh .sq-q', (e) => e.dataset.ans);
  await page.fill('.gh .sq-q .sq-in', ans); await page.click('.gh .sq-q .sq-check');
  check((await page.textContent('.gh .sq-q .sq-res')) === 'Right!' && (await page.$$('.gh .sq-q')).length === 4, 'gravity-height-depth: quiz');
};
