// #349 stereotaxic helper
export const path = '/science/stereotaxic-helper/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.stx ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/stereotaxic-helper/`); await page.waitForTimeout(500);
  check((await t('.sx-big')) === 'AP −1.90 mm, ML 1.50 mm, depth 1.80 mm', 'stereotaxic: example scaled target');
  { const f = await t('.sx-facts'); check(f.includes('0.95') && f.includes('AP −1.90 mm, ML 1.82 mm') && f.includes('1.83 mm') && f.includes('0.32 mm') && f.includes('lateral of the target'), 'stereotaxic: example angled entry'); }
  { const f = await t('.sx-flat'); check(f.includes('not flat') && f.includes('lambda 0.12 mm lower') && f.includes('1.81°') && f.includes('lower the incisor'), 'stereotaxic: example flat check'); }
  check(await page.isVisible(R + '.sx-fig') && (await page.textContent('main')).includes('not for clinical use'), 'stereotaxic: track picture and study note');
  await page.selectOption(R + '.sx-mode', 'all'); await page.waitForTimeout(100);
  check((await t('.sx-big')) === 'AP −1.90 mm, ML 1.42 mm, depth 1.71 mm', 'stereotaxic: scale all axes');
  await page.selectOption(R + '.sx-mode', 'none'); await page.waitForTimeout(100);
  check((await t('.sx-big')) === 'AP −2.00 mm, ML 1.50 mm, depth 1.80 mm', 'stereotaxic: no scaling');
  await page.selectOption(R + '.sx-mode', 'ap');
  await page.selectOption(R + '.sx-tow', 'lateral'); await page.waitForTimeout(100);
  check((await t('.sx-facts')).includes('ML 1.18 mm') && (await t('.sx-facts')).includes('medial of the target'), 'stereotaxic: tip away from midline');
  await page.selectOption(R + '.sx-plane', 'ap'); await page.fill(R + '.sx-ang', '20'); await page.waitForTimeout(100);
  check((await t('.sx-facts')).includes('AP −1.24 mm, ML 1.50 mm') && (await t('.sx-facts')).includes('1.92 mm'), 'stereotaxic: sagittal 20° tip backward');
  await page.selectOption(R + '.sx-tow', 'anterior'); await page.waitForTimeout(100);
  check((await t('.sx-facts')).includes('AP −2.56 mm'), 'stereotaxic: sagittal tip forward');
  await page.fill(R + '.sx-ang', '0'); await page.waitForTimeout(100);
  check((await t('.sx-facts')).includes('vertical'), 'stereotaxic: vertical approach');
  await page.selectOption(R + '.sx-plane', 'ml'); await page.selectOption(R + '.sx-tow', 'lateral'); await page.fill(R + '.sx-ang', '45'); await page.waitForTimeout(100);
  check((await t('.sx-facts')).includes('across the midline'), 'stereotaxic: midline warning');
  await page.fill(R + '.sx-ang', '10'); await page.selectOption(R + '.sx-tow', 'medial');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sx-csv')]); const f = OUT + 'stx.csv'; await d.saveAs(f); const c = readFileSync(f, 'utf8'); check(c.startsWith('Quantity,Value') && c.includes('Entry ML (mm),1.8174') && c.includes('Length along the arm (mm),1.8278') && c.includes('Target AP (mm),-1.9'), 'stereotaxic: CSV download'); }
  await page.selectOption(R + '.sx-dir', 'up'); await page.waitForTimeout(100);
  check((await t('.sx-flat')).includes('lambda 0.12 mm higher') && (await t('.sx-flat')).includes('raise the incisor'), 'stereotaxic: reading grows upwards');
  await page.fill(R + '.sx-l', '4.55'); await page.fill(R + '.sx-left', '3.00'); await page.fill(R + '.sx-right', '3.20'); await page.waitForTimeout(100);
  { const f = await t('.sx-flat'); check(f.startsWith('Bregma to lambdaflat') && f.includes('not level') && f.includes('right side 0.20 mm higher') && f.includes('2.86°'), 'stereotaxic: left-right check'); }
  await page.fill(R + '.sx-right', ''); await page.waitForTimeout(100);
  check((await t('.sx-ferr')).includes('left and right'), 'stereotaxic: half-filled left/right message');
  await page.fill(R + '.sx-dv', '-2'); await page.waitForTimeout(100);
  check((await t('.sx-err')).includes('positive number') && await page.isHidden(R + '.sx-out'), 'stereotaxic: negative depth message');
  await page.fill(R + '.sx-dv', '1.8'); await page.fill(R + '.sx-ref', ''); await page.waitForTimeout(100);
  check((await t('.sx-err')).includes('bregma–lambda'), 'stereotaxic: missing reference message');
};
