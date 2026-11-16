// "Solve my numbers" sets for eight Class 9-12 physics Learn tools (thermal-expansion, bernoulli-flow, hydraulic-lift,
// resonance-tube, beats-lab, em-spectrum, optical-fibre, pn-junction). Plain TypeScript, no DOM. Same shape as
// phys-a.ts: each problem gets the typed numbers already converted to SI by phys-a-ui.ts and returns the answer
// sentence and the working. Drawn UI: phys-a-ui.ts. Hand-checked in tests/tools/<id>.mjs.
import { sg as sgBase, G, type Field, type SolverSet, type Unit } from './phys-a';

/** phys-a's sg shows anything under 1e-12 as 0; photon energies in joules and diode currents need to show. */
function sg(x: number, n = 3): string {
  if (Number.isFinite(x) && x !== 0 && Math.abs(x) < 1e-12) { const [m, e] = Math.abs(x).toExponential(n - 1).split('e'); return `${x < 0 ? '−' : ''}${m} × 10^${Number(e)}`; }
  return sgBase(x, n);
}
const al = (a: number) => `${sg(a * 1e6)} × 10⁻⁶`;
const nice = (m: number) => { const x = Math.abs(m); return x >= 1000 ? `${sg(m / 1000)} km` : x >= 1 ? `${sg(m)} m` : x >= 1e-3 ? `${sg(m * 1e3)} mm` : x >= 1e-6 ? `${sg(m * 1e6)} µm` : x >= 1e-9 ? `${sg(m * 1e9)} nm` : `${sg(m * 1e12)} pm`; };

const U = {
  len: [['m', 1], ['cm', 0.01], ['mm', 0.001], ['km', 1000]] as Unit[],
  lenCm: [['cm', 0.01], ['mm', 0.001], ['m', 1]] as Unit[],
  lenMm: [['mm', 0.001], ['cm', 0.01], ['m', 1]] as Unit[],
  area: [['cm²', 1e-4], ['m²', 1]] as Unit[],
  mass: [['kg', 1], ['g', 0.001], ['tonne', 1000]] as Unit[],
  force: [['N', 1], ['kN', 1000]] as Unit[],
  speed: [['m/s', 1], ['cm/s', 0.01], ['km/h', 1 / 3.6]] as Unit[],
  time: [['s', 1], ['min', 60], ['ms', 0.001]] as Unit[],
  deg: [['°', 1], ['rad', 180 / Math.PI]] as Unit[],
  hz: [['Hz', 1], ['kHz', 1e3], ['MHz', 1e6], ['GHz', 1e9], ['THz', 1e12]] as Unit[],
};
const sgn = (x: number) => (x < 0 ? `(${sg(x)})` : sg(x));
const mmOrM = (m: number) => (Math.abs(m) < 1 ? `${sg(m * 1000)} mm` : `${sg(m)} m`);
const cmOrM = (m: number) => (Math.abs(m) < 1 ? `${sg(m * 100)} cm` : `${sg(m)} m`);
const toDeg = (r: number) => (r * 180) / Math.PI;
const dur = (s: number) => (s >= 7200 ? `${sg(s / 3600)} hours` : s >= 120 ? `${sg(s / 60)} minutes` : `${sg(s)} s`);
const cur = (a: number) => { const x = Math.abs(a); return x >= 1 ? `${sg(a)} A` : x >= 1e-3 ? `${sg(a * 1e3)} mA` : x >= 1e-6 ? `${sg(a * 1e6)} µA` : x >= 1e-9 ? `${sg(a * 1e9)} nA` : x === 0 ? '0 A' : `${sg(a * 1e12)} pA`; };

