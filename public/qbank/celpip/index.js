// CELPIP question bank (fibub, original practice material; nothing is copied from the official test or its practice material).
// Used by the CELPIP course (/learn/courses/celpip/) and its practice room. Made from the lesson drill sets in public/learn-kit/celpip/sets/
// by scripts/courses/sets-to-qbank.mjs. Levels: 1 about CLB 5, 2 about CLB 6, 3 about CLB 7, 4 about CLB 9, 5 about CLB 10 and above.
export default {
  id: "celpip", name: "CELPIP practice",
  exams: {general:'CELPIP-General',ls:'CELPIP-General LS'},
  facets: {
    skill: { label: 'Skill', values: {listening:'Listening',reading:'Reading',writing:'Writing',speaking:'Speaking',test:'The test, scores and test week'} },
    part: { label: "Part or task", values: {1:"Part or task 1",2:"Part or task 2",3:"Part or task 3",4:"Part or task 4",5:"Part or task 5",6:"Part or task 6",7:"Task 7",8:"Task 8"} },
  },
  units: [
    { id: "know-the-test", name: "Know the test", topics: [
      { id: "taste", name: "A first taste of CELPIP listening" },
      { id: "format", name: "The CELPIP format" },
      { id: "scores", name: "CELPIP scores, CLB and points" },
      { id: "testday", name: "Test-day situations" },
      { id: "diagnostic", name: "A quick level check" },
      { id: "canadian", name: "Canadian words and spelling" },
    ] },
    { id: "listening-part-by-part", name: "Listening, part by part", topics: [
      { id: "lstrat", name: "Predict, note, decide: short clips" },
      { id: "lp1", name: "Listening Part 1: problem solving" },
      { id: "lp2", name: "Listening Part 2: daily life conversations" },
      { id: "lp3", name: "Listening Part 3: listening for information" },
      { id: "lp4", name: "Listening Part 4: news items" },
      { id: "lp5", name: "Listening Part 5: discussions" },
      { id: "lp6", name: "Listening Part 6: viewpoints" },
      { id: "ltraps", name: "Listening traps: short clips" },
    ] },
    { id: "reading-part-by-part", name: "Reading, part by part", topics: [
      { id: "rstrat", name: "Skim, scan and check" },
      { id: "rp1", name: "Reading Part 1: Correspondence" },
      { id: "rp2", name: "Reading Part 2: Apply a Diagram" },
      { id: "rp3", name: "Reading Part 3: Reading for Information" },
      { id: "rp4", name: "Reading Part 4: Reading for Viewpoints" },
      { id: "rvocab", name: "Working out words from context" },
    ] },
    { id: "writing-tasks", name: "Writing tasks", topics: [
      { id: "w-rating", name: "How CELPIP writing is rated" },
      { id: "w-email", name: "Writing Task 1: the email" },
      { id: "w-tone", name: "Getting the tone right" },
      { id: "w-survey", name: "Writing Task 2: survey questions" },
      { id: "w-link", name: "Paragraphs and linking words" },
      { id: "w-vocab", name: "Vocabulary range" },
      { id: "w-grammar", name: "The grammar mistakes that cost the most" },
      { id: "w-timing", name: "Typing, timing and checking" },
    ] },
    { id: "the-eight-speaking-tasks", name: "The eight speaking tasks", topics: [
      { id: "s-rating", name: "How CELPIP speaking is rated" },
      { id: "s-advice", name: "Speaking Task 1: Giving Advice" },
      { id: "s-exp", name: "Speaking Task 2: Personal Experience" },
      { id: "s-scene", name: "Speaking Task 3: Describing a Scene" },
      { id: "s-pred", name: "Speaking Task 4: Making Predictions" },
      { id: "s-compare", name: "Speaking Task 5: comparing and persuading" },
      { id: "s-difficult", name: "Speaking Task 6: dealing with a difficult situation" },
      { id: "s-opinion", name: "Speaking Task 7: expressing opinions" },
      { id: "s-unusual", name: "Speaking Task 8: describing an unusual situation" },
      { id: "s-fluency", name: "Fluency and pronunciation" },
    ] },
    { id: "mock-tests-and-test-week", name: "Mock tests and test week", topics: [
      { id: "m6-mock", name: "Mock test decisions" },
      { id: "m6-score", name: "Rate it yourself" },
      { id: "m6-week", name: "Final-week choices" },
      { id: "m6-after", name: "After the test" },
    ] },
  ],
};
