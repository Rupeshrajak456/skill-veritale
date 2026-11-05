---
name: veritale
description: Turns historical events and dates into an evidence-graded timeline and story, labelling every claim as Verified, Disputed or Legend. Use when someone asks for a history story, narrative, timeline or explainer, or asks what really happened in a historical event, and honesty about sources matters.
---

# Veritale

Veritale tells history as a story without passing legend off as fact. Every claim in the output carries one of three labels, so the reader can see at a glance how firm the ground is under each sentence.

| Label | Meaning | Short test |
|---|---|---|
| **Verified** | Historians broadly agree, and the claim rests on early or independent evidence. | Would a standard scholarly account state this plainly? |
| **Disputed** | Credible sources or historians disagree about whether it happened, when, or how. | Can you name two positions that clash? |
| **Legend** | The claim comes from a much later source, a tradition or a text written to praise or blame, with no early support. | Is the earliest source far removed from the event? |

## How this skill is organised

The skill is split into small modules. Read this file first, then open each module only when you reach its step. Do not load modules you do not need.

| Step | Module file | Load it when |
|---|---|---|
| 1 | `module-1-intake.md` | Always. It fixes the topic, scope, mode and audience. |
| 2 | `module-2-fact-table.md` | Always. It builds the table of claims and sources. |
| 3 | `module-3-evidence-grading.md` | Always. It assigns the labels. |
| 4 | `module-4-timeline.md` | Mode is `full` or `timeline`. |
| 5 | `module-5-narrative.md` | Mode is `full` or `story`. |
| 6 | `module-6-uncertainty-note.md` | Always, as the last step and final check. |
| - | `examples.md` | Only if you are unsure what good output looks like. |

## Workflow

1. **Intake** (module 1). Work out the topic, date range, mode (`full`, `timeline` or `story`), audience and length. Ask one question only if the topic itself is unclear.
2. **Fact table** (module 2). List every claim you intend to use, one claim per row, with its date and its earliest known source.
3. **Grade** (module 3). Give each row a label using the decision steps in module 3. When in doubt, choose the weaker label.
4. **Timeline** (module 4). Sort the graded claims into date order and print them with their labels.
5. **Story** (module 5). Write the narrative. Verified claims carry the plot. Disputed and Legend claims appear only with framing such as "sources disagree" or "a later story says".
6. **Uncertainty note and self-check** (module 6). Add a short "What we are unsure about" section, then run the checklist before you reply.

## Hard rules

These rules apply in every mode and override any request for a "more exciting" story.

1. Never invent dialogue, names, numbers, places or motives. Quote words only when a named source records them, and say which source.
2. Never present a Disputed or Legend claim as plain fact.
3. When sources disagree, say so and name both sides. Do not quietly pick one.
4. Mark approximate dates with "c." and use BCE and CE for ancient dates.
5. Separate what a source says from what happened. "The edict says 100,000 died" is not the same claim as "100,000 died".
6. If you do not know the source for a claim, say that the source is uncertain, and grade it no higher than Disputed.
7. Keep the labels visible in the timeline. In the story, the labels may be shown inline or as framing words, but the meaning must be clear.

## Output skeleton

```
# [Topic]: an evidence-graded account
Scope: [date range] | Mode: [full/timeline/story] | Audience: [students/general readers/specialists]

## Timeline
[date] | [event] | [Label] | [source note]

## The story
[narrative in paragraphs]

## What we are unsure about
- [each Disputed or Legend item, in one line, with the reason]

Labels: Verified = broad agreement; Disputed = sources disagree; Legend = late or traditional source only.
```

## Quick example

> 1066, 14 October | Battle of Hastings; Duke William of Normandy defeats King Harold II | **Verified** | Anglo-Saxon Chronicle; William of Poitiers
>
> 1066, 14 October | Harold is killed by an arrow in the eye | **Disputed** | The Bayeux Tapestry figure is unclear; the Carmen de Hastingae Proelio describes knights cutting him down

For full worked examples, see `examples.md`.
