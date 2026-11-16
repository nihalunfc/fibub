// #1130 Oxygen dissociation curve
export const path = '/learn/oxygen-dissociation/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.odc ';
  await page.goto(`${BASE}/learn/oxygen-dissociation/`); await page.waitForTimeout(600);
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(250); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(250); };
  const big = () => page.textContent(R + '.odc-big'), facts = () => page.textContent(R + '.odc-facts');
  check((await big()) === '75 % saturated at 40 mmHg' && (await page.textContent(R + '.odc-pv')).includes('resting tissues'), `o2: example (${await big()})`);
  { const f = await facts(); check(f.includes('26.9 mmHg') && f.includes('97.7 %') && f.includes('22.8 % of the load') && f.includes('4.8 mL per 100 mL'), `o2: facts (${f})`); }
  check((await page.textContent(R + '.odc-formula')).includes('1.34 × 15 × 0.749 + 0.003 × 40 = 15.2 mL'), 'o2: content formula');
  check((await page.getAttribute(R + '.odc-hb', 'aria-label')) === 'Haemoglobin: 3 of 4 sites carrying oxygen', 'o2: haemoglobin picture');
  await tap('.odc-pre[data-p=exercise]');
  { const f = await facts(); check(f.includes('37.0 mmHg') && f.includes('42.5 % of the load') && (await page.textContent(R + '.odc-say')).includes('moved right by 10.1 mmHg'), `o2: working muscle (${f})`); }
  await tap('.odc-pre[data-p=cold]');
  check((await page.textContent(R + '.odc-say')).includes('moved left'), 'o2: cold shifts left');
  await tap('.odc-pre[data-p=normal]');
  await page.check(R + '.odc-fetal'); await page.waitForTimeout(250);
  check((await page.textContent(R + '.odc-say')).includes("baby's blood") && (await facts()).includes('19.0 mmHg'), 'o2: fetal haemoglobin');
  await page.uncheck(R + '.odc-fetal'); await page.waitForTimeout(200);
  await slide('.odc-po2', 100);
  check((await big()) === '98 % saturated at 100 mmHg' && (await page.textContent(R + '.odc-pv')).includes('lungs'), 'o2: lungs');
  // lungs
  { const f = await page.textContent(R + '.odc-lfacts'); check(f.includes('4300 mL') && f.includes('5450 mL') && f.includes('2200 mL') && f.includes('6.0 L'), `lungs: capacities (${f})`); }
  check((await page.textContent(R + '.odc-lformula')) === 'VC = ERV + TV + IRV = 1050 + 500 + 2750 = 4300 mL; TLC = VC + RV = 4300 + 1150 = 5450 mL', 'lungs: formula');
  await page.fill(R + '.odc-tvol', '600'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.odc-lfacts')).includes('4400 mL') && (await page.textContent(R + '.odc-lfacts')).includes('7.2 L'), 'lungs: bigger breath');
  await page.fill(R + '.odc-rate', '2'); await page.waitForTimeout(200);
  check(await page.isVisible(R + '.odc-err'), 'lungs: bad rate message');
  await page.fill(R + '.odc-rate', '12'); await page.waitForTimeout(200);
  check(await page.isHidden(R + '.odc-err'), 'lungs: message clears');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'o2.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'o2: image report'); }
  await tap('.odc-check');
  check((await page.textContent(R + '.odc-score')) === '0 of 4 right.', 'o2: quiz blanks wrong');
  await page.$$eval(R + '.odc-qs li', (lis) => lis.forEach((li) => { li.querySelector('.odc-ans').value = li.dataset.a; }));
  await tap('.odc-check');
  check((await page.textContent(R + '.odc-score')) === '4 of 4 right.', 'o2: quiz answers');

  // ---- Solve my numbers (phys-e.ts) ----
  const PS = '.ps-host ';
  const psAns = () => page.textContent(PS + '.ps-ans'), psWork = () => page.textContent(PS + '.ps-work');
  const psSolve = async (prob, vals, units = {}) => {
    await page.selectOption(PS + '[data-k="prob"]', prob);
    await page.$$eval(PS + `label[data-p="${prob}"] select`, (ss, u) => ss.forEach((s) => { const k = s.dataset.k; const want = u[k]; s.value = want ?? s.options[0].value; }), Object.fromEntries(Object.entries(units).map(([k, v]) => [`${prob}-${k}-u`, v])));
    for (const [k, v] of Object.entries(vals)) await page.fill(PS + `[data-k="${prob}-${k}"]`, v);
    await page.waitForTimeout(80);
  };
  const psCase = async (name, prob, vals, ans, work, units) => {
    await psSolve(prob, vals, units);
    const a = await psAns(), w = await psWork();
    check(a === ans && (!work || w.includes(work)) && !/NaN|Infinity/.test(a + w), `solve ${name}: ${a}${work && !w.includes(work) ? ' / working: ' + w : ''}`);
  };
  check((await page.getAttribute(PS + '.ps-out', 'aria-live')) === 'polite', 'solve: answer is a polite live region');

  await psCase('oxygen content', 'content', { hb: '15', sat: '97.5', po2: '100' }, 'The blood carries 19.9 mL of oxygen per 100 mL.', 'Bound to haemoglobin = 1.34 × 15 × 0.975 = 19.6 mL per 100 mL');
  await psCase('content with g/L', 'content', { hb: '150', sat: '97.5', po2: '100' }, 'The blood carries 19.9 mL of oxygen per 100 mL.', 'Convert to base units', { hb: 'g/L' });
  await psCase('saturation at 40 mmHg', 'sat', { po2: '40' }, 'Haemoglobin is about 74.9 % saturated.', null);
  await psCase('saturation in kPa', 'sat', { po2: '5.3329' }, 'Haemoglobin is about 74.9 % saturated.', 'Convert to base units', { po2: 'kPa' });
  await psCase('oxygen unloaded', 'unload', { hb: '15', sa: '97', sv: '75' }, 'Each 100 mL of blood gives up 4.42 mL of oxygen, which is 22.7 % of the oxygen it carried.', 'Saturation drop = 97 − 75 = 22 %');
  await psCase('swapped saturations', 'unload', { hb: '15', sa: '70', sv: '90' }, 'The blood coming back cannot hold more oxygen than the blood that left the lungs. Swap the two saturations.', null);
  await psCase('oxygen delivery', 'deliv', { co: '5', hb: '15', sat: '97.5', po2: '100' }, 'About 995 mL of oxygen is delivered each minute.', 'content × 10 = 5 L/min × 19.9 × 10');
  await psCase('partial pressure', 'po2', { pct: '21', P: '101.3' }, 'PO₂ is 21.3 kPa (160 mmHg).', 'PO₂ = 0.21 × 101.3 kPa = 21.3 kPa');
  await psCase('saturation over 100', 'content', { hb: '15', sat: '120', po2: '100' }, '"Saturation of haemoglobin" cannot be more than 100.', null);
  await psSolve('sat', { po2: '0' }); check((await psAns()).includes('must be more than 0') && !/NaN|Infinity/.test(await psAns()), 'solve: zero PO2 gives a friendly message');
  await page.click(PS + '.ps-pre button:has-text("Arterial blood")'); await page.waitForTimeout(80);
  check((await psAns()) === 'The blood carries 19.9 mL of oxygen per 100 mL.' && (await page.textContent(PS + '.ps-tip')).includes('Common mistake'), 'solve: preset Arterial blood and tip');
};
