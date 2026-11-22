---
title: Research and science labs
summary: Labs use local AI to read papers, search their own notes, write analysis code and process data that cannot leave, with a fixed model file that makes results repeatable.
minutes: 20
updated: 2026-11-22
sources:
  - 'Hugging Face model cards and versioned repositories (official documentation), https://huggingface.co/docs/hub/model-cards'
  - 'Nature, editorial policy on AI tools and authorship (official page), https://www.nature.com/nature-portfolio/editorial-policies/ai'
  - 'Ollama and llama.cpp documentation on fixed seeds and temperature (official pages), https://docs.ollama.com and https://github.com/ggml-org/llama.cpp'
  - 'Cohen, J. (1960), "A coefficient of agreement for nominal scales", Educational and Psychological Measurement 20(1), 37-46, https://doi.org/10.1177/001316446002000104'
quiz:
  - q: Why does a local model help reproducible research?
    choices: ['The exact model file and settings can be recorded and rerun years later', 'It always gives the right answer', 'It replaces peer review']
    ans: 0
    why: Cloud models change or retire; a local file with a checksum, a fixed seed and settings can be rerun.
  - q: Can an AI model be listed as an author on a paper at major journals?
    choices: ['No: journals ask authors to describe AI use instead', 'Yes, always', 'Only for short papers']
    ans: 0
    why: Authorship needs accountability, which a model cannot take. Describe its use in the methods.
  - q: Which lab data especially suits local processing?
    choices: ['Participant data, unpublished results and data under a sharing agreement', 'Published abstracts only', 'Weather forecasts']
    ans: 0
    why: Ethics approvals and data agreements often forbid sending such data to outside services.
---

**Module 18 · about 20 minutes · read first: Module 12.** You'll be able to plan local AI for a research group in a way that keeps results repeatable.

<div class="bigidea">A lab can freeze a local model on disk, record exactly how it was used and check its work against people, which keeps restricted data in the lab and makes AI-assisted results repeatable.</div>

## 1. Why this sector

Researchers read more than anyone, write a lot of analysis code, and often hold data under ethics approvals or agreements that forbid outside processing. They also need methods others can repeat. A model you can freeze on disk serves all of these.

## 2. Top uses

1. **Literature search over your own PDF library** with citations (Module 12).
2. **Analysis code:** draft Python or R for a person to check and test.
3. **Coding qualitative data:** sort interview answers or survey comments into themes, with human checks on a sample.
4. **Lab notes search:** "when did we last change the buffer recipe?"
5. **Writing help:** clearer methods and abstracts, with AI use described as the journal asks.

## 3. Repeatability

Record: model file name and checksum, quantisation, engine and version, settings (temperature 0 or a fixed seed), and the full prompt. With these, someone else can rerun your pipeline. Note that the same settings can still give tiny differences across different hardware or engine versions; report them.

It is a recipe written down exactly: the same ingredients (file), the same oven (engine), the same temperature and timings (settings).

## 4. Care points

- Ethics approvals and data agreements decide where data may go; local often satisfies them where cloud does not.
- Journals and funders have AI policies; most ask you to disclose use and keep authors accountable.
- Validate AI coding of qualitative data against human coding on a sample and report agreement.

<div class="steps">
<div class="step"><p><b>The job.</b> A public health group must sort 4,000 open survey answers into 12 themes. Their ethics approval forbids outside processing, so a local 27B model does the first pass.</p></div>
<div class="step"><p><b>A human sample.</b> Two researchers code 300 of the answers by hand, without looking at the model's labels.</p></div>
<div class="step"><p><b>Compare.</b> They agree with the model on 252 of 300: 252 ÷ 300 = <b>84%</b>. The other 48 are the interesting part.</p></div>
<div class="step"><p><b>Fix the cause.</b> Most disagreements sit in two themes whose definitions overlapped. They rewrite those two definitions and run again.</p></div>
<div class="step"><p><b>Report it.</b> The methods section lists the model, checksum, engine version, prompt and the agreement figure, so another lab can repeat it.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** check AI labels against people before trusting them.

**Equation:** agreement = matching labels ÷ total labels in a checked sample (Cohen's kappa adjusts for chance).

**Analogy:** a second marker for exam scripts.

**Try it:** people and model agree on 172 of 200 comments? (86% agreement; then check where they disagree.)
</details>

```math
\text{agreement} = \frac{\text{matching labels}}{\text{labels checked}}
```

<div class="meaning">

<dl>
<dt>labels checked</dt><dd>the sample coded by both people and the model</dd>
<dt>matching labels</dt><dd>how many got the same theme from both</dd>
<dt>Cohen's kappa</dt><dd>a stricter score that takes off the agreement you would expect by luck alone</dd>
<dt>Physical meaning</dt><dd>The sample is a window onto the whole set. If 16 in 100 sample answers are labelled differently, expect about 16 in 100 across all 4,000, and look at those disagreements to learn what the model misunderstands.</dd>
</dl>

</div>

<div class="problem" data-problem="research-labs-mislabelled"></div>

<div class="myth">

**"Temperature 0 means I get exactly the same output anywhere."** It removes the deliberate randomness, but different hardware, engine versions or quantisations can still change a word here and there. Record all of them, rerun on the same setup to confirm, and report any small differences.

</div>

## 5. Worked scenario

*Made-up lab.* A public health group codes 4,000 open survey answers into 12 themes with a local 27B model on a lab workstation, because their ethics approval does not allow outside processing. Two researchers code 300 answers by hand; agreement with the model is 84%, and they revise two theme definitions that caused most disagreements. The paper's methods list the model, checksum, prompt and agreement.

## 6. Practice

1. Write the methods sentence describing a local model you might use.
2. What five things make an AI step repeatable?
3. Why compare with human coding on a sample?

<details>
<summary>Answers</summary>

1. For example: "Themes were assigned with Gemma 4 31B (Q4_K_M, SHA-256 …) in llama.cpp version …, temperature 0, prompt in Supplement S2."
2. Model file and checksum, quantisation, engine version, settings, prompt.
3. To measure how often the model is right before relying on it, and to report it honestly.
</details>

**New words:** *reproducibility*, *checksum*, *qualitative coding*, *inter-rater agreement*.

<div class="keypoints">

- Local models keep data covered by ethics approvals and data agreements inside the lab.
- Record model file and checksum, quantisation, engine version, settings and prompt so others can rerun your work.
- Check AI labels against human coding on a sample; agreement = matching labels ÷ labels checked.
- Journals ask you to disclose AI use; a model cannot be an author.

</div>
