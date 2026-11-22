// CUET (UG) Accountancy (domain subject, NCERT Class 12 syllabus). Original questions written for fibub
// (never copied from past papers or books). Used by /learn/courses/cuet/.
export default {
  id: 'cuet-accountancy', name: 'CUET Accountancy',
  exams: { cuet: 'CUET (UG)' },
  units: [
    { id: 'partnership', name: 'Accounting for partnership firms', topics: [
      { id: 'partnership-fundamentals', name: 'Partnership fundamentals' },
      { id: 'goodwill', name: 'Goodwill' },
      { id: 'reconstitution', name: 'Change in profit-sharing ratio and admission' },
      { id: 'retirement-death', name: 'Retirement and death of a partner' },
      { id: 'dissolution', name: 'Dissolution of a partnership firm' },
    ] },
    { id: 'company', name: 'Accounting for companies', topics: [
      { id: 'share-capital', name: 'Issue and forfeiture of shares' },
      { id: 'debentures', name: 'Issue of debentures' },
    ] },
    { id: 'analysis', name: 'Analysis of financial statements', topics: [
      { id: 'financial-statements', name: 'Company financial statements and their analysis' },
      { id: 'ratios', name: 'Accounting ratios' },
      { id: 'cash-flow', name: 'Cash flow statement' },
    ] },
  ],
};
