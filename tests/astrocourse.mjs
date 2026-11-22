// Checks for the astronomy course maths (src/lib/astrocourse/) against worked examples in the lessons and
// published values. Run with `node tests/astrocourse.mjs` (Node 22+ strips the TypeScript types itself).
import * as S from '../src/lib/astrocourse/sky.ts';
import * as O from '../src/lib/astrocourse/optics.ts';
import * as P from '../src/lib/astrocourse/physics.ts';

let fails = 0, n = 0;
const near = (got, want, tol, what) => { n++; if (!(Math.abs(got - want) <= tol)) { fails++; console.error(`✗ ${what}: got ${got}, want ${want}`); } };
const ok = (cond, what) => { n++; if (!cond) { fails++; console.error(`✗ ${what}`); } };

// 1.1/1.2: the pole stands at your latitude; a star on the meridian (H = 0) is at 90 − |lat − dec|.
near(S.altAz(0, 90, 43).alt, 43, 1e-9, 'pole altitude = latitude');
near(S.altAz(0, 20, 43).alt, 67, 1e-9, 'meridian altitude');
near(S.altAz(0, 20, 43).az, 180, 1e-9, 'dec < lat transits due south');
near(S.altAz(90, 0, 43).alt, 0, 1e-9, 'equator star sets at H = 6 h');
near(S.altAz(90, 0, 43).az, 270, 1e-9, '... in the west');
ok(S.visibility(60, 43) === 'circumpolar' && S.visibility(-50, 43) === 'never rises' && S.visibility(0, 43) === 'rises and sets', 'visibility');
near(S.hoursUp(0, 43), 12, 1e-9, 'equator star 12 h up');
// 1.3: noon Sun at 43° N: summer solstice 90 − 43 + 23.44 = 70.44°, winter 23.56°.
near(S.noonAlt(23.44, 43), 70.44, 1e-9, 'summer noon'); near(S.noonAlt(-23.44, 43), 23.56, 1e-9, 'winter noon');
near(S.sunDec(172), 23.44, 0.1, 'June solstice dec'); near(S.sunDec(355), -23.44, 0.1, 'December solstice dec');
near(S.dayLength(23.44, 43), 15.15, 0.05, 'day length 43N June (no refraction)');
near(S.dayLength(23.44, 70), 24, 1e-9, 'midnight sun');
// 1.4: lit fraction; synodic month from sidereal month and year.
near(S.litFraction(90), 0.5, 1e-12, 'quarter Moon half lit');
near(S.synodic(S.SIDEREAL_MONTH, 365.256363), S.SYNODIC_MONTH, 0.001, 'synodic month');
// 1.5: Mars synodic period about 780 days.
near(S.synodic(365.256, 686.98), 779.9, 0.5, 'Mars synodic');
// 1.7: 5 magnitudes = 100×; 1 mag ≈ 2.512×; two equal stars combine 0.753 mag brighter.
near(S.fluxRatio(5), 100, 1e-9, '5 mag'); near(S.fluxRatio(1), 2.512, 0.001, '1 mag');
near(S.combinedMag(3, 3), 3 - 0.7526, 0.001, 'combined mag');
// 2.4: Meeus example 7.a: 1957 Oct 4.81 = JD 2436116.31; J2000.0 = 2451545.0.
near(S.julianDate(1957, 10, 4, 0.81 * 24), 2436116.31, 1e-6, 'Sputnik JD');
near(S.julianDate(2000, 1, 1, 12), 2451545.0, 1e-9, 'J2000');
near(S.mjd(2451545), 51544.5, 1e-9, 'MJD');
// 2.3: Meeus example 12.a: 1987 April 10, 0h UT, GMST = 13h10m46.3668s.
near(S.gmst(S.julianDate(1987, 4, 10)) * 3600, 13 * 3600 + 10 * 60 + 46.3668, 0.01, 'GMST Meeus 12.a');
near(24 - S.SIDEREAL_DAY_H, 3 / 60 + 56 / 3600, 0.0002, 'sidereal day 3m56s short');
// 2.5: ecliptic round trip; precession period ~25,770 years; pole is near Vega around year 14000.
const e = S.toEcliptic(18.6, 38.8), b = S.fromEcliptic(e.lam, e.beta);
near(b.ra, 18.6, 1e-9, 'ecliptic round trip RA'); near(b.dec, 38.8, 1e-9, 'ecliptic round trip dec');
near(S.precessionPeriod(), 25770, 30, 'precession period');
near(S.poleAt(2000).dec, 90, 1e-6, 'pole at J2000');
ok(S.separation(S.poleAt(14000).ra, S.poleAt(14000).dec, 18.6156, 38.78) < 7, 'pole near Vega in 14000 AD');
ok(S.separation(S.poleAt(-2700).ra, S.poleAt(-2700).dec, 14.073, 64.376) < 2, 'pole near Thuban about 2700 BC');
// 2.6: airmass 2 at 30°, Kasten-Young about 38 at the horizon.
near(S.airmassSec(30), 2, 1e-12, 'sec z at 30'); near(S.airmassKY(90), 1, 0.001, 'KY zenith'); near(S.airmassKY(0), 38, 0.2, 'KY horizon');
near(S.extincted(5, 0.2, 2), 5.4, 1e-12, 'extinction');
// 3.2/3.3: dark site SQM 21.7 gives about 6.5-6.6; 1″ seeing is r0 about 11 cm; 100 mm Rayleigh about 1.38″.
near(S.nelm(21.7), 6.55, 0.15, 'NELM dark site'); ok(S.nelm(18) < 5, 'NELM city');
near(S.seeingArcsec(0.111), 1.0, 0.02, 'seeing from r0'); near(S.rayleighArcsec(0.1), 1.384, 0.002, 'Rayleigh 100 mm');
near(S.walker(1, 10) / S.walker(1, 20), 2 ** 2.5, 1e-9, 'Walker');
// 3.4: dark hours 43 N at the equinox about 8.7 h; 55 N in June never fully dark.
near(S.darkHours(0, 43), 8.67, 0.05, 'equinox darkness'); ok(S.darkHours(23.44, 55) === 0, 'no darkness 55N June');

