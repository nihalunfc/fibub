// #973 Ultrasound calculator
export const path = '/science/ultrasound-calculator/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/ultrasound-calculator/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.usc .us-big'), all = async () => (await page.textContent('.usc .us-out'));
  check((await big()) === '41.8 % reflected at Soft tissue (average) to Bone (cortical); echo 53.8 dB down', 'us: example headline');
  { const t = await all(); check(t.includes('1.632 MRayl') && t.includes('7.600 MRayl') && t.includes('58.2 %') && t.includes('critical angle 22.64°') && t.includes('0.6464'), 'us: boundary facts'); }
  { const t = await all(); check(t.includes('25 dB') && t.includes('−53.8 dB') && t.includes('1.20 cm') && t.includes('12 cm') && t.includes('yes'), 'us: attenuation facts'); }
  { const t = await all(); check(t.includes('0.308 mm') && t.includes('0.462 mm') && t.includes('0.600 µs') && t.includes('8.12 cm') && t.includes('2.15°') && t.includes('129.9 µs') && t.includes('7.70 kHz'), 'us: pulse and beam facts'); }
  { const t = await all(); check(t.includes('1623 Hz') && t.includes('119 cm/s'), 'us: Doppler facts'); }
  await page.fill('.usc .us-th', '25'); await page.waitForTimeout(150);
  check((await big()).startsWith('100 % reflected') && (await all()).includes('none (totally reflected)'), 'us: beyond the critical angle');
  await page.fill('.usc .us-th', '0'); await page.selectOption('.usc .us-m2', '7'); await page.waitForTimeout(150);
  check((await big()).startsWith('99.9 % reflected at Soft tissue (average) to Air') && (await all()).includes('inverted'), 'us: soft tissue to air');
  await page.fill('.usc .us-f', '10'); await page.waitForTimeout(150);
  { const t = await all(); check(t.includes('0.231 mm') && t.includes('6 cm') && t.includes('no'), 'us: 10 MHz, finer but shallower'); }
  await page.fill('.usc .us-f', '5'); await page.fill('.usc .us-c2', '1540'); await page.fill('.usc .us-rho2', '1060'); await page.waitForTimeout(150);
  check((await page.inputValue('.usc .us-m2')) === 'own' && (await big()).startsWith('0 % reflected') && (await big()).endsWith('echo none'), 'us: own values, matched impedance');
  await page.fill('.usc .us-dth', '90'); await page.waitForTimeout(150);
  check((await all()).includes('no shift at 90°'), 'us: Doppler at 90°');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.usc .us-csv')]); const f = OUT + 'us.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'group,quantity,value' && r.length === 22 && r[1].startsWith('Boundary,'), 'us: results CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.usc .dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'ultrasound.pdf', 'us: PDF report'); }
  for (const [c, v, msg] of [['.us-f', '0', 'frequency'], ['.us-z', 'x', 'depth'], ['.us-c1', '-5', 'speed of sound'], ['.us-th', '95', 'angle of incidence']]) {
    const old = await page.inputValue('.usc ' + c); await page.fill('.usc ' + c, v); await page.waitForTimeout(120);
    check((await page.textContent('.usc .us-err')).includes(msg) && await page.isHidden('.usc .us-out'), `us: bad ${msg} message`);
    await page.fill('.usc ' + c, old);
  }
  await page.waitForTimeout(120); check(await page.isVisible('.usc .us-out'), 'us: back to results');
};
