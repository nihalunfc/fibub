// Linear (Airy) water waves: dispersion, wavelength, celerity, group velocity, energy and power, shoaling and
// refraction to shallower water, depth-limited breaking and breaker type. No DOM.

export const G = 9.80665;

/** Wavenumber k (rad/m) solving ω² = g k tanh(k h) by Newton's method, started from Eckart's (1952) approximation. */
export function wavenumber(T: number, h: number, g = G) {
  const w = (2 * Math.PI) / T, k0 = (w * w) / g;
  if (!Number.isFinite(h) || h <= 0) return NaN;
  if (k0 * h > 30) return k0; // deep water to machine precision
  let k = k0 / Math.sqrt(Math.tanh(k0 * h));
  for (let i = 0; i < 60; i++) {
    const th = Math.tanh(k * h), f = g * k * th - w * w, df = g * th + g * k * h * (1 - th * th), dk = f / df;
    k -= dk;
    if (Math.abs(dk) < 1e-15 * k) break;
  }
  return k;
}

/** Fenton and McKee (1990) explicit approximation of the wavelength (within about 1.7 %), shown for comparison. */
export const fentonMcKee = (T: number, h: number, g = G) => ((g * T * T) / (2 * Math.PI)) * Math.tanh(Math.pow((2 * Math.PI * Math.sqrt(h / g)) / T, 1.5)) ** (2 / 3);

/** All the linear-theory properties of a wave of period T (s) and height H (m) in water of depth h (m); water density rho. */
export function wave(T: number, h: number, H = 1, rho = 1025, g = G) {
  const k = wavenumber(T, h, g), L = (2 * Math.PI) / k, w = (2 * Math.PI) / T;
  const kh = k * h, C = L / T, n = 0.5 * (1 + (kh > 350 ? 0 : (2 * kh) / Math.sinh(2 * kh))), Cg = n * C;
  const L0 = (g * T * T) / (2 * Math.PI), C0 = L0 / T;
  const E = (rho * g * H * H) / 8; // J/m² (energy per unit area)
  const ub = kh > 350 ? 0 : (Math.PI * H) / (T * Math.sinh(kh)); // near-bed orbital velocity amplitude
  const rel = h / L, regime = rel >= 0.5 ? 'deep' : rel <= 0.05 ? 'shallow' : 'intermediate';
  const hmax = 0.142 * L * Math.tanh(kh); // Miche steepness limit
  return { k, L, w, kh, C, n, Cg, L0, C0, E, P: E * Cg, ub, rel, regime, steep: H / L, hmax, ursell: (H * L * L) / (h * h * h) };
}

/**
 * Shoals and refracts a wave from (T, H1, depth h1, angle a1 to the depth contours' normal in degrees) to depth h2
 * over straight, parallel contours: H2 = H1 · Ks · Kr with Ks = √(Cg1/Cg2) and Kr = √(cos a1 / cos a2), sin a2 / C2 = sin a1 / C1.
 */
export function transform(T: number, H1: number, h1: number, h2: number, a1deg = 0, g = G) {
  const w1 = wave(T, h1, H1, 1025, g), w2 = wave(T, h2, 1, 1025, g);
  const a1 = (a1deg * Math.PI) / 180, s2 = (Math.sin(a1) * w2.C) / w1.C, a2 = Math.asin(Math.max(-1, Math.min(1, s2)));
  const Ks = Math.sqrt(w1.Cg / w2.Cg), Kr = Math.sqrt(Math.cos(a1) / Math.cos(a2));
  return { Ks, Kr, H2: H1 * Ks * Kr, a2: (a2 * 180) / Math.PI };
}

/**
 * Walks the wave shoreward from depth h1 until it breaks, i.e. H ≥ gamma · h (depth-limited, McCowan's 0.78 by
 * default) or H ≥ the Miche steepness limit. Returns the breaking depth and height (bisection to 1 mm) or null.
 */
export function breakPoint(T: number, H1: number, h1: number, a1deg = 0, gamma = 0.78, g = G) {
  const broken = (h: number) => { const t = transform(T, H1, h1, h, a1deg, g), lim = Math.min(gamma * h, wave(T, h, 1, 1025, g).hmax); return { b: t.H2 >= lim, H: t.H2, a: t.a2, by: gamma * h <= wave(T, h, 1, 1025, g).hmax ? 'depth' : 'steepness' }; };
  if (broken(h1).b) return { hb: h1, Hb: H1, ab: a1deg, by: broken(h1).by, already: true };
  let hi = h1, lo = h1;
  // March in by 2 % steps until broken, then bisect.
  for (let i = 0; i < 2000 && !broken(lo).b; i++) { hi = lo; lo *= 0.98; if (lo < 1e-4) return null; }
  for (let i = 0; i < 60 && hi - lo > 1e-4; i++) { const m = (hi + lo) / 2; if (broken(m).b) lo = m; else hi = m; }
  const r = broken(lo);
  return { hb: lo, Hb: r.H, ab: r.a, by: r.by, already: false };
}

/** Deep-water equivalent height H0' (unrefracted) from H at depth h: H / Ks where Ks is relative to deep water. */
export function deepEquivalent(T: number, H: number, h: number, g = G) {
  const w = wave(T, h, H, 1025, g);
  return H / Math.sqrt(w.C0 / 2 / w.Cg);
}

/** Iribarren number ξ0 = tan β / √(H0/L0) and the Battjes (1974) breaker type on a plane beach. */
export function iribarren(slope: number, H0: number, L0: number) {
  const xi = slope / Math.sqrt(H0 / L0);
  return { xi, type: xi < 0.5 ? 'spilling' : xi < 3.3 ? 'plunging' : 'surging or collapsing' };
}
