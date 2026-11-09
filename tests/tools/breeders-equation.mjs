// #389 breeder's equation calculator
export const path = '/science/breeders-equation/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/breeders-equation/`); await page.waitForTimeout(600);
  const r = '.beq ';
  const t = (c) => page.textContent(r + c);
  check((await t('.be-big')) === 'R = 5.616 per generation', 'breeders: example response');
  { const x = await t('.be-facts'); check(x.includes('Selection intensity i1.7550') && x.includes('Truncation point z1.282') && x.includes('Selection differential S14.040') && x.includes('Response per year2.808') && x.includes('Mean of the offspring105.616') && x.includes('5.62 % of the mean'), `breeders: example facts (${x})`); }
  check(await page.isVisible(r + '.be-fig'), 'breeders: distribution figure');
  await page.selectOption(r + '.be-c', '0.5'); await page.waitForTimeout(100);
  check((await t('.be-big')) === 'R = 2.808 per generation', 'breeders: one parent selected');
  await page.selectOption(r + '.be-c', '1'); await page.fill(r + '.be-p', '1'); await page.waitForTimeout(400);
  check((await t('.be-facts')).includes('Selection intensity i2.6652'), 'breeders: 1 % selected');
  await page.selectOption(r + '.be-mode', 'S'); await page.fill(r + '.be-s', '12'); await page.fill(r + '.be-h2', '0.25'); await page.waitForTimeout(400);
  check((await t('.be-big')) === 'R = 3.000 per generation' && await page.isHidden(r + '.be-fig') && await page.isHidden(r + '.be-pl'), 'breeders: from S');
  await page.fill(r + '.be-h2', '1.5'); await page.waitForTimeout(400);
  check((await t('.be-err')).includes('between 0 and 1') && await page.isHidden(r + '.be-out'), 'breeders: bad h2 message');
  await page.fill(r + '.be-h2', '0.25'); await page.fill(r + '.be-l', '0'); await page.waitForTimeout(400);
  check((await t('.be-err')).includes('generation interval'), 'breeders: bad generation interval message');
  // Heritability from the example pairs.
  check((await t('.be-hbig')) === 'h² = 0.446 ± 0.166 (SE)' && (await t('.be-hfacts')).includes('95 % interval for h²0.096 to 0.796') && (await t('.be-hfacts')).includes('p (slope = 0)0.015'), 'breeders: mid-parent regression');
  await page.selectOption(r + '.be-meth', 'one'); await page.waitForTimeout(100);
  check((await t('.be-hbig')) === 'h² = 0.892 ± 0.333 (SE)', 'breeders: one-parent regression');
  await page.selectOption(r + '.be-meth', 'clone'); await page.waitForTimeout(100);
  check((await t('.be-hbig')) === 'H² = 0.844 (line-mean basis 0.954)' && (await t('.be-htab')).includes('Between groups5108.3866') && (await t('.be-hfacts')).includes('n0 (plants per group)3.83'), 'breeders: lines, variance components');
  await page.selectOption(r + '.be-meth', 'halfsib'); await page.waitForTimeout(100);
  check((await t('.be-hnote')).includes('above 1, which cannot be true'), 'breeders: half-sib warning above 1');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(r + '.be-csv')]); const f = OUT + 'be.csv'; await d.saveAs(f); const x = readFileSync(f, 'utf8'); check(x.includes('groups_are,halfsib') && x.includes('Line 2,4,60.75'), 'breeders: CSV'); }
  await page.selectOption(r + '.be-meth', 'clone'); await page.waitForTimeout(100);
  await page.fill(r + '.be-l', '2'); await page.click(r + '.be-use'); await page.waitForTimeout(200);
  check((await page.inputValue(r + '.be-h2')) === '0.844' && (await t('.be-big')) === 'R = 10.128 per generation', 'breeders: use this h2');
  // A file of pairs through Open a file.
  await page.selectOption(r + '.be-meth', 'mid');
  writeFileSync(OUT + 'po.csv', 'parent,offspring\n10,11\n12,12\n14,13\n16,14\n');
  await page.setInputFiles(r + '.dfb-in', OUT + 'po.csv'); await page.waitForTimeout(500);
  check((await t('.be-hbig')).startsWith('h² = 0.500 ± 0.000'), 'breeders: pairs from a file');
  await page.fill(r + '.be-data', 'a\t1\nb\t2'); await page.selectOption(r + '.be-meth', 'clone'); await page.waitForTimeout(400);
  check((await t('.be-herr')).includes('2 or more plants'), 'breeders: groups of one message');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(r + '.dl [data-f=pdf]')]); check(d.suggestedFilename() === 'breeders-equation.pdf', 'breeders: PDF report'); }
  await page.click(r + '.be-ex'); await page.waitForTimeout(200);
  check((await t('.be-big')) === 'R = 5.616 per generation' && (await t('.be-hbig')).startsWith('h² = 0.446'), 'breeders: example button restores');
};
