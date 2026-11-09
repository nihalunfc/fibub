// #749 Social network analysis: example (networkx numbers), options, drawing, downloads, bad input.
export const path = '/science/social-network-analysis/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const vp = page.viewportSize();
  page.setDefaultTimeout(120000);
  await page.goto(BASE + path);
  await page.waitForSelector('.sn-out:not([hidden])');
  const txt = (s) => page.textContent(s), cell = (r, c) => page.textContent(`.sn-tab tbody tr:nth-child(${r}) td:nth-child(${c})`);
  const drawn = () => page.waitForFunction(() => { const c = document.querySelector('.sn-fig'); return c && c.width > 0 && c.getAttribute('aria-label')?.startsWith('Network drawing'); });
  await drawn();
  const f = await txt('.sn-facts');
  check(/People22/.test(f) && /Ties68 \(directed\)/.test(f) && /Density0\.147/.test(f) && /Reciprocity0\.353 \(12 mutual pairs\)/.test(f), `sna: example totals (${f})`);
  check(/Communities \(Louvain\)3, modularity 0\.524/.test(f) && /Named but did not answer2/.test(f) && /1 weak, 5 strong \(largest 12\)/.test(f), 'sna: communities, non-respondents, components');
  check((await cell(1, 1)) === 'Hugo' && (await cell(1, 2)) === '6' && (await cell(1, 7)) === '0.473', `sna: Hugo named most, eigenvector 0.473 (${await cell(1, 1)})`);
  await page.selectOption('.sn-sort', 'betweenness');
  check((await cell(1, 1)) === 'Sam' && (await cell(1, 5)) === '0.237', 'sna: Sam highest betweenness 0.237');
  await page.selectOption('.sn-sort', 'name');
  check((await cell(1, 1)) === 'Ava', 'sna: sort by name');
  check(/Arrows point/.test(await txt('.sn-legend')), 'sna: legend explains arrows');
  // Downloads.
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.sn-csv')]);
  const csv = readFileSync(await dl.path(), 'utf8');
  check(/^person,in_degree,out_degree,degree_centrality,in_degree_centrality,out_degree_centrality,betweenness,closeness,eigenvector,community,component\nAva,/.test(csv) && csv.trim().split('\n').length === 23, 'sna: measures CSV');
  const [ds] = await Promise.all([page.waitForEvent('download'), page.click('.sn-svg')]);
  const svg = readFileSync(await ds.path(), 'utf8');
  check(ds.suggestedFilename() === 'network.svg' && (svg.match(/<circle/g) || []).length === 22 && svg.includes('>Hugo<'), 'sna: drawing as SVG');
  for (const fm of ['png', 'pdf', 'docx']) {
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.sn .dl button[data-f="${fm}"]`)]);
    check(d.suggestedFilename() === `network.${fm}`, `sna: report ${fm}`);
  }
  // Layout and labels.
  const before = await page.$eval('.sn-fig', (c) => c.toDataURL());
  await page.click('.sn-redraw'); await drawn();
  check((await page.$eval('.sn-fig', (c) => c.toDataURL())) !== before && /People22/.test(await txt('.sn-facts')), 'sna: another layout, same measures');
  await page.uncheck('.sn-lab'); await drawn();
  check((await page.$eval('.sn-fig', (c) => c.toDataURL())) !== before, 'sna: names hidden');
  // Undirected.
  await page.uncheck('.sn-dir'); await page.waitForSelector('.sn-out:not([hidden])');
  check(/Ties56/.test(await txt('.sn-facts')) && !/Reciprocity/.test(await txt('.sn-facts')) && (await page.locator('.sn-tab thead th').count()) === 7, 'sna: undirected network, 56 ties');
  await page.check('.sn-dir');
  // Edge list.
  await page.click('.sn-mode button[data-m="edges"]');
  await page.fill('.sn-in', 'from,to\nA,B\nB,C\nC,A\nA,B\nD,D\nC,D');
  await page.waitForTimeout(700);
  const fe = await txt('.sn-facts');
  check(/People4/.test(fe) && /Ties4 \(directed\)/.test(fe) && /1 self-named, 1 repeated tie/.test(fe), `sna: edge list with a repeat and a self-tie (${fe})`);
  await page.uncheck('.sn-head'); await page.waitForTimeout(300);
  check(/People6/.test(await txt('.sn-facts')), 'sna: header row read as a tie when unticked');
  await page.fill('.sn-in', 'A\nB'); await page.waitForTimeout(700);
  check(/No ties found/.test(await txt('.sn-err')), 'sna: no ties explained');
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(BASE + path);
  await page.waitForSelector('.sn-out:not([hidden])'); await drawn();
  await page.screenshot({ path: OUT + 'social-network-analysis.png', fullPage: true });
  await page.setViewportSize(vp);
  page.setDefaultTimeout(30000);
};
