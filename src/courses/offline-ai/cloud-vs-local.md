---
title: 'Cloud AI and local AI: the same brain in a different house'
seoTitle: 'Cloud AI vs local AI: what changes | Offline AI'
summary: What actually happens when you use a chatbot website, what changes when the model runs on your own computer, and the trade-offs in one table.
minutes: 20
updated: 2026-11-22
sources:
  - 'Ollama, official documentation (running open models on your own computer) https://github.com/ollama/ollama'
  - 'Claude plan prices: Anthropic India pricing, Business Today, 14 July 2026, https://www.businesstoday.in/technology/news/story/anthropic-introduces-india-pricing-for-claude-ai-plans-pricing-starts-at-542742-2026-07-14'
  - 'ChatGPT and Codex plans (official), checked 18 November 2026, https://learn.chatgpt.com/docs/pricing'
  - 'Google AI plans after I/O 2026, The Decoder, 19 May 2026, https://the-decoder.com/google-overhauls-its-ai-subscriptions-at-i-o-2026-with-three-tiers-starting-at-10-a-month/'
quiz:
  - q: When you use a chatbot website, where does the model do its work?
    choices: ['In your web browser', "On the company's computers in a data centre", 'On your phone network']
    ans: 1
    why: Your words travel over the internet to the company's servers; only the text of the answer comes back.
  - q: Which is a real advantage of local AI?
    choices: ['It always gives smarter answers', 'Your files never have to leave your machine', 'It never needs any setup']
    ans: 1
    why: Privacy is the clearest win. The strongest cloud models are still usually smarter, and local AI does need setup.
  - q: Which is a real advantage of cloud AI?
    choices: ['No hardware to buy, and the very strongest models', 'Unlimited use for a fixed price', 'Works with no internet']
    ans: 0
    why: Cloud plans give the newest, biggest models with nothing to buy. They have usage limits and need a connection.
---

**Module 1 · about 20 minutes · read first: 1.1.** You'll be able to explain where your words go when you use AI, and when running a model yourself makes sense.

<div class="bigidea">Cloud AI and local AI do the same job; the only difference is whose computer does the thinking, and that changes cost, privacy and limits.</div>

## 1. Why this matters

Every choice later in the course comes back to one question: where does the model run? That includes which computer to buy and whether to keep a subscription. Get this picture right and the rest of the course is details.

## 2. What happens when you use a chatbot website

When you type into Claude, ChatGPT or Gemini on the web, four things happen:

1. Your browser sends your words (and any file you attached) over the internet.
2. They arrive at the company's data centre, a building full of powerful computers.
3. A very large model runs on those computers and writes an answer, a few words at a time.
4. The answer is sent back to your screen.

The model itself never comes to you. You are renting time on it, like a taxi rather than your own car. That explains three things:

- it needs an internet connection;
- the company can see what you send (under its privacy terms);
- plans have usage limits, because every answer costs the company electricity and hardware time.

## 3. What changes when it runs locally

A **model** is, in the end, a large file of numbers. Some companies publish that file for anyone to download. These are called **open-weight models** ("weights" is the name for the numbers inside). Examples in late 2026 include Google's Gemma 4, Alibaba's Qwen3.8 and OpenAI's gpt-oss.

Download that file and add a free program that knows how to run it. Now your own computer does steps 2 and 3. Nothing has to travel. The same four steps happen, but all inside one machine.

<!--fig:two-homes-->

Think of it as the same kind of brain living in a different house. In the cloud it lives in a huge, well-staffed mansion you visit. At home it lives in your spare room: smaller, but yours, open at any hour, and nobody else reads your mail.

## 4. The trade-offs in one table

| | Cloud AI (subscription) | Local AI (your machine) |
|---|---|---|
| Strongest models | Yes, the newest and largest | Smaller open models; good, not always the best |
| Upfront cost | Nothing | Hardware, unless you use what you have |
| Monthly cost | A plan, often about US$20 for the standard tier; higher tiers up to US$200 or more | Electricity only |
| Usage limits | Yes, per few hours or per week | None, apart from your machine's speed |
| Internet | Always needed | Only to download, then not at all |
| Privacy | Your data goes to the company | Stays on your machine |
| Setup | Sign in | An hour or two the first time |
| Extras (web search, image tools) | Built in | You add them yourself, offline where possible |

