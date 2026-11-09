// #1064 states-of-matter
export const path = '/learn/states-of-matter/';
export default async ({ page, check, BASE }) => {
  const R = '.stm ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  check((await t('.sm-big')) === 'Liquid at 20 °C' && (await t('.sm-pts')).includes('melts at 0 °C and boils at 100 °C'), 'states: water at 20 °C is liquid');
  const inked = await page.$eval(R + '.sm-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 140 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
  check(inked > 400, `states: box drawn (${inked})`);
  await page.click(R + '.sm-down'); await page.click(R + '.sm-down'); await page.waitForTimeout(150);
  check((await t('.sm-big')) === 'Melting at 0 °C' && (await t('.sm-say')).includes('Solid and liquid are together'), 'states: cool to 0 °C, melting');
  await page.click(R + '.sm-down'); await page.waitForTimeout(150);
  check((await t('.sm-big')) === 'Solid at −10 °C'.replace('−', '-') && (await t('.sm-facts')).includes('vibrate in place'), 'states: −10 °C solid');
  await slide('.sm-t', 95); await page.click(R + '.sm-up'); await page.waitForTimeout(150);
  check((await t('.sm-big')) === 'Boiling at 100 °C', 'states: heat stops at the boiling point');
  await page.click(R + '.sm-up'); await page.waitForTimeout(150);
  check((await t('.sm-big')) === 'Gas at 110 °C' && (await t('.sm-facts')).includes('far apart'), 'states: 110 °C gas');
  await slide('.sm-t', 20);
  await page.click(R + '[data-level="9"]'); await page.waitForTimeout(150);
  { const f = await t('.sm-facts'); check(f.includes('293 K') && f.includes('293.15 K') && f.includes('6.07 × 10⁻²¹ J'), 'states: Class 9 kelvin and (3/2)kT = 6.07e-21 J'); }
  await page.click(R + '[data-level="8"]'); await page.waitForTimeout(150);
  check(!(await t('.sm-facts')).includes('K'), 'states: Class 8 hides kelvin');
  await page.selectOption(R + '.sm-sub', 'ethanol'); await page.waitForTimeout(150);
  check((await t('.sm-pts')).includes('melts at -114 °C and boils at 78 °C') && (await t('.sm-big')) === 'Liquid at 20 °C', 'states: ethanol');
  for (let i = 0; i < 6; i++) await page.click(R + '.sm-up');
  await page.waitForTimeout(150);
  check((await t('.sm-big')) === 'Boiling at 78 °C', 'states: ethanol boils at 78 °C');
  await page.selectOption(R + '.sm-sub', 'oxygen'); await page.waitForTimeout(150);
  check((await t('.sm-big')) === 'Gas at 20 °C', 'states: oxygen is a gas at 20 °C');
  await page.selectOption(R + '.sm-sub', 'iron'); await page.waitForTimeout(150);
  check((await t('.sm-big')) === 'Solid at 1518 °C', 'states: iron solid below 1538 °C');
  // Diffusion
  await page.click(R + '[data-m="diff"]'); await page.waitForTimeout(300);
  check(await page.isVisible(R + '.sm-lift') && (await t('.sm-big')).startsWith('Mixed: 0%'), 'states: diffusion starts unmixed');
  await page.selectOption(R + '.sm-dheat', '1');
  await page.click(R + '.sm-lift');
  await page.waitForFunction(() => /Well mixed/.test(document.querySelector('.stm .sm-say').textContent), null, { timeout: 30000 }).catch(() => {});
  check((await t('.sm-say')).startsWith('Well mixed (80%) after'), 'states: hot gas mixes after lifting the divider');
  await page.click(R + '.sm-reset'); await page.waitForTimeout(200);
  check((await t('.sm-say')).includes('divider keeps') && await page.isEnabled(R + '.sm-lift'), 'states: start again');
  await page.selectOption(R + '.sm-dstate', 'liquid'); await page.waitForTimeout(200);
  check((await t('.sm-big')).startsWith('Mixed: 0%'), 'states: liquids reset unmixed');
  await page.click(R + '[data-m="heat"]'); await page.waitForTimeout(150);
  check(await page.isHidden(R + '.sm-lift') && await page.isVisible(R + '.sm-up'), 'states: back to heat and cool');
  // Check yourself
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'states: five questions');
  const ans = await items[0].getAttribute('data-ans');
  await (await items[0].$('.lq-in')).fill(String(+ans + 0.15)); await (await items[0].$('.lq-check')).click();
  check((await (await items[0].$('.lq-fb')).textContent()) === 'Right.', 'states: 273.15 also accepted');
  const ch = await items[2].$$('.lq-choice'), right = +(await items[2].getAttribute('data-ans'));
  await ch[right].click();
  check((await (await items[2].$('.lq-fb')).textContent()) === 'Right.', 'states: state question');
};
