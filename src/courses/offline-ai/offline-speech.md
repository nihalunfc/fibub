---
title: Offline speech to text and text to speech
seoTitle: Offline speech to text and voice with Whisper | Offline AI
summary: Turn recordings into text with Whisper and give your assistant a voice with Piper, both offline. Build a push-to-talk voice assistant that never sends a sound to the internet.
minutes: 35
updated: 2026-11-22
sources:
  - 'Radford et al. (2022), Robust Speech Recognition via Large-Scale Weak Supervision (Whisper), https://arxiv.org/abs/2212.04356'
  - 'faster-whisper (MIT), https://github.com/SYSTRAN/faster-whisper'
  - 'whisper.cpp (MIT), https://github.com/ggml-org/whisper.cpp'
  - 'Piper text to speech, https://github.com/OHF-Voice/piper1-gpl'
quiz:
  - q: In the voice assistant, what does the language model actually receive?
    choices: ['The sound file', 'The text that Whisper wrote down', 'A picture of the sound']
    ans: 1
    why: Speech-to-text turns sound into text first. The chat model reads text and writes text; Piper turns that back into sound.
  - q: Whisper "small" is less accurate on your accent than "large-v3". What do you trade by switching?
    choices: ['Privacy', 'Speed and memory: larger models are slower and need more memory', 'Nothing']
    ans: 1
    why: Larger Whisper models are more accurate but several times slower, which matters on a laptop CPU.
  - q: What must you do once while online?
    choices: ['Nothing; models come with the library', 'Download the Whisper model and the Piper voice; after that it works offline', 'Log in to a cloud account']
    ans: 1
    why: Both tools download their model files on first use. Once they are on disk, no internet is needed.
---

**Module 13 · about 35 minutes · read first: 11.2.** You'll be able to transcribe audio offline and build a voice assistant. This lesson is **mini project 4: Offline voice assistant**.

<div class="bigidea">A voice assistant is three offline models in a row (sound to text, text to text, text to sound), and the wait you hear is the time of all three added up.</div>

## 1. Why this matters

Meetings, interviews, lectures, patient visits and voice notes are full of useful information, and they are some of the most private things people record. Offline transcription keeps them on your machine. A local voice assistant works with no signal at all.

## 2. Speech to text: Whisper

**Whisper** is an open speech recognition model (MIT licence) that handles about 100 languages. Two fast offline engines run it: **faster-whisper** (Python) and **whisper.cpp** (C++, also on phones). Sizes:

| Model | Parameters | Good for |
|---|---|---|
| tiny, base | 39M, 74M | Quick notes, fast CPUs only |
| small | 244M | Most laptops, clear speech |
| medium, turbo | 769M, 809M | Accents, noisy rooms, meetings |
| large-v3 | 1.55B | Best accuracy, wants a GPU |

```python
from faster_whisper import WhisperModel   # pip install faster-whisper

model = WhisperModel("small", device="cpu", compute_type="int8")   # downloads once, then offline
segments, info = model.transcribe("meeting.mp3")
print("Language:", info.language)
for s in segments:
    print(f"[{s.start:6.1f}s] {s.text}")
```

On a graphics card use `device="cuda", compute_type="float16"`. Feed the transcript to your chat model for a summary and action list, or add it to your document index (Module 12).

**How fast?** Speed is often given as a multiple of real time. If a 12-minute recording takes 3 minutes to transcribe, that is 12 ÷ 3 = 4 times faster than real time. Measure it once on your own machine and you can plan any batch.

<div class="problem" data-problem="offline-speech-batch"></div>

## 3. Text to speech: Piper

**Piper** is a small, fast offline voice engine with many voices and languages. Install and fetch a voice once:

```
pip install piper-tts
python -m piper.download_voices en_US-lessac-medium
python -m piper -m en_US-lessac-medium -f hello.wav -- "Hello. I run entirely on this computer."
```

Play `hello.wav` with any audio player. Piper's command names have changed between versions, so if a command fails, check the project's README for the current form.

## 4. Put it together: a voice assistant

```python
import subprocess
import sys

import ollama
import sounddevice as sd          # pip install sounddevice soundfile
import soundfile as sf
from faster_whisper import WhisperModel

RATE = 16000
stt = WhisperModel("small", device="cpu", compute_type="int8")

while True:
    input("Press Enter, then speak for 5 seconds (Ctrl+C to quit)...")
    audio = sd.rec(5 * RATE, samplerate=RATE, channels=1)
    sd.wait()
    sf.write("question.wav", audio, RATE)

    segments, _ = stt.transcribe("question.wav")
    question = " ".join(s.text for s in segments).strip()
    print("You said:", question)

    reply = ollama.chat(model="gemma4:e4b", messages=[
        {"role": "system", "content": "Answer in at most two short sentences that sound natural spoken aloud."},
        {"role": "user", "content": question},
    ])["message"]["content"]
    print("Assistant:", reply)

    subprocess.run([sys.executable, "-m", "piper", "-m", "en_US-lessac-medium",
                    "-f", "reply.wav", "--", reply], check=True)
    data, rate = sf.read("reply.wav")
    sd.play(data, rate)
    sd.wait()
```

