// #811 reagent inventory
export const path = '/science/reagent-inventory/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.rin ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(400);
  await page.evaluate(() => { try { localStorage.removeItem('fibub-reagents-v1'); } catch {} }); await page.reload(); await page.waitForTimeout(400);
  check(await page.isVisible(R + '.ri-empty') && (await page.textContent(R + '.ri-store')).includes('never sent to fibub'), 'reagents: empty list message and the plain storage statement');
  await page.click(R + '.ri-ex'); await page.waitForTimeout(200);
  check(!(await page.isChecked(R + '.ri-keep')) && (await page.evaluate(() => localStorage.getItem('fibub-reagents-v1'))) === null, 'reagents: nothing stored before the remember box is ticked');
  await page.check(R + '.ri-keep'); await page.waitForTimeout(100);
  check(JSON.parse(await page.evaluate(() => localStorage.getItem('fibub-reagents-v1'))).reagents.length === 8, 'reagents: ticking the box saves the list now');
  const facts = async () => (await page.textContent(R + '.ri-facts')).replace(/\s+/g, '');
  check((await facts()) === 'Reagents8Expired1Expiringwithin30days3Lowstockorempty2', `reagents: example summary (${await facts()})`);
  const names = async () => page.$$eval(R + '.ri-tab tbody tr', (rs) => rs.map((r) => r.cells[0].firstChild?.textContent));
  check((await names())[0] === 'Bradford reagent' && (await page.textContent(R + '.ri-tab tbody tr:first-child .ri-st')) === 'ExpiredEmpty', 'reagents: expired and empty one sorts first with both flags');
  { const t = await page.textContent(R + '.ri-tab'); check(t.includes('(opened + rule)') && t.includes('18 days left') && t.includes('reorder at 250'), 'reagents: opened + use-within rule and reorder level shown'); }
  await page.fill(R + '.ri-q', 'freezer box'); await page.waitForTimeout(100);
  check((await names()).length === 2 && (await page.textContent(R + '.ri-count')).startsWith('Showing 2 of 8'), 'reagents: search by words');
  await page.fill(R + '.ri-q', ''); await page.selectOption(R + '.ri-filter', 'attention'); await page.waitForTimeout(100);
  check((await names()).length === 5, 'reagents: needs-attention filter');
  await page.selectOption(R + '.ri-filter', 'low'); await page.waitForTimeout(100);
  check((await names()).sort().join() === 'Bradford reagent,Sodium chloride', 'reagents: low-stock filter');
  for (const [f, n] of [['expired', 1], ['soon', 3], ['opened', 7], ['unopened', 1]]) { await page.selectOption(R + '.ri-filter', f); await page.waitForTimeout(50); check((await names()).length === n, `reagents: filter ${f} gives ${n}`); }
  await page.selectOption(R + '.ri-filter', 'all'); await page.selectOption(R + '.ri-sort', 'name'); await page.waitForTimeout(100);
  check((await names())[0] === 'Ampicillin stock 100 mg/mL', 'reagents: sort by name');
  await page.selectOption(R + '.ri-sort', 'location'); await page.waitForTimeout(100);
  check((await names())[0] === 'Ethanol, absolute', 'reagents: sort by location');
  await page.selectOption(R + '.ri-sort', 'amount'); await page.waitForTimeout(100);
  check((await names())[0] === 'Bradford reagent' && (await names())[1] === 'Sodium chloride', 'reagents: sort by stock left vs reorder level');
  await page.selectOption(R + '.ri-sort', 'expiry');
  await page.fill(R + '.ri-soon', '7'); await page.waitForTimeout(100);
  check((await facts()).includes('Expiringwithin7days0'), 'reagents: expiring-soon window setting');
  await page.fill(R + '.ri-soon', '30'); await page.waitForTimeout(100);

  // Add, with bad input first.
  await page.click(R + '.ri-add'); await page.click(R + '.ri-save');
  check((await page.textContent(R + '.ri-ferr')).includes('Give the reagent a name'), 'reagents: name is needed');
  await page.fill(R + '.ri-f[data-k=name]', 'Glycine'); await page.fill(R + '.ri-f[data-k=useDays]', '30'); await page.click(R + '.ri-save');
  check((await page.textContent(R + '.ri-ferr')).includes('date it was opened'), 'reagents: use-within needs an opened date');
  await page.fill(R + '.ri-f[data-k=useDays]', ''); await page.fill(R + '.ri-f[data-k=amount]', '-3'); await page.click(R + '.ri-save');
  check((await page.textContent(R + '.ri-ferr')).includes('0 or more'), 'reagents: negative amount refused');
  await page.fill(R + '.ri-f[data-k=amount]', '500'); await page.fill(R + '.ri-f[data-k=unit]', 'g'); await page.fill(R + '.ri-f[data-k=min]', '100');
  await page.fill(R + '.ri-f[data-k=location]', 'Shelf A'); await page.fill(R + '.ri-f[data-k=expiry]', '2099-12-31'); await page.click(R + '.ri-save'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.ri-form') && (await facts()).startsWith('Reagents9') && (await page.textContent(R + '.ri-tab')).includes('500 g'), 'reagents: added a reagent');
  // Edit it.
  await page.fill(R + '.ri-q', 'glycine'); await page.waitForTimeout(100);
  await page.click(R + '.ri-tab .ri-edit'); await page.fill(R + '.ri-f[data-k=amount]', '50'); await page.click(R + '.ri-save'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ri-tab tbody tr .ri-st')) === 'Low stock', 'reagents: edited amount below reorder level is flagged');
  await page.click(R + '.ri-tab .ri-edit'); await page.click(R + '.ri-dup'); await page.waitForTimeout(100);
  check((await names()).length === 2, 'reagents: save as a copy');
  await page.click(R + '.ri-tab .ri-edit'); page.once('dialog', (d) => d.accept()); await page.click(R + '.ri-del'); await page.waitForTimeout(100);
  check((await names()).length === 1, 'reagents: delete');
  await page.fill(R + '.ri-q', '');
  // Kept after a reload.
  await page.reload(); await page.waitForTimeout(400);
  check((await facts()).startsWith('Reagents9') && await page.isChecked(R + '.ri-keep'), 'reagents: list kept in this browser after reload, box ticked');

  // CSV and JSON downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ri-csv')]); const f = OUT + 'reagents.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 10 && rows[0].startsWith('Name,CAS or cat. no.,Location') && rows[0].endsWith('Use by,Status') && rows.some((r) => r.startsWith('Bradford reagent') && r.endsWith('Expired; Empty')), 'reagents: CSV download with status'); }
  const [dj] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ri-json')]); const jf = OUT + 'reagents.json'; await dj.saveAs(jf);
  check(JSON.parse(readFileSync(jf, 'utf8')).reagents.length === 9, 'reagents: JSON backup');
  page.once('dialog', (d) => d.accept()); await page.click(R + '.ri-clear'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.ri-empty') && (await page.evaluate(() => localStorage.getItem('fibub-reagents-v1'))) === null, 'reagents: clear all empties the list and the browser storage');
  await page.setInputFiles(R + '.ri-jfile', jf); await page.waitForTimeout(300);
  check((await facts()).startsWith('Reagents9') && (await page.textContent(R + '.ri-bmsg')).includes('9 reagents'), 'reagents: open a backup');
  writeFileSync(OUT + 'bad.json', '{"x":1}'); await page.setInputFiles(R + '.ri-jfile', OUT + 'bad.json'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.ri-bmsg')).includes('no list of reagents'), 'reagents: wrong JSON file message');

  // Import pasted rows.
  await page.click(R + '.ri-import'); check((await page.textContent(R + '.ri-ierr')).includes('Paste some rows'), 'reagents: import with nothing pasted');
  await page.fill(R + '.ri-paste', 'Chemical\tQty\tBatch\tExp. date\tWhere\tColour\nUrea\t1 kg\tU-1\t03/04/2027\tShelf C\twhite\nAgar\t250 g\tA-9\t2027-13-01\tShelf C\t');
  await page.selectOption(R + '.ri-order', 'mdy'); await page.click(R + '.ri-import'); await page.waitForTimeout(100);
  { const m = await page.textContent(R + '.ri-imsg'); check(m.startsWith('Imported 2 reagents') && m.includes('Qty → Amount') && m.includes('Not used: Colour') && m.includes('2027-13-01'), 'reagents: import message lists columns and problems'); }
  await page.fill(R + '.ri-q', 'urea'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ri-tab')).includes('2027-03-04') && (await page.textContent(R + '.ri-tab')).includes('1 kg'), 'reagents: month/day order and amount with unit');
  await page.fill(R + '.ri-q', '');
  // Open a CSV file with quoted commas, replacing the list.
  writeFileSync(OUT + 'stock.csv', 'Reagent,Location,Amount,Unit,Reorder at,Expiry\n"Ethanol, 70 %",Cabinet 2,2,L,1,2026-01\nPBS tablets,Shelf D,100,tablets,20,Dec 2099\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'stock.csv'); await page.waitForTimeout(300);
  await page.selectOption(R + '.ri-mode', 'replace'); page.once('dialog', (d) => d.accept()); await page.click(R + '.ri-import'); await page.waitForTimeout(150);
  check((await facts()) === 'Reagents2Expired1Expiringwithin30days0Lowstockorempty0' && (await names()).join() === 'Ethanol, 70 %,PBS tablets' && (await page.textContent(R + '.ri-tab')).includes('2026-01-31'), `reagents: open a CSV file and replace the list (${await facts()})`);

  // Printable list and report downloads.
  await page.evaluate(() => { window.print = () => {}; });
  await page.click(R + '.ri-print-btn'); await page.emulateMedia({ media: 'print' });
  check(await page.isVisible(R + '.ri-print table') && (await page.$$eval(R + '.ri-print tbody tr', (r) => r.length)) === 2 && (await page.textContent(R + '.ri-print')).includes('Checked'), 'reagents: printable list');
  await page.emulateMedia({ media: 'screen' }); await page.evaluate(() => document.documentElement.classList.remove('ri-printing'));
  check(await page.isHidden(R + '.ri-print'), 'reagents: print list hidden on screen');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'reagents.pdf'; await d.saveAs(f); check(readFileSync(f).slice(0, 5).toString() === '%PDF-', 'reagents: PDF list'); }
  page.once('dialog', (d) => d.accept()); await page.click(R + '.ri-clear');
};
