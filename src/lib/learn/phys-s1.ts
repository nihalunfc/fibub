// "Solve my numbers" sets for six Class 8-12 Learn tools: motion-graphs, energy-track, buoyancy-lab, vertical-circle,
// spring-mass, temperature-scales. Plain TypeScript, no DOM; same shape as phys-a.ts (types and sg are reused from it,
// the card is mountSolver in phys-a-ui.ts). Each problem gets values already converted to the first unit of each field.
import { sg, type Field, type SolverSet, type Unit } from './phys-a';

const U = {
  speed: [['m/s', 1], ['km/h', 1 / 3.6]] as Unit[],
  acc: [['m/s²', 1]] as Unit[],
  time: [['s', 1], ['min', 60], ['h', 3600], ['ms', 0.001]] as Unit[],
  len: [['m', 1], ['cm', 0.01], ['km', 1000]] as Unit[],
  mass: [['kg', 1], ['g', 0.001], ['tonne', 1000]] as Unit[],
  dens: [['kg/m³', 1], ['g/cm³', 1000]] as Unit[],
  vol: [['m³', 1], ['cm³', 1e-6], ['litre', 1e-3]] as Unit[],
  force: [['N', 1], ['kN', 1000]] as Unit[],
  energy: [['J', 1], ['kJ', 1000]] as Unit[],
  k: [['N/m', 1], ['N/cm', 100]] as Unit[],
  x: [['m', 1], ['cm', 0.01], ['mm', 0.001]] as Unit[],
};
const gField: Field = { k: 'g', label: 'g (gravity)', def: '9.8', units: [['m/s²', 1]], gt: 0 };
const sgn = (x: number) => (x < 0 ? `(${sg(x)})` : sg(x));

