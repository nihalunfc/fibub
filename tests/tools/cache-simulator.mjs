// #576 cache and memory hierarchy simulator
export const path = '/science/cache-simulator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/cache-simulator/`); await page.waitForTimeout(900);
  const R = '.cs';
  const facts = async () => Object.fromEntries((await page.$$eval(`${R} .cs-facts div`, (ds) => ds.map((d) => [d.querySelector('dt').textContent, d.querySelector('dd').textContent]))));
  const big = () => page.textContent(`${R} .cs-big`);
  check((await big()) === 'AMAT 5.814 cycles' && (await page.textContent(`${R} .cs-tlen`)).startsWith('12,288 accesses'), 'cache: example matrix multiply AMAT');
  { const f = await facts(); check(f['Level 1 hits'] === '7,332 of 12,288 (59.7 %)' && f['Kinds of miss'] === '192 compulsory, 960 capacity, 3,804 conflict' && f['Level 2 hits'] === '4,860 of 4,956 lookups' && f['Level 2 local miss rate'] === '1.94 %' && f['Level 1'].includes('16 sets × 2 ways of 32 B'), `cache: example facts (${JSON.stringify(f)})`); }
  check((await page.textContent(`${R} .cs-formula`)).endsWith('= 5.814 cycles'), 'cache: AMAT formula agrees with the simulation');
  { const rows = await page.$$eval(`${R} .cs-rows tr`, (rs) => rs.slice(0, 3).map((r) => [...r.children].map((c) => c.textContent))); check(rows.length === 3 && rows[1].join('|') === '1|0x0|0x0|0|0|miss (compulsory)||miss|111' && (await page.textContent(`${R} .cs-shown`)).includes('first 1,000 of 12,288'), `cache: per-access table (${rows[1].join('|')})`); }
  { const t = await page.$$eval(`${R} .cs-cmp tr`, (rs) => rs.map((r) => [...r.children].map((c) => c.textContent))); check(t.length === 14 && t.some((r) => r[0] === 'Fully associative' && r[1] === 'LRU') && t.find((r) => r[0] === '2-way' && r[1] === 'LRU')[4] === '5.814', 'cache: other level 1 designs table'); }
  check(await page.isVisible(`${R} .cs-fig`), 'cache: running miss rate chart');
  // Loop orders
  await page.selectOption(`${R} .cs-order`, 'ikj'); await page.waitForTimeout(300);
  check((await big()) === 'AMAT 3.295 cycles', 'cache: ikj order');
  await page.selectOption(`${R} .cs-order`, 'jki'); await page.waitForTimeout(300);
  check((await big()) === 'AMAT 8.656 cycles', 'cache: jki order');
  // Contents at a step
  await page.fill(`${R} .cs-at`, '2'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .cs-atsay`)).startsWith('Access 2: 0x800 → set 0, tag 0x4, miss') && (await page.$$(`${R} .cs-grid tr`)).length === 17 && (await page.textContent(`${R} .cs-grid td.new`)) === '0x4', `cache: contents after access 2 (${await page.textContent(`${R} .cs-atsay`)})`);
  await page.fill(`${R} .cs-at`, '99999'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .cs-atsay`)).startsWith('Type an access number from 1 to 12,288'), 'cache: access number out of range');
  // Strided walk from the FAQ, one level, each placement.
  await page.selectOption(`${R} .cs-src`, 'stride'); await page.uncheck(`${R} .cs-l2on`);
  await page.fill(`${R} .cs-cnt`, '264'); await page.fill(`${R} .cs-stride`, '8'); await page.fill(`${R} .cs-pass`, '4'); await page.waitForTimeout(500);
  for (const [w, m] of [['full', '132'], ['2', '42'], ['1', '39']]) {
    await page.selectOption(`${R} .cs-w1`, w); await page.waitForTimeout(300);
    check((await facts())['Level 1 misses'].startsWith(m + ' '), `cache: FAQ walk, placement ${w}: ${m} misses`);
  }
  check(await page.isHidden(`${R} .cs-l2`) && !(await facts())['Level 2'], 'cache: level 2 can be switched off');
  await page.selectOption(`${R} .cs-p1`, 'fifo'); await page.selectOption(`${R} .cs-w1`, '4'); await page.waitForTimeout(300);
  check((await big()).startsWith('AMAT'), 'cache: FIFO, 4-way');
  await page.selectOption(`${R} .cs-p1`, 'random'); await page.waitForTimeout(300);
  check((await big()).startsWith('AMAT'), 'cache: random replacement');
  // Random addresses
  await page.selectOption(`${R} .cs-src`, 'rand'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .cs-tlen`)).startsWith('2,000 accesses'), 'cache: random addresses');
  // Own trace and file
  await page.selectOption(`${R} .cs-src`, 'paste'); await page.selectOption(`${R} .cs-w1`, '1'); await page.selectOption(`${R} .cs-p1`, 'lru'); await page.check(`${R} .cs-l2on`); await page.waitForTimeout(400);
  { const rows = await page.$$eval(`${R} .cs-rows tr`, (rs) => rs.map((r) => [...r.children].map((c) => c.textContent)));
    check(rows.length === 8 && rows[3][5] === 'miss (conflict)' && rows[3][6] === '0x20' && rows[7][5] === 'miss (conflict)', `cache: pasted trace with direct-mapped conflicts (${rows[3].join('|')})`); }
  writeFileSync(OUT + 'cs-trace.csv', 'address\n0x0\n0x4\n0x8\n0x40\n0x0\n');
  await page.setInputFiles(`${R} .dfb-in`, OUT + 'cs-trace.csv'); await page.waitForTimeout(600);
  check((await facts())['Level 1 hits'] === '3 of 5 (60 %)' && (await page.textContent(`${R} .dfb-note`)).includes('Opened cs-trace.csv'), 'cache: trace from a file');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .cs-csv`)]); const f = OUT + 'cs.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 6 && rows[0].startsWith('access,address,tag,set') && rows[1].startsWith('1,0x0,'), 'cache: every access CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=pdf]`)]); check((await d.suggestedFilename()) === 'cache-simulation.pdf', 'cache: PDF report'); }
  // Bad input
  await page.fill(`${R} .cs-trace`, '0x10\nhello'); await page.waitForTimeout(500);
  check((await page.textContent(`${R} .cs-err`)).startsWith('Line 2: "hello" is not an address') && await page.isHidden(`${R} .cs-out`), 'cache: bad trace line');
  await page.fill(`${R} .cs-trace`, '0x10'); await page.fill(`${R} .cs-s1`, '1000'); await page.waitForTimeout(500);
  check((await page.textContent(`${R} .cs-err`)).includes('power of 2 in bytes'), 'cache: size must be a power of 2');
  await page.fill(`${R} .cs-s1`, '1024'); await page.fill(`${R} .cs-b2`, '16'); await page.waitForTimeout(500);
  check((await page.textContent(`${R} .cs-err`)).includes('at least as large as level 1'), 'cache: L2 block smaller than L1 refused');
  await page.fill(`${R} .cs-b2`, '64'); await page.selectOption(`${R} .cs-src`, 'mm'); await page.fill(`${R} .cs-n`, '40'); await page.waitForTimeout(500);
  check((await page.textContent(`${R} .cs-err`)).includes('from 1 to 32'), 'cache: matrix size limit');
  await page.fill(`${R} .cs-n`, '16'); await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + 'cache-simulator.png', fullPage: true });
};
