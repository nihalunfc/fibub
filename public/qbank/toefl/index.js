// TOEFL iBT question bank (fibub, original practice material; nothing is copied from ETS tests or practice material).
// Used by the TOEFL course (/learn/courses/toefl/) and its practice room. Made from the lesson drill sets in public/learn-kit/toefl/sets/
// by scripts/courses/sets-to-qbank.mjs. Levels follow the 2026 band scale: 1 about band 2 to 3, 2 about band 3 to 4, 3 about band 4 to 5, 4 about band 5, 5 about band 6.
export default {
  id: "toefl", name: "TOEFL practice",
  exams: {ibt:'TOEFL iBT'},
  facets: {
    skill: { label: 'Skill', values: {listening:'Listening',reading:'Reading',writing:'Writing',speaking:'Speaking',test:'The test, scores and test week'} },
    task: { label: "Task", values: {'complete-words':"Complete the Words",'daily-life':"Read in Daily Life",'academic-passage':"Read an Academic Passage",'choose-response':"Listen and Choose a Response",conversation:"Listen to a Conversation",announcement:"Listen to an Announcement",'academic-talk':"Listen to an Academic Talk",'build-sentence':"Build a Sentence",email:"Write an Email",discussion:"Write for an Academic Discussion",'listen-repeat':"Listen and Repeat",interview:"Take an Interview"} },
  },
  units: [
    { id: "know-the-test", name: "Know the test", topics: [
      { id: "taste", name: "A first taste: choose a response" },
      { id: "format", name: "The 2026 TOEFL tasks" },
      { id: "bands", name: "TOEFL bands" },
      { id: "adaptive", name: "Adaptive-test strategy" },
      { id: "testday", name: "Test-day situations" },
      { id: "diagnostic", name: "A quick level check" },
    ] },
    { id: "reading-tasks", name: "Reading tasks", topics: [
      { id: "rcw", name: "Complete the Words: academic sentences" },
      { id: "rcwp", name: "Complete the Words: full paragraphs" },
      { id: "rwb", name: "Word building: prefixes, suffixes and spelling" },
      { id: "rdl", name: "Read in Daily Life: notices, emails and schedules" },
      { id: "rap", name: "Read an Academic Passage" },
      { id: "rqt", name: "Reading question types" },
      { id: "rspeed", name: "Reading speed: skim, scan and signal words" },
    ] },
    { id: "listening-tasks", name: "Listening tasks", topics: [
      { id: "lskills", name: "TOEFL listening skills" },
      { id: "lcr", name: "Listen and Choose a Response" },
      { id: "lconv", name: "Listen to a Conversation" },
      { id: "lann", name: "Listen to an Announcement" },
      { id: "ltalk", name: "Listen to an Academic Talk" },
      { id: "lnotes", name: "Note-taking practice" },
    ] },
    { id: "writing-tasks", name: "Writing tasks", topics: [
      { id: "w-bas", name: "Build a Sentence" },
      { id: "w-qwo", name: "Questions and word order" },
      { id: "w-email", name: "Write an Email" },
      { id: "w-disc", name: "Write for an Academic Discussion" },
      { id: "w-score", name: "How writing is scored" },
      { id: "w-grammar", name: "Grammar fixes" },
    ] },
    { id: "speaking-tasks", name: "Speaking tasks", topics: [
      { id: "s-lr", name: "Listen and Repeat drills" },
      { id: "s-pron", name: "Pronunciation: stress, linking and intonation" },
      { id: "s-int", name: "Take an Interview" },
      { id: "s-struct", name: "Structuring a spoken answer" },
      { id: "s-score", name: "Speaking scores: what raters listen for" },
    ] },
    { id: "mock-tests-and-test-week", name: "Mock tests and test week", topics: [
      { id: "m6-mock", name: "Mock test decisions" },
      { id: "m6-week", name: "Final-week choices" },
      { id: "m6-send", name: "Scores and sending" },
    ] },
  ],
};
