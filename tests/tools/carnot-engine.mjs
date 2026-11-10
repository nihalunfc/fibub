// #1348 carnot-engine
export const path = '/learn/carnot-engine/';
export default async ({ page, check, BASE }) => {
  const R = '.cng ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  check((await t('.cn-eq')).includes('η = 1 − T₂/T₁ = 1 − 300/500 = 0.4000 = 40 %.  W = η Q₁ = 0.4000 × 1000 = 400 J.  Q₂ = Q₁ − W = 600 J.'), 'carnot: 500 K / 300 K, 1000 J: 40 %, 400 J, 600 J (Python)');
  { const f = await t('.cn-facts'); check(f.includes('Refrigerator COP1.5') && f.includes('Heat pump COP2.5'), 'carnot: COPs 1.5 and 2.5'); }
  check((await t('.cn-gas')).includes('347 mmol') && (await t('.cn-gas')).includes('net work, 400 J'), 'carnot: gas 347 mmol, loop area 400 J (numpy)');
  check((await t('.cn-Thv')).includes('226.9 °C') || (await t('.cn-Thv')).includes('226.85 °C'), 'carnot: hot side shown in °C');
  check((await t('.cn-verdict')).startsWith('Impossible'), 'carnot: 45 % claim is impossible');
  await page.fill(R + '.cn-claim', '30'); await page.waitForTimeout(100);
  check((await t('.cn-verdict')).startsWith('Allowed'), 'carnot: 30 % claim allowed');
  await page.fill(R + '.cn-claim', 'x'); await page.waitForTimeout(100);
  check((await t('.cn-verdict')).startsWith('Type a number'), 'carnot: bad claim message');
  for (const id of ['.cn-flow', '.cn-pv']) {
    const inked = await page.$eval(R + id, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 150 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
    check(inked > 400, `carnot: ${id} drawn (${inked})`);
  }
  check((await t('.cn-step')).includes('→'), 'carnot: cycle step named');
  await page.click(R + '.cn-play'); check((await t('.cn-play')) === 'Play', 'carnot: pause');
  await page.click(R + '[data-m="fridge"]'); await page.waitForTimeout(150);
  check((await t('.cn-eq')).includes('COP = Q₂ / W = T₂ / (T₁ − T₂) = 300 / (500 − 300) = 1.500.  W = Q₂ / COP = 1000 / 1.500 = 666.7 J.  Q₁ = Q₂ + W = 1667 J.') && (await t('.cn-Qlab')).includes('cold side'), 'carnot: fridge moving 1000 J needs 666.7 J of work');
  check((await t('.cn-verdict')).startsWith('Impossible') && (await t('.cn-clab')) === 'Claimed COP', 'carnot: fridge COP 3 claim impossible');
  await page.click(R + '[data-m="pump"]'); await page.waitForTimeout(150);
  check((await t('.cn-eq')).includes('= 2.500.  W = Q₁ / COP = 1000 / 2.500 = 400 J.  Q₂ = Q₁ − W = 600 J.'), 'carnot: heat pump 1000 J for 400 J of work');
  await page.fill(R + '.cn-claim', '2'); await page.waitForTimeout(100);
  check((await t('.cn-verdict')).startsWith('Allowed'), 'carnot: heat pump COP 2 allowed');
  await page.click(R + '[data-m="engine"]'); await page.waitForTimeout(150);
  await slide('.cn-Tc', 600);
  check(await page.isVisible(R + '.cn-err') && (await t('.cn-Tcv')).startsWith('495 K'), 'carnot: cold side above hot is clamped');
  await slide('.cn-Tc', 300); await slide('.cn-Th', 600);
  check((await t('.cn-eq')).includes('1 − 300/600 = 0.5000 = 50 %'), 'carnot: 600 K / 300 K is 50 %');
  await slide('.cn-Q', 2000);
  check((await t('.cn-eq')).includes('= 1000 J.'), 'carnot: 2000 J in gives 1000 J of work');
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'carnot: five questions');
  const ans = await items[0].getAttribute('data-ans');
  await (await items[0].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[0].$('.lq-check')).click();
  check((await (await items[0].$('.lq-fb')).textContent()) === 'Right.', 'carnot: efficiency answer accepted');
  const ch = await items[4].$$('.lq-choice'), right = +(await items[4].getAttribute('data-ans'));
  await ch[1 - right].click();
  check((await (await items[4].$('.lq-fb')).textContent()).startsWith('Not quite'), 'carnot: wrong claim answer');
  await ch[right].click();
  check((await (await items[4].$('.lq-fb')).textContent()) === 'Right.', 'carnot: right claim answer');
};
