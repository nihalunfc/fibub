// #T929 Study timer
export const path = '/everyday/study-timer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/study-timer/`); await page.waitForTimeout(300);
  const R = '.st ';
  const txt = (s) => page.textContent(R + s);
  const list = () => page.$$eval(R + '.st-next li', (l) => l.map((x) => x.textContent.split(',')[0]).join('|'));
  check((await txt('.st-time')) === '25:00' && (await txt('.st-phase')) === 'Focus 1 of 4', `study-timer: starts at 25:00 focus (${await txt('.st-time')})`);
  check((await list()) === 'Focus|Short break|Focus|Short break|Focus|Short break|Focus|Long break', `study-timer: cycle order (${await list()})`);
  await page.fill(R + '[data-k="focus"]', '1'); await page.waitForTimeout(100);
  check((await txt('.st-time')) === '1:00', 'study-timer: focus 1 min shows 1:00');
  await page.click(R + '.st-go'); await page.waitForTimeout(1300);
  const title = await page.title();
  check(/^0:5[89] Focus/.test(title), `study-timer: tab title counts down (${title})`);
  await page.click('h1'); await page.keyboard.press('Space'); await page.waitForTimeout(100);
  check((await txt('.st-go')) === 'Resume', `study-timer: Space pauses (${await txt('.st-go')})`);
  await page.click(R + '.st-skip'); await page.waitForTimeout(100);
  check((await txt('.st-phase')) === 'Short break' && (await txt('.st-time')) === '5:00', 'study-timer: Skip goes to a 5:00 short break');
  await page.selectOption(R + '[data-k="every"]', '2'); await page.click(R + '.st-reset'); await page.waitForTimeout(100);
  check((await list()).startsWith('Focus|Short break|Focus|Long break') && (await txt('.st-time')) === '1:00', `study-timer: long break every 2 and reset (${await list()})`);
};
