// #1456 recombinant insulin (sticky ends and selection checked in tests/sci-tools/recombinant-insulin.mjs)
export const path = '/learn/recombinant-insulin/';
export default async ({ page, check, BASE }) => {
  const R = '.rin ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/recombinant-insulin/`); await page.waitForTimeout(400);
  check((await t('.ri-step')) === 'Step 1 of 7' && (await t('.ri-text')).includes('21 amino acids'), 'insulin: step 1');
  await page.click(R + '.ri-next'); check((await t('.ri-text')).includes('69 bp for A and 96 bp for B'), 'insulin: gene lengths');
  await page.click(R + '.ri-next'); check(!(await page.$eval(R + '.ri-cut', (e) => e.hidden)), 'insulin: enzyme choice shown');
  check((await t('.ri-ends')).includes('5′ sticky ends AATT') && (await t('.ri-ends')).includes('ligase can join'), `insulin: EcoRI ends (${await t('.ri-ends')})`);
  await page.selectOption(R + '.ri-eg', 'BamHI'); check((await t('.ri-ends')).includes('cannot pair'), 'insulin: mismatched ends');
  await page.selectOption(R + '.ri-ep', 'SmaI'); await page.selectOption(R + '.ri-eg', 'SmaI'); check((await t('.ri-ends')).includes('Blunt ends can be joined'), 'insulin: blunt ends');
  await page.click(R + '.ri-dots li:nth-child(5) button');
  check((await t('.ri-selsay')).includes('ampicillin: 18') && (await t('.ri-selsay')).includes('tetracycline: 12') && (await t('.ri-selsay')).includes('6 colonies'), `insulin: plates (${await t('.ri-selsay')})`);
  await page.check(R + '.ri-reveal');
  const px = await page.evaluate(() => { const c = document.querySelector('.ri-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 150 && d[i + 1] < 80 && d[i + 2] < 80) n++; return n; });
  check(px > 100, `insulin: recombinant colonies coloured (${px})`);
  await page.click(R + '.ri-next'); await page.click(R + '.ri-next'); check((await t('.ri-step')) === 'Step 7 of 7', 'insulin: last step');
  await page.click(R + '.ri-next'); check((await t('.ri-step')) === 'Step 7 of 7', 'insulin: stays at last step');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'insulin: five quiz questions');
  const q1 = (await t('.smq-q:nth-child(1) .smq-text')).match(/\d+/g).map(Number);
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', String(3 * q1[0] + 6)); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', 'insulin: quiz bp');
};
