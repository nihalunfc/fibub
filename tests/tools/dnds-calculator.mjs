// #311 dN/dS calculator
export const path = '/science/dnds-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/dnds-calculator/`); await page.waitForTimeout(900);
  const t = (s) => page.textContent(`.dnds ${s}`);
  check((await t('.dd-big')) === 'dN/dS = 0.082' && (await t('.dd-say')).includes('purifying'), 'dnds: example dN/dS = Biopython');
  { const f = await t('.dd-facts'); check(f.includes('Codons compared60') && f.includes('45.33') && f.includes('134.67') && f.includes('Sd)14.5') && f.includes('Nd)4.5'), 'dnds: sites and differences = Biopython'); }
  { const f = await t('.dd-facts'); check(f.includes('0.4170 ± 0.1208') && f.includes('0.0342 ± 0.0162') && f.includes('Z = -3.14') && f.includes('p = 0.002'), 'dnds: dS, dN with SE and Z test'); }
  { const tab = await t('.dd-tab'); check(tab.includes('ACA') && tab.includes('AGC') && tab.includes('T → S') && tab.includes('R (same)'), 'dnds: codon table'); }
  check(await page.isVisible('.dnds .dd-fig') && (await t('.dd-tnote')).startsWith('17 codons differ'), 'dnds: chart and 17 differing codons');
  await page.selectOption('.dnds .dd-cor', 'none'); await page.waitForTimeout(400);
  check((await t('.dd-big')) === 'pN/pS = 0.104' && !(await t('.dd-facts')).includes('Jukes'), 'dnds: no correction (pN/pS)');
  await page.selectOption('.dnds .dd-cor', 'jc'); await page.waitForTimeout(300);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dnds .dd-csv')]); const f = OUT + 'dnds.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); const tot = r.slice(1).map((x) => x.split(',')).reduce((s, x) => [s[0] + +x[5], s[1] + +x[6]], [0, 0]); check(r.length === 18 && r[0].startsWith('codon,codon_1') && tot[0] === 14.5 && tot[1] === 4.5, 'dnds: codon CSV adds up to Sd and Nd'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dnds .dl [data-f="pdf"]')]); const f = OUT + 'dnds.pdf'; await d.saveAs(f); check(readFileSync(f).slice(0, 4).toString() === '%PDF', 'dnds: PDF report'); }
  writeFileSync(OUT + 'dnds.fa', '>a\nATGAAACCCGGGTTTAAA\n>b\nATGAAGCCCGGGTTTAGA\n');
  await page.setInputFiles('.dnds .dd-file', OUT + 'dnds.fa'); await page.waitForTimeout(600);
  check(/^dN\/dS = \d/.test(await t('.dd-big')) && (await t('.dd-warn')).includes('Fewer than 50') && (await t('.dd-tnote')).startsWith('2 codons differ'), 'dnds: file opened, short gene warning');
  await page.fill('.dnds .dd-in', '>a\nATGAAACCCGGGTTTAAA\n>b\nATGAAGCCAGGCTTCAAA'); await page.waitForTimeout(400);
  check((await t('.dd-err')).includes('Jukes-Cantor correction is not defined'), 'dnds: saturated message');
  await page.fill('.dnds .dd-in', '>a\nATGAAACCC\n>b\nATGAGACCC'); await page.waitForTimeout(400);
  check((await t('.dd-big')).includes('cannot be worked out') && (await t('.dd-say')).includes('no synonymous differences'), 'dnds: no synonymous differences');
  await page.fill('.dnds .dd-in', '>a\nATGAAACC\n>b\nATGAAACC'); await page.waitForTimeout(400);
  check((await t('.dd-err')).includes('not a multiple of 3'), 'dnds: length not a multiple of 3');
  await page.fill('.dnds .dd-in', '>a\nATGTAAAAA\n>b\nATGAAAAAA'); await page.waitForTimeout(400);
  check((await t('.dd-err')).includes('stop codon inside'), 'dnds: internal stop message');
  await page.fill('.dnds .dd-in', '>a\nATGA-AAAA\n>b\nATGAAAAAA'); await page.waitForTimeout(400);
  check((await t('.dd-err')).includes('breaks a codon'), 'dnds: frame-breaking gap message');
  await page.fill('.dnds .dd-in', '>a\nATGAAA\n>b\nATGAAAAAA'); await page.waitForTimeout(400);
  check((await t('.dd-err')).includes('not aligned'), 'dnds: unaligned message');
  await page.fill('.dnds .dd-in', '>a\nMKLVEP\n>b\nMKLVEP'); await page.waitForTimeout(400);
  check((await t('.dd-err')).includes('not protein'), 'dnds: protein message');
  await page.fill('.dnds .dd-in', '>a\nATG'); await page.waitForTimeout(400);
  check((await t('.dd-err')).includes('two coding sequences'), 'dnds: one sequence message');
};
