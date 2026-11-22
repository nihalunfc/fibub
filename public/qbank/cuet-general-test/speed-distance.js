// CUET General Test: speed, distance and time; trains; boats and streams. Original questions for fibub. Items are fixed; gens make fresh numbers.
import { pick, int, choose, fmt, rs, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
// Puts the right answer at a position that varies with the id number, so it is not always first.
const mk = (id, level, sub, q, right, wrongs, sol, trap) => {
  const k = parseInt(id.slice(-3), 10) % 4, o = [...wrongs]; o.splice(k, 0, right);
  return mcq(id, level, sub, q, o, k, sol, trap);
};

export default {
  topic: 'speed-distance',
  items: [
    mk('sd-001', 1, 'units', 'Convert 90 km/h into metres per second.', '25 m/s', ['30 m/s', '20 m/s', '32.4 m/s'],
      'Multiply by 5/18: 90 × 5/18 = <b>25 m/s</b>. (1 km/h = 1000 m ÷ 3600 s = 5/18 m/s.)',
      '32.4 comes from multiplying by 18/5, which is the opposite conversion.'),
    mk('sd-002', 1, 'units', 'A cyclist rides at 20 m/s. What is this speed in km/h?', '72 km/h', ['60 km/h', '70 km/h', '80 km/h'],
      'Multiply by 18/5: 20 × 18/5 = <b>72 km/h</b>.'),
    mk('sd-003', 1, 'basics', 'A bus covers 150 km at 50 km/h. How long does the trip take?', '3 hours', ['2 hours', '4 hours', '7500 hours'],
      'Time = distance ÷ speed = 150 ÷ 50 = <b>3 hours</b>.'),
    mk('sd-004', 2, 'trains', 'A 120 m long train runs at 54 km/h. How long does it take to pass a signal pole?', '8 seconds', ['6 seconds', '10 seconds', '12 seconds'],
      '54 km/h = 54 × 5/18 = 15 m/s. To pass a pole the train covers its own length: 120 ÷ 15 = <b>8 s</b>.',
      'Using 54 in the division without converting to m/s gives the wrong units.'),
    mk('sd-005', 2, 'trains', 'A 150 m long train moving at 20 m/s crosses a 250 m long platform. How long does it take?', '20 seconds', ['7.5 seconds', '12.5 seconds', '15 seconds'],
      'The train must cover its own length plus the platform: 150 + 250 = 400 m. Time = 400 ÷ 20 = <b>20 s</b>.',
      '7.5 s uses only the train\'s length (a pole, not a platform).'),
    mk('sd-006', 2, 'average speed', 'A car travels the first half of a journey at 30 km/h and the second half at 60 km/h. What is the average speed for the whole journey?', '40 km/h', ['45 km/h', '42 km/h', '50 km/h'],
      'For equal distances use 2ab ÷ (a + b) = 2 × 30 × 60 ÷ 90 = <b>40 km/h</b>. Check with 60 km: 2 h at 30 + 1 h at 60 = 3 h for 120 km, which is 40.',
      '45 km/h (the simple average) ignores that more time is spent at the slow speed.'),
    mk('sd-007', 3, 'trains', 'Two trains of lengths 100 m and 150 m run towards each other on parallel tracks at 60 km/h and 40 km/h. How long do they take to cross each other?', '9 seconds', ['6 seconds', '12 seconds', '15 seconds'],
      'Moving in opposite directions, speeds add: 60 + 40 = 100 km/h = 100 × 5/18 = 250/9 m/s. Distance = 100 + 150 = 250 m. Time = 250 ÷ (250/9) = <b>9 s</b>.',
      'Subtract speeds only when the trains move in the same direction.'),
    mk('sd-008', 3, 'trains', 'A 100 m train at 72 km/h overtakes an 80 m train running in the same direction at 54 km/h. How long does it take to pass it completely?', '36 seconds', ['18 seconds', '24 seconds', '30 seconds'],
      'Same direction, so relative speed = 72 − 54 = 18 km/h = 5 m/s. Distance = 100 + 80 = 180 m. Time = 180 ÷ 5 = <b>36 s</b>.'),
    mk('sd-009', 2, 'boats', 'A boat goes 10 km/h in still water and the river flows at 2 km/h. How long does it take to travel 36 km downstream?', '3 hours', ['3.6 hours', '4.5 hours', '4 hours'],
      'Downstream speed = 10 + 2 = 12 km/h. Time = 36 ÷ 12 = <b>3 hours</b>.',
      '4.5 hours is the upstream time (36 ÷ 8); downstream is faster.'),
    mk('sd-010', 2, 'boats', 'A boat goes 15 km/h downstream and 9 km/h upstream. What is the speed of the stream?', '3 km/h', ['6 km/h', '12 km/h', '24 km/h'],
      'Stream = (downstream − upstream) ÷ 2 = (15 − 9) ÷ 2 = <b>3 km/h</b>. (Still water = (15 + 9) ÷ 2 = 12 km/h.)',
      '12 km/h is the speed in still water.'),
    mk('sd-011', 3, 'late or early', 'Walking at 4 km/h a student reaches school 15 minutes late. At 5 km/h she reaches on time. How far is the school?', '5 km', ['4 km', '6 km', '7.5 km'],
      'Let the distance be d. d/4 − d/5 = 15/60 = 1/4. So d/20 = 1/4 and d = <b>5 km</b>. Check: 5/4 h = 75 min and 5/5 h = 60 min, a 15 min difference.'),
    mk('sd-012', 2, 'chase', 'A thief runs at 8 m/s and is 100 m ahead of a policeman who runs at 10 m/s in the same direction. How long does the policeman take to catch him?', '50 seconds', ['10 seconds', '100 seconds', '25 seconds'],
      'The policeman gains 10 − 8 = 2 m every second. To close 100 m: 100 ÷ 2 = <b>50 s</b>.',
      'Dividing 100 by 10 forgets that the thief is also running.'),
    mk('sd-013', 1, 'relative', 'Two cyclists start from the same point and ride in opposite directions at 12 km/h and 18 km/h. How far apart are they after 2 hours?', '60 km', ['30 km', '36 km', '48 km'],
      'They separate at 12 + 18 = 30 km/h. In 2 hours: 30 × 2 = <b>60 km</b>.'),
    mk('sd-014', 1, 'basics', 'A car covers 300 km in 5 hours. At the same speed, how long will it take to cover 420 km?', '7 hours', ['6 hours', '8 hours', '9 hours'],
      'Speed = 300 ÷ 5 = 60 km/h. Time = 420 ÷ 60 = <b>7 hours</b>.'),
    mk('sd-015', 1, 'units', 'A scooter moves at 36 km/h. What is its speed in m/s?', '10 m/s', ['36 m/s', '100 m/s', '129.6 m/s'],
      '36 × 5/18 = <b>10 m/s</b>. A handy fact: 36 km/h = 10 m/s.'),
    mk('sd-016', 3, 'trains', 'A 200 m long train running at 54 km/h passes a cyclist riding in the same direction at 18 km/h. How long does it take to pass the cyclist?', '20 seconds', ['10 seconds', '13⅓ seconds', '40 seconds'],
      'Relative speed = 54 − 18 = 36 km/h = 10 m/s. The cyclist is a point, so the distance is the train\'s length, 200 m. Time = 200 ÷ 10 = <b>20 s</b>.',
      '10 s would be the case if the cyclist were coming towards the train.'),
    mk('sd-017', 3, 'average speed', 'A train covers 360 km, the first half at 60 km/h and the second half at 90 km/h. What is its average speed?', '72 km/h', ['75 km/h', '70 km/h', '80 km/h'],
      'Time = 180 ÷ 60 + 180 ÷ 90 = 3 + 2 = 5 h. Average = 360 ÷ 5 = <b>72 km/h</b>.',
      'The simple average (75 km/h) is not right; always use total distance ÷ total time.'),
    mk('sd-018', 3, 'late or early', 'A train running at 3/4 of its usual speed reaches 20 minutes late. What is its usual time for the journey?', '60 minutes', ['45 minutes', '80 minutes', '40 minutes'],
      'Speed ratio usual : new = 4 : 3, so time ratio usual : new = 3 : 4. The extra 1 part = 20 minutes, so the usual 3 parts = 3 × 20 = <b>60 minutes</b>.',
      '80 minutes is the time at the slower speed.'),
    mk('sd-019', 2, 'races', 'In a 100 m race A takes 20 seconds and B takes 25 seconds. By how many metres does A beat B?', '20 m', ['5 m', '25 m', '4 m'],
      'B\'s speed = 100 ÷ 25 = 4 m/s. When A finishes at 20 s, B has covered 4 × 20 = 80 m. A wins by 100 − 80 = <b>20 m</b>.',
      '5 m is the difference in time, not distance.'),
    mk('sd-020', 2, 'races', 'In a 100 m race A beats B by 10 m. What is the ratio of their speeds?', '10 : 9', ['9 : 10', '11 : 10', '10 : 1'],
      'When A has run 100 m, B has run 90 m in the same time, so speeds are in the ratio distance covered: A : B = 100 : 90 = <b>10 : 9</b>.'),
    mk('sd-021', 3, 'round trip', 'Mohan walks to school at 5 km/h and comes back by bus at 20 km/h. The round trip takes 1.5 hours in all. How far is the school?', '6 km', ['7.5 km', '8 km', '4.5 km'],
      'd/5 + d/20 = 1.5, so 4d/20 + d/20 = 5d/20 = d/4 = 1.5 and d = <b>6 km</b>. Check: 1.2 h + 0.3 h = 1.5 h.'),
    mk('sd-022', 3, 'percent', 'If a vehicle\'s speed is increased by 25%, by what percent does the time for the same journey fall?', '20%', ['25%', '16⅔%', '30%'],
      'Speed × 1.25 means time × 1/1.25 = 0.8, a fall of <b>20%</b>. Shortcut: 25 ÷ 125 × 100.',
      'The time falls by less than the speed rises, in percent.'),
    mk('sd-023', 3, 'trains', 'A train running at 36 km/h takes 30 seconds to cross a 200 m long bridge. What is the length of the train?', '100 m', ['200 m', '300 m', '150 m'],
      'Speed = 36 km/h = 10 m/s. Distance in 30 s = 300 m. This equals train + bridge, so the train = 300 − 200 = <b>100 m</b>.',
      '300 m is the combined distance, not the train alone.'),
    mk('sd-024', 2, 'relative', 'Two stations are 300 km apart. A train leaves each station at the same time, towards each other, at 40 km/h and 60 km/h. After how long do they meet?', '3 hours', ['7.5 hours', '5 hours', '6 hours'],
      'They close the gap at 40 + 60 = 100 km/h. Time = 300 ÷ 100 = <b>3 hours</b>. (One train has gone 120 km, the other 180 km.)'),
    mk('sd-025', 3, 'chase', 'A bus leaves a station at 8:00 a.m. at 40 km/h. A car leaves the same station at 9:00 a.m. at 60 km/h on the same road. At what time does the car overtake the bus?', '11:00 a.m.', ['10:00 a.m.', '10:30 a.m.', '12:00 noon'],
      'By 9:00 the bus is 40 km ahead. The car gains 60 − 40 = 20 km each hour, so it needs 40 ÷ 20 = 2 hours after 9:00, i.e. <b>11:00 a.m.</b> Check: bus 3 h × 40 = 120 km, car 2 h × 60 = 120 km.',
      '10:00 a.m. forgets that the car starts an hour late.'),
    mk('sd-026', 1, 'basics', 'A man walks 1.5 km in 20 minutes. What is his speed in km/h?', '4.5 km/h', ['5 km/h', '7.5 km/h', '30 km/h'],
      '20 minutes = 1/3 hour. Speed = 1.5 ÷ (1/3) = 1.5 × 3 = <b>4.5 km/h</b>.',
      'Writing 20 minutes as 0.20 hour is a common mistake; it is 1/3 hour.'),
    mk('sd-027', 2, 'average speed', 'A truck travels at 45 km/h for 2 hours and then at 60 km/h for 3 hours. What is its average speed?', '54 km/h', ['52.5 km/h', '50 km/h', '55 km/h'],
      'Distance = 2 × 45 + 3 × 60 = 90 + 180 = 270 km. Time = 5 h. Average = 270 ÷ 5 = <b>54 km/h</b>.',
      '52.5 km/h is the simple average of 45 and 60, which ignores the unequal times.'),
    mk('sd-028', 2, 'basics', 'A train runs at 40 km/h for 1 hour 45 minutes. How far does it travel?', '70 km', ['60 km', '80 km', '74 km'],
      '1 h 45 min = 1.75 h. Distance = 40 × 1.75 = <b>70 km</b>.',
      '1.45 hours (writing 1 h 45 min as 1.45) gives 58 km, which is wrong.'),
    mk('sd-029', 3, 'boats', 'A rower rows at 5 km/h in still water in a river that flows at 1 km/h. How long does he take to go 12 km upstream and come back 12 km downstream?', '5 hours', ['4.8 hours', '6 hours', '5.5 hours'],
      'Upstream speed 4 km/h: 12 ÷ 4 = 3 h. Downstream speed 6 km/h: 12 ÷ 6 = 2 h. Total = <b>5 hours</b>.',
      '24 ÷ 5 = 4.8 h assumes the river does not help and hinder unequally; the slower leg takes longer.'),
    mk('sd-030', 1, 'relative', 'Two friends are 18 km apart and walk towards each other at 4 km/h and 5 km/h. When do they meet?', '2 hours', ['4 hours', '3 hours', '2.5 hours'],
      'Closing speed = 4 + 5 = 9 km/h. Time = 18 ÷ 9 = <b>2 hours</b>.'),
    mk('sd-031', 1, 'basics', 'A runner keeps up 6 m/s for 5 minutes. How far does she run?', '1,800 m', ['30 m', '300 m', '3,000 m'],
      '5 minutes = 300 seconds. Distance = 6 × 300 = <b>1,800 m</b>.',
      'Time must be in seconds when speed is in m/s.'),
    mk('sd-032', 3, 'trains', 'A train passes a pole in 12 seconds and a 240 m long platform in 24 seconds. What is the length of the train?', '240 m', ['120 m', '200 m', '360 m'],
      'Let the train be L m and its speed v m/s. L = 12v, and L + 240 = 24v. Subtracting: 240 = 12v, so v = 20 m/s and L = 12 × 20 = <b>240 m</b>.',
      'The extra 12 seconds is the time to cover the platform alone (240 m at 20 m/s).'),
  ],
  gens: [
    { id: 'sd-g01', type: 'mcq', level: 1, sub: 'units', ...T,
      make(rng) {
        const k = int(rng, 2, 12), v = 18 * k, ms = 5 * k;
        const { options, answer } = shuffleOpts(rng, ms, [(v * 18) / 5, v / 3.6 + 2, v / 5], (x) => `${fmt(x, 1)} m/s`);
        return { q: `Convert ${v} km/h into metres per second.`, options, answer,
          sol: steps('Multiply km/h by 5/18 to get m/s.', `${v} × 5/18 = <b>${ms} m/s</b>.`),
          trap: 'Multiplying by 18/5 converts the other way round (m/s to km/h).' };
      } },
    { id: 'sd-g02', type: 'mcq', level: 2, sub: 'trains', ...T,
      make(rng) {
        const sp = choose(rng, [36, 54, 72, 90, 108]), ms = sp * 5 / 18, t = int(rng, 5, 15), L = ms * t;
        const { options, answer } = shuffleOpts(rng, t, [L / sp, t + 2, t * 2], (x) => `${fmt(x, 1)} seconds`);
        return { q: `A ${L} m long train runs at ${sp} km/h. How long does it take to pass a signal post?`, options, answer,
          sol: steps(`${sp} km/h = ${sp} × 5/18 = ${ms} m/s.`, `The train covers its own length: ${L} ÷ ${ms} = <b>${t} s</b>.`),
          trap: 'Convert km/h to m/s first, since the length is in metres.' };
      } },
    { id: 'sd-g03', type: 'mcq', level: 2, sub: 'trains', ...T,
      make(rng) {
        const sp = choose(rng, [54, 72, 90, 108]), ms = sp * 5 / 18, t = int(rng, 15, 40), tot = ms * t, L = choose(rng, [100, 120, 150]), P = tot - L;
        const { options, answer } = shuffleOpts(rng, t, [L / ms, P / ms, t + 5], (x) => `${fmt(x, 1)} seconds`);
        return { q: `A ${L} m long train running at ${sp} km/h crosses a platform ${P} m long. How long does it take?`, options, answer,
          sol: steps(`Distance = train + platform = ${L} + ${P} = ${tot} m.`, `Speed = ${ms} m/s, so time = ${tot} ÷ ${ms} = <b>${t} s</b>.`),
          trap: 'For a platform, add the lengths; the train must clear the whole platform.' };
      } },
    { id: 'sd-g04', type: 'mcq', level: 2, sub: 'average speed', ...T,
      make(rng) {
        const [a, b] = choose(rng, [[30, 60], [40, 60], [60, 90], [20, 30], [40, 120], [30, 45], [50, 75], [45, 90]]), v = (2 * a * b) / (a + b);
        const { options, answer } = shuffleOpts(rng, v, [(a + b) / 2, v + 2, v - 2], (x) => `${fmt(x, 1)} km/h`);
        return { q: `A bus covers the first half of a route at ${a} km/h and the second half at ${b} km/h. What is its average speed for the whole route?`, options, answer,
          sol: steps('For equal distances, average speed = 2ab ÷ (a + b).', `= 2 × ${a} × ${b} ÷ ${a + b} = <b>${fmt(v, 1)} km/h</b>.`),
          trap: `The simple average (${(a + b) / 2}) is wrong because more time is spent at the slower speed.` };
      } },
    { id: 'sd-g05', type: 'mcq', level: 1, sub: 'relative', ...T,
      make(rng) {
        const a = int(rng, 30, 70), b = int(rng, 30, 70), t = int(rng, 2, 6), D = (a + b) * t;
        const { options, answer } = shuffleOpts(rng, t, [D / Math.abs(a - b || 1), t + 1, t * 2], (x) => `${fmt(x, 2)} hours`);
        return { q: `Two stations are ${D} km apart. A train leaves each at the same time towards the other, at ${a} km/h and ${b} km/h. After how many hours do they meet?`, options, answer,
          sol: steps(`Closing speed = ${a} + ${b} = ${a + b} km/h.`, `Time = ${D} ÷ ${a + b} = <b>${t} hours</b>.`),
          trap: 'Towards each other: add the speeds. Same direction: subtract.' };
      } },
    { id: 'sd-g06', type: 'mcq', level: 3, sub: 'chase', ...T,
      make(rng) {
        const v1 = choose(rng, [30, 36, 40, 45, 50]), v2 = v1 + choose(rng, [10, 15, 20]), t = int(rng, 2, 5), h = (v2 - v1) * t;
        const { options, answer } = shuffleOpts(rng, t, [h / v2, h / v1, t + 1], (x) => `${fmt(x, 2)} hours`);
        return { q: `A truck is ${h} km ahead on a highway, moving at ${v1} km/h. A car behind it travels the same way at ${v2} km/h. In how many hours will the car catch up?`, options, answer,
          sol: steps(`Same direction, so the gap closes at ${v2} − ${v1} = ${v2 - v1} km/h.`, `Time = ${h} ÷ ${v2 - v1} = <b>${t} hours</b>.`),
          trap: `Using the car's full speed (${h} ÷ ${v2}) forgets that the truck is moving too.` };
      } },
    { id: 'sd-g07', type: 'mcq', level: 2, sub: 'boats', ...T,
      make(rng) {
        const u = int(rng, 6, 15), s = int(rng, 1, Math.min(4, u - 2)), t = int(rng, 2, 6), d = (u + s) * t;
        const { options, answer } = shuffleOpts(rng, t, [d / (u - s), d / u, t + 1], (x) => `${fmt(x, 2)} hours`);
        return { q: `A boat moves at ${u} km/h in still water and the river flows at ${s} km/h. How long does it take to go ${d} km downstream?`, options, answer,
          sol: steps(`Downstream speed = ${u} + ${s} = ${u + s} km/h.`, `Time = ${d} ÷ ${u + s} = <b>${t} hours</b>.`),
          trap: `Upstream would take ${fmt(d / (u - s), 2)} hours; downstream the stream helps.` };
      } },
  ],
};
