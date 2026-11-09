// #950 counting statistics helper
export const path = '/science/counting-statistics/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/counting-statistics/`); await page.waitForTimeout(600);
  const t = (c) => page.textContent(`.cst ${c}`), wait = () => page.waitForTimeout(150);
  check((await t('.cs-big1')) === 'Net rate 2 ± 0.067 per s (1σ)' && (await t('.cs-dec')).startsWith('Detected'), 'counting: example net rate, detected');
  { const f = await t('.cs-facts1'); check(f.includes('32.9 net counts') && f.includes('68.5 net counts') && f.includes('σ₀ = 20') && f.includes('8 ± 0.27 Bq') && f.includes('0.4567 Bq') && f.includes('27.4 dpm') && f.includes('2.375 to 2.63'), 'counting: L_C, L_D, activity, MDA, exact limits'); }
  check((await t('.cs-big2')) === 'True rate 22222 per s (non-paralysable)' && (await t('.cs-facts2')).includes('22367 per s'), 'counting: dead time, both models');
  check((await t('.cs-big3')) === 'Count the sample for 1658 s and the background for 741.6 s' && (await t('.cs-facts3')).includes('13090 s') && (await t('.cs-facts3')).includes('2.34 %'), 'counting: time split and time for 1 %');
  check(await page.isVisible('.cst .cs-fig1') && await page.isVisible('.cst .cs-fig2'), 'counting: both charts');
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.cst .dl [data-f=${fmt}]`)]); check(d.suggestedFilename() === `counting-statistics.${fmt}`, `counting: ${fmt} download`); }
  await page.fill('.cst .cs-G', '330'); await page.fill('.cst .cs-eff', ''); await wait();
  check((await t('.cs-dec')).startsWith('Not detected') && !(await t('.cs-facts1')).includes('Bq'), 'counting: weak sample not detected, counts only');
  await page.selectOption('.cst .cs-a', '0.01'); await page.selectOption('.cst .cs-b', '0.1'); await page.selectOption('.cst .cs-cf', '0.9'); await page.selectOption('.cst .cs-tu', '60'); await wait();
  { const f = await t('.cs-facts1'); check(f.includes('2.326 × σ₀') && f.includes('detected 90 %') && f.includes('90 % limits') && (await t('.cs-big1')).includes('per min'), 'counting: α, β, confidence and minutes'); }
  await page.fill('.cst .cs-m', '80000'); await wait();
  check((await t('.cs-facts2')).includes('no solution'), 'counting: paralysable model has no solution above 1/(eτ)');
  await page.fill('.cst .cs-m', '300000'); await wait();
  check((await t('.cs-err2')).includes('below 1') && await page.isHidden('.cst .cs-out2'), 'counting: impossible dead-time message');
  await page.fill('.cst .cs-G', '12.5'); await wait();
  check((await t('.cs-err1')).includes('whole numbers'), 'counting: bad counts message');
  await page.fill('.cst .cs-G', '1500'); await page.fill('.cst .cs-eff', '150'); await wait();
  check((await t('.cs-err1')).includes('efficiency'), 'counting: bad efficiency message');
  await page.fill('.cst .cs-Rb', '3'); await wait();
  check((await t('.cs-err3')).includes('higher than the background'), 'counting: planning rates message');
};
