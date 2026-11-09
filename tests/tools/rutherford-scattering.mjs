// #1069 rutherford-scattering
export const path = '/learn/rutherford-scattering/';
export default async ({ page, check, BASE }) => {
  const R = '.rsc ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  const num = (txt, label) => { const m = txt.match(new RegExp(label + '(\\d+)')); return m ? +m[1] : NaN; };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  check((await t('.rs-eq')).includes('79 protons for gold') && await page.isHidden(R + '.rs-graph-card'), 'ruth: Class 9 words, no graph');
  // Plum pudding: everything goes straight
  await page.click(R + '[data-m="pudding"]'); await page.waitForTimeout(4500);
  { const c = await t('.rs-counts'); check(num(c, 'under 10°\\)') > 3 && num(c, '90°\\)') === 0 && num(c, 'over 90°\\)') === 0, `ruth: plum pudding, all straight (${c})`); }
  await page.click(R + '[data-m="nucleus"]'); await page.waitForTimeout(5000);
  { const c = await t('.rs-counts'), a = num(c, 'under 10°\\)'), b = num(c, 'to 90°'), k = num(c, 'over 90°\\)');
    check(a + b + k > 10 && b + k > 0, `ruth: nucleus deflects some (${a}, ${b}, ${k})`); }
  await page.click(R + '.rs-zero'); await page.waitForTimeout(100);
  check((await t('.rs-counts')).includes('Almost straight (under 10°)0'), 'ruth: reset counts');
  const inked = await page.$eval(R + '.rs-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 200 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
  check(inked > 100, `ruth: picture drawn (${inked})`);
  // Class 12, one particle
  await page.click(R + '[data-level="12"]'); await page.click(R + '[data-v="one"]'); await page.waitForTimeout(200);
  { const e = await t('.rs-eq'), f = await t('.rs-facts');
    check(e.includes('1.44 MeV fm × 2 × 79 / 5 MeV = 45.50 fm') && e.includes('θ = 53.13°'), 'ruth: d = 45.5 fm and θ = 53.13° at b = d (Python)');
    check(f.includes('73.63 fm') && (await t('.rs-bv')) === '1.00 d = 45.5 fm' && await page.isVisible(R + '.rs-gr'), 'ruth: closest approach 73.63 fm, graph shown'); }
  await slide('.rs-b', 0.5);
  check((await t('.rs-eq')).includes('θ = 90°'), 'ruth: b = d/2 gives 90°');
  await slide('.rs-b', 0);
  check((await t('.rs-eq')).includes('θ = 180°'), 'ruth: head-on gives 180°');
  await slide('.rs-K', 10);
  check((await t('.rs-eq')).includes('/ 10 MeV = 22.75 fm'), 'ruth: twice the energy halves d');
  await page.selectOption(R + '.rs-t', 'al'); await page.waitForTimeout(150);
  check((await t('.rs-eq')).includes('× 2 × 13 / 10 MeV = 3.744 fm'), 'ruth: aluminium d = 3.744 fm');
  await page.click(R + '[data-m="pudding"]'); await page.waitForTimeout(150);
  check((await t('.rs-eq')).includes('θ = almost 0°'), 'ruth: pudding one particle almost 0°');
  await page.click(R + '[data-m="nucleus"]'); await page.click(R + '[data-v="beam"]'); await page.click(R + '[data-level="9"]');
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'ruth: five questions');
  for (const i of [0, 1]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  for (const i of [2, 3, 4]) { const a = +(await items[i].getAttribute('data-ans')); await (await items[i].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'ruth: all five answered right');
};
