---
name: skill-creator
description: Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy.
---

# Skill Creator

A skill for building, testing, and iterating on Kiro skills. Jump in wherever the user is in the process — drafting, evaluating, or improving — and work through it together.

## Core loop

```
draft skill → run test cases → user reviews → improve → repeat
```

Don't over-explain the process upfront. Read where the user is and start there.

## Anatomy of a skill

```
skill-name/
├── SKILL.md            (required — YAML frontmatter + instructions)
└── (optional)
    ├── scripts/        Executable helpers for repetitive tasks
    ├── references/     Docs loaded on demand
    └── assets/         Templates, icons, fonts
```

Keep `SKILL.md` under 500 lines. If it's growing too large, move detail into `references/`.

## Writing a SKILL.md

### Frontmatter

```yaml
---
name: my-skill
description: What this skill does and when to use it. Be specific about
  trigger contexts — this is the primary mechanism that causes Claude to
  load the skill. Lean toward "pushy": mention the contexts explicitly
  so the skill doesn't get skipped when it should fire.
---
```

### Body structure

- Start with one sentence saying what the skill does
- Use `##` sections for distinct phases or topics
- Prefer code blocks and tables over prose paragraphs
- Explain the *why* behind instructions, not just the what — LLMs follow reasoning better than bare commands
- Imperative voice: "Run the tests", not "You should run the tests"
- End with a checklist

### Writing style

| Do | Avoid |
|---|---|
| Short sections with examples | Long narrative paragraphs |
| Tables for options/rules | Bullet lists of bullets |
| Code blocks for commands/formats | Vague guidance without examples |
| Explain reasoning | ALWAYS/NEVER in all-caps |

## Running test cases

For each test prompt, spawn two subagents in the same turn — one with the skill, one without (or with the old version when improving):

```
With-skill run:
  Skill path: <path>
  Task: <prompt>
  Save outputs to: <workspace>/iteration-<N>/eval-<name>/with_skill/outputs/

Baseline run:
  No skill (new skill) or old snapshot (improving)
  Save outputs to: <workspace>/iteration-<N>/eval-<name>/without_skill/outputs/
```

Save timing data when each subagent completes — this is the only chance to capture it:

```json
{ "total_tokens": 84852, "duration_ms": 23332, "total_duration_seconds": 23.3 }
```

Write `eval_metadata.json` per eval directory:

```json
{ "eval_id": 0, "eval_name": "descriptive-name", "prompt": "...", "assertions": [] }
```

## Grading and viewing results

After runs complete:

1. Grade each run against assertions — save to `grading.json` using fields `text`, `passed`, `evidence`
2. Aggregate benchmark:
   ```bash
   python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name <name>
   ```
3. Launch the viewer:
   ```bash
   # With display
   nohup python <skill-creator-path>/eval-viewer/generate_review.py \
     <workspace>/iteration-N --skill-name "my-skill" \
     --benchmark <workspace>/iteration-N/benchmark.json > /dev/null 2>&1 &

   # Headless / Cowork — write static file instead
   python <skill-creator-path>/eval-viewer/generate_review.py \
     <workspace>/iteration-N --skill-name "my-skill" --static <output>.html
   ```
4. For iteration 2+, add `--previous-workspace <workspace>/iteration-<N-1>`

Always generate the viewer before evaluating results yourself — get the outputs in front of the user first.

## Reading feedback

When the user is done reviewing, read `feedback.json`:

```json
{
  "reviews": [
    { "run_id": "eval-0-with_skill", "feedback": "missing axis labels" },
    { "run_id": "eval-1-with_skill", "feedback": "" }
  ]
}
```

Empty feedback = no complaints. Focus improvements on the runs that had specific comments.

## Improving the skill

| Principle | What it means in practice |
|---|---|
| Generalize | Don't fix only the specific example — fix the underlying gap |
| Stay lean | Remove instructions that aren't pulling their weight |
| Explain why | If something matters, say why — don't just mandate it |
| Bundle repeated work | If subagents all wrote the same helper script, add it to `scripts/` |

After improving: apply changes, rerun into `iteration-<N+1>/`, launch reviewer with `--previous-workspace`.

Stop when: user says they're happy, all feedback is empty, or no meaningful progress.

## Description optimization

The `description` field controls when Claude loads the skill. To optimize it:

1. Generate 20 trigger eval queries (10 should-trigger, 10 should-not-trigger) — focus on near-misses, not obvious cases
2. Review with user via the HTML template in `assets/eval_review.html`
3. Run the optimization loop:
   ```bash
   python -m scripts.run_loop \
     --eval-set <path> --skill-path <path> \
     --model <current-model-id> --max-iterations 5 --verbose
   ```
4. Take `best_description` from the output and update the frontmatter

## Environment differences

| Feature | Claude Code / Kiro | Claude.ai | Cowork |
|---|---|---|---|
| Subagents | ✅ | ❌ — run cases yourself | ✅ |
| Browser | ✅ | ❌ — show output inline | ❌ — use `--static` |
| Baselines | ✅ | Skip | ✅ |
| Description optimizer | ✅ (`claude -p`) | ❌ | ✅ |
| Packaging | ✅ | ✅ | ✅ |

**Updating an existing skill**: preserve the original `name` field and directory name. The installed path may be read-only — copy to `/tmp/skill-name/`, edit there, then package.

## Reference files

Read these when spawning the relevant subagent:

- `agents/grader.md` — grading assertions against outputs
- `agents/comparator.md` — blind A/B comparison between two versions
- `agents/analyzer.md` — analyzing benchmark patterns
- `references/schemas.md` — exact JSON schemas for evals.json, grading.json, benchmark.json

## Checklist before finishing

- [ ] SKILL.md has YAML frontmatter with `name` and `description`
- [ ] Description mentions specific trigger contexts
- [ ] Body is under 500 lines
- [ ] Test cases run with both with-skill and baseline subagents
- [ ] Viewer generated before self-evaluating results
- [ ] Feedback read and improvements applied
- [ ] Description optimizer run (if in Claude Code / Kiro)
