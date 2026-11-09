// #481 APGAR and Glasgow Coma Scale
export const path = '/science/clinical-scores/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/clinical-scores/`); await page.waitForTimeout(500);
  const R = '.cs ';
  const tap = async (name, v) => { const l = page.locator(`${R}input[name="${name}"][value="${v}"]`); await l.scrollIntoViewIfNeeded(); await l.check(); await page.waitForTimeout(40); };
  check((await page.textContent(R + '.cs-warn')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'scores: medical note shown');
  check((await page.textContent(R + '.cs-apout')) === 'APGAR at 1 minute: 8 / 10' && (await page.textContent(R + '.cs-apband')).includes('7 to 10: reassuring'), 'scores: example APGAR 8');
  check((await page.textContent(R + '.cs-gout')) === 'E3V4M5 = 12' && (await page.textContent(R + '.cs-gband')).includes('9 to 12: moderate'), 'scores: example GCS E3V4M5 = 12');
  // APGAR boundaries 7 / 6 / 4 / 3 / 0 / 10.
  await tap('cs-ap-Ac', 1); check((await page.textContent(R + '.cs-apout')).endsWith(': 7 / 10') && (await page.textContent(R + '.cs-apband')).includes('reassuring'), 'scores: APGAR 7 reassuring');
  await tap('cs-ap-R', 1); check((await page.textContent(R + '.cs-apout')).endsWith(': 6 / 10') && (await page.textContent(R + '.cs-apband')).includes('6: moderately abnormal'), 'scores: APGAR 6 moderate');
  await tap('cs-ap-P', 0); await tap('cs-ap-A', 0); check((await page.textContent(R + '.cs-apout')).endsWith(': 3 / 10') && (await page.textContent(R + '.cs-apband')).includes('0 to 3: low'), 'scores: APGAR 3 low');
  await tap('cs-ap-A', 1); check((await page.textContent(R + '.cs-apband')).includes('4 to 6'), 'scores: APGAR 4 moderate');
  for (const k of ['A', 'P', 'G', 'Ac', 'R']) await tap(`cs-ap-${k}`, 0);
  check((await page.textContent(R + '.cs-apout')).endsWith(': 0 / 10'), 'scores: APGAR 0');
  for (const k of ['A', 'P', 'G', 'Ac', 'R']) await tap(`cs-ap-${k}`, 2);
  await page.selectOption(R + '.cs-min', '5'); await page.waitForTimeout(50);
  check((await page.textContent(R + '.cs-apout')) === 'APGAR at 5 minutes: 10 / 10', 'scores: APGAR 10 at 5 minutes');
  // GCS boundaries.
  await tap('cs-g-e', 4); await tap('cs-g-va', 4); await tap('cs-g-ma', 5);
  check((await page.textContent(R + '.cs-gout')) === 'E4V4M5 = 13' && (await page.textContent(R + '.cs-gband')).includes('13 to 15: mild'), 'scores: GCS 13 mild');
  await tap('cs-g-ma', 4); check((await page.textContent(R + '.cs-gband')).includes('9 to 12: moderate'), 'scores: GCS 12 moderate');
  await tap('cs-g-e', 2); await tap('cs-g-va', 2); await tap('cs-g-ma', 5); check((await page.textContent(R + '.cs-gout')) === 'E2V2M5 = 9' && (await page.textContent(R + '.cs-gband')).includes('moderate'), 'scores: GCS 9 moderate');
  await tap('cs-g-ma', 4); check((await page.textContent(R + '.cs-gout')) === 'E2V2M4 = 8' && (await page.textContent(R + '.cs-gband')).includes('3 to 8: severe'), 'scores: GCS 8 severe');
  await tap('cs-g-e', 1); await tap('cs-g-va', 1); await tap('cs-g-ma', 1); check((await page.textContent(R + '.cs-gout')) === 'E1V1M1 = 3', 'scores: GCS 3');
  await tap('cs-g-va', -1); check((await page.textContent(R + '.cs-gout')) === 'E1VNTM1' && (await page.textContent(R + '.cs-gband')).includes('No total'), 'scores: not testable verbal');
  // Young child wording.
  await page.locator(R + '.cs-ver').scrollIntoViewIfNeeded(); await page.click(R + '.cs-ver button[data-v="child"]'); await page.waitForTimeout(80);
  check(await page.isVisible(R + 'fieldset[data-set="vc"]') && await page.isHidden(R + 'fieldset[data-set="va"]') && (await page.textContent(R + 'fieldset[data-set="vc"]')).includes('Coos, babbles'), 'scores: young child wording shown');
  check((await page.textContent(R + '.cs-gout')) === 'E1V4M5 = 10', 'scores: child pickers start at their own defaults');
  await tap('cs-g-e', 4); await tap('cs-g-vc', 5); await tap('cs-g-mc', 6); check((await page.textContent(R + '.cs-gout')) === 'E4V5M6 = 15' && (await page.textContent(R + '.cs-gband')).includes('mild'), 'scores: child GCS 15');
  await page.locator(R + '.dl').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f="pdf"]')]); const f = OUT + 'scores.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'scores: PDF download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f="png"]')]); const f = OUT + 'scores.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'scores: PNG download'); }
};
