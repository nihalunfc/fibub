// Travelling waves for the school tool travelling-wave: y(x, t) = A sin(kx − ωt + φ), wave number, angular
// frequency, wave speed, superposition of two waves (standing waves) and beats. Plain maths, no DOM.
export const waveNumber = (lambda: number) => (2 * Math.PI) / lambda;
export const angularFreq = (T: number) => (2 * Math.PI) / T;
/** Wave speed v = ω / k = λ / T. */
export const waveSpeed = (k: number, w: number) => w / k;
/** Displacement of a travelling wave. dir = +1 moves towards +x (kx − ωt), −1 towards −x (kx + ωt). */
export const waveY = (x: number, t: number, A: number, k: number, w: number, dir = 1, phi = 0) => A * Math.sin(k * x - dir * w * t + phi);
/** Particle velocity ∂y/∂t of the same wave. */
export const particleV = (x: number, t: number, A: number, k: number, w: number, dir = 1, phi = 0) => -dir * A * w * Math.cos(k * x - dir * w * t + phi);
/** Beat frequency of two close tones. */
export const beatFreq = (f1: number, f2: number) => Math.abs(f1 - f2);
/** Two equal tones at a point: y = A sin 2πf₁t + A sin 2πf₂t, and its slowly varying envelope 2A|cos(π(f₁ − f₂)t)|. */
export const beatsY = (t: number, A: number, f1: number, f2: number) => A * Math.sin(2 * Math.PI * f1 * t) + A * Math.sin(2 * Math.PI * f2 * t);
export const beatsEnvelope = (t: number, A: number, f1: number, f2: number) => 2 * A * Math.abs(Math.cos(Math.PI * (f1 - f2) * t));
/** Nodes of the standing wave made by two equal waves going opposite ways: sin kx = 0, x = nλ/2. */
export const nodes = (lambda: number, xMax: number) => { const out: number[] = []; for (let n = 0; (n * lambda) / 2 <= xMax + 1e-9; n++) out.push((n * lambda) / 2); return out; };
