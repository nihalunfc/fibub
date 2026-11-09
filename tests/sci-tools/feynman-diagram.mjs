// #949 Feynman diagram drawer: parsing, label notation, arc geometry (checked against the circle through the end
// points with the TikZ "bend left" exit angle) and TikZ-Feynman output (key names from the tikz-feynman manual).
import { parse, labelParts, labelTex, labelPlain, along, lineLength, linePath, toSvg, toTikz, PRESETS } from '../../src/lib/sci/phfeyn.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;
  const { diagram, errors } = parse(PRESETS.ee.text);
  check('feynman: e+e- → μ+μ- example parses (6 vertices, 5 lines)', errors.length === 0 && diagram.vertices.length === 6 && diagram.edges.length === 5 && diagram.edges[2].type === 'photon' && diagram.edges[2].momentum === 'q' && diagram.edges[1].right);
  check('feynman: every example parses', Object.values(PRESETS).every((p) => parse(p.text).errors.length === 0));
  const bad = parse('a 0 0\nb 1 0\na b laser\na c fermion\nq 1\na a fermion\na b photon bend=200\na 2 2');
  check('feynman: error messages for unknown type, missing vertex, short line, loop on one vertex, bend, duplicate', bad.errors.length === 6 && /unknown line type/.test(bad.errors.join()) && /position first/.test(bad.errors.join()) && /two different vertices/.test(bad.errors.join()) && /defined twice/.test(bad.errors.join()));
  check('feynman: labels e-, ~nu_e, W^+, pi0, gamma', labelPlain('e-') === 'e−' && labelParts('~nu_e')[0].bar && labelParts('~nu_e')[1].pos === 'sub' && labelParts('W^+')[1].pos === 'sup' && labelPlain('pi0') === 'π0' && labelPlain('gamma') === 'γ');
  check('feynman: LaTeX labels', labelTex('e-') === '\\(e^{-}\\)' && labelTex('~nu_e') === '\\(\\bar{\\nu}_{e}\\)' && labelTex('gamma') === '\\(\\gamma\\)' && labelTex('mu+') === '\\(\\mu^{+}\\)' && labelTex('nu_mu') === '\\(\\nu_{\\mu}\\)');
  // Arc: chord from (0,0) to (2,0) bent left by 60°: radius c/(2 sin θ) = 1.1547, the middle point is r(1 − cos θ) = 0.57735 above.
  const th = Math.PI / 3, r = 2 / (2 * Math.sin(th));
  const m = along([0, 0], [2, 0], 60, 0.5), s0 = along([0, 0], [2, 0], 60, 0), s1 = along([0, 0], [2, 0], 60, 1);
  check('feynman: bent line is the circle arc through both ends, leaving at the bend angle', near(m.p[0], 1) && near(m.p[1], r * (1 - Math.cos(th))) && near(s0.p[0], 0) && near(s0.p[1], 0) && near(s1.p[0], 2) && near(s1.p[1], 0) && near(Math.atan2(s0.t[1], s0.t[0]), th) && near(lineLength([0, 0], [2, 0], 60), 2 * r * th));
  const q = along([0, 0], [2, 0], 60, 0.3), cy = -r * Math.cos(th);
  check('feynman: every point of the arc is at the radius from the centre', near(Math.hypot(q.p[0] - 1, q.p[1] - cy), r) && near(along([0, 0], [2, 0], -60, 0.5).p[1], -r * (1 - Math.cos(th))));
  const w = linePath([0, 0], [3, 0], 'photon', 0, 60);
  check('feynman: photon wave starts and ends on the vertices, amplitude 4.5 px', near(w[0][0], 0) && near(w[0][1], 0) && near(w.at(-1)[0], 3) && Math.abs(w.at(-1)[1]) < 1e-12 && near(Math.max(...w.map((p) => p[1])) * 60, 4.5, 0.05));
  const g = linePath([0, 0], [3, 0], 'gluon', 0, 60);
  check('feynman: gluon coil ends on the vertices and loops back (curly)', near(g[0][0], 0) && near(g.at(-1)[0], 3, 1e-9) && g.some((p, i) => i && p[0] < g[i - 1][0]));
  const svg = toSvg(diagram).svg;
  check('feynman: SVG has a path per line, three arrows and labels', svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"') && (svg.match(/<path d="M[^"]*" fill="none"/g) || []).length >= 6 && (svg.match(/ Z" fill=/g) || []).length === 4 && svg.includes('γ') && svg.includes('μ'));
  const tz = toTikz(diagram);
  check('feynman: TikZ-Feynman code', tz.includes('\\vertex [dot] (v1) at (1.5, 1);') && tz.includes('\\vertex (i1) at (0, 2);') && tz.includes('(i1) -- [fermion, edge label=\\(e^{-}\\)] (v1),') && tz.includes("(v1) -- [fermion, edge label'=\\(e^{+}\\)] (i2)") && tz.includes("[photon, edge label=\\(\\gamma\\), momentum'=\\(q\\)]") && tz.trim().endsWith('\\end{tikzpicture}'));
  const lp = toTikz(parse(PRESETS.loop.text).diagram);
  check('feynman: bends and vertex dots in TikZ', lp.includes('bend left=70') && toTikz(parse('a 0 0\nb 1 0 blob\na b gluon g bend=-30').diagram).includes('bend right=30') && toTikz(parse(PRESETS.ggh.text).diagram).includes('\\vertex [dot] (c)'));
};
