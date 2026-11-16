// #1415 Self and mutual inductance
export const path = '/learn/inductance-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/inductance-lab/`); await page.waitForTimeout(700);
  const R = '.ind ', txt = (s) => page.textContent(R + s);
  const set = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await txt('.ind-big')) === 'L₁ = 1.58 mH, M = 632 µH', `inductance: example (${await txt('.ind-big')})`);
  const f = await txt('.ind-facts');
  check(f.includes('Outer coil L₂568 µH') && f.includes('0.667') && f.includes('5.03 mT') && f.includes('3.16 mJ'), `inductance: facts (${f})`);
  check((await txt('.ind-gtext')).includes('4 A/s') && (await txt('.ind-gtext')).includes('6.32 mV') && (await txt('.ind-gtext')).includes('2.53 mV'), `inductance: emfs (${await txt('.ind-gtext')})`);
  const inked = (s) => page.$eval(R + s, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60 || Math.abs(d[i + 2] - d[2]) > 60) n++; return n; });
  check((await inked('.ind-fig')) > 800 && (await inked('.ind-graph')) > 800, 'inductance: drawings');
  await set('.ind-n1', 1000); await page.waitForTimeout(80);
  check((await txt('.ind-big')) === 'L₁ = 6.32 mH, M = 1.26 mH', `inductance: double N1 (${await txt('.ind-big')})`);
  await set('.ind-n1', 500); await set('.ind-t', 0.1); await page.waitForTimeout(80);
  check((await txt('.ind-gtext')).includes('20 A/s') && (await txt('.ind-gtext')).includes('31.6 mV'), `inductance: faster ramp (${await txt('.ind-gtext')})`);
  await set('.ind-r2', 5); await page.waitForTimeout(80);
  check((await txt('.ind-big')).includes('M = 632 µH') && (await txt('.ind-facts')).includes('0.4'), 'inductance: bigger outer coil, same M, weaker coupling');
  await set('.ind-r2', 1); await page.waitForTimeout(80);
  check((await txt('.ind-r2v')) === '2 cm', `inductance: r2 kept at least r1 (${await txt('.ind-r2v')})`);
  await page.click(R + '.ind-core button[data-v="1000"]'); await page.waitForTimeout(80);
  check((await txt('.ind-big')) === 'L₁ = 1.58 H, M = 632 mH', `inductance: iron core (${await txt('.ind-big')})`);
  check((await page.$$(R + '.eq-q')).length === 4, 'inductance: four practice questions');
  const q3 = await page.textContent(R + '.eq-q:nth-child(3) p'), [M, r] = q3.match(/inductance of ([\d.]+) H\. The current in one changes at (\d+) A\/s/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(3) .eq-in', String(M * r)); await page.click(R + '.eq-q:nth-child(3) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(3) .eq-res')).startsWith('Right'), 'inductance: right answer accepted');

  // ---- Solve my numbers ----
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals, sels = {}) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(sels)) { if (k.startsWith('__u:')) await page.selectOption(`.ps-host [data-k="${id}-${k.slice(4)}-u"]`, v); else await page.selectOption(`.ps-host [data-k="${id}-${k}"]`, v); } for (const [k, v] of Object.entries(vals)) await page.fill(`.ps-host [data-k="${id}-${k}"]`, v); await page.waitForTimeout(80); };
  await psPre("500-turn air solenoid"); check((await psAns()).includes("The self-inductance is 503 \u00b5H"), "inductance-lab: example 500-turn air solenoid: The self-inductance is 503 \u00b5H");
  await psPre("Same solenoid with iron"); check((await psAns()).includes("The self-inductance is 503 mH"), "inductance-lab: example Same solenoid with iron: The self-inductance is 503 mH");
  await psPre("Two coaxial coils"); check((await psAns()).includes("The mutual inductance is 25.1 \u00b5H"), "inductance-lab: example Two coaxial coils: The mutual inductance is 25.1 \u00b5H");
  await psPre("Current drops quickly"); check((await psAns()).includes("The induced emf is 10 V, opposing the fall in current"), "inductance-lab: example Current drops quickly: The induced emf is 10 V, opposing the fall in current");
  await psPre("Energy in a 0.2 H coil"); check((await psAns()).includes("The stored energy is 900 mJ"), "inductance-lab: example Energy in a 0.2 H coil: The stored energy is 900 mJ");
  await psSet("tau", {"L": "0.5", "R": "25"}, {}); check((await psAns()).includes("The time constant is 20 ms"), "inductance-lab: typed numbers: The time constant is 20 ms");
  await psSet("L", {"N": "0"}, {}); check((await psAns()).includes("must be more than 0"), "inductance-lab: friendly message: must be more than 0");
  await psPre("500-turn air solenoid"); await page.waitForTimeout(80);
  check((await psWork()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), "inductance-lab: working shown, no NaN");
};
