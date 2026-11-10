// #1265 Echo and SONAR depth finder
export const path = '/learn/echo-sonar/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/echo-sonar/`); await page.waitForSelector('.es .es-fig rect');
  const R = '.es ', txt = (s) => page.textContent(R + s);
  check((await txt('.es-big')) === 'Echo after 0.581 s' && (await txt('.es-steps')).includes('≈ 344.4 m/s') && (await txt('.es-note')).includes('at least 17.2 m'), 'echo: 100 m at 22 °C');
  await page.fill(R + '.es-d', '10');
  check((await txt('.es-note')).startsWith('Too close') && (await txt('.es-big')) === 'Echo after 0.058 s', 'echo: 10 m too close');
  await page.fill(R + '.es-d', '100'); await page.fill(R + '.es-t', '0');
  check((await txt('.es-steps')).includes('≈ 331.3 m/s') && (await txt('.es-big')) === 'Echo after 0.604 s', 'echo: 0 °C slower');
  await page.click(R + '.es-play'); await page.waitForTimeout(600);
  check((await page.$$(R + '.es-fig .es-wave, ' + R + '.es-fig .es-back')).length === 1 && (await txt('.es-clock')).startsWith('t = '), 'echo: pulse moves');
  await page.waitForTimeout(2300);
  check((await txt('.es-clock')) === 'Echo heard.', 'echo: pulse returns');
  await page.click(R + '.es-mode [data-m=sonar]');
  check((await txt('.es-big')) === 'Echo after 1.6 s' && (await txt('.es-fig')).includes('1200 m'), 'sonar: 1200 m → 1.6 s');
  await page.fill(R + '.es-time', '4');
  check((await txt('.es-big')) === 'Depth = 3000 m' && (await txt('.es-steps')).includes('6000 ÷ 2 = 3000 m'), 'sonar: 4 s → 3000 m');
  await page.fill(R + '.es-v', '1480');
  check((await txt('.es-big')) === 'Depth = 2960 m', 'sonar: speed changes depth');
  const items = await page.$$(R + '.lq-item');
  for (const [i, it] of items.entries()) {
    const ans = Number(await it.getAttribute('data-ans'));
    await (await it.$('.lq-in')).fill(String(+ans.toFixed(3))); await (await it.$('.lq-check')).click();
    check((await (await it.$('.lq-fb')).textContent()) === 'Right.', `echo: quiz ${i + 1} (${ans})`);
  }
  check(items.length === 4, 'echo: four questions');
};
