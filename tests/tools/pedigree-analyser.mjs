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
  await quiz(page, check, '.pa', 'pedigree');
};
