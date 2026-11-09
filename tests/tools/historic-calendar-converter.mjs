// #415 Historic calendar converter
export const path = '/science/historic-calendar-converter/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/historic-calendar-converter/`); await page.waitForTimeout(500);
  const big = () => page.textContent('.hcc .hc-big'), tab = () => page.textContent('.hcc .hc-tab');
  check((await big()) === 'Saturday, 1 January 2000 (Gregorian)' && (await tab()).includes('2451545') && (await tab()).includes('24 Ramadan 1420 AH') && (await tab()).includes('23 Tevet 5760 AM') && (await tab()).includes('19 December 1999'), 'calendars: opens on 1 January 2000 in every calendar');
  await page.click('.hcc .hc-ex'); await page.waitForTimeout(300);
  check((await big()) === 'Tuesday, 3 May 1616 (Gregorian)' && (await tab()).includes('2311415') && (await tab()).includes("16 Rabi' al-thani 1025 AH") && (await tab()).includes('16 Iyyar 5376 AM'), 'calendars: Shakespeare example (Julian to Gregorian)');
  { const t = await page.textContent('.hcc .hc-ltab'); check(t.includes('1066-10-20') && t.includes('Saturday') && t.includes('1752-09-14') && t.includes('-0043-03-13') === false && t.includes('-43-03-13'), 'calendars: example list'); }
  check((await page.textContent('.hcc .hc-lnote')).startsWith('5 of 5 dates converted'), 'calendars: list note');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.hcc .hc-csv')]); const f = OUT + 'cal.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 6 && rows[0] === 'input,gregorian,julian,islamic_tabular,hebrew,jdn,weekday' && rows[1].startsWith('1616-4-23,1616-05-03,1616-04-23,'), 'calendars: list CSV'); }
  // Islamic input.
  await page.selectOption('.hcc .hc-cal', 'islamic'); await page.fill('.hcc .hc-y', '1445'); await page.selectOption('.hcc .hc-m', '9'); await page.fill('.hcc .hc-d', '1'); await page.waitForTimeout(150);
  check((await big()) === 'Monday, 11 March 2024 (Gregorian)' && await page.isHidden('.hcc .hc-erab'), 'calendars: 1 Ramadan 1445 (tabular)');
  await page.fill('.hcc .hc-y', '1444'); await page.selectOption('.hcc .hc-m', '12'); await page.fill('.hcc .hc-d', '30'); await page.waitForTimeout(150);
  check((await page.textContent('.hcc .hc-err')) === 'Dhu al-Hijjah 1444 has 29 days.' && await page.isHidden('.hcc .hc-out'), 'calendars: day that does not exist');
  // Hebrew input, with the leap-year month list.
  await page.selectOption('.hcc .hc-cal', 'hebrew'); await page.fill('.hcc .hc-y', '5785'); await page.selectOption('.hcc .hc-m', '7'); await page.fill('.hcc .hc-d', '1'); await page.waitForTimeout(150);
  check((await big()) === 'Thursday, 3 October 2024 (Gregorian)', 'calendars: Rosh Hashanah 5785');
  await page.fill('.hcc .hc-y', '5784'); await page.waitForTimeout(150);
  check((await page.$$eval('.hcc .hc-m option', (o) => o.map((x) => x.textContent))).join() === 'Tishri,Marheshvan,Kislev,Tevet,Shevat,Adar I,Adar II,Nisan,Iyyar,Sivan,Tammuz,Av,Elul', 'calendars: Hebrew leap year has Adar I and Adar II, Tishri first');
  // Historical: the 1582 gap, and BC.
  await page.selectOption('.hcc .hc-cal', 'historical'); await page.fill('.hcc .hc-y', '1582'); await page.selectOption('.hcc .hc-m', '10'); await page.fill('.hcc .hc-d', '10'); await page.waitForTimeout(150);
  check((await page.textContent('.hcc .hc-err')).includes('were skipped'), 'calendars: 5-14 October 1582 skipped');
  await page.fill('.hcc .hc-d', '4'); await page.waitForTimeout(150);
  check((await big()) === 'Thursday, 14 October 1582 (Gregorian)', 'calendars: 4 October 1582 is the last Julian day');
  await page.selectOption('.hcc .hc-cal', 'julian'); await page.fill('.hcc .hc-y', '44'); await page.selectOption('.hcc .hc-era', 'bc'); await page.selectOption('.hcc .hc-m', '3'); await page.fill('.hcc .hc-d', '15'); await page.waitForTimeout(150);
  check((await tab()).includes('15 March 44 BC') && (await tab()).includes('before AH 1') && (await tab()).includes('1705426'), 'calendars: BC dates');
  await page.fill('.hcc .hc-y', '0'); await page.waitForTimeout(150);
  check((await page.textContent('.hcc .hc-err')).includes('no year 0'), 'calendars: no year 0');
  await page.selectOption('.hcc .hc-cal', 'jdn'); await page.fill('.hcc .hc-j', '0'); await page.waitForTimeout(150);
  check((await tab()).includes('1 January 4713 BC') && (await big()).startsWith('Monday'), 'calendars: JDN 0');
  await page.fill('.hcc .hc-list', '2299161\nabc'); await page.waitForTimeout(400);
  check((await page.textContent('.hcc .hc-lnote')).startsWith('1 of 2 dates converted; 1 could not be read') && (await page.textContent('.hcc .hc-ltab')).includes('1582-10-15'), 'calendars: JDN list with a bad line');
  await page.click('.hcc .hc-today'); await page.waitForTimeout(150);
  { const n = new Date(); check((await big()).includes(`${n.getDate()} ${n.toLocaleString('en', { month: 'long' })} ${n.getFullYear()}`), 'calendars: Today'); }
};
