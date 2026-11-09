// #184 ion exchange and IEF pH picker
export const path = '/science/ion-exchange-ph/';
export default async ({ page, check, OUT, BASE, readFileSync, writeFileSync }) => {
  const R = '.iex ';
  const txt = (c) => page.textContent(R + c);
  await page.goto(`${BASE}/science/ion-exchange-ph/`); await page.waitForTimeout(400);
  check(await page.isHidden(R + '.ix-out'), 'iex: nothing shown before input');
  await page.click(R + '.ix-ex'); await page.waitForTimeout(300);
  check((await txt('.ix-big')) === '3 proteins, pI 4.15 to 10.42', 'iex: example headline');
  { const t = await txt('.ix-tab'); check(t.includes('4.15') && t.includes('5.2−7.0') && t.includes('3.2+8.1') && t.includes('6.91') && t.includes('7.9−2.4') && t.includes('5.9+3.4') && t.includes('11.4−4.0') && t.includes('9.4+4.7'), 'iex: example buffer table'); }
  check((await txt('.ix-warn')).includes('cation pH 3.2 for protein 1, anion pH 11.4 for protein 3, cation pH 9.4 for protein 3'), 'iex: suggestions outside the range flagged');
  { const f = await txt('.ix-sfacts'); check(f.includes('best at pH 9.00, good from 8.85 to 9.00') && f.includes('3: +6.1 (flows through)') && f.includes('2 and 3, 6.59 charges apart; still rising at the end') && f.includes('best at pH 4.30, good from 4.05 to 4.45') && f.includes('1 and 2, 8.78 charges apart'), 'iex: best separation for both resins'); }
  check(await page.isVisible(R + '.ix-fig') && await page.isVisible(R + '.ix-sfig') && await page.isVisible(R + '.ix-strip'), 'iex: charge, separation and strip figures');
  { const t = await txt('.ix-itab'); check(t.includes('10.1') && t.includes('34.2') && t.includes('65.0') && t.includes('59.9') && (await txt('.ix-inote')).includes('1.14 pH units per cm. Closest neighbours 24.1 mm apart.'), 'iex: IEF positions on a 3 to 11, 70 mm strip'); }

  // IEF options: a narrow strip pushes proteins off; a big gap threshold flags close pairs.
  await page.fill(R + '.ix-glo', '4'); await page.fill(R + '.ix-ghi', '7'); await page.waitForTimeout(100);
  { const t = await txt('.ix-itab'); check(t.includes('off the − end') && (await txt('.ix-inote')).includes('Widen the pH range'), 'iex: protein off the strip'); }
  await page.fill(R + '.ix-glo', '3'); await page.fill(R + '.ix-ghi', '11'); await page.fill(R + '.ix-len', '7'); await page.fill(R + '.ix-gap', '3'); await page.waitForTimeout(100);
  check((await txt('.ix-inote')).includes('Closer than 3 mm, may run as one band: 1 and 2 (2.41 mm)'), 'iex: strip length and smallest gap');
  await page.fill(R + '.ix-len', '0'); await page.waitForTimeout(100);
  check((await txt('.ix-gerr')).includes('length above 0 mm') && await page.isHidden(R + '.ix-strip'), 'iex: bad strip message');
  await page.fill(R + '.ix-len', '70'); await page.fill(R + '.ix-gap', '1'); await page.waitForTimeout(100);

  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ix-csv')]); const f = OUT + 'iex.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 4 && rows[0].startsWith('protein,length,pI,anion_pH') && rows[2].startsWith('Neutral example (made up),88,6.910,7.9,-2.392,5.9,3.430'), 'iex: table CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ix-ccsv')]); const f = OUT + 'iexc.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 282 && rows[0].split(',').length === 4 && rows[141].startsWith('7.00,'), 'iex: charge curve CSV'); }
  { await page.locator(R + '.dl').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'iex.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'iex: PDF report'); }

  // Distance from the pI and the buffer range.
  await page.fill(R + '.ix-off', '0.5'); await page.waitForTimeout(100);
  check((await txt('.ix-tab')).includes('7.4') && (await txt('.ix-tab')).includes('6.4'), 'iex: half a unit from the pI');
  await page.fill(R + '.ix-off', '1'); await page.fill(R + '.ix-lo', '5'); await page.fill(R + '.ix-hi', '8'); await page.waitForTimeout(100);
  check((await txt('.ix-sfacts')).includes('good from 4') === false && (await txt('.ix-sfacts')).includes('pH 8.00'), 'iex: buffer range limits the search');
  await page.fill(R + '.ix-hi', '5'); await page.waitForTimeout(100);
  check((await txt('.ix-err')).includes('at least 0.5 above') && await page.isHidden(R + '.ix-out'), 'iex: bad buffer range message');
  await page.fill(R + '.ix-lo', '4'); await page.fill(R + '.ix-hi', '9'); await page.waitForTimeout(100);

  // Editable pKa: a different Lys pKa moves the basic protein's pI.
  await page.click(R + '.ix-more summary');
  await page.fill(R + '.ix-pka input[data-k=K]', '9.5'); await page.waitForTimeout(100);
  check(!(await txt('.ix-big')).endsWith('10.42'), 'iex: edited pKa changes the pI');
  await page.click(R + '.ix-def'); await page.waitForTimeout(100);
  check((await txt('.ix-big')).endsWith('10.42'), 'iex: back to the default pKa values');

  // One protein, a FASTA file, bad input.
  await page.fill(R + '.ix-in', '>One\nMKDEKRHHHDEW'); await page.waitForTimeout(500);
  check((await txt('.ix-big')).startsWith('pI ') && (await txt('.ix-big')).includes('anion exchange at pH') && await page.isHidden(R + '.ix-sep'), 'iex: a single protein');
  writeFileSync(OUT + 'two.fasta', '>P1\nDDDEEEKAAAG\n>P2\nKKKRRRDAAAG\n');
  await page.setInputFiles(R + '.ix-file', OUT + 'two.fasta'); await page.waitForTimeout(300);
  check((await txt('.ix-big')).startsWith('2 proteins') && await page.isVisible(R + '.ix-sep'), 'iex: FASTA file with two proteins');
  await page.fill(R + '.ix-in', '1234 !!'); await page.waitForTimeout(500);
  check((await txt('.ix-err')).includes('No amino acids found') && await page.isHidden(R + '.ix-out'), 'iex: no amino acids message');
};
