// #621 circuit simulator
export const path = '/science/circuit-simulator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.csim ';
  await page.goto(`${BASE}/science/circuit-simulator/`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.cs-big'), facts = () => page.textContent(R + '.cs-facts');
  check((await big()) === 'V(out): −3 dB at 159.2 Hz', `circuit: RC example corner frequency (${await big()})`);
  check((await facts()).includes('−20.0 dB per decade') && await page.isVisible(R + '.cs-fig1') && await page.isVisible(R + '.cs-fig2'), 'circuit: RC slope and both Bode plots');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cs-csv')]); const f = OUT + 'ac.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'frequency_Hz,V(in)_dB,V(in)_phase_deg,V(out)_dB,V(out)_phase_deg' && rows.length === 102, `circuit: AC CSV (${rows.length} rows)`); }
  await page.selectOption(R + '.cs-an', 'tran'); await page.waitForTimeout(300);
  check((await big()).startsWith('V(out) from 0 to 10 ms') && (await facts()).includes('1,000 of 10 µs') && await page.isHidden(R + '.cs-fig2'), `circuit: RC transient (${await big()})`);
  await page.selectOption(R + '.cs-probe2', 'in'); await page.selectOption(R + '.cs-meth', 'be'); await page.waitForTimeout(300);
  check((await facts()).includes('backward Euler'), 'circuit: backward Euler and a second node');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cs-csv')]); const f = OUT + 'tran.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'time_s,V(in)_V,V(out)_V,I(V1)_A,I(R1)_A,I(C1)_A' && rows.length === 1002, `circuit: transient CSV (${rows.length} rows)`); }
  await page.selectOption(R + '.cs-ex', 'divider'); await page.waitForTimeout(300);
  check((await big()) === 'V(a) = 4.106 V' && (await page.textContent(R + '.cs-tab')).includes('5.956 V') && (await facts()).includes('1.678 mA out of its + end'), `circuit: DC bridge example (${await big()})`);
  await page.selectOption(R + '.cs-ex', 'rlc'); await page.waitForTimeout(300);
  check((await big()).startsWith('V(out) from 0 to 5 ms') && (await page.inputValue(R + '.cs-h')) === '1u', 'circuit: RLC example opens in transient');
  await page.selectOption(R + '.cs-an', 'ac'); await page.waitForTimeout(300);
  check((await big()) === 'V(out): −3 dB at 1.514 kHz and 1.673 kHz' && (await facts()).includes('bandwidth = 10.0'), `circuit: RLC band-pass edges and Q (${await big()})`);
  await page.selectOption(R + '.cs-ex', 'rl'); await page.waitForTimeout(300);
  check((await facts()).includes('peak to peak'), 'circuit: RL sine example');
  await page.selectOption(R + '.cs-ex', 'lc'); await page.waitForTimeout(300);
  check((await big()).startsWith('V(out) from 0 to 8 ms'), 'circuit: ladder example');
  await page.fill(R + '.cs-net', 'V1 a 0 5\nQ1 a b c npn'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.cs-err')).startsWith('Line 2') && await page.isHidden(R + '.cs-out'), 'circuit: unknown part message');
  await page.fill(R + '.cs-net', 'V1 a 0 5\nV2 a 0 3\nR1 a 0 1k'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.cs-err')).includes('loop of voltage sources'), 'circuit: voltage source loop message');
  await page.fill(R + '.cs-net', 'V1 a 0 DC 5\nR1 a b 1k\nC1 b 0 1u\n.tran 1u 1m'); await page.selectOption(R + '.cs-an', 'ac'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.cs-err')).includes('No source has an AC value') && (await page.textContent(R + '.cs-warn')).includes('.tran'), `circuit: no AC source message and dot-line note (${await page.textContent(R + '.cs-err')} | ${await page.textContent(R + '.cs-warn')})`);
  await page.selectOption(R + '.cs-an', 'tran'); await page.fill(R + '.cs-h', '0'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.cs-err')).includes('time step above zero'), 'circuit: bad time step message');
  await page.fill(R + '.cs-h', '1u'); await page.selectOption(R + '.cs-an', 'op'); await page.waitForTimeout(300);
  check((await big()) === 'V(a) = 5 V', 'circuit: typed netlist DC');
  await page.setInputFiles(R + '.dfb-in', { name: 'net.txt', mimeType: 'text/plain', buffer: Buffer.from('* file\nV1 x 0 DC 10\nR1 x y 1k\nR2 y 0 1k\n') }); await page.waitForTimeout(600);
  await page.selectOption(R + '.cs-probe', 'y'); await page.waitForTimeout(200);
  check((await big()) === 'V(y) = 5 V', `circuit: netlist opened from a file (${await big()})`);
};
