// #812 equipment booking planner
export const path = '/science/equipment-booking/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const E = '.ebk ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  await page.evaluate(() => { try { localStorage.removeItem('fibub-bookings-v1'); } catch {} }); await page.reload(); await page.waitForTimeout(400);
  check((await page.textContent(E + '.eb-list')).includes('No bookings yet') && (await page.textContent(E + '.eb-store')).includes('never sent to fibub'), 'booking: empty week and the plain storage statement');
  { const [d] = await Promise.all([page.waitForEvent('download', { timeout: 1500 }).catch(() => null), page.click(E + '.eb-ics')]); check(!d && (await page.textContent(E + '.eb-bmsg')).includes('No bookings'), 'booking: no .ics with nothing booked'); }
  await page.click(E + '.eb-ex'); await page.waitForTimeout(200);
  check(!(await page.isChecked(E + '.eb-keep')) && (await page.evaluate(() => localStorage.getItem('fibub-bookings-v1'))) === null, 'booking: nothing stored before the remember box is ticked');
  await page.check(E + '.eb-keep'); await page.waitForTimeout(100);
  check(JSON.parse(await page.evaluate(() => localStorage.getItem('fibub-bookings-v1'))) !== null, 'booking: ticking the box saves the bookings now');
  const facts = async () => (await page.textContent(E + '.eb-facts')).replace(/\s+/g, '');
  check((await facts()) === 'Bookings9Hoursbooked26.25hInstrumentclashes1Overlaps1', `booking: example week summary (${await facts()})`);
  check((await page.$$eval(E + '.eb-ev.bad', (e) => e.length)) === 2 && (await page.$$eval(E + '.eb-ev.you', (e) => e.length)) === 2 && (await page.$$eval(E + '.eb-ev', (e) => e.length)) === 10, 'booking: grid has 10 blocks (overnight run on two days), 2 red, 2 amber');
  { const t = await page.textContent(E + '.eb-cl'); check(t.includes('Confocal microscope is booked twice') && t.includes('11:00–12:00') && t.includes('Flow cytometer and Plate reader at the same time'), 'booking: clashes in words'); }
  { const w = await page.$$eval(E + '.eb-ev.bad', (e) => e.map((x) => x.getBoundingClientRect().width)); const day = await page.$eval(E + '.eb-day', (d) => d.getBoundingClientRect().width); check(w.every((x) => Math.abs(x - day / 2) < 3), 'booking: clashing blocks sit side by side'); }
  // Move the one-off confocal booking to remove the clash.
  await page.locator(E + '.eb-li', { hasText: 'Fixed slides' }).click(); await page.waitForTimeout(200);
  check(await page.isVisible(E + '.eb-form') && (await page.inputValue(E + '.eb-from')) === '11:00' && await page.isHidden(E + '.eb-skip'), 'booking: tap opens the booking');
  await page.fill(E + '.eb-from', '12:00'); await page.fill(E + '.eb-to', '14:00'); await page.click(E + '.eb-save'); await page.waitForTimeout(150);
  check((await facts()).includes('Instrumentclashes0') && await page.isHidden(E + '.eb-form'), 'booking: moving it clears the clash');
  // Bad input.
  await page.click(E + '.eb-add'); await page.fill(E + '.eb-inst', ''); await page.click(E + '.eb-save');
  check((await page.textContent(E + '.eb-ferr')).includes('Name the instrument'), 'booking: instrument needed');
  await page.fill(E + '.eb-inst', 'NMR'); await page.selectOption(E + '.eb-rep', 'weekly'); await page.fill(E + '.eb-until', '2000-01-01'); await page.click(E + '.eb-save');
  check((await page.textContent(E + '.eb-ferr')).includes('before the first booking'), 'booking: repeat end date before the start is refused');
  await page.fill(E + '.eb-until', ''); await page.fill(E + '.eb-count', '0'); await page.click(E + '.eb-save');
  check((await page.textContent(E + '.eb-ferr')).includes('how many times'), 'booking: repeat needs a count or a date');
  // Overnight one-off on a weekend day, then a repeat to the next weeks.
  const mon = await page.inputValue(E + '.eb-jump');
  const addDays = (iso, k) => new Date(Date.parse(iso + 'T00:00Z') + k * 864e5).toISOString().slice(0, 10);
  await page.selectOption(E + '.eb-rep', 'none'); await page.fill(E + '.eb-date', addDays(mon, 6)); await page.fill(E + '.eb-from', '22:00'); await page.fill(E + '.eb-to', '06:00'); await page.click(E + '.eb-save'); await page.waitForTimeout(150);
  check((await facts()).startsWith('Bookings10Hoursbooked28.25h'), `booking: overnight Sunday booking counts 2 h this week (${await facts()})`);
  await page.click(E + '.eb-next'); await page.waitForTimeout(150);
  check((await page.$$eval(E + '.eb-ev', (e) => e.map((x) => x.textContent))).some((t) => t.startsWith('NMR22:00–06:00 (Mon)')) && (await page.inputValue(E + '.eb-jump')) === addDays(mon, 7), 'booking: next week shows the end of the overnight run');
  check((await facts()).startsWith('Bookings3Hoursbooked11h'), `booking: next week has the weekly repeats and 6 h of the overnight run (${await facts()})`);
  // Cancel one date of the weekly confocal series.
  await page.locator(E + '.eb-li', { hasText: 'Live imaging' }).click(); await page.waitForTimeout(150);
  check(await page.isVisible(E + '.eb-skip') && (await page.textContent(E + '.eb-skip')).startsWith('Cancel Mon'), 'booking: cancel-this-date offered for a repeat');
  await page.click(E + '.eb-skip'); await page.waitForTimeout(150);
  check((await facts()).startsWith('Bookings2') && !(await page.textContent(E + '.eb-list')).includes('Live imaging'), 'booking: one date cancelled');
  await page.click(E + '.eb-this'); await page.waitForTimeout(150);
  check((await page.textContent(E + '.eb-list')).includes('Live imaging'), 'booking: the rest of the series is kept');
  // Monthly with a until date, and weekday repeat starting on a Saturday refused.
  await page.click(E + '.eb-add'); await page.fill(E + '.eb-inst', 'Cryostat'); await page.fill(E + '.eb-date', addDays(mon, 5)); await page.selectOption(E + '.eb-rep', 'weekdays'); await page.click(E + '.eb-save');
  check((await page.textContent(E + '.eb-ferr')).includes('must start on a weekday'), 'booking: weekday repeat must start on a weekday');
  await page.fill(E + '.eb-date', addDays(mon, 4)); await page.selectOption(E + '.eb-rep', 'monthly'); await page.fill(E + '.eb-until', addDays(mon, 100)); await page.click(E + '.eb-save'); await page.waitForTimeout(150);
  check((await facts()).startsWith('Bookings11'), 'booking: monthly repeat added');
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(E + '.eb-ics')]); const f = OUT + 'book.ics'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    check(t.startsWith('BEGIN:VCALENDAR\r\n') && (t.match(/BEGIN:VEVENT/g) || []).length === 9 && t.includes('RRULE:FREQ=WEEKLY;COUNT=4') && t.includes('RRULE:FREQ=MONTHLY;UNTIL=') && t.includes('RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=3') && /EXDATE:\d{8}T090000/.test(t), 'booking: .ics with repeats and the cancelled date'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(E + '.eb-csv')]); const f = OUT + 'book.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n');
    check(r.length === 12 && r[0] === 'Date,Day,Start,End,Hours,Instrument,Title,Notes,Clash' && r.filter((x) => x.endsWith('Overlaps another booking')).length === 2, `booking: CSV of the week (${r.length} lines)`); }
  await page.selectOption(E + '.eb-span', 'all');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(E + '.eb-csv')]); const f = OUT + 'book-all.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n');
    check(r.length === 1 + 3 + 6 + 1 + 3 + 1 + 1 + 1 + 1 + 4 && d.suggestedFilename() === 'instrument-bookings.csv', `booking: CSV of every booking (${r.length} lines)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(E + '.dl button[data-f=pdf]')]); const f = OUT + 'book.pdf'; await d.saveAs(f); check(readFileSync(f).slice(0, 5).toString() === '%PDF-', 'booking: week as PDF'); }
  // Kept after reload, backup, clear, restore, delete.
  await page.reload(); await page.waitForTimeout(400);
  check((await facts()).startsWith('Bookings11') && await page.isChecked(E + '.eb-keep'), 'booking: kept in this browser after reload, box ticked');
  const [dj] = await Promise.all([page.waitForEvent('download'), page.click(E + '.eb-json')]); const jf = OUT + 'book.json'; await dj.saveAs(jf);
  page.once('dialog', (d) => d.accept()); await page.click(E + '.eb-clear'); await page.waitForTimeout(150);
  check((await facts()).startsWith('Bookings0') && (await page.evaluate(() => localStorage.getItem('fibub-bookings-v1'))) === null, 'booking: clear all');
  await page.setInputFiles(E + '.eb-jfile', jf); await page.waitForTimeout(300);
  check((await facts()).startsWith('Bookings11'), 'booking: open a backup');
  writeFileSync(OUT + 'bad-book.json', '{"no":1}'); await page.setInputFiles(E + '.eb-jfile', OUT + 'bad-book.json'); await page.waitForTimeout(300);
  check((await page.textContent(E + '.eb-bmsg')).includes('no list of bookings'), 'booking: wrong backup file message');
  await page.locator(E + '.eb-li', { hasText: 'Cryostat' }).click(); page.once('dialog', (d) => d.accept()); await page.click(E + '.eb-del'); await page.waitForTimeout(150);
  check((await facts()).startsWith('Bookings10'), 'booking: delete a series');
  await page.fill(E + '.eb-jump', addDays(mon, 30)); await page.dispatchEvent(E + '.eb-jump', 'change'); await page.waitForTimeout(150);
  check((await page.textContent(E + '.eb-wk')).startsWith('Week of Mon'), 'booking: jump to a date');
  page.once('dialog', (d) => d.accept()); await page.click(E + '.eb-clear');
};
