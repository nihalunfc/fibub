// #205 pedigree drawing tool. Generations, loops and consanguinity checked against an independent Python check
// with networkx 3.7 (is_directed_acyclic_graph, find_cycle, ancestors) on the page's made-up family; the layout
// is checked for the rules a pedigree drawing must keep (order, spacing, children centred under parents).
import { readPeople, checkPeople, layout, toTable, consanguineous, addParents, addChild, addSibling, removePerson, drawPedigree, drawingSize, roman } from '../../src/lib/sci/pedidraw.ts';
import { parseTable } from '../../src/lib/sci/num.ts';
import { svgPainter } from '../../src/lib/sci/plot.ts';

const EX = `id	father	mother	sex	affected	carrier	deceased	proband	twin	adopted	note
Arthur			M			yes				d. aged 78
Beatrice			F		yes					
Colin	Arthur	Beatrice	M	yes						
Fiona			F							
Diana	Arthur	Beatrice	F		yes					
George			M							
Edith	Arthur	Beatrice	F							
Harry	Colin	Fiona	M							
Iris	Colin	Fiona	F		yes					
Jack	George	Diana	M	yes				DZ1		
Kevin	George	Diana	M					DZ1		
Lena	George	Diana	F						in	
Max	Kevin	Iris	M	yes			yes			
Nora	Kevin	Iris	F							
Child	Kevin	Iris	U							sex unknown`;
export default async (check) => {
  const read = (t) => readPeople(parseTable(t));
  const { people, errors } = read(EX);
  check('pedigree: example reads, 15 people, no errors', errors.length === 0 && people.length === 15);
  const c = checkPeople(people);
  check('pedigree: example passes the checks', c.errors.length === 0 && c.warnings.length === 0 && !c.fatal);
  const L = layout(people), gen = (r) => L.rows[r].slice().sort().join();
  check('pedigree: generation I as networkx', gen(0) === 'Arthur,Beatrice');
  check('pedigree: generation II as networkx (married-in partners on their partner\'s row)', gen(1) === 'Colin,Diana,Edith,Fiona,George');
  check('pedigree: generation III as networkx', gen(2) === 'Harry,Iris,Jack,Kevin,Lena');
  check('pedigree: generation IV as networkx', gen(3) === 'Child,Max,Nora');
  check('pedigree: only Kevin + Iris consanguineous, as networkx', L.couples.filter((x) => x.consang).map((x) => x.father + x.mother).join() === 'KevinIris' && L.couples.length === 4);
  check('pedigree: consanguinity of first cousins and of unrelated partners', consanguineous(people, 'Iris', 'Kevin') && !consanguineous(people, 'Colin', 'Fiona') && consanguineous(people, 'Arthur', 'Max'));
  check('pedigree: labels', L.label.get('Arthur') === 'I-1' && L.label.get('Diana') === 'II-4' && L.label.get('Max') === 'IV-1' && L.label.get('Iris') === 'III-2' && L.label.get('Kevin') === 'III-3');
  let ok = true;
  for (const r of L.rows) for (let i = 1; i < r.length; i++) if (L.x.get(r[i]) - L.x.get(r[i - 1]) < 1 - 1e-9) ok = false;
  check('pedigree: no overlaps, at least one space apart on every row', ok);
  let worst = 0;
  for (const cp of L.couples) { const pm = (L.x.get(cp.father) + L.x.get(cp.mother)) / 2, km = cp.children.reduce((s, k) => s + L.x.get(k), 0) / cp.children.length; worst = Math.max(worst, Math.abs(pm - km)); }
  check(`pedigree: children centred under their parents (worst ${worst.toFixed(3)})`, worst < 0.05);
  check('pedigree: married-in partner beside partner, man on the left', L.x.get('Fiona') - L.x.get('Colin') === 1 && L.x.get('Diana') - L.x.get('George') === 1);
  check('pedigree: twins side by side', Math.abs(Math.abs(L.x.get('Jack') - L.x.get('Kevin')) - 1) < 1e-9);
  check('pedigree: Roman numerals', roman(4) === 'IV' && roman(9) === 'IX' && roman(14) === 'XIV');
  // Broken tables.
  const msgs = (t) => { const r = read(t); return [...r.errors, ...checkPeople(r.people).errors].join(' | '); };
  const head = 'id\tfather\tmother\tsex\n';
  check('pedigree: loop found (as networkx find_cycle)', msgs(EX.replace('Arthur\t\t\tM', 'Arthur\tMax\tNora\tM')).includes('Loop: '));
  check('pedigree: missing parent', msgs(head + 'A\tB\tC\tM\nB\t\t\tM').includes('Missing parent: A\'s mother "C"'));
  check('pedigree: one parent only', msgs(head + 'A\tB\t\tM\nB\t\t\tM').includes('only one parent'));
  check('pedigree: father marked female', msgs(head + 'A\tB\tC\tM\nB\t\t\tF\nC\t\t\tF').includes('Sex conflict: B is a father but is marked female'));
  check('pedigree: father of one and mother of another', msgs(head + 'A\tB\tC\tM\nD\tC\tB\tF\nB\t\t\tM\nC\t\t\tF').includes('listed as a father of one person and a mother of another'));
  check('pedigree: duplicate id and own parent', msgs(head + 'A\t\t\tM\nA\t\t\tF').includes('used twice') && msgs(head + 'A\tA\tB\tM\nB\t\t\tF').includes('own parent'));
  check('pedigree: bad sex', msgs(head + 'A\t\t\tdog').includes('sex must be M, F or U'));
  { const t = 'id\tfather\tmother\tsex\ttwin\nA\t\t\tM\t\nB\t\t\tF\t\nC\tA\tB\tM\tMZ1\nD\tA\tB\tF\tMZ1'; check('pedigree: identical twins of different sex', msgs(t).includes('must be the same sex')); }
  // Columns by header name in another order, booleans, round trip.
  { const r = read('sex,id,mother,father,affected\nM,Dad,,,yes\nF,Mum,,,\nF,Kid,Mum,Dad,1'); check('pedigree: header columns in any order', r.errors.length === 0 && r.people[2].father === 'Dad' && r.people[2].affected && r.people[0].affected && !r.people[1].affected); }
  check('pedigree: table round trip', toTable(read(toTable(people)).people) === toTable(people));
  // Adding relatives.
  let p = addParents(people, 'Fiona');
  check('pedigree: add parents', p.length === 17 && p.find((x) => x.id === 'Fiona').father === 'Father1' && p.find((x) => x.id === 'Mother1').sex === 'F');
  let r = addChild(people, 'Edith', 'M');
  check('pedigree: add a son to someone with no partner makes a partner', r.people.length === 17 && r.people.find((x) => x.id === r.added).mother === 'Edith' && r.people.find((x) => x.id === 'Partner1').sex === 'M' && checkPeople(r.people).errors.length === 0);
  r = addChild(people, 'Colin', 'F');
  check('pedigree: add a daughter uses the existing partner', r.people.length === 16 && r.people.find((x) => x.id === r.added).mother === 'Fiona');
  r = addSibling(people, 'George', 'F');
  check('pedigree: add a sister to someone without parents adds parents too', r.people.length === 18 && r.people.find((x) => x.id === r.added).father === r.people.find((x) => x.id === 'George').father);
  let msg = ''; try { removePerson(people, 'Colin'); } catch (e) { msg = e.message; }
  check('pedigree: remove refuses someone with children, allows a leaf', msg.includes('has children') && removePerson(people, 'Nora').length === 14);
  msg = ''; try { addChild(people, 'Child', 'M'); } catch (e) { msg = e.message; }
  check('pedigree: add a child needs a known sex', msg.includes('sex first'));
  // Drawing: symbols counted in the SVG.
  const { w, h } = drawingSize(L), P = svgPainter(w, h);
  drawPedigree(P, people, L, { ink: '#000', bg: '#fff', muted: '#555', accent: '#00f' });
  const svg = P.toString(), n = (re) => (svg.match(re) || []).length;
  check(`pedigree: SVG has 7 circles for 7 women plus 3 carrier dots (${n(/<circle/g)})`, n(/<circle/g) === 10);
  check('pedigree: SVG has the numerals and the proband P', svg.includes('>IV</text>') && svg.includes('>P</text>'));
  check('pedigree: SVG fills 3 affected symbols black', n(/<(polygon|circle)[^>]*fill="#000" stroke="#000"/g) === 3);
};
