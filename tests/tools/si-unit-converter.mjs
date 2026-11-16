// #1254 SI prefixes trainer
export const path = '/learn/si-unit-converter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/si-unit-converter/`); await page.waitForSelector('.si .si-fig rect');
  const R = '.si ', txt = (s) => page.textContent(R + s);
  check((await txt('.si-big')) === '2.5 km = 250 000 cm' && (await txt('.si-steps')).includes('= 10⁵ cm') && (await txt('.si-steps')).includes('5 places to the right') && (await txt('.si-steps')).includes('2.5 × 10⁵ cm'), 'si: 2.5 km = 250 000 cm');
  check((await page.$$(R + '.si-fig .si-from')).length === 1 && (await page.$$(R + '.si-fig .si-dest')).length === 1 && (await txt('.si-fig')).includes('× 10⁵'), 'si: ladder jump');
  await page.fill(R + '.si-v', '45'); await page.selectOption(R + '.si-p1', '-9'); await page.selectOption(R + '.si-p2', '0');
  check((await txt('.si-big')) === '45 nm = 0.000000045 m' && (await txt('.si-steps')).includes('4.5 × 10⁻⁸ m') && (await txt('.si-steps')).includes('9 places to the left'), `si: 45 nm in m (${await txt('.si-big')})`);
  await page.selectOption(R + '.si-u', 'g');
  check((await txt('.si-note')).includes('kilogram'), 'si: gram note');
  await page.fill(R + '.si-v', '2..5');
  check(await page.isVisible(R + '.si-err'), 'si: bad number message');
  check((await txt('.si-sum')) === 'In m: 1 200 + 350 = 1 550 m.', `si: add 1.2 km + 350 m (${await txt('.si-sum')})`);
  await page.selectOption(R + '.si-bu', 's');
  check((await txt('.si-sum')).includes("can't add a length"), 'si: m + s refused');
  check((await page.$$(R + '.si-base tbody tr')).length === 7, 'si: seven base units');
  await page.fill(R + '.si-quick', '5 km in cm');
  check((await txt('.si-big')) === '5 km = 500 000 cm', `si: quick line (${await txt('.si-big')})`);
  await page.fill(R + '.si-quick', '250 mA to A');
  check((await txt('.si-big')) === '250 mA = 0.25 A', `si: quick mA (${await txt('.si-big')})`);
  await page.fill(R + '.si-quick', '5 km in s');
  check(await page.isVisible(R + '.si-qerr'), 'si: quick mismatch message');
  await page.fill(R + '.si-quick', '5 km in cm');
  await page.click(R + '.si-swap');
  check((await txt('.si-big')) === '5 cm = 0.00005 km', `si: swap (${await txt('.si-big')})`);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await page.$$(R + '.si-alltab tbody tr')).length === 13, 'si: every-prefix table');
  await page.fill(R + '.si-quick', '3 MΩ in kΩ');
  check((await txt('.si-big')) === '3 MΩ = 3 000 kΩ', `si: ohm (${await txt('.si-big')})`);
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'si: five questions');
  for (const i of [0, 1, 2]) {
    const ans = await items[i].getAttribute('data-ans');
    await (await items[i].$('.lq-in')).fill(String(Number(ans))); await (await items[i].$('.lq-check')).click();
    check((await (await items[i].$('.lq-fb')).textContent()) === 'Right.', `si: quiz ${i + 1} (${ans})`);
  }
  for (const i of [3, 4]) {
    const ans = Number(await items[i].getAttribute('data-ans')), ch = await items[i].$$('.lq-choice');
    await ch[ans].click();
    check((await (await items[i].$('.lq-fb')).textContent()) === 'Right.', `si: quiz ${i + 1} choice`);
  }
};
