// #212 Drug-likeness checker (Lipinski and Veber)
export const path = '/science/smiles-checker/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/smiles-checker/`); await page.waitForTimeout(500);
  check(await page.isHidden('.smc .smc-out'), 'smiles: nothing shown before a molecule');
  await page.click('.smc .smc-ex'); await page.waitForTimeout(150);
  check((await page.textContent('.smc .smc-head')) === 'Aspirin: C₉H₈O₄, 180.16 g/mol', 'smiles: aspirin heading');
  { const f = await page.textContent('.smc .smc-facts'); check(f.includes('Average mass180.159') && f.includes('Monoisotopic mass180.0423') && f.includes('Heavy atoms1321 with hydrogens') && f.includes('Rings1') && f.includes('H-bond donors1') && f.includes('H-bond acceptors4') && f.includes('Rotatable bonds3') && f.includes('Formal charge0'), 'smiles: aspirin properties'); }
  check((await page.textContent('.smc .smc-verdict')) === 'Lipinski pass: 0 of 3 brokenVeber pass: 0 of 2 broken', 'smiles: aspirin passes both');
  check((await page.textContent('.smc .smc-rules')).includes('logP ≤ 5 (your value)not givennot checked'), 'smiles: logP not checked until given');
  // Options
  await page.click('.smc .smc-opts summary');
  await page.fill('.smc .smc-logp', '6.2'); await page.waitForTimeout(400);
  check((await page.textContent('.smc .smc-verdict')).startsWith('Lipinski pass: 1 of 4 broken'), 'smiles: own logP joins the rules');
  await page.fill('.smc .smc-logp', ''); await page.fill('.smc .smc-tpsa', '150'); await page.waitForTimeout(400);
  check((await page.textContent('.smc .smc-verdict')).endsWith('Veber fail: 1 of 2 broken') && (await page.textContent('.smc .smc-rules')).includes('Polar surface area ≤ 140 Å² (your value)150 Å²no'), 'smiles: own polar surface area replaces the H-bond total');
  await page.fill('.smc .smc-tpsa', ''); await page.waitForTimeout(400);
  await page.fill('.smc .smc-in', 'CC(=O)Nc1ccc(O)cc1'); await page.fill('.smc .smc-name', 'Paracetamol'); await page.waitForTimeout(400);
  check((await page.textContent('.smc .smc-facts')).includes('Rotatable bonds1'), 'smiles: amide C–N not rotatable');
  await page.check('.smc .smc-amide'); await page.waitForTimeout(100);
  check((await page.textContent('.smc .smc-facts')).includes('Rotatable bonds2'), 'smiles: amide C–N counted when ticked');
  await page.uncheck('.smc .smc-amide');
  await page.fill('.smc .smc-in', '[Na+].[O-]C(=O)c1ccccc1O'); await page.fill('.smc .smc-name', ''); await page.waitForTimeout(400);
  check((await page.textContent('.smc .smc-head')).startsWith('C₇H₅O₃⁻') && (await page.textContent('.smc .smc-note')).includes('Left out (smaller parts after a dot): Na+') && (await page.textContent('.smc .smc-facts')).includes('Formal charge-1'), 'smiles: salt, largest part only');
  await page.uncheck('.smc .smc-big'); await page.waitForTimeout(100);
  check((await page.textContent('.smc .smc-head')).startsWith('C₇H₅NaO₃') && (await page.textContent('.smc .smc-note')).includes('2 parts, all counted'), 'smiles: salt, every part counted');
  await page.check('.smc .smc-big');
  // Bad input
  await page.fill('.smc .smc-in', 'C1CC'); await page.waitForTimeout(400);
  check((await page.textContent('.smc .smc-err')).includes('Ring number 1 is opened but never closed') && await page.isHidden('.smc .smc-out'), 'smiles: unclosed ring message');
  await page.fill('.smc .smc-in', 'CH4'); await page.waitForTimeout(400);
  check((await page.textContent('.smc .smc-err')).includes('hydrogens by itself'), 'smiles: bare H message');
  await page.fill('.smc .smc-in', 'CC(=O)Oc1ccccc1C(=O)O'); await page.fill('.smc .smc-name', 'Aspirin'); await page.waitForTimeout(400);
  check(await page.isHidden('.smc .smc-err') && await page.isVisible('.smc .smc-out'), 'smiles: error clears');
  // Report download
  { await page.locator('.smc .dl [data-f="pdf"]').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.smc .dl [data-f="pdf"]')]); const f = OUT + 'smiles.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 5).toString() === '%PDF-' && d.suggestedFilename() === 'Aspirin.pdf', 'smiles: PDF report'); }
  // Batch
  check(await page.isDisabled('.smc .smc-csv'), 'smiles: CSV button off before a list');
  await page.click('.smc .smc-bex'); await page.waitForTimeout(200);
  check((await page.textContent('.smc .smc-bsum')) === '7 molecules: 6 pass Lipinski, 6 pass Veber, 6 pass both.', 'smiles: example list summary');
  { const t = await page.textContent('.smc .smc-btab'); check(t.includes('Made-up peptide GSDKYC₂₄H₃₆N₆O₁₀568.581216181fail (3)fail (2)') && t.includes('Sodium salicylateC₇H₅O₃⁻'), 'smiles: example list table'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.smc .smc-csv')]); const f = OUT + 'smiles.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 8 && rows[0].startsWith('name,smiles,formula,mw,monoisotopic_mass') && rows[1].startsWith('Aspirin,CC(=O)Oc1ccccc1C(=O)O,C9H8O4,180.159,180.0423') && rows[6].endsWith(',Na+,'), 'smiles: batch CSV'); }
  await page.fill('.smc .smc-batch', 'CCO Ethanol\nC1CC broken one\nc1ccccc1'); await page.waitForTimeout(400);
  { const s = await page.textContent('.smc .smc-bsum'), t = await page.textContent('.smc .smc-btab'); check(s === '3 molecules: 2 pass Lipinski, 2 pass Veber, 2 pass both. 1 could not be read.' && t.includes('Line 2: Ring number 1') && t.includes('Molecule 3'), 'smiles: typed list with a bad line'); }
  writeFileSync(OUT + 'list.smi', 'smiles name\nOCC Ethanol\nCCCCCCCCCCCCCCCCCC(=O)O Stearic acid\n');
  await page.setInputFiles('.smc .smc-file', OUT + 'list.smi'); await page.waitForTimeout(400);
  check((await page.textContent('.smc .smc-bsum')) === '2 molecules: 2 pass Lipinski, 1 pass Veber, 1 pass both.', 'smiles: .smi file opened (stearic acid has 16 rotatable bonds)');
  await page.fill('.smc .smc-batch', ''); await page.waitForTimeout(400);
  check(await page.isDisabled('.smc .smc-csv'), 'smiles: emptied list');
};
