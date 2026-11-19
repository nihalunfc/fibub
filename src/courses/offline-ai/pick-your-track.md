---
title: 'Pick your track: laptop, desktop or team server'
seoTitle: 'Pick your track: laptop, desktop or server'
summary: Answer four questions about your computer, your users, your budget and your goal, and get a suggested path through the course.
minutes: 15
updated: 2026-11-18
quiz:
  - q: What decides most strongly which models you can run?
    choices: ['How fast your internet is', 'How much fast memory your machine has', 'Which operating system you use']
    ans: 1
    why: The model has to fit in memory (RAM, unified memory or graphics card memory). Module 4 explains why.
  - q: Five colleagues want to share one local model. Which track fits?
    choices: ['Laptop track', 'Desktop track', 'Team server track']
    ans: 2
    why: Several people asking at once needs a machine set up to serve many users, which Module 15 covers.
  - q: You have a 16 GB laptop and no budget. What is a good first step?
    choices: ['Wait until you can buy a graphics card', 'Install a model of up to about 12 billion parameters and start learning', 'Use only the cloud']
    ans: 1
    why: A 16 GB laptop runs useful models today. Learning on what you have tells you what, if anything, is worth buying.
---

**Module 1 · about 15 minutes · read first: 1.1 to 1.3.** You'll be able to name your track and the model size that suits your machine.

## 1. Why this matters

The course covers everything from a phone to a team server. You do not need all of it at once. Picking a track tells you which lessons to take first and stops you buying hardware you do not need.

## 2. The three tracks

- **Laptop track.** You use the computer you already have, usually 8 to 32 GB of memory. You run small and mid-sized models. Most people start here, and many stay here.
- **Desktop track.** A desktop with a graphics card, a Mac with a lot of memory, or one of the new 128 GB "AI boxes". You run bigger models, faster, and for longer.
- **Team server track.** One strong machine on the office or home network that several people use at once. You learn serving, logins and monitoring.

## 3. Find yours

Answer the four questions. The suggestion updates as you change any answer.

<!--fig:pick-track-->

The model names in the suggestion are examples from late 2026. New models come out every few weeks; what stays true is the size class (how many billions of parameters) that fits your memory. Module 7 shows how to pick from whatever is newest.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a model fits when its size in memory, plus some room to work, is less than your free memory.

**Equation:** memory needed ≈ parameters (billions) × bits per weight ÷ 8 GB, plus about 1 to 3 GB of working room.

**Analogy:** packing a suitcase. Parameters are the clothes; bits per weight is how tightly you fold them (Module 8). Fold tighter and more fits, but things crease: quality drops a little.

**Try it:** a 12-billion-parameter model folded to 4 bits per weight? (12 × 4 ÷ 8 = 6 GB, plus working room, about 7 to 9 GB: fine on a 16 GB laptop.)
</details>

## 4. Worked example

*Made-up numbers.* Aisha has a laptop with 16 GB of memory, works alone, has no budget for now, and cares most about writing code. The tool suggests the Laptop track, models up to about 12 billion parameters, and the short path through Modules 9 and 11, then lesson 13.3 on a local coding assistant. Three weeks later she finds the 12B model is good enough for most coding questions and keeps one cloud plan for the hard ones.

## 5. Practice

1. Do the questionnaire for your own situation and write down your track.
2. Using the box, how much memory does a 27-billion-parameter model need at 4 bits per weight?
3. Change only the "Who will use it?" answer to a team. What changes in the advice, and why?

<details>
<summary>Answers</summary>

1. Keep the note; lesson 18.12 (capstone) asks for it.
2. 27 × 4 ÷ 8 = 13.5 GB, plus working room: about 15 to 17 GB. It needs a 24 GB machine or graphics card to run comfortably.
3. It moves to the Team server track, because several people asking at once needs a machine set up for many users.
</details>

**New words:** *track* (your route through the course), *size class* (models grouped by billions of parameters), *bits per weight* (how precisely each number in the model is stored).
