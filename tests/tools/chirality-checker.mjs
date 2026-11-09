// #1107 Chirality and R/S checker
import { PRESETS, rank, descriptor, SITES } from '../../src/lib/sci/chirality.ts';
export const path = '/learn/chirality-checker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/chirality-checker/`); await page.waitForTimeout(1200);
  const t = (s) => page.textContent('.chk ' + s);
  check((await t('.ch-big')) === 'Butan-2-ol: chiral carbon, (R)', 'chiral: butan-2-ol R');
  check((await t('.ch-steps')).includes('Tie on C between C₂H₅ and CH₃') && (await t('.ch-steps')).includes('Priorities: 1 OH, 2 C₂H₅, 3 CH₃, 4 H'), 'chiral: priority steps');
  check((await t('.ch-rule')).includes('Press "Put 4 at the back"'), 'chiral: prompt');
  const img = () => page.$eval('.chk .ch-fig', (c) => c.toDataURL());
  const i0 = await img();
  await page.click('.chk .ch-back'); await page.waitForTimeout(100);
  check((await t('.ch-rule')).includes('With 4 (H) at the back, 1 → 2 → 3 goes clockwise → R') && (await img()) !== i0, 'chiral: 4 at the back, clockwise R');
  await page.click('.chk .ch-mirror'); await page.waitForTimeout(100);
  check((await t('.ch-big')) === 'Butan-2-ol (mirror image): chiral carbon, (S)' && (await t('.ch-rule')).includes('anticlockwise → S'), 'chiral: mirror image is S');
  await page.click('.chk .ch-swap'); await page.waitForTimeout(100);
  check((await t('.ch-big')) === 'Butan-2-ol (mirror image): chiral carbon, (R)', 'chiral: swap flips back to R');
  // Turning never changes the letter.
  await page.$eval('.chk .ch-fig', (c) => c.scrollIntoView({ block: 'center' })); await page.waitForTimeout(100);
  const b = await (await page.$('.chk .ch-fig')).boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width / 2 + 90, b.y + b.height / 2 + 40, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(100);
  check((await t('.ch-big')).endsWith('(R)') && (await t('.ch-rule')).includes('Press'), 'chiral: drag turns, letter stays');
  await page.uncheck('.chk .ch-pri'); await page.waitForTimeout(50);
  const noPri = await img(); await page.check('.chk .ch-pri'); await page.waitForTimeout(50);
  check(noPri !== (await img()), 'chiral: priorities on and off');
  for (const p of PRESETS) {
    await page.selectOption('.chk .ch-pre', p.id); await page.waitForTimeout(80);
    const r = rank(p.groups), want = r.chiral ? `chiral carbon, (${descriptor(SITES, r.order)})` : 'not chiral';
    check((await t('.ch-big')).endsWith(want), `chiral: ${p.id} ${want}`);
  }
  check(await page.isDisabled('.chk .ch-back') && (await t('.ch-steps')).includes('not a stereocentre'), 'chiral: not chiral disables the back button');
  await page.selectOption('.chk .ch-pre', 'glyceraldehyde'); await page.waitForTimeout(80);
  check((await t('.ch-steps')).includes('A double bond counts as two single bonds') && (await t('.ch-steps')).includes('1 OH, 2 CHO, 3 CH₂OH, 4 H'), 'chiral: glyceraldehyde priorities');
  // Build your own.
  await page.selectOption('.chk .ch-pre', 'own'); await page.waitForTimeout(80);
  await page.selectOption('.chk .ch-g0', 'H'); await page.selectOption('.chk .ch-g1', 'Br'); await page.selectOption('.chk .ch-g2', 'Cl'); await page.selectOption('.chk .ch-g3', 'I'); await page.waitForTimeout(80);
  const r = rank(['H', 'Br', 'Cl', 'I']);
  check(await page.isVisible('.chk .ch-own') && (await t('.ch-big')) === `C(H)(Br)(Cl)(I): chiral carbon, (${descriptor(SITES, r.order)})`, 'chiral: build your own');
  await page.selectOption('.chk .ch-g3', 'Cl'); await page.waitForTimeout(80);
  check((await t('.ch-big')).endsWith('not chiral'), 'chiral: own with two Cl not chiral');
  // Check yourself: read the right answers by answering R first.
  const sels = await page.$$('.chk .ch-qa');
  check(sels.length === 4 && (await page.$$('.chk .ch-q1 canvas')).length === 4, 'chiral: 4 questions with pictures');
  for (const s of sels) await s.selectOption('R');
  await page.click('.chk .ch-check');
  const right = await page.$$eval('.chk .ch-ans', (a) => a.map((x) => (x.textContent.startsWith('✓') ? 'R' : x.textContent.match(/It is (R|S|not chiral)\./)[1])));
  for (let i = 0; i < 4; i++) await sels[i].selectOption(right[i]);
  await page.click('.chk .ch-check');
  check((await t('.ch-score')) === '4 of 4 right' && (await t('.ch-qs')).includes('First atoms'), 'chiral: quiz all right with working');
  await page.click('.chk .ch-new');
  check((await t('.ch-score')) === '', 'chiral: new questions');
};