// ---- Modules 4-6
// 4.1: object at 2f images at 2f; at infinity images at f.
near(O.imageDistance(100, 200), 200, 1e-9, '2f'); near(O.imageDistance(100, 1e12), 100, 1e-6, 'infinity');
// 4.2: 200 mm vs 7 mm pupil: 816×, about 7.3 mag deeper.
near(O.lightGrasp(200), 816.3, 0.1, 'light grasp'); near(O.scopeLimit(200) - 6.5, 7.28, 0.01, 'limit gain');
// 4.3: 1200 mm with 25 mm eyepiece = 48×, 150 mm aperture → exit pupil 3.1 mm; 52° AFOV → 1.08° field.
near(O.magnification(1200, 25), 48, 1e-12, 'mag'); near(O.exitPupil(150, 48), 3.125, 1e-12, 'exit pupil'); near(O.trueField(52, 48), 1.0833, 1e-4, 'true field');
// 4.4: Dawson 116/D, Rayleigh 1.38″ at 100 mm; Airy first dark ring at the Rayleigh angle.
near(O.dawson(100), 1.16, 1e-12, 'Dawson'); near(O.rayleigh(100), 1.384, 0.002, 'Rayleigh');
near(O.airy(O.rayleigh(100), 100), 0, 1e-5, 'Airy first zero'); near(O.besselJ1(1), 0.4400506, 1e-6, 'J1(1)'); near(O.besselJ1(10), 0.0434727, 1e-5, 'J1(10)');
// 4.6: 5′ polar error drifts about 1.3″ per minute.
near(O.polarDrift(5, 60), 1.31, 0.01, 'polar drift');
// 5.1: Jupiter 142,984 km at 4.2 AU looks about 47″.
near(O.angularSize(142984, 4.2 * 149597870.7), 46.9, 0.2, 'Jupiter size');
// 5.2: magnitude 9 over 10′ × 10′ circle-ish ellipse.
near(O.surfaceBrightness(9, 10, 10), 9 + 2.5 * Math.log10(Math.PI * 300 * 300), 1e-9, 'surface brightness');
// 5.4: V halfway-ish: 3 steps from 5.2, 1 step from 6.0 → 5.8.
near(O.fractionalEstimate(5.2, 6.0, 3, 1), 5.8, 1e-12, 'fractional estimate');
// 5.5: 30 meteors in 1 h, lm 6.5, radiant at 90° → ZHR 30; radiant at 30° → 60.
near(O.zhr(30, 1, 6.5, 90), 30, 1e-9, 'ZHR zenith'); near(O.zhr(30, 1, 6.5, 30), 60, 1e-9, 'ZHR 30°'); near(O.zhr(30, 1, 5.5, 90), 75, 1e-9, 'ZHR lm 5.5');
// 5.6: at perigee (~363,300 km) the Moon can cover the Sun; at apogee (~405,500 km) it can't. Umbra about 374,000 km long.
ok(O.eclipseType(363300).total && !O.eclipseType(405500).total, 'total vs annular'); near(O.eclipseType(384400).umbraLen, 374000, 2000, 'umbra length');
// 6.1: 3.76 µm at 400 mm → 1.94″/px; full-frame 36 mm at 50 mm → 39.6°.
near(O.imageScale(3.76, 400), 1.939, 0.002, 'image scale'); near(O.fieldDeg(36, 50), 39.6, 0.1, 'field');
// 6.2: pure shot noise: 10,000 e⁻ → SNR 100; four frames double SNR.
near(O.snr(100, 0, 100), 100, 1e-9, 'shot noise'); near(O.snr(10, 20, 60, 5, 20, 0, 4) / O.snr(10, 20, 60, 5, 20, 0, 1), 2, 1e-9, 'stack √N');
// 6.5: 500 rule at 24 mm full frame ≈ 20.8 s; NPF f/2.8, 4 µm, 24 mm ≈ 9.1 s.
near(O.rule500(24), 20.83, 0.01, '500 rule'); near(O.npfRule(2.8, 4, 24), 9.083, 0.01, 'NPF');
near(O.trailArcsec(60, 0), 902.5, 0.1, 'trail 1 min equator');
// 6.6: 3° × 2° target with 1.5° × 1° field and 15 % overlap → 3 × 3 panels.
const mp = O.mosaicPanels(3, 2, 1.5, 1, 0.15); ok(mp.cols === 3 && mp.rows === 3, 'mosaic panels');
// 6.3: calibration removes dark and flat: light = 0.5 × 200 + 30, dark 30, flat 0.5 × mean 1000.
near(O.calibrate(130, 30, 520, 20, 1000), 200, 1e-9, 'calibrate');
near(O.stretch.asinh(1), 1, 1e-12, 'asinh stretch top'); near(O.stretch.linear(0.5, 0.25, 0.75), 0.5, 1e-12, 'linear stretch');

