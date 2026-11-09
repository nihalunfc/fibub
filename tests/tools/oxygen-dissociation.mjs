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
};
