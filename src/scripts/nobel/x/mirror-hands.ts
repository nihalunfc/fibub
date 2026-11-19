// A carbon atom with four different groups and its mirror image. Drag the left molecule to turn it and try
// to make it sit exactly on the right one. "Search for me" tries thousands of turns and reports the best
// fit. Then make two groups the same: the molecule stops being chiral and a perfect match appears.
import { stage, clear, text, dot, line, rng, type Stage } from '../kit';

type V = [number, number, number];
const TET: V[] = [[0, 1, 0], [0.9428, -1 / 3, 0], [-0.4714, -1 / 3, 0.8165], [-0.4714, -1 / 3, -0.8165]];
const rot = (v: V, ax: number, ay: number): V => { const [x, y, z] = v; const c1 = Math.cos(ay), s1 = Math.sin(ay); const x1 = x * c1 + z * s1, z1 = -x * s1 + z * c1; const c2 = Math.cos(ax), s2 = Math.sin(ax); return [x1, y * c2 - z1 * s2, y * s2 + z1 * c2]; };
const rotM = (v: V, m: number[]): V => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
function randRot(r: () => number) { // uniform random rotation from a random unit quaternion
  const u1 = r(), u2 = r() * 2 * Math.PI, u3 = r() * 2 * Math.PI;
  const a = Math.sqrt(1 - u1) * Math.sin(u2), b = Math.sqrt(1 - u1) * Math.cos(u2), c = Math.sqrt(u1) * Math.sin(u3), d = Math.sqrt(u1) * Math.cos(u3);
  return [1 - 2 * (c * c + d * d), 2 * (b * c - a * d), 2 * (b * d + a * c), 2 * (b * c + a * d), 1 - 2 * (b * b + d * d), 2 * (c * d - a * b), 2 * (b * d - a * c), 2 * (c * d + a * b), 1 - 2 * (b * b + c * c)];
}

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Try it: mirror test', title: 'Can you lay a molecule on its mirror image?', h: 330, alt: 'Two tetrahedral molecules with four coloured balls, mirror images of each other. Dragging turns the left one; a score shows how far it is from matching the right one.', caption: 'Ball colours stand for four different groups on one carbon atom (like H, OH, CH₃ and COOH in lactic acid). The score is the largest distance between a ball and the same-coloured ball on the mirror image (bond length = 1).' });
  const r = rng(9);
  let ax = 0.3, ay = 0.6, same = false, spin = true, best = '';
  const cols = () => { const c = s.col; return same ? [c.ink, c.blue, c.amber, c.amber] : [c.ink, c.blue, c.amber, c.teal]; };
  const mirror = TET.map(([x, y, z]) => [-x, y, z] as V);
  const score = (pts: V[]) => { const k = cols(); let worst = 0; pts.forEach((p, i) => { let d = Infinity; mirror.forEach((m, j) => { if (k[j] === k[i]) d = Math.min(d, Math.hypot(p[0] - m[0], p[1] - m[1], p[2] - m[2])); }); worst = Math.max(worst, d); }); return worst; };
  s.choice([['diff', 'Four different groups'], ['same', 'Two groups the same']], 'diff', (v) => { same = v === 'same'; best = ''; });
  s.button('Search for me', () => {
    let b = Infinity, bm: number[] = [];
    for (let i = 0; i < 20000; i++) { const m = randRot(r); const sc = score(TET.map((v) => rotM(v, m))); if (sc < b) { b = sc; bm = m; } }
    // Turn the left molecule to the best rotation found (as two angles is not enough; store the matrix).
    found = bm; spin = false; best = `Best of 20,000 random turns: off by ${b.toFixed(2)} bond lengths.`;
  });
  let found: number[] | null = null;
  let last: [number, number] | null = null;
  s.pointer((x, y, k) => { if (k === 'down') { last = [x, y]; spin = false; found = null; } else if (k === 'move' && last) { ay += (x - last[0]) * 0.012; ax += (y - last[1]) * 0.012; last = [x, y]; } else last = null; });
  const drawMol = (pts: V[], cx: number, cy: number) => {
    const k = cols(), R = 70;
    const order = pts.map((p, i) => [p, i] as const).sort((a, b) => a[0][2] - b[0][2]);
    for (const [p] of order) line(s, [[cx, cy], [cx + p[0] * R, cy - p[1] * R]], s.col.muted, 3);
    dot(s, cx, cy, 11, s.col.muted);
    for (const [p, i] of order) dot(s, cx + p[0] * R, cy - p[1] * R, 13 + p[2] * 4, k[i]);
  };
  s.play((dt) => {
    if (spin) ay += dt * 0.6;
    const left = TET.map((v) => (found ? rotM(v, found) : rot(v, ax, ay)));
    clear(s); const c = s.col;
    drawMol(left, s.W * 0.27, s.H * 0.5);
    drawMol(mirror, s.W * 0.73, s.H * 0.5);
    line(s, [[s.W / 2, 30], [s.W / 2, s.H - 30]], c.line, 2, [6, 6]);
    text(s, 'drag to turn', s.W * 0.27, s.H - 24, { align: 'center', size: 12, colour: c.muted });
    text(s, 'mirror image', s.W * 0.73, s.H - 24, { align: 'center', size: 12, colour: c.muted });
    const sc = score(left);
    text(s, `Mismatch: ${sc.toFixed(2)}`, 14, 24, { bold: true, colour: sc < 0.05 ? c.good : c.ink });
    s.mark();
    s.out(best ? `${best} ${same ? 'A perfect fit: with two identical groups the molecule is <b>not chiral</b>.' : 'Never zero: a carbon with four different groups is <b>chiral</b>. Its two forms are like your left and right hands.'}` : (same ? 'With two groups the same, some turn makes the two pictures identical. Try to find it, or press Search for me.' : 'Drag the left molecule to turn it. Can you make every ball sit on the same colour on the right?'));
  });
}
