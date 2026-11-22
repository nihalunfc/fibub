---
title: 'What an LLM is, and what it is not'
seoTitle: 'What is an LLM? How it works and where it goes wrong'
summary: 'An LLM is a very large next-token predictor: a fixed set of numbers that turns text into probabilities. Ask a made-up model the same question 20 times, see why fluent answers can be wrong, and learn how real systems guard against it.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'An LLM answering a question:'
    choices: ['Generates likely text token by token; it does not look the answer up', 'Searches a built-in database of facts', 'Copies the closest web page']
    ans: 0
    why: Unless it is connected to a search tool or your documents, it only has its weights, which store patterns, not a list of facts.
  - q: Why can an LLM give a wrong answer that sounds completely sure?
    choices: ['Wrong but likely-sounding tokens have real probability, and fluency comes from the same process as correctness', 'It is lying on purpose', 'Its battery is low']
    ans: 0
    why: Its writing is fluent by construction. Fluency is not a sign of truth.
  - q: 'Between two separate chats, a plain LLM remembers:'
    choices: ['Nothing, unless the app saves notes and puts them into the next prompt', 'Everything you ever typed', 'Only your name']
    ans: 0
    why: The weights do not change when you chat. Any memory is text the app stores and feeds back in.
sources:
  - 'Lewis, P. et al. (2020), Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks https://arxiv.org/abs/2005.11401'
  - 'Ji, Z. et al. (2023), Survey of Hallucination in Natural Language Generation, ACM Computing Surveys 55(12) https://doi.org/10.1145/3571730'
  - 'Jurafsky, D. and Martin, J. H., Speech and Language Processing, 3rd edition draft, chapter on large language models https://web.stanford.edu/~jurafsky/slp3/'
---

**Module 10 · about 20 minutes · read first: 10.3, 10.6.** You'll be able to describe an LLM in one accurate sentence, explain context windows, hallucinations and knowledge cut-offs, and say how retrieval and tools make answers more reliable.

<div class="bigidea">An LLM is a huge, fixed set of numbers that turns text into odds for the next token. It writes by drawing from those odds, so it is fluent by design and right only most of the time.</div>

## 1. Why this matters

LLMs are now part of most office work, and the people who use them well are the ones who know what they are. A clear picture stops two opposite mistakes: trusting every confident answer, and dismissing a tool that is truly useful for drafting, summarising, coding and explaining.

## 2. What it is

**An LLM is a function with billions of fixed numbers (weights) that turns a piece of text into probabilities for the next token.** Everything else is a loop around that function:

1. The app builds a **prompt**: hidden instructions (the **system prompt**), the conversation so far, any documents, and your message.
2. The model gives probabilities for the next token (Lesson 10.3). One is drawn (with a temperature) and added to the text.
3. Repeat until an end token. A 500-word answer is around 700 runs of the network.

Watch the loop answer "The capital of Australia is":

<div class="steps">
<div class="step"><p><b>Build the prompt.</b> System prompt + chat so far + "The capital of Australia is". This whole text is all the model can see.</p></div>
<div class="step"><p><b>Get the odds.</b> The network outputs, say: Canberra <b>0.55</b>, Sydney <b>0.30</b>, Melbourne <b>0.08</b>, others 0.07.</p></div>
<div class="step"><p><b>Draw one.</b> Like spinning a wheel with those slice sizes. This time it lands on "Canberra", but 38 times in 100 it would land on a wrong city.</p></div>
<div class="step"><p><b>Add it and repeat.</b> "Canberra" joins the text, and the model guesses the next token after it (".", then the end). Each token is one more spin.</p></div>
<div class="step"><p><b>Give it the facts.</b> Put "Canberra is the capital of Australia" from an atlas into the prompt, and Canberra's odds rise close to 1. That is what retrieval does.</p></div>
</div>

The **context window** is how many tokens the model can see at once, prompt and answer together: from a few thousand to over a million. Anything outside it does not exist for the model.

Try it: drag the score bars, press Add 2 to all, and move the temperature.

<figure class="fig" data-fig="@ai-softmax-lab"><figcaption>Softmax turns any scores into probabilities that are positive and add to 100%. Adding the same number to every score changes nothing; a low temperature makes the leader win nearly everything and a high one flattens the odds.</figcaption></figure>

## 3. What it is not

