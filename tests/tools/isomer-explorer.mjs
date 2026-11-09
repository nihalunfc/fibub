// #1106 Isomer explorer
import { FORMULAS, isomersOf, relation } from '../../src/lib/sci/isomers.ts';
export const path = '/learn/isomer-explorer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/isomer-explorer/`); await page.waitForTimeout(1200);
  const t = (s) => page.textContent('.ise ' + s);
  check((await t('.is-big')) === 'C₄H₁₀O: 7 structural isomers' && (await t('.is-note')).includes('4 alcohols, 3 ethers') && (await t('.is-note')).includes('1 has a chiral carbon'), 'isomers: C4H10O');
  const names = () => page.$$eval('.ise .is-list .is-name', (n) => n.map((x) => x.textContent));
  check((await names()).includes('ethoxyethane') && (await page.$$('.ise .is-list button')).length === 7, 'isomers: 7 cards');
  check((await t('.is-cmp')).includes('Tap two'), 'isomers: compare prompt');
  const tap = async (name) => { const i = (await names()).indexOf(name); await page.click(`.ise .is-list button[data-i="${i}"]`); await page.waitForTimeout(80); };
  await tap('butan-1-ol');
  check((await t('.is-cmp')).includes('Picked butan-1-ol'), 'isomers: one picked');
  await tap('butan-2-ol');
  check((await t('.is-cmp')).startsWith('butan-1-ol and butan-2-ol: position isomers.'), 'isomers: position');
  await tap('butan-2-ol'); await tap('2-methylpropan-1-ol');
  check((await t('.is-cmp')).startsWith('butan-1-ol and 2-methylpropan-1-ol: chain isomers.'), 'isomers: chain');
  await tap('ethoxyethane');
  check((await t('.is-cmp')).startsWith('2-methylpropan-1-ol and ethoxyethane: functional isomers.') && (await page.$$('.ise .is-list button[aria-pressed=true]')).length === 2, 'isomers: functional, oldest pick dropped');
  await tap('2-methylpropan-1-ol'); await tap('1-methoxypropane');
  check((await t('.is-cmp')).startsWith('ethoxyethane and 1-methoxypropane: metamers.'), 'isomers: metamers');
  check((await t('.is-list')).includes('CH₃–CH(OH)–CH₂–CH₃'), 'isomers: condensed formula shown');
  await page.selectOption('.ise .is-f', 'C7H16'); await page.waitForTimeout(150);
  check((await t('.is-big')) === 'C₇H₁₆: 9 structural isomers' && (await t('.is-cmp')).includes('Tap two') && (await t('.is-note')).includes('2 have a chiral carbon'), 'isomers: heptanes');
  await page.selectOption('.ise .is-f', 'C5H10'); await page.waitForTimeout(150);
  check((await t('.is-big')) === 'C₅H₁₀: 5 structural isomers' && (await t('.is-note')).includes('gives 6') && (await t('.is-note')).includes('cyclopentane') && (await t('.is-list')).includes('cis and trans'), 'isomers: pentenes with cis/trans');
  await page.selectOption('.ise .is-f', 'C4H8O2'); await page.waitForTimeout(150);
  check((await t('.is-big')) === 'C₄H₈O₂: 6 structural isomers' && (await names()).includes('ethyl ethanoate'), 'isomers: acids and esters');
  // Check yourself.
  const qs = await page.$$eval('.ise .is-q1 label', (l) => l.map((x) => x.firstChild.textContent));
  check(qs.length === 4, 'isomers: 4 questions');
  const all = FORMULAS.map((f) => [f, isomersOf(f)]);
  const ans = qs.map((s) => {
    if (s.includes('How many')) { const [f, iso] = all.find(([f]) => s.includes(` ${f.label} `)); return String(iso.length); }
    for (const [, iso] of all) for (const a of iso) for (const b of iso) if (a !== b && s.includes(`are ${a.name} (${a.condensed}) and ${b.name} (${b.condensed})?`)) return relation(a, b).kind;
  });
  const ins = await page.$$('.ise .is-qa');
  for (let i = 0; i < 4; i++) { if (qs[i].includes('How many')) await ins[i].fill(ans[i]); else await ins[i].selectOption(ans[i]); }
  await page.click('.ise .is-check');
  check((await t('.is-score')) === '4 of 4 right', `isomers: quiz all right (${await t('.is-score')})`);
  await ins[0].fill(String(Number(ans[0]) + 1)); await page.click('.ise .is-check');
  check((await t('.is-score')) === '3 of 4 right' && (await t('.is-qs')).includes('✗ The answer is'), 'isomers: wrong answer shows the list');
  await page.click('.ise .is-new');
  check((await t('.is-score')) === '', 'isomers: new questions');
};
