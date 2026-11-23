// Class 8 Science (Curiosity), Chapter 5 Exploring Forces: practice questions (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('ef');

export default {
  topic: 'exploring-forces', name: 'Exploring Forces', n: 5,
  items: [
    m.mcq(1, 'basics', '<p>A force is a:</p>', 'push or a pull', ['kind of energy', 'type of speed', 'measure of mass'], '<p>A force is a push or a pull on an object.</p>'),
    m.mcq(1, 'basics', '<p>The SI unit of force is the:</p>', 'newton', ['kilogram', 'joule', 'pascal'], '<p>Force is measured in newtons (N).</p>'),
    m.mcq(2, 'basics', '<p>Which of these is NOT an effect a force can have on an object?</p>', 'change its mass', ['change its speed', 'change its direction', 'change its shape'], '<p>A force can start, stop or change motion and shape, but it does not change the amount of matter (mass).</p>', { trap: 'Mass stays the same; only motion or shape changes.' }),
    m.mcq(1, 'basics', '<p>A spring balance is used to measure:</p>', 'force', ['mass', 'volume', 'time'], '<p>The stretch of the spring shows the force acting.</p>'),
    m.mcq(2, 'contact', '<p>Which of these is a non-contact force?</p>', 'magnetic force', ['muscular force', 'friction', 'a push with the hand'], '<p>A magnet attracts iron without touching it.</p>'),
    m.mcq(2, 'contact', '<p>A comb rubbed on dry hair picks up small paper bits. The force that acts is:</p>', 'electrostatic force', ['muscular force', 'friction', 'magnetic force'], '<p>Rubbing charges the comb, and the charge attracts light paper bits without touching.</p>'),
    m.mcq(1, 'contact', '<p>Pulling a bucket of water up from a well uses:</p>', 'muscular force', ['magnetic force', 'electrostatic force', 'no force'], '<p>Muscles produce the pull.</p>'),
    m.mcq(2, 'contact', '<p>Two magnets repel when:</p>', 'like poles face each other', ['unlike poles face each other', 'they touch', 'they are far apart'], '<p>North with north (or south with south) repel.</p>'),
    m.mcq(2, 'balance', '<p>Two equal forces pull a rope in opposite directions. The net force is:</p>', 'zero', ['double one force', 'the sum of the forces', 'half of one force'], '<p>Equal and opposite forces cancel: balanced.</p>'),
    m.mcq(2, 'balance', '<p>Forces of 40 N and 25 N act on a box in opposite directions. The net force is:</p>', '15 N towards the larger force', ['65 N', '15 N towards the smaller force', '0 N'], '<p>Subtract: 40 − 25 = 15 N in the direction of the larger force.</p>'),
    m.mcq(2, 'balance', '<p>Unbalanced forces on an object can:</p>', 'change its state of motion', ['never change its motion', 'only change its colour', 'only change its mass'], '<p>A net force starts, stops, speeds up, slows down or turns an object.</p>'),
    m.mcq(1, 'friction', '<p>Friction acts:</p>', 'against the motion', ['along the motion', 'at right angles upward', 'only on liquids'], '<p>Friction opposes sliding.</p>'),
    m.mcq(2, 'friction', '<p>Friction between two surfaces is larger when the surfaces are:</p>', 'rougher', ['smoother', 'wetter with oil', 'polished'], '<p>Rough surfaces interlock more.</p>'),
    m.mcq(2, 'friction', '<p>Which is a way to reduce friction?</p>', 'putting oil or using ball bearings', ['adding sand', 'making wheels rough', 'pressing the surfaces harder'], '<p>Lubricants and rolling parts reduce friction.</p>'),
    m.mcq(2, 'friction', '<p>For the same load, which friction is usually the smallest?</p>', 'rolling friction', ['sliding friction', 'static friction', 'they are always equal'], '<p>Rolling is easier than sliding, which is why wheels are used.</p>'),
    m.mcq(2, 'friction', '<p>Friction is useful when we:</p>', 'walk without slipping', ['slide down a slide', 'rub our hands to make them cold', 'move a machine part smoothly'], '<p>Grip between shoe and floor lets us push off.</p>'),
    m.mcq(1, 'weight', '<p>The weight of an object is:</p>', 'the pull of gravity on it', ['the amount of matter in it', 'its volume', 'its density'], '<p>Weight is a force; mass is the amount of matter.</p>'),
    m.mcq(2, 'weight', '<p>An astronaut goes to the Moon. Her mass:</p>', 'stays the same', ['becomes about one sixth', 'doubles', 'becomes zero'], '<p>Mass does not change with place. Her weight becomes about one sixth.</p>', { trap: 'Weight changes with place, mass does not.' }),
    m.mcq(2, 'weight', '<p>A 5 kg object on Earth (g = 10 m/s²) weighs:</p>', '50 N', ['5 N', '0.5 N', '15 N'], '<p>W = m × g = 5 × 10 = 50 N.</p>'),
    m.mcq(2, 'weight', '<p>The weight of a body is greatest at:</p>', 'the surface of Jupiter', ['the surface of the Moon', 'far out in space', 'the surface of Mars'], '<p>Jupiter has the largest g of these (about 25 m/s²).</p>'),
    m.ar(2, 'weight', 'The weight of a person is less on the Moon than on Earth.', 'The Moon\'s gravity is weaker than Earth\'s.', 0, '<p>Both are true, and the weaker pull explains the smaller weight.</p>'),
    m.ar(3, 'friction', 'A rolling football gradually comes to a stop on grass.', 'Friction acts in the direction of the ball\'s motion.', 2, '<p>A is true. R is false: friction acts against the motion, which is why the ball slows.</p>'),
    m.ar(3, 'contact', 'A magnet can attract a nail without touching it.', 'Magnetic force is a contact force.', 2, '<p>A is true. R is false: magnetic force acts at a distance, so it is a non-contact force.</p>'),
    m.nat(2, 'weight', '<p>What is the weight in newtons of a 12 kg bag on Earth? (g = 10 m/s²)</p>', () => 120, 0.01, '<p>W = 12 × 10 = 120 N.</p>'),
    m.nat(2, 'balance', '<p>Forces of 70 N to the left and 45 N to the right act on a cart. What is the net force in newtons?</p>', () => 25, 0.01, '<p>70 − 45 = 25 N to the left.</p>'),
    m.nat(3, 'weight', '<p>A boy of mass 40 kg stands on Mars, where g = 3.7 m/s². What is his weight in newtons?</p>', () => 148, 0.01, '<p>W = 40 × 3.7 = 148 N.</p>'),
    m.msq(3, 'contact', '<p>Which of these are non-contact forces? (Choose all that apply.)</p>', ['Gravity', 'Friction', 'Magnetic force', 'Electrostatic force'], [0, 2, 3], '<p>Gravity, magnetic and electrostatic forces act without touching. Friction needs contact.</p>'),
    m.msq(3, 'friction', '<p>Which of these reduce friction? (Choose all that apply.)</p>', ['Oil on a door hinge', 'Ball bearings in a wheel', 'Making a floor rough', 'Polishing a surface'], [0, 1, 3], '<p>Oil, rolling parts and polishing reduce friction; rough floors increase it.</p>'),
  ],
  gens: [
    { id: 'ef-g01', type: 'nat', level: 2, exams: ['board'], sub: 'weight',
      make(rng) { const mm = pick(rng, 5, 90, 5); return { mm, q: `<p>What is the weight on Earth of a ${mm} kg object? (g = 10 m/s².) Answer in newtons.</p>`, answer: mm * 10, tol: 0.01, sol: `<p>W = m × g = ${mm} × 10 = ${mm * 10} N.</p>` }; },
      verify: (p) => p.mm / 0.1 },
    { id: 'ef-g02', type: 'nat', level: 2, exams: ['board'], sub: 'balance',
      make(rng) { const a = pick(rng, 60, 200, 10), b = pick(rng, 10, 50, 10); return { a, b, q: `<p>Forces of ${a} N and ${b} N act on a box in opposite directions. What is the size of the net force in newtons?</p>`, answer: a - b, tol: 0.01, sol: `<p>${a} − ${b} = ${a - b} N.</p>` }; },
      verify: (p) => Math.abs(p.b - p.a) },
    { id: 'ef-g03', type: 'nat', level: 3, exams: ['board'], sub: 'weight',
      make(rng) { const g = choose(rng, [1.6, 3.7, 9.8, 24.8]), mm = pick(rng, 10, 60, 10); return { g, mm, q: `<p>A rover of mass ${mm} kg is on a world where g = ${g} m/s². What is its weight in newtons?</p>`, answer: +(mm * g).toFixed(4), tol: 0.01, sol: `<p>W = ${mm} × ${g} = ${+(mm * g).toFixed(4)} N.</p>` }; },
      verify: (p) => p.g * p.mm },
  ],
};
