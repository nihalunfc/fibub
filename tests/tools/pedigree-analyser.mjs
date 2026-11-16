// #1444 Pedigree analyser
import { quiz } from '../school-quiz-q.mjs';
export const path = '/learn/pedigree-analyser/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/pedigree-analyser/`); await page.waitForSelector('.pa .pa-svg g[data-id]');
  const verdicts = () => page.locator('.pa .pa-res li').evaluateAll((ls) => ls.map((l) => `${l.dataset.m}:${l.querySelector('.ok') ? 'y' : 'n'}`).join(' '));
  const dots = () => page.locator('.pa .pa-svg g[data-id]:has(circle.dot)').evaluateAll((gs) => gs.map((g) => g.dataset.id).join());
  check((await verdicts()) === 'AD:n AR:y XD:n XR:n Y:n' && (await dots()) === 'I-1,I-2,II-3,II-4', 'pedigree: skips a generation, AR only ' + (await dots()));
  check((await page.textContent('.pa .pa-res li[data-m="AD"]')).includes('II-5 is affected but neither parent is') && (await page.textContent('.pa .pa-note')).includes('Only autosomal recessive fits'), 'pedigree: reasons');
  const pre = (id) => page.click(`.pa .pa-pre [data-p="${id}"]`);
  await pre('sons'); check((await verdicts()) === 'AD:n AR:y XD:n XR:n Y:n'.replace('XR:n', 'XR:y'), 'pedigree: sons of carrier mothers');
  await page.click('.pa .pa-res li[data-m="XR"]'); check((await dots()) === 'II-3', 'pedigree: XR carrier II-3');
  await page.click('.pa .pa-tap [data-t="sex"]'); await page.locator('.pa .pa-svg g[data-id="III-3"] .hit').click();
  check((await verdicts()).includes('XR:n') && (await page.locator('.pa .pa-svg g[data-id="III-3"] circle.sym').count()) === 1, 'pedigree: III-3 a girl rules out XR');
  await page.locator('.pa .pa-svg g[data-id="I-1"] .hit').click(); check((await page.locator('.pa .pa-svg g[data-id="I-1"] rect.sym').count()) === 1, 'pedigree: grandparent sex is fixed');
  await page.click('.pa .pa-tap [data-t="aff"]');
  await pre('every'); check((await verdicts()) === 'AD:y AR:y XD:n XR:n Y:n' && (await page.textContent('.pa .pa-note')).includes('2 patterns fit'), 'pedigree: every generation');
  await pre('father-son'); check((await verdicts()) === 'AD:y AR:y XD:n XR:y Y:y', 'pedigree: father to son');
  await page.locator('.pa .pa-svg g[data-id="III-2"] .hit').click();
  check((await verdicts()).includes('Y:n') && (await page.textContent('.pa .pa-res li[data-m="Y"]')).includes('III-2 is a female'), 'pedigree: affected girl rules out Y');
  await page.locator('.pa .pa-svg g[data-id="III-2"]').focus(); await page.keyboard.press('Enter'); check((await verdicts()).includes('Y:y'), 'pedigree: keyboard toggles');
  // Chance for the next child
  const pa = () => page.textContent('.pa .pn-ans'), pset = async (m, mo, fa) => { await page.selectOption('.pa [data-k=pattern]', m); if (mo !== undefined) await page.selectOption('.pa [data-k=mother]', String(mo)); if (fa !== undefined) await page.selectOption('.pa [data-k=father]', String(fa)); };
  check((await pa()) === 'Each child, boy or girl, has a 25% (1/4) chance of being affected.', 'pedigree next child: Aa x Aa recessive ' + (await pa()));
  check((await page.textContent('.pa .pn-work')).includes('50% (1/2) × 50% (1/2) = 25% (1/4)'), 'pedigree next child: working');
  await pset('AR', 2, 1); check((await pa()).includes('50% (1/2) chance'), 'pedigree next child: aa x Aa');
  await pset('AR', 2, 2); check((await pa()).includes('100% chance'), 'pedigree next child: aa x aa');
  await pset('AR', 0, 0); check((await pa()).includes('0% chance'), 'pedigree next child: AA x AA');
  await pset('AD'); check((await pa()).includes('50% (1/2)'), 'pedigree next child: Aa x aa dominant ' + (await pa()));
  await pset('AD', 1, 1); check((await pa()).includes('75% (3/4)') && (await page.textContent('.pa .pn-work')).includes('1 − (1 − 0.5) × (1 − 0.5) = 75% (3/4)'), 'pedigree next child: Aa x Aa dominant');
  await pset('XR'); check((await pa()) === 'A son has a 50% (1/2) chance of being affected; a daughter has a 0% chance.', 'pedigree next child: carrier mother XR ' + (await pa()));
  await pset('XR', 2, 0); check((await pa()) === 'A son has a 100% chance of being affected; a daughter has a 0% chance.', 'pedigree next child: affected mother XR');
  await pset('XR', 1, 1); check((await pa()) === 'A son has a 50% (1/2) chance of being affected; a daughter has a 50% (1/2) chance.', 'pedigree next child: carrier mother, affected father XR');
  await pset('XD'); check((await pa()) === 'A son has a 0% chance of being affected; a daughter has a 100% chance.', 'pedigree next child: affected father XD ' + (await pa()));
  await pset('Y'); check((await pa()) === 'A son has a 100% chance of being affected; a daughter has a 0% chance.' && await page.isDisabled('.pa [data-k=mother]'), 'pedigree next child: Y-linked');
  await pset('AR');
  await quiz(page, check, '.pa', 'pedigree');
};
