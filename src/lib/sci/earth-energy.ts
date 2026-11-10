// Earth's energy budget for school (Learn): sunlight in, some reflected (albedo), the rest warms the ground, which
// glows infrared; a one-layer atmosphere absorbs a share ε of that glow and sends half back down (the greenhouse
// effect). A teaching model with one number for the whole planet. No DOM.

export const SIGMA = 5.670374419e-8; // Stefan–Boltzmann constant, W m⁻² K⁻⁴ (CODATA 2018, exact from SI)
export const S0 = 1361;              // solar constant, W/m² (rounded)

export type Budget = {
  incoming: number;  // average sunlight on each square metre of the whole sphere, S/4
  reflected: number; // α × S/4
  absorbed: number;  // (1 − α) × S/4
  Te: number;        // temperature with no greenhouse effect, K
  Ts: number;        // surface temperature with the one-layer atmosphere, K
  surfaceIR: number; // σ Ts⁴ from the ground
  airAbsorbs: number;// ε σ Ts⁴ taken in by the air
  airDown: number;   // back-radiation from the air to the ground
  airUp: number;     // the air's glow to space
  windowIR: number;  // ground glow escaping straight to space (1 − ε) σ Ts⁴
};

/** The whole budget for a solar constant S, albedo α (0–1) and infrared absorptivity ε of the air (0–1). */
export function budget(alpha: number, eps: number, S = S0): Budget {
  const incoming = S / 4, absorbed = (1 - alpha) * incoming;
  const Te = Math.pow(absorbed / SIGMA, 0.25);
  const Ts = Te * Math.pow(2 / (2 - eps), 0.25);
  const surfaceIR = SIGMA * Ts ** 4, Ta = Ts / Math.pow(2, 0.25) * (eps > 0 ? 1 : 0);
  const airEmit = eps * SIGMA * Ta ** 4; // each side
  return { incoming, reflected: alpha * incoming, absorbed, Te, Ts, surfaceIR, airAbsorbs: eps * surfaceIR, airDown: airEmit, airUp: airEmit, windowIR: (1 - eps) * surfaceIR };
}

export const toC = (K: number) => K - 273.15;

/** The albedo that gives a chosen surface temperature (K) for a given ε. */
export function albedoFor(Ts: number, eps: number, S = S0) {
  const Te = Ts / Math.pow(2 / (2 - eps), 0.25);
  return 1 - (4 * SIGMA * Te ** 4) / S;
}
