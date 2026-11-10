// #1739 CPP start age
export const path = '/money/cpp-oas-age/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/cpp-oas-age/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.co [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  const t = async (c) => (await page.textContent(`.co ${c}`)).trim();
  await set('cpp', '1000');
  await page.selectOption('.co [data-k="cage"]', '70'); await page.waitForTimeout(80);
  check((await t('.co-s-cpp')).includes('1,420.00'), 'cpp-oas-age: CPP at 70 = 142% of 65');
  check((await t('.co-line')).includes('81.9'), 'cpp-oas-age: break-even 65 vs 70 at 81.9');
  await page.selectOption('.co [data-k="cage"]', '60'); await page.waitForTimeout(80);
  check((await t('.co-s-cpp')).includes('640.00'), 'cpp-oas-age: CPP at 60 = 64%');
  await page.selectOption('.co [data-k="oage"]', '70'); await page.waitForTimeout(80);
  check((await t('.co-oas')).includes('136%'), 'cpp-oas-age: OAS at 70 = 136%');
  await page.selectOption('.co [data-k="oage"]', '65'); await set('inc', '120000');
  check((await t('.co-s-claw')).includes('3,702'), 'cpp-oas-age: clawback on 120,000 = 3,702');
  await set('cpp', '0');
  check(await page.isVisible('.co .co-err'), 'cpp-oas-age: empty CPP shows a message');
};
