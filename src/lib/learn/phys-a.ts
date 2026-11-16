// "Solve my numbers" for the Class 9-12 mechanics Learn tools (newtons-laws, friction-ramp, free-body-diagram,
// collision-lab, kepler-orbits, gravity-height-depth). Plain TypeScript, no DOM: each problem takes the typed numbers
// already converted to the first (base) unit of each field and returns the answer sentence and the working an exam
// would mark. Drawn UI: src/lib/learn/phys-a-ui.ts. Checked in tests/phys-a.mjs-style scripts and tests/tools/<id>.mjs.

export type Unit = [name: string, factor: number];
export type Field = {
  k: string; label: string; def: string;
  /** Units the student may pick; the first is the base unit the maths uses; others multiply into it. */
  units?: Unit[];
  /** Pick-one field (not a number): [label, value]. The maths gets the index. */
  sel?: string[];
  /** Must be strictly above this (e.g. mass > 0) / at least this / at most this. */
  gt?: number; min?: number; max?: number;
  hint?: string;
};
export type Res = { ans: string; work: string[] } | { err: string };
export type Prob = { id: string; label: string; fields: Field[]; solve: (v: Record<string, number>) => Res; tip: string };
export type Preset = { label: string; prob: string; v: Record<string, string>; u?: Record<string, string> };
export type SolverSet = { probs: Prob[]; presets: Preset[] };

export const G = 9.8; // m/s², the rounded school value

/** Round to n significant figures for reading: 3 → "12.3", big or tiny numbers as "3.99 × 10^14". */
export function sg(x: number, n = 3): string {
  if (!Number.isFinite(x)) return '—';
  if (x === 0 || Math.abs(x) < 1e-12) return '0';
  const a = Math.abs(x), s = x < 0 ? '−' : '';
  if (a >= 1e6 || a < 1e-3) {
    const [m, e] = a.toExponential(n - 1).split('e');
    return `${s}${m} × 10^${Number(e)}`;
  }
  return s + String(+a.toPrecision(n));
}
const U = {
  mass: [['kg', 1], ['g', 0.001], ['tonne', 1000]] as Unit[],
  force: [['N', 1], ['kN', 1000]] as Unit[],
  acc: [['m/s²', 1]] as Unit[],
  speed: [['m/s', 1], ['km/h', 1 / 3.6]] as Unit[],
  time: [['s', 1], ['ms', 0.001], ['min', 60]] as Unit[],
  len: [['m', 1], ['cm', 0.01], ['km', 1000]] as Unit[],
  deg: [['°', 1], ['rad', 180 / Math.PI]] as Unit[],
  dist: [['AU', 1.495978707e11], ['km', 1000], ['m', 1]] as Unit[],
  lenKm: [['km', 1000], ['m', 1]] as Unit[],
  period: [['years', 365.25 * 86400], ['days', 86400], ['hours', 3600], ['minutes', 60], ['s', 1]] as Unit[],
};
const gField: Field = { k: 'g', label: 'g (gravity)', def: '9.8', units: [['m/s²', 1]], gt: 0 };
const sgn = (x: number) => (x < 0 ? `(${sg(x)})` : sg(x));

