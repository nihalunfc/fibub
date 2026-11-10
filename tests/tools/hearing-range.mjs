// #1266 Hearing range explorer
export const path = '/learn/hearing-range/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/hearing-range/`); await page.waitForSelector('.hr .hr-fig rect');
  const R = '.hr ', txt = (s) => page.textContent(R + s);
  check((await txt('.hr-big')) === '1000 Hz' && (await txt('.hr-info')).includes('0.343 m') && (await page.$$(R + '.hr-fig .hr-bar')).length === 5, 'hearing: start 1000 Hz');
  await page.fill(R + '.hr-f', '20');
  check((await txt('.hr-info')).includes('17.15 m') && (await page.inputValue(R + '.hr-fr')) === '0', 'hearing: 20 Hz wavelength, slider at the end');
  await page.locator(R + '.hr-fr').fill('1000');
  check((await txt('.hr-big')) === '20000 Hz' && (await txt('.hr-info')).includes('0.0172 m'), 'hearing: slider to 20 kHz');
  await page.fill(R + '.hr-f', '1000');
  await page.click(R + '.hr-play');
  check((await txt('.hr-play')) === 'Stop' && (await page.getAttribute(R.trim(), 'data-playing')) === '1' && (await txt('.hr-info')).startsWith('Playing.'), 'hearing: play');
  await page.click(R + '.hr-play');
  check((await txt('.hr-play')) === 'Play' && (await page.getAttribute(R.trim(), 'data-playing')) === null, 'hearing: stop');
  await page.click(R + '.hr-up'); await page.waitForTimeout(1500);
  const f1 = Number((await txt('.hr-big')).split(' ')[0]);
  check(f1 > 20 && f1 < 200 && await page.isVisible(R + '.hr-mark'), `hearing: sweep up rising (${f1} Hz)`);
  await page.click(R + '.hr-mark');
  const lo = await txt('.hr-lo');
  check(lo !== '–' && (await page.$$(R + '.hr-fig .hr-you')).length === 1 && (await txt('.hr-play')) === 'Play' && await page.isHidden(R + '.hr-markrow'), `hearing: marked lowest (${lo})`);
  await page.click(R + '.hr-down'); await page.waitForTimeout(1500);
  const f2 = Number((await txt('.hr-big')).split(' ')[0]);
  check(f2 < 20000 && f2 > 2000, `hearing: sweep down falling (${f2} Hz)`);
  await page.click(R + '.hr-mark');
  check((await txt('.hr-hi')) !== '–', 'hearing: marked highest');
  const items = await page.$$(R + '.lq-item');
  for (const [i, it] of items.entries()) {
    const ans = Number(await it.getAttribute('data-ans')), ch = await it.$$('.lq-choice');
    if (ch.length) await ch[ans].click(); else { await (await it.$('.lq-in')).fill(String(+ans.toPrecision(4))); await (await it.$('.lq-check')).click(); }
    check((await (await it.$('.lq-fb')).textContent()) === 'Right.', `hearing: quiz ${i + 1}`);
  }
  check(items.length === 4, 'hearing: four questions');
};
