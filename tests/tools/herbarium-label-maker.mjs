// #326 Herbarium label maker
export const path = '/science/herbarium-label-maker/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/herbarium-label-maker/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.hlm .hl-big'), pv = () => page.textContent('.hlm .hl-preview');
  check((await big()) === '3 labels on 1 page', 'herbarium: example count');
  { const t = await pv(); check(t.includes('PLANTS OF ONTARIO, CANADA') && t.includes('CYPERACEAE') && t.includes('45°23\'16.8"N 78°09\'15.8"W ±15 m. Elev. 395 m.') && t.includes('30.vi.2026') && t.includes('Det. B. Sample, 2.vii.2026') && t.includes('XYZ 000124'), 'herbarium: example label text'); }
  check(await page.$$eval('.hlm .hl-preview .hl-label:nth-child(2) span', (e) => { const t = (c) => e.filter((x) => x.className === c).map((x) => x.textContent.trim()); return t('hl-b').includes('subsp.') && t('hl-bi').join(' ') === 'Carex flava jemtlandica' && t('hl-r').includes('(Palmgr.) Palmgr.'); }), 'herbarium: name italic, rank word and authors roman');
  await page.selectOption('.hlm .hl-date', 'long'); await page.selectOption('.hlm .hl-coord', 'decimal'); await page.selectOption('.hlm .hl-ft', '1'); await page.waitForTimeout(400);
  { const t = await pv(); check(t.includes('30 June 2026') && t.includes('45.388, -78.1544 ±15 m. Elev. 395 m (1296 ft).'), 'herbarium: long dates, decimal coordinates, feet'); }
  await page.selectOption('.hlm .hl-date', 'iso'); await page.selectOption('.hlm .hl-coord', 'both'); await page.waitForTimeout(400);
  check((await pv()).includes('2026-06-30') && (await pv()).includes('W (45.388, -78.1544)'), 'herbarium: ISO dates, both coordinates');
  await page.selectOption('.hlm .hl-date', 'short'); await page.fill('.hlm .hl-head', '{institutionCode} Herbarium'); await page.waitForTimeout(400);
  check((await pv()).includes('XYZ HERBARIUM') && (await pv()).includes('30 Jun 2026'), 'herbarium: heading template, short months');
  await page.selectOption('.hlm .hl-copies', '3'); await page.selectOption('.hlm .hl-per', '2'); await page.waitForTimeout(400);
  check((await big()) === '9 labels on 5 pages', 'herbarium: copies and labels per page');
  // Print sheet (built on beforeprint) has real-size pages.
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint'))); await page.waitForTimeout(200);
  check(await page.$$eval('.hl-print-sheet .hl-page', (e) => e.length) === 5 && await page.$$eval('.hl-print-sheet .hl-label', (e) => e.length === 9 && e.every((l) => l.scrollHeight <= l.clientHeight + 1)), 'herbarium: print sheet, 5 pages, labels fit');
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.hlm .hl-pdf')]); const f = OUT + 'herb.pdf'; await d.saveAs(f); const { PDFDocument } = await import('pdf-lib'); const doc = await PDFDocument.load(readFileSync(f)); check(doc.getPageCount() === 5 && Math.round(doc.getPage(0).getWidth()) === 595, 'herbarium: PDF with 5 A4 pages'); }
  await page.selectOption('.hlm .hl-paper', 'letter'); await page.selectOption('.hlm .hl-per', '8'); await page.selectOption('.hlm .hl-cut', '0'); await page.waitForTimeout(300);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.hlm .hl-pdf')]); const f = OUT + 'herb2.pdf'; await d.saveAs(f); const { PDFDocument } = await import('pdf-lib'); const doc = await PDFDocument.load(readFileSync(f)); check(doc.getPageCount() === 2 && doc.getPage(0).getWidth() === 612, 'herbarium: Letter, 8 per page'); }
  // Form: add a specimen.
  await page.locator('.hlm [data-term=scientificName]').scrollIntoViewIfNeeded();
  await page.fill('.hlm [data-term=scientificName]', 'Trillium grandiflorum'); await page.fill('.hlm [data-term=recordedBy]', 'C. Tester'); await page.fill('.hlm [data-term=eventDate]', '2026-02-30'); await page.fill('.hlm [data-term=decimalLatitude]', '95');
  await page.click('.hlm .hl-add'); await page.waitForTimeout(300);
  check((await page.textContent('.hlm .hl-formmsg')).includes('specimen 4') && (await page.textContent('.hlm .hl-warn')).includes('Specimen 4 (Trillium grandiflorum): latitude must be') && (await page.textContent('.hlm .hl-warn')).includes('date collected is not YYYY-MM-DD'), 'herbarium: add from form, with warnings');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.hlm .hl-csv')]); const f = OUT + 'herb.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); const rows = t.trim().split('\r\n'); check(rows.length === 5 && rows[0].startsWith('institutionCode,catalogNumber,family,scientificName') && t.includes('"Old logging road, 2 km east of the gate"') && rows[4].includes('Trillium grandiflorum'), 'herbarium: Darwin Core CSV download'); }
  await page.click('.hlm .hl-clearform');
  check((await page.inputValue('.hlm [data-term=scientificName]')) === '', 'herbarium: clear the form');
  await page.click('.hlm .hl-add'); await page.waitForTimeout(100);
  check((await page.textContent('.hlm .hl-formmsg')).includes('at least a scientific name'), 'herbarium: empty form message');
  await page.fill('.hlm .hl-data', 'Collector,Date,Species,Colour\nD. Alias,2026-09-01,Aster sp.,blue'); await page.waitForTimeout(400);
  check((await pv()).includes('D. Alias') && (await pv()).includes('1 Sep 2026') && (await page.textContent('.hlm .hl-warn')).includes('Ignored columns: Colour'), 'herbarium: header aliases and ignored columns');
  await page.fill('.hlm .hl-data', 'foo,bar\n1,2'); await page.waitForTimeout(400);
  check((await page.textContent('.hlm .hl-err')).includes('Darwin Core terms') && (await big()) === 'No specimens yet' && await page.isDisabled('.hlm .hl-pdf'), 'herbarium: bad header message');
  await page.click('.hlm .hl-clear'); await page.waitForTimeout(300);
  check((await big()) === 'No specimens yet' && (await page.inputValue('.hlm .hl-data')).startsWith('institutionCode,catalogNumber'), 'herbarium: clear the list');
};
