// #1390 life cycle wheel (cycles checked in tests/sci-tools/life-cycle-wheel.mjs)
export const path = '/learn/life-cycle-wheel/';
export default async ({ page, check, BASE }) => {
  const R = '.lcw ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/life-cycle-wheel/`); await page.waitForTimeout(400);
  check((await t('.lc-title')) === 'Bryophyte (moss, liverwort)' && (await t('.lc-stage')).startsWith('1. Leafy gametophyte (haploid, n)'), `lifecycle: opens on moss (${await t('.lc-title')})`);
  { const f = await t('.lc-facts'); check(f.includes('Haplo-diplontic') && f.includes('Gametophyte (n)') && f.includes('n 74 %, 2n 26 %'), `lifecycle: moss facts (${f})`); }
  check((await page.$$eval(R + '.lc-seg', (e) => e.length)) === 6 && (await page.$$eval(R + '.lc-evt', (e) => e.map((x) => x.textContent).sort().join())) === 'F,M', 'lifecycle: 6 segments, M and F');
  await page.click(R + '.lc-next');
  check((await t('.lc-stage')).includes('fertilisation joins two gametes'), 'lifecycle: next stage');
  await page.click(R + '.lc-next'); await page.click(R + '.lc-next');
  check((await t('.lc-stage')).startsWith('4. Sporophyte') && (await t('.lc-stage')).includes('meiosis halves'), 'lifecycle: sporophyte then meiosis');
  await page.click(R + '.lc-prev');
  check((await t('.lc-stage')).startsWith('3. Zygote'), 'lifecycle: back');
  await page.$eval(R + '.lc-wheel .lc-seg[data-i="0"]', (e) => e.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  check((await t('.lc-stage')).startsWith('1. '), 'lifecycle: tap a segment');
  await page.click(R + '.lc-groups button[data-i="4"]');
  check((await t('.lc-facts')).includes('Diplontic') && (await t('.lc-extra')).includes('3n'), 'lifecycle: angiosperm');
  await page.click(R + '.lc-groups button[data-i="0"]');
  check((await t('.lc-facts')).includes('Haplontic'), 'lifecycle: alga');
  check((await page.$$eval(R + '.lc-tab tbody tr', (e) => e.length)) === 6, 'lifecycle: table of 6 groups');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'lifecycle: five quiz questions');
  await page.click(R + '.smq-q:nth-child(3) .smq-choices button:nth-child(3)'); await page.click(R + '.smq-q:nth-child(3) .smq-check');
  check((await t('.smq-q:nth-child(3) .smq-out')) === 'Right!', 'lifecycle: quiz answer');
};