// ---------------------------------------------------------------------------------------------------------
// Motion graphs
export const MOTION: SolverSet = {
  probs: [
    { id: 'slopeX', label: 'Velocity from a distance-time graph (slope)', fields: [
      { k: 'dx', label: 'Change in position Δx', def: '120', units: U.len }, { k: 'dt', label: 'Time taken Δt', def: '8', units: U.time, gt: 0 }],
      tip: 'Slope = rise ÷ run, with the units. Read Δx and Δt from the graph axes, and convert cm or minutes first.',
      solve: ({ dx, dt }) => ({ ans: `The velocity is ${sg(dx / dt)} m/s (${sg((dx / dt) * 3.6)} km/h).`, work: ['v = slope of the x-t graph = Δx ÷ Δt', `v = ${sgn(dx)} m ÷ ${sg(dt)} s`, `v = ${sg(dx / dt)} m/s`, dx < 0 ? 'A negative slope means moving back towards the start.' : 'A steeper line means a faster object; a flat line means at rest.'] }) },
    { id: 'slopeV', label: 'Acceleration from a velocity-time graph (slope)', fields: [
      { k: 'u', label: 'Starting velocity u', def: '4', units: U.speed }, { k: 'v', label: 'Final velocity v', def: '20', units: U.speed }, { k: 't', label: 'Time taken t', def: '8', units: U.time, gt: 0 }],
      tip: 'Acceleration is the change in velocity divided by time, so subtract (final − start), do not add. A negative answer is slowing down (or speeding up backwards).',
      solve: ({ u, v, t }) => { const a = (v - u) / t; return { ans: `The acceleration is ${sg(a)} m/s²${a < 0 ? ' (slowing down: the velocity falls)' : ''}.`, work: ['a = slope of the v-t graph = (v − u) ÷ t', `a = (${sg(v)} − ${sgn(u)}) ÷ ${sg(t)}`, `a = ${sg(a)} m/s²`] }; } },
    { id: 'areaV', label: 'Distance from a velocity-time graph (area)', fields: [
      { k: 'u', label: 'Starting velocity u', def: '0', units: U.speed }, { k: 'v', label: 'Final velocity v', def: '12', units: U.speed }, { k: 't', label: 'Time t', def: '10', units: U.time, gt: 0 }],
      tip: 'Displacement is the area between the line and the time axis; area below the axis counts as negative. For a straight line the area is a trapezium: ½ (u + v) t.',
      solve: ({ u, v, t }) => {
        const s = 0.5 * (u + v) * t, w = ['Area under the v-t line (a trapezium) = ½ (u + v) t', `s = ½ × (${sgn(u)} + ${sgn(v)}) × ${sg(t)} = ${sg(s)} m`];
        if (u * v < 0) {
          const t1 = (t * u) / (u - v), d = Math.abs(0.5 * u * t1) + Math.abs(0.5 * v * (t - t1));
          return { ans: `The displacement is ${sg(s)} m, but the distance travelled is ${sg(d)} m (the velocity changes sign).`, work: [...w, `The line crosses zero at t = ${sg(t1)} s, so there are two triangles, one above and one below the axis.`, `Distance = add both areas as positive = ${sg(d)} m`] };
        }
        return { ans: `The distance (displacement) is ${sg(s)} m.`, work: w };
      } },
    { id: 'v', label: 'Final velocity: v = u + a t', fields: [
      { k: 'u', label: 'Starting velocity u', def: '5', units: U.speed }, { k: 'a', label: 'Acceleration a', def: '2', units: U.acc }, { k: 't', label: 'Time t', def: '6', units: U.time, min: 0 }],
      tip: 'Choose a positive direction first. If the object slows down, a is negative.',
      solve: ({ u, a, t }) => ({ ans: `The final velocity is ${sg(u + a * t)} m/s.`, work: ['v = u + a t', `v = ${sgn(u)} + ${sgn(a)} × ${sg(t)}`, `v = ${sg(u + a * t)} m/s`] }) },
    { id: 's', label: 'Distance in a time: s = u t + ½ a t²', fields: [
      { k: 'u', label: 'Starting velocity u', def: '5', units: U.speed }, { k: 'a', label: 'Acceleration a', def: '2', units: U.acc }, { k: 't', label: 'Time t', def: '6', units: U.time, min: 0 }],
      tip: 'Square only the time (t²), not a or the ½. Do u t first, then ½ a t².',
      solve: ({ u, a, t }) => { const s = u * t + 0.5 * a * t * t; return { ans: `The displacement is ${sg(s)} m.`, work: ['s = u t + ½ a t²', `s = ${sgn(u)} × ${sg(t)} + ½ × ${sgn(a)} × ${sg(t)}²`, `s = ${sg(u * t)} + ${sg(0.5 * a * t * t)} = ${sg(s)} m`] }; } },
    { id: 'v2', label: 'Distance from speeds: v² = u² + 2 a s', fields: [
      { k: 'u', label: 'Starting speed u', def: '20', units: U.speed }, { k: 'v', label: 'Final speed v', def: '0', units: U.speed }, { k: 'a', label: 'Acceleration a', def: '-4', units: U.acc }],
      tip: 'A braking car has a negative a. Convert km/h to m/s (divide by 3.6) before squaring.',
      solve: ({ u, v, a }) => {
        if (Math.abs(a) < 1e-12) return { err: 'With a = 0 the speed never changes, so v² = u² gives no distance. Use s = v t instead.' };
        const s = (v * v - u * u) / (2 * a);
        if (s < 0) return { err: 'These numbers give a negative distance: a speed cannot reach that value with that acceleration. Check the sign of a.' };
        return { ans: `The distance is ${sg(s)} m.`, work: ['v² = u² + 2 a s, so s = (v² − u²) ÷ (2a)', `s = (${sg(v * v)} − ${sg(u * u)}) ÷ (2 × ${sgn(a)})`, `s = ${sg(s)} m`] };
      } },
    { id: 'avg', label: 'Average speed over two parts of a journey', fields: [
      { k: 'd1', label: 'Distance, part 1', def: '60000', units: [['m', 1], ['km', 1000]], gt: 0 }, { k: 't1', label: 'Time, part 1', def: '3600', units: [['s', 1], ['min', 60], ['h', 3600]], gt: 0 },
      { k: 'd2', label: 'Distance, part 2', def: '60000', units: [['m', 1], ['km', 1000]], gt: 0 }, { k: 't2', label: 'Time, part 2', def: '7200', units: [['s', 1], ['min', 60], ['h', 3600]], gt: 0 }],
      tip: 'Do not average the two speeds. Average speed = total distance ÷ total time.',
      solve: ({ d1, t1, d2, t2 }) => { const v = (d1 + d2) / (t1 + t2); return { ans: `The average speed is ${sg(v * 3.6)} km/h (${sg(v)} m/s).`, work: ['Average speed = total distance ÷ total time', `= (${sg(d1)} + ${sg(d2)}) m ÷ (${sg(t1)} + ${sg(t2)}) s`, `= ${sg(v)} m/s = ${sg(v * 3.6)} km/h`] }; } },
  ],
  presets: [
    { label: 'Braking car', prob: 'v2', v: { u: '72', v: '0', a: '-4' }, u: { u: 'km/h' } },
    { label: 'Slope of a line', prob: 'slopeV', v: { u: '4', v: '20', t: '8' } },
    { label: 'Area, turning back', prob: 'areaV', v: { u: '6', v: '-4', t: '10' } },
    { label: 'Two-leg trip', prob: 'avg', v: { d1: '60', t1: '1', d2: '60', t2: '2' }, u: { d1: 'km', t1: 'h', d2: 'km', t2: 'h' } },
    { label: 'Dropped stone, 3 s', prob: 's', v: { u: '0', a: '9.8', t: '3' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Energy
export const ENERGY: SolverSet = {
  probs: [
    { id: 'ke', label: 'Kinetic energy: KE = ½ m v²', fields: [{ k: 'm', label: 'Mass m', def: '2', units: U.mass, gt: 0 }, { k: 'v', label: 'Speed v', def: '6', units: U.speed }],
      tip: 'Square only the speed, then multiply by ½ m. Convert km/h to m/s first: doubling the speed makes KE four times bigger.',
      solve: ({ m, v }) => ({ ans: `The kinetic energy is ${sg(0.5 * m * v * v)} J.`, work: ['KE = ½ m v²', `KE = ½ × ${sg(m)} × ${sgn(v)}²`, `KE = ${sg(0.5 * m * v * v)} J`] }) },
    { id: 'pe', label: 'Potential energy: PE = m g h', fields: [{ k: 'm', label: 'Mass m', def: '2', units: U.mass, gt: 0 }, { k: 'h', label: 'Height h', def: '5', units: U.len }, gField],
      tip: 'Height is measured from the level you chose as zero. The mass must be in kg.',
      solve: ({ m, h, g }) => ({ ans: `The potential energy is ${sg(m * g * h)} J.`, work: ['PE = m g h', `PE = ${sg(m)} × ${sg(g)} × ${sgn(h)}`, `PE = ${sg(m * g * h)} J`] }) },
    { id: 'vdrop', label: 'Speed after rolling down (no friction)', fields: [{ k: 'h0', label: 'Start height', def: '5', units: U.len, min: 0 }, { k: 'h1', label: 'Height of the point', def: '0', units: U.len, min: 0 }, gField],
      tip: 'The mass cancels, so the speed does not depend on it. Use the drop in height (start − point), not the start height.',
      solve: ({ h0, h1, g }) => {
        if (h1 > h0) return { err: 'The point is higher than the start, so a ball released from rest never gets there.' };
        const v = Math.sqrt(2 * g * (h0 - h1));
        return { ans: `The speed there is ${sg(v)} m/s (${sg(v * 3.6)} km/h).`, work: ['Energy lost as PE = energy gained as KE: m g (h₀ − h) = ½ m v²', `v = √(2 g (h₀ − h)) = √(2 × ${sg(g)} × ${sg(h0 - h1)})`, `v = ${sg(v)} m/s`] };
      } },
    { id: 'heat', label: 'Speed at the bottom when some energy becomes heat', fields: [{ k: 'm', label: 'Mass m', def: '2', units: U.mass, gt: 0 }, { k: 'h', label: 'Height dropped', def: '5', units: U.len, gt: 0 }, { k: 'Q', label: 'Energy lost as heat', def: '30', units: U.energy, min: 0 }, gField],
      tip: 'Total energy is still conserved: the heat is taken out of the PE before it becomes KE.',
      solve: ({ m, h, Q, g }) => {
        const pe = m * g * h, ke = pe - Q;
        if (ke <= 0) return { ans: `It stops before the bottom: the heat lost (${sg(Q)} J) is at least the energy available (${sg(pe)} J).`, work: [`PE available = m g h = ${sg(m)} × ${sg(g)} × ${sg(h)} = ${sg(pe)} J`, 'Nothing is left over for motion.'] };
        const v = Math.sqrt((2 * ke) / m);
        return { ans: `The speed at the bottom is ${sg(v)} m/s (${sg(ke)} J of KE).`, work: [`PE available = m g h = ${sg(m)} × ${sg(g)} × ${sg(h)} = ${sg(pe)} J`, `KE = PE − heat = ${sg(pe)} − ${sg(Q)} = ${sg(ke)} J`, `v = √(2 KE ÷ m) = √(2 × ${sg(ke)} ÷ ${sg(m)}) = ${sg(v)} m/s`] };
      } },
    { id: 'fric', label: 'Speed at the bottom of a rough slope', fields: [{ k: 'm', label: 'Mass m', def: '2', units: U.mass, gt: 0 }, { k: 'h', label: 'Height dropped', def: '5', units: U.len, gt: 0 }, { k: 'F', label: 'Friction force F', def: '4', units: U.force, min: 0 }, { k: 'd', label: 'Distance along the track', def: '10', units: U.len, gt: 0 }, gField],
      tip: 'Heat made = friction force × distance along the track (not the height).',
      solve: ({ m, h, F, d, g }) => {
        const pe = m * g * h, Q = F * d, ke = pe - Q;
        if (ke <= 0) return { ans: `It stops before the bottom: friction takes ${sg(Q)} J and only ${sg(pe)} J is available.`, work: [`PE = ${sg(pe)} J, heat = F d = ${sg(F)} × ${sg(d)} = ${sg(Q)} J`] };
        const v = Math.sqrt((2 * ke) / m);
        return { ans: `The speed at the bottom is ${sg(v)} m/s; ${sg(Q)} J became heat.`, work: [`Heat = F d = ${sg(F)} × ${sg(d)} = ${sg(Q)} J`, `PE = m g h = ${sg(m)} × ${sg(g)} × ${sg(h)} = ${sg(pe)} J`, `KE = PE − heat = ${sg(ke)} J, so v = √(2 × ${sg(ke)} ÷ ${sg(m)}) = ${sg(v)} m/s`] };
      } },
    { id: 'loop', label: 'Loop-the-loop: lowest start height', fields: [{ k: 'r', label: 'Loop radius r', def: '2', units: U.len, gt: 0 }, gField],
      tip: 'The top of the loop is 2r above the bottom. The ball needs v² ≥ g r there, so the start height is 2.5 r, not 2 r.',
      solve: ({ r, g }) => ({ ans: `Start at least ${sg(2.5 * r)} m above the bottom of the loop (2.5 r). Speed at the bottom: ${sg(Math.sqrt(5 * g * r))} m/s.`, work: ['At the top, gravity alone gives the circle: m g = m v² ÷ r, so v² = g r (least)', 'Energy: m g h = m g (2r) + ½ m v² = m g (2r) + ½ m g r', `h = 2.5 r = 2.5 × ${sg(r)} = ${sg(2.5 * r)} m`, `Speed at the top = √(g r) = ${sg(Math.sqrt(g * r))} m/s; at the bottom = √(5 g r) = ${sg(Math.sqrt(5 * g * r))} m/s`] }) },
  ],
  presets: [
    { label: 'Ball down 5 m', prob: 'vdrop', v: { h0: '5', h1: '0' } },
    { label: 'Cyclist 36 km/h', prob: 'ke', v: { m: '70', v: '36' }, u: { v: 'km/h' } },
    { label: 'Rough slope', prob: 'fric', v: { m: '2', h: '5', F: '4', d: '10' } },
    { label: 'Loop of 2 m', prob: 'loop', v: { r: '2' } },
    { label: 'Book on a shelf', prob: 'pe', v: { m: '500', h: '1.5' }, u: { m: 'g' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Buoyancy
export const BUOY: SolverSet = {
  probs: [
    { id: 'up', label: 'Upthrust on a fully sunk object', fields: [{ k: 'rho', label: 'Liquid density', def: '1000', units: U.dens, gt: 0 }, { k: 'V', label: 'Volume of the object', def: '0.0005', units: [['m³', 1], ['cm³', 1e-6], ['litre', 1e-3]], gt: 0 }, gField],
      tip: 'Use the density of the liquid, not of the object, and the volume that is under the liquid. 1 g/cm³ = 1000 kg/m³ and 1000 cm³ = 1 litre.',
      solve: ({ rho, V, g }) => ({ ans: `The upthrust is ${sg(rho * V * g)} N.`, work: ['Upthrust = weight of liquid displaced = ρ V g', `= ${sg(rho)} kg/m³ × ${sg(V)} m³ × ${sg(g)} m/s²`, `= ${sg(rho * V * g)} N`] }) },
    { id: 'app', label: 'Apparent weight in a liquid', fields: [{ k: 'm', label: 'Mass of the object', def: '2', units: U.mass, gt: 0 }, { k: 'V', label: 'Volume of the object', def: '0.0005', units: [['m³', 1], ['cm³', 1e-6], ['litre', 1e-3]], gt: 0 }, { k: 'rho', label: 'Liquid density', def: '1000', units: U.dens, gt: 0 }, gField],
      tip: 'Apparent weight = weight − upthrust. The spring balance shows this, not the real weight.',
      solve: ({ m, V, rho, g }) => {
        const W = m * g, Up = rho * V * g, w = [`Weight W = m g = ${sg(m)} × ${sg(g)} = ${sg(W)} N`, `Upthrust U = ρ V g = ${sg(rho)} × ${sg(V)} × ${sg(g)} = ${sg(Up)} N`];
        if (Up >= W - 1e-12) return { ans: `It floats: the full upthrust (${sg(Up)} N) is at least its weight (${sg(W)} N), so nothing hangs on the balance.`, work: [...w, 'When it floats, the upthrust equals the weight, so the apparent weight is 0.'] };
        return { ans: `The apparent weight is ${sg(W - Up)} N (real weight ${sg(W)} N).`, work: [...w, `Apparent weight = W − U = ${sg(W)} − ${sg(Up)} = ${sg(W - Up)} N`] };
      } },
    { id: 'float', label: 'Will it float? How much is under?', fields: [{ k: 'rb', label: 'Object density', def: '500', units: U.dens, gt: 0 }, { k: 'rl', label: 'Liquid density', def: '1000', units: U.dens, gt: 0 }],
      tip: 'Floats when the object is less dense than the liquid. The fraction under the surface is ρ(object) ÷ ρ(liquid).',
      solve: ({ rb, rl }) => {
        if (Math.abs(rb - rl) < 1e-9 * rl) return { ans: 'Equal densities: it hangs anywhere under the surface (neutral buoyancy).', work: ['ρ object = ρ liquid, so upthrust = weight at every depth.'] };
        if (rb > rl) return { ans: `It sinks: ${sg(rb)} kg/m³ is more than ${sg(rl)} kg/m³.`, work: ['Compare the densities: object > liquid, so the weight is more than the greatest upthrust.', `Relative density = ${sg(rb / rl)} (above 1 sinks).`] };
        return { ans: `It floats with ${sg((rb / rl) * 100)} % of its volume under the liquid and ${sg((1 - rb / rl) * 100)} % above.`, work: ['Floating: upthrust = weight, so ρ(liquid) × V(under) × g = ρ(object) × V × g', `V(under) ÷ V = ρ(object) ÷ ρ(liquid) = ${sg(rb)} ÷ ${sg(rl)} = ${sg(rb / rl)}`, `= ${sg((rb / rl) * 100)} % under`] };
      } },
    { id: 'rd', label: 'Relative density from two spring-balance readings', fields: [{ k: 'Wa', label: 'Weight in air', def: '2.7', units: [['N', 1], ['gf', 0.0098]], gt: 0 }, { k: 'Wl', label: 'Apparent weight in water', def: '1.7', units: [['N', 1], ['gf', 0.0098]], min: 0 }],
      tip: 'Relative density = weight in air ÷ loss of weight in water. Both readings must use the same unit.',
      solve: ({ Wa, Wl }) => {
        if (Wl >= Wa) return { err: 'The weight in water must be less than the weight in air.' };
        const rd = Wa / (Wa - Wl);
        return { ans: `The relative density is ${sg(rd)} (density ${sg(rd * 1000)} kg/m³ if the liquid is water).`, work: ['Loss of weight in water = upthrust = ' + `${sg(Wa)} − ${sg(Wl)} = ${sg(Wa - Wl)} N`, 'Relative density = weight in air ÷ loss of weight', `= ${sg(Wa)} ÷ ${sg(Wa - Wl)} = ${sg(rd)}`] };
      } },
    { id: 'disp', label: 'How much liquid does a floating object displace?', fields: [{ k: 'm', label: 'Mass of the object (with load)', def: '5000', units: U.mass, gt: 0 }, { k: 'rho', label: 'Liquid density', def: '1025', units: U.dens, gt: 0 }],
      tip: 'A floating object displaces its own weight of liquid (mass, not volume, is what matches).',
      solve: ({ m, rho }) => ({ ans: `It displaces ${sg(m / rho)} m³ of liquid.`, work: ['Floating: mass of liquid displaced = mass of the object', `V = m ÷ ρ = ${sg(m)} kg ÷ ${sg(rho)} kg/m³`, `V = ${sg(m / rho)} m³ (${sg((m / rho) * 1000)} litres)`] }) },
    { id: 'load', label: 'Extra load before a floating block sinks', fields: [{ k: 'rb', label: 'Block density', def: '500', units: U.dens, gt: 0 }, { k: 'rl', label: 'Liquid density', def: '1000', units: U.dens, gt: 0 }, { k: 'V', label: 'Block volume', def: '0.001', units: [['m³', 1], ['cm³', 1e-6], ['litre', 1e-3]], gt: 0 }],
      tip: 'The block just sinks when it is fully under, so use the full upthrust and subtract the block\'s own mass.',
      solve: ({ rb, rl, V }) => {
        if (rb >= rl) return { err: 'This block is not less dense than the liquid, so it does not float at all.' };
        const m = (rl - rb) * V;
        return { ans: `It can carry ${sg(m * 1000)} g (${sg(m)} kg) before it sinks.`, work: ['Fully under: upthrust = ρ(liquid) V g; weight = (m(block) + load) g', 'load = (ρ(liquid) − ρ(block)) × V', `= (${sg(rl)} − ${sg(rb)}) × ${sg(V)} = ${sg(m)} kg`] };
      } },
  ],
  presets: [
    { label: 'Pine block in water', prob: 'float', v: { rb: '500', rl: '1000' } },
    { label: 'Iron in water', prob: 'float', v: { rb: '7.9', rl: '1' }, u: { rb: 'g/cm³', rl: 'g/cm³' } },
    { label: 'Balance readings', prob: 'rd', v: { Wa: '2.7', Wl: '1.7' } },
    { label: 'Ship in the sea', prob: 'disp', v: { m: '5000', rho: '1025' }, u: { m: 'tonne' } },
    { label: 'Sunk 500 cm³ cube', prob: 'up', v: { rho: '1000', V: '500' }, u: { V: 'cm³' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Vertical circle
const rF: Field = { k: 'r', label: 'Radius r (string length)', def: '0.8', units: U.len, gt: 0 };
export const VCIRC: SolverSet = {
  probs: [
    { id: 'ac', label: 'Centripetal acceleration and force', fields: [{ k: 'm', label: 'Mass m', def: '0.5', units: U.mass, gt: 0 }, { k: 'v', label: 'Speed v', def: '4', units: U.speed }, rF],
      tip: 'Centripetal force is not an extra force: it is whatever points to the centre (tension, gravity, friction). Use the radius in metres.',
      solve: ({ m, v, r }) => { const a = (v * v) / r; return { ans: `The acceleration is ${sg(a)} m/s² towards the centre, so the force needed is ${sg(m * a)} N.`, work: ['a = v² ÷ r', `a = ${sg(v)}² ÷ ${sg(r)} = ${sg(a)} m/s²`, `F = m a = ${sg(m)} × ${sg(a)} = ${sg(m * a)} N`] }; } },
    { id: 'rpm', label: 'Speed and acceleration from revolutions per minute', fields: [{ k: 'n', label: 'Turning rate', def: '60', units: [['rev/min', 1], ['rev/s', 60], ['rad/s', 60 / (2 * Math.PI)]], gt: 0 }, rF],
      tip: 'Turn rev/min into rad/s with ω = 2π n ÷ 60, then v = ω r and a = ω² r.',
      solve: ({ n, r }) => { const w = (2 * Math.PI * n) / 60, v = w * r; return { ans: `The speed is ${sg(v)} m/s and the acceleration ${sg(w * w * r)} m/s² towards the centre.`, work: [`ω = 2π n ÷ 60 = 2π × ${sg(n)} ÷ 60 = ${sg(w)} rad/s`, `v = ω r = ${sg(w)} × ${sg(r)} = ${sg(v)} m/s`, `a = ω² r = ${sg(w * w)} × ${sg(r)} = ${sg(w * w * r)} m/s²`] }; } },
    { id: 'min', label: 'Least speeds to loop the loop', fields: [rF, gField],
      tip: 'At the top the least speed is √(g r): there gravity alone supplies the centripetal force. From the energy, the bottom needs √(5 g r).',
      solve: ({ r, g }) => ({ ans: `At the top at least ${sg(Math.sqrt(g * r))} m/s; at the bottom at least ${sg(Math.sqrt(5 * g * r))} m/s.`, work: ['Top: m g = m v² ÷ r, so v = √(g r)', `v(top) = √(${sg(g)} × ${sg(r)}) = ${sg(Math.sqrt(g * r))} m/s`, `Energy: u² = v² + 4 g r = 5 g r, so u = √(5 g r) = ${sg(Math.sqrt(5 * g * r))} m/s at the bottom`] }) },
    { id: 'top', label: 'Tension at the top', fields: [{ k: 'm', label: 'Mass m', def: '0.5', units: U.mass, gt: 0 }, { k: 'v', label: 'Speed at the top', def: '4', units: U.speed, min: 0 }, rF, gField],
      tip: 'At the top both tension and weight point down to the centre: T + m g = m v² ÷ r, so T = m v² ÷ r − m g. Negative means the string would go slack.',
      solve: ({ m, v, r, g }) => {
        const T = (m * v * v) / r - m * g, w = [`T + m g = m v² ÷ r`, `T = ${sg(m)} × ${sg(v)}² ÷ ${sg(r)} − ${sg(m)} × ${sg(g)} = ${sg((m * v * v) / r)} − ${sg(m * g)} = ${sg(T)} N`];
        if (T < 0) return { ans: `The string goes slack: ${sg(v)} m/s is below the least speed ${sg(Math.sqrt(g * r))} m/s at the top.`, work: w };
        return { ans: `The tension at the top is ${sg(T)} N.`, work: w };
      } },
    { id: 'bot', label: 'Tension at the bottom', fields: [{ k: 'm', label: 'Mass m', def: '0.5', units: U.mass, gt: 0 }, { k: 'v', label: 'Speed at the bottom', def: '6', units: U.speed, min: 0 }, rF, gField],
      tip: 'At the bottom the tension points up, weight points down: T − m g = m v² ÷ r, so T = m v² ÷ r + m g.',
      solve: ({ m, v, r, g }) => { const T = (m * v * v) / r + m * g; return { ans: `The tension at the bottom is ${sg(T)} N.`, work: ['T − m g = m v² ÷ r', `T = ${sg(m)} × ${sg(v)}² ÷ ${sg(r)} + ${sg(m)} × ${sg(g)} = ${sg(T)} N`] }; } },
    { id: 'u2v', label: 'Speed at the top from the speed at the bottom', fields: [{ k: 'u', label: 'Speed at the bottom', def: '6', units: U.speed, min: 0 }, rF, gField],
      tip: 'The ball rises 2r, so v² = u² − 4 g r. If that is below g r, the string goes slack before the top.',
      solve: ({ u, r, g }) => {
        const v2 = u * u - 4 * g * r, w = ['Energy: ½ m u² = ½ m v² + m g (2r)', `v² = u² − 4 g r = ${sg(u * u)} − ${sg(4 * g * r)} = ${sg(v2)}`];
        if (v2 <= 0) return { ans: `It does not reach the top: it needs at least ${sg(Math.sqrt(5 * g * r))} m/s at the bottom (this is ${sg(u)} m/s).`, work: w };
        if (v2 < g * r) return { ans: `The string goes slack before the top: v² = ${sg(v2)} is less than g r = ${sg(g * r)}. It needs ${sg(Math.sqrt(5 * g * r))} m/s at the bottom to loop.`, work: w };
        return { ans: `The speed at the top is ${sg(Math.sqrt(v2))} m/s (more than the least ${sg(Math.sqrt(g * r))} m/s, so it loops).`, work: [...w, `v = √${sg(v2)} = ${sg(Math.sqrt(v2))} m/s`] };
      } },
  ],
  presets: [
    { label: 'Stone on a string', prob: 'ac', v: { m: '0.5', v: '4', r: '0.8' } },
    { label: 'Merry-go-round', prob: 'rpm', v: { n: '12', r: '3' } },
    { label: 'Least loop speeds', prob: 'min', v: { r: '0.8' } },
    { label: 'Bucket of water', prob: 'top', v: { m: '2', v: '3', r: '0.9' } },
    { label: 'Too slow at the bottom', prob: 'u2v', v: { u: '5', r: '1' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Springs
const kF = (k = 'k', def = '40'): Field => ({ k, label: k === 'k' ? 'Spring constant k' : `Spring constant ${k}`, def, units: U.k, gt: 0 });
export const SPRING: SolverSet = {
  probs: [
    { id: 'F', label: 'Force from the stretch: F = k x', fields: [kF(), { k: 'x', label: 'Stretch x', def: '0.05', units: U.x, min: 0 }],
      tip: 'x is the change in length from the natural length, not the total length. Convert cm to m if k is in N/m.',
      solve: ({ k, x }) => ({ ans: `The force is ${sg(k * x)} N.`, work: ['F = k x', `F = ${sg(k)} N/m × ${sg(x)} m`, `F = ${sg(k * x)} N`] }) },
    { id: 'k', label: 'Spring constant from a measurement: k = F / x', fields: [{ k: 'F', label: 'Force F', def: '4', units: U.force, gt: 0 }, { k: 'x', label: 'Stretch x', def: '0.08', units: U.x, gt: 0 }],
      tip: 'Use the stretch (new length − natural length). A stiffer spring has a bigger k.',
      solve: ({ F, x }) => ({ ans: `The spring constant is ${sg(F / x)} N/m (${sg(F / x / 100)} N/cm).`, work: ['k = F ÷ x', `k = ${sg(F)} N ÷ ${sg(x)} m`, `k = ${sg(F / x)} N/m`] }) },
    { id: 'hang', label: 'Stretch of a hanging mass: x = m g / k', fields: [{ k: 'm', label: 'Mass m', def: '0.3', units: U.mass, gt: 0 }, kF(), gField],
      tip: 'The weight is m g in newtons (mass in kg). It is the weight that stretches the spring.',
      solve: ({ m, k, g }) => ({ ans: `The spring stretches ${sg((m * g) / k)} m (${sg(((m * g) / k) * 100)} cm).`, work: ['At rest, spring force = weight: k x = m g', `x = m g ÷ k = ${sg(m)} × ${sg(g)} ÷ ${sg(k)}`, `x = ${sg((m * g) / k)} m`] }) },
    { id: 'comb', label: 'Two springs: series and parallel', fields: [kF('k₁', '30'), kF('k₂', '60')].map((f, i) => ({ ...f, k: `k${i + 1}`, label: `Spring constant k${['₁', '₂'][i]}` })),
      tip: 'Series: the springs share the same force, so it is easier to stretch: k is smaller than either. Parallel: they share the stretch, so k adds.',
      solve: ({ k1, k2 }) => { const s = (k1 * k2) / (k1 + k2), p = k1 + k2; return { ans: `Series ${sg(s)} N/m, parallel ${sg(p)} N/m.`, work: ['Series: 1/k = 1/k₁ + 1/k₂, so k = k₁ k₂ ÷ (k₁ + k₂)', `k = ${sg(k1)} × ${sg(k2)} ÷ ${sg(k1 + k2)} = ${sg(s)} N/m`, `Parallel: k = k₁ + k₂ = ${sg(k1)} + ${sg(k2)} = ${sg(p)} N/m`] }; } },
    { id: 'T', label: 'Period and frequency of a mass on a spring', fields: [{ k: 'm', label: 'Mass m', def: '0.5', units: U.mass, gt: 0 }, kF(), { k: 'mode', label: 'Spring', def: '0', sel: ['One spring k', 'Two in series', 'Two in parallel'] }, kF('k₂', '40')].map((f) => (f.k === 'k₂' ? { ...f, k: 'k2', hint: 'Only used for two springs' } : f)),
      tip: 'T = 2π √(m ÷ k). A bigger mass or a softer spring gives a longer period. T does not depend on the amplitude or on g.',
      solve: ({ m, k, mode, k2 }) => {
        const ke = mode === 0 ? k : mode === 1 ? (k * k2) / (k + k2) : k + k2, T = 2 * Math.PI * Math.sqrt(m / ke);
        return { ans: `The period is ${sg(T)} s (frequency ${sg(1 / T)} Hz).`, work: [mode === 0 ? `k = ${sg(k)} N/m` : mode === 1 ? `Series: k = k₁ k₂ ÷ (k₁ + k₂) = ${sg(ke)} N/m` : `Parallel: k = k₁ + k₂ = ${sg(ke)} N/m`, 'T = 2π √(m ÷ k)', `T = 2π √(${sg(m)} ÷ ${sg(ke)}) = ${sg(T)} s`, `f = 1 ÷ T = ${sg(1 / T)} Hz`] };
      } },
    { id: 'kT', label: 'Spring constant from the measured period', fields: [{ k: 'm', label: 'Mass m', def: '0.25', units: U.mass, gt: 0 }, { k: 'T', label: 'Period T', def: '0.7', units: U.time, gt: 0 }],
      tip: 'Time one swing, not the whole run: divide the time for 20 swings by 20 to get T. Then k = 4π² m ÷ T².',
      solve: ({ m, T }) => { const k = (4 * Math.PI * Math.PI * m) / (T * T); return { ans: `The spring constant is ${sg(k)} N/m.`, work: ['T = 2π √(m ÷ k), so k = 4π² m ÷ T²', `k = 4π² × ${sg(m)} ÷ ${sg(T)}²`, `k = ${sg(k)} N/m`] }; } },
    { id: 'E', label: 'Energy stored in a spring: ½ k x²', fields: [kF(), { k: 'x', label: 'Stretch or amplitude x', def: '0.1', units: U.x, min: 0 }],
      tip: 'Square the stretch before you multiply by ½ k. For a bobbing mass the total energy is ½ k A² with A the amplitude.',
      solve: ({ k, x }) => ({ ans: `The energy stored is ${sg(0.5 * k * x * x)} J.`, work: ['E = ½ k x²', `E = ½ × ${sg(k)} × ${sg(x)}²`, `E = ${sg(0.5 * k * x * x)} J`] }) },
  ],
  presets: [
    { label: 'Stretch 5 cm', prob: 'F', v: { k: '40', x: '5' }, u: { x: 'cm' } },
    { label: 'Hang 300 g', prob: 'hang', v: { m: '300', k: '40' }, u: { m: 'g' } },
    { label: 'Series vs parallel', prob: 'comb', v: { k1: '30', k2: '60' } },
    { label: 'Period of 500 g', prob: 'T', v: { m: '0.5', k: '50', mode: '0' } },
    { label: 'Measured T', prob: 'kT', v: { m: '0.25', T: '0.7' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Temperature scales
const r2 = (x: number) => (Math.abs(x) < 0.005 ? '0' : (x < 0 ? '−' : '') + String(+Math.abs(x).toFixed(2)));
export const SCALES = ['Celsius (°C)', 'Fahrenheit (°F)', 'Kelvin (K)', 'Rankine (°R)'];
const toC = (x: number, s: number) => (s === 0 ? x : s === 1 ? ((x - 32) * 5) / 9 : s === 2 ? x - 273.15 : ((x - 491.67) * 5) / 9);
const ABS = -273.15;
export const TEMP: SolverSet = {
  probs: [
    { id: 'conv', label: 'Convert a temperature (C, F, K, R)', fields: [{ k: 'v', label: 'Temperature', def: '98.6' }, { k: 's', label: 'It is in', def: '1', sel: SCALES }],
      tip: 'Subtract 32 before multiplying by 5/9 when going from °F. Kelvin has no degree sign, and it never goes below 0. Do not use a rounded 273.',
      solve: ({ v, s }) => {
        const C = toC(v, s);
        if (C < ABS - 1e-9) return { err: 'That is below absolute zero (−273.15 °C, 0 K, −459.67 °F), the lowest possible temperature. Check the number or the scale.' };
        const F = (C * 9) / 5 + 32, K = C + 273.15, R = (K * 9) / 5;
        const w = [s === 0 ? `Start in Celsius: ${r2(C)} °C` : s === 1 ? `To Celsius: C = (F − 32) × 5/9 = (${r2(v)} − 32) × 5/9 = ${r2(C)} °C` : s === 2 ? `To Celsius: C = K − 273.15 = ${r2(v)} − 273.15 = ${r2(C)} °C` : `To Celsius: C = (°R − 491.67) × 5/9 = ${r2(C)} °C`];
        if (s !== 1) w.push(`Fahrenheit: F = 9/5 C + 32 = 1.8 × ${r2(C)} + 32 = ${r2(F)} °F`);
        if (s !== 2) w.push(`Kelvin: K = C + 273.15 = ${r2(C)} + 273.15 = ${r2(K)} K`);
        if (s !== 3) w.push(`Rankine: °R = 9/5 K = 1.8 × ${r2(K)} = ${r2(R)} °R`);
        return { ans: `${r2(C)} °C = ${r2(F)} °F = ${r2(K)} K = ${r2(R)} °R.`, work: w };
      } },
    { id: 'diff', label: 'A temperature rise or fall (a difference)', fields: [{ k: 'd', label: 'Change in temperature', def: '25' }, { k: 's', label: 'It is a change in', def: '0', sel: ['°C', '°F', 'K'] }],
      tip: 'A difference needs no 32 and no 273.15: 1 °C change = 1 K change = 1.8 °F change.',
      solve: ({ d, s }) => { const dC = s === 1 ? (d * 5) / 9 : d; return { ans: `A change of ${r2(d)} ${['°C', '°F', 'K'][s]} is ${r2(dC)} °C = ${r2(dC)} K = ${r2(dC * 1.8)} °F.`, work: [s === 1 ? `Δ°C = Δ°F × 5/9 = ${r2(d)} × 5/9 = ${r2(dC)}` : `Δ°C = Δ K = ${r2(dC)} (the degree size is the same)`, `Δ°F = 1.8 × Δ°C = ${r2(dC * 1.8)}`] }; } },
    { id: 'own', label: 'Reading on a scale of your own', fields: [{ k: 'L', label: 'Reading at melting ice', def: '20' }, { k: 'H', label: 'Reading at boiling water', def: '220' }, { k: 'C', label: 'Temperature in °C', def: '25' }],
      tip: 'A scale with two fixed points is a straight line: reading = L + (H − L) × C ÷ 100. The two points must be different.',
      solve: ({ L, H, C }) => {
        if (Math.abs(H - L) < 1e-12) return { err: 'The two fixed points must be different readings, or the scale could not tell warm from cold.' };
        if (C < ABS) return { err: 'That is below absolute zero (−273.15 °C).' };
        const x = L + ((H - L) * C) / 100; return { ans: `${r2(C)} °C reads ${r2(x)} on your scale.`, work: [`One °C is (${r2(H)} − ${r2(L)}) ÷ 100 = ${r2((H - L) / 100)} of your degrees`, `reading = L + (H − L) × C ÷ 100 = ${r2(L)} + ${r2(H - L)} × ${r2(C)} ÷ 100`, `reading = ${r2(x)}`] };
      } },
    { id: 'agree', label: 'Where your scale agrees with Celsius', fields: [{ k: 'L', label: 'Reading at melting ice', def: '20' }, { k: 'H', label: 'Reading at boiling water', def: '220' }],
      tip: 'Set reading = C: L + (H − L) C ÷ 100 = C, then solve for C.',
      solve: ({ L, H }) => {
        const m = (H - L) / 100;
        if (Math.abs(H - L) < 1e-12) return { err: 'The two fixed points must be different readings.' };
        if (Math.abs(m - 1) < 1e-12) return { ans: Math.abs(L) < 1e-12 ? 'The scale is the same as Celsius everywhere.' : 'The scales never agree: your scale is Celsius shifted by a fixed amount.', work: ['The degrees are the same size, so the gap between the scales never changes.'] };
        const C = L / (1 - m); return { ans: `Both read ${r2(C)} at ${r2(C)} °C.`, work: [`L + (H − L) C ÷ 100 = C → ${r2(L)} + ${r2(m)} C = C`, `L = C (1 − ${r2(m)}), so C = ${r2(L)} ÷ ${r2(1 - m)} = ${r2(C)} °C`] };
      } },
    { id: 'gas', label: 'Gas at constant volume: new pressure', fields: [{ k: 'p', label: 'Pressure now', def: '100', units: [['kPa', 1], ['atm', 101.325], ['Pa', 0.001]], gt: 0 }, { k: 't1', label: 'Temperature now (°C)', def: '0' }, { k: 't2', label: 'New temperature (°C)', def: '100' }],
      tip: 'Gas laws need kelvin: p₁ ÷ T₁ = p₂ ÷ T₂ with T = °C + 273.15. Using °C directly gives a wrong answer.',
      solve: ({ p, t1, t2 }) => {
        if (t1 <= ABS || t2 < ABS) return { err: 'A temperature at or below absolute zero (−273.15 °C) is not possible here.' };
        const T1 = t1 + 273.15, T2 = t2 + 273.15, p2 = (p * T2) / T1;
        return { ans: `The new pressure is ${sg(p2)} kPa.`, work: [`T₁ = ${r2(t1)} + 273.15 = ${r2(T1)} K, T₂ = ${r2(t2)} + 273.15 = ${r2(T2)} K`, 'p₁ ÷ T₁ = p₂ ÷ T₂, so p₂ = p₁ × T₂ ÷ T₁', `p₂ = ${sg(p)} × ${r2(T2)} ÷ ${r2(T1)} = ${sg(p2)} kPa`] };
      } },
  ],
  presets: [
    { label: 'Body 98.6 °F', prob: 'conv', v: { v: '98.6', s: '1' } },
    { label: 'Room 25 °C', prob: 'conv', v: { v: '25', s: '0' } },
    { label: 'Liquid nitrogen 77 K', prob: 'conv', v: { v: '77', s: '2' } },
    { label: 'Own scale, 25 °C', prob: 'own', v: { L: '20', H: '220', C: '25' } },
    { label: 'Gas to 100 °C', prob: 'gas', v: { p: '100', t1: '0', t2: '100' } },
  ],
};
