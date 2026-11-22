// CUET (UG) Economics (domain subject, NCERT Class 12 syllabus: Introductory Macroeconomics and Indian Economic
// Development). Original questions written for fibub (never copied from past papers or books).
export default {
  id: 'cuet-economics', name: 'CUET Economics',
  exams: { cuet: 'CUET (UG)' },
  units: [
    { id: 'macro', name: 'Introductory macroeconomics', topics: [
      { id: 'national-income', name: 'National income and related aggregates' },
      { id: 'money-banking', name: 'Money and banking' },
      { id: 'income-determination', name: 'Determination of income and employment' },
      { id: 'budget', name: 'Government budget and the economy' },
      { id: 'open-economy', name: 'Balance of payments and exchange rates' },
    ] },
    { id: 'indian', name: 'Indian economic development', topics: [
      { id: 'indian-economy-1950-90', name: 'Development policies 1950 to 1990' },
      { id: 'reforms-1991', name: 'Liberalisation, privatisation and globalisation' },
      { id: 'human-capital-rural', name: 'Human capital formation and rural development' },
      { id: 'employment-environment', name: 'Employment, environment and sustainable development' },
      { id: 'india-neighbours', name: 'India and its neighbours compared' },
    ] },
  ],
};
