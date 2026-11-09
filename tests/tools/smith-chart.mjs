// #633 Smith chart
export const path = '/science/smith-chart/';
export default async ({ page, check, BASE }) => {
  const R = '.smc ';
  const big = () => page.textContent(R + '.sm-big');
  const facts = () => page.textContent(R + '.sm-facts');
  const mf = () => page.textContent(R + '.sm-mfacts');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await big()) === 'Γ = 0.593 ∠ −46.85°, VSWR 3.911', 'smith: example Γ and VSWR');
  { const f = await facts(); check(f.includes('1.2 − j1.6') && f.includes('4.543 dB') && f.includes('35.1 %') && f.includes('1.88 dB') && f.includes('6 + j8 mS'), 'smith: example facts'); }
  { const f = await page.textContent(R + '.sm-lfacts'); check(f.includes('16.86 − j26.99 Ω') && f.includes('0.9893 cm') && f.includes('−118.8°'), 'smith: example line transformation'); }
  { const f = await mf(); check(f.includes('0.09272 pF across the load, then 6.078 nH in series') && f.includes('4.636 nH across the load, then 1.042 pF in series') && (f.match(/input 50 \+ j0 Ω/g) || []).length === 2, 'smith: example L-network solutions'); }
  check((await page.$$(R + '.sm-svg polyline')).length >= 19 && (await page.$$(R + '.sm-svg circle')).length >= 4, 'smith: SVG chart drawn with grid, load, input and matching points');
  // Stubs.
  await page.selectOption(R + '.sm-m', 'open'); await page.waitForTimeout(80);
  { const f = await mf(); check((await page.textContent(R + '.sm-mtitle')).includes('open') && f.includes('stub 0.345 λ long at 0.1104 λ from the load') && f.includes('stub 0.155 λ long at 0.2594 λ'), `smith: open stubs (${f})`); }
  await page.selectOption(R + '.sm-m', 'short'); await page.waitForTimeout(80);
  { const f = await mf(); check(f.includes('stub 0.09497 λ long at 0.1104 λ') && f.includes('stub 0.405 λ long at 0.2594 λ'), `smith: shorted stubs (${f})`); }
  await page.selectOption(R + '.sm-m', 'none'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.sm-mcard'), 'smith: no matching hides the card');
  await page.selectOption(R + '.sm-m', 'l');
  // A load below Z0: four L-network solutions, two series first.
  await page.fill(R + '.sm-r', '20'); await page.fill(R + '.sm-x', '40'); await page.waitForTimeout(80);
  { const f = await mf(); check((f.match(/Solution \d/g) || []).length === 4 && (f.match(/series first/g) || []).length === 2, `smith: 20 + j40 Ω gets four L-networks (${f.slice(0, 80)})`); }
  // Matched load and the admittance grid.
  await page.fill(R + '.sm-r', '50'); await page.fill(R + '.sm-x', '0'); await page.waitForTimeout(80);
  check((await big()) === 'Γ = 0 ∠ 0°, VSWR 1' && (await facts()).includes('∞ (matched)') && (await page.textContent(R + '.sm-mhelp')).includes('already matched'), 'smith: matched load');
  const n0 = (await page.$$(R + '.sm-svg polyline')).length;
  await page.check(R + '.sm-adm'); await page.waitForTimeout(80);
  check((await page.$$(R + '.sm-svg polyline')).length > n0, 'smith: admittance circles added');
  // Quarter-wave transformer: 100 Ω through λ/4 of 50 Ω is 25 Ω.
  await page.fill(R + '.sm-r', '100'); await page.fill(R + '.sm-l', '0.25'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.sm-lfacts')).includes('25 + j0 Ω'), 'smith: quarter-wave line turns 100 Ω into 25 Ω');
  // Short circuit and bad input.
  await page.fill(R + '.sm-r', '0'); await page.fill(R + '.sm-x', '0'); await page.waitForTimeout(80);
  check((await big()).includes('VSWR ∞') && (await page.textContent(R + '.sm-mhelp')).includes('cannot be matched'), 'smith: short circuit');
  await page.fill(R + '.sm-r', '-5'); await page.waitForTimeout(60);
  check((await page.textContent(R + '.sm-err')).includes('negative resistance') && await page.isHidden(R + '.sm-out'), 'smith: negative resistance message');
  await page.fill(R + '.sm-r', '60'); await page.fill(R + '.sm-x', '-80'); await page.fill(R + '.sm-vf', '2'); await page.waitForTimeout(60);
  check((await page.textContent(R + '.sm-err')).includes('velocity factor'), 'smith: bad velocity factor message');
  await page.fill(R + '.sm-vf', '0.66'); await page.fill(R + '.sm-z0', ''); await page.waitForTimeout(60);
  check((await page.textContent(R + '.sm-err')).includes('line impedance'), 'smith: missing Z0 message');
  await page.fill(R + '.sm-z0', '50'); await page.waitForTimeout(60);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check(d.suggestedFilename() === 'smith-chart.png', 'smith: image download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=docx]')]); check(/\.docx$/.test(d.suggestedFilename()), 'smith: Word download'); }
};
