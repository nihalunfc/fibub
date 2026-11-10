// #1394 Sliding filament
export const path = '/learn/sliding-filament/';
export default async ({ page, check, BASE }) => {
  const R = '.slf ', t = (s) => page.textContent(R + s);
  const tap = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); await page.click(R + sel); await page.waitForTimeout(150); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(700);
  const f = await t('.sf-facts');
  check(f.includes('A band1.60 µm') && f.includes('I band1.00 µm') && f.includes('H zone0.60 µm') && f.includes('Overlap (each half)0.50 µm'), `sarc: start at 2.6 µm (${f})`);
  check((await t('.sf-big')) === '71 % of the myosin heads can reach actin', `sarc: heads (${await t('.sf-big')})`);
  check((await t('.sf-eq')).startsWith('I band = sarcomere − A band = 2.60 − 1.60 = 1.00 µm.'), 'sarc: formula');
  const inked = (s) => page.$eval(R + s, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] < 200 || Math.abs(d[i] - d[i + 2]) > 50) n++; return n; });
  check((await inked('.sf-cv')) > 300 && (await inked('.sf-xb')) > 200, 'sarc: both pictures drawn');
  await tap('.sf-con'); await page.waitForTimeout(2200);
  const g = await t('.sf-facts');
  check((await t('.sf-sv')) === '2.00 µm' && g.includes('A band1.60 µm') && g.includes('I band0.40 µm') && g.includes('H zone0.00 µm') && g.includes('23.1 %'), `sarc: contracted to 2.0 µm (${g})`);
  await tap('.sf-rel'); await page.waitForTimeout(2000);
  check((await t('.sf-sv')) === '2.60 µm' && (await t('.sf-step')).includes('Relaxation'), 'sarc: relaxed back');
  await slide('.sf-s', 3.6);
  check((await t('.sf-big')) === 'No overlap: no cross-bridges can form', 'sarc: stretched too far');
  await slide('.sf-s', 1.8);
  check((await t('.sf-eq')).includes('so 0 (the thin filaments overlap)'), 'sarc: below 2.0 µm');
  // Cross-bridge cycle
  await tap('.sf-next');
  check((await t('.sf-step')) === 'Step 1 of 7: Signal arrives', `sarc: cycle wraps to step 1 (${await t('.sf-step')})`);
  for (let i = 0; i < 4; i++) await tap('.sf-next');
  check((await t('.sf-step')) === 'Step 5 of 7: ATP lets go', 'sarc: step 5');
  await tap('.sf-noatp');
  check((await t('.sf-stext')).includes('rigor'), 'sarc: no ATP gives rigor');
  await tap('.sf-back');
  check((await t('.sf-step')) === 'Step 4 of 7: Power stroke', 'sarc: back');
  const items = await page.$$(R + '.lq-item');
  for (const i of [0, 1, 2]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toFixed(3))); await (await items[i].$('.lq-check')).click(); }
  { const a = +(await items[3].getAttribute('data-ans')); await (await items[3].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('4 of 4'), 'sarc: all answered right');
};
