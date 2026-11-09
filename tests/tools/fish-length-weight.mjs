// #331 Fish length-weight
export const path = '/science/fish-length-weight/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/fish-length-weight/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.flw .fl-big'), facts = () => page.textContent('.flw .fl-facts');
  check((await big()) === 'W = 0.01050 × L^3.089 (positive allometric)', 'fish: example fit headline');
  { const f = await facts(); check(f.includes('× 1.0013); 0.01049 uncorrected') && f.includes('3.089 ± 0.031') && f.includes('95 % CI 3.025 to 3.154') && f.includes('t = 2.91, df 18, p = 0.0093') && f.includes('0.9982') && f.includes("Fulton's K1.35") && f.includes('Kn1.000 ±'), 'fish: example b, CI, isometry test, R², K'); }
  check((await page.textContent('.flw .fl-tab')).includes('110.815.916.361.260.972'), 'fish: per-fish table');
  await page.selectOption('.flw .fl-cf', '0'); await page.waitForTimeout(400);
  check((await big()).startsWith('W = 0.01049') && (await facts()).includes('uncorrected; for L in cm'), 'fish: bias correction off');
  await page.selectOption('.flw .fl-conf', '0.99'); await page.waitForTimeout(400);
  check((await facts()).includes('99 % CI'), 'fish: 99 % interval');
  await page.selectOption('.flw .fl-kn', 'own'); await page.fill('.flw .fl-a', '0.012'); await page.fill('.flw .fl-b', '3'); await page.waitForTimeout(400);
  check((await facts()).includes('from your a = 0.012, b = 3'), 'fish: Kn from own a and b');
  await page.fill('.flw .fl-a', '-1'); await page.waitForTimeout(400);
  check((await page.textContent('.flw .fl-err')).includes('your own a'), 'fish: bad own a message');
  await page.selectOption('.flw .fl-kn', 'fit'); await page.waitForTimeout(400);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.flw .fl-csv')]); const f = OUT + 'fish.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 28 && rows[0] === 'fish,length_cm,weight_g,predicted_g,fulton_K,Kn,flag' && rows[1].startsWith('1,10.8,15.9,'), 'fish: CSV download'); }
  // mm and kg, header in another order, one typing slip.
  await page.fill('.flw .fl-data', 'weight,length\n0.0159,108\n0.0872,190\n0.137,212\n0.008,86\n0.0172,113\n0.3136,284\n0.011,95\n0.0161,109\n0.3177,289\n0.1441,217\n0.0605,161\n0.0988,193\n0.1558,226\n0.039,141\n0.0185,110\n0.2266,253\n0.1707,227\n0.1067,193\n0.2478,260\n0.1082,201');
  await page.selectOption('.flw .fl-lu', '0.1'); await page.selectOption('.flw .fl-wu', '1000'); await page.selectOption('.flw .fl-cf', '1'); await page.selectOption('.flw .fl-conf', '0.95'); await page.waitForTimeout(500);
  check((await big()) === 'W = 0.01050 × L^3.089 (positive allometric)' && (await page.textContent('.flw .fl-more')).includes('shown in cm and g'), 'fish: mm and kg with header columns swapped give the same fit');
  await page.fill('.flw .fl-data', '1,10,10\n2,20,80\n3,30,270\n4,40,640\n5,25,156\n6,15,34\n7,35,429\n8,22,106\n9,18,58\n10,28,220\n11,12,17\n12,33,360\n13,38,550\n14,26,9000');
  await page.selectOption('.flw .fl-lu', '1'); await page.selectOption('.flw .fl-wu', '1'); await page.waitForTimeout(500);
  check((await facts()).includes('1 fish far off the line') && (await page.textContent('.flw .fl-tab')).includes('!'), 'fish: outlier flagged');
  await page.fill('.flw .fl-data', '1,10,10\n2,0,5\n3,30,270'); await page.waitForTimeout(400);
  check((await page.textContent('.flw .fl-err')).includes('above zero') && await page.isHidden('.flw .fl-out'), 'fish: zero length message');
  await page.fill('.flw .fl-data', '10,10\n20,80'); await page.waitForTimeout(400);
  check((await page.textContent('.flw .fl-err')).includes('at least 3 fish'), 'fish: too few fish message');
};