- **Not a database.** Facts are stored only as patterns in the weights. Common facts come out reliably; rare ones (a small company's founding year, a minor court case) may come out wrong but fluent. This is called **hallucination**.
- **Not up to date.** It knows nothing after its training text was collected (its **knowledge cut-off**), unless the app searches the web or your files and puts the results in the prompt.
- **Not learning from your chat.** The weights do not change while you talk. "Memory" features save notes and paste them into later prompts.
- **Not a calculator or a source.** It can do sums and cite papers in the style of doing so; check numbers with a tool and look citations up.

<!--fig:llm-guess-->

The usual fixes add facts from outside: **retrieval-augmented generation** (RAG: find relevant passages with embeddings, Lesson 10.2, and put them in the prompt), **tools** (a calculator, a search, a database query) and asking for sources you can check.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** an answer is a chain of draws, and every draw can go wrong.

**Generating:** with `$p_\theta$` the network,

```math
w_{t+1} \sim p_\theta(\,\cdot \mid w_1, \dots, w_t), \qquad t = 1, 2, \dots
```

**Small error rates add up.** If each stated fact is wrong with probability `$e$`, independently, an answer with `$n$` facts contains at least one error with probability

```math
1 - (1 - e)^{n}
```

**Analogy:** a very well-read friend speaking from memory, without notes. Usually right on common things, sometimes confidently wrong on details, and much better when you hand them the document.

**Try it:** each fact is right 99 % of the time; a report states 50 facts. Chance of at least one error? (`$1 - 0.99^{50} = 0.39$`: about 2 reports in 5.)
</details>

<div class="meaning">

<dl>
<dt>e</dt><dd>the chance that any one stated fact is wrong</dd>
<dt>n</dt><dd>how many facts the answer states</dd>
<dt>(1 − e)<sup>n</sup></dt><dd>the chance that every one of them is right</dd>
<dt>1 − (1 − e)<sup>n</sup></dt><dd>the chance that at least one is wrong</dd>
<dt>Physical meaning</dt><dd>A model that is right 99 % of the time per fact still slips somewhere in about 2 of every 5 fifty-fact reports. Long answers need checking, especially the numbers, names and dates that a decision depends on.</dd>
</dl>

</div>

<div class="problem" data-problem="what-is-an-llm-errors"></div>

Try it: set temperature to 0.3, then 1.8, then cut the list with top-k and top-p, and press Draw 200 each time.

<figure class="fig" data-fig="@ai-sampling-topp"><figcaption>Temperature reshapes the odds; top-k and top-p remove the unlikely tail before choosing. Low settings give safe, repeatable text; high settings give variety and more risk of nonsense.</figcaption></figure>

Step through a few merges and watch letters become chunks.

<figure class="fig" data-fig="@ai-bpe-merge"><figcaption>A tokeniser is built by repeatedly merging the commonest neighbouring pair. Common chunks become single tokens (cheap), rare words stay in several pieces (costly). This is why token counts differ from word counts.</figcaption></figure>

Try it: slide the style from honest to over-confident and watch the bars drop below the diagonal.

<figure class="fig" data-fig="@ai-calibration"><figcaption>A calibrated model's confidence can be trusted. An over-confident model sounds sure when it should not, which is how confident wrong answers, called hallucinations, appear.</figcaption></figure>

Try it: press Generate 20 with 1 word of memory, then with 2 words.

<figure class="fig" data-fig="@ai-bigram-gen"><figcaption>A language model is a table of what tends to come next. More memory gives more sensible text but copies the source, because there is only one continuation. Real models do this with billions of numbers instead of a table.</figcaption></figure>

## 4. Worked example

The made-up probabilities in the simulation for the word after "The capital of Australia is": Canberra 0.55, Sydney 0.30, Melbourne 0.08, others 0.07.

- At temperature 1, a wrong city comes out 38 % of the time: about 8 answers in 20.
- At temperature 0.5 the probabilities become `$p^2$`, rescaled to add up to 1: Canberra 0.75, Sydney 0.22. Still wrong almost one time in four.
- At 0.2, Canberra 0.95. Lower temperature helps here only because the top answer happens to be right. If the training text had made "Sydney" the top word, low temperature would give the wrong answer every time.

Putting a sentence from an atlas into the prompt ("Canberra is the capital of Australia") raises the right answer's probability close to 1. That is what RAG does.

<div class="problem" data-problem="what-is-an-llm-temperature"></div>

<div class="myth">

**"It sounds so sure, so it must be right."** The model's tone comes from the same next-token process whether the content is right or wrong. Confidence in the wording is not a measure of truth. Ask for the source passage, or give it the document, and check what matters.

</div>

## 5. Practice

1. In the simulation, set the temperature to 2.5 and ask 20 times. Why do "a" and "the" start to appear?
2. A colleague says "the model checked its database and found the figure". What is a more accurate description?
3. Name two ways to make an LLM's answer about your company's own policies reliable.

<details>
<summary>Answers</summary>

1. High temperature flattens the probabilities, so unlikely tokens such as "a" (as in "a city …") are drawn more often.
2. It generated likely text from patterns in its weights; unless a search or database tool was connected, nothing was looked up.
3. Put the policy text in the prompt (or use RAG over the policy documents), and ask it to quote the passage it used so a person can check.
</details>

**Try it on your own data:** the free [Offline AI course](/learn/courses/offline-ai/) shows you how to run an LLM on your own computer, with nothing sent anywhere, and the [[prompt-pruner]] prepares your documents for it.

**New words:** *large language model*, *prompt*, *system prompt*, *context window*, *hallucination*, *knowledge cut-off*, *retrieval-augmented generation*, *tool use*.

<div class="keypoints">

- An LLM is a fixed function that turns text into next-token probabilities; an answer is a long chain of draws.
- The context window is everything it can see; its weights don't change while you chat.
- It is not a database, a calculator or up to date, so fluent answers can still be wrong (hallucination).
- Small error rates add up: 1 − (1 − e)<sup>n</sup> for n facts.
- Retrieval (RAG), tools and checkable sources put real facts in the prompt and make answers reliable.

</div>
