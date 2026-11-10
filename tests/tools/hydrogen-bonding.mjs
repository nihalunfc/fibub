// #1368 Hydrogen bonding in water and ice (geometry in tests/sci-tools/hydrogen-bonding.mjs)
export const path = '/learn/hydrogen-bonding/';
export default async ({ page, check, BASE }) => {
  const R = '.hbx ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/hydrogen-bonding/`); await page.waitForTimeout(800);
  check((await t('.hb-big')).startsWith('Liquid water:') && (await t('.hb-facts')).includes('Molecules in the box40'), `hbond: liquid (${await t('.hb-big')})`);
  const n1 = +(await t('.hb-big')).match(/(\d+) hydrogen bonds/)[1];
  check(n1 > 10 && n1 <= 80, `hbond: some bonds in the liquid (${n1})`);
  const px = await page.evaluate(() => { const c = document.querySelector('.hb-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 140 && d[i + 1] < 80 && d[i + 2] < 80) n++; return n; });
  check(px > 2000, `hbond: oxygens drawn red (${px} px)`);
  await page.click(R + '.hb-play'); check((await t('.hb-play')) === 'Play', 'hbond: pause');
  await slide('.hb-t', -10);
  check((await t('.hb-big')) === 'Ice: 72 hydrogen bonds, locked in place' && (await t('.hb-facts')).includes('Molecules in the box36') && (await t('.hb-facts')).includes('4.0'), `hbond: ice (${await t('.hb-big')} ${await t('.hb-facts')})`);
  await slide('.hb-t', 100); check((await t('.hb-big')).startsWith('Boiling:'), 'hbond: boiling');
  await page.click(R + '.hb-play'); await page.waitForTimeout(300); check((await t('.hb-play')) === 'Pause', 'hbond: play again');
  check((await t('.hb-ans')).includes('H₂O: yes'), 'hbond: water sorts yes');
  await page.click(R + '.hb-mols button[data-m=h2s]'); check((await t('.hb-ans')).includes('no hydrogen bonds') && (await t('.hb-why')).includes('less electronegative'), 'hbond: H2S no');
  await page.click(R + '.hb-mols button[data-m=ch3och3]'); check((await t('.hb-ans')).includes('only with water'), 'hbond: ether acceptor');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 3, 'hbond: three quiz questions');
  await page.click(R + '.smq-q:nth-child(2) .smq-choices button:nth-child(3)'); await page.click(R + '.smq-q:nth-child(2) .smq-check');
  check((await t('.smq-q:nth-child(2) .smq-out')) === 'Right!', 'hbond: quiz answer');
  await page.click(R + '.hb-play');
};
