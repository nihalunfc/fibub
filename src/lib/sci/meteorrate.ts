// Visible meteor rate from a shower's ZHR (IMO): HR = ZHR × sin(radiant altitude) / r^(6.5 − limiting magnitude).
export const hourlyRate = (zhr: number, r: number, lm: number, radiantAlt: number) => (radiantAlt <= 0 ? 0 : (zhr * Math.sin((radiantAlt * Math.PI) / 180)) / r ** (6.5 - lm));
