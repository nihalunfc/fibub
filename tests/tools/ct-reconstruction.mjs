// #972 CT reconstruction demo
export const path = '/science/ct-reconstruction/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/ct-reconstruction/`); await page.waitForTimeout(800);
  const big = () => page.textContent('.ctr .ct-big'), facts = () => page.textContent('.ctr .ct-facts');
  const set = async (c, v) => { await page.selectOption('.ctr ' + c, v); await page.waitForTimeout(300); };
  check((await big()) === 'Error 0.0688 (6.88 % of the brightest value), ramp filter, 90 angles', 'ct: example error');
  check((await facts()).includes('90 angles × 128 detector bins') && (await facts()).includes('about 202'), 'ct: example facts');
  check(await page.isVisible('.ctr .ct-fig1') && await page.isVisible('.ctr .ct-fig2') && await page.isVisible('.ctr .ct-fig3'), 'ct: three figures');
  await set('.ct-na', '12'); check((await big()).startsWith('Error 0.232 '), 'ct: 12 angles, worse');
  await set('.ct-na', '90'); await set('.ct-rng', '120'); check((await big()).startsWith('Error 0.198 '), 'ct: limited angle range');
  await set('.ct-rng', '180'); await page.fill('.ctr .ct-noise', '5'); await page.waitForTimeout(300);
  check((await big()).startsWith('Error 0.171 '), 'ct: noise with the ramp filter');
  for (const [f, v] of [['shepp', '0.145'], ['cosine', '0.114'], ['hann', '0.107']]) { await set('.ct-f', f); check((await big()).startsWith(`Error ${v} `), `ct: noise with the ${f} filter`); }
  await set('.ct-f', 'none'); check((await big()) === 'Plain back-projection from 90 angles: blurred' && (await facts()).includes('not meaningful'), 'ct: plain back-projection');
  await page.fill('.ctr .ct-noise', '0'); await set('.ct-f', 'ramp'); await set('.ct-n', '64');
  check((await facts()).includes('90 angles × 64 detector bins') && (await facts()).includes('about 101'), 'ct: 64 × 64 image');
  await set('.ct-ph', 'disc'); check((await page.inputValue('.ctr .ct-hi')) === '1' && (await big()).startsWith('Error '), 'ct: disc object');
  await set('.ct-ph', 'dots'); check((await big()).startsWith('Error '), 'ct: dots object');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ctr .ct-scsv')]); const f = OUT + 'sino.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 91 && r[0].startsWith('angle_deg,t=-0.98438') && r[0].split(',').length === 65, 'ct: sinogram CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ctr .ct-pcsv')]); const f = OUT + 'prof.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 65 && r[0] === 'x,true,reconstruction', 'ct: profile CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ctr .dl button[data-f=docx]')]); check((await d.suggestedFilename()) === 'ct-reconstruction.docx', 'ct: Word report'); }
  await page.fill('.ctr .ct-noise', '-3'); await page.waitForTimeout(200);
  check((await page.textContent('.ctr .ct-err')).includes('from 0 to 50') && await page.isHidden('.ctr .ct-out'), 'ct: bad noise message');
  await page.fill('.ctr .ct-noise', '0'); await page.fill('.ctr .ct-hi', '-1'); await page.waitForTimeout(200);
  check((await page.textContent('.ctr .ct-err')).includes('grey window'), 'ct: bad window message');
  await page.fill('.ctr .ct-hi', '1'); await page.waitForTimeout(200); check(await page.isVisible('.ctr .ct-out'), 'ct: back to results');
};
