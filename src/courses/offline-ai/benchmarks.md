---
title: Model cards, benchmarks and why leaderboards mislead
summary: How to read a model card, what popular benchmarks measure, why leaderboard ranks can mislead, and how to test a model on your own work in an hour.
minutes: 20
updated: 2026-11-19
sources:
  - 'Hugging Face, Model cards documentation (official page), https://huggingface.co/docs/hub/model-cards'
  - 'LMArena, crowd-voted model rankings (official page), https://lmarena.ai'
quiz:
  - q: Why can a high benchmark score mislead?
    choices: ['Test questions may have leaked into training data, and the test may not match your work', 'Scores are always random', 'Benchmarks only test speed']
    ans: 0
    why: Contamination and mismatch are the two big traps. A model can learn the test without learning the skill.
  - q: What is the most reliable test for your job?
    choices: ['Twenty real tasks from your own work, scored the same way for each model', 'The top of a leaderboard', 'The model with the most downloads']
    ans: 0
    why: Your own tasks measure what you need. Keep them private so they never leak into training.
  - q: A model card says the scores are for the full 16-bit model. You will run a 3-bit copy. What should you expect?
    choices: ['Slightly to noticeably lower quality than the card', 'Exactly the same scores', 'Higher scores']
    ans: 0
    why: Lower bits lose some quality (Lesson 8.2). Test the copy you will actually run.
---

**Module 7 · about 20 minutes · read first: 7.1 and 7.3.** You'll be able to choose between models with evidence from your own work.

## 1. Why this matters

Every week a new model claims to beat the rest. Leaderboards help you make a shortlist, but they cannot tell you which model is best for your documents, your language or your code. One hour of your own testing can.

## 2. Reading a model card

The model card is the model's front page. Look for:

- **Sizes and context length**, and whether it reads images or audio.
- **Intended use and limits:** what the makers say it is not for.
- **Licence** (Lesson 7.2).
- **Benchmark table**, and which version was tested (often the full-precision one, not the small copy you will run).
- **Recommended settings** (temperature and so on, Lesson 10.1) and the chat template (Lesson 10.2).

## 3. What benchmarks measure

- **Knowledge tests** (multiple-choice exams across subjects).
- **Hard science questions** written by experts.
- **Maths** contest problems.
- **Coding:** writing functions, or fixing real bugs in real projects.
- **Crowd votes** (LMArena): people compare two anonymous answers and pick the better one; a rating comes out.

## 4. Why leaderboards mislead

1. **Contamination:** test questions leak into training data on the web.
2. **Mismatch:** an exam score says little about summarising your contracts in Hindi.
3. **Style over substance:** crowd votes reward long, confident, well-formatted answers.
4. **Different settings:** makers test with the best prompt, long thinking, or many tries.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a benchmark predicts your results only as far as its tasks look like yours.

**Equation:** your score = correct answers on your tasks ÷ number of tasks. With 20 tasks, a difference of 1 or 2 is noise; look for 4 or more.

**Analogy:** a driving test passed in a quiet town says little about driving in Mumbai traffic. Test drive the route you will use.

**Try it:** model A gets 15 of 20 of your tasks right, model B 16 of 20. Is B clearly better? (No: one task is within the noise. Choose on speed, memory or licence, or test 20 more.)
</details>

## 5. Your own one-hour test

1. Collect 20 real tasks (prompts and inputs) from your work. Keep them private.
2. Write down what a good answer must contain for each.
3. Run each model on all 20 with the same settings. Save the answers.
4. Score without looking at which model wrote which (ask a colleague to shuffle them).
5. Pick the smallest model that scores well enough: it will be faster and cheaper (Lesson 4.2).

## 6. Worked example

*Made-up numbers.* Imran runs his 20 support emails through two models. The leaderboard leader gets 14 right; a smaller model gets 16 right and writes twice as fast on his laptop. He picks the smaller one.

## 7. Practice

1. Open the model card of a model you use. Which version were its scores measured on?
2. Write five of your own test tasks today.
3. Why keep your tasks private?

<details>
<summary>Answers</summary>

1. Often the full-precision model with long thinking turned on.
2. Real work beats invented puzzles.
3. If they get published, future models might train on them and the test stops measuring skill.
</details>

**New words:** *model card*, *benchmark*, *contamination*, *leaderboard*, *blind scoring*.
