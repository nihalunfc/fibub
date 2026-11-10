// #T878 Top-up vs super top-up
export const path = '/money/super-top-up/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/super-top-up/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.stu [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  const txt = async (c) => page.textContent(`.stu ${c}`);
  await page.selectOption('.stu [data-k="cur"]', 'INR');
  await set('ded', '500000'); await set('si', '1000000'); await set('base', '500000');
  check((await txt('.stu-s-t')).replace(/\D/g, '') === '0', 'super-top-up: top-up pays 0 (' + (await txt('.stu-s-t')) + ')');
  check((await txt('.stu-s-s')).includes('4,00,000'), 'super-top-up: super top-up pays 4,00,000 (' + (await txt('.stu-s-s')) + ')');
  check((await txt('.stu-words')).includes('nothing'), 'super-top-up: says the plain top-up pays nothing');
  check((await page.$$('.stu .stu-body tr')).length === 3, 'super-top-up: three bill rows');
  await page.click('.stu .stu-add'); await page.waitForTimeout(80);
  check((await page.$$('.stu .stu-body tr')).length === 4 || await page.isVisible('.stu .stu-err'), 'super-top-up: add a bill');
  await page.fill('.stu .stu-bill >> nth=3', '700000'); await page.waitForTimeout(80);
  check((await txt('.stu-s-t')).includes('2,00,000'), 'super-top-up: a 7,00,000 bill makes the top-up pay 2,00,000 (' + (await txt('.stu-s-t')) + ')');
  await page.click('.stu .stu-del >> nth=3'); await page.waitForTimeout(80);
  check((await page.$$('.stu .stu-body tr')).length === 3, 'super-top-up: remove a bill');
};
