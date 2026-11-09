// #896 Wind chill, heat index, humidex and apparent temperature. Checked against MetPy 1.7.1 on 3000 random
// weather states: wind chill and its valid range identical (diff < 1e-13); heat index identical wherever MetPy's
// threshold matches the NWS one; dew point identical to MetPy's dewpoint() with Bolton vapour pressure; NWS feels-like
// equal to MetPy apparent_temperature except 2 points on the 80 °F simple/Rothfusz boundary (NWS averages with T).
import { windChill, windChillOk, heatIndex, heatIndexOk, humidexC, dewPoint, relHum, apparentTemp, feelsLike, wcBand, hiBand, grid, range, toKmh, fromKmh, F2C, C2F } from '../../src/lib/sci/feelslike.ts';
import { heatIndexF } from '../../src/lib/sci/psychro.ts';
export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t;
  check('feels: wind chill -10 °C, 20 km/h = -17.86 (MetPy)', near(windChill(-10, 20), -17.860584344365925, 1e-9));
  check('feels: wind chill -20 °C, 30 km/h = -32.57 (MetPy)', near(windChill(-20, 30), -32.56804447632104, 1e-9));
  check('feels: NWS chart 0 °F, 15 mph is -19 °F', Math.round(C2F(windChill(F2C(0), toKmh(15, 'mph')))) === -19);
  check('feels: wind chill range: not above 10 °C or at 3 mph or less', windChillOk(10, 10) && !windChillOk(10.1, 10) && !windChillOk(-5, toKmh(3, 'mph')) && windChillOk(-5, 4.9));
  check('feels: heat index 30 °C, 70 % = 35.04 (MetPy)', near(heatIndex(30, 70).c, 35.03801756, 1e-6) && heatIndex(30, 70).method === 'rothfusz');
  check('feels: heat index 35 °C, 50 % = 40.68 (MetPy)', near(heatIndex(35, 50).c, 40.67542894, 1e-6));
  check('feels: NWS chart 90 °F, 60 % is 100 °F', Math.round(heatIndex(F2C(90), 60).f) === 100);
  check('feels: same heat index as the psychrometric calculator', near(heatIndex(31, 40).f, heatIndexF(C2F(31), 40), 1e-12));
  check('feels: dry and humid adjustments used', heatIndex(F2C(100), 10).method === 'dry' && heatIndex(F2C(84), 90).method === 'humid' && heatIndex(20, 50).method === 'simple');
  check('feels: heat index from 80 °F', heatIndexOk(F2C(80)) && !heatIndexOk(26.6));
  check('feels: humidex 30 °C, dew point 15 °C = 34.0 (Environment Canada formula)', near(humidexC(30, 15), 33.97, 0.01));
  check('feels: dew point and RH are inverses (Bolton)', near(relHum(25, dewPoint(25, 60)), 60, 1e-9) && near(dewPoint(20, 100), 20, 1e-9));
  const e = 0.5 * 6.105 * Math.exp((17.27 * 25) / (237.7 + 25));
  check('feels: apparent temperature 25 °C, 50 %, 3 m/s (BoM formula)', near(apparentTemp(25, 50, 10.8), 25 + 0.33 * e - 2.1 - 4, 1e-9) && near(apparentTemp(25, 50, 10.8), 24.11, 0.01));
  check('feels: NWS feels like picks the index', feelsLike(-10, 50, 20).from === 'wind chill' && feelsLike(32, 50, 5).from === 'heat index' && feelsLike(20, 50, 5).c === 20);
  check('feels: Environment Canada wind chill bands', wcBand(-5)[0] === 0 && wcBand(-27.9)[0] === 1 && wcBand(-30)[1].includes('10 to 30') && wcBand(-60)[1].includes('under 2'));
  check('feels: NWS heat bands', hiBand(F2C(95))[1].startsWith('extreme caution') && hiBand(F2C(105))[1].startsWith('danger'));
  check('feels: wind units', near(toKmh(10, 'ms'), 36) && near(fromKmh(1.852, 'kn'), 1) && near(toKmh(1, 'mph'), 1.609344));
  const g = grid('wc', [-10, 15], [3, 20]);
  check('feels: table leaves out-of-range cells empty', g[0][0] === null && near(g[0][1], -17.860584344365925, 1e-9) && g[1][1] === null);
  const h = grid('hi', [25, 30], [70]);
  check('feels: heat index table', h[0][0] === null && near(h[1][0], 35.03801756, 1e-6));
  check('feels: ranges', range(-30, 10, 5).length === 9 && range(1, 0, 1) === null && range(0, 1000, 1) === null && range(0, 1, 0) === null);
};
