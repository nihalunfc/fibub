// #836 degree of unsaturation
export const path = '/science/unsaturation-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.dbec';
  await page.goto(`${BASE}/science/unsaturation-calculator/`); await page.waitForTimeout(400);
  const big = () => page.textContent(`${R} .dbe-big`), facts = () => page.textContent(`${R} .dbe-facts`), st = () => page.textContent(`${R} .dbe-status`), notes = () => page.textContent(`${R} .dbe-notes`);
  check((await big()) === 'Rings + double bonds: 6', 'dbe: caffeine 6');
  { const f = await facts(); check(f.includes('C₈H₁₀N₄O₂') && f.includes('74 (even)') && f.includes('194.08038 u') && f.includes('Nominal mass194') && f.includes('194.194 g/mol'), `dbe: caffeine facts (${f})`); }
  check((await st()).includes('Valid formula: even number of electrons') && (await st()).includes('Nitrogen rule: nominal mass even'), 'dbe: status');
  check((await page.locator(`${R} .dbe-tab tbody tr`).count()) === 16, 'dbe: 16 combinations');
  check((await page.textContent(`${R} .dbe-tab tbody`)).includes('a benzene ring + 1 other ring + 1 C=C or C=O'), 'dbe: combination reading');
  // Bad formulas
  await page.fill(`${R} .dbe-in`, 'C6H5'); await page.waitForTimeout(60);
  check((await big()) === 'Rings + double bonds: 4.5' && (await st()).includes('Not a stable neutral molecule') && (await notes()).includes('odd number of electrons') && (await page.isHidden(`${R} .dbe-combo-card`)), 'dbe: radical');
  await page.fill(`${R} .dbe-in`, 'FeCl3'); await page.waitForTimeout(60);
  check((await page.textContent(`${R} .dbe-err`)).includes('Fe is not covered') && (await page.isHidden(`${R} .dbe-out`)), 'dbe: unsupported element');
  await page.fill(`${R} .dbe-in`, 'C6H1O'); await page.waitForTimeout(60);
  check(!(await page.isHidden(`${R} .dbe-out`)), 'dbe: recovers');
  await page.fill(`${R} .dbe-in`, 'Cx'); await page.waitForTimeout(60);
  check((await page.textContent(`${R} .dbe-err`)).length > 5, 'dbe: formula parse error');
  // Example: pyridinium ion
  await page.click(`${R} .dbe-ex button:has-text("Pyridinium ion")`); await page.waitForTimeout(60);
  { const f = await facts(); check((await big()) === 'Rings + double bonds: 3.5' && f.includes('If the charge is on N, O, S or P4 rings + π bonds') && f.includes('If the charge is on carbon3 rings + π bonds') && (await notes()).includes('even-electron ion of charge +1: the nominal mass is even (80)'), 'dbe: pyridinium'); }
  check((await page.textContent(`${R} .dbe-chelp`)).includes('assumes the charge sits on a heteroatom'), 'dbe: ion combinations');
  // Sulfur valence
  await page.fill(`${R} .dbe-in`, 'C2H6SO2'); await page.waitForTimeout(60);
  check((await big()) === 'Rings + double bonds: 0', 'dbe: sulfone with S as 2');
  await page.selectOption(`${R} .dbe-S`, '6'); await page.waitForTimeout(60);
  check((await big()) === 'Rings + double bonds: 2' && (await notes()).includes('Counted with S as 6 bonds'), 'dbe: sulfone with S as 6');
  await page.selectOption(`${R} .dbe-S`, '2');
  await page.fill(`${R} .dbe-in`, 'H3PO4'); await page.selectOption(`${R} .dbe-P`, '5'); await page.waitForTimeout(60);
  check((await big()) === 'Rings + double bonds: 1', 'dbe: phosphate with P as 5');
  await page.selectOption(`${R} .dbe-P`, '3');
  // SMILES mode
  await page.click(`${R} .dbe-mode [data-m="smiles"]`); await page.waitForTimeout(60);
  check((await page.inputValue(`${R} .dbe-in`)) === 'Cn1cnc2c1c(=O)n(C)c(=O)n2C' && (await page.textContent(`${R} .dbe-lab`)) === 'SMILES string', 'dbe: SMILES mode');
  { const f = await facts(); check(f.includes('Rings (from the SMILES)2') && f.includes('π bonds (value − rings)4') && f.includes('2 double, 0 triple, 10 aromatic') && f.includes('24 (14 not hydrogen)'), `dbe: caffeine SMILES (${f})`); }
  check((await page.locator(`${R} .dbe-tab tr.best`).count()) >= 1, 'dbe: SMILES ring count highlighted');
  await page.click(`${R} .dbe-ex button:has-text("Aspirin")`); await page.waitForTimeout(60);
  check((await big()) === 'Rings + double bonds: 6' && (await facts()).includes('C₉H₈O₄'), 'dbe: aspirin SMILES');
  await page.fill(`${R} .dbe-in`, 'C1CC'); await page.waitForTimeout(60);
  check((await page.textContent(`${R} .dbe-err`)) === 'Ring number 1 is opened but never closed.', 'dbe: SMILES ring error');
  await page.fill(`${R} .dbe-in`, 'CH4'); await page.waitForTimeout(60);
  check((await page.textContent(`${R} .dbe-err`)).includes('SMILES adds hydrogens by itself'), 'dbe: SMILES H error');
  await page.fill(`${R} .dbe-in`, '[Na+].[Cl-]'); await page.waitForTimeout(60);
  check((await facts()).includes('Separate parts2') && (await notes()).includes('2 separate parts'), 'dbe: two parts');
  await page.fill(`${R} .dbe-in`, 'c1ccccc1'); await page.waitForTimeout(60);
  // Downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dbe-csv`)]); const f = OUT + 'dbe.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    check(t.startsWith('rings,double_bonds,triple_bonds,rings_plus_pi\n') && t.includes('\n1,3,0,4\n'), 'dbe: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dbe-out [data-f="pdf"]`)]); const f = OUT + 'dbe.pdf'; await d.saveAs(f); check(d.suggestedFilename() === 'unsaturation.pdf' && readFileSync(f).subarray(0, 5).toString() === '%PDF-', 'dbe: PDF report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dbe-out [data-f="docx"]`)]); check(d.suggestedFilename() === 'unsaturation.docx', 'dbe: Word report'); }
  // Back to formula keeps what was typed there
  await page.click(`${R} .dbe-mode [data-m="formula"]`); await page.waitForTimeout(60);
  check((await page.inputValue(`${R} .dbe-in`)) === 'H3PO4', 'dbe: formula box remembered');
};
