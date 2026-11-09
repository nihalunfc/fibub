// #398 breeding calendar
export const path = '/science/breeding-calendar/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/breeding-calendar/`); await page.waitForTimeout(500);
  check((await page.inputValue('.brc .bc-g')) === '283' && (await page.textContent('.brc .bc-note')).includes('Cow: typical gestation about 283 days'), 'breeding: cow figures by default');
  await page.fill('.brc .bc-date', '2026-01-12'); await page.waitForTimeout(150);
  { const t = await page.textContent('.brc .bc-one'); check(t.includes('Expected due dateThu 22 Oct 2026283 days after mating') && t.includes('Mon 12 Oct 2026 to Sun 1 Nov 2026') && t.includes('Mon 16 Feb 2026') && t.includes('Heat 2 (if she does not hold)Mon 23 Feb 2026'), 'breeding: one cow mating'); }
  await page.selectOption('.brc .bc-sp', 'rabbit'); await page.waitForTimeout(150);
  { const t = await page.textContent('.brc .bc-one'); check((await page.inputValue('.brc .bc-g')) === '31' && t.includes('Expected due dateThu 12 Feb 2026') && !t.includes('Heat 1') && (await page.textContent('.brc .bc-note')).includes('no regular cycle'), 'breeding: rabbit, no heat dates'); }
  await page.selectOption('.brc .bc-sp', 'mare'); await page.fill('.brc .bc-g', '335'); await page.waitForTimeout(400);
  check((await page.textContent('.brc .bc-one')).includes('335 days after mating') && (await page.textContent('.brc .bc-note')).includes('You have changed these figures'), 'breeding: edited gestation');
  await page.fill('.brc .bc-w', '400'); await page.waitForTimeout(400);
  check((await page.textContent('.brc .bc-perr')).includes('Use whole days'), 'breeding: bad window message');
  await page.click('.brc .bc-reset'); await page.waitForTimeout(150);
  check((await page.inputValue('.brc .bc-g')) === '340' && (await page.inputValue('.brc .bc-w')) === '15' && await page.isHidden('.brc .bc-perr'), 'breeding: back to typical figures');
  await page.selectOption('.brc .bc-sp', 'cow');
  await page.click('.brc .bc-ex'); await page.waitForTimeout(200);
  check((await page.textContent('.brc .bc-big')) === '4 matings, first due Thu 22 Oct 2026', 'breeding: example list');
  { const t = await page.textContent('.brc .bc-tab'); check(t.includes('Daisy 214Cow2026-01-122026-02-162026-02-022026-02-232026-10-222026-10-12 to 2026-11-01') && t.includes('Sow 7Sow2026-10-012026-10-29') && t.indexOf('Sow 7') < t.indexOf('Ewe 18'), 'breeding: table sorted by due date'); }
  check((await page.$$('.brc .bc-ev tr')).length === 21 && (await page.textContent('.brc .bc-ev')).includes('Watch for heat (1)'), 'breeding: every date in order');
  await page.selectOption('.brc .bc-n', '3'); await page.waitForTimeout(150);
  check((await page.textContent('.brc .bc-tab')).includes('Heat 3') && (await page.$$('.brc .bc-ev tr')).length === 25, 'breeding: three heat dates');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.brc .bc-csv')]); const f = OUT + 'breed.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(t.length === 5 && t[0].startsWith('animal,species,mated') && t[1] === 'Daisy 214,Cow,2026-01-12,2026-02-16,2026-02-02,2026-02-23,2026-03-16,2026-10-12,2026-10-22,2026-11-01,283', 'breeding: CSV download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.brc .bc-ics')]); const f = OUT + 'breed.ics'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(d.suggestedFilename() === 'breeding-calendar.ics' && t.startsWith('BEGIN:VCALENDAR\r\n') && (t.match(/BEGIN:VEVENT/g) || []).length === 24 && t.includes('SUMMARY:Due: Daisy 214 (Cow)') && t.includes('DTSTART;VALUE=DATE:20261022'), 'breeding: .ics download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.brc .dl [data-f=pdf]')]); check(d.suggestedFilename() === 'breeding-calendar.pdf', 'breeding: PDF report'); }
  await page.fill('.brc .bc-in', 'Ann, 2026-02-30\nBo, 3 Mar 2026, llama\nCy, 2026-05-01, goat'); await page.waitForTimeout(400);
  { const e = await page.textContent('.brc .bc-err'); check(e.includes('"2026-02-30" is not a date') && e.includes('unknown species "llama"') && (await page.textContent('.brc .bc-tab')).includes('CyDoe (goat)'), 'breeding: bad lines reported, good lines kept'); }
  writeFileSync(OUT + 'matings.csv', 'Animal,Date\nTag 5,2026-06-01\n');
  await page.setInputFiles('.brc .dfb-in', OUT + 'matings.csv'); await page.waitForTimeout(500);
  check((await page.textContent('.brc .bc-big')) === '1 mating, first due Thu 11 Mar 2027', `breeding: matings opened from a file (${await page.textContent('.brc .bc-big')})`);
};
