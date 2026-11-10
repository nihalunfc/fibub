// #T902 Medical words explainer
export const path = '/documents/medical-terms/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  await page.fill('.mt-in', 'Take 1 tab bd pc. CBC unremarkable.');
  const words = (await page.$$eval('.mt-w', (els) => els.map((e) => e.textContent.toLowerCase())));
  for (const w of ['bd', 'pc', 'cbc', 'unremarkable']) check(words.includes(w), `medical-terms: finds "${w}" (${words.join(',')})`);
  await page.click('.mt-w[data-term=bd]');
  check((await page.textContent('.mt-def')).toLowerCase().includes('twice'), 'medical-terms: tapping a word shows its meaning');
  await page.fill('.mt-q', 'prn');
  check((await page.textContent('.mt-res')).toLowerCase().includes('as needed'), 'medical-terms: search "prn" shows a meaning');
  await page.click('.mt-az button:nth-child(1)');
  check((await page.$$('.mt-az-list dt')).length > 0, 'medical-terms: A to Z lists words');
  await page.fill('.mt-in', 'A lesion was seen.');
  check((await page.textContent('.mt-found')).includes('Your doctor can explain'), 'medical-terms: a frightening-sounding word stays neutral with the doctor sentence');
};
