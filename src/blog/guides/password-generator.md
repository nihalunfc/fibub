---
title: "Password entropy explained: how many random bits keep you safe"
summary: "What makes a password hard to guess, how bits of entropy are counted, and how to use the password generator to make long random passwords on your own device."
tools: [password-generator, password-strength, hash-checker, uuid-generator]
updated: 2026-11-10
sources:
  - "W3C Web Cryptography API: crypto.getRandomValues returns cryptographically strong random values."
  - "NIST Special Publication 800-63B, Digital Identity Guidelines: favour length, allow all printable characters, and do not force regular changes without cause."
  - "Entropy of a uniformly random choice = log2(number of equally likely outcomes); standard information theory (Shannon, 1948)."
---

The password generator makes random passwords on your own device, from 8 to 128 characters, using the characters you choose. It tells you how many bits of randomness each one carries, so you can see at a glance whether a password is fit for an email account or a bank login. It is for anyone setting up a new account, IT staff handing out first-time logins, and students learning why "P@ssw0rd1" is a poor choice. To test a password you already use, try the [[password-strength|password strength checker]]; to confirm a downloaded file has not been changed, the [[hash-checker]] compares fingerprints; and for random labels that are not secrets, the [[uuid-generator]] makes IDs.

## What it is

An attacker who steals a scrambled password list tries guesses, very fast, until one matches. Your defence is a password with so many possibilities that the guessing never finishes.

If each character is picked at random from a **pool** of P characters, and the password has L characters, the number of possible passwords is P to the power L. **Entropy** measures this in **bits**:

entropy = L × log2(P)

Each bit doubles the attacker's work.

Two things matter about that formula. Length counts more than variety, because L multiplies while P only sits inside a logarithm. And the formula holds only when every character is truly random. A password you invent has far fewer bits than the formula suggests, because people follow patterns.

The generator uses `crypto.getRandomValues`, the browser's secure random source, and a method called **rejection sampling**: random numbers that would make some characters slightly more likely are thrown away and drawn again, so every character in the pool is equally likely.

When you ask for **at least one character from each ticked set**, a few possible passwords are ruled out. The tool counts exactly how many remain (by inclusion-exclusion: all passwords, minus those missing a set, plus those missing two, and so on), so the bits shown are a touch lower than L × log2(P).

## How to use it

1. Type a **Length** from 8 to 128. It starts at 20.
2. Type **How many** passwords you want, from 1 to 100. It starts at 5.
3. Under **Use these characters**, tick any of lower case, upper case, digits and symbols. Untick symbols if a site will not accept them.
4. Tick **Leave out look-alikes** if the password will be read aloud or copied from paper, and keep **At least one from each ticked set** for sites that insist on a digit or a symbol.
5. Read the line above the list: the bits of randomness, a rating (weak, fair, strong or very strong) and the size of the pool.
6. Press **Copy** beside a password, or **Copy all** for the whole list. **Make new ones** draws a fresh set; changing any setting does the same.

## A worked example

A site allows letters and digits but no symbols, and a maximum of 16 characters. Set **Length** to 16, untick **Symbols**, and keep the other two boxes as they are.

The pool is 26 + 26 + 10 = **62 characters**. With no rules, entropy is 16 × log2(62) = 16 × 5.954 = **95.3 bits**. Requiring a lower case letter, a capital and a digit removes a tiny share of passwords, and the tool shows **95.2 bits**, rated **strong**.

Now tick **Leave out look-alikes**. That removes o and l from the lower case, O and I from the capitals, and 0 and 1 from the digits, leaving 24 + 24 + 8 = **56 characters**. The line now reads **92.8 bits**: you gave up about 2.4 bits for easier reading.

To see what that means, imagine an attacker making a trillion (10^12) guesses a second. On average they need to search half the possibilities. For the 95.2-bit password that is 2^95.2 ÷ 2 ÷ 10^12 seconds, roughly **710 million years**. Compare a random 8-letter, lower-case-only password: 8 × log2(26) = **37.6 bits**, found on average in about **0.1 seconds**.

If the site allowed 20 characters, the same three sets would give **119.0 bits**, rated very strong.

## Where it is used

- **Password managers:** make a new random password for every account and let the manager remember it, so one leak does not open the rest.
- **Wi-Fi keys:** a long password with look-alikes left out is easy to type into a smart TV or a printer.
- **First-time logins at work:** IT staff can make a batch for new starters, then ask each person to change theirs.
- **Teaching security:** the bits figure shows students, in numbers, why length beats clever substitutions.

## Common mistakes

- **Editing the password to make it memorable.** Swapping a few characters for your initials removes randomness. Keep it exactly as made and store it in a password manager.
- **Reusing one strong password.** Strength does not help if one site leaks it and the same password unlocks others. Make one per account.
- **Choosing the minimum length.** If a site accepts 64 characters, use 20 or more. Extra length costs you nothing when a manager types it.
- **Thinking symbols are required.** Four more random letters add more strength than adding symbols to a short password. Untick symbols freely where they cause trouble.

## Questions people ask

**Can the website see the passwords it makes?** No. They are built by code running in your browser and are never sent anywhere or saved; close the tab and they are gone.

**Why does the bits number drop when I tick "each set"?** Because a few passwords, such as ones with no digit, are now not allowed. Fewer possibilities means slightly fewer bits, though the change is tiny at normal lengths.

**Should I change passwords every few months?** Current guidance from NIST says to change one when there is a reason, such as a leak, rather than on a timer. A long random password kept in a manager can stay as it is.
