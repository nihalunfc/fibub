// #1103 MO diagram for diatomic molecules
import { fillMO, speciesName } from '../../src/lib/sci/modiagram.ts';
export const path = '/learn/mo-diagram/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/mo-diagram/`); await page.waitForTimeout(1200);
  const t = (s) => page.textContent('.mod ' + s);
  check((await t('.mo-big')) === 'O₂: bond order 2, paramagnetic', 'mo: O2 example');
  check((await t('.mo-formula')) === 'Bond order = ½ (bonding − antibonding) = ½ (10 − 6) = 2', 'mo: formula with live numbers');
  check((await t('.mo-config')).endsWith('π*2px¹ π*2py¹') && (await t('.mo-facts')).includes('Unpaired electrons2'), 'mo: O2 configuration');
  check((await t('.mo-mixhelp')).startsWith('Off (auto)'), 'mo: O2 no mixing');
  const px = () => page.$eval('.mod .mo-fig', (c) => c.toDataURL());
  const full = await px();
  check(full.length > 5000, 'mo: diagram drawn');
  // Fill slider.
  await page.$eval('.mod .mo-fill', (e) => { e.value = '13'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(150);
  check((await t('.mo-big')) === 'O₂: 13 of 16 electrons placed' && (await t('.mo-fv')) === '13 of 16' && (await t('.mo-config')).endsWith('π2px² π2py¹') && (await px()) !== full, 'mo: fill slider part way');
  await page.$eval('.mod .mo-fill', (e) => { e.value = '0'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(150);
  check((await t('.mo-config')) === 'Configuration: (empty)', 'mo: empty');
  // Charge resets the slider to full.
  await page.selectOption('.mod .mo-q', '1'); await page.waitForTimeout(150);
  check((await t('.mo-big')) === 'O₂⁺: bond order 2½, paramagnetic' && (await t('.mo-fv')) === '15 of 15', 'mo: O2+');
  await page.selectOption('.mod .mo-q', '-2'); await page.waitForTimeout(150);
  check((await t('.mo-big')) === 'O₂²⁻: bond order 1, diamagnetic', 'mo: O2 2-');
  await page.selectOption('.mod .mo-q', '0'); await page.selectOption('.mod .mo-el', 'N'); await page.waitForTimeout(150);
  check((await t('.mo-big')) === 'N₂: bond order 3, diamagnetic' && (await t('.mo-config')).endsWith('π2px² π2py² σ2pz²') && (await t('.mo-mixhelp')).startsWith('On (auto)'), 'mo: N2 with mixing');
  await page.selectOption('.mod .mo-el', 'B'); await page.waitForTimeout(150);
  check((await t('.mo-big')) === 'B₂: bond order 1, paramagnetic', 'mo: B2 paramagnetic');
  await page.click('.mod .mo-mix button[data-m="off"]'); await page.waitForTimeout(150);
  check((await t('.mo-big')) === 'B₂: bond order 1, diamagnetic' && (await t('.mo-mixhelp')).startsWith('Off:'), 'mo: B2 without mixing');
  await page.click('.mod .mo-mix button[data-m="on"]'); await page.selectOption('.mod .mo-el', 'O'); await page.waitForTimeout(150);
  check((await t('.mo-big')) === 'O₂: bond order 2, paramagnetic' && (await t('.mo-config')).includes('π2py² σ2pz²'), 'mo: O2 with mixing on');
  await page.click('.mod .mo-mix button[data-m="auto"]');
  await page.selectOption('.mod .mo-el', 'He'); await page.waitForTimeout(150);
  check((await t('.mo-big')) === 'He₂: bond order 0, does not exist' && (await t('.mo-facts')).includes('not stable'), 'mo: He2 does not exist');
  await page.selectOption('.mod .mo-el', 'H'); await page.selectOption('.mod .mo-q', '2'); await page.waitForTimeout(150);
  check((await t('.mo-err')).includes('no electrons') && await page.isVisible('.mod .mo-err'), 'mo: H2 2+ message');
  await page.selectOption('.mod .mo-el', 'Ne'); await page.selectOption('.mod .mo-q', '-1'); await page.waitForTimeout(150);
  check((await t('.mo-err')).includes('at most 20'), 'mo: Ne2- message');
  await page.selectOption('.mod .mo-q', '0'); await page.selectOption('.mod .mo-el', 'O'); await page.waitForTimeout(150);
  check(await page.isHidden('.mod .mo-err'), 'mo: message clears');
  // Table across the period.
  const rows = await page.$$eval('.mod .mo-table tbody tr', (r) => r.map((x) => x.textContent));
  check(rows.length === 10 && rows[6] === 'N₂1430diamagnetic' && rows[7] === 'O₂1622paramagnetic' && rows[9].includes('not stable'), 'mo: table across the period');
  // Check yourself.
  const qs = await page.$$eval('.mod .mo-q1 label', (l) => l.map((x) => x.firstChild.textContent));
  check(qs.length === 4, 'mo: 4 questions');
  const name2 = (s) => { for (const e of ['He', 'Li', 'H', 'B', 'C', 'N', 'O', 'F']) for (const c of [-2, -1, 0, 1, 2]) if (s.includes(` ${speciesName(e, c)}?`) || s.includes(` ${speciesName(e, c)} paramagnetic`)) return fillMO(e, c); };
  const ins = await page.$$('.mod .mo-qa');
  for (let i = 0; i < 4; i++) { const r = name2(qs[i]); if (qs[i].includes('bond order')) await ins[i].fill(String(r.bondOrder)); else await ins[i].selectOption(r.magnetic); }
  await page.click('.mod .mo-check');
  check((await t('.mo-score')) === '4 of 4 right', `mo: quiz all right (${await t('.mo-score')})`);
  const r0 = name2(qs[0]);
  await ins[0].fill(String(r0.bondOrder + 1)); await page.click('.mod .mo-check');
  check((await t('.mo-score')) === '3 of 4 right' && (await t('.mo-qs')).includes('✗ The answer is'), 'mo: wrong answer shows working');
  if (!Number.isInteger(r0.bondOrder)) { await ins[0].fill(`${Math.floor(r0.bondOrder) || ''}½`); await page.click('.mod .mo-check'); check((await t('.mo-score')) === '4 of 4 right', 'mo: ½ accepted'); }
  await page.click('.mod .mo-new');
  check((await t('.mo-score')) === '', 'mo: new questions');
};
