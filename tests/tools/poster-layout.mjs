// #809 poster layout
export const path = '/science/poster-layout/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/poster-layout/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.pst .pl-big'), facts = () => page.textContent('.pst .pl-facts');
  check((await big()) === '3 columns 250.3 mm wide; body text 28 pt, title 90 pt', 'poster: example headline');
  { const f = await facts(); check(f.includes('841 × 1189 mm') && f.includes('250.3 × 889 mm') && f.includes('start 195 mm') && f.includes('67 % of the poster') && f.includes('about 50 characters'), 'poster: example facts'); }
  { const t = await page.textContent('.pst .pl-tab'); check(t.includes('6.5 mm') && t.includes('26.5 pt') && t.includes('88.3 pt') && t.includes('90 pt') && t.includes('17.7 pt'), 'poster: text size table'); }
  check(await page.isVisible('.pst .pl-fig') && (await page.getAttribute('.pst .pl-fig', 'aria-label')).includes('841 by 1189'), 'poster: to-scale drawing');
  await page.fill('.pst .pl-cols', '5'); await page.waitForTimeout(400);
  check((await facts()).includes('about 28 characters') && (await facts()).includes('short lines'), 'poster: five columns give short lines');
  await page.selectOption('.pst .pl-or', 'l'); await page.fill('.pst .pl-cols', '4'); await page.waitForTimeout(400);
  check((await facts()).includes('1189 × 841 mm') && (await big()).startsWith('4 columns 269.8 mm'), 'poster: landscape with 4 columns');
  await page.selectOption('.pst .pl-size', '36x48'); await page.selectOption('.pst .pl-or', 'p'); await page.fill('.pst .pl-cols', '3'); await page.waitForTimeout(400);
  check((await facts()).includes('914.4 × 1219.2 mm') && (await facts()).includes('36 × 48 in'), 'poster: 36 × 48 in');
  await page.selectOption('.pst .pl-size', 'custom'); await page.waitForTimeout(200);
  check(await page.isVisible('.pst .pl-w'), 'poster: custom size fields');
  await page.fill('.pst .pl-w', '700'); await page.fill('.pst .pl-h', '1000'); await page.fill('.pst .pl-t', '0'); await page.fill('.pst .pl-f', '0'); await page.waitForTimeout(400);
  check((await facts()).includes('700 × 1000 mm') && (await facts()).includes('203.3 × 950 mm'), 'poster: custom size, no bands');
  await page.fill('.pst .pl-c', '6'); await page.waitForTimeout(400);
  check((await big()).includes('body text 54 pt') && (await page.textContent('.pst .pl-ang')) === '30', 'poster: comfort doubles the sizes');
  await page.fill('.pst .pl-c', '3'); await page.fill('.pst .pl-d[data-i="2"]', '2'); await page.waitForTimeout(400);
  check((await big()).includes('body text 36 pt'), 'poster: body read from 2 m');
  await page.fill('.pst .pl-m', '400'); await page.waitForTimeout(400);
  check((await page.textContent('.pst .pl-err')).includes('under 10 mm'), 'poster: margin too big message');
  await page.fill('.pst .pl-m', '25'); await page.fill('.pst .pl-d[data-i="0"]', '50'); await page.waitForTimeout(400);
  check((await page.textContent('.pst .pl-err')).includes('0.3 to 30 m'), 'poster: distance message');
  await page.fill('.pst .pl-d[data-i="0"]', '5'); await page.selectOption('.pst .pl-size', 'a0'); await page.fill('.pst .pl-t', '150'); await page.fill('.pst .pl-f', '60'); await page.fill('.pst .pl-d[data-i="2"]', '1.5'); await page.waitForTimeout(400);
  check(await page.isHidden('.pst .pl-err') && (await big()) === '3 columns 250.3 mm wide; body text 28 pt, title 90 pt', 'poster: back to the example');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pst .pl-svg')]); const f = OUT + 'poster.svg'; await d.saveAs(f); const s = readFileSync(f, 'utf8');
    check(d.suggestedFilename() === 'A0-poster-template.svg' && s.includes('width="841mm" height="1189mm"') && s.includes('id="column-3"') && s.includes('Body text: 28 pt'), 'poster: SVG template'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pst .pl-pdf')]); const f = OUT + 'poster.pdf'; await d.saveAs(f); const { PDFDocument } = await import('pdf-lib'); const doc = await PDFDocument.load(readFileSync(f)); const { width, height } = doc.getPage(0).getSize();
    check(doc.getPageCount() === 1 && Math.abs(width - 2383.94) < 0.1 && Math.abs(height - 3370.39) < 0.1, `poster: PDF template is A0 in points (${width.toFixed(2)} × ${height.toFixed(2)})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pst .dl [data-f=docx]')]); const f = OUT + 'poster.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'poster: Word report'); }
};