// ---------------------------------------------------------------------------------------------------------
// Newton's laws
export const NEWTON: SolverSet = {
  probs: [
    { id: 'F', label: 'Force: F = m a', fields: [
      { k: 'm', label: 'Mass m', def: '5', units: U.mass, gt: 0 }, { k: 'a', label: 'Acceleration a', def: '3', units: U.acc }],
      tip: 'Use kg for mass. If the mass is in grams, divide by 1000 first (the unit box does it for you).',
      solve: ({ m, a }) => ({ ans: `The net force is ${sg(m * a)} N.`, work: ['F = m a', `F = ${sg(m)} kg × ${sgn(a)} m/s²`, `F = ${sg(m * a)} N`] }) },
    { id: 'a', label: 'Acceleration: a = F / m', fields: [
      { k: 'F', label: 'Net force F', def: '12', units: U.force }, { k: 'm', label: 'Mass m', def: '4', units: U.mass, gt: 0 }],
      tip: 'F here is the net force: the push minus friction, not the push alone.',
      solve: ({ F, m }) => ({ ans: `The acceleration is ${sg(F / m)} m/s².`, work: ['a = F / m', `a = ${sgn(F)} N ÷ ${sg(m)} kg`, `a = ${sg(F / m)} m/s²`] }) },
    { id: 'm', label: 'Mass: m = F / a', fields: [
      { k: 'F', label: 'Net force F', def: '30', units: U.force }, { k: 'a', label: 'Acceleration a', def: '2.5', units: U.acc, gt: 0 }],
      tip: 'A mass is never negative: if you get a negative number, one of the signs in your problem is the wrong way round.',
      solve: ({ F, a }) => (F <= 0 ? { err: 'The force has to be above 0 N for a positive mass.' } : { ans: `The mass is ${sg(F / a)} kg.`, work: ['m = F / a', `m = ${sg(F)} N ÷ ${sg(a)} m/s²`, `m = ${sg(F / a)} kg`] }) },
    { id: 'net', label: 'Push with friction: will it move, how fast?', fields: [
      { k: 'F', label: 'Push F', def: '30', units: U.force, min: 0 }, { k: 'm', label: 'Mass m', def: '8', units: U.mass, gt: 0 },
      { k: 'mu', label: 'Friction coefficient μ', def: '0.25', min: 0, hint: 'about 0.1 smooth floor, 0.4 carpet' }, gField],
      tip: 'Friction is μ × m × g (the weight), and it acts against the push. Do not forget g.',
      solve: ({ F, m, mu, g }) => {
        const fr = mu * m * g;
        if (F <= fr + 1e-12) return { ans: `It does not move: the push (${sg(F)} N) is not more than the friction that can hold (${sg(fr)} N).`, work: [`Friction limit = μ m g = ${sg(mu)} × ${sg(m)} × ${sg(g)} = ${sg(fr)} N`, `Push ${sg(F)} N ≤ ${sg(fr)} N, so friction just matches the push.`, 'Net force = 0, so a = 0 (first law: balanced forces).'] };
        const a = (F - fr) / m;
        return { ans: `It speeds up at ${sg(a)} m/s².`, work: [`Friction = μ m g = ${sg(mu)} × ${sg(m)} × ${sg(g)} = ${sg(fr)} N`, `Net force = F − friction = ${sg(F)} − ${sg(fr)} = ${sg(F - fr)} N`, `a = net force ÷ m = ${sg(F - fr)} ÷ ${sg(m)} = ${sg(a)} m/s²`] };
      } },
    { id: 'W', label: 'Weight: W = m g', fields: [
      { k: 'm', label: 'Mass m', def: '60', units: U.mass, gt: 0 }, gField],
      tip: 'Mass is in kg and never changes; weight is a force in newtons and changes with g (1.6 on the Moon).',
      solve: ({ m, g }) => ({ ans: `The weight is ${sg(m * g)} N.`, work: ['W = m g', `W = ${sg(m)} kg × ${sg(g)} m/s²`, `W = ${sg(m * g)} N`] }) },
    { id: 'p', label: 'Momentum: p = m v', fields: [
      { k: 'm', label: 'Mass m', def: '1200', units: U.mass, gt: 0 }, { k: 'v', label: 'Speed v', def: '54', units: [['km/h', 1 / 3.6], ['m/s', 1]] }],
      tip: 'Change km/h to m/s by dividing by 3.6 before you multiply.',
      solve: ({ m, v }) => ({ ans: `The momentum is ${sg(m * v)} kg m/s.`, work: ['p = m v', `p = ${sg(m)} kg × ${sgn(v)} m/s`, `p = ${sg(m * v)} kg m/s`] }) },
    { id: 'imp', label: 'Force while slowing or speeding up: F = m(v − u) / t', fields: [
      { k: 'm', label: 'Mass m', def: '0.16', units: U.mass, gt: 0 }, { k: 'u', label: 'Starting speed u', def: '25', units: U.speed },
      { k: 'v', label: 'Final speed v', def: '0', units: U.speed }, { k: 't', label: 'Time taken t', def: '0.1', units: U.time, gt: 0 }],
      tip: 'Take the starting direction as positive. Slowing down gives a negative change, so the force on the object points backwards.',
      solve: ({ m, u, v, t }) => {
        const dp = m * (v - u), F = dp / t;
        return { ans: `The average force is ${sg(Math.abs(F))} N${F < 0 ? ' against the original motion (the force on the object)' : ''}; the force on whatever stops it has the same size the other way.`,
          work: ['Impulse = change in momentum = m (v − u)', `m (v − u) = ${sg(m)} × (${sg(v)} − ${sgn(u)}) = ${sg(dp)} kg m/s`, `F = impulse ÷ t = ${sg(dp)} ÷ ${sg(t)} = ${sg(F)} N`] };
      } },
    { id: 'rec', label: 'Recoil: m₁ v₁ = m₂ v₂ (starting at rest)', fields: [
      { k: 'm1', label: 'Mass thrown out m₁', def: '0.05', units: U.mass, gt: 0 }, { k: 'v1', label: 'Its speed v₁', def: '300', units: U.speed },
      { k: 'm2', label: 'Mass of the rest m₂', def: '4', units: U.mass, gt: 0 }],
      tip: 'The two momenta are equal in size and opposite in direction, so the total stays zero.',
      solve: ({ m1, v1, m2 }) => { const v2 = (m1 * v1) / m2; return { ans: `The recoil speed is ${sg(Math.abs(v2))} m/s, in the opposite direction.`, work: ['Total momentum before = 0, so m₁ v₁ + m₂ v₂ = 0', `v₂ = −m₁ v₁ ÷ m₂ = −(${sg(m1)} × ${sgn(v1)}) ÷ ${sg(m2)}`, `v₂ = ${sg(-v2)} m/s (opposite to the first)`] }; } },
  ],
  presets: [
    { label: 'Trolley, 12 N', prob: 'a', v: { F: '12', m: '4' } },
    { label: 'Car stopping', prob: 'imp', v: { m: '1000', u: '72', v: '0', t: '5' }, u: { u: 'km/h' } },
    { label: 'Cricket catch', prob: 'imp', v: { m: '160', u: '25', v: '0', t: '0.1' }, u: { m: 'g' } },
    { label: 'Box on carpet', prob: 'net', v: { F: '30', m: '8', mu: '0.25' } },
    { label: 'Gun recoil', prob: 'rec', v: { m1: '0.05', v1: '300', m2: '4' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Friction and slopes
const rad = (d: number) => (d * Math.PI) / 180;
const angleF: Field = { k: 'th', label: 'Slope angle θ', def: '30', units: U.deg, min: 0, max: 89 };
export const RAMP: SolverSet = {
  probs: [
    { id: 'flat', label: 'Push on a flat floor: does it move?', fields: [
      { k: 'm', label: 'Mass m', def: '10', units: U.mass, gt: 0 }, { k: 'mus', label: 'Static μs', def: '0.5', min: 0 }, { k: 'muk', label: 'Kinetic μk', def: '0.4', min: 0 },
      { k: 'F', label: 'Push F', def: '60', units: U.force, min: 0 }, gField],
      tip: 'Static friction (to start it) is usually bigger than kinetic friction (once sliding). Use μs to decide, μk to find a.',
      solve: ({ m, mus, muk, F, g }) => {
        const N = m * g, lim = mus * N, kin = muk * N;
        const w = [`N = m g = ${sg(m)} × ${sg(g)} = ${sg(N)} N`, `Most static friction = μs N = ${sg(mus)} × ${sg(N)} = ${sg(lim)} N`];
        if (F <= lim + 1e-12) return { ans: `It stays still: the push (${sg(F)} N) is not more than ${sg(lim)} N. Friction is ${sg(F)} N.`, work: [...w, `${sg(F)} N ≤ ${sg(lim)} N, so friction equals the push and a = 0.`] };
        const a = (F - kin) / m;
        return { ans: `It slides, speeding up at ${sg(a)} m/s².`, work: [...w, `${sg(F)} N > ${sg(lim)} N, so it slides.`, `Sliding friction = μk N = ${sg(muk)} × ${sg(N)} = ${sg(kin)} N`, `a = (F − μk N) ÷ m = (${sg(F)} − ${sg(kin)}) ÷ ${sg(m)} = ${sg(a)} m/s²`] };
      } },
    { id: 'slope', label: 'Block on a slope: components, slide or stay', fields: [
      { k: 'm', label: 'Mass m', def: '5', units: U.mass, gt: 0 }, angleF, { k: 'mus', label: 'Static μs', def: '0.6', min: 0 }, { k: 'muk', label: 'Kinetic μk', def: '0.45', min: 0 }, gField],
      tip: 'On a slope the normal force is mg cos θ (not mg) and the pull down the slope is mg sin θ.',
      solve: ({ m, th, mus, muk, g }) => {
        const N = m * g * Math.cos(rad(th)), along = m * g * Math.sin(rad(th)), lim = mus * N;
        const w = [`Along the slope: m g sin θ = ${sg(m)} × ${sg(g)} × sin ${sg(th)}° = ${sg(along)} N`, `Normal force: N = m g cos θ = ${sg(m)} × ${sg(g)} × cos ${sg(th)}° = ${sg(N)} N`, `Most static friction = μs N = ${sg(mus)} × ${sg(N)} = ${sg(lim)} N`];
        if (along <= lim + 1e-12) return { ans: `It stays still: friction can hold ${sg(lim)} N and gravity pulls ${sg(along)} N down the slope.`, work: [...w, `${sg(along)} N ≤ ${sg(lim)} N (same as tan θ ≤ μs: tan ${sg(th)}° = ${sg(Math.tan(rad(th)))}).`] };
        const a = (along - muk * N) / m;
        return { ans: `It slides down the slope at ${sg(a)} m/s².`, work: [...w, `${sg(along)} N > ${sg(lim)} N, so it slides.`, `a = (m g sin θ − μk N) ÷ m = (${sg(along)} − ${sg(muk * N)}) ÷ ${sg(m)} = ${sg(a)} m/s²`] };
      } },
    { id: 'mu', label: 'Find μ from the angle where it just slips', fields: [{ k: 'th', label: 'Angle where it starts to slip', def: '28', units: U.deg, gt: 0, max: 89 }],
      tip: 'At the point of slipping, tan θ = μs. The mass does not matter.',
      solve: ({ th }) => ({ ans: `μs = ${sg(Math.tan(rad(th)))}.`, work: ['At the point of slipping: m g sin θ = μs m g cos θ', 'so μs = tan θ', `μs = tan ${sg(th)}° = ${sg(Math.tan(rad(th)))}`] }) },
    { id: 'start', label: 'Push needed on a flat floor (start and keep going)', fields: [
      { k: 'm', label: 'Mass m', def: '25', units: U.mass, gt: 0 }, { k: 'mus', label: 'Static μs', def: '0.45', min: 0 }, { k: 'muk', label: 'Kinetic μk', def: '0.3', min: 0 }, gField],
      tip: 'You need more push to get it going (μs) than to keep it going at steady speed (μk).',
      solve: ({ m, mus, muk, g }) => ({ ans: `You must push harder than ${sg(mus * m * g)} N to start it, and ${sg(muk * m * g)} N keeps it moving at a steady speed.`, work: [`Start: F > μs m g = ${sg(mus)} × ${sg(m)} × ${sg(g)} = ${sg(mus * m * g)} N`, `Steady speed: F = μk m g = ${sg(muk)} × ${sg(m)} × ${sg(g)} = ${sg(muk * m * g)} N`] }) },
    { id: 'up', label: 'Push needed to move it up a slope', fields: [
      { k: 'm', label: 'Mass m', def: '20', units: U.mass, gt: 0 }, angleF, { k: 'mus', label: 'Static μs', def: '0.4', min: 0 }, { k: 'muk', label: 'Kinetic μk', def: '0.3', min: 0 }, gField],
      tip: 'Going up, friction acts down the slope, so it adds to the m g sin θ you already push against.',
      solve: ({ m, th, mus, muk, g }) => {
        const N = m * g * Math.cos(rad(th)), along = m * g * Math.sin(rad(th)), a = along + mus * N, b = along + muk * N;
        return { ans: `Push along the slope with more than ${sg(a)} N to start it up, then ${sg(b)} N keeps it at steady speed.`, work: [`m g sin θ = ${sg(along)} N, N = m g cos θ = ${sg(N)} N`, `Start: F > m g sin θ + μs N = ${sg(along)} + ${sg(mus * N)} = ${sg(a)} N`, `Steady speed: F = m g sin θ + μk N = ${sg(along)} + ${sg(muk * N)} = ${sg(b)} N`] };
      } },
  ],
  presets: [
    { label: 'Crate, 60 N push', prob: 'flat', v: { m: '10', mus: '0.5', muk: '0.4', F: '60' } },
    { label: 'Block on 30° board', prob: 'slope', v: { m: '5', th: '30', mus: '0.6', muk: '0.45' } },
    { label: 'Slips at 28°', prob: 'mu', v: { th: '28' } },
    { label: 'Start a heavy box', prob: 'start', v: { m: '25', mus: '0.45', muk: '0.3' } },
    { label: 'Up a 20° ramp', prob: 'up', v: { m: '20', th: '20', mus: '0.4', muk: '0.3' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Free-body diagrams: the numbers for the standard set-ups
export const FBD: SolverSet = {
  probs: [
    { id: 'atwood', label: 'Two masses over a pulley (Atwood)', fields: [
      { k: 'm1', label: 'Mass 1', def: '5', units: U.mass, gt: 0 }, { k: 'm2', label: 'Mass 2', def: '3', units: U.mass, gt: 0 }, gField],
      tip: 'The tension is the same all along a light string, and it is less than the weight of the heavier mass.',
      solve: ({ m1, m2, g }) => {
        const a = (Math.abs(m1 - m2) * g) / (m1 + m2), T = (2 * m1 * m2 * g) / (m1 + m2), heavy = m1 >= m2 ? 'mass 1' : 'mass 2';
        if (m1 === m2) return { ans: `The masses balance: a = 0 and the tension is ${sg(T)} N.`, work: ['Equal masses: the weights balance.', `T = m g = ${sg(m1)} × ${sg(g)} = ${sg(T)} N`] };
        return { ans: `Acceleration ${sg(a)} m/s² (${heavy} goes down), tension ${sg(T)} N.`, work: ['Heavier side: M g − T = M a;  lighter side: T − m g = m a', `a = (M − m) g ÷ (M + m) = (${sg(Math.max(m1, m2))} − ${sg(Math.min(m1, m2))}) × ${sg(g)} ÷ ${sg(m1 + m2)} = ${sg(a)} m/s²`, `T = 2 M m g ÷ (M + m) = 2 × ${sg(m1)} × ${sg(m2)} × ${sg(g)} ÷ ${sg(m1 + m2)} = ${sg(T)} N`] };
      } },
    { id: 'lift', label: 'Scales reading in a lift', fields: [
      { k: 'm', label: 'Your mass', def: '60', units: U.mass, gt: 0 }, { k: 'a', label: 'Lift acceleration (+ up, − down)', def: '2', units: U.acc }, gField],
      tip: 'Up is positive. Accelerating up makes you feel heavier (N > mg); accelerating down makes you feel lighter.',
      solve: ({ m, a, g }) => {
        if (a <= -g) return { ans: `The scales read 0 N: the lift is in free fall (a = −g or faster), you feel weightless.`, work: [`N − m g = m a gives N = m (g + a) = ${sg(m)} × (${sg(g)} + ${sgn(a)}) which is not above 0, so N = 0.`] };
        const N = m * (g + a);
        return { ans: `The scales read ${sg(N)} N (about ${sg(N / g)} kg).`, work: ['Take up as positive: N − m g = m a', `N = m (g + a) = ${sg(m)} × (${sg(g)} + ${sgn(a)})`, `N = ${sg(N)} N, which is ${sg(N / g)} kg on the scale`] };
      } },
    { id: 'table', label: 'Block on a table pulled by a hanging mass', fields: [
      { k: 'm1', label: 'Mass on the table', def: '4', units: U.mass, gt: 0 }, { k: 'm2', label: 'Hanging mass', def: '2', units: U.mass, gt: 0 },
      { k: 'mu', label: 'Table friction μ', def: '0.2', min: 0 }, gField],
      tip: 'Write one equation for each body, then add them: the tension drops out and you get a for the whole system.',
      solve: ({ m1, m2, mu, g }) => {
        if (m2 <= mu * m1 + 1e-12) return { ans: `It does not move: the hanging weight (${sg(m2 * g)} N) is not more than the friction that can hold (${sg(mu * m1 * g)} N).`, work: [`Friction limit μ m₁ g = ${sg(mu)} × ${sg(m1)} × ${sg(g)} = ${sg(mu * m1 * g)} N`, `Pull m₂ g = ${sg(m2 * g)} N ≤ the limit, so a = 0 and T = m₂ g.`] };
        const a = ((m2 - mu * m1) * g) / (m1 + m2), T = m2 * (g - a);
        return { ans: `Acceleration ${sg(a)} m/s², tension ${sg(T)} N.`, work: ['Table block: T − μ m₁ g = m₁ a;  hanging block: m₂ g − T = m₂ a', `Add them: a = (m₂ − μ m₁) g ÷ (m₁ + m₂) = (${sg(m2)} − ${sg(mu * m1)}) × ${sg(g)} ÷ ${sg(m1 + m2)} = ${sg(a)} m/s²`, `T = m₂ (g − a) = ${sg(m2)} × (${sg(g)} − ${sg(a)}) = ${sg(T)} N`] };
      } },
    { id: 'push2', label: 'Two blocks pushed together', fields: [
      { k: 'F', label: 'Push F on block 1', def: '30', units: U.force, min: 0 }, { k: 'm1', label: 'Block 1 (pushed)', def: '4', units: U.mass, gt: 0 }, { k: 'm2', label: 'Block 2 (in front)', def: '2', units: U.mass, gt: 0 }],
      tip: 'Treat both blocks as one to get a, then use block 2 alone to find the contact force: m₂ a.',
      solve: ({ F, m1, m2 }) => { const a = F / (m1 + m2), C = m2 * a; return { ans: `Acceleration ${sg(a)} m/s²; block 1 pushes block 2 with ${sg(C)} N.`, work: [`Both together (smooth floor): a = F ÷ (m₁ + m₂) = ${sg(F)} ÷ ${sg(m1 + m2)} = ${sg(a)} m/s²`, `Block 2 alone: contact force = m₂ a = ${sg(m2)} × ${sg(a)} = ${sg(C)} N`, `Check on block 1: F − contact = ${sg(F)} − ${sg(C)} = ${sg(F - C)} N = m₁ a`] }; } },
    { id: 'pull', label: 'Box pulled by a rope at an angle', fields: [
      { k: 'm', label: 'Mass m', def: '12', units: U.mass, gt: 0 }, { k: 'F', label: 'Pull F', def: '50', units: U.force, min: 0 },
      { k: 'th', label: 'Rope angle above floor', def: '30', units: U.deg, min: 0, max: 89 }, { k: 'mu', label: 'Friction μ', def: '0.2', min: 0 }, gField],
      tip: 'Pulling upwards at an angle lightens the box, so N = m g − F sin θ is less than m g.',
      solve: ({ m, F, th, mu, g }) => {
        const Fx = F * Math.cos(rad(th)), Fy = F * Math.sin(rad(th)), N = m * g - Fy;
        const w = [`Across the rope: F cos θ = ${sg(F)} × cos ${sg(th)}° = ${sg(Fx)} N;  up: F sin θ = ${sg(Fy)} N`, `N = m g − F sin θ = ${sg(m * g)} − ${sg(Fy)} = ${sg(N)} N`];
        if (N <= 0) return { ans: 'The box lifts off the floor: the upward part of the pull is more than its weight.', work: w };
        const lim = mu * N;
        if (Fx <= lim + 1e-12) return { ans: `It does not move: the sideways pull (${sg(Fx)} N) is not more than friction (${sg(lim)} N).`, work: [...w, `Friction limit = μ N = ${sg(mu)} × ${sg(N)} = ${sg(lim)} N ≥ ${sg(Fx)} N, so a = 0.`] };
        const a = (Fx - lim) / m;
        return { ans: `Normal force ${sg(N)} N; it accelerates at ${sg(a)} m/s².`, work: [...w, `Friction = μ N = ${sg(mu)} × ${sg(N)} = ${sg(lim)} N`, `a = (F cos θ − μ N) ÷ m = (${sg(Fx)} − ${sg(lim)}) ÷ ${sg(m)} = ${sg(a)} m/s²`] };
      } },
  ],
  presets: [
    { label: 'Atwood 5 kg and 3 kg', prob: 'atwood', v: { m1: '5', m2: '3' } },
    { label: 'Lift going up at 2 m/s²', prob: 'lift', v: { m: '60', a: '2' } },
    { label: 'Lift in free fall', prob: 'lift', v: { m: '60', a: '-9.8' } },
    { label: 'Table and hanging mass', prob: 'table', v: { m1: '4', m2: '2', mu: '0.2' } },
    { label: 'Two blocks, 30 N', prob: 'push2', v: { F: '30', m1: '4', m2: '2' } },
    { label: 'Rope at 30°', prob: 'pull', v: { m: '12', F: '50', th: '30', mu: '0.2' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Collisions
const ke = (m: number, v: number) => 0.5 * m * v * v;
export const COLL: SolverSet = {
  probs: [
    { id: 'c1', label: 'Head-on collision in a line (any bounciness)', fields: [
      { k: 'm1', label: 'Mass 1', def: '2', units: U.mass, gt: 0 }, { k: 'u1', label: 'Speed 1 before (+ right)', def: '4', units: U.speed },
      { k: 'm2', label: 'Mass 2', def: '1', units: U.mass, gt: 0 }, { k: 'u2', label: 'Speed 2 before (+ right)', def: '-2', units: U.speed },
      { k: 'e', label: 'Bounciness e (0 sticks, 1 elastic)', def: '1', min: 0, max: 1 }],
      tip: 'Choose right as positive and give a body moving left a negative speed. Momentum is always kept; kinetic energy is kept only when e = 1.',
      solve: ({ m1, u1, m2, u2, e }) => {
        const P = m1 * u1 + m2 * u2, M = m1 + m2, v1 = (P - m2 * e * (u1 - u2)) / M, v2 = (P + m1 * e * (u1 - u2)) / M;
        const K0 = ke(m1, u1) + ke(m2, u2), K1 = ke(m1, v1) + ke(m2, v2), lost = K0 - K1;
        return { ans: `After the collision: body 1 moves at ${sg(v1)} m/s and body 2 at ${sg(v2)} m/s. Kinetic energy lost: ${sg(Math.max(0, lost))} J.`,
          work: [`Momentum before: P = ${sg(m1)} × ${sgn(u1)} + ${sg(m2)} × ${sgn(u2)} = ${sg(P)} kg m/s`, `Separation speed = e × approach speed: v₂ − v₁ = ${sg(e)} × (${sgn(u1)} − ${sgn(u2)}) = ${sg(e * (u1 - u2))} m/s`,
            `v₁ = [P − m₂ e (u₁ − u₂)] ÷ (m₁ + m₂) = ${sg(v1)} m/s;  v₂ = [P + m₁ e (u₁ − u₂)] ÷ (m₁ + m₂) = ${sg(v2)} m/s`, `Momentum after: ${sg(m1 * v1 + m2 * v2)} kg m/s (same as before)`, `Kinetic energy: ${sg(K0)} J before, ${sg(K1)} J after`] };
      } },
    { id: 'stick', label: 'They stick together', fields: [
      { k: 'm1', label: 'Mass 1', def: '1200', units: U.mass, gt: 0 }, { k: 'u1', label: 'Speed 1 before', def: '15', units: U.speed },
      { k: 'm2', label: 'Mass 2', def: '800', units: U.mass, gt: 0 }, { k: 'u2', label: 'Speed 2 before', def: '0', units: U.speed }],
      tip: 'Only momentum is conserved when they stick: some kinetic energy always turns into heat and sound.',
      solve: ({ m1, u1, m2, u2 }) => {
        const v = (m1 * u1 + m2 * u2) / (m1 + m2), K0 = ke(m1, u1) + ke(m2, u2), K1 = ke(m1 + m2, v);
        return { ans: `They move together at ${sg(v)} m/s. Kinetic energy lost: ${sg(K0 - K1)} J (${sg(K0 > 0 ? ((K0 - K1) / K0) * 100 : 0, 3)} %).`, work: ['m₁ u₁ + m₂ u₂ = (m₁ + m₂) v', `v = (${sg(m1)} × ${sgn(u1)} + ${sg(m2)} × ${sgn(u2)}) ÷ ${sg(m1 + m2)} = ${sg(v)} m/s`, `KE before ${sg(K0)} J, after ${sg(K1)} J, lost ${sg(K0 - K1)} J`] };
      } },
    { id: 'e', label: 'Find e from the speeds', fields: [
      { k: 'u1', label: 'Speed 1 before', def: '6', units: U.speed }, { k: 'u2', label: 'Speed 2 before', def: '0', units: U.speed },
      { k: 'v1', label: 'Speed 1 after', def: '1', units: U.speed }, { k: 'v2', label: 'Speed 2 after', def: '4', units: U.speed }],
      tip: 'e = speed of separation ÷ speed of approach. It is always between 0 and 1.',
      solve: ({ u1, u2, v1, v2 }) => {
        if (Math.abs(u1 - u2) < 1e-12) return { err: 'The two bodies must be approaching: the speeds before cannot be equal.' };
        const e = (v2 - v1) / (u1 - u2);
        if (e < -1e-9 || e > 1 + 1e-9) return { err: `That gives e = ${sg(e)}, which is outside 0 to 1. Check the signs and which body is which.` };
        return { ans: `e = ${sg(e)}${e > 0.999 ? ' (elastic)' : e < 0.001 ? ' (they stick)' : ''}.`, work: ['e = (v₂ − v₁) ÷ (u₁ − u₂)', `e = (${sgn(v2)} − ${sgn(v1)}) ÷ (${sgn(u1)} − ${sgn(u2)}) = ${sg(e)}`] };
      } },
    { id: 'bounce', label: 'Ball bouncing on the floor', fields: [
      { k: 'h1', label: 'Drop height', def: '2', units: U.len, gt: 0 }, { k: 'h2', label: 'Height after first bounce', def: '1.28', units: U.len, gt: 0 },
      { k: 'n', label: 'Find the height after bounce number', def: '3', gt: 0, min: 1, max: 20 }],
      tip: 'e comes from speeds, and speed goes as the square root of height, so e = √(h₂ ÷ h₁), not h₂ ÷ h₁.',
      solve: ({ h1, h2, n }) => {
        if (h2 > h1) return { err: 'The bounce cannot be higher than the drop.' };
        const e = Math.sqrt(h2 / h1), nn = Math.round(n), hn = h1 * e ** (2 * nn);
        return { ans: `e = ${sg(e)}; after bounce ${nn} the ball rises to ${sg(hn)} m.`, work: ['Speed before hitting v = √(2 g h₁); after v′ = √(2 g h₂), so e = v′ ÷ v = √(h₂ ÷ h₁)', `e = √(${sg(h2)} ÷ ${sg(h1)}) = ${sg(e)}`, `Each bounce multiplies the height by e² = ${sg(e * e)}: h₍${nn}₎ = ${sg(h1)} × ${sg(e * e)}^${nn} = ${sg(hn)} m`] };
      } },
  ],
  presets: [
    { label: 'Equal masses, elastic', prob: 'c1', v: { m1: '2', u1: '3', m2: '2', u2: '0', e: '1' } },
    { label: 'Head-on, e = 0.5', prob: 'c1', v: { m1: '2', u1: '4', m2: '1', u2: '-2', e: '0.5' } },
    { label: 'Cars stick', prob: 'stick', v: { m1: '1200', u1: '54', m2: '800', u2: '0' }, u: { u1: 'km/h' } },
    { label: 'Find e', prob: 'e', v: { u1: '6', u2: '0', v1: '1', v2: '4' } },
    { label: 'Bouncing ball', prob: 'bounce', v: { h1: '2', h2: '1.28', n: '3' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Kepler and orbits. GM values: IAU nominal solar value, Earth, Moon, Mars and Jupiter from JPL/IAU 2015 values.
export const BODIES: [string, number][] = [
  ['the Sun', 1.32712440018e20], ['the Earth', 3.986004418e14], ['the Moon', 4.9028e12], ['Mars', 4.282837e13], ['Jupiter', 1.26686534e17],
];
const bodyF: Field = { k: 'body', label: 'Orbiting', def: '0', sel: BODIES.map((b) => b[0]) };
const AU = 1.495978707e11, YR = 365.25 * 86400;
const dur = (s: number) => (s >= YR * 2 ? `${sg(s / YR)} years` : s >= 86400 * 2 ? `${sg(s / 86400)} days` : s >= 7200 ? `${sg(s / 3600)} hours` : `${sg(s / 60)} minutes`);
const dis = (m: number, sun: boolean) => (sun && m >= 0.01 * AU ? `${sg(m / AU)} AU` : `${sg(m / 1000)} km`);
export const KEPLER: SolverSet = {
  probs: [
    { id: 'T', label: 'Period from the size of the orbit', fields: [bodyF, { k: 'a', label: 'Semi-major axis a (or radius)', def: '1.524', units: U.dist, gt: 0 }],
      tip: 'For the Sun, with a in AU and T in years, T² = a³ is all you need. Elsewhere use T = 2π√(a³/GM) with a in metres.',
      solve: ({ body, a }) => {
        const GM = BODIES[body][1], T = 2 * Math.PI * Math.sqrt((a ** 3) / GM), sun = body === 0;
        const w = [`T = 2π √(a³ ÷ GM) with a = ${sg(a)} m, GM = ${sg(GM)} m³/s²`, `T = ${sg(T)} s = ${dur(T)}`];
        if (sun) w.push(`Check with T² = a³: a = ${sg(a / AU)} AU gives T = ${sg((a / AU) ** 1.5)} years.`);
        return { ans: `The period is ${dur(T)}.`, work: w };
      } },
    { id: 'a', label: 'Size of the orbit from the period', fields: [bodyF, { k: 'T', label: 'Period T', def: '11.86', units: U.period, gt: 0 }],
      tip: 'Square the period, not the radius: a³ = GM T² ÷ 4π². For the Sun in years and AU, a = T^(2/3).',
      solve: ({ body, T }) => {
        const GM = BODIES[body][1], a = Math.cbrt((GM * T * T) / (4 * Math.PI * Math.PI));
        const w = [`a³ = GM T² ÷ 4π², with T = ${sg(T)} s`, `a = ${sg(a)} m = ${dis(a, body === 0)}`];
        if (body === 0) w.push(`Check with T² = a³: a = (${sg(T / YR)} years)^(2/3) = ${sg((T / YR) ** (2 / 3))} AU.`);
        return { ans: `The semi-major axis is ${dis(a, body === 0)}.`, work: w };
      } },
    { id: 'ratio', label: 'Compare two orbits of the same body (T² ∝ a³)', fields: [
      { k: 'T1', label: 'Period 1', def: '1', units: U.period, gt: 0 }, { k: 'a1', label: 'Orbit size 1', def: '1', units: U.dist, gt: 0 }, { k: 'a2', label: 'Orbit size 2', def: '9', units: U.dist, gt: 0 }],
      tip: 'Use the same unit for both orbit sizes; only the ratio matters. T goes as a to the power 3/2.',
      solve: ({ T1, a1, a2 }) => { const T2 = T1 * (a2 / a1) ** 1.5; return { ans: `The second period is ${dur(T2)}.`, work: ['(T₂ ÷ T₁)² = (a₂ ÷ a₁)³', `T₂ = T₁ (a₂ ÷ a₁)^1.5 = ${dur(T1)} × (${sg(a2 / a1)})^1.5`, `T₂ = ${sg(T2)} s = ${dur(T2)}`] }; } },
    { id: 'v', label: 'Speed in a circular orbit', fields: [bodyF, { k: 'r', label: 'Distance from the centre r', def: '6771', units: U.lenKm, gt: 0 }],
      tip: 'r is measured from the centre of the body, so add its radius to the height of a satellite.',
      solve: ({ body, r }) => { const GM = BODIES[body][1], v = Math.sqrt(GM / r), T = (2 * Math.PI * r) / v; return { ans: `The orbital speed is ${sg(v / 1000)} km/s (${sg(v)} m/s), one lap takes ${dur(T)}.`, work: ['Gravity gives the centripetal force: GM m / r² = m v² / r', `v = √(GM ÷ r) = √(${sg(GM)} ÷ ${sg(r)}) = ${sg(v)} m/s`, `T = 2π r ÷ v = ${sg(T)} s = ${dur(T)}`] }; } },
    { id: 'vv', label: 'Speed at a given distance on an ellipse', fields: [bodyF, { k: 'r', label: 'Distance now r', def: '1.2', units: U.dist, gt: 0 }, { k: 'a', label: 'Semi-major axis a', def: '1.5', units: U.dist, gt: 0 }],
      tip: 'The energy equation v² = GM (2/r − 1/a) holds anywhere on the orbit; the speed is highest closest in.',
      solve: ({ body, r, a }) => {
        const GM = BODIES[body][1], q = 2 / r - 1 / a;
        if (q <= 0) return { err: 'That point is not on the orbit: r must be less than 2a.' };
        const v = Math.sqrt(GM * q); return { ans: `The speed there is ${sg(v / 1000)} km/s.`, work: ['v² = GM (2 ÷ r − 1 ÷ a)', `v = √(${sg(GM)} × (2 ÷ ${sg(r)} − 1 ÷ ${sg(a)})) = ${sg(v)} m/s = ${sg(v / 1000)} km/s`] };
      } },
    { id: 'peri', label: 'Speed at the far point (equal areas)', fields: [
      { k: 'rp', label: 'Closest distance', def: '0.59', units: U.dist, gt: 0 }, { k: 'ra', label: 'Farthest distance', def: '35', units: U.dist, gt: 0 }, { k: 'vp', label: 'Speed at closest', def: '54.6', units: [['km/s', 1000], ['m/s', 1]], gt: 0 }],
      tip: 'Equal areas in equal times means v × r is the same at the closest and farthest points (angular momentum).',
      solve: ({ rp, ra, vp }) => {
        if (ra < rp) return { err: 'The farthest distance must be at least the closest distance.' };
        const va = (vp * rp) / ra, e = (ra - rp) / (ra + rp);
        return { ans: `The speed at the far point is ${sg(va / 1000)} km/s; the orbit has e = ${sg(e)}.`, work: ['Second law: v_closest × r_closest = v_far × r_far', `v_far = ${sg(vp / 1000)} km/s × (${sg(rp / ra)}) = ${sg(va / 1000)} km/s`, `Semi-major axis a = (r_closest + r_far) ÷ 2;  e = (r_far − r_closest) ÷ (r_far + r_closest) = ${sg(e)}`] };
      } },
  ],
  presets: [
    { label: 'Mars year', prob: 'T', v: { a: '1.524' }, u: { a: 'AU' } },
    { label: 'Jupiter distance', prob: 'a', v: { T: '11.86' }, u: { T: 'years' } },
    { label: 'Orbit 9 times as far', prob: 'ratio', v: { T1: '1', a1: '1', a2: '9' } },
    { label: 'Space station speed', prob: 'v', v: { body: '1', r: '6771' } },
    { label: 'Comet far away', prob: 'peri', v: { rp: '0.59', ra: '35', vp: '54.6' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Gravity above and below the surface (same GM and R as the simulator in sci/gravheight.ts)
export const BODIES_G: [string, number, number][] = [['Earth', 3.986004e14, 6371e3], ['Mars', 4.282837e13, 3389.5e3], ['the Moon', 4.9028e12, 1737.4e3]];
const bodyG: Field = { k: 'body', label: 'Planet', def: '0', sel: BODIES_G.map((b) => b[0]) };
export const GRAV: SolverSet = {
  probs: [
    { id: 'h', label: 'g at a height above the surface', fields: [bodyG, { k: 'h', label: 'Height h', def: '400', units: U.lenKm, min: 0 }],
      tip: 'Measure from the centre: the distance is R + h, not h. The shortcut g(1 − 2h/R) only works for h much smaller than R.',
      solve: ({ body, h }) => {
        const [n, GM, R] = BODIES_G[body], g0 = GM / (R * R), g = GM / (R + h) ** 2, approx = g0 * (1 - (2 * h) / R);
        return { ans: `g at ${sg(h / 1000)} km up is ${sg(g)} m/s² (${sg((g / g0) * 100)} % of the surface value ${sg(g0)}).`, work: [`${n}: R = ${sg(R / 1000)} km, g₀ = GM ÷ R² = ${sg(g0)} m/s²`, `g = g₀ R² ÷ (R + h)² = ${sg(g0)} × (${sg(R / 1000)} ÷ ${sg((R + h) / 1000)})² = ${sg(g)} m/s²`, h / R < 0.1 ? `Shortcut g₀ (1 − 2h/R) = ${sg(approx)} m/s²` : 'The shortcut 1 − 2h/R is not accurate this high, so use the full formula.'] };
      } },
    { id: 'd', label: 'g at a depth below the surface', fields: [bodyG, { k: 'd', label: 'Depth d', def: '1000', units: U.lenKm, min: 0 }],
      tip: 'Inside, g falls in a straight line to zero at the centre (uniform-density model): g = g₀ (1 − d/R). It is not the 1/r² law.',
      solve: ({ body, d }) => {
        const [n, GM, R] = BODIES_G[body], g0 = GM / (R * R);
        if (d > R) return { err: `The depth cannot be more than the radius (${sg(R / 1000)} km).` };
        const g = g0 * (1 - d / R); return { ans: `g at ${sg(d / 1000)} km down is ${sg(g)} m/s² (${sg((g / g0) * 100)} % of the surface value).`, work: [`${n}: R = ${sg(R / 1000)} km, g₀ = ${sg(g0)} m/s²`, `g = g₀ (1 − d ÷ R) = ${sg(g0)} × (1 − ${sg(d / 1000)} ÷ ${sg(R / 1000)}) = ${sg(g)} m/s²`] };
      } },
    { id: 'sat', label: 'Satellite speed and period at a height', fields: [bodyG, { k: 'h', label: 'Height above the surface', def: '400', units: U.lenKm, min: 0 }],
      tip: 'The orbit radius is R + h. A satellite is falling all the time; it just keeps missing the planet.',
      solve: ({ body, h }) => {
        const [n, GM, R] = BODIES_G[body], r = R + h, v = Math.sqrt(GM / r), T = (2 * Math.PI * r) / v;
        return { ans: `Speed ${sg(v / 1000)} km/s, period ${dur(T)}.`, work: [`r = R + h = ${sg(R / 1000)} + ${sg(h / 1000)} = ${sg(r / 1000)} km (${n})`, `v = √(GM ÷ r) = √(${sg(GM)} ÷ ${sg(r)}) = ${sg(v)} m/s`, `T = 2π r ÷ v = ${sg(T)} s = ${dur(T)}`] };
      } },
    { id: 'esc', label: 'Escape speed', fields: [bodyG, { k: 'h', label: 'Height to leave from', def: '0', units: U.lenKm, min: 0 }],
      tip: 'Escape speed is √2 times the circular-orbit speed at the same height, and it does not depend on the mass you throw.',
      solve: ({ body, h }) => {
        const [n, GM, R] = BODIES_G[body], r = R + h, v = Math.sqrt((2 * GM) / r);
        return { ans: `The escape speed is ${sg(v / 1000)} km/s (${sg(v * 3.6, 4)} km/h).`, work: ['Kinetic energy ½ m v² = GM m ÷ r', `v = √(2 GM ÷ r) = √(2 × ${sg(GM)} ÷ ${sg(r)}) = ${sg(v)} m/s`, `${n}: r = R + h = ${sg(r / 1000)} km`] };
      } },
    { id: 'w', label: 'Weight at a height (or on another planet)', fields: [bodyG, { k: 'm', label: 'Mass', def: '60', units: U.mass, gt: 0 }, { k: 'h', label: 'Height above the surface', def: '0', units: U.lenKm, min: 0 }],
      tip: 'Your mass stays the same everywhere; only your weight (the pull of gravity) changes.',
      solve: ({ body, m, h }) => { const [n, GM, R] = BODIES_G[body], g = GM / (R + h) ** 2; return { ans: `Weight: ${sg(m * g)} N (${sg((m * g) / 9.8)} kg-force). Mass stays ${sg(m)} kg.`, work: [`g = GM ÷ (R + h)² = ${sg(g)} m/s² on ${n}`, `W = m g = ${sg(m)} × ${sg(g)} = ${sg(m * g)} N`] }; } },
    { id: 'frac', label: 'Height where g drops to 1/k of the surface value', fields: [bodyG, { k: 'k', label: 'k (g becomes 1/k)', def: '4', gt: 1 }],
      tip: 'g ∝ 1/r², so 1/k of g means r = R√k. The height is r − R.',
      solve: ({ body, k }) => { const [n, , R] = BODIES_G[body], h = R * (Math.sqrt(k) - 1); return { ans: `g falls to 1/${sg(k)} of its surface value at ${sg(h / 1000)} km above the surface.`, work: ['g₀ R² ÷ (R + h)² = g₀ ÷ k', `R + h = R √k, so h = R (√k − 1) = ${sg(R / 1000)} × (${sg(Math.sqrt(k))} − 1) = ${sg(h / 1000)} km (${n})`] }; } },
  ],
  presets: [
    { label: 'Space station height', prob: 'h', v: { h: '400' } },
    { label: 'Mine 1000 km down', prob: 'd', v: { d: '1000' } },
    { label: 'Low satellite', prob: 'sat', v: { h: '400' } },
    { label: 'Escape from Mars', prob: 'esc', v: { body: '1', h: '0' } },
    { label: 'Weight on the Moon', prob: 'w', v: { body: '2', m: '60', h: '0' } },
  ],
};