Plan prices change and differ by country. In India, for example, Claude Pro was priced at ₹2,000 a month including GST from July 2026, and ChatGPT and Codex plans start with a Go tier and go up to Pro tiers of US$100, US$200 and US$500. Module 16 compares them properly, country by country.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** cloud AI is a running cost; local AI is mostly a one-time cost.

**Equation:** cost after *m* months: cloud = *p* × *m*; local = *H* + *e* × *m*, where *p* is the plan price, *H* the hardware price and *e* the electricity per month.

**Analogy:** renting a flat against buying one. Rent is a straight line from zero. Buying starts high and grows slowly. Where the two lines cross is the break-even month. The analogy breaks because hardware also gets older and slower compared with new models, like a flat that shrinks a little each year.

**Try it:** a plan at 20 a month, hardware at 600 and electricity at 4 a month (made-up units). When do they cross? (600 + 4*m* = 20*m*, so *m* = 37.5 months.)
</details>

Watch the two costs grow month by month, with the numbers from the box.

<div class="steps" data-fig="cloud-vs-local-breakeven">
<div class="step"><p><b>Month 0.</b> Cloud has cost nothing yet. Local has cost the hardware: <b>600</b>. Local starts far behind.</p></div>
<div class="step"><p><b>After 1 year.</b> Cloud: 20 × 12 = <b>240</b>. Local: 600 + 4 × 12 = <b>648</b>. Cloud is still cheaper.</p></div>
<div class="step"><p><b>The gap closes.</b> Each month cloud costs 20 and local costs 4, so local catches up by 20 − 4 = <b>16 a month</b>.</p></div>
<div class="step"><p><b>Break-even.</b> The head start of 600 is gone after 600 ÷ 16 = <b>37.5 months</b>. Both lines are at 750.</p></div>
<div class="step"><p><b>After that,</b> every month on local saves 16. If you would have kept the plan for more than about three years, local wins on cost. If not, cloud does.</p></div>
</div>

<div class="meaning">

<dl>
<dt>p</dt><dd>the cloud plan price per month</dd>
<dt>H</dt><dd>the one-time hardware price (zero if you use a computer you already own)</dd>
<dt>e</dt><dd>the extra electricity per month for running the model at home</dd>
<dt>m* = H ÷ (p − e)</dt><dd>the break-even month: when the two total costs are equal</dd>
<dt>Physical meaning</dt><dd>Cloud is like renting, local is like buying. Buying only pays off if you keep using it past the break-even month. If you already own a good enough computer, H is zero and local is cheaper from day one.</dd>
</dl>

</div>

<div class="problem" data-problem="cloud-vs-local-breakeven"></div>

## 5. Worked example

*Made-up numbers.* A two-person design studio pays for two standard plans, 20 each a month, so 40 a month. They mostly ask for summaries of client briefs, which they would rather not upload. One existing desktop could run a mid-sized model. Their cost to go local is about 10 a month of electricity and a weekend of setup. They keep one cloud plan for hard jobs and drop the other: they save 10 a month, and the client briefs never leave the office.

<div class="myth">

**"If I run the model locally, the company that made it can still see what I type."** No. An open-weight model is just a file. Once it is on your machine, the program that runs it does all the work there, and nothing is sent back to the maker. The only things that can send data are the app around it (update checks, plug-ins), which Lesson 1.3 shows you how to spot and switch off.

</div>

## 6. Practice

1. List three things you use AI for now. Mark each **P** if it involves private information.
2. For each one, would the best cloud model matter, or would a good-enough model do?
3. Using the box above, find the break-even month for a plan at 25 a month against hardware at 900 with 5 a month of electricity.

<details>
<summary>Answers</summary>

1. Anything with client names, health details, contracts or personal finances counts as private.
2. Summaries, rewriting and drafting usually work well with good-enough models. Hard reasoning, very long documents and the latest knowledge favour the cloud.
3. 900 + 5*m* = 25*m*, so *m* = 45 months.
</details>

**New words:** *data centre* (a building of servers), *open-weight model* (a model whose file anyone may download, under a licence), *inference* (running a model to get an answer).

<div class="keypoints">

- With cloud AI your words travel to a company's data centre; with local AI the same steps happen inside your own machine.
- An open-weight model is a file of numbers anyone may download and run, under its licence.
- Cloud gives the strongest models and no hardware to buy; local gives privacy, no usage limits and no internet after the download.
- Cost after m months: cloud = p × m, local = H + e × m; break-even month = H ÷ (p − e).
- Many people mix both: local for private, everyday work, a cloud plan for the hardest jobs.

</div>
