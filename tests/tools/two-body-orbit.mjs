// #903 two-body orbit sandbox
export const path = '/science/two-body-orbit/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/two-body-orbit/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.tbo .tb-big'), facts = () => page.textContent('.tbo .tb-facts'), checks = () => page.textContent('.tbo .tb-checks');
  check((await big()) === 'Ellipse, e = 0.000318, period 365.1 days', 'two-body: Sun and Earth-like preset');
  check((await checks()).includes('passed'), 'two-body: energy and angular momentum check passes');
  { const t1 = await page.textContent('.tbo .tb-clock'); await page.waitForTimeout(500); const t2 = await page.textContent('.tbo .tb-clock'); check(t1 !== t2, `two-body: animation runs (${t1} then ${t2})`); }
  await page.click('.tbo .tb-play'); await page.waitForTimeout(100);
  { const t1 = await page.textContent('.tbo .tb-clock'); await page.waitForTimeout(400); check(t1 === await page.textContent('.tbo .tb-clock') && (await page.textContent('.tbo .tb-play')) === 'Play', 'two-body: pause stops the animation'); }
  await page.selectOption('.tbo .tb-pre', 'ecc'); await page.waitForTimeout(300);
  check((await big()) === 'Ellipse, e = 0.699, period 134.6 days', 'two-body: eccentric binary headline');
  { const f = await facts(); check(f.includes('0.5884 AU') && f.includes('0.1769 AU') && f.includes('51.59 km/s') && f.includes('0.333 and 0.667'), 'two-body: eccentric binary elements'); }
  { const c = await checks(); check(c.includes('passed') && /× 10⁻¹[⁰¹²³⁴⁵⁶]/.test(c), 'two-body: eccentric binary check with tiny drift'); }
  await page.selectOption('.tbo .tb-pre', 'flyby'); await page.waitForTimeout(300);
  check((await big()).startsWith('Hyperbola (they fly apart), e = 1.9') && (await facts()).includes('never returns') && (await checks()).includes('passed'), 'two-body: fly-by is a hyperbola');
  await page.selectOption('.tbo .tb-pre', 'equal'); await page.waitForTimeout(300);
  check((await big()).startsWith('Ellipse') && (await facts()).includes('0.500 and 0.500'), 'two-body: equal masses share the orbit equally');
  await page.selectOption('.tbo .tb-pre', 'earthmoon'); await page.waitForTimeout(300);
  check(await page.inputValue('.tbo .tb-u') === 'planet' && (await big()).includes('hours') && (await page.textContent('.tbo .tb-b')).includes('km'), 'two-body: Earth and Moon-like preset in planet units');
  await page.fill('.tbo .tb-vy2', '1.5'); await page.waitForTimeout(300);
  check(await page.inputValue('.tbo .tb-pre') === 'custom' && (await big()).startsWith('Hyperbola'), 'two-body: typing switches to Custom; 1.5 km/s escapes');
  await page.fill('.tbo .tb-vy2', '0'); await page.waitForTimeout(200);
  check((await page.textContent('.tbo .tb-err')).includes('sideways') && await page.isHidden('.tbo .tb-out'), 'two-body: head-on motion message');
  await page.fill('.tbo .tb-vy2', '1'); await page.fill('.tbo .tb-m1', '0'); await page.waitForTimeout(200);
  check((await page.textContent('.tbo .tb-err')).includes('masses'), 'two-body: zero mass message');
  await page.fill('.tbo .tb-m1', '1'); await page.fill('.tbo .tb-x2', '0'); await page.waitForTimeout(200);
  check((await page.textContent('.tbo .tb-err')).includes('same place'), 'two-body: same place message');
  await page.fill('.tbo .tb-x2', 'x'); await page.waitForTimeout(200);
  check((await page.textContent('.tbo .tb-err')).includes('every box'), 'two-body: not a number message');
  await page.selectOption('.tbo .tb-pre', 'ecc'); await page.waitForTimeout(300);
  check(await page.isVisible('.tbo .tb-fig') && await page.isVisible('.tbo .tb-live'), 'two-body: live canvas and chart');
  for (const [f, n] of [['png', 'Image'], ['pdf', 'PDF'], ['docx', 'Word']]) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.tbo .dl [data-f=${f}]`)]); check(d.suggestedFilename().endsWith('.' + f), `two-body: ${n} download`); }
};
