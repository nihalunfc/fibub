// #814 sample label maker
export const path = '/science/sample-label-maker/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/sample-label-maker/`); await page.waitForTimeout(800);
  const big = () => page.textContent('.slm .lb-big'), facts = () => page.textContent('.slm .lb-facts'), err = () => page.textContent('.slm .lb-err');
  check((await big()) === '6 labels on 1 sheet (65 a sheet)', 'labels: example headline');
  { const f = await facts(); check(f.includes('38 × 21 mm') && f.includes('version 1 (21 × 21), 17.53 mm square') && f.includes('each square 0.7 mm') && f.includes('59 labels left blank'), 'labels: example facts'); }
  check((await page.$$('.slm .lb-lines input')).length === 4 && (await page.textContent('.slm .lb-key')).includes('ID'), 'labels: columns read from the header');
  // The preview really holds a QR code: count dark pixels in the top-left part of the sheet.
  { const dark = await page.evaluate(() => { const c = document.querySelector('.slm .lb-fig'); const d = c.getContext('2d').getImageData(0, 0, Math.round(c.width * 0.2), Math.round(c.height * 0.12)).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 100) n++; return n; }); check(dark > 500, `labels: preview draws codes (${dark} dark pixels)`); }
  await page.selectOption('.slm .lb-code', 'c128'); await page.waitForTimeout(300);
  check((await facts()).includes('narrowest bar 0.32 mm') && (await facts()).includes('90 modules'), 'labels: Code 128');
  await page.selectOption('.slm .lb-code', 'both'); await page.waitForTimeout(300);
  check((await facts()).includes('QR code') && (await facts()).includes('narrowest bar'), 'labels: both codes');
  await page.selectOption('.slm .lb-code', 'none'); await page.waitForTimeout(300);
  check(!(await facts()).includes('QR code') && !(await facts()).includes('Barcode'), 'labels: text only');
  await page.selectOption('.slm .lb-code', 'qr'); await page.selectOption('.slm .lb-ecl', 'H'); await page.waitForTimeout(300);
  check((await facts()).includes('version 1'), 'labels: level H still version 1 for S-001');
  await page.fill('.slm .lb-copies', '2'); await page.fill('.slm .lb-skip', '7'); await page.waitForTimeout(500);
  check((await big()) === '12 labels on 1 sheet (65 a sheet)' && (await facts()).includes('starting at label 8') && (await facts()).includes('46 labels left blank'), 'labels: copies and used labels');
  await page.fill('.slm .lb-skip', '60'); await page.waitForTimeout(500);
  check((await big()) === '12 labels on 2 sheets (65 a sheet)', 'labels: runs onto a second sheet');
  await page.fill('.slm .lb-skip', '65'); await page.waitForTimeout(500);
  check((await err()).startsWith('Only 65 labels fit on a sheet'), 'labels: too many used labels');
  await page.fill('.slm .lb-skip', '0'); await page.fill('.slm .lb-copies', '1'); await page.waitForTimeout(500);
  await page.selectOption('.slm .lb-preset', '5'); await page.waitForTimeout(300);
  check((await big()) === '6 labels on 6 sheets (1 a sheet)' && (await facts()).includes('50 × 25 mm'), 'labels: label printer preset');
  await page.selectOption('.slm .lb-preset', '3'); await page.waitForTimeout(300);
  check((await facts()).includes('44 × 13 mm') && (await big()).includes('(80 a sheet)'), 'labels: US Letter preset');
  await page.fill('.slm .lb-s[data-k=pitchX]', '60'); await page.waitForTimeout(500);
  check((await err()).includes('off the right of the page') && (await page.inputValue('.slm .lb-preset')) === 'custom', 'labels: custom sheet that does not fit');
  await page.selectOption('.slm .lb-preset', '0'); await page.waitForTimeout(300);
  await page.uncheck('.slm .lb-lines input >> nth=3'); await page.selectOption('.slm .lb-key', '1'); await page.waitForTimeout(300);
  check((await facts()).includes('version 2 (25 × 25)') && await page.isHidden('.slm .lb-err'), 'labels: code holds the name column (11 bytes at level H: version 2)');
  await page.selectOption('.slm .lb-code', 'c128'); await page.fill('.slm .lb-list', 'ID,Name\nS-µ1,5 µL\nS-2,x'); await page.waitForTimeout(500);
  check((await err()).includes('"µ" is not one'), 'labels: Code 128 refuses µ');
  await page.selectOption('.slm .lb-code', 'qr'); await page.waitForTimeout(300);
  check(await page.isHidden('.slm .lb-err') && (await big()).startsWith('2 labels'), 'labels: QR takes µ');
  await page.fill('.slm .lb-list', 'ID\n' + 'x'.repeat(250)); await page.waitForTimeout(500);
  check((await err()).includes('Too long for a label QR code'), 'labels: too long for a QR code');
  await page.fill('.slm .lb-list', 'ID,Name\n,blank'); await page.waitForTimeout(500);
  check((await err()).includes('has an empty ID'), 'labels: empty code value');
  await page.uncheck('.slm .lb-head'); await page.fill('.slm .lb-list', 'A1\tLiver\nA2\tKidney\nA3\tΩ heart'); await page.waitForTimeout(500);
  check((await big()).startsWith('3 labels') && (await page.textContent('.slm .lb-key')).includes('Column 1'), 'labels: tab list without a header');
  await page.selectOption('.slm .lb-key', '0'); await page.check('.slm .lb-outline');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.slm .lb-pdf')]); const f = OUT + 'labels.pdf'; await d.saveAs(f);
    const { PDFDocument } = await import('pdf-lib'); const doc = await PDFDocument.load(readFileSync(f)); const { width, height } = doc.getPage(0).getSize();
    check(doc.getPageCount() === 1 && Math.abs(width - 595.28) < 0.05 && Math.abs(height - 841.89) < 0.05 && d.suggestedFilename() === 'sample-labels-A1.pdf', `labels: A4 PDF (${width.toFixed(2)} × ${height.toFixed(2)})`);
    check((await page.textContent('.slm .lb-lost')).includes('Ω'), 'labels: characters the PDF font lacks are listed'); }
  writeFileSync(OUT + 'samples.csv', 'Tube,Strain\nT1,WT\nT2,KO\nT3,KO\nT4,WT\n');
  await page.check('.slm .lb-head');
  await page.setInputFiles('.slm .dfb-in', OUT + 'samples.csv'); await page.waitForTimeout(700);
  check((await big()).startsWith('4 labels') && (await page.textContent('.slm .lb-key')).includes('Tube'), 'labels: CSV file opened');
};
