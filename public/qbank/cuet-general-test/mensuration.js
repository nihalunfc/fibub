// CUET General Test: mensuration (areas, perimeters, volumes). Original questions for fibub. Items are fixed; gens make fresh numbers.
// Where pi is needed the questions say "take pi = 22/7" so the numbers come out clean.
import { pick, int, choose, fmt, rs, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
// Puts the right answer at a position that varies with the id number, so it is not always first.
const mk = (id, level, sub, q, right, wrongs, sol, trap) => {
  const k = parseInt(id.slice(-3), 10) % 4, o = [...wrongs]; o.splice(k, 0, right);
  return mcq(id, level, sub, q, o, k, sol, trap);
};

export default {
  topic: 'mensuration',
  items: [
    mk('me-001', 1, 'rectangle', 'What is the area of a rectangular plot 24 m long and 15 m wide?', '360 m²', ['78 m²', '39 m²', '720 m²'],
      'Area = length × breadth = 24 × 15 = <b>360 m²</b>.',
      '78 is the perimeter (2 × 39), which is in metres, not square metres.'),
    mk('me-002', 1, 'rectangle', 'What is the perimeter of a rectangle 18 m long and 12 m wide?', '60 m', ['216 m', '30 m', '120 m'],
      'Perimeter = 2 × (length + breadth) = 2 × 30 = <b>60 m</b>.'),
    mk('me-003', 1, 'square', 'The perimeter of a square field is 48 m. What is its area?', '144 m²', ['48 m²', '192 m²', '576 m²'],
      'Side = 48 ÷ 4 = 12 m. Area = 12² = <b>144 m²</b>.'),
    mk('me-004', 1, 'triangle', 'What is the area of a triangle with base 14 cm and height 9 cm?', '63 cm²', ['126 cm²', '23 cm²', '45 cm²'],
      'Area = ½ × base × height = ½ × 14 × 9 = <b>63 cm²</b>.',
      '126 forgets the half.'),
    mk('me-005', 1, 'circle', 'Taking π = 22/7, what is the area of a circle of radius 7 cm?', '154 cm²', ['44 cm²', '308 cm²', '49 cm²'],
      'Area = πr² = 22/7 × 7 × 7 = 22 × 7 = <b>154 cm²</b>.',
      '44 cm is the circumference (2πr); area needs r squared.'),
    mk('me-006', 1, 'circle', 'Taking π = 22/7, what is the circumference of a circle of radius 14 cm?', '88 cm', ['616 cm', '44 cm', '176 cm'],
      'Circumference = 2πr = 2 × 22/7 × 14 = 2 × 22 × 2 = <b>88 cm</b>.',
      '616 cm² is the area, with the wrong unit.'),
    mk('me-007', 2, 'pythagoras', 'The two shorter sides of a right-angled triangle are 9 cm and 12 cm. What is the hypotenuse?', '15 cm', ['21 cm', '14 cm', '13 cm'],
      '9² + 12² = 81 + 144 = 225 and √225 = <b>15 cm</b>. This is the 3-4-5 triangle scaled by 3.',
      '21 is 9 + 12; the hypotenuse is shorter than the sum of the other two sides.'),
    mk('me-008', 3, 'triangle', 'What is the area of a triangle with sides 13 cm, 14 cm and 15 cm?', '84 cm²', ['91 cm²', '105 cm²', '72 cm²'],
      'Heron\'s formula: s = (13 + 14 + 15) ÷ 2 = 21. Area = √(21 × 8 × 7 × 6) = √7,056 = <b>84 cm²</b>. (Check: base 14 and height 12 give ½ × 14 × 12 = 84.)'),
    mk('me-009', 1, 'cube', 'What is the total surface area of a cube of edge 6 cm?', '216 cm²', ['36 cm²', '144 cm²', '72 cm²'],
      'A cube has 6 square faces: 6 × 6² = 6 × 36 = <b>216 cm²</b>.',
      '216 is also the volume (6³); here both happen to equal, but surface area is 6a² and volume is a³.'),
    mk('me-010', 1, 'cuboid', 'What is the volume of a cuboid 10 cm long, 8 cm wide and 5 cm high?', '400 cm³', ['230 cm³', '80 cm³', '340 cm³'],
      'Volume = l × b × h = 10 × 8 × 5 = <b>400 cm³</b>.'),
    mk('me-011', 2, 'cylinder', 'Taking π = 22/7, what is the volume of a cylinder of radius 7 cm and height 10 cm?', '1,540 cm³', ['440 cm³', '154 cm³', '3,080 cm³'],
      'Volume = πr²h = 22/7 × 7 × 7 × 10 = 22 × 7 × 10 = <b>1,540 cm³</b>.',
      '440 is the curved surface area (2πrh).'),
    mk('me-012', 2, 'cylinder', 'Taking π = 22/7, what is the curved surface area of a cylinder of radius 7 cm and height 10 cm?', '440 cm²', ['1,540 cm²', '154 cm²', '880 cm²'],
      'Curved surface area = 2πrh = 2 × 22/7 × 7 × 10 = 2 × 22 × 10 = <b>440 cm²</b>.'),
    mk('me-013', 2, 'cone', 'Taking π = 22/7, what is the volume of a cone with base radius 3 cm and height 7 cm?', '66 cm³', ['198 cm³', '33 cm³', '132 cm³'],
      'Volume = ⅓πr²h = ⅓ × 22/7 × 9 × 7 = ⅓ × 22 × 9 = <b>66 cm³</b>.',
      '198 forgets the ⅓.'),
    mk('me-014', 2, 'sphere', 'Taking π = 22/7, what is the surface area of a sphere of radius 7 cm?', '616 cm²', ['154 cm²', '308 cm²', '1,436 cm²'],
      'Surface area = 4πr² = 4 × 22/7 × 49 = 4 × 22 × 7 = <b>616 cm²</b>.',
      '154 is the area of a circle of the same radius (πr²); a sphere is four times that.'),
    mk('me-015', 2, 'trapezium', 'The parallel sides of a trapezium are 12 cm and 18 cm and the distance between them is 10 cm. What is its area?', '150 cm²', ['300 cm²', '120 cm²', '180 cm²'],
      'Area = ½ × (sum of parallel sides) × height = ½ × 30 × 10 = <b>150 cm²</b>.'),
    mk('me-016', 2, 'rhombus', 'The diagonals of a rhombus are 16 cm and 12 cm. What is its area?', '96 cm²', ['192 cm²', '28 cm²', '48 cm²'],
      'Area = ½ × d₁ × d₂ = ½ × 16 × 12 = <b>96 cm²</b>.',
      '192 forgets the half.'),
    mk('me-017', 2, 'cost', 'A rectangular field 40 m by 25 m is fenced with wire costing ₹20 per metre. What is the total cost?', '₹2,600', ['₹1,300', '₹20,000', '₹1,600'],
      'Perimeter = 2 × (40 + 25) = 130 m. Cost = 130 × 20 = <b>₹2,600</b>.',
      '₹20,000 uses the area (1,000 m²); fencing goes round the edge.'),
    mk('me-018', 2, 'tiles', 'How many square tiles of side 40 cm are needed to cover the floor of a room 8 m by 6 m?', '300', ['30', '120', '1,200'],
      'Floor = 8 × 6 = 48 m² = 480,000 cm². One tile = 40 × 40 = 1,600 cm². Number = 480,000 ÷ 1,600 = <b>300</b>. (Or 800 ÷ 40 = 20 by 600 ÷ 40 = 15 tiles: 20 × 15 = 300.)',
      'Mixing metres and centimetres (48 ÷ 40 × 40) gives nonsense; convert to one unit first.'),
    mk('me-019', 3, 'path', 'A park is 30 m by 20 m. A path 2 m wide runs all round it, inside the park. What is the area of the path?', '184 m²', ['200 m²', '168 m²', '216 m²'],
      'The inner grass part is (30 − 4) × (20 − 4) = 26 × 16 = 416 m². Path = 600 − 416 = <b>184 m²</b>.',
      'Taking only 2 m off each dimension (28 × 18 = 504, giving 96) forgets the path is on both sides.'),
    mk('me-020', 2, 'cost', 'Taking π = 22/7, what is the cost of fencing a circular park of radius 14 m at ₹10 per metre?', '₹880', ['₹616', '₹8,800', '₹440'],
      'Circumference = 2 × 22/7 × 14 = 88 m. Cost = 88 × 10 = <b>₹880</b>.',
      '₹6,160 would come from the area (616 m²) at ₹10.'),
    mk('me-021', 2, 'scaling', 'If the radius of a circle is doubled, its area becomes:', '4 times', ['2 times', '3 times', '8 times'],
      'Area ∝ r². Doubling r makes the area (2)² = <b>4 times</b> as large.'),
    mk('me-022', 1, 'cube', 'The volume of a cube is 343 cm³. What is the length of its edge?', '7 cm', ['49 cm', '8 cm', '9 cm'],
      'Edge = ∛343 = <b>7 cm</b>, since 7 × 7 × 7 = 343.'),
    mk('me-023', 2, 'capacity', 'A water tank is 4 m long, 3 m wide and 2.5 m deep. How many litres does it hold? (1 m³ = 1,000 litres)', '30,000 litres', ['3,000 litres', '300,000 litres', '24,000 litres'],
      'Volume = 4 × 3 × 2.5 = 30 m³. In litres: 30 × 1,000 = <b>30,000</b>.'),
    mk('me-024', 3, 'recasting', 'Taking π = 22/7, a wire in the shape of a square of side 22 cm is bent into a circle. What is the radius of the circle?', '14 cm', ['7 cm', '28 cm', '22 cm'],
      'The wire length stays the same: 4 × 22 = 88 cm. For the circle 2πr = 88, so 2 × 22/7 × r = 88 and r = <b>14 cm</b>.'),
    mk('me-025', 2, 'pythagoras', 'What is the length of the diagonal of a rectangle 12 cm by 5 cm?', '13 cm', ['17 cm', '14 cm', '11 cm'],
      'Diagonal = √(12² + 5²) = √(144 + 25) = √169 = <b>13 cm</b> (the 5-12-13 triple).'),
    mk('me-026', 2, 'cone', 'A cylinder has volume 90 cm³. A cone has the same base and the same height. What is the volume of the cone?', '30 cm³', ['45 cm³', '60 cm³', '270 cm³'],
      'A cone is one-third of the cylinder with the same base and height: 90 ÷ 3 = <b>30 cm³</b>.'),
    mk('me-027', 2, 'square', 'The diagonal of a square is 20 cm. What is its area?', '200 cm²', ['400 cm²', '100 cm²', '283 cm²'],
      'Area of a square = (diagonal)² ÷ 2 = 400 ÷ 2 = <b>200 cm²</b>. (Side = 20/√2 ≈ 14.14 cm, and 14.14² = 200.)',
      '400 is the square of the diagonal without halving.'),
    mk('me-028', 3, 'circle', 'Taking π = 22/7, a circular plate has an area of 616 cm². What is its circumference?', '88 cm', ['44 cm', '176 cm', '154 cm'],
      'πr² = 616, so r² = 616 × 7 ÷ 22 = 196 and r = 14 cm. Circumference = 2 × 22/7 × 14 = <b>88 cm</b>.',
      '44 cm would be for radius 7 cm.'),
    mk('me-029', 3, 'percent', 'The length of a rectangle is increased by 20% and its breadth by 10%. By what percent does its area increase?', '32%', ['30%', '31%', '22%'],
      'Area factor = 1.2 × 1.1 = 1.32, an increase of <b>32%</b>. Formula: 20 + 10 + (20 × 10)/100 = 32.',
      'Adding 20 + 10 = 30 leaves out the extra 2% from the product.'),
    mk('me-030', 2, 'sphere', 'Taking π = 22/7, what is the curved surface area of a hemisphere of radius 7 cm?', '308 cm²', ['616 cm²', '154 cm²', '462 cm²'],
      'Curved surface of a hemisphere = 2πr² = 2 × 22/7 × 49 = 2 × 22 × 7 = <b>308 cm²</b> (half of the sphere\'s 616).',
      '462 is the total surface area (3πr²), which includes the flat circle.'),
    mk('me-031', 3, 'bricks', 'A wall of volume 9 m³ is built with bricks of size 20 cm × 10 cm × 7.5 cm. How many bricks are needed (ignoring the mortar)?', '6,000', ['600', '60,000', '7,500'],
      'Brick volume = 20 × 10 × 7.5 = 1,500 cm³. Wall = 9 m³ = 9,000,000 cm³ (1 m³ = 10⁶ cm³). Number = 9,000,000 ÷ 1,500 = <b>6,000</b>.',
      '1 m³ is 1,000,000 cm³, not 1,000 or 10,000.'),
    mk('me-032', 3, 'ring', 'Taking π = 22/7, what is the area of the ring between two circles with radii 14 cm and 7 cm?', '462 cm²', ['154 cm²', '616 cm²', '308 cm²'],
      'Ring area = π(R² − r²) = 22/7 × (196 − 49) = 22/7 × 147 = 22 × 21 = <b>462 cm²</b>.',
      '154 comes from π(R − r)², which is wrong.'),
  ],
  gens: [
    { id: 'me-g01', type: 'mcq', level: 2, sub: 'rectangle', ...T,
      make(rng) {
        const l = int(rng, 10, 40), b = int(rng, 5, l - 2), p = 2 * (l + b), a = l * b;
        const { options, answer } = shuffleOpts(rng, a, [p, l + b, a * 2], (v) => `${fmt(v, 0)} m²`);
        return { q: `The perimeter of a rectangular plot is ${p} m and its length is ${l} m. What is its area?`, options, answer,
          sol: steps(`Length + breadth = ${p} ÷ 2 = ${p / 2}, so breadth = ${p / 2} − ${l} = ${b} m.`, `Area = ${l} × ${b} = <b>${a} m²</b>.`),
          trap: 'Perimeter is half-added: l + b is half the perimeter, not the perimeter.' };
      } },
    { id: 'me-g02', type: 'mcq', level: 1, sub: 'cost', ...T,
      make(rng) {
        const l = int(rng, 20, 60), b = int(rng, 10, 40), r = choose(rng, [10, 15, 20, 25, 30]), c = 2 * (l + b) * r;
        const { options, answer } = shuffleOpts(rng, c, [l * b * r, (l + b) * r, c + 2 * r * 5], (v) => rs(v, 0));
        return { q: `A rectangular ground ${l} m by ${b} m is to be fenced at ${rs(r, 0)} per metre. What is the total cost?`, options, answer,
          sol: steps(`Perimeter = 2 × (${l} + ${b}) = ${2 * (l + b)} m.`, `Cost = ${2 * (l + b)} × ${r} = <b>${rs(c, 0)}</b>.`),
          trap: 'Fencing goes round the edge, so use the perimeter, not the area.' };
      } },
    { id: 'me-g03', type: 'mcq', level: 1, sub: 'circle', ...T,
      make(rng) {
        const r = 7 * int(rng, 1, 5), area = 22 * r * r / 7, circ = 44 * r / 7;
        const askArea = rng() < 0.5, ans = askArea ? area : circ;
        const { options, answer } = shuffleOpts(rng, ans, [askArea ? circ : area, ans * 2, ans + 22], (v) => `${fmt(v, 0)} cm${askArea ? '²' : ''}`);
        return { q: `Taking π = 22/7, what is the ${askArea ? 'area' : 'circumference'} of a circle of radius ${r} cm?`, options, answer,
          sol: askArea ? steps('Area = πr².', `= 22/7 × ${r} × ${r} = <b>${fmt(area, 0)} cm²</b>.`) : steps('Circumference = 2πr.', `= 2 × 22/7 × ${r} = <b>${fmt(circ, 0)} cm</b>.`),
          trap: 'Area uses r squared and is in cm²; circumference uses r once and is in cm.' };
      } },
    { id: 'me-g04', type: 'mcq', level: 2, sub: 'pythagoras', ...T,
      make(rng) {
        const [a, b, c] = choose(rng, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), k = int(rng, 1, 5);
        const { options, answer } = shuffleOpts(rng, c * k, [(a + b) * k, c * k + 1, (b - a) * k + 1], (v) => `${v} cm`);
        return { q: `The two shorter sides of a right-angled triangle are ${a * k} cm and ${b * k} cm. What is the length of the hypotenuse?`, options, answer,
          sol: steps(`Hypotenuse² = ${a * k}² + ${b * k}² = ${(a * k) ** 2} + ${(b * k) ** 2} = ${(c * k) ** 2}.`, `Hypotenuse = <b>${c * k} cm</b>.`),
          trap: 'Adding the two sides always gives a number that is too big.' };
      } },
    { id: 'me-g05', type: 'mcq', level: 2, sub: 'capacity', ...T,
      make(rng) {
        const l = int(rng, 2, 8), b = int(rng, 2, 6), h = choose(rng, [1, 1.5, 2, 2.5, 3]), v = l * b * h * 1000;
        const { options, answer } = shuffleOpts(rng, v, [v / 10, v * 10, l * b * h], (x) => `${fmt(x, 0)} litres`);
        return { q: `A water tank is ${l} m long, ${b} m wide and ${h} m deep. How many litres can it hold? (1 m³ = 1,000 litres)`, options, answer,
          sol: steps(`Volume = ${l} × ${b} × ${h} = ${fmt(l * b * h, 2)} m³.`, `Litres = ${fmt(l * b * h, 2)} × 1,000 = <b>${fmt(v, 0)}</b>.`),
          trap: '1 m³ is 1,000 litres (not 100 or 10,000).' };
      } },
    { id: 'me-g06', type: 'mcq', level: 2, sub: 'cylinder', ...T,
      make(rng) {
        const r = 7 * int(rng, 1, 2), h = int(rng, 3, 15), v = 22 * r * r * h / 7;
        const { options, answer } = shuffleOpts(rng, v, [2 * 22 * r * h / 7, v / 3, v * 2], (x) => `${fmt(x, 0)} cm³`);
        return { q: `Taking π = 22/7, what is the volume of a cylinder of radius ${r} cm and height ${h} cm?`, options, answer,
          sol: steps('Volume = πr²h.', `= 22/7 × ${r} × ${r} × ${h} = <b>${fmt(v, 0)} cm³</b>.`),
          trap: 'The curved surface area is 2πrh; the volume has r squared.' };
      } },
    { id: 'me-g07', type: 'mcq', level: 2, sub: 'tiles', ...T,
      make(rng) {
        const s = choose(rng, [20, 25, 50]), l = int(rng, 2, 8) * 2, b = int(rng, 2, 6) * 2, n = (l * 100 / s) * (b * 100 / s);
        const { options, answer } = shuffleOpts(rng, n, [n / 10, n * 10, n + 100], (x) => fmt(x, 0));
        return { q: `How many square tiles of side ${s} cm are needed to cover a floor ${l} m by ${b} m?`, options, answer,
          sol: steps(`Along the length: ${l * 100} ÷ ${s} = ${l * 100 / s} tiles; along the breadth: ${b * 100} ÷ ${s} = ${b * 100 / s} tiles.`, `Total = ${l * 100 / s} × ${b * 100 / s} = <b>${n}</b>.`),
          trap: 'Convert metres to centimetres before dividing by the tile size.' };
      } },
  ],
};
