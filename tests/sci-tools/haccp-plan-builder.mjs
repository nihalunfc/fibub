// #396 HACCP plan builder: decision questions, CCP numbering, tables and saved-plan reading. The decision tree is
// checked on all 243 answer combinations against an independent Python reading of the Codex tree (scratch hc.py).
import { decide, analysePlan, problems, fromJSON, readSteps, planTables, planCsvRows, examplePlan, emptyPlan, emptyHazard } from '../../src/lib/sci/haccp.ts';
export default async (check) => {
  const A = ['', 'yes', 'no'];
  let s = '';
  for (const a of A) for (const b of A) for (const c of A) for (const d of A) for (const e of A) s += decide({ q1: a, q1b: b, q2: c, q3: d, q4: e }).result[0];
  check('haccp: decision tree matches Python on all 243 combinations', s === 'ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppcccccccccppppncnnnpppppppppcccccccccppppncnnnpppppppppcccccccccppppncnnnpppppppppppppppppppppppppppmmmmmmmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnnnnnnnnnnnnnnnnnnn');
  check('haccp: questions asked in order', decide({ q1: 'yes', q1b: '', q2: 'no', q3: 'yes', q4: '' }).asked.join() === 'q1,q2,q3,q4' && decide({ q1: 'no', q1b: '', q2: 'yes', q3: '', q4: '' }).asked.join() === 'q1,q1b');
  const p = examplePlan(), a = analysePlan(p);
  check('haccp: example CCPs numbered in flow order', a.filter((x) => x.ccp).map((x) => `${x.ccp}:${x.h.step}:${x.h.type}`).join('|') === '1:Cook chicken:B|2:Cool:B|3:Mix with pasta and dressing:C');
  const pr = problems(p);
  check('haccp: example problems list missing CCP details', pr.length === 2 && pr[0].startsWith('CCP 2 (Spore-forming') && pr[0].includes('corrective action, verification, records') && pr[1].startsWith('CCP 3'));
  const t = planTables(p);
  check('haccp: tables', t.hazards.rows.length === 5 && t.hazards.rows[0][0] === '1. Receive raw chicken' && t.hazards.rows[1][5] === 'CCP 1' && t.ccps.rows.length === 3 && t.ccps.head.length === 8 && t.ccps.rows[0][3].startsWith('Core temperature'));
  const rows = planCsvRows(p);
  check('haccp: CSV rows', rows[0][0] === 'Product' && rows.some((r) => r[0] === 'HACCP plan') && rows.filter((r) => r[0]?.startsWith('CCP ')).length === 3);
  const back = fromJSON(JSON.stringify(p));
  check('haccp: saved plan reads back the same', JSON.stringify(back) === JSON.stringify(p));
  const odd = fromJSON(JSON.stringify({ product: { name: 5, team: 'x', evil: 'y' }, steps: ['A', '', 7], hazards: [{ step: 'A', type: 'Z', q1: 'maybe', q2: 'yes', hazard: 'h', extra: 1 }] }));
  check('haccp: saved plan cleaned of unknown fields', odd.product.name === '' && odd.product.team === 'x' && !('evil' in odd.product) && odd.steps.join() === 'A' && odd.hazards[0].type === 'B' && odd.hazards[0].q1 === '' && odd.hazards[0].q2 === 'yes' && !('extra' in odd.hazards[0]));
  check('haccp: bad saved text ignored', fromJSON('{bad') === null && fromJSON(null) === null && fromJSON('3') === null);
  check('haccp: steps from text', readSteps('1. Receive\n2) Store\n\n  Cook  \nCook\n10 - Pack').join('|') === 'Receive|Store|Cook|Pack');
  const e = emptyPlan(); e.hazards.push(emptyHazard('Gone'));
  const ep = problems(e);
  check('haccp: hazard on a missing step flagged', ep.some((x) => x.includes('not in the flow (Gone)')) && ep.some((x) => x.includes('no description')));
  const m = emptyPlan(); m.steps = ['S']; m.hazards.push({ ...emptyHazard('S'), hazard: 'X', q1: 'no', q1b: 'yes' });
  check('haccp: modify step flagged', problems(m)[0].includes('needs a control measure'));
};
