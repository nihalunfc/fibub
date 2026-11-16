// #1413 Galvanometer to ammeter and voltmeter
export const path = '/learn/galvanometer-conversion/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/galvanometer-conversion/`); await page.waitForTimeout(600);
  const R = '.gvm ', txt = (s) => page.textContent(R + s);
  const setR = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await txt('.gvm-big')) === 'Shunt S = 25 mΩ in parallel', `galv: ammeter example (${await txt('.gvm-big')})`);
  const f = await txt('.gvm-facts');
  check(f.includes('500 µA') && f.includes('50% of full scale') && f.includes('Reading1 A'), `galv: ammeter facts (${f})`);
  check((await txt('.gvm-formula')) === 'S = Ig G / (I₀ − Ig) = 0.00100 × 50 / (2 − 0.00100) = 25 mΩ', `galv: formula (${await txt('.gvm-formula')})`);
  const inked = () => page.$eval(R + '.gvm-fig', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60) n++; return n; });
  check((await inked()) > 600, 'galv: meter drawn');
  await page.selectOption(R + '.gvm-ra', '10'); check((await txt('.gvm-big')) === 'Shunt S = 5 mΩ in parallel', `galv: 10 A range (${await txt('.gvm-big')})`);
  await page.selectOption(R + '.gvm-ra', '0.01'); check((await txt('.gvm-big')) === 'Shunt S = 5.56 Ω in parallel', `galv: 10 mA range (${await txt('.gvm-big')})`);
  await setR('.gvm-i', 10); check(!(await page.isHidden(R + '.gvm-err')) && (await txt('.gvm-err')).includes('bigger range'), 'galv: range below Ig refused');
  await setR('.gvm-i', 1); await page.selectOption(R + '.gvm-ra', '2');
  await setR('.gvm-t', 110); check((await txt('.gvm-facts')).includes('off the scale!'), 'galv: over range');
  await setR('.gvm-t', 50);
  await page.click(R + '.gvm-mode button[data-v=V]'); await page.waitForTimeout(100);
  check((await txt('.gvm-big')) === 'Series resistance R = 9.95 kΩ' && (await txt('.gvm-facts')).includes('10 kΩ') && (await txt('.gvm-facts')).includes('1 kΩ'), `galv: voltmeter (${await txt('.gvm-big')} ${await txt('.gvm-facts')})`);
  check(await page.isHidden(R + '.gvm-ra') && (await txt('.gvm-tv')).startsWith('5 V'), 'galv: voltmeter controls');
  await page.selectOption(R + '.gvm-rv', '300'); check((await txt('.gvm-big')) === 'Series resistance R = 300 kΩ', `galv: 300 V (${await txt('.gvm-big')})`);
  await setR('.gvm-g', 200); await setR('.gvm-i', 10); await page.selectOption(R + '.gvm-rv', '1');
  check((await txt('.gvm-err')).includes('Ig × G = 2 V'), `galv: voltmeter range too small (${await txt('.gvm-err')})`);
  check((await page.$$(R + '.eq-q')).length === 4, 'galv: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), [G, Ig, I0] = q1.match(/coil of (\d+) Ω .*? at (\d+) mA.*?up to (\d+) A/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String((Ig / 1000 * G) / (I0 - Ig / 1000))); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'galv: right answer accepted');

  // ---- Solve my numbers ----
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals, sels = {}) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(sels)) { if (k.startsWith('__u:')) await page.selectOption(`.ps-host [data-k="${id}-${k.slice(4)}-u"]`, v); else await page.selectOption(`.ps-host [data-k="${id}-${k}"]`, v); } for (const [k, v] of Object.entries(vals)) await page.fill(`.ps-host [data-k="${id}-${k}"]`, v); await page.waitForTimeout(80); };
  await psPre("2 A ammeter"); check((await psAns()).includes("Connect a shunt of 25 m\u03a9 in parallel"), "galvanometer-conversion: example 2 A ammeter: Connect a shunt of 25 m\u03a9 in parallel");
  await psPre("0 to 1 A ammeter"); check((await psAns()).includes("Connect a shunt of 50 m\u03a9 in parallel"), "galvanometer-conversion: example 0 to 1 A ammeter: Connect a shunt of 50 m\u03a9 in parallel");
  await psPre("10 V voltmeter"); check((await psAns()).includes("Connect 9.95 k\u03a9 in series"), "galvanometer-conversion: example 10 V voltmeter: Connect 9.95 k\u03a9 in series");
  await psPre("3 V voltmeter, 100"); check((await psAns()).includes("Connect 29.8 k\u03a9 in series"), "galvanometer-conversion: example 3 V voltmeter, 100: Connect 29.8 k\u03a9 in series");
  await psPre("What does this shunt give"); check((await psAns()).includes("The ammeter reads up to 2 A"), "galvanometer-conversion: example What does this shunt give: The ammeter reads up to 2 A");
  await psSet("series", {"G": "100", "Ig": "2", "V0": "5"}, {"__u:Ig": "mA"}); check((await psAns()).includes("Connect 2.4 k\u03a9 in series"), "galvanometer-conversion: typed numbers: Connect 2.4 k\u03a9 in series");
  await psSet("series", {"V0": "0.05"}, {"__u:Ig": "mA"}); check((await psAns()).includes("That range is too small"), "galvanometer-conversion: friendly message: That range is too small");
  await psSet("shunt", {"I0": "0.0005"}, {}); check((await psAns()).includes("must be bigger than the full-scale current"), "galvanometer-conversion: friendly message: must be bigger than the full-scale current");
  await psPre("10 V voltmeter"); await page.waitForTimeout(80);
  check((await psWork()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), "galvanometer-conversion: working shown, no NaN");
};
