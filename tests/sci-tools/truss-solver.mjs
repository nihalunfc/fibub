// #648 2D truss and frame solver. Checked against (1) the method of joints for a statically determinate Pratt
// truss, solved as an equilibrium matrix with NumPy (independent of stiffness), (2) an independent NumPy direct
// stiffness program written for these tests (fixed-end loads by numerical integration of the shape functions),
// and (3) the textbook cantilever and propped-beam formulas. The example structures are made up.
import * as F from '../../src/lib/sci/eng-frame.ts';
import { num, parseTable } from '../../src/lib/sci/num.ts';
const near = (a, b, t) => Number.isFinite(a) && Math.abs(a - b) <= t;
const rel = (a, b, t) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  const pratt = F.buildModel('truss', parseTable('Node, x, y\n1,0,0\n2,3,0\n3,6,0\n4,9,0\n5,12,0\n6,3,3\n7,6,3\n8,9,3'),
    parseTable('Member, i, j, E, A\na,1,2,200,20\nb,2,3,200,20\nc,3,4,200,20\nd,4,5,200,20\ne,6,7,200,20\nf,7,8,200,20\ng,1,6,200,20\nh,8,5,200,20\ni,2,6,200,20\nj,3,7,200,20\nk,4,8,200,20\nl,6,3,200,20\nm,8,3,200,20'),
    parseTable('Node, type\n1, pin\n5, roller'), parseTable('Node, Fx, Fy, M\n2, 0, -20\n3,0,-20\n4,0,-20'), num);
  check('frame: headers skipped, 8 nodes, 13 members', pratt.nodes.length === 8 && pratt.members.length === 13 && pratt.supports.length === 2 && pratt.loads.length === 3);
  const r = F.analyse(pratt);
  const joints = [30, 30, 30, 30, -40, -40, -42.426407, -42.426407, 20, 0, 20, 14.142136, 14.142136];
  check('frame: Pratt truss forces equal the method of joints (NumPy)', r.members.every((m, k) => near(m.axial, joints[k], 1e-6)));
  check('frame: Pratt reactions 30 and 30 kN, no horizontal', near(r.reactions[0].ry, 30, 1e-9) && near(r.reactions[1].ry, 30, 1e-9) && near(r.reactions[0].rx, 0, 1e-9));
  check('frame: Pratt mid deflection −1.89853 mm (NumPy stiffness)', near(r.disp[2].uy * 1000, -1.8985281374238594, 1e-9));
  check('frame: equilibrium check sums to zero', near(r.check.fx, 0, 1e-9) && near(r.check.fy, 0, 1e-9) && near(r.check.m, 0, 1e-8));
  const portal = F.buildModel('frame', parseTable('1,0,0\n2,0,4\n3,6,4\n4,6,0'), parseTable('c1,1,2,200,50,5000\nb,2,3,200,50,5000,-10\nc2,3,4,200,50,5000'), parseTable('1,fixed\n4,fixed'), parseTable('2,15,0,0'), num);
  const p = F.analyse(portal);
  check('frame: portal sway 6.4562 mm and rotations (NumPy)', rel(p.disp[1].ux, 0.006456220880099067, 1e-8) && rel(p.disp[1].rz, -0.0034676771257838557, 1e-8) && rel(p.disp[2].rz, 0.0010591513708993058, 1e-8));
  check('frame: portal reactions (NumPy: 0.8984, 26.0036, 6.8724; −15.8984, 33.9964, 29.1489)', rel(p.reactions[0].rx, 0.8983750715037093, 1e-7) && rel(p.reactions[0].ry, 26.003552397868553, 1e-9) && rel(p.reactions[0].mz, 6.8724426714522195, 1e-7) && rel(p.reactions[1].rx, -15.898375071503732, 1e-7) && rel(p.reactions[1].mz, 29.1488717157592, 1e-7));
  check('frame: beam end moments 10.466 and −34.445 kN·m (NumPy)', rel(p.members[1].M1, 10.465942957467064, 1e-7) && rel(p.members[1].M2, -34.44462857025572, 1e-7) && rel(p.members[1].V2, 33.99644760213145, 1e-9));
  check('frame: portal equilibrium with the uniform load', near(p.check.fx, 0, 1e-8) && near(p.check.fy, 0, 1e-8) && near(p.check.m, 0, 1e-7));
  // Cantilever 3 m, tip load 10 kN: δ = PL³/3EI, θ = PL²/2EI, M = PL.
  const cant = F.analyse(F.buildModel('frame', [['a', '0', '0'], ['b', '3', '0']], [['1', 'a', 'b', '200', '50', '5000']], [['a', 'fixed']], [['b', '0', '-10']], num));
  const EI = 200e6 * 5000e-8;
  check('frame: cantilever tip deflection PL³/3EI and slope PL²/2EI', rel(cant.disp[1].uy, -10 * 27 / (3 * EI), 1e-10) && rel(cant.disp[1].rz, -10 * 9 / (2 * EI), 1e-10) && rel(cant.reactions[0].mz, 30, 1e-10));
  // Propped cantilever with UDL w: fixed-end moment wL²/8, prop reaction 3wL/8.
  const prop = F.analyse(F.buildModel('frame', [['a', '0', '0'], ['b', '5', '0']], [['1', 'a', 'b', '200', '50', '5000', '-8']], [['a', 'fixed'], ['b', 'roller']], [], num));
  check('frame: propped cantilever, fixed moment wL²/8 = 25, prop 3wL/8 = 15', rel(Math.abs(prop.reactions[0].mz), 25, 1e-10) && rel(prop.reactions[1].ry, 15, 1e-10));
  // Inclined member under a vertical uniform load: reactions add to w × length.
  const inc = F.analyse(F.buildModel('frame', [['a', '0', '0'], ['b', '4', '3']], [['1', 'a', 'b', '200', '50', '5000', '-2']], [['a', 'pin'], ['b', 'roller']], [], num));
  check('frame: inclined member, reactions carry w × 5 m = 10 kN', near(inc.reactions[0].ry + inc.reactions[1].ry, 10, 1e-9) && near(inc.check.m, 0, 1e-9));
  let msg = ''; try { F.analyse(F.buildModel('truss', [['a', '0', '0'], ['b', '3', '0'], ['c', '6', '0']], [['1', 'a', 'b', '200', '20'], ['2', 'b', 'c', '200', '20']], [['a', 'pin'], ['c', 'roller']], [['b', '0', '-5']], num)); } catch (e) { msg = e.message; }
  check('frame: a mechanism is reported as unstable', msg === 'unstable');
  msg = ''; try { F.buildModel('truss', [['a', '0', '0'], ['b', '3', '0']], [['1', 'a', 'z', '200', '20']], [['a', 'pin']], [], num); } catch (e) { msg = e.message; }
  check('frame: unknown node explained', msg.includes('node z'));
  msg = ''; try { F.buildModel('truss', [['a', '0', '0'], ['b', '3', '0']], [['1', 'a', 'b', '200', '20']], [['a', 'hinge']], [], num); } catch (e) { msg = e.message; }
  check('frame: unknown support type explained', msg.includes('not one of'));
  const dm = F.deflectedMember({ id: 'a', x: 0, y: 0 }, { id: 'b', x: 3, y: 0 }, [0, 0, 0], [0, cant.disp[1].uy, cant.disp[1].rz], 1, false, 6);
  check('frame: deflected shape follows the cubic and ends at the tip', near(dm[6][1], cant.disp[1].uy, 1e-12) && near(dm[3][1], cant.disp[1].uy * (1.5 ** 2 * (9 - 1.5)) / (2 * 27), 1e-12));
};
