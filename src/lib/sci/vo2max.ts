// VO2max (mL/kg/min) estimated from field tests. Plain maths, no DOM. Each formula as published (see guide).

/** Cooper (1968) 12-minute run: distance in metres. */
export const cooper = (metres: number) => (metres - 504.9) / 44.73;

/** 1.5-mile (2.4 km) run: time in minutes. VO2max = 3.5 + 483 / t. */
export const mile15 = (minutes: number) => 3.5 + 483 / minutes;

/** Rockport 1-mile walk (Kline et al. 1987): weight in kg (converted to lb), age in years, male true/false, time in minutes, heart rate at the end in beats/min. */
export function rockport(kg: number, age: number, male: boolean, minutes: number, hr: number): number {
  const lb = kg / 0.45359237;
  return 132.853 - 0.0769 * lb - 0.3877 * age + 6.315 * (male ? 1 : 0) - 3.2649 * minutes - 0.1565 * hr;
}

/** Léger et al. (1988) 20 m shuttle run, 1-minute stages starting at 8.5 km/h, +0.5 km/h each stage. */
export const shuttleSpeed = (stage: number) => 8 + 0.5 * stage;
/** Children and teenagers (6–18 years): speed in km/h, age in years. */
export const legerChild = (speed: number, age: number) => 31.025 + 3.238 * speed - 3.248 * age + 0.1536 * speed * age;
/** Adults (18 and over): speed in km/h. */
export const legerAdult = (speed: number) => -24.4 + 6.0 * speed;

/** Queens College step test (McArdle et al. 1972): recovery heart rate in beats/min. */
export const queens = (hr: number, male: boolean) => (male ? 111.33 - 0.42 * hr : 65.81 - 0.1847 * hr);

/** Uth et al. (2004) heart rate ratio method. */
export const uth = (hrMax: number, hrRest: number) => 15.3 * (hrMax / hrRest);

/** Minutes from "11:40", "11.5" or "11 40". */
export function parseMinutes(s: string): number {
  const t = s.trim().replace(',', '.');
  const m = t.match(/^(\d+)\s*[:' ]\s*(\d{1,2}(?:\.\d+)?)"?$/);
  if (m) { const sec = Number(m[2]); return sec < 60 ? Number(m[1]) + sec / 60 : NaN; }
  return /^\d+(\.\d+)?$/.test(t) ? Number(t) : NaN;
}

/** VO2max in METs (1 MET = 3.5 mL/kg/min) and absolute L/min for a body mass. */
export const mets = (vo2: number) => vo2 / 3.5;
export const litres = (vo2: number, kg: number) => (vo2 * kg) / 1000;
