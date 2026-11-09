// #573 algorithm visualiser
export const path = '/science/algorithm-visualiser/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/algorithm-visualiser/`); await page.waitForTimeout(600);
  const R = '.av';
  const facts = async () => Object.fromEntries((await page.$$eval(`${R} .av-counts div`, (ds) => ds.map((d) => [d.querySelector('dt').textContent, d.querySelector('dd').textContent]))));
  check((await page.textContent(`${R} .av-big`)) === 'Sorted: 3, 9, 10, 27, 38, 43, 82', 'algoviz: example merge sort result');
  check((await facts())['Step'] === '0 of 35' && await page.isVisible(`${R} .av-fig`), 'algoviz: starts at step 0 of 35 with the bar picture');
  await page.click(`${R} .av-step`);
  check((await page.textContent(`${R} .av-say`)) === 'Compare 27 and 38: right < left? Yes.' && (await facts())['Comparisons'] === '1', 'algoviz: first step compares 27 and 38');
  await page.click(`${R} .av-step`); await page.click(`${R} .av-back`);
  check((await facts())['Step'] === '1 of 35', 'algoviz: back one step');
  await page.click(`${R} .av-last`);
  { const f = await facts(); check(f['Comparisons'] === '14' && f['Writes'] === '20' && f['Swaps'] === '0', `algoviz: merge sort totals 14 comparisons, 20 writes (${JSON.stringify(f)})`); }
  await page.click(`${R} .av-first`);
  check((await facts())['Step'] === '0 of 35', 'algoviz: back to the start');
  // Comparison table matches the worked example in the guide.
  { const rows = await page.$$eval(`${R} .av-cmptab tr`, (rs) => rs.map((r) => [...r.children].map((c) => c.textContent))); const get = (n) => rows.find((r) => r[0].startsWith(n)).slice(1, 4).join('/');
    check(get('Bubble') === '20/11/0' && get('Insertion') === '15/11/0' && get('Selection') === '21/5/0' && get('Merge') === '14/0/20' && get('Quicksort') === '11/5/0' && get('Heap') === '19/15/0' && get('Counting') === '0/0/7' && get('Radix') === '0/0/14', 'algoviz: sorting comparison table'); }
  // Play runs to the end.
  await page.selectOption(`${R} .av-speed`, '5'); await page.click(`${R} .av-play`);
  check((await page.textContent(`${R} .av-play`)) === 'Pause', 'algoviz: Play turns into Pause');
  await page.waitForTimeout(800);
  check((await facts())['Step'] === '35 of 35' && (await page.textContent(`${R} .av-play`)) === 'Play', 'algoviz: Play runs to the end and stops');
  // Every sort, step to the end via the slider.
  for (const [alg, total, cmp, sw] of [['bubble', 37, '20', '11'], ['insertion', 27, '15', '11'], ['selection', 33, '21', '5'], ['quick', 23, '11', '5'], ['heap', 41, '19', '15'], ['counting', 15, '0', '0'], ['radix', 29, '0', '0']]) {
    await page.selectOption(`${R} .av-alg`, alg); await page.waitForTimeout(80);
    await page.$eval(`${R} .av-pos`, (el, v) => { el.value = String(v); el.dispatchEvent(new Event('input')); }, total);
    const f = await facts();
    check(f['Step'] === `${total} of ${total}` && f['Comparisons'] === cmp && f['Swaps'] === sw && (await page.textContent(`${R} .av-big`)) === 'Sorted: 3, 9, 10, 27, 38, 43, 82', `algoviz: ${alg} sort to the end (${JSON.stringify(f)})`);
  }
  check((await facts())['Reads'] === '14', 'algoviz: radix shows digit reads');
  await page.selectOption(`${R} .av-alg`, 'selection');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .av-csv`)]); const f = OUT + 'av-steps.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 34 && rows[0].startsWith('step,action') && rows[1].startsWith('1,compare,1 0,27 38') && rows.at(-1).endsWith('3 9 10 27 38 43 82'), `algoviz: step log CSV (${rows[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .av-ccsv`)]); const f = OUT + 'av-cmp.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 9 && rows[3].startsWith('Selection sort,21,5,0'), 'algoviz: comparison CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=pdf]`)]); check((await d.suggestedFilename()) === 'selection.pdf', 'algoviz: PDF report'); }
  // Make a list.
  await page.selectOption(`${R} .av-alg`, 'quick'); await page.fill(`${R} .av-n`, '30'); await page.selectOption(`${R} .av-kind`, 'sorted'); await page.click(`${R} .av-make`); await page.waitForTimeout(100);
  { const n = (await page.inputValue(`${R} .av-list`)).split(', ').length; await page.click(`${R} .av-last`); check(n === 30 && (await facts())['Comparisons'] === '435', 'algoviz: quicksort on a sorted list of 30 makes 435 comparisons'); }
  await page.fill(`${R} .av-n`, '500'); await page.click(`${R} .av-make`);
  check((await page.textContent(`${R} .av-err`)).includes('2 to 100'), 'algoviz: list size limit message');
  // Bad input.
  await page.fill(`${R} .av-list`, '5, 3, x'); await page.waitForTimeout(450);
  check((await page.textContent(`${R} .av-err`)) === '"x" is not a number.' && await page.isHidden(`${R} .av-out`), 'algoviz: bad number message');
  await page.fill(`${R} .av-list`, '5, -3, 2'); await page.selectOption(`${R} .av-alg`, 'radix'); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .av-err`)).includes('whole numbers of 0 or more'), 'algoviz: radix refuses negatives');
  await page.selectOption(`${R} .av-alg`, 'bubble'); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .av-cmptab`)).includes('whole numbers ≥ 0 only'), 'algoviz: comparison table notes counting/radix cannot run');
  // Searching.
  await page.fill(`${R} .av-list`, '38, 27, 43, 3, 9, 82, 10'); await page.selectOption(`${R} .av-alg`, 'binary'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .av-big`)) === 'Found 43 at place 5' && await page.isHidden(`${R} .av-cmp`), 'algoviz: binary search result');
  await page.click(`${R} .av-step`); await page.click(`${R} .av-step`);
  check((await page.textContent(`${R} .av-say`)) === 'Compare 27 (place 3) with the target 43: 27 < 43: go right.', 'algoviz: binary search step text');
  await page.click(`${R} .av-last`); check((await facts())['Comparisons'] === '2', 'algoviz: binary search 2 comparisons');
  await page.uncheck(`${R} .av-presort`); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .av-err`)).includes('sorted from small to large'), 'algoviz: binary search on unsorted list message');
  await page.selectOption(`${R} .av-alg`, 'linear'); await page.waitForTimeout(100);
  await page.click(`${R} .av-last`);
  check((await page.textContent(`${R} .av-big`)) === 'Found 43 at place 2' && (await facts())['Comparisons'] === '3', 'algoviz: linear search');
  await page.fill(`${R} .av-target`, '7'); await page.waitForTimeout(450); await page.click(`${R} .av-last`);
  check((await page.textContent(`${R} .av-big`)) === '7 is not in the list' && (await facts())['Comparisons'] === '7', 'algoviz: linear search miss');
  // Dynamic programming.
  await page.selectOption(`${R} .av-alg`, 'lcs'); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .av-big`)).startsWith('Length 4: "BCBA"') && await page.isVisible(`${R} .av-dp`) && await page.isHidden(`${R} .av-fig`), 'algoviz: LCS of the textbook pair');
  await page.click(`${R} .av-step`);
  check((await page.textContent(`${R} .av-say`)).startsWith('Row A, column B: A ≠ B') && (await page.$$(`${R} .av-dp td.cur`)).length === 1 && (await page.$$(`${R} .av-dp td.dep`)).length === 2, 'algoviz: LCS first cell with the cells it uses');
  await page.click(`${R} .av-last`);
  check((await page.$$(`${R} .av-dp td.path`)).length >= 5 && (await facts())['Cells filled'] === '42 of 42', 'algoviz: LCS trace-back path');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .av-csv`)]); const f = OUT + 'av-lcs.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').trim().split('\n').length === 43, 'algoviz: LCS cell log CSV'); }
  await page.selectOption(`${R} .av-alg`, 'edit'); await page.fill(`${R} .av-s`, 'kitten'); await page.fill(`${R} .av-t`, 'sitting'); await page.waitForTimeout(450);
  await page.click(`${R} .av-last`);
  check((await page.textContent(`${R} .av-big`)) === 'Distance 3. 3 edits: change k to s, change e to i, insert g' && (await page.textContent(`${R} .av-say`)).includes('All steps'), 'algoviz: edit distance kitten to sitting');
  await page.fill(`${R} .av-s`, 'abcdefghijklmnopqrstuvwxyz'); await page.waitForTimeout(450);
  check((await page.textContent(`${R} .av-err`)).includes('20 letters'), 'algoviz: word length limit');
  await page.selectOption(`${R} .av-alg`, 'knap'); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .av-big`)) === 'Best value 165. Take: Stove, Camera, Food (total weight 10 of 10)', 'algoviz: knapsack example');
  await page.click(`${R} .av-step`);
  check((await page.textContent(`${R} .av-say`)).startsWith('Row Tent, column 0: Tent (weight 5) does not fit in 0'), 'algoviz: knapsack first cell');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=docx]`)]); check((await d.suggestedFilename()) === 'knap.docx', 'algoviz: Word report of the table'); }
  await page.fill(`${R} .av-cap`, '99'); await page.waitForTimeout(450);
  check((await page.textContent(`${R} .av-err`)).includes('0 to 60'), 'algoviz: capacity limit');
  await page.fill(`${R} .av-cap`, '10'); await page.fill(`${R} .av-items`, 'Tent, 5'); await page.waitForTimeout(450);
  check((await page.textContent(`${R} .av-err`)).includes('Line 1: give a name'), 'algoviz: bad item line');
  await page.screenshot({ path: OUT + 'algorithm-visualiser.png', fullPage: true });
};
