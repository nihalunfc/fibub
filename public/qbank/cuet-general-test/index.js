// CUET (UG) General Test: numerical ability, reasoning and general awareness. Original questions written for
// fibub (never copied from past papers). Used by /learn/courses/cuet/.
export default {
  id: 'cuet-general-test', name: 'CUET General Test',
  exams: { cuet: 'CUET (UG)' },
  units: [
    { id: 'numerical', name: 'Numerical ability', topics: [
      { id: 'number-system', name: 'Numbers, HCF and LCM' },
      { id: 'percentages', name: 'Percentages' },
      { id: 'ratio-proportion', name: 'Ratio and proportion' },
      { id: 'profit-loss', name: 'Profit, loss and discount' },
      { id: 'interest', name: 'Simple and compound interest' },
      { id: 'averages-mixtures', name: 'Averages and mixtures' },
      { id: 'time-work', name: 'Time and work' },
      { id: 'speed-distance', name: 'Speed, distance and time' },
      { id: 'mensuration', name: 'Mensuration' },
      { id: 'data-interpretation', name: 'Data interpretation' },
    ] },
    { id: 'reasoning', name: 'Logical and analytical reasoning', topics: [
      { id: 'series', name: 'Number and letter series' },
      { id: 'analogy-odd-one-out', name: 'Analogy and odd one out' },
      { id: 'coding-decoding', name: 'Coding and decoding' },
      { id: 'blood-relations', name: 'Blood relations' },
      { id: 'directions', name: 'Directions and distance' },
      { id: 'syllogisms', name: 'Syllogisms' },
      { id: 'seating-arrangement', name: 'Seating and order' },
      { id: 'clocks-calendars', name: 'Clocks and calendars' },
    ] },
    { id: 'awareness', name: 'General awareness', topics: [
      { id: 'ga-polity', name: 'Indian Constitution and polity' },
      { id: 'ga-geography', name: 'Geography of India and the world' },
      { id: 'ga-science', name: 'Everyday science' },
      { id: 'ga-history-economy', name: 'History, culture and economy' },
    ] },
  ],
};
