// Battery runtime (simple energy and Peukert) and off-grid solar sizing (array, battery bank, charge controller).
// Plain maths, no DOM. Energies in Wh, powers in W, currents in A, voltages in V, efficiencies and shares 0 to 1.

export type RuntimeIn = {
  capAh: number; V: number; load: number; loadUnit: 'W' | 'A'; eff: number; dod: number; peukert: number; ratedH: number;
};
export type RuntimeOut = { E: number; Ibat: number; Pbat: number; tSimple: number; tPeukert: number; capEff: number; rateC: number };

/** Runtime in hours. Load in W is at the device, so the battery supplies W/eff; load in A is the battery current. Peukert: t = H·(C/(I·H))^k, then scaled by the usable share. */
export function runtime(x: RuntimeIn): RuntimeOut {
  const { capAh, V, load, eff, dod, peukert: k, ratedH: H } = x;
  if (!(capAh > 0)) throw new Error('Capacity must be above zero.');
  if (!(V > 0)) throw new Error('Battery voltage must be above zero.');
  if (!(load > 0)) throw new Error('The load must be above zero.');
  if (!(eff > 0 && eff <= 1)) throw new Error('Efficiency must be above 0 and at most 100 %.');
  if (!(dod > 0 && dod <= 1)) throw new Error('Usable depth of discharge must be above 0 and at most 100 %.');
  if (!(k >= 1 && k <= 2)) throw new Error('The Peukert exponent must be from 1 to 2.');
  if (!(H > 0)) throw new Error('The rated discharge time must be above zero.');
  const Pbat = x.loadUnit === 'W' ? load / eff : load * V, Ibat = Pbat / V;
  const E = capAh * V, tSimple = (capAh * dod) / Ibat;
  const tPeukert = H * (capAh / (Ibat * H)) ** k * dod;
  return { E, Ibat, Pbat, tSimple, tPeukert, capEff: (Ibat * tPeukert) / dod, rateC: Ibat / capAh };
}

export type Appliance = { name: string; W: number; h: number; n: number };
export type SolarIn = {
  loads: Appliance[]; invEff: number; psh: number; losses: number; battEff: number; days: number; dod: number;
  Vsys: number; panelW: number; battV: number; battAh: number; safety: number;
};
export type SolarOut = {
  daily: number; perLoad: number[]; dcDaily: number; arrayW: number; panels: number; installedW: number; dailyPv: number;
  bankWh: number; bankAh: number; series: number; parallel: number; batteries: number; ctrlA: number; peakW: number;
};

export function solar(x: SolarIn): SolarOut {
  if (!x.loads.length) throw new Error('List at least one appliance.');
  for (const a of x.loads) if (!(a.W >= 0 && a.h >= 0 && a.h <= 24 && a.n >= 0)) throw new Error(`"${a.name}": power and quantity must be 0 or more, and hours 0 to 24.`);
  const share = (v: number, what: string, zeroOk = false) => { if (!(zeroOk ? v >= 0 && v < 1 : v > 0 && v <= 1)) throw new Error(`${what} must be ${zeroOk ? 'from 0 to below 100' : 'above 0 and at most 100'} %.`); };
  share(x.invEff, 'Inverter efficiency'); share(x.battEff, 'Battery charge efficiency'); share(x.dod, 'Usable depth of discharge'); share(x.losses, 'System losses', true);
  if (!(x.psh > 0 && x.psh <= 12)) throw new Error('Peak sun hours must be above 0 and at most 12.');
  if (!(x.days > 0 && x.days <= 30)) throw new Error('Days of autonomy must be above 0 and at most 30.');
  if (!(x.Vsys > 0 && x.panelW > 0 && x.battV > 0 && x.battAh > 0)) throw new Error('System voltage, panel watts and battery voltage and Ah must be above zero.');
  if (!(x.safety >= 1)) throw new Error('The controller safety factor must be 1 or more.');
  const perLoad = x.loads.map((a) => a.W * a.h * a.n), daily = perLoad.reduce((s, v) => s + v, 0);
  if (!(daily > 0)) throw new Error('The daily load is zero: give some power and hours.');
  const peakW = x.loads.reduce((s, a) => s + a.W * a.n, 0);
  const dcDaily = daily / x.invEff;
  const arrayW = dcDaily / (x.psh * (1 - x.losses) * x.battEff);
  const panels = Math.ceil(arrayW / x.panelW - 1e-9), installedW = panels * x.panelW;
  const dailyPv = installedW * x.psh * (1 - x.losses) * x.battEff;
  const bankWh = (dcDaily * x.days) / x.dod, bankAh = bankWh / x.Vsys;
  const series = Math.ceil(x.Vsys / x.battV - 1e-9), parallel = Math.ceil(bankAh / x.battAh - 1e-9);
  const ctrlA = (installedW / x.Vsys) * x.safety;
  return { daily, perLoad, dcDaily, arrayW, panels, installedW, dailyPv, bankWh, bankAh, series, parallel, batteries: series * parallel, ctrlA, peakW };
}