The system prompt matters: spoken answers must be short and free of lists and symbols.

One question through the chain, with typical laptop times:

<div class="steps">
<div class="step"><p><b>Record.</b> You press Enter and speak for 5 seconds: "What time does the sun set today?" The sound is saved as <code>question.wav</code>.</p></div>
<div class="step"><p><b>Sound to text.</b> Whisper small turns the sound into text in about <b>1.2 seconds</b>. From here on, the chat model only ever sees these words, never your voice.</p></div>
<div class="step"><p><b>First word of the reply.</b> Gemma 4 E4B reads the question and starts its answer after about <b>0.5 seconds</b>.</p></div>
<div class="step"><p><b>The rest of the reply.</b> 40 tokens at 25 tokens a second = <b>1.6 seconds</b>.</p></div>
<div class="step"><p><b>Text to sound.</b> Piper turns the text into speech in about <b>0.4 seconds</b>. You hear the answer 1.2 + 0.5 + 1.6 + 0.4 = <b>3.7 seconds</b> after you stop talking.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a voice assistant is a chain; the delay you hear is the sum of every link.

**Equation:** response time ≈ speech-to-text time + time to first token + reply tokens ÷ decode speed + text-to-speech time.

**Analogy:** a relay race with four runners. The team's time is the sum of all legs, so speeding up the fastest runner does little; find the slowest leg. Where it breaks: engines can overlap legs (speaking the first sentence while the rest is written), which is how commercial assistants feel instant.

**Try it:** Whisper 1.2 s, first token 0.5 s, 40 tokens at 25 tok/s, Piper 0.4 s. Total? (1.2 + 0.5 + 1.6 + 0.4 = 3.7 seconds.)
</details>

<div class="meaning">

<dl>
<dt>speech-to-text time</dt><dd>how long Whisper takes to turn your words into text</dd>
<dt>time to first token</dt><dd>how long the chat model reads before it writes the first piece of its reply</dd>
<dt>reply tokens ÷ decode speed</dt><dd>how long it takes to write the rest of the reply</dd>
<dt>text-to-speech time</dt><dd>how long Piper takes to turn the reply into sound</dd>
<dt>Physical meaning</dt><dd>A relay race: the team's time is every leg added together. Making the fastest runner faster changes little; find the slowest leg. Short spoken replies help twice, because they cut both the writing leg and the speaking leg.</dd>
</dl>

</div>

<div class="problem" data-problem="offline-speech-chain"></div>

<div class="myth">

**"The chat model listens to my voice."** In this setup it never hears a sound. Whisper writes down what you said, and the chat model reads that text. If Whisper mishears a name, the chat model answers the wrong question. So when answers seem odd, print the transcript first.

</div>

## 5. Worked example

*Made-up numbers.* A family doctor records consultations (with consent) on a clinic laptop. Whisper medium transcribes a 12-minute visit in about 3 minutes on the CPU; Gemma 4 12B drafts a structured note in 40 seconds. The doctor checks and edits it. No recording or note leaves the clinic, which keeps it within patient privacy rules (Lesson 17.7).

## 6. Mini project 4: Offline voice assistant

1. Run the voice assistant and ask it five questions.
2. Time each link of the chain with `time.perf_counter()` and find the slowest.
3. Try Whisper `base` and `medium`. Note the speed and the mistakes.
4. Turn off the network and confirm it still works.

## 7. Practice

1. Transcribe a 2-minute voice note with Whisper small and count the mistakes.
2. Change the voice to another Piper voice in a language you speak.
3. Make the assistant save every transcript to a dated text file.

<details>
<summary>Answers</summary>

1. Clear speech usually has a few errors per minute with `small`; names and jargon are the usual misses.
2. Download a voice with `python -m piper.download_voices <voice-name>` (the voice list is in Piper's documentation) and change `-m`.
3. `open(f"{datetime.date.today()}.txt", "a", encoding="utf-8").write(question + "\n")` after transcribing (import datetime).
</details>

**New words:** *speech-to-text* / *STT* / *automatic speech recognition (ASR)*, *text-to-speech* / *TTS* / *speech synthesis*, *transcript* (the written version of a recording).

<div class="keypoints">

- Whisper (through faster-whisper or whisper.cpp) turns speech into text offline in about 100 languages; bigger sizes are more accurate but slower.
- Piper turns text into speech offline; download the model and voice once, then no internet is needed.
- A voice assistant is a chain: speech to text, chat model, text to speech. The wait is the sum of the links.
- Speed as a multiple of real time lets you plan batches: recording length ÷ that multiple = transcription time.
- Ask for short, plain spoken answers; lists and symbols sound bad read aloud.

</div>
