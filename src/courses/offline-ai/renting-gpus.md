---
title: Renting graphics cards by the hour
summary: The middle path between buying hardware and paying for a subscription. How hourly GPU rental works, what it costs, what it does and does not protect, and when it beats both.
minutes: 20
updated: 2026-11-19
sources:
  - 'RunPod pricing (official page), https://www.runpod.io/pricing'
  - 'Vast.ai pricing (official page), https://vast.ai/pricing'
  - 'Lambda GPU cloud pricing (official page), https://lambda.ai/pricing'
  - 'vLLM documentation: running in Docker (official page), https://docs.vllm.ai'
quiz:
  - q: Is a rented cloud GPU "offline AI"?
    choices: ['No: the data travels to someone else''s computer, though you control the model and software', 'Yes, exactly the same', 'Only on weekends']
    ans: 0
    why: You choose the open model and the software, but the machine and its network belong to the provider. Read their data terms.
  - q: What is the most common way people waste money on rented GPUs?
    choices: ['Leaving the machine running when nobody is using it', 'Using small models', 'Turning it off']
    ans: 0
    why: Billing runs by the hour while the machine is on, used or not. Stop it, or use services that bill per second of real work.
  - q: When does renting make the most sense?
    choices: ['Short bursts of heavy work, testing hardware before buying, or one-off jobs like fine-tuning', 'Every day, all day, for years', 'Never']
    ans: 0
    why: Hourly rental wins for occasional heavy use. Steady daily use usually favours owning (Lesson 16.4).
---

**Module 15 · about 20 minutes · read first: 14.3 and 15.2.** You'll be able to decide when to rent a GPU by the hour instead of buying one or paying for a plan.

## 1. Why this matters

Some jobs need a big card for a few hours: fine-tuning a model (Module 14), processing a backlog of 50,000 documents, or trying a 120B model before spending thousands on hardware. Renting gives you that power for the length of the job, with your own choice of open model and software.

## 2. How it works

1. Choose a provider: GPU-rental services (for example RunPod, Vast.ai, Lambda) or the large clouds (AWS, Google Cloud, Azure, and regional providers in India, Canada and the UK).
2. Pick a card (memory first, as always) and a ready-made image with vLLM, Ollama or a notebook.
3. Start it. Billing begins. Load your model, run your job or serve your team over a secure link.
4. Save results to your own storage, then **stop or delete the machine**. Stored disks may still cost a little.

**On-demand** machines are yours until you stop them. **Spot** or **interruptible** machines are cheaper but can be taken back with little warning: fine for batch jobs that save progress, bad for a live service.

## 3. What it protects and what it does not

You control the model and software, so there are no per-message limits and no provider reading prompts to train a model. But your data does leave your building, travels over the internet and sits on someone else's hardware. Read the provider's data terms, choose a region that fits your rules (for example, data kept in Canada or India), and treat rented GPUs as cloud for any data policy from Lesson 15.6. Marketplace providers that rent out other people's home machines are cheaper still and trusted less; keep private data off them.

## 4. Prices

Hourly prices vary by card, provider, region and week, and moved a lot in 2026 with the memory shortage (Lesson 5.7). A consumer-class 24 to 32 GB card usually rents for well under US$1 an hour, data-centre cards with 80 GB or more for a few dollars an hour. Check the providers' pricing pages on the day; the numbers in this lesson's examples are made up.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** rent when the hours are few, own when the hours are many.

**Equation:** months for owning to beat renting ≈ hardware price ÷ (hours per month × hourly rent − monthly power cost).

**Analogy:** a van. Hire one for moving day; buy one if you deliver every day.

**Try it:** a card costing 2,000, rented equivalent 0.50 an hour, used 20 hours a month, power 5 a month? (20 × 0.50 − 5 = 5 a month saved by owning: 400 months. Rent.) Used 200 hours a month? (100 − 5 = 95: about 21 months. Owning starts to make sense.)
</details>

## 5. Worked example

*Made-up numbers.* A university research group wants to fine-tune a 12B model on 10,000 labelled lab notes. On their own 16 GB card it would take days and might not fit. They rent an 80 GB card for 6 hours at 3.00 an hour (18 in total), train the adapter, copy it home and delete the machine. Daily use then runs on their own card with the new adapter (Lesson 14.5).

## 6. Practice

1. Name two jobs in your work that suit renting rather than buying.
2. Why is a spot machine a poor choice for your team's live chat server?
3. Using the formula, how many hours a month make owning a 1,500 card better within two years if renting costs 0.40 an hour and power is 4 a month?

<details>
<summary>Answers</summary>

1. For example: a one-off fine-tune, a big document backlog, testing a model before buying hardware.
2. It can be taken back at any moment, cutting off everyone mid-answer.
3. 1,500 ÷ 24 ≈ 62.5 a month needed: hours × 0.40 − 4 ≥ 62.5, so about 166 hours a month or more.
</details>

**New words:** *on-demand*, *spot (interruptible) instance*, *region*, *image* (a ready-made software set-up).
