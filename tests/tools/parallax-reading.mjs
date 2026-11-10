// #1218 parallax-reading
export const path = '/learn/parallax-reading/';
export default async ({ page, check, BASE }) => {
  const R = '.plx ';
  const t = (s) => page.textContent(R + s);
  const truth = async () => +(await page.getAttribute(R + '.px-cv', 'data-truth'));
  const setE = (v) => page.$eval(R + '.px-e', (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  await page.goto(BASE + path); await page.waitForTimeout(400);
  let v = await truth();
  check(v >= 2 && v <= 13, `parallax: ruler value ${v} cm`);
  await page.fill(R + '.px-in', v.toFixed(1)); await page.click(R + '.px-check');
  check((await t('.px-big')) === `Right: it is ${v.toFixed(1)} cm.`, 'parallax: right reading straight on');
  await setE(30);
  check((await t('.px-ev')) === '30° to the right', 'parallax: eye to the right');
  await page.fill(R + '.px-in', (v + 0.2).toFixed(1)); await page.click(R + '.px-check');
  check((await t('.px-big')).includes('parallax error') && (await t('.px-big')).includes('looked higher'), 'parallax: angled reading flagged');
  await page.click(R + '.px-inst button[data-i="cylinder"]');
  v = await truth();
  check(v % 2 === 0 && v >= 16 && v <= 84, `parallax: cylinder value ${v} mL on a mark`);
  await page.click(R + 'button[data-level="9"]');
  const f = await t('.px-facts');
  check(f.includes('Least count2 mL') && f.includes('+3.85 mL') && f.includes(`${Math.round((v + 3.849) / 2) * 2} mL`), `parallax: Class 9 cylinder at 30° (+3.85 mL) (${f})`);
  await setE(0); await page.fill(R + '.px-in', String(v + 2)); await page.click(R + '.px-check');
  check((await t('.px-big')).startsWith(`Not quite: the real value is ${v} mL`) && (await t('.px-big')).includes(`(${+(200 / v).toPrecision(3)} %)`), 'parallax: wrong reading with percentage error');
  await page.click(R + '.px-inst button[data-i="thermo"]'); await setE(-30);
  check((await t('.px-ev')) === '30° below' && (await t('.px-facts')).includes('−1.15 °C'), 'parallax: thermometer below reads 1.15 °C low');
  await page.fill(R + '.px-in', 'abc'); await page.click(R + '.px-check');
  check((await t('.px-big')) === 'Type a number in °C.', 'parallax: bad input message');
  const inked = await page.$eval(R + '.px-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 150) n++; return n; });
  check(inked > 300, `parallax: scale drawn (${inked})`);
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'parallax: five questions');
  for (const i of [0, 1, 2]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  for (const i of [3, 4]) { const a = +(await items[i].getAttribute('data-ans')); await (await items[i].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'parallax: all five answered right');
};
