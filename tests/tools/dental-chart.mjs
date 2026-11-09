// #499 dental chart
export const path = '/science/dental-chart/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/dental-chart/`); await page.waitForTimeout(600);
  const facts = () => page.textContent('.dc .dc-facts'), tab = () => page.textContent('.dc .dc-tab');
  const tap = async (f, s) => { const loc = page.locator(`.dc .dc-wrap polygon[data-f="${f}"]${s ? `[data-s="${s}"]` : ''}`).first(); await loc.scrollIntoViewIfNeeded(); await loc.click(); await page.waitForTimeout(80); };
  const pen = async (p) => { await page.locator(`.dc .dc-pens [data-pen=${p}]`).scrollIntoViewIfNeeded(); await page.click(`.dc .dc-pens [data-pen=${p}]`); };
  check((await page.textContent('.dc .dc-warn')).includes('not medical advice') && (await page.textContent('.dc .dc-warn')).includes('Nothing is stored'), 'dental: medical and nothing-stored note');
  { const f = await facts(); check(f.startsWith('DMFT6') && f.includes('D (decayed)1') && f.includes('M (missing)2') && f.includes('F (filled)3') && f.includes('Findings7'), `dental: example DMFT 6 (${f.slice(0, 60)})`); }
  { const t = await tab(); check(t.includes('Upper left first premolarFilledMOD') && t.includes('Upper right first molarCariesMO') && t.includes('Sensitive to cold') && t.includes('Lower right first molarImplant'), 'dental: example findings'); }
  check((await page.$$('.dc .dc-wrap polygon[data-s]')).length === 160, 'dental: 32 teeth × 5 surfaces');
  { const c = await page.textContent('.dc .dc-conv'); check(c.includes('Upper right first molar') && c.includes('Upper right central incisor') && c.includes('Lower left second molar (primary)') && c.includes('LLE') && c.includes('URE'), 'dental: converter example'); }
  await tap(17, 'O');
  check((await tab()).includes('Upper right second molarCariesO') && (await page.textContent('.dc .dc-sel-t')).includes('FDI 17 · Universal 2 · Palmer 7┘'), 'dental: caries on a surface, tooth selected');
  await pen('filled'); await tap(17, 'B');
  check((await tab()).includes('Upper right second molarFilledB'), 'dental: filled surface');
  await tap(17, 'B');
  check(!(await tab()).includes('Upper right second molarFilled'), 'dental: tap again removes it');
  await tap(31, 'L');
  check((await tab()).includes('Lower left central incisorFilledL'), 'dental: lingual on a lower incisor');
  await pen('crown'); await tap(26, 'O');
  check((await tab()).includes('Upper left first molarCrown') && (await facts()).includes('F (filled)4'), 'dental: crown');
  await pen('missing'); await tap(17, 'M');
  check((await tab()).includes('Upper right second molarMissing') && !(await tab()).includes('Upper right second molarCaries'), 'dental: missing clears surfaces');
  await pen('implant'); await tap(47, 'O');
  check((await tab()).includes('Lower right second molarImplant'), 'dental: implant');
  await pen('note'); await tap(13, 'O'); await page.fill('.dc .dc-note', 'Wear facet');
  check((await tab()).includes('Upper right canineNoteWear facet'), 'dental: note');
  await pen('clear'); await tap(16, 'O');
  check(!(await tab()).includes('Upper right first molarCaries'), 'dental: clear tooth');
  await page.selectOption('.dc .dc-sys', 'universal'); await page.waitForTimeout(150);
  check((await page.textContent('.dc .dc-wrap svg')).includes('32') && (await page.textContent('.dc .dc-tab')).includes('Tooth (Universal)'), 'dental: Universal labels');
  await page.selectOption('.dc .dc-sys', 'palmer'); await page.waitForTimeout(150);
  check((await page.textContent('.dc .dc-wrap svg')).includes('8┘') && (await tab()).includes('UL6'), 'dental: Palmer labels');
  await page.locator('.dc .dc-csv').scrollIntoViewIfNeeded();
  const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dc .dc-csv')]); const file = OUT + 'dental.csv'; await d.saveAs(file);
  const csvText = readFileSync(file, 'utf8'); const rows = csvText.trim().split('\n');
  check(rows[0] === 'fdi,universal,palmer,tooth,condition,surfaces,note' && csvText.includes('24,12,UL4,Upper left first premolar,Filled,MOD,') && csvText.includes('13,6,UR3,Upper right canine,Note,,Wear facet'), 'dental: CSV');
  { const [p] = await Promise.all([page.waitForEvent('download'), page.click('.dc .dl [data-f=png]')]); const f = OUT + 'dental.png'; await p.saveAs(f); check(readFileSync(f).length > 10000, 'dental: PNG'); }
  { const [p] = await Promise.all([page.waitForEvent('download'), page.click('.dc .dl [data-f=pdf]')]); const f = OUT + 'dental.pdf'; await p.saveAs(f); check(readFileSync(f).slice(0, 4).toString() === '%PDF', 'dental: PDF'); }
  await page.click('.dc .dc-clear');
  check((await page.textContent('.dc .dc-clear')) === 'Press again to clear', 'dental: clear asks twice');
  await page.click('.dc .dc-clear'); await page.waitForTimeout(100);
  check(await page.isVisible('.dc .dc-none') && (await facts()).startsWith('DMFT0'), 'dental: chart cleared');
  await page.setInputFiles('.dc .dc-file', file); await page.waitForTimeout(400);
  check((await tab()).includes('Wear facet') && (await tab()).includes('MOD'), 'dental: saved CSV opens again');
  writeFileSync(OUT + 'bad-dental.csv', 'fdi,condition\n19,missing\n');
  await page.setInputFiles('.dc .dc-file', OUT + 'bad-dental.csv'); await page.waitForTimeout(300);
  check((await page.textContent('.dc .dc-err')).includes('not an FDI tooth'), 'dental: bad CSV message');
  writeFileSync(OUT + 'prim-dental.csv', 'fdi,condition,surfaces\n54,caries,O\n75,missing,\n');
  await page.setInputFiles('.dc .dc-file', OUT + 'prim-dental.csv'); await page.waitForTimeout(300);
  check((await page.inputValue('.dc .dc-dent')) === 'prim' && (await facts()).startsWith('dmft2') && (await page.$$('.dc .dc-wrap polygon[data-s]')).length === 100, 'dental: primary chart from a file');
  await page.selectOption('.dc .dc-from', 'fdi'); await page.fill('.dc .dc-in', '18, 48, 85, 19'); await page.waitForTimeout(150);
  { const c = await page.textContent('.dc .dc-conv'); check(c.includes('Lower right third molar') && c.includes('Lower right second molar (primary)') && (await page.textContent('.dc .dc-cerr')).includes('"19" is not an FDI tooth'), 'dental: FDI converter and bad number'); }
  await page.selectOption('.dc .dc-from', 'palmer'); await page.fill('.dc .dc-in', 'UR6, ┌E, ll3'); await page.waitForTimeout(150);
  { const c = await page.textContent('.dc .dc-conv'); check(c.includes('16') && c.includes('75') && c.includes('Lower left canine'), 'dental: Palmer converter'); }
  check((await page.$$('.dc .dc-all tbody tr')).length === 52, 'dental: all-teeth table');
};
