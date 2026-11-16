// #1063 travelling-wave
export const path = '/learn/travelling-wave/';
export default async ({ page, check, BASE }) => {
  const R = '.trw ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  { const e = await t('.tw-eq'), f = await t('.tw-facts');
    check(e.includes('k = 2π / λ = 2π / 2.0 = 3.142 rad/m') && e.includes('ω = 2π / T = 2π / 1.0 = 6.283 rad/s') && e.includes('y(x, t) = 5 sin(3.142 x − 6.283 t) cm') && e.includes('v = ω / k = λ / T = 2 m/s'), 'wave: default k, ω, equation and v = 2 m/s (Python)');
    check(f.includes('31.42 cm/s') && f.includes('to the right'), 'wave: particle top speed Aω = 31.42 cm/s'); }
  const inked = await page.$eval(R + '.tw-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 140 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
  check(inked > 400, `wave: drawn (${inked})`);
  await slide('.tw-T', 0.5);
  check((await t('.tw-eq')).includes('v = ω / k = λ / T = 4 m/s'), 'wave: halve T, double v');
  await page.selectOption(R + '.tw-dir', '-1'); await page.waitForTimeout(150);
  check((await t('.tw-eq')).includes('sin(3.142 x + 12.57 t)') && (await t('.tw-facts')).includes('to the left'), 'wave: left-going kx + ωt');
  await page.selectOption(R + '.tw-dir', '1'); await slide('.tw-T', 1);
  await slide('.tw-x', 2.5);
  check((await t('.tw-xv')) === '2.50 m', 'wave: tracked particle moves');
  await page.click(R + '.tw-play'); await page.waitForTimeout(100);
  check((await t('.tw-play')) === 'Play' && /particle y = −?\d+\.\d cm/.test(await t('.tw-note')), 'wave: pause shows particle height');
  await page.click(R + '.tw-play');
  // Two waves
  await page.click(R + '[data-m="two"]'); await page.waitForTimeout(150);
  check(await page.isVisible(R + '.tw-A2') && (await t('.tw-facts')).includes('Standing wave: nodes every λ/2 = 1 m; antinodes swing to 10 cm'), 'wave: equal opposite waves make a standing wave');
  await page.selectOption(R + '.tw-dir2', '1'); await slide('.tw-p', 180);
  check((await t('.tw-facts')).includes('One travelling wave of amplitude 0 cm'), 'wave: same way, 180° cancels');
  await slide('.tw-p', 90);
  check((await t('.tw-facts')).includes('amplitude 7.07 cm'), 'wave: 90° gives √50 = 7.07 cm');
  await slide('.tw-l2', 1.5);
  check((await t('.tw-facts')).includes('A changing pattern'), 'wave: different wavelengths');
  // Beats
  await page.click(R + '[data-m="beats"]'); await page.waitForTimeout(150);
  check((await t('.tw-eq')).includes('|440 − 444| = 4 Hz') && (await t('.tw-facts')).includes('0.250 s') && await page.isHidden(R + '.tw-A'), 'wave: beats 440/444 = 4 Hz, 0.25 s');
  await slide('.tw-f2', 440);
  check((await t('.tw-facts')).includes('in tune: no beats'), 'wave: equal tones, no beats');
  await slide('.tw-f2', 470);
  check((await t('.tw-facts')).includes('too fast to hear as beats'), 'wave: 30 Hz apart too fast');
  await page.click(R + '.tw-sound');
  check((await t('.tw-sound')) === 'Stop the beats', 'wave: beats sound starts on press');
  await page.click(R + '[data-m="one"]'); await page.waitForTimeout(150);
  check((await t('.tw-sound')) === 'Play the beats' && await page.isHidden(R + '.tw-sound'), 'wave: leaving beats stops the sound');
  // Check yourself
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'wave: five questions');
  for (const i of [0, 3]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  check((await (await items[0].$('.lq-fb')).textContent()) === 'Right.' && (await (await items[3].$('.lq-fb')).textContent()) === 'Right.', 'wave: speed and beats answers accepted');
  await (await items[1].$('.lq-in')).fill('x'); await (await items[1].$('.lq-check')).click();
  check((await (await items[1].$('.lq-fb')).textContent()).startsWith('Type a number'), 'wave: not-a-number message');

  // ---- Solve my numbers ----
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  {
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals, units = {}) => {
    await page.selectOption('.ps-host [data-k="prob"]', id);
    for (const [k, v] of Object.entries(vals)) { const sel = await page.$eval(`.ps-host [data-k="${id}-${k}"]`, (e) => e.tagName === 'SELECT'); if (sel) await page.selectOption(`.ps-host [data-k="${id}-${k}"]`, v); else await page.fill(`.ps-host [data-k="${id}-${k}"]`, v); }
    for (const [k, u] of Object.entries(units)) await page.selectOption(`.ps-host [data-k="${id}-${k}-u"]`, u);
    await page.waitForTimeout(80);
  };
  const T = (cond, msg) => check(cond, `travelling-wave: ${msg}`);
  await psPre('Sound in a hall'); T((await psAns()).includes('The wave speed is 333 m/s.'), 'example Sound in a hall');
  await psPre('Wave equation'); T((await psAns()).includes('y = 0.05 sin(3.14 x − 6.28 t)'), 'example Wave equation');
  await psPre('Particle on the wave'); T((await psAns()).includes('moving down at 31.4 cm/s'), 'example Particle on the wave');
  await psPre('Beats on a guitar'); T((await psAns()).includes('You hear 4 beats per second'), 'example Beats on a guitar');
  await psPre('Guitar string'); T((await psAns()).includes('The wave speed on the string is 400 m/s and harmonic 1 is 400 Hz'), 'example Guitar string');
  await psPre('Third harmonic'); T((await psAns()).includes('Harmonic 3 has frequency 600 Hz'), 'example Third harmonic');
  await psSet('l', {'v': '340', 'f': '512'}, {}); T((await psAns()).includes('The wavelength is 66.4 cm.'), 'typed v = 340, f = 512 gives 66.4 cm');
  await psSet('f', {'v': '3e8', 'l': '3'}, {}); T((await psAns()).includes('The frequency is 100 MHz'), 'radio 3 m at 3e8 gives 100 MHz');
  await psSet('v', {'f': '0.256', 'l': '130'}, {'f': 'kHz', 'l': 'cm'}); T((await psAns()).includes('The wave speed is 333 m/s.'), 'kHz and cm units give 333 m/s');
  await psSet('vT', {'l': '2', 'T': '0.5'}, {'l': 'm', 'T': 's'}); T((await psAns()).includes('The wave speed is 4 m/s'), 'v = lambda / T = 4 m/s');
  await psSet('yp', {'A': '5', 'l': '2', 'T': '1', 'x': '0.5', 't': '0', 'd': '1'}, {}); T((await psAns()).includes('y = 5 cm, momentarily at rest'), 'left-moving particle at crest is at rest');
  await psSet('stand', {'L': '0.65', 'v': '260', 'n': '2.5'}); T((await psAns()).includes('must be a whole number'), 'n = 2.5 gives a friendly message');
  await psSet('beat', {'a': '440', 'b': '440'}); T((await psAns()).includes('No beats'), 'equal tones give no beats');
  await psSet('v', {'f': '256', 'l': '0'}); T((await psAns()).includes('must be more than 0'), 'lambda 0 gives a friendly message');
  await psPre('Sound in a hall');
  await psPre('Sound in a hall'); T((await psWork()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), 'working shown, no NaN');
  }
};
