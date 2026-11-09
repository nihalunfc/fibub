// #881 magnetic anomaly modeller
export const path = '/science/magnetic-anomaly/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/magnetic-anomaly/`); await page.waitForTimeout(500);
  const R = '.mga ';
  { const b = await page.textContent(R + '.mg-big'); check(b === 'Sphere: high +73.2 nT at −18 m, low −9.7 nT at 80 m', `magnetic: example sphere (${b})`); }
  { const f = await page.textContent(R + '.mg-facts'); check(f.includes('82.9 nT') && f.includes('1.99 A/m') && f.includes('7.45 nT') && f.includes('6.94 nT'), `magnetic: facts and misfit (${f.slice(0, 220)})`); }
  check(await page.isVisible(R + '.mg-fig') && await page.isVisible(R + '.mg-map'), 'magnetic: profile and map');
  await page.fill(R + '.mg-s0', '15'); await page.fill(R + '.mg-z', '85'); await page.fill(R + '.mg-R', '32'); await page.waitForTimeout(150);
  { const t = await page.textContent(R + '.mg-mis'); check(t.includes('2.09 nT') && t.includes('0.69 nT') && t.includes('+1.97 nT'), `magnetic: true body fits the readings (${t})`); }
  await page.selectOption(R + '.mg-kind', 'cylinder'); await page.fill(R + '.mg-s0', '0'); await page.fill(R + '.mg-z', '80'); await page.fill(R + '.mg-R', '30'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.mg-big')) === 'Cylinder: high +151 nT at −24 m, low −65.7 nT at 76 m' && (await page.textContent(R + '.mg-zl')) === 'Depth to axis (m)', 'magnetic: cylinder');
  await page.selectOption(R + '.mg-kind', 'dyke'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.mg-big')) === 'Dyke: high +169 nT at −6 m, low −20.1 nT at 78 m' && await page.isHidden(R + '.mg-R') && await page.isVisible(R + '.mg-dip'), 'magnetic: thin dyke');
  await page.selectOption(R + '.mg-kind', 'prism'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.mg-big')) === 'Prism: high +490 nT at −28 m, low −113 nT at 72 m', 'magnetic: prism');
  await page.fill(R + '.mg-z2', '20'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.mg-err')).includes('bottom deeper') && await page.isHidden(R + '.mg-out'), 'magnetic: bad prism');
  await page.fill(R + '.mg-z2', '130');
  await page.selectOption(R + '.mg-kind', 'sphere'); await page.check(R + '.mg-rem'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.mg-big')) === 'Sphere: high +28.0 nT at 12 m, low −4.1 nT at −90 m' && (await page.textContent(R + '.mg-facts')).includes('Q = 1.01'), 'magnetic: remanence');
  await page.uncheck(R + '.mg-rem');
  await page.fill(R + '.mg-z', '20'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.mg-err')).includes('deeper than the radius'), 'magnetic: body above ground refused');
  await page.fill(R + '.mg-z', '80'); await page.fill(R + '.mg-I', '95'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.mg-err')).includes('within ±90°'), 'magnetic: bad inclination');
  await page.fill(R + '.mg-I', '65'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mg-csv')]); const f = OUT + 'mag.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 302 && rows[0] === 'distance_m,dT_nT' && rows[1].startsWith('-300,'), 'magnetic: profile CSV'); }
  await page.fill(R + '.mg-obs', 'just words'); await page.waitForTimeout(100);
  { const e = await page.textContent(R + '.mg-oerr'); check((e.includes('two columns') || e.includes('No numbers')) && await page.isVisible(R + '.mg-out'), `magnetic: bad observed data (${e})`); }
  await page.fill(R + '.mg-obs', ''); await page.waitForTimeout(100);
  check((await page.textContent(R + '.mg-mis')) === '' && await page.isHidden(R + '.mg-oerr'), 'magnetic: no observed data');
};
