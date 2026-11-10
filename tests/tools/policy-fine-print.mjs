// #1952 Policy fine-print finder
export const path = '/money/policy-fine-print/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/policy-fine-print/`); await page.waitForTimeout(300);
  await page.fill('.pf .pf-text', 'Pre-existing diseases are covered after a waiting period of 36 months. Room rent is limited to 1% of the sum insured per day.');
  await page.waitForTimeout(150);
  const found = await page.textContent('.pf .pf-found');
  check(found.includes('Waiting period') && found.includes('Pre-existing') && found.includes('Room rent'), 'policy-fine-print: finds waiting period, pre-existing and room rent');
  check(found.includes('36 months') && found.includes('1%'), 'policy-fine-print: lists 36 months and 1%');
  check((await page.$$('.pf .pf-hl mark')).length >= 3, 'policy-fine-print: highlights the clauses');
  check(await page.isVisible('.pf .pf-copy'), 'policy-fine-print: copy summary button shows');
  await page.fill('.pf .pf-text', 'The weather is fine today.'); await page.waitForTimeout(100);
  check(await page.isVisible('.pf .pf-none'), 'policy-fine-print: plain text shows the none-found note');
  await page.click('.pf .pf-sample'); await page.waitForTimeout(100);
  check((await page.textContent('.pf .pf-found')).includes('Co-payment'), 'policy-fine-print: example text finds a co-payment');
  await page.click('.pf .pf-clear'); await page.waitForTimeout(100);
  check(!(await page.isVisible('.pf .pf-res')), 'policy-fine-print: clear hides the results');
};
