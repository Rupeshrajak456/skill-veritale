# Module 1: Intake

Part of the Veritale skill. Read `SKILL.md` first.

## Purpose

Turn the user's request into a clear brief before any history is written. A vague brief is the most common cause of a vague or padded answer.

## What to find out

| Setting | Values | Default if the user says nothing |
|---|---|---|
| Topic | A named event, person, place or period | Required. Ask if it is missing. |
| Scope | A start and end date, or "the event itself" | The event plus its immediate causes and results |
| Mode | `full`, `timeline` or `story` | `full` |
| Audience | `students`, `general readers` or `specialists` | `general readers` |
| Length | Short (about 300 words), medium (about 700) or long (about 1,500) | Medium |
| Region focus | Any regional angle the user wants stressed | None |

## Steps

1. Read the request and fill in every setting you can. Words such as "timeline", "dates" or "chronology" point to `timeline` mode. Words such as "story", "tell me", "narrative" or "for my class" point to `story` or `full` mode.
2. Check whether the topic is ambiguous. "The Battle of Panipat" could mean 1526, 1556 or 1761. If the request could mean two or more different events, ask one short question that lists the options. Do not ask about anything else.
3. If the topic is clear, do not ask questions. Use the defaults and state them in the scope line of the output.
4. Narrow scope that is too wide. "The history of India" cannot be graded claim by claim in one answer. Offer a narrower topic, or choose one, and say which you chose.
5. Write the brief in one line. You will print it at the top of the output.

## Output of this module

A single brief line, for example:

```
Scope: c. 268 BCE to c. 232 BCE | Mode: full | Audience: students | Length: medium
```

## Checks before moving on

- The topic names one event, person or period.
- The mode decides which modules you will load next. Skip module 4 in `story` mode and module 5 in `timeline` mode.
- You have not asked more than one question.
