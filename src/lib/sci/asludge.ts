// Activated sludge (complete-mix, steady state, carbon removal only): effluent soluble BOD from Monod kinetics, sludge
// production with endogenous decay and cell debris, aeration tank volume from SRT and MLSS, F/M, oxygen demand, air
// flow and return/waste sludge flows. Textbook mass balances; the kinetic coefficients are user inputs. No DOM.

export type AsIn = {
  Q: number;      // m³/d
  S0: number;     // influent BOD, mg/L
  srt: number;    // d
  mlss: number;   // mg/L (TSS)
  Y: number;      // g VSS / g BOD
  kd: number;     // 1/d
  fd: number;     // fraction of decayed biomass left as debris
  mumax: number;  // 1/d
  Ks: number;     // mg/L BOD
  nbVSS: number;  // influent non-biodegradable VSS, mg/L
  iTSS: number;   // influent inert inorganic solids, mg/L
  vssRatio: number; // VSS/TSS of the biomass
  bcodRatio: number; // bCOD per BOD
  ote: number;    // field oxygen transfer efficiency, 0–1
  Xr: number;     // return sludge, mg/L TSS
};

/** Effluent soluble BOD (mg/L) at a given SRT; Infinity when the SRT is too short for the biomass to stay (washout). */
export function effluentS(p: Pick<AsIn, 'srt' | 'mumax' | 'kd' | 'Ks'>) {
  const d = p.srt * (p.mumax - p.kd) - 1;
  return d > 0 ? (p.Ks * (1 + p.kd * p.srt)) / d : Infinity;
}
/** Shortest SRT before washout (influent BOD S0). */
export const minSrt = (p: Pick<AsIn, 'mumax' | 'kd' | 'Ks' | 'S0'>) => 1 / ((p.mumax * p.S0) / (p.Ks + p.S0) - p.kd);

export function size(p: AsIn) {
  const S = Math.min(p.S0, effluentS(p)), removed = (p.Q * (p.S0 - S)) / 1000; // kg BOD/d
  const bio = (p.Y * removed) / (1 + p.kd * p.srt), debris = p.fd * p.kd * bio * p.srt; // kg VSS/d
  const pxVSS = bio + debris + (p.Q * p.nbVSS) / 1000, pxTSS = (bio + debris) / p.vssRatio + (p.Q * p.nbVSS) / 1000 + (p.Q * p.iTSS) / 1000;
  const V = (pxTSS * p.srt * 1000) / p.mlss, hrt = (V / p.Q) * 24; // m³, h
  const mlvss = (p.mlss * pxVSS) / pxTSS, fm = (p.Q * p.S0) / (V * mlvss);
  const o2 = removed * p.bcodRatio - 1.42 * (bio + debris); // kg O2/d
  const airM3d = o2 / (0.232 * 1.204 * p.ote), airM3min = airM3d / 1440; // air at 20 °C, 1 atm
  const R = p.mlss / (p.Xr - p.mlss), Qw = (pxTSS * 1000) / p.Xr; // recycle ratio; waste flow m³/d (from the return line, no effluent solids)
  return { S, removed, bio, debris, pxVSS, pxTSS, V, hrt, mlvss, fm, olr: (p.Q * p.S0) / 1000 / V, o2, airM3d, airM3min, R, Qw, yobs: pxVSS / removed };
}
