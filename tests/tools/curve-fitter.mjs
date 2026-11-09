// #976 Curve fitter
export const path = '/science/curve-fitter/';
export default async ({ page, check, OUT, BASE, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/curve-fitter/`); await page.waitForTimeout(800);
  const t = (c) => page.textContent('.cfc ' + c), wait = () => page.waitForTimeout(200);
  check((await t('.cf-big')) === 'χ²/dof = 0.764 (p = 0.74): consistent with the uncertainties', 'curvefit: example verdict');
  { const tab = await t('.cf-tab'); check(tab.includes('109.488') && tab.includes('4.55547') && tab.includes('10.914') && tab.includes('4.56 ± 0.52') && tab.includes('109.5 ± 7.3') && tab.includes('10.9 ± 2.1'), 'curvefit: example parameters (scipy values)'); }
  check((await t('.cf-facts')).includes('18 degrees of freedom') && (await page.inputValue('.cfc .cf-p0')).startsWith('a = ') && await page.isVisible('.cfc .cf-fig1') && await page.isVisible('.cfc .cf-fig2') && (await t('.cf-corr')).includes('1.000'), 'curvefit: statistics, starting values, figures, correlations');
  await page.selectOption('.cfc .cf-m', 'line'); await wait();
  check((await t('.cf-big')).startsWith('χ²/dof = 5.90 (p = 3.3 × 10⁻¹⁵): poor fit'), 'curvefit: straight line is a poor fit');
  for (const [m, want] of [['quad', 'χ²/dof = 1.27'], ['exp', 'χ²/dof = 1.55'], ['gauss', 'χ²/dof = 0.749'], ['cubic', 'χ²/dof = '], ['origin', 'χ²/dof = ']]) { await page.selectOption('.cfc .cf-m', m); await wait(); check((await t('.cf-big')).startsWith(want), `curvefit: ${m} model`); }
  await page.selectOption('.cfc .cf-m', 'power'); await wait();
  check((await t('.cf-err')).includes('power law cannot start at x = 0'), 'curvefit: power law at x = 0 message');
  await page.fill('.cfc .cf-f', 'A*exp(-x/tau) + B'); await page.fill('.cfc .cf-p0', 'A = 100, tau = 5, B = 10'); await wait();
  check((await page.inputValue('.cfc .cf-m')) === 'custom' && (await t('.cf-tab')).includes('4.55547') && (await t('.cf-tab')).includes('tau'), 'curvefit: own formula gives the same fit');
  await page.click('.cfc .cf-scale'); await wait();
  check((await t('.cf-tab')).includes('4.56 ± 0.45') && (await t('.cf-facts')).includes('scaled'), 'curvefit: scaled uncertainties');
  await page.click('.cfc .cf-scale'); await page.selectOption('.cfc .cf-cs', '-1'); await wait();
  check((await t('.cf-big')) === 'R² = 0.9651, residual standard error 6.23' && (await t('.cf-tab')).includes('4.83 ± 0.55'), 'curvefit: unweighted fit');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cfc .cf-csv')]); const f = OUT + 'cf.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 22 && r[0] === 'x,y,fit,residual', 'curvefit: CSV of fitted values'); }
  await page.selectOption('.cfc .cf-cs', '2'); await page.fill('.cfc .cf-p0', 'A 100'); await wait();
  check((await t('.cf-err')).includes('name = value'), 'curvefit: bad starting values message');
  await page.fill('.cfc .cf-f', 'exp(x'); await wait(); check((await t('.cf-err')).startsWith('Formula:'), 'curvefit: bad formula message');
  await page.fill('.cfc .cf-f', 'sin(x)'); await wait(); check((await t('.cf-err')).includes('at least one parameter'), 'curvefit: formula without parameters message');
  await page.click('.cfc .cf-guess'); await wait();
  writeFileSync(OUT + 'cf-in.csv', 'V,I,dI\n1,2.1,0.1\n2,3.9,0.1\n3,6.2,0.2\n4,7.9,0.2\n5,10.1,0.2\n');
  await page.selectOption('.cfc .cf-m', 'line'); await page.setInputFiles('.cfc .dfb-in', OUT + 'cf-in.csv'); await page.waitForTimeout(600);
  check((await t('.cf-parse')).startsWith('5 rows, 3 columns') && (await t('.cf-tab')).includes('b') && (await t('.cf-big')).startsWith('χ²/dof'), 'curvefit: open a file');
  await page.fill('.cfc .cf-in', '1\t2\t0\n2\t3\t1\n3\t4\t1'); await wait();
  check((await t('.cf-err')).includes('Row 1: the uncertainty must be'), 'curvefit: zero sigma message');
  await page.fill('.cfc .cf-in', '1\t2\t1\n2\t3\t1'); await wait();
  check((await t('.cf-err')).includes('Need more than 2 points'), 'curvefit: too few points message');
  await page.fill('.cfc .cf-in', '1\t2\t1\n2\t3\t1\n3\t5\t1\n4\t6\t1'); await wait();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cfc .dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'curve-fit.pdf', 'curvefit: PDF report'); }
  check(await page.getAttribute('.cfc a[href="/science/uncertainty-calculator/"]', 'href') !== null && await page.getAttribute('.cfc a[href="/science/plot-maker/"]', 'href') !== null, 'curvefit: links to #25 and #27');
};
