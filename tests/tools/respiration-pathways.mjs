// #1304 Aerobic and anaerobic respiration
export const path = '/learn/respiration-pathways/';
export default async ({ page, check, BASE }) => {
  const R = '.rsp ';
  await page.goto(`${BASE}/learn/respiration-pathways/`); await page.waitForSelector(R + '.rsp-tab tr');
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(150); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(100); };
  const txt = (s) => page.textContent(R + s);
  const row = (k) => page.$eval(`${R}.rsp-tab tr[data-k="${k}"]`, (tr) => [...tr.cells].map((c) => c.textContent).join('|'));
  check((await txt('.rsp-big')) === '38 ATP per glucose' && (await txt('.rsp-eq')).startsWith('glucose + oxygen'), 'respiration: full oxygen');
  check((await row('Carbon dioxide')) === 'Carbon dioxide|6|264.06' && (await row('Water')) === 'Water|6|108.12' && (await row('Oxygen used')) === 'Oxygen used|6|192', 'respiration: aerobic products');
  await slide('.rsp-o2', 0);
  check((await txt('.rsp-big')) === '2 ATP per glucose' && (await row('Ethanol')) === 'Ethanol|2|92.14' && (await row('Carbon dioxide')) === 'Carbon dioxide|2|88.02' && (await txt('.rsp-say')).includes('dough rise'), 'respiration: yeast ferments');
  check((await txt('.rsp-barl')).includes('needs 38 glucose'), 'respiration: 38 glucose for 76 ATP without oxygen');
  await tap('.rsp-org button[data-v="muscle"]');
  check((await row('Lactic acid')) === 'Lactic acid|2|180.16' && (await row('Carbon dioxide')) === 'Carbon dioxide|0|0' && (await txt('.rsp-fig')).includes('Lactic acid'), 'respiration: muscle lactic acid');
  await slide('.rsp-o2', 50);
  check((await txt('.rsp-big')) === '20 ATP per glucose' && (await txt('.rsp-eq')).startsWith('Both at once'), 'respiration: half and half');
  await tap('.rsp-level button[data-v="11"]'); await slide('.rsp-o2', 100);
  check((await txt('.rsp-eq')).includes('C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O') && (await txt('.rsp-note')).includes('Mass in 372.2 g = mass out 372.2 g') && (await txt('.rsp-fig')).includes('glycolysis'), 'respiration: Class 11 equation and mass check');
  await slide('.rsp-g', 2);
  check((await txt('.rsp-gv')) === '2 mol (360.32 g)' && (await row('Water')) === 'Water|12|216.24', 'respiration: 2 mol glucose');
  check((await page.$$(R + '.sm-q')).length === 4, 'respiration: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const m = (i < 4 ? /= (\d+) (ATP|CO₂)\.$/ : /^(\d):/).exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `respiration: quiz ${i} (${w})`);
  }
};