// ---- Modules 7-8
// 7.2: Sun's peak near 502 nm; Sun's luminosity from IAU radius and temperature ≈ 3.828e26 W.
near(P.wienPeak(P.TSUN) * 1e9, 502.0, 0.2, 'Wien Sun'); near(P.luminosity(P.RSUN, P.TSUN) / P.LSUN, 1, 0.001, 'Stefan-Boltzmann Sun');
near(P.radiusFrom(P.LSUN, P.TSUN) / P.RSUN, 1, 0.001, 'radius from L, T');
// Planck integrates to σT⁴/π: crude sum check.
{ let s = 0; for (let l = 10e-9; l < 200e-6; l *= 1.002) s += P.planck(l, 5772) * l * 0.002; near(s * Math.PI / (P.SIGMA * 5772 ** 4), 1, 0.003, 'Planck integral'); }
ok(P.bbColour(3000)[2] < P.bbColour(10000)[2], 'hot is bluer');
// 7.3: H-alpha 656.47 nm in vacuum (656.28 in air), H-beta 486.27 vacuum; Lyman alpha 121.57 nm; ground level −13.6 eV.
near(P.hydrogenLine(2, 3) * 1e9, 656.47, 0.02, 'H-alpha vacuum'); near(P.hydrogenLine(2, 4) * 1e9, 486.27, 0.02, 'H-beta'); near(P.hydrogenLine(1, 2) * 1e9, 121.57, 0.01, 'Lyman alpha');
near(P.hydrogenLevel(1), -13.6057, 1e-4, 'ground level');
// 7.4: 656.3 → 656.8 nm is about 228 km/s away; relativistic z = 1 → 0.6 c.
near(P.dopplerVelocity(656.8, 656.3) / 1e3, 228.4, 0.1, 'Doppler'); near(P.relativisticVelocity(1) / P.C, 0.6, 1e-12, 'relativistic z=1');
near(P.shifted(500, 0.6 * P.C), 1000, 1e-9, 'shift 0.6c doubles');
// 7.5: solar constant ≈ 1361 W/m²; 100 pc → m − M = 5; Sun at 10 pc is about magnitude 4.8.
near(P.flux(P.LSUN, P.AU), 1361, 1, 'solar constant'); near(P.distanceModulus(100), 5, 1e-12, 'mu 100 pc'); near(P.distanceFromModulus(10), 1000, 1e-9, 'd from mu');
// 7.6: 21 cm on a 100 m dish ≈ 8.8′; 1″ at 21 cm needs about 53 km.
near(P.resolutionArcsec(0.21, 100) / 60, 8.81, 0.02, 'radio resolution'); near(1.22 * 0.21 / (1 / 206264.806) / 1000, 52.8, 0.1, '1″ baseline');
// 8.1: Mars at 1.524 AU ≈ 1.881 yr; Jupiter 5.2 AU ≈ 11.86 yr.
near(P.periodYears(1.5237), 1.8808, 0.001, 'Kepler Mars'); near(P.semiMajorAU(11.862), 5.2044, 0.005, 'Kepler Jupiter (planet mass ignored)');
// 8.2: Earth's orbital speed ≈ 29.78 km/s; LEO 400 km ≈ 7.67 km/s; escape from Earth ≈ 11.19 km/s.
near(P.circularSpeed(P.GM_SUN, P.AU) / 1e3, 29.78, 0.01, 'Earth orbital speed'); near(P.circularSpeed(P.GM_EARTH, P.R_EARTH + 400e3) / 1e3, 7.67, 0.01, 'LEO');
near(P.escapeSpeed(P.GM_EARTH, P.R_EARTH) / 1e3, 11.18, 0.01, 'escape');
// 8.3: Kepler equation, Meeus example 30.a: e = 0.1, M = 5° → E = 5.554589°.
near(P.keplerE(5 * Math.PI / 180, 0.1) * 180 / Math.PI, 5.554589, 1e-6, 'Kepler equation');
{ const o = P.orbitPos(0, 0.5); near(o.r, 0.5, 1e-12, 'perihelion r = a(1−e)'); const q2 = P.toEclipticXYZ(1, 0, 0, 0, 0); ok(q2[0] === 1 && q2[2] === 0, 'no rotation'); const t = P.toEclipticXYZ(0, 1, 90, 0, 0); near(t[2], 1, 1e-12, 'inclined 90 points up'); }
// 8.4: Earth → Mars Hohmann ≈ 5.6 km/s total (heliocentric burns), 259 days; LEO → GEO ≈ 3.9 km/s.
{ const h1 = P.hohmann(P.GM_SUN, P.AU, 1.5237 * P.AU); near(h1.time / 86400, 258.9, 1, 'Hohmann time Earth-Mars'); near(h1.total / 1e3, 5.59, 0.03, 'Hohmann dv Earth-Mars');
  const h2 = P.hohmann(P.GM_EARTH, P.R_EARTH + 300e3, 42164e3); near(h2.total / 1e3, 3.89, 0.03, 'LEO to GEO'); }
