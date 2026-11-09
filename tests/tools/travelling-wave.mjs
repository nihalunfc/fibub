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
};
