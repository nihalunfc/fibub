// #1393 Z-scheme stepper
export const path = '/learn/z-scheme/';
export default async ({ page, check, BASE }) => {
  const R = '.zsc ', t = (s) => page.textContent(R + s);
  const tap = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); await page.click(R + sel); await page.waitForTimeout(150); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(700);
  check((await t('.zs-big')) === 'Step 1 of 10: P680, reaction centre of photosystem II', `z: first step (${await t('.zs-big')})`);
  check(await page.$eval(R + '.zs-back', (b) => b.disabled), 'z: Back off at the start');
  await tap('.zs-next');
  check((await t('.zs-big')) === 'Step 2 of 10: P680* (excited by light)' && (await t('.zs-text')).includes('2 H₂O → 4 H⁺ + O₂ + 4 e⁻'), 'z: light lifts the electron; water split');
  for (let i = 0; i < 8; i++) await tap('.zs-next');
  check((await t('.zs-big')).startsWith('Step 10 of 10: NADP⁺ reductase') && (await t('.zs-next')) === 'Start again', 'z: last step NADPH');
  await tap('.zs-back');
  check((await t('.zs-big')) === 'Step 9 of 10: Ferredoxin (Fd)', 'z: back one step');
  const f = await t('.zs-facts');
  check(f.includes('Photons absorbed2412 at PS II, 12 at PS I') && f.includes('Water split6 H₂O') && f.includes('Oxygen given off3 O₂') && f.includes('NADPH made6') && f.includes('H⁺ into the lumen36') && f.includes('ATP made (about)7.7'), `z: tally for 12 electrons (${f})`);
  check((await t('.zs-eq')).includes('ATP ≈ 36 × 3 / 14 = 7.71'), 'z: ATP formula');
  await slide('.zs-n', 4);
  check((await t('.zs-facts')).includes('Oxygen given off1 O₂') && (await t('.zs-facts')).includes('NADPH made2'), 'z: 4 electrons give 1 O₂, 2 NADPH');
  await slide('.zs-n', 12);
  await tap('.zs-path button[data-p=cyc]');
  check((await t('.zs-big')) === 'Step 1 of 7: P700, reaction centre of photosystem I' && (await t('.zs-facts')).includes('NADPH made0') && (await t('.zs-eq')).includes('= 5.14'), `z: cyclic (${await t('.zs-eq')})`);
  const inked = await page.$eval(R + '.zs-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] < 200 || Math.abs(d[i] - d[i + 2]) > 50) n++; return n; });
  check(inked > 300, `z: diagram drawn (${inked})`);
  await tap('.zs-play'); await page.waitForTimeout(2200); await tap('.zs-play');
  check((await t('.zs-big')).startsWith('Step 2 of 7') && (await t('.zs-play')) === 'Play', `z: play steps on (${await t('.zs-big')})`);
  const items = await page.$$(R + '.lq-item');
  for (const i of [0, 1, 2]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(ans); await (await items[i].$('.lq-check')).click(); }
  { const a = +(await items[3].getAttribute('data-ans')); await (await items[3].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('4 of 4'), 'z: all answered right');
};
