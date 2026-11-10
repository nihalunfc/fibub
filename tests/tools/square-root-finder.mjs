// #1232 Square root finder
export const path = '/learn/square-root-finder/';
export default async ({ page, check, BASE }) => {
  const R = '.sr ';
  const t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForSelector(R + '.sr-fig .sr-sq');
  check((await t('.sr-big')) === '√7,056 = 84' && (await t('.sr-pf2')).includes('= 2 × 2 × 3 × 7 = 84'), 'sqrt: 7056 by prime factors');
  check((await t('.sr-fig')).includes('84² = 7,056') && (await t('.sr-fig')).includes('85² = 7,225'), 'sqrt: number line squares');
  await page.click(R + '.sr-m [data-v="odd"]'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.sr-oddl') && (await t('.sr-odd1')) === 'Reached 0 after 84 subtractions, so √7,056 = 84.' && (await t('.sr-oddl')).includes('7,056 − 1 = 7,055'), 'sqrt: odd subtraction');
  await page.click(R + '.sr-m [data-v="ld"]'); await page.waitForTimeout(100);
  check((await page.$$(R + '.sr-ldt tr')).length === 3 && (await t('.sr-ldt')).includes('164 × 4') && (await t('.sr-ld1')).includes('= 84 exactly'), 'sqrt: long division of 7056');
  await page.click(R + '.sr-pre[data-n="40"]'); await page.click(R + '.sr-m [data-v="est"]'); await page.waitForTimeout(100);
  check((await t('.sr-e1')).includes('between 6 and 7') && (await t('.sr-e2')).endsWith('= 6.3077.') && (await t('.sr-el')).includes('= 6.324555'), 'sqrt: estimate √40');
  check((await t('.sr-big')) === '√40 ≈ 6.3246 (not a perfect square)', 'sqrt: 40 not a perfect square');
  await page.click(R + '.sr-pre[data-n="72"]'); await page.click(R + '.sr-m [data-v="pf"]'); await page.waitForTimeout(100);
  check((await t('.sr-pf1')) === '72 = (2 × 2) × (3 × 3) × 2' && (await t('.sr-pf3')).includes('= 6√2') && (await t('.sr-pf3')).includes('144 = 12²'), 'sqrt: 72 = 6√2');
  await page.click(R + '.sr-pre[data-n="2"]'); await page.click(R + '.sr-m [data-v="ld"]'); await page.waitForTimeout(100);
  check((await t('.sr-ld1')).includes('1.4142...'), 'sqrt: √2 never ends');
  await page.click(R + '.sr-pre[data-n="12.25"]'); await page.waitForTimeout(100);
  check((await t('.sr-big')) === '√12.25 = 3.5' && (await t('.sr-ld1')).includes('= 3.5 exactly'), 'sqrt: 12.25 decimal');
  await page.click(R + '.sr-m [data-v="pf"]'); await page.waitForTimeout(100);
  check((await t('.sr-pf1')).includes('whole numbers'), 'sqrt: decimals need long division');
  await page.fill(R + '.sr-n', '50'); await page.click(R + '.sr-m [data-v="odd"]'); await page.waitForTimeout(100);
  check((await t('.sr-odd1')).includes('1 is left, smaller than the next odd number 15'), 'sqrt: 50 by odd numbers');
  await page.fill(R + '.sr-n', '-4'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.sr-err'), 'sqrt: negative message');
  await page.fill(R + '.sr-n', '1'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.sr-err') && (await t('.sr-big')) === '√1 = 1', 'sqrt: 1');
  check((await page.$$(R + '.sm-q')).length === 5, 'sqrt: five questions');
  const res = [/= (\d+)\.$/, /takes (\d+) subtractions/, /= (\d+)√(\d+)\.$/, /between (\d+) and (\d+)\.$/, /= ([\d.]+)\.$/];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await t(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m.slice(1).join(', ') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await t(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `sqrt: quiz ${i} (${w})`);
  }
};
