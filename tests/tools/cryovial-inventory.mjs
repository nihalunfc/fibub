// #193 cryovial inventory and freezing helper
export const path = '/science/cryovial-inventory/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.cvi ';
  const txt = async (s) => ((await page.innerText(R + s)) || '').replace(/\s+/g, ' ').trim();
  const tap = async (s) => { await page.locator(s).first().scrollIntoViewIfNeeded(); await page.click(s); await page.waitForTimeout(80); };
  const cell = (p) => `${R}.cv-cell[data-pos="${p}"]`;
  const download = async (s, name) => { const [d] = await Promise.all([page.waitForEvent('download'), tap(s)]); const f = OUT + name; await d.saveAs(f); return { file: f, name: d.suggestedFilename(), text: readFileSync(f, 'utf8') }; };
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(400);
  await page.evaluate(() => { try { localStorage.removeItem('fibub-cryovials-v1'); } catch {} });

  // The example opens on LN2 tank 1 › Rack 3 › Box 1.
  check((await txt('.cv-boxinfo')) === 'LN2 tank 1 › Rack 3 › Box 1: 14 of 81 places used, 67 free.', 'cryovial: example box 1 info');
  check((await page.$$(R + '.cv-cell')).length === 81 && (await page.$$(R + '.cv-cell.cv-full')).length === 14 && !(await page.$(cell('C3') + '.cv-full')), 'cryovial: 81 places, 14 vials, C3 free');
  check((await page.getAttribute(cell('A1'), 'aria-label')) === 'A1: Fibro-A, P5, frozen 2026-03-12' && (await txt('.cv-legend')).includes('Fibro-A (10)') && (await txt('.cv-legend')).includes('Clone 3B (4)') && await page.isVisible(R + '.cv-exnote'), 'cryovial: labels, legend and example note');
  await page.selectOption(R + '.cv-box', { label: '−80 °C freezer B › Shelf 2 › Box 7 (7/100)' }); await page.waitForTimeout(80);
  check((await page.$$(R + '.cv-cell')).length === 100 && (await txt('.cv-boxinfo')).includes('7 of 100 places used, 93 free'), 'cryovial: switch to the 10 × 10 box');

  // Downloads of the untouched example.
  { const d = await download(R + '.cv-csv', 'cv.csv'); const l = d.text.trim().split('\n'); check(d.name === 'cryovial-inventory.csv' && l.length === 24 && l[0].startsWith('freezer,rack,box,box_size,position,line,passage,date_frozen') && d.text.includes('LN2 tank 1,Rack 3,Box 1,9x9,C3,Clone 3B,12,2026-08-20,5000000,"70 % medium, 20 % serum, 10 % DMSO",RM,Selected clone,thawed,2026-10-01,RM,Recovered well'), 'cryovial: CSV of the example'); }
  { const d = await download(R + '.cv-json', 'cv.json'); const j = JSON.parse(d.text); check(d.name === 'cryovial-inventory.json' && j.format === 'fibub-cryovial-inventory' && j.boxes.length === 2 && j.vials.length === 23, 'cryovial: JSON of the example'); }
  { const d = await download(R + '.cv-log-csv', 'cvlog.csv'); const l = d.text.trim().split('\n'); check(l.length === 3 && l[1].startsWith('2026-11-02,Line K-9,3,−80 °C freezer B › Shelf 2 › Box 7 › A1'), 'cryovial: thaw log CSV'); }
  await page.selectOption(R + '.cv-box', { index: 1 }); await page.waitForTimeout(80);
  check((await txt('.cv-boxinfo')).startsWith('LN2 tank 1 › Rack 3 › Box 1'), 'cryovial: back to box 1');

  // A vial: details, thaw with a bad date, thaw, undo.
  await tap(cell('A7'));
  check(await page.isVisible(R + '.cv-vialcard') && (await txt('.cv-vh')) === 'A7 · Fibro-A' && (await txt('.cv-vfacts')).includes('2,000,000') && (await txt('.cv-vfacts')).includes('P8') && (await page.$(cell('A7') + '.cv-sel')) !== null, 'cryovial: vial details');
  await page.fill(R + '.cv-t-date', '2026-01-01'); await tap(R + '.cv-t-go');
  check((await txt('.cv-t-err')).includes('before Fibro-A (A7) was frozen on 2026-06-02'), 'cryovial: thaw before freezing message');
  await page.fill(R + '.cv-t-date', '2026-11-09'); await page.fill(R + '.cv-t-by', 'NS'); await page.fill(R + '.cv-t-note', 'For a test'); await tap(R + '.cv-t-go');
  check(await page.isHidden(R + '.cv-vialcard') && (await txt('.cv-boxinfo')).includes('13 of 81') && (await page.$$(R + '.cv-log tbody tr')).length === 3 && (await txt('.cv-log tbody tr:first-child')).includes('2026-11-09 Fibro-A P8 LN2 tank 1 › Rack 3 › Box 1 › A7 2026-06-02 NS For a test'), 'cryovial: mark thawed fills the thaw log');
  await tap(R + '.cv-log tbody tr:first-child .cv-undo');
  check((await txt('.cv-boxinfo')).includes('14 of 81') && (await page.$$(R + '.cv-log tbody tr')).length === 2, 'cryovial: undo a thaw');

  // Edit and move; taken place; remove.
  await tap(cell('C1'));
  await page.click(R + '.cv-edit summary');
  await page.fill(R + '.cv-e-pos', 'A2'); await tap(R + '.cv-e-save');
  check((await txt('.cv-e-err')).includes('A2 in Box 1 already holds Fibro-A'), 'cryovial: move to a full place message');
  await page.fill(R + '.cv-e-pos', 'i9'); await page.fill(R + '.cv-e-pass', '13'); await tap(R + '.cv-e-save');
  check((await page.getAttribute(cell('I9'), 'aria-label')) === 'I9: Clone 3B, P13, frozen 2026-08-20' && !(await page.$(cell('C1') + '.cv-full')) && (await txt('.cv-vh')) === 'I9 · Clone 3B', 'cryovial: edit and move a vial');
  await page.fill(R + '.cv-e-pass', 'two'); await tap(R + '.cv-e-save');
  check((await txt('.cv-e-err')).includes('whole number'), 'cryovial: bad passage message');
  await tap(R + '.cv-e-del');
  check((await txt('.cv-e-del')) === 'Press again to remove it', 'cryovial: remove asks twice');
  await tap(R + '.cv-e-del');
  check((await txt('.cv-boxinfo')).includes('13 of 81') && await page.isHidden(R + '.cv-vialcard'), 'cryovial: vial removed');

  // Add vials from an empty place.
  await tap(cell('B2'));
  check((await page.inputValue(R + '.cv-a-start')) === 'B2' && (await txt('.cv-a-where')).includes('Into Box 1: B2'), 'cryovial: tapping an empty place sets the start');
  await page.fill(R + '.cv-a-line', 'New line'); await page.fill(R + '.cv-a-pass', 'P3'); await page.fill(R + '.cv-a-cells', '2e6'); await page.fill(R + '.cv-a-who', 'NS'); await page.fill(R + '.cv-a-n', '9'); await page.waitForTimeout(80);
  check((await txt('.cv-a-where')) === 'Into Box 1: B2 to C1 (68 free from B2).', 'cryovial: where the vials will go');
  await tap(R + '.cv-a-go');
  check((await txt('.cv-a-ok')) === 'Added 9 vials of New line: B2 to C1.' && (await txt('.cv-boxinfo')).includes('22 of 81') && (await page.getAttribute(cell('C1'), 'aria-label')).startsWith('C1: New line, P3') && (await page.inputValue(R + '.cv-a-start')) === 'C3', 'cryovial: add 9 vials, full places skipped');
  await page.fill(R + '.cv-a-start', 'H5'); await page.fill(R + '.cv-a-n', '20'); await tap(R + '.cv-a-go');
  check((await txt('.cv-a-err')).includes('Only 14 free places from H5'), 'cryovial: not enough room message');
  await page.fill(R + '.cv-a-n', '1'); await page.fill(R + '.cv-a-line', ''); await tap(R + '.cv-a-go');
  check((await txt('.cv-a-err')).includes('cell line'), 'cryovial: missing line message');
  await page.fill(R + '.cv-a-line', 'X'); await page.fill(R + '.cv-a-start', 'K1'); await page.waitForTimeout(80);
  check((await txt('.cv-a-where')).includes('A1 to I9'), 'cryovial: bad start hint');

  // Search and filters.
  await page.fill(R + '.cv-q', 'p8'); await page.waitForTimeout(80);
  check((await txt('.cv-count')).startsWith('4 of ') && (await page.$$(R + '.cv-cell.cv-hit')).length === 4 && (await page.$$(R + '.cv-cell.cv-dim')).length === 18 && (await txt('.cv-boxinfo')).includes('4 match the search'), 'cryovial: search p8 lights up 4 vials');
  await page.fill(R + '.cv-q', ''); await page.selectOption(R + '.cv-ff', '−80 °C freezer B'); await page.waitForTimeout(80);
  check((await txt('.cv-count')).startsWith('7 of 29'), 'cryovial: freezer filter');
  await page.selectOption(R + '.cv-ff', ''); await page.selectOption(R + '.cv-fl', 'Clone 3B'); await page.waitForTimeout(80);
  check((await txt('.cv-count')).startsWith('3 of 29') && (await txt('.cv-res')).includes('Box 1 › C2'), 'cryovial: line filter');
  await tap(R + '.cv-fs button[data-s=all]');
  check((await txt('.cv-count')).startsWith('4 of 31') && (await txt('.cv-res')).includes('2026-10-01'), 'cryovial: all vials, with thaw dates');
  await tap(R + '.cv-fs button[data-s=thawed]');
  check((await txt('.cv-count')).startsWith('1 of 2') && await page.isHidden(R + '.cv-bulk'), 'cryovial: thawed only');
  await page.selectOption(R + '.cv-fl', ''); await tap(R + '.cv-fs button[data-s=in]');
  // Bulk thaw two ticked vials.
  await page.fill(R + '.cv-q', 'k-9'); await page.waitForTimeout(80);
  const ticks = await page.$$(R + '.cv-tick');
  await ticks[0].check(); await ticks[1].check();
  check((await txt('.cv-b-n')) === '2 ticked', 'cryovial: tick two');
  await page.fill(R + '.cv-b-date', '2026-11-09'); await page.fill(R + '.cv-b-by', 'NS'); await tap(R + '.cv-b-go');
  check((await txt('.cv-count')).startsWith('5 of 27') && (await page.$$(R + '.cv-log tbody tr')).length === 4, 'cryovial: mark ticked thawed');
  // Jump from the results to a vial.
  await page.fill(R + '.cv-q', 'master'); await page.waitForTimeout(80);
  await tap(R + '.cv-res tbody tr:first-child .cv-go');
  check((await txt('.cv-vh')) === 'A1 · Fibro-A', 'cryovial: jump to a vial from the results');
  { const d = await download(R + '.cv-res-csv', 'cvfound.csv'); const l = d.text.trim().split('\n'); check(d.name === 'cryovials-found.csv' && l.length === 7 && l[1].includes(',A1,Fibro-A,5,'), 'cryovial: found vials CSV'); }
  await page.fill(R + '.cv-q', ''); await page.waitForTimeout(80);
  // Lines table and the low-stock tag.
  check((await txt('.cv-lines')).includes('Line K-9 running low') === false && (await txt('.cv-lines')).includes('Clone 3B'), 'cryovial: lines table');
  await page.fill(R + '.cv-low', '5'); await page.waitForTimeout(80);
  check((await txt('.cv-lines')).includes('Line K-9 running low 5 3') && (await txt('.cv-lines')).includes('Clone 3B running low 3 1'), 'cryovial: running low tags');

  // Boxes: add (errors), rename, remove.
  await page.click(R + '.cv-addbox summary');
  await tap(R + '.cv-nb-add');
  check((await txt('.cv-nb-err')).includes('Give the freezer'), 'cryovial: box needs names');
  await page.fill(R + '.cv-nb-f', 'LN2 tank 1'); await page.fill(R + '.cv-nb-r', 'Rack 3'); await page.fill(R + '.cv-nb-n', 'box 1'); await tap(R + '.cv-nb-add');
  check((await txt('.cv-nb-err')).includes('already a box called box 1'), 'cryovial: duplicate box message');
  await page.fill(R + '.cv-nb-n', 'Box 2'); await page.selectOption(R + '.cv-nb-s', '10'); await tap(R + '.cv-nb-add');
  check((await txt('.cv-boxinfo')) === 'LN2 tank 1 › Rack 3 › Box 2: 0 of 100 places used, 100 free.' && (await page.$$(R + '.cv-cell')).length === 100, 'cryovial: new 10 × 10 box');
  await page.click(R + '.cv-editbox summary');
  await page.fill(R + '.cv-eb-n', 'Box 2b'); await tap(R + '.cv-eb-save');
  check((await txt('.cv-boxinfo')).startsWith('LN2 tank 1 › Rack 3 › Box 2b'), 'cryovial: rename a box');
  await tap(R + '.cv-eb-del'); await tap(R + '.cv-eb-del');
  check(!(await txt('.cv-box')).includes('Box 2b') && (await page.$$(R + '.cv-box option')).length === 2, 'cryovial: remove a box');
  await page.selectOption(R + '.cv-box', { label: 'LN2 tank 1 › Rack 3 › Box 1 (22/81)' }); await page.waitForTimeout(80);

  // Freezing helper.
  await page.fill(R + '.cv-f-date', '2026-11-09'); await page.waitForTimeout(80);
  check((await txt('.cv-f-big')) === '11 mL of freezing medium for 10 vials' && (await txt('.cv-f-sub')).startsWith('70 % medium, 20 % serum, 10 % DMSO. Cells resuspended at 1,000,000 cells/mL'), 'freezing: example headline');
  { const f = await txt('.cv-f-facts'); check(f.includes('Cells to spin down 11,000,000') && f.includes('DMSO 1.1 mL') && f.includes('Serum 2.2 mL') && f.includes('Medium 7.7 mL') && f.includes('13.75 mL') && f.includes('14 vials from 16,000,000 cells') && f.includes('1 h 40 min'), 'freezing: example facts'); }
  check((await txt('.cv-f-sched')).includes('2026-11-10 Move the vials') && (await txt('.cv-f-sched')).includes('2026-11-16 Test thaw') && (await txt('.cv-f-steps')).includes('Spin down 13.75 mL'), 'freezing: dates and steps');
  await page.fill(R + '.cv-f-n', '20'); await page.waitForTimeout(80);
  check((await txt('.cv-f-warn')).includes('enough for 14 vials at this density, not 20'), 'freezing: not enough cells');
  await page.fill(R + '.cv-f-s', '95'); await page.waitForTimeout(80);
  check((await txt('.cv-f-err')).includes('more than 100 %') && await page.isHidden(R + '.cv-f-out'), 'freezing: bad mix message');
  await page.fill(R + '.cv-f-s', '0'); await page.fill(R + '.cv-f-d', '5'); await page.fill(R + '.cv-f-cpm', ''); await page.fill(R + '.cv-f-vol', ''); await page.fill(R + '.cv-f-rate', '0.5'); await page.fill(R + '.cv-f-t0', '4'); await page.waitForTimeout(80);
  { const f = await txt('.cv-f-facts'); check(f.includes('DMSO 1.1 mL') && f.includes('Serum 0 mL') && f.includes('Medium 20.9 mL') && f.includes('2 h 48 min') && !f.includes('You could freeze') && (await txt('.cv-f-sub')).startsWith('95 % medium, 5 % DMSO'), 'freezing: 5 % DMSO, no serum, no count, slower cooling'); }
  await page.fill(R + '.cv-f-n', '3'); await page.fill(R + '.cv-f-cpv', '4e6'); await tap(R + '.cv-f-use');
  check((await page.inputValue(R + '.cv-a-n')) === '3' && (await page.inputValue(R + '.cv-a-cells')) === '4e6' && (await page.inputValue(R + '.cv-a-med')) === '95 % medium, 5 % DMSO' && (await page.inputValue(R + '.cv-a-date')) === '2026-11-09' && (await page.inputValue(R + '.cv-a-start')) === 'C3', 'freezing: helper fills the add form');

  // Print the box map (print dialog stubbed).
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => { window.__pr = null; window.print = () => { const p = document.querySelector('.cv-print'); window.__pr = { cls: document.documentElement.classList.contains('cv-printing'), parent: p.parentElement === document.body, shown: getComputedStyle(p).display, main: getComputedStyle(document.querySelector('main') || document.body.firstElementChild).display, title: p.querySelector('h1').textContent, cells: p.querySelectorAll('.cv-pgrid td').length, full: p.querySelectorAll('.cv-pgrid td b').length, rows: p.querySelectorAll('.cv-plist tbody tr').length }; }; });
  await tap(R + '.cv-print-go'); await page.waitForTimeout(50);
  const pr = await page.evaluate(() => window.__pr);
  await page.emulateMedia({ media: null });
  check(pr && pr.cls && pr.parent && pr.shown === 'block' && pr.main === 'none' && pr.title === 'LN2 tank 1 › Rack 3 › Box 1' && pr.cells === 81 && pr.full === 22 && pr.rows === 22, `print: only the box map is printed (${JSON.stringify(pr)})`);
  check(await page.evaluate(() => !document.documentElement.classList.contains('cv-printing') && !!document.querySelector('.cvi > .cv-print')), 'print: page restored after printing');
  // Box map report.
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=pdf]')]); check(d.suggestedFilename() === 'cryovial-box-Box-1.pdf', 'report: PDF'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=png]')]); check(d.suggestedFilename() === 'cryovial-box-Box-1.png', 'report: image'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=docx]')]); check(d.suggestedFilename() === 'cryovial-box-Box-1.docx', 'report: Word'); }

  // Open files: replace with the example CSV, add the same JSON again (places taken), bad files.
  await page.selectOption(R + '.cv-mode', 'replace');
  await page.setInputFiles(R + '.cv-in', OUT + 'cv.csv'); await page.waitForTimeout(200);
  check((await txt('.cv-io-ok')) === 'Opened cv.csv: 23 vials (2 thawed), 2 new boxes.' && await page.isHidden(R + '.cv-io-err') && (await txt('.cv-boxinfo')).includes('Box 7: 7 of 100'), 'files: open a CSV, replacing');
  await page.selectOption(R + '.cv-mode', 'add');
  await page.setInputFiles(R + '.cv-in', OUT + 'cv.json'); await page.waitForTimeout(200);
  check((await txt('.cv-io-ok')).startsWith('Opened cv.json: 2 vials (2 thawed)') && (await txt('.cv-io-err')).startsWith('Left out 21 rows: Vial') && (await txt('.cv-io-err')).includes('already holds'), 'files: adding the same JSON reports taken places');
  writeFileSync(OUT + 'bad.csv', 'name,colour\nA,red\n');
  await page.setInputFiles(R + '.cv-in', OUT + 'bad.csv'); await page.waitForTimeout(200);
  check((await txt('.cv-io-err')).includes('"line" and "position"'), 'files: a CSV without the columns');
  writeFileSync(OUT + 'own.csv', 'Freezer;Rack;Box;Box size;Position;Cell line;Passage;Date frozen;Cells per vial\nTank 2;R1;Mine;10x10;j10;My line;P2;2026-05-01;1.5e6\nTank 2;R1;Mine;10x10;Z9;Bad;1;2026-05-01;1e6\n');
  await page.setInputFiles(R + '.cv-in', OUT + 'own.csv'); await page.waitForTimeout(200);
  check((await txt('.cv-io-ok')) === 'Opened own.csv: 1 vial, 1 new box.' && (await txt('.cv-io-err')).includes('Line 3: "Z9" is not a place in a 10x10 box'), 'files: own semicolon CSV with a bad row');
  await page.selectOption(R + '.cv-box', { label: 'Tank 2 › R1 › Mine (1/100)' }); await page.waitForTimeout(80);
  check((await page.getAttribute(cell('J10'), 'aria-label')) === 'J10: My line, P2, frozen 2026-05-01', 'files: own CSV vial in J10');

  // Keep in this browser, reload, clear.
  await page.check(R + '.cv-keep'); await page.waitForTimeout(80);
  check(await page.evaluate(() => JSON.parse(localStorage.getItem('fibub-cryovials-v1')).vials.length === 26) && (await txt('.cv-cleared')).includes('Saved in this browser'), 'storage: kept when ticked');
  await page.reload(); await page.waitForTimeout(400);
  check(await page.isChecked(R + '.cv-keep') && (await page.$$(R + '.cv-box option')).length === 3 && await page.isHidden(R + '.cv-exnote'), 'storage: back after a reload');
  await page.uncheck(R + '.cv-keep'); await page.waitForTimeout(80);
  check(await page.evaluate(() => localStorage.getItem('fibub-cryovials-v1') === null), 'storage: unticking deletes the saved copy');
  await page.check(R + '.cv-keep');
  await tap(R + '.cv-clear');
  check((await txt('.cv-clear')) === 'Press again to clear all', 'storage: clear asks twice');
  await tap(R + '.cv-clear');
  check(await page.evaluate(() => localStorage.getItem('fibub-cryovials-v1') === null) && !(await page.isChecked(R + '.cv-keep')) && (await txt('.cv-boxinfo')).startsWith('No boxes yet') && (await txt('.cv-count')).startsWith('0 of 0') && await page.isDisabled(R + '.cv-a-go'), 'storage: clear all empties the page and the browser');
  await page.reload(); await page.waitForTimeout(400);
  check((await txt('.cv-boxinfo')).startsWith('LN2 tank 1 › Rack 3 › Box 1') && await page.isVisible(R + '.cv-exnote'), 'storage: nothing kept, example again');
  await tap(R + '.cv-empty');
  check((await txt('.cv-boxinfo')).startsWith('No boxes yet') && await page.isHidden(R + '.cv-exnote'), 'cryovial: start empty');
};
