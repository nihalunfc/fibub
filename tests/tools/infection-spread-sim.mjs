// #1214 infection-spread-sim
export const path = '/learn/infection-spread-sim/';
export default async ({ page, check, BASE }) => {
  const R = '.isp ';
  const t = (s) => page.textContent(R + s);
  const setR = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  await page.goto(BASE + path); await page.waitForTimeout(400);
  check((await t('.is-eq')) === 'R0 = people met × chance × days ill = 4 × 0.15 × 5 = 3.  Herd immunity threshold = 1 − 1/R0 = 1 − 1/3 = 67 %.', 'infection: R0 3, threshold 67 %');
  check((await t('.is-big')) === 'Day 0: 3 ill, 0 recovered, 397 can still catch it.', 'infection: starts with 3 ill');
  await page.click(R + '.is-day');
  check((await t('.is-big')).startsWith('Day 1:'), 'infection: one day');
  await page.click(R + '.is-end');
  { const m = (await t('.is-big')).match(/^Over after (\d+) days: (\d+) of 400/); check(!!m, `infection: runs to the end (${await t('.is-big')})`); }
  // Many towns: with R0 = 3 big outbreaks reach most people.
  let big = 0; for (let k = 0; k < 6; k++) { await page.click(R + '.is-reset'); await page.click(R + '.is-end'); const m = (await t('.is-big')).match(/: (\d+) of 400/); if (m && +m[1] > 300) big++; }
  check(big >= 3, `infection: most towns have a big outbreak (${big} of 6)`);
  await setR('.is-v', 80); await page.click(R + '.is-end');
  { const m = (await t('.is-big')).match(/: (\d+) of 400/); check(m && +m[1] < 40, `infection: 80 % vaccinated keeps it small (${m && m[1]})`); }
  check((await t('.is-facts')).includes('at or above 67 %: herd immunity'), 'infection: herd immunity reached');
  await setR('.is-v', 0); await setR('.is-c', 1);
  check((await t('.is-eq')).includes('= 0.75. Below 1'), 'infection: R0 below 1');
  await setR('.is-c', 4);
  await page.click(R + 'button[data-level="9"]');
  check((await t('.is-facts')).includes('Big-town prediction94 % catch it'), 'infection: Class 9 final size 94 % (Python 0.9405)');
  await page.click(R + '.is-play'); await page.waitForTimeout(700);
  check((await t('.is-play')) === 'Pause', 'infection: play'); await page.click(R + '.is-play');
  check((await t('.is-play')) === 'Play', 'infection: pause');
  const inked = await page.$eval(R + '.is-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 200) n++; return n; });
  check(inked > 2000, `infection: town drawn (${inked})`);
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'infection: five questions');
  for (const i of [0, 1, 2]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  for (const i of [3, 4]) { const a = +(await items[i].getAttribute('data-ans')); await (await items[i].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'infection: all five answered right');
};
