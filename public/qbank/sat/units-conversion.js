// SAT Math · Problem-solving and data analysis · units, unit rates and density. Original (fibub).
import { int, choose, fmt, steps } from './_util.js';
const F = { section: 'math', domain: 'data' };

export default {
  topic: 'units-conversion',
  gens: [
    { id: 'sat-uc-g01', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'chain of factors', facets: F, format: 'numeric',
      make(r) {
        const mph = int(r, 3, 15) * 6; // miles per hour, so feet per second is clean when × 22/15
        const fps = (mph * 5280) / 3600;
        return { q: `<p>A cyclist rides at ${mph} miles per hour. What is this speed in feet per second? (1 mile = 5,280 feet)</p>`, answer: fps, tol: 0.05, mph,
          sol: steps(`Miles to feet: × 5,280. Hours to seconds: ÷ 3,600.`, `${mph} × 5,280 ÷ 3,600 = <b>${fmt(fps, 4)}</b> feet per second.`), trap: 'Multiplying by 3,600 instead of dividing: a speed per second must be a smaller number than the same speed per hour.' };
      },
      verify: (p) => (p.mph * 5280) / 3600 },
    { id: 'sat-uc-g02', type: 'nat', marks: 1, level: 2, exams: ['sat'], sub: 'unit rate', facets: F, format: 'numeric',
      make(r) {
        const rate = int(r, 2, 12), h = choose(r, [1.5, 2, 2.5, 3, 4]), mins = int(r, 2, 9) * 10;
        const units = choose(r, [['pages', 'prints'], ['boxes', 'packs'], ['bottles', 'fills']]);
        return { q: `<p>A machine ${units[1]} ${rate} ${units[0]} per minute. How many ${units[0]} does it ${units[1].replace(/s$/, '')} in ${mins} minutes?</p>`, answer: rate * mins, tol: 0, rate, mins,
          sol: steps(`${rate} per minute × ${mins} minutes = <b>${rate * mins}</b>.`), h };
      },
      verify: (p) => p.rate * p.mins },
    { id: 'sat-uc-g03', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'density', facets: F, format: 'numeric',
      make(r) {
        const d = choose(r, [0.8, 1.2, 2.5, 2.7, 7.8, 8.9, 11.3]), side = int(r, 2, 6), m = +(d * side ** 3).toFixed(4);
        return { q: `<p>A solid cube has edges ${side} centimetres long and a mass of ${fmt(m)} grams. What is its density, in grams per cubic centimetre?</p>`, answer: d, tol: 0.005, m, side,
          sol: steps(`Volume: ${side}<sup>3</sup> = ${side ** 3} cm<sup>3</sup>.`, `Density = mass ÷ volume = ${fmt(m)} ÷ ${side ** 3} = <b>${fmt(d)}</b> g/cm<sup>3</sup>.`), trap: 'Dividing by the edge length or the area of one face instead of the volume.' };
      },
      verify: (p) => p.m / p.side ** 3 },
    { id: 'sat-uc-g04', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'area units', facets: F, format: 'numeric',
      make(r) {
        const a = int(r, 2, 12), b = int(r, 2, 12);
        return { q: `<p>A rug measures ${a} feet by ${b} feet. What is its area in square inches? (1 foot = 12 inches)</p>`, answer: a * b * 144, tol: 0, a, b,
          sol: steps(`In inches the rug is ${a * 12} by ${b * 12}.`, `Area: ${a * 12} × ${b * 12} = <b>${(a * b * 144).toLocaleString('en-US')}</b> square inches. (One square foot is 12 × 12 = 144 square inches.)`), trap: `Multiplying the area in square feet by 12 instead of 144 (gives ${a * b * 12}).` };
      },
      verify: (p) => p.a * 12 * p.b * 12 },
    { id: 'sat-uc-g05', type: 'nat', marks: 1, level: 3, exams: ['sat'], sub: 'fuel rate', facets: F, format: 'numeric',
      make(r) {
        const mpg = int(r, 20, 45), gal = int(r, 2, 15), price = choose(r, [3, 3.5, 4, 4.5]), miles = mpg * gal;
        return { q: `<p>A car travels ${mpg} miles per gallon of gas, and gas costs &#36;${fmt(price)} per gallon. How much, in dollars, does the gas cost for a ${miles}-mile trip?</p>`, answer: gal * price, tol: 0.005, mpg, miles, price,
          sol: steps(`Gallons used: ${miles} ÷ ${mpg} = ${gal}.`, `Cost: ${gal} × ${fmt(price)} = <b>${fmt(gal * price)}</b> dollars.`) };
      },
      verify: (p) => (p.miles / p.mpg) * p.price },
  ],
  items: [
    { id: 'sat-uc-001', type: 'mcq', marks: 1, level: 3, exams: ['sat'], sub: 'cubic units', facets: F,
      q: '<p>A tank holds 2 cubic metres of water. How many litres is that? (1 litre = 1,000 cubic centimetres, and 1 metre = 100 centimetres.)</p>',
      options: ['2,000', '200', '20,000', '2,000,000'], answer: 0,
      sol: '<p>1 cubic metre = 100 × 100 × 100 = 1,000,000 cm<sup>3</sup> = 1,000 litres. So 2 cubic metres = <b>2,000</b> litres.</p>' },
  ],
};
