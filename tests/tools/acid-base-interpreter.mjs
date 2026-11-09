// #480 acid-base interpreter
export const path = '/science/acid-base-interpreter/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/acid-base-interpreter/`); await page.waitForTimeout(500);
  const R = '.abi';
  const dis = () => page.textContent(`${R} .abi-dis`), steps = () => page.textContent(`${R} .abi-steps`), facts = () => page.textContent(`${R} .abi-facts`);
  const set = async (vals) => { for (const [k, v] of Object.entries(vals)) await page.fill(`${R} .abi-${k}`, String(v)); await page.waitForTimeout(400); };
  check((await page.textContent(`${R} .abi-med`)).includes('not medical advice'), 'abg: medical line at the top');
  check((await dis()) === 'High anion gap metabolic acidosis', 'abg: example interpretation');
  { const f = await facts(); check(f.includes('26.0 mmol/L') && f.includes('28.5 mmol/L') && f.includes('1.65') && f.includes('27.0 to 31.0 mmHg') && f.includes('4.0 mOsm/kg'), 'abg: example gap, corrected gap, delta ratio, Winter range, osmolar gap'); }
  { const s = await steps(); check(s.includes('appropriate respiratory compensation') && s.includes('Lactate explains most') && s.includes('= 293.0 mOsm/kg'), 'abg: example steps'); }
  check(await page.isVisible(`${R} .abi-fig`), 'abg: map drawn');
  await page.selectOption(`${R} .abi-pu`, 'kPa'); await page.waitForTimeout(200);
  check((await page.inputValue(`${R} .abi-pco2`)) === '3.73' && (await dis()) === 'High anion gap metabolic acidosis', 'abg: kPa converts the box');
  await page.selectOption(`${R} .abi-pu`, 'mmHg'); await page.fill(`${R} .abi-pco2`, '28');
  await page.selectOption(`${R} .abi-au`, 'gl'); await page.waitForTimeout(200);
  check((await page.inputValue(`${R} .abi-alb`)) === '30' && (await facts()).includes('28.5 mmol/L'), 'abg: albumin in g/L');
  await page.selectOption(`${R} .abi-gu`, 'mgdl'); await page.selectOption(`${R} .abi-uu`, 'bun'); await page.waitForTimeout(200);
  check((await page.inputValue(`${R} .abi-glu`)) === '108' && (await page.inputValue(`${R} .abi-urea`)) === '19.6' && (await facts()).includes('Osmolar gap'), 'abg: glucose mg/dL and BUN');
  await set({ osm: '330' });
  check((await dis()).includes('Raised osmolar gap') && (await steps()).includes('toxic alcohol'), 'abg: raised osmolar gap');
  await set({ lac: '', glu: '', urea: '', osm: '' });
  check(!(await steps()).includes('Osmolar gap') && !(await steps()).includes('Lactate'), 'abg: optional boxes empty');
  await set({ ph: '7.26', pco2: '60', hco3: '26', cl: '102' }); await page.selectOption(`${R} .abi-au`, 'gdl'); await set({ alb: '4' });
  check((await dis()) === 'Respiratory acidosis, acute', 'abg: acute respiratory acidosis');
  await set({ ph: '7.34', hco3: '31', cl: '97' });
  check((await dis()) === 'Respiratory acidosis, chronic', 'abg: chronic respiratory acidosis');
  await set({ ph: '7.40', pco2: '40', hco3: '24', na: '145', cl: '100' });
  check((await dis()).includes('High anion gap metabolic acidosis') && (await dis()).includes('Metabolic alkalosis'), 'abg: normal gas hiding two disorders');
  await page.locator(`${R} .abi-norm summary`).scrollIntoViewIfNeeded(); await page.click(`${R} .abi-norm summary`);
  await set({ nagh: '25' });
  check((await dis()) === 'No acid-base disorder found', 'abg: editable gap limit');
  await set({ nagh: '16', ph: '7.15', pco2: '50', hco3: '17', na: '140', cl: '105' });
  check((await dis()).includes('Respiratory acidosis') && (await dis()).includes('metabolic acidosis') && (await steps()).includes('Not applicable'), 'abg: mixed acidosis');
  await set({ ph: '7.10' });
  check((await steps()).includes('differ by more than 0.05'), 'abg: inconsistent pH flagged');
  await set({ ph: 'abc' });
  check((await page.textContent(`${R} .abi-err`)).includes('Enter pH') && await page.isHidden(`${R} .abi-out`), 'abg: bad pH message');
  await set({ ph: '7.4', osm: '300' });
  check((await page.textContent(`${R} .abi-err`)).includes('glucose and urea'), 'abg: osmolality needs glucose and urea');
  await set({ osm: '' });
  for (const [f, ext] of [['png', 'png'], ['pdf', 'pdf'], ['docx', 'docx']]) {
    await page.locator(`${R} .dl button[data-f=${f}]`).scrollIntoViewIfNeeded();
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=${f}]`)]);
    const p = OUT + 'abg.' + ext; await d.saveAs(p);
    check(readFileSync(p).length > 2000 && d.suggestedFilename().endsWith('.' + ext), `abg: ${f} download`);
  }
};
