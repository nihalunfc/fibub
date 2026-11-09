// #687 oil and gas PVT correlations
export const path = '/science/pvt-correlations/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/pvt-correlations/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.pvt .pv-big'), oilF = () => page.textContent('.pvt .pv-oil'), gasF = () => page.textContent('.pvt .pv-gas');
  const set = async (s, v) => { await page.fill(`.pvt ${s}`, v); await page.waitForTimeout(120); };
  check((await big()) === 'Bubble point 2463 psia; at 3000 psia: Bo 1.3241 rb/STB, µo 0.609 cP, Z 0.8524', 'pvt: example headline');
  { const o = await oilF(); check(o.includes('undersaturated') && o.includes('1.41 × 10⁻⁵ 1/psi') && o.includes('2.18 cP') && o.includes('0.578 cP'), 'pvt: example oil facts'); }
  { const g = await gasF(); check(g.includes('389.7 °R, 656.5 psia') && g.includes('1.641, 4.570') && g.includes('0.005140 ft³/scf') && g.includes('0.0211 cP'), 'pvt: example gas facts'); }
  { const t = await page.textContent('.pvt .pv-tab'); check(t.includes('2463 (pb)') && t.includes('206.2') && t.includes('0.9855'), 'pvt: table against pressure with the bubble point row'); }
  check((await page.$$eval('.pvt .pv-figs canvas', (c) => c.filter((e) => e.getBoundingClientRect().height > 50).length)) === 4, 'pvt: four curves');
  await page.selectOption('.pvt .pv-om', 'vb'); await page.waitForTimeout(150);
  check((await big()).startsWith('Bubble point 2781 psia') && (await oilF()).includes('Separator-corrected gas gravity0.7431'), 'pvt: Vasquez-Beggs');
  await page.selectOption('.pvt .pv-om', 'standing'); await page.selectOption('.pvt .pv-zm', 'hy'); await page.waitForTimeout(150);
  check((await gasF()).includes('Hall-Yarborough') && !(await big()).endsWith('Z 0.8524'), 'pvt: Hall-Yarborough Z');
  await page.selectOption('.pvt .pv-zm', 'dak');
  await set('.pv-p', '1000');
  check((await oilF()).includes('saturated (gas comes out') && (await oilF()).includes('206.2 scf/STB'), 'pvt: saturated oil at 1000 psia');
  await set('.pv-co2', '5'); await set('.pv-h2s', '10');
  check((await gasF()).includes('Wichert-Aziz'), 'pvt: sour gas correction');
  await set('.pv-co2', '0'); await set('.pv-h2s', '0'); await set('.pv-p', '3000');
  await page.selectOption('.pvt .pv-pu', '14.503774'); await page.waitForTimeout(120); await set('.pv-p', '200'); await set('.pv-pmax', '350');
  check((await big()).includes('bar') && (await big()).startsWith('Bubble point 169.8 bar'), 'pvt: pressures in bar');
  await page.selectOption('.pvt .pv-tu', 'C'); await set('.pv-t', '82.2222'); await page.selectOption('.pvt .pv-gu', '5.614583'); await set('.pv-rsb', '106.864');
  check((await big()).startsWith('Bubble point 169.8 bar') && (await oilF()).includes('m³/m³'), 'pvt: °C and m³/m³ give the same bubble point');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pvt .pv-csv')]); const f = OUT + 'pvt.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0].startsWith('pressure (bar),Rs (m³/m³),Bo') && rows.length === 123, `pvt: CSV (${rows.length} rows)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pvt .dl [data-f=docx]')]); check((await d.suggestedFilename()) === 'pvt-correlations.docx', 'pvt: Word report'); }
  await set('.pv-api', '120');
  check((await page.textContent('.pvt .pv-err')).includes('between 5 and 80 °API') && await page.isHidden('.pvt .pv-out'), 'pvt: bad API message');
  await set('.pv-api', '35'); await set('.pv-gg', '0.3');
  check((await page.textContent('.pvt .pv-err')).includes('Gas specific gravity'), 'pvt: bad gas gravity message');
};
