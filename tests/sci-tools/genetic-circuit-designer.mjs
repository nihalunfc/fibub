// #980 genetic circuit designer: design parsing, transcription units, design checks and the SVG layout, checked
// against hand-worked designs (the repressilator, a reverse-strand unit, broken designs).
import * as GC from '../../src/lib/sci/sbcircuit.ts';

const REP = `pLlacO1:promoter, rbs1:rbs, tetR:cds, T1:terminator
pLtetO1:promoter, rbs2:rbs, cI:cds, T2:terminator
pR:promoter, rbs3:rbs, lacI:cds, T3:terminator
lacI -| pLlacO1
tetR -| pLtetO1
cI -| pR`;

export default async (check) => {
  const { design: d, errors } = GC.parseDesign(REP);
  check('circuit: repressilator parses into 12 parts and 3 repressions', !errors.length && d.parts.length === 12 && d.interactions.length === 3 && d.interactions.every((i) => i.kind === 'repression'));
  const u = GC.transcriptionUnits(d);
  check('circuit: three terminated transcription units with one gene each', u.length === 3 && u.every((x) => x.terminated && x.cds.length === 1) && u[0].cds[0] === 'tetR' && u[2].parts.join() === 'rbs3,lacI,T3');
  check('circuit: the repressilator passes every check', GC.checkDesign(d).length === 0);
  const L = GC.layout(d);
  check('circuit: layout has one box per part, left to right without overlap', L.boxes.length === 12 && L.boxes.every((b, i) => i === 0 || b.x >= L.boxes[i - 1].x + L.boxes[i - 1].w));
  { const svg = GC.toSvg(L, { ink: '#000', muted: '#555', accent: '#00f', bad: '#c00', bg: '#fff', soft: '#eee' }); check('circuit: SVG has a glyph path for every part, labels and three red repression arcs', svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"') && (svg.match(/<text/g) || []).length === 12 && (svg.match(/stroke="#c00"/g) || []).length === 6 && svg.includes('>lacI</text>')); }
  { const { design } = GC.parseDesign('pA:promoter, r:rbs, g:cds, t:terminator, X -> pA, g -> pA'); const w = GC.checkDesign(design); check('circuit: unknown interaction source is reported, activation parsed', w.length === 1 && w[0].includes('no part called "X"') && design.interactions[1].kind === 'activation'); }
  { const { design } = GC.parseDesign('pA:promoter\ng:cds\nh:gene'); const w = GC.checkDesign(design).join(' | '); check('circuit: missing RBS and missing terminator are reported', w.includes('g: no ribosome binding site') && w.includes('h: no ribosome binding site') && w.includes('pA: no terminator')); }
  { const { design } = GC.parseDesign('r:rbs, g:cds, t:terminator'); check('circuit: a gene with no promoter is not transcribed', GC.checkDesign(design).some((x) => x.includes('not transcribed'))); }
  { const { design } = GC.parseDesign('<t:terminator, <g:cds, <r:rbs, <o:operator, <p:promoter, q:promoter, r2:rbs, h:cds, t2:terminator'); const u2 = GC.transcriptionUnits(design); check('circuit: reverse-strand unit reads right to left; operators between RBS and promoter are fine', u2.length === 2 && u2[0].rev && u2[0].parts.join() === 'o,r,g,t' && u2[0].terminated && GC.checkDesign(design).length === 0); }
  { const { design } = GC.parseDesign('p:promoter, r:rbs, g:cds, t:terminator, g -| r'); check('circuit: regulating a non-promoter is flagged', GC.checkDesign(design).some((x) => x.includes('which is a rbs'))); }
  { const { errors: e } = GC.parseDesign('lacI, foo:widget, :cds'); check('circuit: bad parts give three messages', e.length === 3 && e[0].includes('name:type') && e[1].includes('unknown type') && e[2].includes('needs a name')); }
  { const { design } = GC.parseDesign('a:promoter, a:cds'); check('circuit: duplicate names are reported', GC.checkDesign(design).some((x) => x.includes('Two parts are called "a"'))); }
  { const { design } = GC.parseDesign('p1:promoter, r1:rbs, g1:cds, t1:term, p2:p, r2:rbs, g2:cds, t2:t, g1 -| p2, g2 -| p1, g1 -> p1'); const L2 = GC.layout(design); const arcs = L2.prims.filter((p) => p.k === 'path' && (p.stroke === 'bad' || p.stroke === 'accent') && p.d.split(' L').length === 4); const ys = new Set(arcs.map((a) => a.d.split(' L')[1].split(' ')[1])); check('circuit: overlapping arcs go on separate levels', arcs.length === 3 && ys.size === 3); }
  check('circuit: text in names is escaped in SVG', GC.toSvg(GC.layout(GC.parseDesign('a<b:cds').design), { ink: '#000', muted: '#555', accent: '#00f', bad: '#c00', bg: '#fff', soft: '#eee' }).includes('a&lt;b'));
};
