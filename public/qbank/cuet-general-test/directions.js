// CUET General Test: directions and distance. Original questions for fibub.
import { pick, int, choose, fmt, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
const mc = (id, level, sub, q, opts, sol, trap) => {
  const k = parseInt(id.slice(-3), 10) % 4; const o = opts.slice(1); o.splice(k, 0, opts[0]);
  return mcq(id, level, sub, q, o, k, sol, trap);
};
const D8 = ['North', 'North-east', 'East', 'South-east', 'South', 'South-west', 'West', 'North-west'];
const D4 = ['North', 'East', 'South', 'West'];
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [20, 21, 29], [12, 16, 20], [15, 20, 25], [12, 35, 37]];
const VEC = { North: [0, 1], East: [1, 0], South: [0, -1], West: [-1, 0] };

export default {
  topic: 'directions',
  items: [
    mc('dr-001', 1, 'distance', 'Ravi walks 5 km north and then 12 km east. How far is he from his starting point?', ['13 km', '17 km', '7 km', '15 km'], 'North and east are at right angles, so use Pythagoras: √(5² + 12²) = √169 = <b>13 km</b>.', 'Adding 5 + 12 = 17 gives the distance walked, not the distance from the start.'),
    mc('dr-002', 1, 'distance', 'Priya walks 8 km west and then 6 km south. How far is she from where she started?', ['10 km', '14 km', '2 km', '12 km'], '√(8² + 6²) = √100 = <b>10 km</b>.'),
    mc('dr-003', 1, 'turns', 'Amit faces north. He turns right, then left, then left again. Which way is he facing now?', ['West', 'East', 'North', 'South'], 'North → right → East → left → North → left → <b>West</b>.'),
    mc('dr-004', 2, 'distance and direction', 'A boy walks 3 km south, turns left and walks 4 km. How far and in which direction is he from the start?', ['5 km, south-east', '7 km, south-east', '5 km, north-east', '5 km, south-west'], 'Facing south, his left is east. So he went 3 km south and 4 km east: distance √(9 + 16) = 5 km, and he is to the <b>south-east</b> of the start.', 'When you face south, left is east (not west).'),
    mc('dr-005', 2, 'turns', 'Sita faces south. She turns 90° anticlockwise, then 180°, then 90° clockwise. Which way does she face finally?', ['North', 'South', 'East', 'West'], 'Anticlockwise 90° from south gives East. Another 180° gives West. Clockwise 90° from west gives <b>North</b>.', 'Anticlockwise on a compass goes N → W → S → E, so from south it is east, not west.'),
    mc('dr-006', 2, 'shadow', 'At sunrise, Mohan stands with his back to the Sun. In which direction does his shadow fall?', ['West', 'East', 'North', 'South'], 'The Sun rises in the east. With his back to the Sun he faces west, and a shadow falls away from the Sun: towards the <b>west</b>.'),
    mc('dr-007', 3, 'shadow', 'In the evening, Sumi stands so that her shadow falls on her right-hand side. Which direction is she facing?', ['North', 'South', 'East', 'West'], 'In the evening the Sun is in the west, so shadows fall to the east. Her right-hand side is east. When you face north your right hand is east. She is facing <b>north</b>.', 'Facing south, the right hand is west, so the shadow could not be on her right.'),
    mc('dr-008', 2, 'distance', 'Neha walks 10 m north, turns right and walks 15 m, then turns right and walks 10 m. How far is she from her starting point?', ['15 m', '25 m', '35 m', '20 m'], 'North 10, then east 15, then south 10 (right of east is south). The north and south legs cancel, so she is 15 m east of the start: <b>15 m</b>.'),
    mc('dr-009', 2, 'distance', 'A man walks 7 km east, 12 km north and then 2 km west. How far is he from the start?', ['13 km', '21 km', '19 km', '15 km'], 'Net east = 7 − 2 = 5 km. Net north = 12 km. Distance = √(5² + 12²) = <b>13 km</b>.'),
    mc('dr-010', 1, 'relative position', 'P is to the south-west of Q. In which direction is Q with respect to P?', ['North-east', 'North-west', 'South-east', 'South-west'], 'The opposite of south-west is <b>north-east</b>.'),
    mc('dr-011', 2, 'distance', 'Town X is 8 km west of Town Y. Town Z is 6 km north of Town Y. What is the distance between X and Z?', ['10 km', '14 km', '2 km', '12 km'], 'X, Y and Z make a right-angled triangle with the right angle at Y. XZ = √(8² + 6²) = <b>10 km</b>.'),
    mc('dr-012', 2, 'turns', 'Karan stands facing the rising Sun. He turns 90° clockwise and then 45° anticlockwise. Which way is he now facing?', ['South-east', 'South-west', 'North-east', 'South'], 'The rising Sun is in the east. 90° clockwise from east gives South. 45° anticlockwise from south turns towards east: <b>South-east</b>.'),
    mc('dr-013', 1, 'relative position', 'Which direction is exactly opposite to north-west?', ['South-east', 'South-west', 'North-east', 'South'], 'Opposite of north is south and opposite of west is east. So opposite of north-west is <b>south-east</b>.'),
    mc('dr-014', 2, 'clock', 'A clock face is laid flat on a table with the 12 pointing north. At 6:15, in which direction does the minute hand point?', ['East', 'West', 'South', 'North'], 'At 15 minutes the minute hand is on the 3. If 12 is north then 3 is <b>east</b>.'),
    mc('dr-015', 2, 'distance and direction', 'Radha walks 4 km south, turns left and walks 5 km, then turns left again and walks 4 km. How far and in which direction is she from the start?', ['5 km east', '5 km west', '13 km east', '5 km south'], 'South 4; left of south is east, so east 5; left of east is north, so north 4. The north and south legs cancel. She is <b>5 km east</b> of the start.'),
    mc('dr-016', 2, 'turns', 'Dev faces north-east. He turns 90° clockwise and then turns through 180°. Which way is he facing?', ['North-west', 'South-west', 'North-east', 'South-east'], 'North-east turned 90° clockwise is south-east. A 180° turn gives <b>north-west</b>.'),
    mc('dr-017', 3, 'distance and direction', 'A man travels 20 km east, 15 km north, 20 km west and then 5 km south. How far and in which direction is he from the starting point?', ['10 km north', '10 km south', '20 km north', '5 km north'], 'East and west cancel (20 − 20 = 0). North 15 and south 5 leave 10 km north. He is <b>10 km north</b> of the start.'),
    mc('dr-018', 1, 'distance', 'Meena walks 12 m south and then 16 m west. How far is she from the start?', ['20 m', '28 m', '4 m', '24 m'], '√(12² + 16²) = √400 = <b>20 m</b>.'),
    mc('dr-019', 1, 'distance', 'Two friends start from the same spot. One walks 15 km west and the other 8 km south. How far apart are they?', ['17 km', '23 km', '7 km', '19 km'], 'West and south make a right angle: √(15² + 8²) = √289 = <b>17 km</b>.'),
    mc('dr-020', 2, 'distance and direction', 'A cyclist rides 5 km south, turns left and rides 3 km, then turns left again and rides 5 km. How far and in which direction is he from the start?', ['3 km east', '3 km west', '13 km east', '5 km north'], 'South 5, east 3 (left of south), north 5 (left of east). North and south cancel, so he is <b>3 km east</b> of the start.'),
    mc('dr-021', 3, 'renaming', 'If east is called north, north is called west, west is called south and south is called east, what will north-west be called?', ['South-west', 'North-east', 'South-east', 'North-west'], 'North is now "west" and west is now "south". So north-west (north + west) becomes "west + south" = <b>south-west</b>.'),
    mc('dr-022', 3, 'renaming', 'If west is called north, north is called east, east is called south and south is called west, what will north-east be called?', ['South-east', 'North-west', 'South-west', 'North-east'], 'North is called "east" and east is called "south". So north-east is "east + south" = <b>south-east</b>.'),
    mc('dr-023', 3, 'turns', 'Rohit faces south and turns 135° anticlockwise. Which way does he face now?', ['North-east', 'North-west', 'South-east', 'North'], 'South turned 90° anticlockwise is east. A further 45° anticlockwise gives <b>north-east</b>.'),
    mc('dr-024', 2, 'turns', 'Girija faces west. She turns 90° clockwise and then 45° anticlockwise. Which way is she facing?', ['North-west', 'North-east', 'South-west', 'North'], 'West turned 90° clockwise is north. 45° anticlockwise from north is <b>north-west</b>.'),
    mc('dr-025', 3, 'relative position', 'A is 10 m east of B. C is 10 m north of A. D is 10 m west of C. In which direction and how far is D from B?', ['10 m north', '10 m south', '20 m north-east', '10 m east'], 'Put B at the origin. A = (10, 0). C = (10, 10). D = (0, 10). So D is <b>10 m north</b> of B.'),
    mc('dr-026', 2, 'distance and direction', 'Kunal walks 3 km east, then 4 km north, then 3 km west. How far and in which direction is he from the start?', ['4 km north', '4 km south', '10 km north', '3 km west'], 'East 3 and west 3 cancel. He is 4 km north of the start: <b>4 km north</b>.'),
    mc('dr-027', 2, 'distance', 'A boy walks 24 m north and then 7 m east. How far is he from the starting point?', ['25 m', '31 m', '17 m', '27 m'], '√(24² + 7²) = √625 = <b>25 m</b>.'),
    mc('dr-028', 3, 'turns', 'Tanvi faces north-west. She turns 90° anticlockwise and then through 180°. Which way is she now facing?', ['North-east', 'South-east', 'North-west', 'South-west'], 'North-west turned 90° anticlockwise gives south-west. A 180° turn gives <b>north-east</b>.'),
    mc('dr-029', 2, 'distance', 'Village P is 9 km east of Village Q. Village R is 12 km south of Q. What is the distance between P and R?', ['15 km', '21 km', '3 km', '17 km'], 'The right angle is at Q. PR = √(9² + 12²) = √225 = <b>15 km</b>.'),
    mc('dr-030', 2, 'distance and direction', 'Pooja walks 9 km north, 12 km east and then 9 km south. How far and in which direction is she from the start?', ['12 km east', '12 km west', '30 km east', '15 km north-east'], 'North 9 and south 9 cancel, leaving the 12 km east. She is <b>12 km east</b> of the start.'),
    mc('dr-031', 2, 'distance', 'Sanjay walks 4 km east, 3 km north, 4 km west and 3 km south. How far is he from the starting point?', ['0 km', '7 km', '5 km', '14 km'], 'East 4 and west 4 cancel, and north 3 and south 3 cancel. He is back at the start: <b>0 km</b>.', 'The path is 14 km long, but the question asks for the distance from the start.'),
    mc('dr-032', 3, 'distance', 'Asha walks 20 km east and then 21 km north. What is her shortest distance from the start?', ['29 km', '41 km', '1 km', '30 km'], '√(20² + 21²) = √841 = <b>29 km</b> (20, 21, 29 is a Pythagorean triple).'),
    mc('dr-033', 3, 'turns', 'Dolly faces north-east and turns 135° clockwise. Which way is she facing?', ['South', 'South-east', 'West', 'South-west'], 'North-east is 45° from north. Adding 135° clockwise gives 180°, which is <b>south</b>.'),
    mc('dr-034', 3, 'turns', 'Anita faces south-east and turns 90° anticlockwise. Which way is she facing?', ['North-east', 'South-west', 'North-west', 'East'], 'South-east is 135° from north. Turning 90° anticlockwise gives 45°, which is <b>north-east</b>.'),
    mc('dr-035', 1, 'turns', 'Vikas faces east. He turns right, then right again, then left. Which way is he facing?', ['South', 'North', 'East', 'West'], 'East → right → South → right → West → left → <b>South</b>.'),
  ],
  gens: [
    { id: 'dr-g01', type: 'mcq', level: 1, sub: 'distance', ...T,
      make(rng) {
        const [a0, b0, c0] = choose(rng, TRIPLES), flip = rng() < 0.5, a = flip ? b0 : a0, b = flip ? a0 : b0;
        const d1 = choose(rng, D4), turn = choose(rng, ['left', 'right']), i = D4.indexOf(d1), d2 = D4[(i + (turn === 'right' ? 1 : 3)) % 4];
        const { options, answer } = shuffleOpts(rng, c0, [a + b, Math.abs(a - b), c0 + 2], (v) => `${v} km`);
        return { q: `A man walks ${a} km ${d1.toLowerCase()}, turns ${turn} and walks ${b} km. How far is he from his starting point?`, options, answer, a, b,
          sol: steps(`Facing ${d1.toLowerCase()}, a turn to the ${turn} is ${d2.toLowerCase()}. The two legs are at right angles.`, `Distance = √(${a}² + ${b}²) = √${a * a + b * b} = <b>${c0} km</b>.`),
          trap: `Adding the legs (${a + b} km) gives the walk, not the distance from the start.` };
      },
      verify: (p) => p.options.indexOf(`${Math.round(Math.sqrt(p.a * p.a + p.b * p.b))} km`) },
    { id: 'dr-g02', type: 'mcq', level: 2, sub: 'turns', ...T,
      make(rng) {
        const start = int(rng, 0, 3), n = int(rng, 3, 4), seq = [];
        for (let i = 0; i < n; i++) seq.push(choose(rng, ['right', 'left', 'about']));
        let cur = start; for (const t of seq) cur = (cur + (t === 'right' ? 1 : t === 'left' ? 3 : 2)) % 4;
        const words = seq.map((t) => (t === 'about' ? 'turns around (180°)' : `turns ${t}`));
        const { options, answer } = shuffleOpts(rng, D4[cur], D4.filter((x) => x !== D4[cur]), (v) => v);
        const trail = []; let c = start; for (const t of seq) { c = (c + (t === 'right' ? 1 : t === 'left' ? 3 : 2)) % 4; trail.push(D4[c]); }
        return { q: `A boy faces ${D4[start].toLowerCase()}. He ${words.join(', then ')}. Which way is he facing now?`, options, answer, start, seq,
          sol: steps(`Start: ${D4[start]}.`, `After each turn: ${trail.join(' → ')}.`, `Final direction: <b>${D4[cur]}</b>.`), trap: 'Left and right swap meaning if you mix up which way you face: follow one turn at a time.' };
      },
      verify: (p) => { let c = p.start; for (const t of p.seq) c = (c + { right: 1, left: 3, about: 2 }[t]) % 4; return p.options.indexOf(D4[c]); } },
    { id: 'dr-g03', type: 'mcq', level: 3, sub: 'distance', ...T,
      make(rng) {
        const [p, q, r] = choose(rng, TRIPLES), c = int(rng, 2, 8), e = p + c;
        const { options, answer } = shuffleOpts(rng, r, [e + q + c, r + 2, Math.max(1, r - 2)], (v) => `${v} km`);
        return { q: `Seema walks ${e} km east, then ${q} km north, then ${c} km west. How far is she from her starting point?`, options, answer, p, qq: q, r,
          sol: steps(`Net east = ${e} − ${c} = ${p} km. Net north = ${q} km.`, `Distance = √(${p}² + ${q}²) = √${p * p + q * q} = <b>${r} km</b>.`),
          trap: 'East and west legs partly cancel: subtract them before using Pythagoras.' };
      },
      verify: (p) => p.options.indexOf(`${Math.round(Math.hypot(p.p, p.qq))} km`) },
    { id: 'dr-g04', type: 'mcq', level: 3, sub: 'turns', ...T,
      make(rng) {
        const start = int(rng, 0, 7), k = int(rng, 1, 5), cw = rng() < 0.5, fin = (((start + (cw ? k : -k)) % 8) + 8) % 8;
        const { options, answer } = shuffleOpts(rng, D8[fin], D8.filter((x) => x !== D8[fin] && [(fin + 1) % 8, (fin + 7) % 8, (fin + 4) % 8].includes(D8.indexOf(x))), (v) => v);
        return { q: `Kavya faces ${D8[start].toLowerCase()} and turns ${k * 45}° ${cw ? 'clockwise' : 'anticlockwise'}. Which way does she face now?`, options, answer, start, k, cw,
          sol: steps(`The eight directions are 45° apart, going clockwise: N, NE, E, SE, S, SW, W, NW.`, `${k * 45}° is ${k} step${k > 1 ? 's' : ''} ${cw ? 'forward' : 'back'} from ${D8[start]}: <b>${D8[fin]}</b>.`),
          trap: 'Anticlockwise moves backwards through the list N, NE, E, ...' };
      },
      verify: (p) => p.options.indexOf(D8[(((p.start + (p.cw ? p.k : -p.k)) % 8) + 8) % 8]) },
    { id: 'dr-g05', type: 'mcq', level: 2, sub: 'relative position', ...T,
      make(rng) {
        const a = choose(rng, ['North', 'South']), b = choose(rng, ['East', 'West']), x = int(rng, 2, 9), y = int(rng, 2, 9);
        const dx = VEC[b][0], dy = VEC[a][1], fx = -dx, fy = -dy;
        const nm = (vx, vy) => `${vy > 0 ? 'North' : 'South'}-${vx > 0 ? 'east' : 'west'}`;
        const right = nm(fx, fy);
        const { options, answer } = shuffleOpts(rng, right, ['North-east', 'North-west', 'South-east', 'South-west'].filter((z) => z !== right), (v) => v);
        return { q: `A woman walks ${x} km ${a.toLowerCase()} and then ${y} km ${b.toLowerCase()}. In which direction is her starting point from where she stands now?`, options, answer, a, b,
          sol: steps(`She moved ${a.toLowerCase()} and ${b.toLowerCase()}, so she now stands to the ${a.toLowerCase()}-${b.toLowerCase()} of the start.`, `The start is in the opposite direction: <b>${right}</b>.`),
          trap: 'The question asks where the start is from her, not where she is from the start.' };
      },
      verify: (p) => { const opp = { North: 'South', South: 'North', East: 'east', West: 'west' }; return p.options.indexOf(`${opp[p.a]}-${{ East: 'west', West: 'east' }[p.b]}`); } },
  ],
};
