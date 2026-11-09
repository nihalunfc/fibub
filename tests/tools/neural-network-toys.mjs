// #729 Neural network toys: perceptron presets, clicking points, epoch slider, CSV; Hopfield storing, noise,
// both update modes, a two-state cycle, removing patterns and bad input.
export const path = '/science/neural-network-toys/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(BASE + path);
  await page.waitForSelector('.pc-out:not([hidden])');
  const big = () => page.innerText('.pc-big');
  check((await big()) === 'Converged after 6 epochs: all 4 points on the right side', `nn: AND converges in 6 epochs (${await big()})`);
  check((await page.innerText('.pc-facts')).includes('0.200, 0.100') && (await page.innerText('.pc-facts')).includes('−0.200'), 'nn: AND weights 0.2, 0.1, bias −0.2');
  check((await page.$$('.pc-tab tbody tr')).length === 7, 'nn: epoch table has epochs 0 to 6');
  await page.selectOption('.pc-pre', 'or');
  check((await big()).startsWith('Converged after 4 epochs'), `nn: OR converges in 4 epochs (${await big()})`);
  await page.selectOption('.pc-pre', 'xor');
  check((await big()) === 'Did not converge in 50 epochs: 2 of 4 points still wrong', `nn: XOR does not converge (${await big()})`);
  check((await page.innerText('.pc-note')).includes('hidden layer'), 'nn: XOR note explains why');
  await page.fill('.pc-max', '0');
  check((await page.innerText('.pc-err')).includes('most epochs'), 'nn: zero epochs refused');
  await page.fill('.pc-max', '50'); await page.fill('.pc-rate', 'abc');
  check((await page.innerText('.pc-err')).includes('learning rate'), 'nn: bad learning rate refused');
  await page.fill('.pc-rate', '0.1');
  await page.selectOption('.pc-pre', 'clouds');
  check((await big()).startsWith('Converged after'), `nn: made-up clouds converge (${await big()})`);
  await page.selectOption('.pc-init', 'rand');
  check((await page.$$eval('.pc-tab tbody tr', (r) => r[0].cells[1].textContent)) !== '0.000', 'nn: random starting weights are used');
  await page.selectOption('.pc-init', 'zero');

  // Epoch slider and step buttons.
  await page.selectOption('.pc-pre', 'and');
  await page.$eval('.pc-ep', (e) => { e.value = '0'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await page.innerText('.pc-ep-n')) === '0 of 6' && (await page.innerText('.pc-facts')).includes('no line yet'), 'nn: epoch 0 shows no line');
  await page.click('.pc-step');
  check((await page.innerText('.pc-ep-n')) === '1 of 6', 'nn: forward one epoch');
  await page.click('.pc-back');
  check((await page.innerText('.pc-ep-n')) === '0 of 6', 'nn: back one epoch');

  // Click points on an empty plane.
  await page.click('.pc-clear');
  check((await page.innerText('.pc-err')).includes('Click the picture'), 'nn: empty plane asks for points');
  const cv = await page.$('.pc-fig'); await cv.scrollIntoViewIfNeeded();
  const at = async (x, y) => { await cv.scrollIntoViewIfNeeded(); const bb = await cv.boundingBox(); await page.mouse.click(bb.x + bb.width * ((30 + ((x + 0.5) / 2) * 340) / 400), bb.y + bb.height * ((30 + ((1.5 - y) / 2) * 340) / 400)); };
  await at(1, 1); await at(1.2, 0.9);
  check((await big()).startsWith('Only one class'), `nn: one class only is flagged (${await big()})`);
  await page.click('.pc-cls button[data-c="0"]');
  await at(0, 0); await at(0.1, 0.3);
  check((await big()).startsWith('Converged after') && (await page.$$('.pc-tab tbody tr')).length >= 2, `nn: clicked points train (${await big()})`);
  await page.click('.pc-undo');
  check((await big()).includes('all 3 points'), `nn: remove last leaves 3 points (${await big()})`);
  await page.selectOption('.pc-pre', 'and');
  const dl = async (sel) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const p = OUT + d.suggestedFilename(); await d.saveAs(p); return { name: d.suggestedFilename(), p }; };
  const c = await dl('.pc-csv'), rows = readFileSync(c.p, 'utf8').trim().split('\n');
  check(c.name === 'perceptron-epochs.csv' && rows.length === 8 && rows[0] === 'epoch,w1,w2,bias,updates,wrong_after' && /^6,0\.2,0\.1,-0\.2,0,0$/.test(rows[7].replace(/0000+\d/g, '')), `nn: epochs CSV (${rows[7]})`);
  const p = await dl('.pc-dl button[data-f="png"]');
  check(p.name === 'perceptron.png' && readFileSync(p.p).subarray(1, 4).toString() === 'PNG', 'nn: perceptron PNG report');

  // Hopfield.
  await page.click('.nn-mode button[data-m="hop"]');
  await page.waitForSelector('.hp-out:not([hidden])');
  const hb = () => page.innerText('.hp-big');
  check((await hb()) === 'Recalled pattern 1 exactly after 1 sweep', `nn: pattern 1 with 10 flips recalled (${await hb()})`);
  check((await page.$$('.hp-cue button.diff')).length === 10 && (await page.$$('.hp-res button.diff')).length === 0, 'nn: cue shows 10 flipped units, result none');
  check((await page.innerText('.hp-cap')).includes('≈ 6.8'), 'nn: capacity note for 49 units');
  await page.selectOption('.hp-src', '2'); await page.fill('.hp-flip', '12'); await page.fill('.hp-seed', '7');
  check((await hb()).startsWith('Recalled pattern 3 exactly'), `nn: pattern 3 recalled (${await hb()})`);
  check((await page.$$eval('.hp-tab tbody tr', (r) => r.map((x) => x.cells[2].textContent).join(','))) === '−0.061,0.347,1.000', 'nn: final overlaps match the maths test');
  await page.selectOption('.hp-src', '0'); await page.fill('.hp-flip', '22'); await page.fill('.hp-seed', '9');
  await page.selectOption('.hp-upd', 'sync');
  check((await hb()).includes('spurious'), `nn: sync from 22 flips lands on a spurious state (${await hb()})`);
  await page.selectOption('.hp-upd', 'async');
  check((await hb()).startsWith('Settled on'), `nn: async from 22 flips (${await hb()})`);
  await page.fill('.hp-flip', '100');
  check((await page.innerText('.hp-err')).includes('0 to 49'), 'nn: too many flips refused');
  await page.fill('.hp-flip', '10'); await page.fill('.hp-seed', '1');
  // Tap the cue.
  await page.click('.hp-cue button >> nth=24');
  check((await page.$$('.hp-cue button.diff')).length === 11, 'nn: tapping the cue flips a unit');
  await page.$eval('.hp-sw', (e) => { e.value = '0'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await page.innerText('.hp-sw-n')).startsWith('0 of') && (await page.$$('.hp-res button.diff')).length === 11, 'nn: sweep 0 shows the cue');
  const h = await dl('.hp-dl button[data-f="pdf"]');
  check(h.name === 'hopfield-network.pdf' && readFileSync(h.p).subarray(0, 4).toString() === '%PDF', 'nn: Hopfield PDF report');

  // Draw and store a new pattern; remove; other grid sizes.
  for (const i of [0, 6, 42, 48, 24]) await page.click(`.hp-ed button >> nth=${i}`);
  await page.click('.hp-store');
  check((await page.innerText('.hp-count')) === '(4)' && (await page.$$('.hp-src option')).length === 4, 'nn: a drawn pattern is stored');
  await page.click('.hp-del >> nth=3');
  check((await page.innerText('.hp-count')) === '(3)', 'nn: a stored pattern can be removed');
  await page.selectOption('.hp-n', '5');
  check((await page.innerText('.hp-err')).includes('Store at least one') && (await page.$$('.hp-ed button')).length === 25, 'nn: 5 × 5 grid starts empty');
  await page.click('.hp-store');
  check((await page.innerText('.hp-err')).includes('Draw a pattern first'), 'nn: storing an empty drawing is refused');
  await page.click('.hp-rand'); await page.click('.hp-store'); await page.fill('.hp-flip', '3');
  check((await hb()).includes('pattern 1'), `nn: a random 5 × 5 pattern is recalled (${await hb()})`);
  for (let k = 0; k < 6; k++) { await page.click('.hp-rand'); await page.click('.hp-store'); }
  check((await page.innerText('.hp-cap')).includes('above that limit'), 'nn: going over capacity is flagged');
};
