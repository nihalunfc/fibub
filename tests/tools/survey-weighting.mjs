// #494 survey weighting calculator
export const path = '/science/survey-weighting/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/survey-weighting/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.svw .sw-big'), facts = () => page.textContent('.svw .sw-facts'), pct = () => page.textContent('.svw .sw-pct');
  const fill = async (sel, v) => { await page.fill(`.svw ${sel}`, v); await page.waitForTimeout(500); };
  const sel = async (s, v) => { await page.selectOption(`.svw ${s}`, v); await page.waitForTimeout(250); };
  check((await page.textContent('.svw .sw-warn')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'survey: medical line shown');
  check((await big()) === '40 weights: design effect 1.258, effective sample 31.8', `survey: example raking (${await big()})`);
  { const f = await facts(); check(f.includes('Raking on 3 variables') && f.includes('14 rounds') && f.includes('0.4816') && f.includes('2.177') && f.includes('Weights add up to40'), 'survey: example facts'); }
  { const t = await pct(); check(t.includes('SmokesYes1127.5 %28.4 %') && t.includes('SexFemale2767.5 %51.0 %51.0 %') && !t.includes('ID'), 'survey: weighted percentages (ID column left out)'); }
  check((await page.$$('.svw .sw-wt tbody tr')).length === 15 && (await page.textContent('.svw .sw-wt')).includes('0.481637'), 'survey: first respondents and weights');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.svw .sw-csv')]); const f = OUT + 'sw.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 41 && rows[0] === 'ID,Sex,Age,Region,Smokes,design_weight,final_weight' && rows[1].startsWith('1,Female,18-34,North,Yes,1,0.4816373') && Math.abs(rows.slice(1).reduce((s, r) => s + Number(r.split(',').at(-1)), 0) - 40) < 1e-6, `survey: CSV (${rows[1]})`); }
  for (const f of ['png', 'pdf', 'docx']) {
    await page.locator(`.svw .dl [data-f=${f}]`).scrollIntoViewIfNeeded();
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.svw .dl [data-f=${f}]`)]);
    check(d.suggestedFilename() === `survey-weights.${f}`, `survey: ${f} report download`);
  }
  // Post-stratification uses the first variable only.
  await sel('.sw-m', 'post');
  check((await big()) === '40 weights: design effect 1.124, effective sample 35.58' && (await page.textContent('.svw .sw-note')).includes('only the first variable') && (await page.textContent('.svw .sw-wt')).includes('0.755556'), `survey: post-stratification (${await big()})`);
  await sel('.sw-m', 'rake');
  // Population total.
  await sel('.sw-tot', 'pop'); await fill('.sw-pop', '5000000');
  check((await facts()).includes('Weights add up to5,000,000') && (await big()).includes('1.258'), 'survey: weights add up to a population size');
  await sel('.sw-tot', 'n');
  // Design weights: add a column and use it, as weights and as probabilities.
  { const ex = await page.inputValue('.svw .sw-data'); const lines = ex.trim().split('\n');
    const withW = [lines[0] + '\tDW', ...lines.slice(1).map((l, i) => `${l}\t${1 + (i % 3) * 0.5}`)].join('\n');
    await fill('.sw-data', withW); }
  await sel('.sw-dw', '5'); await sel('.sw-v3', '');
  check((await big()) === '40 weights: design effect 1.265, effective sample 31.62' && (await facts()).includes('Design effect of design weights alone'), `survey: design weights, two variables (${await big()})`);
  await sel('.sw-dwk', 'p');
  check((await page.textContent('.svw .sw-derr')).includes('cannot be above 1'), 'survey: probabilities above 1 message');
  await sel('.sw-dwk', 'w'); await sel('.sw-dw', '');
  // Choosing a variable lists its categories.
  await sel('.sw-v3', '4');
  check((await page.inputValue('.svw .sw-mg3')) === 'Yes, \nNo, ' && (await page.textContent('.svw .sw-err')).includes('Smokes'), 'survey: new variable lists its categories and asks for figures');
  await fill('.sw-mg3', 'Yes, 20\nNo, 80');
  check((await pct()).includes('20.0 %') && await page.isHidden('.svw .sw-err'), 'survey: raking to a typed margin');
  // Bad inputs.
  await fill('.sw-mg3', 'Yes, 20\nNo, 70\nMaybe, 10');
  check((await page.textContent('.svw .sw-err')).includes('No respondent has Smokes "Maybe"') && await page.isHidden('.svw .sw-out'), 'survey: empty category message');
  await fill('.sw-mg3', 'Yes, 20');
  check((await page.textContent('.svw .sw-err')).includes('"No" (Smokes) is in the data'), 'survey: missing category message');
  await sel('.sw-v3', '1');
  check((await page.textContent('.svw .sw-err')).includes('only once'), 'survey: same variable twice message');
  await sel('.sw-v3', '');
  // Open a CSV file.
  writeFileSync(OUT + 'resp.csv', 'Sex,Age,Region,Q1\nFemale,18-34,North,a\nMale,55+,South,b\nFemale,35-54,South,a\nFemale,55+,North,b\n');
  await page.setInputFiles('.svw .dfb-in', OUT + 'resp.csv'); await page.waitForTimeout(900);

  check(await page.isVisible('.svw .sw-err') || await page.isVisible('.svw .sw-out'), 'survey: CSV file loads');
  await sel('.sw-v1', '0'); await sel('.sw-v2', ''); await fill('.sw-mg1', 'Female, 50\nMale, 50');
  check((await big()).startsWith('4 weights') && (await pct()).includes('Q1'), `survey: weights for the opened file (${await big()})`);
  await fill('.sw-data', 'just one line');
  check((await page.textContent('.svw .sw-derr')).includes('header row') && await page.isHidden('.svw .sw-out'), 'survey: too little data message');
};
