// #479 kidney function
export const path = '/science/kidney-function/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/kidney-function/`); await page.waitForTimeout(500);
  const R = '.kfn';
  const big = () => page.textContent(`${R} .kfn-big`), eg = () => page.textContent(`${R} .kfn-eg`), cg = () => page.textContent(`${R} .kfn-cg`);
  check((await page.textContent(`${R} .kfn-med`)).includes('not medical advice'), 'kidney: medical line at the top');
  check((await big()) === 'eGFR 55 mL/min/1.73 m²' && (await page.textContent(`${R} .kfn-pill`)) === 'G3a: Mildly to moderately decreased', 'kidney: example eGFR and stage');
  { const t = await eg(); check(t.includes('estimate54mL') && t.includes('measured55mL') && t.includes('alone53mL') && t.includes('above 6050mL'), 'kidney: example, all four equations'); }
  { const t = await cg(); check(t.includes('66') && t.includes('49') && t.includes('56') && t.includes('70.5 kg') && t.includes('80.3 kg'), 'kidney: Cockcroft-Gault actual, ideal, adjusted'); }
  check((await page.textContent(`${R} .kfn-notes`)).includes('130 %') && await page.isVisible(`${R} .kfn-fig`), 'kidney: obesity note and chart');
  await page.selectOption(`${R} .kfn-u`, 'umol'); await page.waitForTimeout(200);
  check((await page.inputValue(`${R} .kfn-scr`)) === '124' && (await big()) === 'eGFR 55 mL/min/1.73 m²', 'kidney: switching to µmol/L converts the box');
  await page.fill(`${R} .kfn-cys`, ''); await page.waitForTimeout(400);
  check((await big()) === 'eGFR 54 mL/min/1.73 m²' && !(await eg()).includes('cystatin'), 'kidney: without cystatin C uses CKD-EPI 2021 creatinine');
  await page.selectOption(`${R} .kfn-sex`, 'female'); await page.waitForTimeout(200);
  check((await big()) === 'eGFR 40 mL/min/1.73 m²' && (await page.textContent(`${R} .kfn-pill`)).startsWith('G3b'), 'kidney: female, 124 µmol/L gives G3b');
  await page.selectOption(`${R} .kfn-wu`, 'lb'); await page.selectOption(`${R} .kfn-hu`, 'in'); await page.fill(`${R} .kfn-kg`, '150'); await page.fill(`${R} .kfn-cm`, '64'); await page.waitForTimeout(400);
  { const t = await cg(); check(t.includes('68.0 kg') && t.includes('Devine IBW 54.7 kg'), 'kidney: pounds and inches'); }
  await page.fill(`${R} .kfn-cm`, ''); await page.waitForTimeout(400);
  check(!(await cg()).includes('ideal'), 'kidney: no height, only actual weight');
  await page.fill(`${R} .kfn-kg`, ''); await page.waitForTimeout(400);
  check(await page.isHidden(`${R} .kfn-cgc`), 'kidney: no weight, no Cockcroft-Gault');
  await page.fill(`${R} .kfn-age`, '15'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .kfn-err`)).includes('for adults') && await page.isHidden(`${R} .kfn-out`), 'kidney: child age refused');
  await page.fill(`${R} .kfn-age`, '60'); await page.fill(`${R} .kfn-scr`, '1.2'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .kfn-err`)).includes('Check the unit'), 'kidney: creatinine in the wrong unit');
  await page.fill(`${R} .kfn-scr`, 'x'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .kfn-err`)).includes('as a number'), 'kidney: bad creatinine');
  await page.selectOption(`${R} .kfn-u`, 'mgdl'); await page.fill(`${R} .kfn-scr`, '1.0'); await page.selectOption(`${R} .kfn-sex`, 'male'); await page.waitForTimeout(400);
  check((await big()) === 'eGFR 86 mL/min/1.73 m²' && (await page.textContent(`${R} .kfn-pill`)).startsWith('G2'), 'kidney: man 60, 1.0 mg/dL gives 86 (G2)');
  for (const [f, ext] of [['png', 'png'], ['pdf', 'pdf'], ['docx', 'docx']]) {
    await page.locator(`${R} .dl button[data-f=${f}]`).scrollIntoViewIfNeeded();
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=${f}]`)]);
    const p = OUT + 'kidney.' + ext; await d.saveAs(p);
    check(readFileSync(p).length > 2000 && d.suggestedFilename().endsWith('.' + ext), `kidney: ${f} download`);
  }
};
