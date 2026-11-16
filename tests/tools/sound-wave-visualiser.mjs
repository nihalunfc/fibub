// #1061 sound-wave-visualiser
export const path = '/learn/sound-wave-visualiser/';
export default async ({ page, check, BASE }) => {
  const R = '.swv ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  const eq = await t('.sv-eq');
  check(eq.includes('v = 343.2 m/s in air at 20 °C') && eq.includes('λ = v / f = 343.2 / 500 = 0.6865 m') && eq.includes('T = 1 / f = 2 ms'), 'sound: 500 Hz in air at 20 °C, λ = 0.6865 m, T = 2 ms (Python)');
  check((await t('.sv-facts')).includes('68.65 cm'), 'sound: wavelength in cm');
  // The picture is drawn
  const inked = await page.$eval(R + '.sv-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 128) n++; return n; });
  check(inked > 500, `sound: particles drawn (${inked} dark pixels)`);
  await slide('.sv-f', 1000);
  check((await t('.sv-eq')).includes('343.2 / 1000 = 0.3432 m') && (await t('.sv-fv')) === '1000 Hz', 'sound: doubling f halves λ');
  await slide('.sv-t', 0);
  check((await t('.sv-eq')).includes('v = 331.3 m/s in air at 0 °C'), 'sound: v at 0 °C = 331.3 m/s');
  await slide('.sv-t', 20); await slide('.sv-f', 500);
  await page.selectOption(R + '.sv-med', 'water'); await page.waitForTimeout(150);
  check((await t('.sv-eq')).includes('v ≈ 1,480 m/s in water') && (await t('.sv-eq')).includes('= 2.960 m') && await page.isHidden(R + '.sv-tl'), 'sound: water 1,480 m/s, λ = 2.96 m, no temperature slider');
  await page.selectOption(R + '.sv-med', 'steel'); await page.waitForTimeout(150);
  check((await t('.sv-eq')).includes('= 11.80 m'), 'sound: steel λ = 11.8 m');
  await page.selectOption(R + '.sv-med', 'air'); await page.waitForTimeout(150);
  // Class 11 level
  await page.click(R + '[data-level="11"]'); await page.waitForTimeout(150);
  { const f = await t('.sv-facts'); const e = await t('.sv-eq');
    check(e.includes('√(1.4 × 8.314 × 293.15 / 0.02896) = 343.2 m/s') && f.includes('0.649 Pa') && f.includes('0.000510 W/m²') && f.includes('87.1 dB') && f.includes('9.153 rad/m'), 'sound: Class 11 Laplace speed, Δp0 0.649 Pa, 87.1 dB, k (Python)'); }
  await slide('.sv-a', 1);
  check((await t('.sv-facts')).includes('93.1 dB') && (await t('.sv-av')) === '1.0 µm', 'sound: double amplitude adds 6 dB');
  await page.click(R + '[data-level="9"]'); await page.waitForTimeout(150);
  check(!(await t('.sv-facts')).includes('Pa'), 'sound: Class 9 hides pressure');
  // Echo and SONAR
  check((await t('.sv-eeq')).includes('2 × 34 / 343.2 = 0.198 s, a separate echo') && (await t('.sv-eeq')).includes('1500 × 2.0 / 2 = 1500 m'), 'sound: echo 0.198 s and SONAR 1500 m');
  await slide('.sv-d', 10);
  check((await t('.sv-eeq')).includes('too soon to hear separately (needs d ≥ 17.2 m)'), 'sound: echo too soon under 17.2 m');
  await slide('.sv-s', 4.5);
  check((await t('.sv-eeq')).includes('1500 × 4.5 / 2 = 3375 m'), 'sound: SONAR 4.5 s gives 3,375 m');
  await page.fill(R + '.sv-vw', 'abc'); await page.waitForTimeout(150);
  check(await page.isVisible(R + '.sv-err') && (await t('.sv-err')).includes('speed in sea water'), 'sound: bad sea-water speed message');
  await page.fill(R + '.sv-vw', '1480'); await page.waitForTimeout(150);
  check(await page.isHidden(R + '.sv-err') && (await t('.sv-eeq')).includes('1480 × 4.5 / 2 = 3330 m'), 'sound: own sea-water speed');
  // Sound starts only on a press, and stops again
  await page.click(R + '.sv-sound');
  check((await t('.sv-sound')) === 'Stop the sound', 'sound: play button starts the note');
  await page.click(R + '.sv-sound');
  check((await t('.sv-sound')) === 'Play the sound', 'sound: and stops it');
  await page.click(R + '.sv-play');
  check((await t('.sv-play')) === 'Play', 'sound: pause');
  await page.click(R + '.sv-play');
  // Check yourself
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'sound: five questions');
  const ans = await items[0].getAttribute('data-ans');
  await (await items[0].$('.lq-in')).fill('12345'); await (await items[0].$('.lq-check')).click();
  check((await (await items[0].$('.lq-fb')).textContent()).startsWith('Not quite') && await (await items[0].$('.lq-work')).isHidden(), 'sound: wrong answer marked, working hidden');
  await (await items[0].$('.lq-in')).fill(String(+(+ans).toPrecision(3))); await (await items[0].$('.lq-check')).click();
  check((await (await items[0].$('.lq-fb')).textContent()) === 'Right.' && await (await items[0].$('.lq-work')).isVisible() && (await t('.lq-score')).startsWith('1 of 5'), 'sound: right answer, working shown, score');
  await (await items[4].$('.lq-show')).click();
  check((await (await items[4].$('.lq-work')).textContent()).includes('1500 ×'), 'sound: show working');
  await page.click(R + '.lq-new');
  check((await t('.lq-score')).startsWith('0 of 5'), 'sound: new questions');

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

  await psCase('wave speed', 'v', { f: '256', lam: '1.33' }, 'The speed of the wave is 340 m/s.', 'v = 256 Hz × 1.33 m');
  await psCase('frequency', 'f', { v: '340', lam: '0.68' }, 'The frequency is 500 Hz.', 'Time period T = 1 / f = 2 ms');
  await psCase('wavelength in cm', 'lam', { v: '340', f: '500' }, 'The wavelength is 68 cm.', 'λ = 0.68 m = 68 cm');
  await psCase('wavelength with kHz', 'lam', { v: '340', f: '0.5' }, 'The wavelength is 68 cm.', 'Convert to base units: 0.5 kHz = 500 Hz', { f: 'kHz' });
  await psCase('time period', 'T', { f: '250' }, 'The time period is 0.004 s (4 ms).', 'T = 1 ÷ 250 Hz');
  await psCase('echo', 'echo', { v: '340', t: '1.5' }, 'The distance is 255 m.', 'd = v t / 2 = 340 × 1.5 ÷ 2');
  await psCase('echo in ms is too quick', 'echo', { v: '340', t: '50' }, 'The distance is 8.5 m. (Echo too quick: under 0.1 s you cannot hear it as a separate sound.)', null, { t: 'ms' });
  await psCase('sonar', 'sonar', { v: '1500', t: '2' }, 'The sea is 1500 m deep.', 'depth = 1500 m/s × 2 s ÷ 2');
  await psCase('cold air', 'air', { T: '-10' }, 'The speed of sound is about 325 m/s.', 'v ≈ 331 + 0.6 × (-10)'.replace('(-10)', '(−10)'));
  await psSolve('lam', { v: '340', f: '0' }); check((await psAns()).includes('must be more than 0'), 'solve: zero frequency gives a friendly message');
  await psSolve('lam', { v: '340', f: '' }); check((await psAns()).startsWith('Type a number for'), 'solve: blank gives a friendly message');
  await page.click(PS + '.ps-pre button:has-text("Sea depth")'); await page.waitForTimeout(80);
  check((await psAns()) === 'The sea is 1500 m deep.', 'solve: preset Sea depth');
  check((await page.textContent(PS + '.ps-tip')).includes('Common mistake'), 'solve: common mistake line');
};
