// #388 crossing plan and pedigree tracker
export const path = '/science/crossing-plan/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/crossing-plan/`); await page.waitForTimeout(600);
  const r = '.cpl ';
  check((await page.textContent(r + '.cp-big')) === '13 plants, 4 founders, 4 generations', 'pedigree: example on load');
  { const t = await page.textContent(r + '.cp-tab'); check(t.includes('F2aF1aF1a20.5') && t.includes('S2F2aF2a30.75') && t.includes('X1F1aF1c20.25') && t.includes('X2F1aF1b20.125') && t.includes('BC1F1aP120.25'), 'pedigree: inbreeding table'); }
  { const t = await page.textContent(r + '.cp-pt'); check(t.indexOf('P4 × P3') < t.indexOf('S2 × X3') && t.includes('S2 × X30.15625') && t.includes('BC1 × F2a0.375close relatives') && t.includes('unrelated'), 'pedigree: plan sorted with coancestries'); }
  check((await page.textContent(r + '.cp-ab')).startsWith('Coancestry of S2 and X3: 0.15625'), 'pedigree: pair picker default');
  await page.selectOption(r + '.cp-a', 'F1a'); await page.selectOption(r + '.cp-b', 'F1c'); await page.waitForTimeout(100);
  check((await page.textContent(r + '.cp-ab')).includes('Coancestry of F1a and F1c: 0.25 (close relatives)') && (await page.textContent(r + '.cp-ab')).includes('relationship is 0.5'), 'pedigree: full sibs');
  await page.selectOption(r + '.cp-a', 'S2'); await page.selectOption(r + '.cp-b', 'S2'); await page.waitForTimeout(100);
  check((await page.textContent(r + '.cp-ab')).includes('0.875 (self-pollination)'), 'pedigree: self');
  check(await page.isVisible(r + '.cp-fig') && (await page.textContent(r + '.cp-dnote')).includes('orange edge'), 'pedigree: drawing of all plants');
  await page.selectOption(r + '.cp-draw', 'S2'); await page.waitForTimeout(100);
  check((await page.textContent(r + '.cp-dnote')).startsWith('S2 and its 4 ancestors'), 'pedigree: drawing of one plant');
  for (const [b, name, test] of [['.cp-pcsv', 'plan', (t) => t.startsWith('cross,female,male,coancestry_F_of_offspring,note\nX1 × X2,X1,X2,0.25,')], ['.cp-csv', 'inb', (t) => t.includes('S2,F2a,F2a,3,0.75') && t.trim().split('\n').length === 14], ['.cp-mcsv', 'mat', (t) => t.split('\n')[0].startsWith(',P1,P2,') && t.trim().split('\n').length === 14]]) {
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(r + b)]); const f = OUT + `cp-${name}.csv`; await d.saveAs(f); check(test(readFileSync(f, 'utf8')), `pedigree: ${name} CSV`);
  }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(r + '.dl [data-f=png]')]); check(d.suggestedFilename() === 'crossing-plan.png', 'pedigree: image report'); }
  // A CSV file with inbred founders and the sex check.
  writeFileSync(OUT + 'ped.csv', 'plant,female,male,F\nL1,-,-,1\nL2,-,-,1\nH,L1,L2\nB,H,L1\nC,L2,H\n');
  await page.setInputFiles(r + '.dfb-in', OUT + 'ped.csv'); await page.waitForTimeout(600);
  await page.fill(r + '.cp-plan', 'B\tC\tmy cross'); await page.check(r + '.cp-sex'); await page.waitForTimeout(600);
  { const t = await page.textContent(r + '.cp-tab'); const w = await page.textContent(r + '.cp-warn');
    check(t.includes('HL1L210') && t.includes('BHL120.5') && (await page.textContent(r + '.cp-pt')).includes('my cross: B × C0.375') && w.includes('both a female and a male parent: L1, H, L2'), `pedigree: inbred founders from a file, sex check (${w})`); }
  // Errors.
  await page.fill(r + '.cp-ped', 'A,B,C\nB,A,D'); await page.waitForTimeout(600);
  check((await page.textContent(r + '.cp-err')).includes('loop') && await page.isHidden(r + '.cp-out'), 'pedigree: loop message');
  await page.fill(r + '.cp-ped', 'A,B,C\nA,B,D'); await page.waitForTimeout(600);
  check((await page.textContent(r + '.cp-err')).includes('listed twice with different parents'), 'pedigree: duplicate message');
  await page.fill(r + '.cp-ped', 'A,B,C'); await page.fill(r + '.cp-plan', 'A,Z'); await page.waitForTimeout(600);
  check((await page.textContent(r + '.cp-err')).includes('Z is not in the pedigree'), 'pedigree: unknown plant in plan');
  await page.fill(r + '.cp-plan', ''); await page.waitForTimeout(600);
  check(await page.isHidden(r + '.cp-planbox') && (await page.textContent(r + '.cp-warn')).includes('added as founders'), 'pedigree: no plan, parents added');
  await page.click(r + '.cp-ex'); await page.waitForTimeout(200);
  check((await page.textContent(r + '.cp-big')) === '13 plants, 4 founders, 4 generations', 'pedigree: example button restores');
};