near(P.rocketDv(3000, Math.E, 1), 3000, 1e-9, 'rocket eq'); near(P.massRatio(9400, 3500), Math.exp(9400 / 3500), 1e-12, 'mass ratio');
// 8.5: Earth density ≈ 5514 kg/m³ (mass 5.972e24 kg, mean radius 6371 km); Earth's equilibrium temperature ≈ 255 K.
near(P.density(5.972e24, 6.371e6), 5513, 3, 'Earth density'); near(P.eqTemp(1, 0.306), 254, 1.5, 'Earth eq temp');
// Module 9
near(P.parallaxDistance(0.1), 10, 1e-9, 'parallax 0.1" = 10 pc');
near(P.msLifetime(1), 1e10, 1, 'Sun lifetime 10 Gyr');
ok(P.msLifetime(10) < 1e8, '10 Msun lives < 100 Myr');
near(P.schwarzschild(P.MSUN) / 1000, 2.95, 0.01, 'Schwarzschild radius of the Sun ~2.95 km');
near(P.cepheidMv(10), -4.05, 1e-9, 'Cepheid 10 d M_V = -4.05');
near(P.binaryMass(19.8, 50.1), 3.09, 0.01, 'Sirius A+B mass from a=19.8 AU, P=50.1 yr');

console.log(fails ? `astrocourse: ${fails} of ${n} checks failed` : `astrocourse: all ${n} checks passed`);
if (fails) process.exit(1);
