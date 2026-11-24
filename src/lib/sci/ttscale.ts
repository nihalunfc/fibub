// Terrestrial Time from UTC, for Julian dates that feed ephemerides.
//
// TT = TAI + 32.184 s exactly, and TAI − UTC is a whole number of leap seconds, so TT − UTC is known
// exactly for any past date. A predicted-dT polynomial (TT − UT1) is not the same thing: it can be
// several seconds out, which is enough to spoil a barycentric Julian date. Use this instead.
//
// The table is the IERS list of leap seconds: each entry is the UTC date a new value of TAI − UTC
// began. No leap second has been inserted since 2017-01-01, and the IERS has announced none; if one
// is announced, add a line.
const LEAPS: [number, number][] = [
  [Date.UTC(1972, 0, 1), 10], [Date.UTC(1972, 6, 1), 11], [Date.UTC(1973, 0, 1), 12],
  [Date.UTC(1974, 0, 1), 13], [Date.UTC(1975, 0, 1), 14], [Date.UTC(1976, 0, 1), 15],
  [Date.UTC(1977, 0, 1), 16], [Date.UTC(1978, 0, 1), 17], [Date.UTC(1979, 0, 1), 18],
  [Date.UTC(1980, 0, 1), 19], [Date.UTC(1981, 6, 1), 20], [Date.UTC(1982, 6, 1), 21],
  [Date.UTC(1983, 6, 1), 22], [Date.UTC(1985, 6, 1), 23], [Date.UTC(1988, 0, 1), 24],
  [Date.UTC(1990, 0, 1), 25], [Date.UTC(1991, 0, 1), 26], [Date.UTC(1992, 6, 1), 27],
  [Date.UTC(1993, 6, 1), 28], [Date.UTC(1994, 6, 1), 29], [Date.UTC(1996, 0, 1), 30],
  [Date.UTC(1997, 6, 1), 31], [Date.UTC(1999, 0, 1), 32], [Date.UTC(2006, 0, 1), 33],
  [Date.UTC(2009, 0, 1), 34], [Date.UTC(2012, 6, 1), 35], [Date.UTC(2015, 6, 1), 36],
  [Date.UTC(2017, 0, 1), 37],
];

/** TAI − UTC in whole seconds at this moment. Before 1972 the offset was fractional and drifting;
 *  this returns the 1972 value of 10 s, which is the best whole-second answer the table can give. */
export function taiMinusUtc(d: Date | number): number {
  const ms = typeof d === 'number' ? d : d.getTime();
  let s = LEAPS[0][1];
  for (const [t, v] of LEAPS) if (ms >= t) s = v;
  return s;
}

/** TT − UTC in seconds (TAI − UTC plus the fixed 32.184 s between TAI and TT). 69.184 s today. */
export function ttMinusUtc(d: Date | number): number {
  return taiMinusUtc(d) + 32.184;
}

/** True for a date the leap-second table covers exactly (1972 onwards, and not past its last entry
 *  by so long that a new leap second could have been inserted without this table knowing). */
export function leapsKnown(d: Date | number, horizonYears = 1): boolean {
  const ms = typeof d === 'number' ? d : d.getTime();
  return ms >= LEAPS[0][0] && ms <= Date.now() + horizonYears * 365.25 * 864e5;
}
