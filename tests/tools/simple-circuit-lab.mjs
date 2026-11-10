// #1215 simple-circuit-lab
export const path = '/learn/simple-circuit-lab/';
export default async ({ page, check, BASE }) => {
  const R = '.scl ';
  const t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForTimeout(400);
  check((await t('.sc-big')).startsWith('Switch is off'), 'circuit: starts switched off');
  await page.click(R + '.sc-sw');
  check((await t('.sc-big')) === 'The bulb glows brightly: copper wire conducts electricity.', 'circuit: copper lights the bulb');
  const lit = await page.$eval(R + '.sc-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 200 && d[i + 1] > 150 && d[i + 2] < 100) n++; return n; });
  check(lit > 200, `circuit: bulb drawn glowing (${lit})`);
  await page.click(R + '.sc-mat[data-m="plastic"]');
  check((await t('.sc-big')) === 'The bulb stays dark: plastic ruler does not let enough current through.', 'circuit: plastic insulates');
  await page.click(R + '.sc-mat[data-m="salt"]');
  check((await t('.sc-big')).startsWith('The bulb glows very faintly'), 'circuit: salt water, bulb faint');
  await page.click(R + '.sc-tester button[data-t="led"]');
  check((await t('.sc-big')) === 'The LED glows brightly: salt water conducts electricity.', 'circuit: salt water lights the LED');
  await page.click(R + '.sc-mat[data-m="tap"]');
  check((await t('.sc-big')).startsWith('The LED glows very faintly'), 'circuit: tap water faint with LED');
  await page.click(R + '.sc-cells button[data-c="1"]');
  check((await t('.sc-big')).includes('one cell is not enough to light an LED'), 'circuit: one cell cannot light an LED');
  check((await page.$$eval(R + '.sc-tab tbody tr', (r) => r.length)) === 5, 'circuit: five results recorded');
  await page.click(R + '.sc-clear');
  check((await page.$$eval(R + '.sc-tab tbody tr', (r) => r.length)) === 0, 'circuit: results cleared');
  await page.click(R + '.sc-cells button[data-c="2"]'); await page.click(R + '.sc-mat[data-m="salt"]');
  check(await page.isHidden(R + '.sc-eq'), 'circuit: Class 8 hides the sums');
  await page.click(R + 'button[data-level="10"]');
  const eq = await t('.sc-eq');
  check(eq.includes('= 100 Ω') && eq.includes('= 6 mA'), `circuit: Class 10 R = 100 Ω, I = 6 mA (${eq})`);
  await page.click(R + '.sc-tester button[data-t="bulb"]');
  check((await t('.sc-eq')).includes('= 27.7 mA'), 'circuit: bulb current 27.7 mA');
  await page.click(R + '.sc-sw');
  check((await t('.sc-big')).startsWith('Switch is off'), 'circuit: switch off again');
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'circuit: five questions');
  for (const i of [0, 1, 2]) { const a = +(await items[i].getAttribute('data-ans')); await (await items[i].$$('.lq-choice'))[a].click(); }
  for (const i of [3, 4]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'circuit: all five answered right');
};
