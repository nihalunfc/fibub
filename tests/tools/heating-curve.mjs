// #1065 heating-curve
export const path = '/learn/heating-curve/';
export default async ({ page, check, BASE }) => {
  const R = '.htc ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  const fill = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  { const e = await t('.hc-eq');
    check(e.includes('Q = mL = 0.5 × 3.34 × 10⁵ = 167 kJ, taking 5.57 min') && e.includes('= 1130 kJ, taking 37.7 min') && e.includes('Total from -20 °C to 120 °C: 1548 kJ in 51.6 min'), 'heat: default stages 167 kJ, 1130 kJ, total 1548 kJ in 51.6 min (Python)'); }
  { const rows = await page.$$eval(R + '.hc-tab tbody tr', (r) => r.map((x) => x.textContent));
    check(rows.length === 5 && rows[0].includes('21 kJ') && rows[0].includes('42 s') && rows[2].includes('210 kJ') && rows[2].includes('7 min') && rows[4].includes('40 s') && rows[0].includes('2,100 × 20'), 'heat: stage table'); }
  await page.waitForTimeout(1500);
  check(/°C after/.test(await t('.hc-big')), 'heat: curve playing');
  await page.click(R + '.hc-play'); await page.click(R + '.hc-restart'); await page.waitForTimeout(100);
  check((await t('.hc-big')) === '-20.0 °C after 0 s' && (await t('.hc-now')).startsWith('Ice warms up'), 'heat: start again at −20 °C');
  const inked = await page.$eval(R + '.hc-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 140 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
  check(inked > 400, `heat: picture drawn (${inked})`);
  await slide('.hc-m', 1);
  check((await t('.hc-eq')).includes('= 334 kJ, taking 11.1 min') && (await t('.hc-mv')) === '1.0 kg', 'heat: double mass doubles the time');
  await slide('.hc-P', 1000);
  check((await t('.hc-eq')).includes('= 334 kJ, taking 5.57 min'), 'heat: double power halves it');
  await slide('.hc-T0', 0);
  check((await page.$$eval(R + '.hc-tab tbody tr', (r) => r.length)) === 4, 'heat: ice at 0 °C skips warming the ice');
  await page.click(R + '.hc-play');
  // Mixer
  check((await t('.hc-mix')) === 'Final temperature 44.0 °C' && (await t('.hc-mixeq')).includes('= 44.0 °C'), 'heat: mixer 0.2 kg at 80 + 0.3 kg at 20 = 44.0 °C');
  await page.selectOption(R + '.hc-obj', '450'); await fill('.hc-ma', '0.5'); await fill('.hc-ta', '100'); await fill('.hc-mb', '1');
  check((await t('.hc-mix')) === 'Final temperature 24.1 °C', 'heat: iron ball 24.07 °C (Python)');
  await page.selectOption(R + '.hc-obj', 'ice'); await fill('.hc-ma', '0.05'); await fill('.hc-mb', '0.2'); await fill('.hc-tb', '50');
  check((await t('.hc-mix')) === 'Final temperature 24.1 °C' && await page.isHidden(R + '.hc-ta') && (await t('.hc-mixeq')).includes('All of it melts'), 'heat: 50 g ice into 200 g at 50 °C = 24.1 °C');
  await fill('.hc-ma', '0.2');
  check((await t('.hc-mix')) === 'Final temperature 0 °C, 125.7 g of ice melts', 'heat: 200 g ice, 125.7 g melts');
  await fill('.hc-tb', '120');
  check((await t('.hc-err')).includes('0 to 100 °C'), 'heat: cup water must be liquid');
  await fill('.hc-tb', '50'); await fill('.hc-mb', '0');
  check((await t('.hc-err')).includes('both masses'), 'heat: bad mass message');
  await fill('.hc-mb', '0.2'); await page.selectOption(R + '.hc-obj', '4200'); await fill('.hc-ta', '150');
  check((await t('.hc-err')).includes('Hot water must be liquid'), 'heat: hot water over 100 °C');
  // Check yourself
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'heat: five questions');
  for (const i of [0, 1, 2, 3]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  check((await t('.lq-score')).startsWith('4 of 5'), 'heat: four numeric answers accepted');
};
