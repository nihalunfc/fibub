// #1352 spring-mass
export const path = '/learn/spring-mass/';
export default async ({ page, check, BASE }) => {
  const R = '.spm ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  check((await t('.sp-eq')).includes('k = 20 N/m.  T = 2π√(m/k) = 2π√(0.5 / 20) = 0.9935 s.  Rest stretch x = mg/k = 0.5 × 9.8 / 20 = 24.50 cm.'), 'springs: 0.5 kg on 20 N/m: T 0.9935 s, stretch 24.5 cm (Python)');
  check((await t('.sp-facts')).includes('31.6 cm/s') && (await t('.sp-facts')).includes('0.0250 J'), 'springs: top speed 31.6 cm/s, energy 0.025 J');
  check(await page.isHidden(R + '.sp-k2'), 'springs: one spring hides k₂');
  check((await t('.sp-cmp')).includes('series k = 10 N/m, T = 1.405 s;  parallel k = 40 N/m, T = 0.7025 s.  Series is slower by 2 times.'), 'springs: equal pair series vs parallel, ratio 2');
  const inked = await page.$eval(R + '.sp-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 150 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
  check(inked > 300, `springs: picture drawn (${inked})`);
  await page.click(R + '[data-m="series"]'); await slide('.sp-k2', 30);
  check((await t('.sp-eq')).includes('1/k = 1/k₁ + 1/k₂ = 1/20 + 1/30, so k = 12 N/m.') && (await t('.sp-eq')).includes('= 1.283 s'), 'springs: 20 + 30 in series = 12 N/m, T 1.283 s (simulation 1.2826)');
  await page.click(R + '[data-m="parallel"]'); await page.waitForTimeout(150);
  check((await t('.sp-eq')).includes('k = k₁ + k₂ = 20 + 30 = 50 N/m.') && await page.isVisible(R + '.sp-k2'), 'springs: parallel 50 N/m');
  await slide('.sp-m', 2);
  check((await t('.sp-eq')).includes('2π√(2.0 / 50) = 1.257 s'), 'springs: 2 kg on 50 N/m');
  await slide('.sp-A', 0);
  check((await t('.sp-facts')).includes('Energy of the bobbing0 J'), 'springs: no pull, no energy');
  await page.click(R + '.sp-play'); check((await t('.sp-play')) === 'Play', 'springs: pause');
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'springs: five questions');
  const ans = await items[0].getAttribute('data-ans');
  await (await items[0].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[0].$('.lq-check')).click();
  check((await (await items[0].$('.lq-fb')).textContent()) === 'Right.', 'springs: series answer accepted');
  const a4 = await items[4].getAttribute('data-ans');
  await (await items[4].$('.lq-in')).fill(String(+a4 / 2)); await (await items[4].$('.lq-check')).click();
  check((await (await items[4].$('.lq-fb')).textContent()).startsWith('Not quite'), 'springs: wrong cut-spring answer');

  // ---- Solve my numbers ----
  {
    await page.goto(BASE + path); await page.waitForTimeout(500);
    const ans = () => page.textContent('.ps-host .ps-ans'), work = () => page.textContent('.ps-host .ps-work');
    const pre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
    const set = async (id, vals) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(vals)) { if (v[0] === '#') await page.selectOption(`.ps-host [data-k="${k}"]`, v.slice(1)); else await page.fill(`.ps-host [data-k="${k}"]`, v); } await page.waitForTimeout(80); };
    const ok = async (s, m) => check((await ans()).includes(s), `${'spring-mass'}: ${m} (${await ans()})`);
    await pre('Stretch 5 cm'); await ok('The force is 2 N', '40 N/m × 0.05 m');
    await pre('Hang 300 g'); await ok('7.35 cm', '0.3·9.8/40 = 7.35 cm');
    await pre('Series vs parallel'); await ok('Series 20 N/m, parallel 90 N/m', '30 and 60');
    await pre('Period of 500 g'); await ok('0.628 s', '2π√(0.5/50)');
    await pre('Measured T'); await ok('20.1 N/m', '4π²·0.25/0.49');
    await set('T', { 'T-m': '0.5', 'T-k': '30', 'T-k2': '60', 'T-mode': '#1' }); await ok('0.993 s', 'series 30 and 60 = 20 N/m: 2π√(0.5/20)');
    await set('E', { 'E-k': '40', 'E-x': '0.1' }); await ok('0.2 J', '½·40·0.1²');
    await set('F', { 'F-k': '0' }); await ok('must be more than 0', 'zero k refused');
    await page.click('.ps-host .ps-pre button'); await page.waitForTimeout(80);
    check((await work()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), `spring-mass: working shown, no NaN`);
  }
};
