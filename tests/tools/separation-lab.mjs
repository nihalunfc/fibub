// #1256 Separation lab
export const path = '/learn/separation-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/separation-lab/`); await page.waitForTimeout(700);
  const pill = () => page.textContent('.sl .sl-pill'), facts = () => page.textContent('.sl .sl-facts'), why = () => page.textContent('.sl .sl-why');
  const meth = async (m) => { await page.click(`.sl .sl-methods [data-m="${m}"]`); await page.waitForTimeout(150); };
  check((await pill()) === 'Pick a method to try' && (await facts()).includes('Recovered pure0 of 2'), 'separation-lab: starts with rice and stones, nothing recovered');
  check(await page.$eval('.sl .sl-scene', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 140) n++; return n > 300; }), 'separation-lab: scene drawn');
  await meth('sieve');
  check((await pill()).includes('does not work') && (await why()).includes('same size'), 'separation-lab: sieve fails on rice and stones');
  await meth('hand');
  check((await pill()).startsWith('Separated!') && (await facts()).includes('2 of 2'), 'separation-lab: handpicking separates rice and stones');
  await page.click('.sl .sl-undo'); await page.waitForTimeout(100);
  check((await facts()).includes('0 of 2'), 'separation-lab: undo');
  // sand and salt: three steps
  await page.selectOption('.sl .sl-mix', 'sandsalt'); await page.waitForTimeout(100);
  await meth('filter'); check((await why()).includes('adding water first'), 'separation-lab: dry filtration explained');
  await meth('water'); await meth('filter');
  check((await page.$$('.sl .sl-boxes button')).length === 2 && (await facts()).includes('1 of 2'), 'separation-lab: filtration leaves sand on the paper');
  await page.click('.sl .sl-boxes [data-i="1"]'); await meth('evap'); await page.waitForTimeout(1400);
  check((await pill()).startsWith('Separated!') && (await facts()).includes('2 of 2') && (await facts()).includes('Steps used4') && (await why()).includes('Lost into the air: water'), `separation-lab: sand and salt done, water lost (${await facts()})`);
  check((await page.$$('.sl .sl-log li')).length === 4, 'separation-lab: step log');
  // alcohol and water
  await page.selectOption('.sl .sl-mix', 'ethanol'); await page.waitForTimeout(100);
  await meth('distil');
  check((await pill()).includes('only partly') && (await why()).includes('22 °C apart'), 'separation-lab: simple distillation only partial for 78/100 °C');
  await page.click('.sl .sl-reset'); await meth('frac');
  check((await pill()).startsWith('Separated!') && (await page.textContent('.sl .sl-extra')).includes('stays at 78 °C') && (await page.textContent('.sl .sl-extra')).includes('100 °C'), 'separation-lab: fractional distillation, thermometer 78 then 100 °C');
  await page.click('.sl .sl-level [data-l="11"]'); await page.waitForTimeout(120);
  check((await page.textContent('.sl .sl-extra')).includes('differ by 22 °C') && (await page.$$('.sl .sq-q')).length === 5, 'separation-lab: Class 11 boiling-point rule and five questions');
  // ink
  await page.selectOption('.sl .sl-mix', 'ink'); await page.waitForTimeout(100); await meth('chroma');
  check((await pill()).startsWith('Separated!') && (await page.textContent('.sl .sl-extra')).includes('Rf'), 'separation-lab: chromatography separates green ink');
  await page.click('.sl .sl-level [data-l="9"]'); await page.waitForTimeout(100);
  const ans = await page.$eval('.sl .sq-q', (e) => e.dataset.ans);
  await page.fill('.sl .sq-q .sq-in', ans); await page.press('.sl .sq-q .sq-in', 'Enter');
  check((await page.textContent('.sl .sq-q .sq-res')) === 'Right!', 'separation-lab: quiz answer with Enter');
};
