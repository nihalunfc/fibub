// #1398 Respiration ATP ledger
export const path = '/learn/respiration-atp/';
export default async ({ page, check, BASE }) => {
  const R = '.rat ', t = (s) => page.textContent(R + s);
  const tap = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); await page.click(R + sel); await page.waitForTimeout(150); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(700);
  check((await t('.ra-big')) === 'Stage 1 of 4: Glycolysis (cytoplasm)' && (await t('.ra-facts')).includes('Total ATP so far2'), 'resp: glycolysis');
  await tap('.ra-next'); await tap('.ra-next');
  check((await t('.ra-big')).startsWith('Stage 3 of 4: Krebs cycle') && (await t('.ra-facts')).includes('NADH10') && (await t('.ra-facts')).includes('CO₂ given off6'), 'resp: Krebs totals');
  await tap('.ra-next');
  check((await t('.ra-facts')).includes('Total ATP so far38') && (await t('.ra-eq')) === 'Total = 4 (made directly) + 10 NADH × 3 + 2 FADH₂ × 2 = 4 + 30 + 4 = 38 ATP.', `resp: 38 ATP (${await t('.ra-eq')})`);
  await tap('.ra-count button[data-c=new]');
  check((await t('.ra-eq')).endsWith('= 4 + 25 + 3 = 32 ATP.'), 'resp: newer count 32');
  await slide('.ra-g', 3);
  check((await t('.ra-facts')).includes('Total ATP so far96') && (await t('.ra-facts')).includes('O₂ used18'), 'resp: 3 glucose');
  await tap('.ra-back');
  check((await t('.ra-big')).startsWith('Stage 3 of 4'), 'resp: back');
  await tap('.ra-count button[data-c=old]'); await slide('.ra-g', 1);
  await tap('.ra-anaer');
  check((await t('.ra-big')) === 'Stage 1 of 2: Glycolysis (cytoplasm)' && await page.isVisible(R + '.ra-ferm'), 'resp: no oxygen starts at glycolysis');
  await tap('.ra-next');
  check((await t('.ra-big')) === 'Stage 2 of 2: Alcoholic fermentation (cytoplasm)' && (await t('.ra-facts')).includes('CO₂ given off2') && (await t('.ra-eq')).includes('19 times as much'), 'resp: alcoholic fermentation');
  await page.selectOption(R + '.ra-ferm', 'lac');
  check((await t('.ra-big')).includes('Lactic acid') && (await t('.ra-facts')).includes('CO₂ given off0'), 'resp: lactic acid');
  const inked = await page.$eval(R + '.ra-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] < 200 || Math.abs(d[i] - d[i + 2]) > 50) n++; return n; });
  check(inked > 200, 'resp: picture drawn');
  // RQ
  check((await t('.ra-rq')) === 'RQ = 1 (carbohydrate-like)', `resp: glucose RQ (${await t('.ra-rq')})`);
  await page.selectOption(R + '.ra-sub', 'tripalmitin');
  check((await t('.ra-rq')) === 'RQ = 0.703 (fat-like)' && (await t('.ra-rqeq')).startsWith('C51H98O6 + 72.5 O₂ → 51 CO₂ + 49 H₂O.'), `resp: tripalmitin (${await t('.ra-rqeq')})`);
  await page.fill(R + '.ra-f', 'C2H2O4'); await page.waitForTimeout(100);
  check((await t('.ra-rq')).startsWith('RQ = 4 (more than 1'), 'resp: oxalic acid typed');
  await page.fill(R + '.ra-f', 'NaCl'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.ra-err') && (await t('.ra-rq')) === '', 'resp: bad formula message');
  const items = await page.$$(R + '.lq-item');
  for (const i of [0, 1, 2, 3]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(5))); await (await items[i].$('.lq-check')).click(); }
  { const a = +(await items[4].getAttribute('data-ans')); await (await items[4].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'resp: all answered right');
};
