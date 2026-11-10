// #1292 Rusting lab
export const path = '/learn/rusting-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/rusting-lab/`); await page.waitForSelector('.rl .rl-fig .rl-glass');
  const R = '.rl ';
  const txt = (s) => page.textContent(R + s);
  const res = () => page.$$eval(R + '.rl-res', (c) => c.map((x) => x.textContent));
  const day = async (d) => { await page.$eval(R + '.rl-d', (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input')); }, d); await page.waitForTimeout(80); };
  check((await page.$$(R + '.rl-glass')).length === 6 && (await page.$$(R + '.rl-rust')).length === 0 && (await res()).every((x) => x === 'none'), 'rust: six clean nails on day 0');
  await day(7);
  let r = await res();
  check(r[0] === 'none' && r[1] === 'none' && r[2] === 'some rust (39%)' && r[3] === 'covered in rust (75%)' && r[4] === 'none' && r[5] === 'none', `rust: day 7 results (${r.join(' | ')})`);
  await day(21);
  r = await res();
  check(r[2].includes('77%') && r[3].includes('99%') && (await txt('.rl-table')).includes('Day 21'), 'rust: day 21');
  const spots = (await page.$$(R + '.rl-rust')).length;
  check(spots > 30, `rust: rust spots drawn (${spots})`);
  await page.check(R + '.rl-scr'); await page.waitForTimeout(100);
  r = await res();
  check(r[4] !== 'none' && r[5] === 'none' && (await page.$$(R + '.rl-scratch')).length === 2 && (await txt('.rl-say')).includes('scratched'), 'rust: scratched paint rusts, zinc does not');
  await page.click(R + '.rl-reset'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.rl-d')) === '0' && (await txt('.rl-say')).startsWith('Day 0'), 'rust: back to day 0');
  await page.click(R + '.rl-play'); await page.waitForTimeout(9000);
  check((await page.inputValue(R + '.rl-d')) === '21' && (await txt('.rl-play')) === 'Watch 3 weeks', 'rust: watch runs to day 21');
  check((await txt('.rl-mass')).includes('8.007 g') && (await txt('.rl-mass')).includes('2.407 g') && (await txt('.rl-mass')).includes('69.94%'), 'rust: 5.6 g iron gives 8.007 g rust');
  await page.fill(R + '.rl-fe', '0'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.rl-err'), 'rust: zero mass message');
  await page.fill(R + '.rl-fe', '111.69'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.rl-err') && (await txt('.rl-mass')).includes('159.7 g'), 'rust: 111.69 g iron gives 159.7 g');
  const items = await page.$$(R + '.cq-item');
  check(items.length === 4, 'rust: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.cq-item:nth-child(${i}) .cq-show`);
    const w = await txt(`.cq-item:nth-child(${i}) .cq-work`);
    const a = /Answer: (.+)\.$/.exec(w)[1].replace(/ g$/, '');
    await page.fill(`${R}.cq-item:nth-child(${i}) .cq-in`, a); await page.click(`${R}.cq-item:nth-child(${i}) .cq-check`);
    check((await txt(`.cq-item:nth-child(${i}) .cq-res`)) === 'Right!', `rust: quiz ${i} (${w})`);
  }
};
