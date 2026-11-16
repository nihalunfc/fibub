// #1045 Faraday's magnet and coil
export const path = '/learn/faraday-induction/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/faraday-induction/`); await page.waitForTimeout(700);
  const R = '.fdi ', txt = (s) => page.textContent(R + s);
  check((await txt('.fdi-big')).startsWith('emf = 0') && (await txt('.fdi-lenz')).startsWith('Move the magnet'), 'faraday: still magnet, no emf');
  check((await txt('.fdi-facts')).includes('−15 cm'), `faraday: magnet starts 15 cm away (${await txt('.fdi-facts')})`);
  await page.click(R + '.fdi-in'); await page.waitForTimeout(300);
  const mid = await txt('.fdi-big');
  check(/^emf = −[\d.]+ mV$/.test(mid) && (await txt('.fdi-lenz')).includes('north pole') && (await txt('.fdi-lenz')).includes('pushes the magnet away'), `faraday: pushing in, the coil pushes back (${mid} ${await txt('.fdi-lenz')})`);
  await page.waitForTimeout(1000);
  check((await txt('.fdi-big')).startsWith('emf = 0') && (await txt('.fdi-facts')).includes('Magnet from the coil centre0 cm') && (await txt('.fdi-facts')).includes('3.14 mWb') && (await txt('.fdi-facts')).includes('Largest emf in the last move27 mV'), `faraday: magnet inside the coil (${await txt('.fdi-facts')})`);
  check((await txt('.fdi-lenz')).startsWith('The magnet has stopped'), 'faraday: stopped magnet message');
  await page.selectOption(R + '.fdi-v', '0.1'); await page.click(R + '.fdi-out'); await page.waitForTimeout(350);
  check(/^emf = [\d.]+ mV$/.test(await txt('.fdi-big')) && (await txt('.fdi-lenz')).includes('pulls the magnet back'), `faraday: pulling out reverses the emf (${await txt('.fdi-big')} ${await txt('.fdi-lenz')})`);
  await page.waitForTimeout(1500);
  check((await txt('.fdi-facts')).includes('13.5 mV'), `faraday: slower move, smaller emf (${await txt('.fdi-facts')})`);
  await page.selectOption(R + '.fdi-n', '500'); await page.selectOption(R + '.fdi-v', '0.2');
  await page.click(R + '.fdi-flip'); await page.click(R + '.fdi-in'); await page.waitForTimeout(300);
  check(/^emf = [\d.]+ mV$/.test(await txt('.fdi-big')) && (await txt('.fdi-lenz')).includes('south pole'), `faraday: flipped magnet swings the other way (${await txt('.fdi-big')})`);
  await page.waitForTimeout(1000);
  check((await txt('.fdi-facts')).includes('135 mV') && (await txt('.fdi-facts')).includes('−15.7 mWb'), `faraday: 500 turns (${await txt('.fdi-facts')})`);
  // Drag the magnet back out by hand.
  await page.locator(R + '.fdi-fig').scrollIntoViewIfNeeded();
  const bb = await page.locator(R + '.fdi-fig').boundingBox(), P = (zz) => bb.x + ((240 + zz * 900) / 360) * bb.width, y = bb.y + (140 / 210) * bb.height;
  await page.mouse.move(P(0), y); await page.mouse.down();
  let moved = false;
  for (let k = 1; k <= 10; k++) { await page.mouse.move(P(-0.01 * k), y); await page.waitForTimeout(40); if ((await txt('.fdi-big')) !== 'emf = 0: no change of flux, no current' && !(await txt('.fdi-big')).startsWith('emf = 0')) moved = true; }
  await page.mouse.up(); await page.waitForTimeout(300);
  check(moved && (await txt('.fdi-facts')).includes('−10 cm'), `faraday: dragging the magnet makes an emf (${await txt('.fdi-facts')})`);
  check(await page.isHidden(R + '.fdi-f12'), 'faraday: Class 12 line hidden');
  await page.click(R + '.fdi-level [data-v="12"]'); await page.waitForTimeout(100);
  check((await txt('.fdi-f12')).startsWith('ε = −N dΦ/dt') && (await txt('.fdi-gtext')).includes('RMS value ε₀/√2 = 22.2 V'), 'faraday: Class 12 formulas');
  // Generator
  check((await txt('.fdi-gtext')).startsWith('Peak emf ε₀ = N B A ω = 100 × 0.20 × 0.01 × 157 = 31.4 V, at 25 Hz.'), `faraday: generator peak (${await txt('.fdi-gtext')})`);
  await page.$eval(R + '.fdi-r', (e) => { e.value = '3000'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await txt('.fdi-gtext')).includes('= 62.8 V, at 50 Hz') && (await txt('.fdi-rv')) === '3000 rpm (50 Hz)', 'faraday: double speed doubles peak and frequency');
  await page.$eval(R + '.fdi-gb', (e) => { e.value = '0.4'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.selectOption(R + '.fdi-gn', '50');
  check((await txt('.fdi-gtext')).includes('= 62.8 V') && (await txt('.fdi-gbv')) === '0.40 T', 'faraday: field and turns');
  await page.$eval(R + '.fdi-a', (e) => { e.value = '90'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await txt('.fdi-play')) === 'Play' && (await txt('.fdi-av')) === '90°', 'faraday: angle slider pauses the generator');
  await page.click(R + '.fdi-play'); await page.waitForTimeout(400);
  check((await txt('.fdi-play')) === 'Pause' && (await page.inputValue(R + '.fdi-a')) !== '90', 'faraday: play turns the coil');
  await page.click(R + '.fdi-level [data-v="10"]');
  check((await page.$$(R + '.eq-q')).length === 4, 'faraday: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), [N, p0, p1, dt] = q1.match(/a (\d+)-turn coil changes from ([\d.]+) mWb to ([\d.]+) mWb in ([\d.]+) s/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String((N * (p1 - p0) * 1e-3) / dt)); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'faraday: right answer accepted');

  // ---- Solve my numbers ----
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals, sels = {}) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(sels)) { if (k.startsWith('__u:')) await page.selectOption(`.ps-host [data-k="${id}-${k.slice(4)}-u"]`, v); else await page.selectOption(`.ps-host [data-k="${id}-${k}"]`, v); } for (const [k, v] of Object.entries(vals)) await page.fill(`.ps-host [data-k="${id}-${k}"]`, v); await page.waitForTimeout(80); };
  await psPre("200 turns, flux rises"); check((await psAns()).includes("The average induced emf is 4 V"), "faraday-induction: example 200 turns, flux rises: The average induced emf is 4 V");
  await psPre("Flux through a tilted coil"); check((await psAns()).includes("The flux is 500 \u00b5Wb"), "faraday-induction: example Flux through a tilted coil: The flux is 500 \u00b5Wb");
  await psPre("Field falls to 0.1 T"); check((await psAns()).includes("The average induced emf is 200 mV"), "faraday-induction: example Field falls to 0.1 T: The average induced emf is 200 mV");
  await psPre("Simple 50 Hz generator"); check((await psAns()).includes("The peak emf is 31.4 V (rms 22.2 V)"), "faraday-induction: example Simple 50 Hz generator: The peak emf is 31.4 V (rms 22.2 V)");
  await psPre("Current and charge"); check((await psAns()).includes("The average current is 100 mA and the charge that flows is 50 mC"), "faraday-induction: example Current and charge: The average current is 100 mA and the charge that flows is 50 mC");
  await psSet("field", {"N": "100", "A": "100", "b1": "0", "b2": "2", "t": "1"}, {}); check((await psAns()).includes("The average induced emf is 2 V."), "faraday-induction: typed numbers: The average induced emf is 2 V.");
  await psSet("emf", {"t": "0"}, {}); check((await psAns()).includes("must be more than 0"), "faraday-induction: friendly message: must be more than 0");
  await psSet("emf", {"p1": "3", "p2": "3", "t": "1"}, {}); check((await psAns()).includes("The flux does not change"), "faraday-induction: friendly message: The flux does not change");
  await psSet("flux", {"th": "200"}, {}); check((await psAns()).includes("cannot be more than 180"), "faraday-induction: friendly message: cannot be more than 180");
  await psPre("200 turns"); await page.waitForTimeout(80);
  check((await psWork()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), "faraday-induction: working shown, no NaN");
};
