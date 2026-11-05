# Veritale

**An evidence-graded skill for telling history as a story with large language models**

Veritale is an Agent Skill, written in Markdown, that lets an AI agent turn historical events and dates into a timeline and a story while labelling every claim:

| Label | Meaning |
|---|---|
| **Verified** | Historians broadly agree, and the claim rests on early or independent evidence. |
| **Disputed** | Credible sources or historians disagree. |
| **Legend** | The claim comes only from a much later source or from tradition. |

Project website: https://rupeshrajak456.github.io/skill-veritale/

## The skill files

The skill is modular. The agent reads `SKILL.md` first and opens each module only when it reaches that step.

| File | Role |
|---|---|
| `SKILL.md` | Entry file: labels, hard rules, workflow and which module to open next |
| `module-1-intake.md` | Fixes topic, scope, mode, audience and length |
| `module-2-fact-table.md` | Lists every claim with its date and earliest source |
| `module-3-evidence-grading.md` | Assigns Verified, Disputed or Legend through four ordered tests |
| `module-4-timeline.md` | Sorts graded claims into date order |
| `module-5-narrative.md` | Writes the story; only Verified claims carry the plot |
| `module-6-uncertainty-note.md` | Adds "What we are unsure about" and a ten-point self-check |
| `examples.md` | Two worked examples: Hastings 1066 and Ashoka's Kalinga war |

## Using the skill

1. Put `SKILL.md`, the six module files and `examples.md` together in one folder named `veritale`.
2. Add the folder as a skill in any agent that supports the Agent Skills format. In an ordinary chat, paste `SKILL.md` first and then each module when the agent reaches that step.
3. Ask a history question, for example: "Tell the story of the Battle of Plassey for my class."

## The website files

`index.html`, `style.css`, `script.js` and `data.js` make up the project website. The site reads the skill files directly when it is published, so the module explorer always shows the current versions.

## Author

Rupesh Rajak
M.A., Digital Humanities and Social Sciences
Indian Institute of Technology (Indian School of Mines) Dhanbad
Contact: 25ma0009@iitism.ac.in

## Citation

Rajak, R. (2026). *Veritale: An evidence-graded skill for telling history as a story with large language models* [Agent skill and project website]. Indian Institute of Technology (Indian School of Mines) Dhanbad. https://rupeshrajak456.github.io/skill-veritale/

A machine-readable citation is in `CITATION.cff`.

## Licence

The skill files and website are released under the MIT License. See `LICENSE`.
