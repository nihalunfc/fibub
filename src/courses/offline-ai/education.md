---
title: Teachers, students and offline classrooms
summary: Local AI in schools and colleges, from a teacher's laptop to a classroom server with no internet. Uses, child-safety and privacy points, and a setup that works where connections are poor.
minutes: 20
updated: 2026-11-19
sources:
  - 'UNESCO, "Guidance for generative AI in education and research", 2023 (official page), https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research'
  - 'UK Department for Education, "Generative AI in education" (official page), https://www.gov.uk/government/publications/generative-artificial-intelligence-in-education'
  - 'India: Digital Personal Data Protection Act 2023, verifiable parental consent for children''s data (MeitY), https://www.meity.gov.in/data-protection-framework'
  - 'USA: FERPA and COPPA (Department of Education and FTC, official pages), https://studentprivacy.ed.gov and https://www.ftc.gov'
quiz:
  - q: Why does a classroom server suit schools with weak internet?
    choices: ['Students reach it over the school Wi-Fi with no internet needed', 'It is always faster than the cloud', 'It needs no electricity']
    ans: 0
    why: The model runs in the building; only the local network is needed.
  - q: What extra care do children's data need?
    choices: ['Laws in all four countries add protections, such as parental consent and limits on profiling', 'None', 'Only for teenagers']
    ans: 0
    why: Children's data has extra rules (for example DPDP parental consent in India, COPPA in the USA).
  - q: What is a good classroom rule for AI answers?
    choices: ['Treat answers as a starting point and check them against the textbook or teacher', 'Copy them into homework', 'Never read them']
    ans: 0
    why: Models make mistakes (Lesson 2.7); learning to check is part of using them well.
---

**Module 18 · about 20 minutes · read first: 9.5 and 9.6.** You'll be able to plan local AI for a teacher, a class or a school.

## 1. Why this sector

Teachers want help with preparation and marking; students want a patient tutor. Many schools have weak or costly internet, and student data needs care. A local model on a laptop or a small classroom server works offline and keeps student work in school.

## 2. Top uses

- **Teachers:** worksheets and question banks at several levels, rubrics, feedback drafts on student work, simpler explanations for different learners, parent letters.
- **Students:** step-by-step help on homework (with the teacher's rules), practice quizzes, language practice, explaining a paragraph in simpler words.
- **Offline classrooms:** one server in the school, reached over Wi-Fi from cheap laptops or tablets, so a whole class can use AI with no internet at all.

## 3. Care points

- **Children's data:** extra legal protection in all four countries (DPDP parental consent in India, COPPA and FERPA in the USA, UK GDPR's children's code, provincial laws in Canada). Local keeps it in school; still use accounts and short retention.
- **Content:** use instruction-tuned models from major publishers, a clear system prompt for age and tone (Lesson 10.2), and teacher review.
- **Honesty:** set rules for when AI help is allowed and how to say it was used.

## 4. A sensible setup

Teacher: a 16 GB laptop with Gemma 4 E4B or 12B (Module 9). Classroom: a 32 to 64 GB machine running a 12B model with batching for 30 students (Lessons 15.1 and 15.2) and Open WebUI with class accounts, on the school Wi-Fi only.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a class asks in bursts, so plan for the start of the activity.

**Equation:** peak load ≈ students × share asking in the same minute.

**Analogy:** the queue at a school canteen in the first five minutes of lunch.

**Try it:** 35 students, half asking within the same minute, 300-token answers at 40 tokens per second without batching? (About 17 answers × 7.5 s ≈ 2 minutes for the last student: turn on batching.)
</details>

## 5. Worked scenario

*Made-up school.* A government higher secondary school in a hill district with slow internet installs a 64 GB mini PC in the computer lab, running a 12B model with 8 parallel slots. Students use it for practice questions in Physics and English in lab periods. Teachers prepare worksheets on it at school. No student work leaves the lab.

## 6. Practice

1. Write a system prompt line that sets the age and tone for your class.
2. What should a student do with an AI answer before using it?
3. Why do accounts matter even in an offline classroom?

<details>
<summary>Answers</summary>

1. For example: "You are a patient tutor for 14-year-olds. Explain step by step, ask a question back, never give the final answer to homework."
2. Check it against the textbook or ask the teacher.
3. Each student's chats stay private, and the teacher can see who needs help.
</details>

**New words:** *classroom server*, *age-appropriate*, *parental consent*.
