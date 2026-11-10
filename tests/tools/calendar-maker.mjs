// #1231 Calendar maker
export const path = '/learn/calendar-maker/';
export default async ({ page, check, BASE }) => {
  const R = '.cm ';
  const t = (s) => page.textContent(R + s);
  const row = async (i) => page.$$eval(`${R}.cm-tab tr:nth-child(${i + 1}) td`, (e) => e.map((x) => x.textContent));
  await page.goto(BASE + path); await page.waitForSelector(R + '.cm-dot');
  check((await page.$$(R + '.cm-dot')).length === 5 && (await page.$$(R + '.cm-tab tr')).length === 6, 'calendar: five calendars on the wheel and in the table');
  check((await row(1))[2] === '24.2 days later' && (await row(1))[3] === '4.1', 'calendar: 365-day calendar after 100 years');
  check((await row(2))[2] === '0.8 days earlier' && (await row(2))[3] === '128', 'calendar: Julian after 100 years');
  check((await row(3))[2] === 'on time' && (await row(3))[3] === '3,225.8', 'calendar: Gregorian after 100 years');
  check((await row(4))[2] === '1,087.5 days later', 'calendar: Moon-only after 100 years');
  check((await t('.cm-a2')).startsWith('In 100 years: 1,237 months, with 37 adhik maas') && (await t('.cm-a2')).includes('5.1 days earlier'), 'calendar: adhik maas in 100 years');
  await page.click(R + '.cm-pre[data-y="19"]'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.cm-y')) === '19' && (await t('.cm-a2')).includes('235 months, with 7 adhik maas (in years 2, 5, 7, 10, 13, 15, 18)'), 'calendar: 19 years, 7 adhik');
  check((await t('.cm-a3')).includes('2.1 hours apart'), 'calendar: Metonic cycle');
  await page.fill(R + '.cm-y', '0'); await page.waitForTimeout(100);
  check((await row(4))[2] === 'on time' && (await t('.cm-a2')).startsWith('Run the calendars'), 'calendar: 0 years');
  await page.fill(R + '.cm-y', '-3'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.cm-err'), 'calendar: negative years message');
  await page.fill(R + '.cm-y', '400'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.cm-err') && (await row(3))[2] === '0.1 days earlier', 'calendar: 400 years Gregorian');
  check((await t('.cm-l1')) === '2100 is not a leap year: 365 days, February has 28.' && (await t('.cm-l2')).includes('Julian calendar would have kept it'), 'calendar: 2100');
  await page.fill(R + '.cm-ly', '2000'); await page.waitForTimeout(100);
  check((await t('.cm-l1')).startsWith('2000 is a leap year') && (await t('.cm-l2')).includes('divides by 400'), 'calendar: 2000');
  await page.fill(R + '.cm-ly', '2026'); await page.waitForTimeout(100);
  check((await t('.cm-l2')).includes('does not divide by 4'), 'calendar: 2026');
  await page.fill(R + '.cm-ly', '0'); await page.waitForTimeout(100);
  check((await t('.cm-l1')).startsWith('Type a year'), 'calendar: bad year');
  check((await page.$$(R + '.sm-q')).length === 5, 'calendar: five questions');
  const res = [/so (\d+) days\./, /: (\d+) leap years/, /= ([\d.]+) days earlier/, /= ([\d.]+) days\.$/, /= ([\d.]+) days\.$/];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await t(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await t(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `calendar: quiz ${i} (${w})`);
  }
};
