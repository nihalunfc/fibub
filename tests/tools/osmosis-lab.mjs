// #1121 Osmosis lab
export const path = '/learn/osmosis-lab/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.osl ';
  await page.goto(`${BASE}/learn/osmosis-lab/`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.osl-big'), facts = () => page.textContent(R + '.osl-facts');
  const tap = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); await page.click(R + sel); await page.waitForTimeout(250); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(250); };
  // Start: potato in plain water, end of soaking
  check((await big()) === 'Hypotonic: water moves in', `osmosis: plain water is hypotonic (${await big()})`);
  { const f = await facts(); check(f.includes('+8.0 %') && f.includes('firm (turgid)') && f.includes('0.30 osmol/L'), `osmosis: potato gains 8.0 % (${f.slice(0, 160)})`); }
  check((await page.textContent(R + '.osl-formula')).includes('(2.70 − 2.50) ÷ 2.50 × 100 = +8.0 %'), 'osmosis: Class 9 formula with live numbers');
  // Canvas really drawn
  const drawn = await page.$eval(R + '.osl-fig', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] < 200) n++; return n; });
  check(drawn > 200, `osmosis: picture drawn (${drawn} dark samples)`);
  // Isotonic button, then salt halves it
  await tap('.osl-q[data-q=iso]');
  check((await big()) === 'Isotonic: no net water movement' && (await facts()).includes('0.0 %') && (await page.textContent(R + '.osl-cv')).startsWith('0.30 M'), 'osmosis: isotonic sugar 0.30 M');
  await tap('.osl-sol button[data-v=salt]'); await tap('.osl-q[data-q=iso]');
  check((await page.textContent(R + '.osl-cv')).startsWith('0.15 M') && (await big()).startsWith('Isotonic'), 'osmosis: isotonic salt 0.15 M');
  // Strong solution: plasmolysis, and the time slider
  await tap('.osl-sol button[data-v=sucrose]'); await tap('.osl-q[data-q="1"]');
  check((await big()) === 'Hypertonic: water moves out' && (await facts()).includes('−35.0 %') && (await facts()).includes('plasmolysed'), 'osmosis: 1 M sugar loses 35 %');
  await slide('.osl-t', 0);
  check((await facts()).includes('+0.0 %') || (await facts()).includes('0.0 %'), 'osmosis: no change at time 0');
  await slide('.osl-t', 20);
  check((await page.textContent(R + '.osl-tv')) === '12 min' && (await facts()).includes('−22.1 %'), `osmosis: after one time constant (${await page.textContent(R + '.osl-tv')})`);
  await slide('.osl-t', 100);
  // Class 11 level: water potential
  await tap('.osl-level button[data-v="11"]');
  { const f = await facts(); check(f.includes('ψs of the solution−2.48 MPa') && f.includes('ψp (turgor pressure)0.00 MPa'), `osmosis: Class 11 water potentials (${f.slice(-200)})`); }
  check((await page.textContent(R + '.osl-formula')).includes('= −2.479 MPa'), 'osmosis: ψs formula with numbers');
  await tap('.osl-q[data-q="0"]');
  { const f = await facts(); const m = f.match(/ψ of the cell(−?[\d.]+) MPa/); check(m && m[1] === '0.00' || (m && m[1] === '−0.00'), `osmosis: at equilibrium in water ψ cell = 0 (${m && m[1]})`); }
  // Onion cell and red blood cell
  await tap('.osl-spec button[data-v=onion]'); await tap('.osl-q[data-q="1"]');
  check((await page.textContent(R + '.osl-say')).includes('plasmolysed'), 'osmosis: onion cell plasmolyses');
  await tap('.osl-spec button[data-v=rbc]'); await tap('.osl-q[data-q="0"]');
  check((await page.textContent(R + '.osl-say')).includes('burst'), 'osmosis: red blood cell bursts in water');
  await tap('.osl-sol button[data-v=salt]'); await slide('.osl-c', 0.3);
  check((await page.textContent(R + '.osl-say')).includes('shrunk (crenated)'), 'osmosis: red blood cell crenates in strong salt');
  // Practical with the raisin
  await tap('.osl-spec button[data-v=potato]'); await tap('.osl-sol button[data-v=sucrose]');
  check(await page.isDisabled(R + '.osl-csv'), 'osmosis: CSV waits for a run');
  await tap('.osl-run');
  const rows = await page.$$eval(R + '.osl-tab tbody tr', (t) => t.length);
  check(rows === 6 && /cross zero at about 0\.[1-4]\d M sugar/.test(await page.textContent(R + '.osl-est')), `osmosis: practical run (${await page.textContent(R + '.osl-est')})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.osl-csv')]); const f = OUT + 'osmosis.csv'; await d.saveAs(f); const lines = readFileSync(f, 'utf8').trim().split('\n');
    check(lines[0] === 'solution_M,solute,start,end,percent_change' && lines.length === 7 && lines[1].startsWith('0,sucrose,'), `osmosis: CSV (${lines[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'osmosis.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'osmosis: image report'); }
  // Check yourself: wrong answers first, then the stored right ones
  await tap('.osl-level button[data-v="9"]');
  const n = await page.$$eval(R + '.osl-qs li', (l) => l.length);
  await tap('.osl-check');
  check(n === 4 && (await page.textContent(R + '.osl-score')) === '0 of 4 right.' && (await page.$$eval(R + '.osl-worked', (w) => w.every((e) => !e.hidden && e.textContent.length > 20))), 'osmosis: quiz marks blanks wrong and shows working');
  await page.$$eval(R + '.osl-qs li', (lis) => lis.forEach((li) => { const el = li.querySelector('.osl-ans'); el.value = li.dataset.a; }));
  await tap('.osl-check');
  check((await page.textContent(R + '.osl-score')) === '4 of 4 right.', `osmosis: quiz right answers (${await page.textContent(R + '.osl-score')})`);
  await tap('.osl-level button[data-v="11"]');
  await page.$$eval(R + '.osl-qs li', (lis) => lis.forEach((li) => { const el = li.querySelector('.osl-ans'); el.value = li.dataset.a; }));
  await tap('.osl-check');
  check((await page.textContent(R + '.osl-score')) === '4 of 4 right.' && (await page.textContent(R + '.osl-qs')).includes('MPa'), 'osmosis: Class 11 quiz');
  await tap('.osl-new');
  check((await page.textContent(R + '.osl-score')) === '', 'osmosis: new questions clear the score');
};