// ---------------------------------------------------------------------------------------------------------
// Thermal expansion
const alphaF: Field = { k: 'a', label: 'Expansion coefficient α', def: '12', units: [['×10⁻⁶ /°C', 1e-6], ['/°C', 1]], gt: 0, hint: 'Steel and concrete about 12, copper 17, aluminium 23, glass 9 (×10⁻⁶ /°C)' };
const lenF = (k = 'L', label = 'Original length L', def = '13'): Field => ({ k, label, def, units: U.len, gt: 0 });
export const THERMAL: SolverSet = {
  probs: [
    { id: 'dL', label: 'Change in length: ΔL = α L ΔT', fields: [alphaF, lenF(), { k: 'dT', label: 'Temperature change ΔT', def: '25', units: [['°C or K', 1], ['°F', 5 / 9]], hint: 'Negative if it cools down' }],
      tip: 'ΔT is the change in temperature, not the temperature itself. A rise of 10 °C is a rise of 10 K, but a rise of 10 °F is only 5.6 °C.',
      solve: ({ a, L, dT }) => { const d = a * L * dT; return { ans: `The length ${d >= 0 ? 'grows' : 'shrinks'} by ${mmOrM(Math.abs(d))}.`, work: ['ΔL = α L ΔT', `ΔL = ${al(a)} /°C × ${sg(L)} m × ${sgn(dT)} °C`, `ΔL = ${sg(d)} m = ${sg(d * 1000)} mm`] }; } },
    { id: 'Lf', label: 'New length: L′ = L (1 + α ΔT)', fields: [alphaF, lenF(), { k: 'dT', label: 'Temperature change ΔT', def: '40', units: [['°C or K', 1]] }],
      tip: 'Add the growth to the old length; do not just report the growth. Keep the unit the same all the way through.',
      solve: ({ a, L, dT }) => { const d = a * L * dT, n = L + d; return { ans: `The new length is ${sg(n, 6)} m (it changed by ${mmOrM(d)}).`, work: ['L′ = L + ΔL = L (1 + α ΔT)', `ΔL = ${al(a)} × ${sg(L)} × ${sgn(dT)} = ${sg(d)} m`, `L′ = ${sg(L)} + ${sgn(d)} = ${sg(n, 6)} m`] }; } },
    { id: 'alpha', label: 'Find α from a measurement', fields: [{ k: 'dL', label: 'Change in length ΔL', def: '1.8', units: U.lenMm, hint: 'Negative if it shrank' }, lenF('L', 'Original length L', '1.5'), { k: 'dT', label: 'Temperature change ΔT', def: '100', units: [['°C or K', 1]] }],
      tip: 'Change ΔL to metres and use the original length L, not the new one. The unit of α is per °C (the same as per K).',
      solve: ({ dL, L, dT }) => {
        if (dT === 0) return { err: 'ΔT cannot be 0: with no change in temperature the length does not change, so α cannot be worked out.' };
        const a = dL / (L * dT);
        return { ans: `α = ${al(a)} /°C.`, work: ['α = ΔL ÷ (L ΔT)', `α = ${sg(dL)} m ÷ (${sg(L)} m × ${sgn(dT)} °C)`, `α = ${sg(a)} /°C = ${al(a)} /°C`] };
      } },
    { id: 'gap', label: 'Gap to leave between rails or slabs', fields: [alphaF, lenF('L', 'Length of each piece L', '13'), { k: 't0', label: 'Temperature when laid', def: '20', units: [['°C', 1]] }, { k: 't1', label: 'Hottest temperature expected', def: '60', units: [['°C', 1]] }],
      tip: 'Leave the gap for the hottest day, measured from the temperature when the piece was laid. Each gap serves the pieces on both sides, so the gap is at least ΔL of one piece when the pieces are equal.',
      solve: ({ a, L, t0, t1 }) => {
        const dT = t1 - t0;
        if (dT <= 0) return { err: 'The hottest temperature must be above the laying temperature, otherwise no gap is needed.' };
        const g = a * L * dT; return { ans: `Leave a gap of at least ${mmOrM(g)} for each ${sg(L)} m piece.`, work: ['gap = α L (T_hot − T_laid)', `gap = ${al(a)} × ${sg(L)} × (${sg(t1)} − ${sgn(t0)})`, `gap = ${sg(g)} m = ${sg(g * 1000)} mm`] };
      } },
    { id: 'close', label: 'Temperature at which a gap closes', fields: [alphaF, lenF('L', 'Length of each piece L', '13'), { k: 'g', label: 'Gap left when laid', def: '5', units: U.lenMm, min: 0 }, { k: 't0', label: 'Temperature when laid', def: '20', units: [['°C', 1]] }],
      tip: 'The gap is used up when the growth ΔL equals the gap. Past that temperature the pieces press on each other and the track can buckle.',
      solve: ({ a, L, g, t0 }) => { const dT = g / (a * L), t = t0 + dT; return { ans: `The gap closes at ${sg(t, 4)} °C (a rise of ${sg(dT, 4)} °C).`, work: ['gap = α L ΔT, so ΔT = gap ÷ (α L)', `ΔT = ${sg(g)} m ÷ (${al(a)} × ${sg(L)} m) = ${sg(dT)} °C`, `T = ${sgn(t0)} + ${sg(dT)} = ${sg(t)} °C`] }; } },
    { id: 'stress', label: 'Stress in a rail that cannot expand', fields: [{ k: 'Y', label: "Young's modulus Y", def: '200', units: [['GPa', 1e9], ['MPa', 1e6]], gt: 0, hint: 'Steel about 200 GPa, aluminium 70 GPa' }, alphaF, { k: 'dT', label: 'Temperature change ΔT', def: '25', units: [['°C or K', 1]] }],
      tip: 'Stress needs no length: a rail twice as long gets the same stress. Multiplying Pa by 10⁻⁶ gives MPa.',
      solve: ({ Y, a, dT }) => { const s = Y * a * dT; return { ans: `The stress is ${sg(Math.abs(s) / 1e6)} MPa (${s >= 0 ? 'compression: it is pushing' : 'tension: it is pulling'}).`, work: ['If it cannot grow, strain = α ΔT and σ = Y × strain', `σ = ${sg(Y)} Pa × ${al(a)} /°C × ${sgn(dT)} °C`, `σ = ${sg(s)} Pa = ${sg(s / 1e6)} MPa`] }; } },
  ],
  presets: [
    { label: 'Steel rail on a hot day', prob: 'dL', v: { a: '12', L: '13', dT: '25' } },
    { label: 'Aluminium rod', prob: 'Lf', v: { a: '23', L: '2', dT: '50' } },
    { label: 'Measure α of a metal', prob: 'alpha', v: { dL: '1.8', L: '1.5', dT: '100' }, u: { L: 'm' } },
    { label: 'Bridge joint', prob: 'gap', v: { a: '12', L: '40', t0: '15', t1: '55' } },
    { label: 'Welded rail', prob: 'stress', v: { Y: '200', a: '12', dT: '25' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Bernoulli, continuity and Torricelli
const RHO = [['Water', 1000], ['Air', 1.2]] as const;
const rhoF: Field = { k: 'fl', label: 'Fluid', def: '0', sel: RHO.map(([n, r]) => `${n} (${r} kg/m³)`) };
const dia = (k: string, label: string, def: string): Field => ({ k, label, def, units: U.lenCm, gt: 0 });
export const BERNOULLI: SolverSet = {
  probs: [
    { id: 'cont', label: 'Speed in a narrower pipe (continuity)', fields: [dia('d1', 'Wide part, diameter d₁', '10'), dia('d2', 'Narrow part, diameter d₂', '5'), { k: 'v1', label: 'Speed in the wide part v₁', def: '2', units: U.speed, gt: 0 }],
      tip: 'Area goes as diameter squared, so halving the diameter makes the flow four times faster, not two. If you are given radii, the ratio is the same.',
      solve: ({ d1, d2, v1 }) => { const v2 = v1 * (d1 / d2) ** 2, Q = (Math.PI / 4) * d1 * d1 * v1; return { ans: `The speed in the second part is ${sg(v2)} m/s (${sg(v2 / v1)} times the first). The flow is ${sg(Q * 1000)} litres per second.`, work: ['A₁ v₁ = A₂ v₂ and A ∝ d², so v₂ = v₁ (d₁ ÷ d₂)²', `v₂ = ${sg(v1)} × (${sg(d1 * 100)} ÷ ${sg(d2 * 100)})² = ${sg(v2)} m/s`, `Q = A₁ v₁ = ${sg(Q)} m³/s = ${sg(Q * 1000)} L/s`] }; } },
    { id: 'dp', label: 'Pressure drop in the narrow part (Venturi)', fields: [dia('d1', 'Wide part, diameter d₁', '10'), dia('d2', 'Narrow part, diameter d₂', '5'), { k: 'v1', label: 'Speed in the wide part v₁', def: '2', units: U.speed, gt: 0 }, rhoF],
      tip: 'Use the density in kg/m³ and the speeds in m/s, so the answer is in pascals. A level pipe is assumed: the heights are the same.',
      solve: ({ d1, d2, v1, fl }) => {
        const rho = RHO[fl][1], v2 = v1 * (d1 / d2) ** 2, dp = 0.5 * rho * (v2 * v2 - v1 * v1), h = dp / (1000 * G);
        return { ans: `${dp >= 0 ? 'The pressure falls' : 'The pressure rises'} by ${sg(Math.abs(dp))} Pa (${sg(Math.abs(dp) / 1000)} kPa) in the second part. Water columns would differ by ${sg(Math.abs(h) * 100)} cm.`, work: [`v₂ = v₁ (d₁ ÷ d₂)² = ${sg(v1)} × ${sg((d1 / d2) ** 2)} = ${sg(v2)} m/s`, 'p₁ + ½ρv₁² = p₂ + ½ρv₂², so p₁ − p₂ = ½ρ (v₂² − v₁²)', `p₁ − p₂ = ½ × ${sg(rho)} × (${sg(v2)}² − ${sg(v1)}²) = ${sg(dp)} Pa`, `h = Δp ÷ (1000 × 9.8) = ${sg(h * 100)} cm of water`] };
      } },
    { id: 'tv', label: "Speed of water from a hole (Torricelli)", fields: [{ k: 'h', label: 'Depth of the hole below the surface h', def: '0.8', units: [['m', 1], ['cm', 0.01]], gt: 0 }],
      tip: 'h is measured from the water surface down to the hole, not from the floor. The speed does not depend on the size of the hole.',
      solve: ({ h }) => { const v = Math.sqrt(2 * G * h); return { ans: `The water leaves at ${sg(v)} m/s (${sg(v * 3.6)} km/h).`, work: ['½ρv² = ρ g h, so v = √(2 g h)', `v = √(2 × 9.8 × ${sg(h)})`, `v = ${sg(v)} m/s`] }; } },
    { id: 'range', label: 'Where the jet lands', fields: [{ k: 'h', label: 'Depth of the hole below the surface h', def: '0.8', units: [['m', 1], ['cm', 0.01]], gt: 0 }, { k: 'y', label: 'Height of the hole above the floor y', def: '0.45', units: [['m', 1], ['cm', 0.01]], gt: 0 }],
      tip: 'Two steps: the speed from h, then the fall time from y. The sideways speed stays the same while it falls. The range is 2√(h y), biggest when the hole is halfway down the water.',
      solve: ({ h, y }) => { const v = Math.sqrt(2 * G * h), t = Math.sqrt((2 * y) / G), x = v * t; return { ans: `The jet lands ${sg(x)} m from the tank.`, work: [`v = √(2 g h) = √(2 × 9.8 × ${sg(h)}) = ${sg(v)} m/s`, `t = √(2y ÷ g) = √(2 × ${sg(y)} ÷ 9.8) = ${sg(t)} s`, `range = v t = ${sg(v)} × ${sg(t)} = ${sg(x)} m (= 2√(h y))`] }; } },
    { id: 'drain', label: 'Time for a tank to drain', fields: [{ k: 'D', label: 'Tank diameter D', def: '1', units: [['m', 1], ['cm', 0.01]], gt: 0 }, { k: 'd', label: 'Hole diameter d', def: '1', units: [['cm', 0.01], ['mm', 0.001], ['m', 1]], gt: 0 }, { k: 'h', label: 'Water depth above the hole h', def: '0.8', units: [['m', 1], ['cm', 0.01]], gt: 0 }],
      tip: 'The tank empties slower and slower as the level falls, so it takes twice as long as a constant-speed flow would. The formula assumes a tank much wider than the hole.',
      solve: ({ D, d, h }) => { if (d > D) return { err: 'The hole cannot be wider than the tank.' }; const r = (D / d) ** 2, t = r * Math.sqrt((2 * h) / G); return { ans: `The tank takes about ${dur(t)} to drain down to the hole.`, work: ['t = (A ÷ a) √(2h ÷ g), with A ÷ a = (D ÷ d)²', `A ÷ a = (${sg(D * 100)} ÷ ${sg(d * 100)})² = ${sg(r)}`, `t = ${sg(r)} × √(2 × ${sg(h)} ÷ 9.8) = ${sg(t)} s`] }; } },
  ],
  presets: [
    { label: 'Pipe 10 cm to 5 cm', prob: 'cont', v: { d1: '10', d2: '5', v1: '2' } },
    { label: 'Venturi pressure drop', prob: 'dp', v: { d1: '10', d2: '5', v1: '2', fl: '0' } },
    { label: 'Tank hole 0.8 m down', prob: 'tv', v: { h: '0.8' }, u: { h: 'm' } },
    { label: 'Jet from a side hole', prob: 'range', v: { h: '0.8', y: '0.45' } },
    { label: 'Draining time', prob: 'drain', v: { D: '1', d: '1', h: '0.8' }, u: { D: 'm', d: 'cm', h: 'm' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Hydraulic lift (Pascal's law)
const pis = (k: string, label: string, def: string): Field => ({ k, label, def, units: U.lenCm, gt: 0 });
const pA = (x: number) => (Math.PI / 4) * x * x;
export const HYDRAULIC: SolverSet = {
  probs: [
    { id: 'F2', label: 'Force on the big piston', fields: [{ k: 'F1', label: 'Force on the small piston F₁', def: '120', units: U.force, gt: 0 }, pis('d1', 'Small piston diameter d₁', '4'), pis('d2', 'Big piston diameter d₂', '40')],
      tip: 'The ratio of the areas is the ratio of the diameters squared. Never use the ratio of diameters alone. If you are given radii, use them the same way.',
      solve: ({ F1, d1, d2 }) => { const r = (d2 / d1) ** 2, F2 = F1 * r, p = F1 / pA(d1); return { ans: `The big piston pushes with ${sg(F2)} N (${sg(r)} times the force you apply). The pressure is ${sg(p / 1000)} kPa.`, work: ['p = F₁ ÷ A₁ is the same everywhere, so F₂ = F₁ × A₂ ÷ A₁ = F₁ (d₂ ÷ d₁)²', `F₂ = ${sg(F1)} × (${sg(d2 * 100)} ÷ ${sg(d1 * 100)})² = ${sg(F1)} × ${sg(r)} = ${sg(F2)} N`, `p = F₁ ÷ A₁ = ${sg(F1)} ÷ ${sg(pA(d1))} m² = ${sg(p)} Pa`] }; } },
    { id: 'F2A', label: 'Force on the big piston (areas given)', fields: [{ k: 'F1', label: 'Force on the small piston F₁', def: '50', units: U.force, gt: 0 }, { k: 'A1', label: 'Small piston area A₁', def: '10', units: U.area, gt: 0 }, { k: 'A2', label: 'Big piston area A₂', def: '500', units: U.area, gt: 0 }],
      tip: 'Put both areas in the same unit before dividing. cm² to m² is × 10⁻⁴ (not × 10⁻²).',
      solve: ({ F1, A1, A2 }) => { const F2 = (F1 * A2) / A1; return { ans: `The big piston pushes with ${sg(F2)} N.`, work: ['F₁ ÷ A₁ = F₂ ÷ A₂', `F₂ = ${sg(F1)} N × ${sg(A2)} m² ÷ ${sg(A1)} m² = ${sg(F2)} N`] }; } },
    { id: 'load', label: 'Effort needed to lift a load', fields: [{ k: 'm', label: 'Mass to lift m', def: '1200', units: U.mass, gt: 0 }, pis('d1', 'Small piston diameter d₁', '4'), pis('d2', 'Big piston diameter d₂', '40')],
      tip: 'Turn the mass into a weight first: F₂ = m g. Then shrink it by the area ratio. A real lift needs a bit more because of friction and leaks.',
      solve: ({ m, d1, d2 }) => { const W = m * G, F1 = W * (d1 / d2) ** 2; return { ans: `You need to push the small piston with ${sg(F1)} N (about ${sg(F1 / G)} kg-force) to hold up ${sg(m)} kg.`, work: [`Load F₂ = m g = ${sg(m)} × 9.8 = ${sg(W)} N`, 'F₁ = F₂ × A₁ ÷ A₂ = F₂ (d₁ ÷ d₂)²', `F₁ = ${sg(W)} × (${sg(d1 * 100)} ÷ ${sg(d2 * 100)})² = ${sg(F1)} N`] }; } },
    { id: 'x2', label: 'How far the load rises', fields: [{ k: 'x1', label: 'Distance the small piston moves x₁', def: '30', units: U.lenCm, gt: 0 }, pis('d1', 'Small piston diameter d₁', '4'), pis('d2', 'Big piston diameter d₂', '40')],
      tip: 'What you gain in force you lose in distance: the oil volume moved is the same, A₁ x₁ = A₂ x₂. Work in equals work out (ignoring friction).',
      solve: ({ x1, d1, d2 }) => { const x2 = x1 * (d1 / d2) ** 2; return { ans: `The big piston rises ${cmOrM(x2)} when you push the small one ${cmOrM(x1)}.`, work: ['The same volume moves: A₁ x₁ = A₂ x₂', `x₂ = x₁ (d₁ ÷ d₂)² = ${sg(x1 * 100)} cm × (${sg(d1 * 100)} ÷ ${sg(d2 * 100)})²`, `x₂ = ${sg(x2 * 100)} cm`] }; } },
    { id: 'strokes', label: 'Number of pumps to raise the load', fields: [{ k: 'H', label: 'Height to lift H', def: '15', units: U.lenCm, gt: 0 }, { k: 'x1', label: 'Stroke of the small piston x₁', def: '20', units: U.lenCm, gt: 0 }, pis('d1', 'Small piston diameter d₁', '4'), pis('d2', 'Big piston diameter d₂', '40')],
      tip: 'Round the number of strokes up: part of a stroke still has to be done. A real jack has a valve so the load does not sink between strokes.',
      solve: ({ H, x1, d1, d2 }) => { const x2 = x1 * (d1 / d2) ** 2, n = H / x2; return { ans: `About ${sg(n)} strokes, so ${Math.ceil(n - 1e-9)} pumps.`, work: [`Rise per stroke x₂ = x₁ (d₁ ÷ d₂)² = ${sg(x1 * 100)} × ${sg((d1 / d2) ** 2)} = ${sg(x2 * 100)} cm`, `strokes = H ÷ x₂ = ${sg(H * 100)} ÷ ${sg(x2 * 100)} = ${sg(n)}`] }; } },
    { id: 'p', label: 'Pressure in the oil', fields: [{ k: 'F1', label: 'Force on the small piston F₁', def: '120', units: U.force, gt: 0 }, pis('d1', 'Piston diameter d₁', '4')],
      tip: 'Pressure is force per area, so a thin piston makes a large pressure. 1 kPa = 1000 Pa. Atmospheric pressure is about 101 kPa.',
      solve: ({ F1, d1 }) => { const A = pA(d1), p = F1 / A; return { ans: `The pressure is ${sg(p / 1000)} kPa (${sg(p / 101325)} atmospheres).`, work: ['A = π d² ÷ 4', `A = π × ${sg(d1)}² ÷ 4 = ${sg(A)} m²`, `p = F ÷ A = ${sg(F1)} ÷ ${sg(A)} = ${sg(p)} Pa`] }; } },
  ],
  presets: [
    { label: 'Garage jack: 120 N on 4 cm', prob: 'F2', v: { F1: '120', d1: '4', d2: '40' } },
    { label: 'Press with areas', prob: 'F2A', v: { F1: '50', A1: '10', A2: '500' } },
    { label: 'Lift a 1200 kg car', prob: 'load', v: { m: '1200', d1: '4', d2: '40' } },
    { label: 'Distance moved', prob: 'x2', v: { x1: '30', d1: '4', d2: '40' } },
    { label: 'Pumps to lift 15 cm', prob: 'strokes', v: { H: '15', x1: '20', d1: '4', d2: '40' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Resonance tube
const vSound = (T: number) => 331.3 * Math.sqrt(1 + T / 273.15);
const freqF: Field = { k: 'f', label: 'Tuning fork frequency f', def: '512', units: [['Hz', 1]], gt: 0 };
const tubeD: Field = { k: 'd', label: 'Inside diameter of the tube d', def: '4', units: U.lenCm, min: 0, hint: 'End correction e ≈ 0.3 d' };
export const RESONANCE: SolverSet = {
  probs: [
    { id: 'v', label: 'Speed of sound from two resonance lengths', fields: [freqF, { k: 'L1', label: 'First resonance length L₁', def: '15.7', units: U.lenCm, gt: 0 }, { k: 'L2', label: 'Second resonance length L₂', def: '49.5', units: U.lenCm, gt: 0 }],
      tip: 'Use the difference L₂ − L₁: it is half a wavelength and the end correction cancels out. Convert cm to m before multiplying by f.',
      solve: ({ f, L1, L2 }) => {
        if (L2 <= L1) return { err: 'The second resonance length must be longer than the first (the water is lowered further).' };
        const lam = 2 * (L2 - L1), v = f * lam, e = (L2 - 3 * L1) / 2;
        return { ans: `The speed of sound is ${sg(v)} m/s (wavelength ${sg(lam * 100)} cm). The end correction is ${sg(e * 100)} cm.`, work: ['L₂ − L₁ = λ ÷ 2, so λ = 2 (L₂ − L₁)', `λ = 2 × (${sg(L2)} − ${sg(L1)}) m = ${sg(lam)} m`, `v = f λ = ${sg(f)} × ${sg(lam)} = ${sg(v)} m/s`, `End correction e = (L₂ − 3 L₁) ÷ 2 = ${sg(e)} m = ${sg(e * 100)} cm${e < 0 ? ' (negative: re-check your readings)' : ''}`] };
      } },
    { id: 'v1', label: 'Speed of sound from one length and the tube width', fields: [freqF, { k: 'L1', label: 'First resonance length L₁', def: '15.7', units: U.lenCm, gt: 0 }, tubeD],
      tip: 'The first resonance is a quarter of a wavelength long including the end correction: λ = 4 (L₁ + 0.3 d). Leaving out the end correction gives a speed that is too low.',
      solve: ({ f, L1, d }) => { const e = 0.3 * d, lam = 4 * (L1 + e), v = f * lam; return { ans: `The speed of sound is ${sg(v)} m/s.`, work: [`End correction e ≈ 0.3 d = ${sg(e * 100)} cm`, `L₁ + e = λ ÷ 4, so λ = 4 × (${sg(L1)} + ${sg(e)}) = ${sg(lam)} m`, `v = f λ = ${sg(f)} × ${sg(lam)} = ${sg(v)} m/s`] }; } },
    { id: 'f', label: 'Fork frequency from the first resonance', fields: [{ k: 'v', label: 'Speed of sound v', def: '346', units: [['m/s', 1]], gt: 0 }, { k: 'L1', label: 'First resonance length L₁', def: '15.7', units: U.lenCm, gt: 0 }, tubeD],
      tip: 'The tube length alone is not λ/4: add the end correction 0.3 d first.',
      solve: ({ v, L1, d }) => { const e = 0.3 * d, lam = 4 * (L1 + e), f = v / lam; return { ans: `The frequency is ${sg(f)} Hz.`, work: [`λ = 4 (L₁ + 0.3 d) = 4 × (${sg(L1)} + ${sg(e)}) = ${sg(lam)} m`, `f = v ÷ λ = ${sg(v)} ÷ ${sg(lam)} = ${sg(f)} Hz`] }; } },
    { id: 'len', label: 'Where the tube will resonate', fields: [freqF, { k: 'v', label: 'Speed of sound v', def: '346', units: [['m/s', 1]], gt: 0 }, tubeD],
      tip: 'Resonance lengths are λ/4, 3λ/4, 5λ/4 ... minus the end correction. If a length comes out negative, the tube is too short for that one.',
      solve: ({ f, v, d }) => { const lam = v / f, e = 0.3 * d, L1 = lam / 4 - e, L2 = (3 * lam) / 4 - e, L3 = (5 * lam) / 4 - e; return { ans: `Resonance at ${sg(L1 * 100)} cm, ${sg(L2 * 100)} cm and ${sg(L3 * 100)} cm of air.`, work: [`λ = v ÷ f = ${sg(v)} ÷ ${sg(f)} = ${sg(lam)} m`, `L = λ/4, 3λ/4, 5λ/4, each minus e = ${sg(e)} m`, `L₁ = ${sg(lam / 4)} − ${sg(e)} = ${sg(L1)} m;  L₂ = ${sg(L2)} m;  L₃ = ${sg(L3)} m`] }; } },
    { id: 'T', label: 'Speed of sound at a temperature', fields: [{ k: 'T', label: 'Air temperature', def: '25', units: [['°C', 1]], gt: -273.15 }],
      tip: 'Sound goes faster in warmer air: about 0.6 m/s more for each °C. A cold morning gives a smaller speed than a hot afternoon.',
      solve: ({ T }) => { const v = vSound(T); return { ans: `The speed of sound in air at ${sg(T)} °C is ${sg(v)} m/s.`, work: ['v = 331.3 √(1 + T ÷ 273.15) m/s', `v = 331.3 × √(1 + ${sgn(T)} ÷ 273.15) = ${sg(v)} m/s`, `Quick rule: 331 + 0.6 T = ${sg(331 + 0.6 * T)} m/s`] }; } },
  ],
  presets: [
    { label: 'Two lengths, 512 Hz fork', prob: 'v', v: { f: '512', L1: '15.7', L2: '49.5' }, u: { L1: 'cm', L2: 'cm' } },
    { label: 'One length with end correction', prob: 'v1', v: { f: '512', L1: '15.7', d: '4' }, u: { L1: 'cm', d: 'cm' } },
    { label: 'Find the fork frequency', prob: 'f', v: { v: '346', L1: '15.7', d: '4' }, u: { L1: 'cm', d: 'cm' } },
    { label: 'Predict the lengths', prob: 'len', v: { f: '512', v: '346', d: '4' }, u: { d: 'cm' } },
    { label: 'Speed on a hot day', prob: 'T', v: { T: '40' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Beats
export const BEATS: SolverSet = {
  probs: [
    { id: 'fb', label: 'Beat frequency of two notes', fields: [{ k: 'f1', label: 'First frequency f₁', def: '440', units: U.hz, gt: 0 }, { k: 'f2', label: 'Second frequency f₂', def: '444', units: U.hz, gt: 0 }],
      tip: 'Beat frequency is the difference, never the sum or the average. The average is the pitch you hear.',
      solve: ({ f1, f2 }) => {
        const fb = Math.abs(f1 - f2);
        if (fb < 1e-9) return { err: 'The two frequencies are the same, so there are no beats (the waves add steadily).' };
        return { ans: `There are ${sg(fb)} beats per second, one swell every ${sg(1 / fb)} s. You hear a pitch of ${sg((f1 + f2) / 2)} Hz.`, work: ['f_beat = |f₁ − f₂|', `f_beat = |${sg(f1)} − ${sg(f2)}| = ${sg(fb)} Hz`, `Period of the swell = 1 ÷ ${sg(fb)} = ${sg(1 / fb)} s`, `Pitch heard = (f₁ + f₂) ÷ 2 = ${sg((f1 + f2) / 2)} Hz`, ...(fb > 15 ? ['Above about 15 beats per second the ear no longer hears separate swells, only a rough sound.'] : [])] };
      } },
    { id: 'fork', label: 'Unknown fork from beats and wax', fields: [{ k: 'fk', label: 'Known fork frequency', def: '256', units: [['Hz', 1]], gt: 0 }, { k: 'n', label: 'Beats counted', def: '6', gt: 0 }, { k: 't', label: 'In this much time', def: '3', units: U.time, gt: 0 }, { k: 'wax', label: 'After putting wax on the unknown fork, the beats', def: '0', sel: ['get faster', 'get slower', 'I did not try wax'] }],
      tip: 'Wax makes a fork heavier, so its frequency goes down. Beats getting faster means the gap grew, so the unknown fork was the lower one. Divide by the time: 6 beats in 3 s is 2 beats per second, not 6.',
      solve: ({ fk, n, t, wax }) => {
        const fb = n / t, hi = fk + fb, lo = fk - fb;
        const head = [`Beats per second = ${sg(n)} ÷ ${sg(t)} = ${sg(fb)} Hz`, 'The unknown fork is either f_known + beats or f_known − beats'];
        if (wax === 0) return lo <= 0 ? { err: 'Those numbers do not work: the unknown fork would have a frequency of 0 or less.' } : { ans: `The unknown fork is ${sg(lo)} Hz.`, work: [...head, 'Wax lowers the unknown frequency. The beats got faster, so it moved further from the known fork: it is the lower one.', `f = ${sg(fk)} − ${sg(fb)} = ${sg(lo)} Hz`] };
        if (wax === 1) return { ans: `The unknown fork is ${sg(hi)} Hz.`, work: [...head, 'Wax lowers the unknown frequency. The beats got slower, so it moved closer to the known fork: it is the higher one.', `f = ${sg(fk)} + ${sg(fb)} = ${sg(hi)} Hz`] };
        return { ans: lo > 0 ? `The unknown fork is ${sg(hi)} Hz or ${sg(lo)} Hz (wax would tell you which).` : `The unknown fork is ${sg(hi)} Hz.`, work: [...head, `f = ${sg(fk)} + ${sg(fb)} = ${sg(hi)} Hz, or ${sg(fk)} − ${sg(fb)} = ${sg(lo)} Hz`] };
      } },
    { id: 'count', label: 'How many beats in a given time', fields: [{ k: 'f1', label: 'First frequency f₁', def: '512', units: U.hz, gt: 0 }, { k: 'f2', label: 'Second frequency f₂', def: '508', units: U.hz, gt: 0 }, { k: 't', label: 'Time', def: '10', units: U.time, gt: 0 }],
      tip: 'Beats per second times seconds. Keep the time in seconds.',
      solve: ({ f1, f2, t }) => { const fb = Math.abs(f1 - f2); return { ans: `${sg(fb * t)} beats in ${sg(t)} s (${sg(fb)} per second).`, work: ['f_beat = |f₁ − f₂|', `f_beat = |${sg(f1)} − ${sg(f2)}| = ${sg(fb)} Hz`, `beats = f_beat × t = ${sg(fb)} × ${sg(t)} = ${sg(fb * t)}`] }; } },
  ],
  presets: [
    { label: 'Two guitar strings', prob: 'fb', v: { f1: '440', f2: '444' }, u: { f1: 'Hz', f2: 'Hz' } },
    { label: 'Unknown fork, beats faster', prob: 'fork', v: { fk: '256', n: '6', t: '3', wax: '0' }, u: { t: 's' } },
    { label: 'Unknown fork, beats slower', prob: 'fork', v: { fk: '256', n: '6', t: '3', wax: '1' }, u: { t: 's' } },
    { label: 'No wax test', prob: 'fork', v: { fk: '512', n: '10', t: '2', wax: '2' }, u: { t: 's' } },
    { label: 'Beats in 10 seconds', prob: 'count', v: { f1: '512', f2: '508', t: '10' }, u: { f1: 'Hz', f2: 'Hz', t: 's' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Electromagnetic spectrum
const C0 = 299792458, H0 = 6.62607015e-34, E0 = 1.602176634e-19;
const EM_BANDS: [string, number][] = [['gamma rays', 1e-12], ['X-rays', 1e-9], ['ultraviolet', 400e-9], ['visible light', 700e-9], ['infrared', 1e-3], ['microwaves', 1], ['radio waves', Infinity]];
const emBand = (lam: number) => EM_BANDS.find(([, max]) => lam < max)![0];
const colour = (lam: number) => (lam >= 400e-9 && lam < 700e-9 ? [[450, 'violet or blue'], [495, 'blue'], [570, 'green'], [590, 'yellow'], [620, 'orange'], [701, 'red']].find(([n]) => lam * 1e9 < (n as number))![1] : '');
const emTip = 'Check the band edges against your book: they differ slightly. Remember: shorter wavelength means higher frequency and higher energy.';
const lenE: Unit[] = [['nm', 1e-9], ['pm', 1e-12], ['µm', 1e-6], ['mm', 1e-3], ['cm', 1e-2], ['m', 1], ['km', 1000]];
function emOut(lam: number, work: string[]) {
  const f = C0 / lam, E = (H0 * C0) / lam, eV = E / E0, col = colour(lam);
  return { ans: `This is ${emBand(lam)}${col ? ` (${col})` : ''}: wavelength ${nice(lam)}, frequency ${sg(f)} Hz, photon energy ${sg(eV)} eV (${sg(E)} J).`, work: [...work, `f = c ÷ λ = 3.00 × 10^8 ÷ ${sg(lam)} = ${sg(f)} Hz`, `E = h f = 6.626 × 10^−34 × ${sg(f)} = ${sg(E)} J = ${sg(eV)} eV (÷ 1.602 × 10^−19)`] };
}
export const EMSPEC: SolverSet = {
  probs: [
    { id: 'lam', label: 'From wavelength: frequency, energy, band', fields: [{ k: 'l', label: 'Wavelength λ', def: '500', units: lenE, gt: 0 }], tip: emTip,
      solve: ({ l }) => emOut(l, ['f = c ÷ λ and E = h f = h c ÷ λ']) },
    { id: 'freq', label: 'From frequency: wavelength, energy, band', fields: [{ k: 'f', label: 'Frequency f', def: '2.45', units: [['GHz', 1e9], ['Hz', 1], ['kHz', 1e3], ['MHz', 1e6], ['THz', 1e12]], gt: 0 }], tip: emTip + ' MHz and GHz are 10^6 and 10^9 Hz.',
      solve: ({ f }) => { const lam = C0 / f; return emOut(lam, [`λ = c ÷ f = 3.00 × 10^8 ÷ ${sg(f)} = ${sg(lam)} m`]); } },
    { id: 'en', label: 'From photon energy: wavelength, frequency', fields: [{ k: 'E', label: 'Photon energy E', def: '2', units: [['eV', 1], ['keV', 1e3], ['MeV', 1e6]], gt: 0 }], tip: '1 eV = 1.602 × 10⁻¹⁹ J. Multiply by this to get joules; divide to go back.',
      solve: ({ E }) => { const lam = (H0 * C0) / (E * E0); return emOut(lam, [`λ = h c ÷ E = 6.626 × 10^−34 × 3.00 × 10^8 ÷ (${sg(E)} × 1.602 × 10^−19) = ${sg(lam)} m`]); } },
    { id: 'rate', label: 'Photons per second from a lamp or laser', fields: [{ k: 'P', label: 'Power of the light P', def: '5', units: [['mW', 1e-3], ['W', 1], ['µW', 1e-6]], gt: 0 }, { k: 'l', label: 'Wavelength λ', def: '650', units: lenE, gt: 0 }], tip: 'Power is energy per second, so photons per second = P ÷ energy of one photon. Use watts and joules, not mW and eV.',
      solve: ({ P, l }) => { const E = (H0 * C0) / l, n = P / E; return { ans: `About ${sg(n)} photons leave every second (each carries ${sg(E / E0)} eV).`, work: [`E = h c ÷ λ = 6.626 × 10^−34 × 3.00 × 10^8 ÷ ${sg(l)} = ${sg(E)} J`, `N = P ÷ E = ${sg(P)} ÷ ${sg(E)} = ${sg(n)} per second`] }; } },
  ],
  presets: [
    { label: 'Green light, 500 nm', prob: 'lam', v: { l: '500' }, u: { l: 'nm' } },
    { label: 'Microwave oven, 2.45 GHz', prob: 'freq', v: { f: '2.45' }, u: { f: 'GHz' } },
    { label: 'FM radio, 100 MHz', prob: 'freq', v: { f: '100' }, u: { f: 'MHz' } },
    { label: 'Medical X-ray, 40 keV', prob: 'en', v: { E: '40' }, u: { E: 'keV' } },
    { label: 'Red laser pointer', prob: 'rate', v: { P: '5', l: '650' }, u: { P: 'mW', l: 'nm' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Optical fibre
const nCore: Field = { k: 'n1', label: 'Core refractive index n₁', def: '1.5', min: 1, hint: 'Glass is about 1.5' };
const nClad: Field = { k: 'n2', label: 'Cladding refractive index n₂', def: '1.45', min: 1, hint: 'Must be a little lower than the core' };
export const FIBRE: SolverSet = {
  probs: [
    { id: 'crit', label: 'Critical angle', fields: [nCore, nClad], tip: 'Total internal reflection only happens going from the higher index to the lower one. The angle is measured from the normal (the line at 90° to the wall), not from the wall.',
      solve: ({ n1, n2 }) => { if (n2 >= n1) return { err: 'The cladding index must be lower than the core index, otherwise there is no total internal reflection.' }; const c = toDeg(Math.asin(n2 / n1)); return { ans: `The critical angle is ${sg(c, 4)}°. Light hitting the wall at a larger angle is trapped.`, work: ['sin C = n₂ ÷ n₁', `sin C = ${sg(n2)} ÷ ${sg(n1)} = ${sg(n2 / n1, 4)}`, `C = ${sg(c, 4)}°`] }; } },
    { id: 'na', label: 'Numerical aperture and acceptance angle', fields: [nCore, nClad, { k: 'n0', label: 'Index outside the fibre', def: '1', min: 1, hint: 'Air is 1' }],
      tip: 'The acceptance angle is measured from the fibre axis, in the outside medium, not inside the glass. Light entering at a larger angle leaks out.',
      solve: ({ n1, n2, n0 }) => {
        if (n2 >= n1) return { err: 'The cladding index must be lower than the core index.' };
        const na = Math.sqrt(n1 * n1 - n2 * n2), s = na / n0;
        return { ans: s >= 1 ? `NA = ${sg(na, 4)}. Light from every direction in front of the fibre is accepted.` : `NA = ${sg(na, 4)}. The acceptance angle is ${sg(toDeg(Math.asin(s)), 4)}° from the axis (a cone ${sg(2 * toDeg(Math.asin(s)), 4)}° wide).`, work: ['NA = √(n₁² − n₂²)', `NA = √(${sg(n1)}² − ${sg(n2)}²) = ${sg(na, 4)}`, s >= 1 ? 'NA ÷ n₀ is 1 or more, so there is no limit on the entry angle' : `sin θ_a = NA ÷ n₀ = ${sg(s, 4)}, so θ_a = ${sg(toDeg(Math.asin(s)), 4)}°`] };
      } },
    { id: 'enter', label: 'Is a ray from outside trapped?', fields: [nCore, nClad, { k: 'th', label: 'Angle of the ray to the fibre axis', def: '15', units: U.deg, min: 0, max: 90 }],
      tip: 'Two steps: refraction at the end face (from the axis), then the angle at the wall is 90° minus the angle inside. The wall angle must be bigger than the critical angle.',
      solve: ({ n1, n2, th }) => {
        if (n2 >= n1) return { err: 'The cladding index must be lower than the core index.' };
        const t = (th * Math.PI) / 180, r = Math.asin(Math.sin(t) / n1), phi = 90 - toDeg(r), C = toDeg(Math.asin(n2 / n1)), ok = phi > C;
        return { ans: ok ? `Yes: the ray hits the wall at ${sg(phi, 4)}°, more than the critical angle ${sg(C, 4)}°, so it is trapped.` : `No: the ray hits the wall at ${sg(phi, 4)}°, less than the critical angle ${sg(C, 4)}°, so it leaks out.`, work: [`At the end face (from air): sin r = sin ${sg(th)}° ÷ ${sg(n1)}, so r = ${sg(toDeg(r), 4)}°`, `Angle at the wall = 90° − r = ${sg(phi, 4)}°`, `Critical angle C = sin⁻¹(${sg(n2)} ÷ ${sg(n1)}) = ${sg(C, 4)}°`] };
      } },
    { id: 'delay', label: 'Pulse spreading over a length', fields: [nCore, nClad, { k: 'L', label: 'Length of the fibre', def: '1', units: [['km', 1000], ['m', 1]], gt: 0 }],
      tip: 'This is the most pulse spreading a step-index fibre can have: the slowest ray zig-zags at the critical angle, the fastest goes straight. Thin single-mode fibres avoid it.',
      solve: ({ n1, n2, L }) => { if (n2 >= n1) return { err: 'The cladding index must be lower than the core index.' }; const dt = ((L * n1) / C0) * (n1 / n2 - 1); return { ans: `A pulse spreads by up to ${sg(dt * 1e9)} ns over ${sg(L / 1000)} km.`, work: ['Straight ray: t = L n₁ ÷ c;  the slowest ray: t = L n₁² ÷ (c n₂)', 'Spread Δt = (L n₁ ÷ c) × (n₁ ÷ n₂ − 1)', `Δt = (${sg(L)} × ${sg(n1)} ÷ 3.00 × 10^8) × (${sg(n1 / n2, 4)} − 1) = ${sg(dt)} s`] }; } },
  ],
  presets: [
    { label: 'Glass core 1.50, cladding 1.45', prob: 'crit', v: { n1: '1.5', n2: '1.45' } },
    { label: 'Acceptance angle in air', prob: 'na', v: { n1: '1.5', n2: '1.45', n0: '1' } },
    { label: 'Ray at 15°', prob: 'enter', v: { n1: '1.5', n2: '1.45', th: '15' }, u: { th: '°' } },
    { label: 'Ray at 40°', prob: 'enter', v: { n1: '1.5', n2: '1.45', th: '40' }, u: { th: '°' } },
    { label: 'Spreading over 1 km', prob: 'delay', v: { n1: '1.5', n2: '1.45', L: '1' }, u: { L: 'km' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// PN junction and diode
const KQ = 8.617333262e-5;
const tF: Field = { k: 'T', label: 'Temperature T', def: '300', units: [['K', 1]], gt: 0, hint: '300 K is about 27 °C (add 273 to °C)' };
const etaF: Field = { k: 'eta', label: 'Ideality factor η', def: '1', gt: 0, hint: '1 to 2; use 1 if unsure' };
export const DIODE: SolverSet = {
  probs: [
    { id: 'series', label: 'Series resistor for a diode or LED', fields: [{ k: 'Vs', label: 'Supply voltage', def: '5', units: [['V', 1]], gt: 0 }, { k: 'Vf', label: 'Diode forward voltage', def: '0.7', units: [['V', 1]], min: 0, hint: 'Silicon 0.7 V, germanium 0.3 V, red LED about 2 V' }, { k: 'I', label: 'Current wanted', def: '10', units: [['mA', 1e-3], ['A', 1], ['µA', 1e-6]], gt: 0 }],
      tip: 'The resistor takes what the diode does not: V_R = supply − V_f. Do not forget to change mA to A.',
      solve: ({ Vs, Vf, I }) => { if (Vs <= Vf) return { err: 'The supply must be bigger than the diode voltage, or no current flows.' }; const R = (Vs - Vf) / I; return { ans: `Use a resistor of ${sg(R)} Ω (next standard value up). It gets ${sg(R * I * I * 1000)} mW.`, work: [`Voltage across R = ${sg(Vs)} − ${sg(Vf)} = ${sg(Vs - Vf)} V`, `R = V ÷ I = ${sg(Vs - Vf)} ÷ ${sg(I)} = ${sg(R)} Ω`, `P = I² R = ${sg(I)}² × ${sg(R)} = ${sg(R * I * I)} W`] }; } },
    { id: 'zener', label: 'Zener voltage regulator', fields: [{ k: 'Vin', label: 'Input voltage', def: '12', units: [['V', 1]], gt: 0 }, { k: 'Vz', label: 'Zener voltage', def: '5.1', units: [['V', 1]], gt: 0 }, { k: 'R', label: 'Series resistor R', def: '220', units: [['Ω', 1], ['kΩ', 1000]], gt: 0 }, { k: 'RL', label: 'Load resistor R_L', def: '1', units: [['kΩ', 1000], ['Ω', 1]], gt: 0 }],
      tip: 'The Zener only holds the voltage while some current still passes through it. If the load takes all the current, the output drops below V_z.',
      solve: ({ Vin, Vz, R, RL }) => {
        if (Vin <= Vz) return { err: 'The input must be above the Zener voltage for it to break down.' };
        const Iin = (Vin - Vz) / R, IL = Vz / RL, Iz = Iin - IL;
        if (Iz <= 0) { const Vo = (Vin * RL) / (R + RL); return { ans: `The Zener is not conducting: the load takes more than the resistor can supply. The output is only about ${sg(Vo)} V.`, work: [`Current through R if the output is ${sg(Vz)} V: (${sg(Vin)} − ${sg(Vz)}) ÷ ${sg(R)} = ${sg(Iin)} A`, `Load current would be ${sg(Vz)} ÷ ${sg(RL)} = ${sg(IL)} A, which is more`, `Without the Zener: V_out = V_in R_L ÷ (R + R_L) = ${sg(Vo)} V`] }; }
        return { ans: `The output stays at ${sg(Vz)} V. The Zener carries ${cur(Iz)} and the load ${cur(IL)}.`, work: [`I_in = (V_in − V_z) ÷ R = (${sg(Vin)} − ${sg(Vz)}) ÷ ${sg(R)} = ${cur(Iin)}`, `I_L = V_z ÷ R_L = ${sg(Vz)} ÷ ${sg(RL)} = ${cur(IL)}`, `I_z = I_in − I_L = ${cur(Iz)}`, `Zener power = V_z I_z = ${sg(Vz * Iz * 1000)} mW`] };
      } },
    { id: 'vt', label: 'Thermal voltage V_T = kT/e', fields: [tF], tip: 'About 26 mV at room temperature. T must be in kelvin: add 273 to the Celsius value.',
      solve: ({ T }) => ({ ans: `The thermal voltage is ${sg(KQ * T * 1000)} mV at ${sg(T)} K.`, work: ['V_T = k T ÷ e', `V_T = 8.617 × 10^−5 V/K × ${sg(T)} K = ${sg(KQ * T)} V`] }) },
    { id: 'diode', label: 'Diode current at a voltage', fields: [{ k: 'Is', label: 'Saturation current I_s', def: '10', units: [['fA', 1e-15], ['pA', 1e-12], ['nA', 1e-9], ['µA', 1e-6]], gt: 0, hint: 'Silicon is tiny (10 fA = 10⁻¹⁴ A)' }, { k: 'V', label: 'Voltage across the diode V', def: '0.7', units: [['V', 1], ['mV', 0.001]], hint: 'Negative for reverse bias' }, etaF, tF],
      tip: 'The current grows by a factor of about 10 for every 60 mV (at η = 1, room temperature). In reverse bias it only reaches −I_s.',
      solve: ({ Is, V, eta, T }) => { const VT = KQ * T, x = V / (eta * VT); if (x > 600) return { err: 'That voltage is too large for the equation to give a sensible current. Try a smaller one.' }; const I = Is * (Math.exp(x) - 1); return { ans: `The current is ${cur(I)} (${V >= 0 ? 'forward' : 'reverse'} bias).`, work: ['I = I_s (e^(V ÷ η V_T) − 1)', `V_T = k T ÷ e = ${sg(VT)} V`, `V ÷ (η V_T) = ${sgn(V)} ÷ (${sg(eta)} × ${sg(VT)}) = ${sg(x)}`, `I = ${sg(Is)} × (e^${sg(x)} − 1) = ${sg(I)} A`] }; } },
    { id: 'rd', label: 'Dynamic resistance in forward bias', fields: [{ k: 'I', label: 'Forward current I', def: '5', units: [['mA', 1e-3], ['µA', 1e-6], ['A', 1]], gt: 0 }, etaF, tF],
      tip: 'Dynamic resistance is the slope of the curve: change in V ÷ change in I, at that current. It is much smaller than V ÷ I.',
      solve: ({ I, eta, T }) => { const r = (eta * KQ * T) / I; return { ans: `The dynamic resistance is ${sg(r)} Ω.`, work: ['r_d = dV ÷ dI = η V_T ÷ I', `r_d = ${sg(eta)} × ${sg(KQ * T)} V ÷ ${sg(I)} A = ${sg(r)} Ω`] }; } },
  ],
  presets: [
    { label: 'LED on 5 V', prob: 'series', v: { Vs: '5', Vf: '2', I: '10' }, u: { I: 'mA' } },
    { label: '5.1 V Zener regulator', prob: 'zener', v: { Vin: '12', Vz: '5.1', R: '220', RL: '1' }, u: { R: 'Ω', RL: 'kΩ' } },
    { label: 'Overloaded Zener', prob: 'zener', v: { Vin: '12', Vz: '5.1', R: '220', RL: '100' }, u: { R: 'Ω', RL: 'Ω' } },
    { label: 'Thermal voltage at 300 K', prob: 'vt', v: { T: '300' } },
    { label: 'Silicon diode at 0.7 V', prob: 'diode', v: { Is: '10', V: '0.7', eta: '1', T: '300' }, u: { Is: 'fA', V: 'V' } },
  ],
};
