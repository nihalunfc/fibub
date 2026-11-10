// #1244 Tessellation and symmetry studio
export const path = '/learn/tessellation-studio/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/tessellation-studio/`); await page.waitForSelector('.ts .ts-fig .ts-poly');
  const R = '.ts ', txt = (s) => page.textContent(R + s);
  check((await page.$$(R + '.ts-fig .ts-poly')).length === 4 && (await txt('.ts-sum')).startsWith('60° + 90° + 120° + 90° = 360°') && (await txt('.ts-verdict')) === 'Exactly 360°: they fit with no gap.', 'ts: 3.4.6.4 closes');
  await page.click(R + '.ts-pre[data-p="5,5,5"]'); await page.waitForTimeout(80);
  check((await txt('.ts-verdict')) === 'A gap of 36° is left.' && (await page.$$(R + '.ts-gap')).length === 1, 'ts: three pentagons leave 36°');
  await page.click(R + '.ts-add button[data-n="5"]'); await page.waitForTimeout(80);
  check((await txt('.ts-verdict')) === 'They overlap by 72°.' && (await page.$$(R + '.ts-over')).length === 1, 'ts: a fourth pentagon overlaps by 72°');
  await page.click(R + '.ts-undo'); await page.click(R + '.ts-clear'); await page.waitForTimeout(80);
  check((await page.$$(R + '.ts-fig .ts-poly')).length === 0 && (await txt('.ts-sum')) === 'Tap a shape to start.', 'ts: clear');
  await page.click(R + '.ts-add button[data-n="4"]'); await page.click(R + '.ts-add button[data-n="8"]'); await page.click(R + '.ts-add button[data-n="8"]'); await page.waitForTimeout(80);
  check((await txt('.ts-sum')).startsWith('90° + 135° + 135° = 360°') && (await txt('.ts-verdict')).startsWith('Exactly'), 'ts: 4.8.8 by taps');
  await page.click(R + '.ts-pre[data-p="3,3,3,3,3,3"]'); await page.waitForTimeout(80);
  check((await txt('.ts-verdict')).startsWith('Exactly') && (await page.$$(R + '.ts-fig .ts-poly')).length === 6, 'ts: six triangles');
  // Patch.
  check((await page.$$(R + '.ts-patch .ts-tile')).length === 40 && (await txt('.ts-pnote')).startsWith('4 squares meet'), 'ts: square patch');
  await page.click(R + '.ts-pt button[data-n="6"]'); await page.waitForTimeout(80);
  check((await txt('.ts-pnote')).startsWith('3 hexagons meet at every corner: 3 × 120° = 360°'), 'ts: hexagon patch');
  await page.click(R + '.ts-pt button[data-n="3"]'); await page.waitForTimeout(80);
  check((await txt('.ts-pnote')).startsWith('6 triangles meet'), 'ts: triangle patch');
  // Pattern pad.
  check((await txt('.ts-sym')).includes('order 6') && (await txt('.ts-sym')).includes('60°') && (await txt('.ts-sym')).includes('6 lines'), 'ts: default k = 6 with mirrors');
  await page.click(R + '.ts-sample'); await page.waitForTimeout(80);
  check((await page.$$(R + '.ts-pad .ts-st')).length === 36, 'ts: sample pattern 3 strokes × 6 × 2');
  const pad = await page.$(R + '.ts-pad'); await pad.scrollIntoViewIfNeeded();
  const box = await pad.boundingBox(), k = box.width / 300;
  await page.mouse.move(box.x + 160 * k, box.y + 100 * k); await page.mouse.down();
  for (let i = 1; i <= 5; i++) await page.mouse.move(box.x + (160 + i * 10) * k, box.y + (100 - i * 5) * k);
  await page.mouse.up(); await page.waitForTimeout(80);
  check((await page.$$(R + '.ts-pad .ts-st')).length === 48, 'ts: a drawn line is copied 12 times');
  await page.click(R + '.ts-mir'); await page.fill(R + '.ts-k', '5'); await page.waitForTimeout(80);
  check((await page.$$(R + '.ts-pad .ts-st')).length === 20 && (await txt('.ts-sym')).includes('order 5') && (await txt('.ts-sym')).includes('72°') && (await txt('.ts-sym')).includes('no lines'), 'ts: k = 5 without mirrors');
  await page.click(R + '.ts-rundo'); await page.waitForTimeout(80);
  check((await page.$$(R + '.ts-pad .ts-st')).length === 15, 'ts: undo');
  await page.click(R + '.ts-rclear'); await page.waitForTimeout(80);
  check((await page.$$(R + '.ts-pad .ts-st')).length === 0, 'ts: clear pad');
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 5, 'ts: five questions');
  const get = [/= ([\d.]+)°\.$/, /= (\d+)\.$/, /= ([\d.]+)°\. So/, /regular (\d+)-gon has/, /with mirrors, (\d+) lines/];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`), m = get[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `ts: quiz question ${i} (${w})`);
  }
};
