// #1395 Protein structure levels
export const path = '/learn/protein-structure/';
export default async ({ page, check, BASE }) => {
  const R = '.pst ', t = (s) => page.textContent(R + s);
  const tap = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); await page.click(R + sel); await page.waitForTimeout(200); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(150); };
  const inked = () => page.$eval(R + '.ps-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] < 200 || Math.abs(d[i] - d[i + 2]) > 50) n++; return n; });
  await page.goto(BASE + path); await page.waitForTimeout(700);
  check((await t('.ps-big')) === '20 amino acids joined by 19 peptide bonds', `protein: primary (${await t('.ps-big')})`);
  const f = await t('.ps-facts');
  check(f.includes('Water released19 H₂O') && f.includes('Mass2262.7 Da') && f.includes('Water-fearing11 of 20') && f.includes('1.05 × 10^26'), `protein: primary facts (${f})`);
  check((await inked()) > 300, 'protein: primary drawn');
  await page.fill(R + '.ps-seq', 'GA'); await page.waitForTimeout(150);
  check((await t('.ps-facts')).includes('Mass146.15 Da') && (await t('.ps-big')).startsWith('2 amino acids joined by 1 peptide'), `protein: GA (${await t('.ps-facts')})`);
  await page.fill(R + '.ps-seq', 'G'); await page.waitForTimeout(150);
  check(await page.isVisible(R + '.ps-err'), 'protein: too short gives a message');
  await page.fill(R + '.ps-seq', 'mklv-1aef'); await page.waitForTimeout(150);
  check((await t('.ps-err')).includes('2 characters were left out') && (await t('.ps-big')).startsWith('7 amino acids'), 'protein: bad letters left out');
  await page.fill(R + '.ps-seq', 'MKLVAEFGSDLIKAWRVLEG'); await page.waitForTimeout(150);
  await tap('.ps-lv button[data-v="2"]');
  check((await t('.ps-big')) === 'As one α-helix: 5.56 turns, 3 nm long' && (await t('.ps-eq')).includes('20 × 0.15 = 3 nm'), `protein: helix (${await t('.ps-big')})`);
  check((await inked()) > 300, 'protein: helix drawn');
  await tap('.ps-ss button[data-v=b]');
  check((await t('.ps-big')) === 'As β-strands: about 6.6 nm of stretched chain', 'protein: sheet');
  await tap('.ps-lv button[data-v="3"]'); await page.waitForTimeout(4000);
  const m = (await t('.ps-facts')).match(/buried(\d+) of 11/);
  check(m && +m[1] >= 6, `protein: folding buries water-fearing beads (${await t('.ps-facts')})`);
  await slide('.ps-t', 85); await page.waitForTimeout(300);
  check((await t('.ps-big')).startsWith('Too hot'), 'protein: heat denatures');
  await slide('.ps-t', 25); await tap('.ps-unfold');
  check((await t('.ps-facts')).includes('5.77'), 'protein: stretched out again');
  await tap('.ps-lv button[data-v="4"]');
  check((await t('.ps-big')).startsWith('Haemoglobin: 4 chains') && (await t('.ps-facts')).includes('574'), 'protein: quaternary');
  await tap('.ps-join'); await page.waitForTimeout(600);
  check((await t('.ps-big')) === 'Four separate chains' && (await t('.ps-join')) === 'Join the chains', 'protein: separate chains');
  const items = await page.$$(R + '.lq-item');
  for (const i of [0, 1, 2, 3]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(6))); await (await items[i].$('.lq-check')).click(); }
  { const a = +(await items[4].getAttribute('data-ans')); await (await items[4].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'protein: all answered right');
};
