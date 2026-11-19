---
name: code-review
description: >-
  Review existing Vue 3 and TypeScript code from a senior engineer perspective.
  Provides practical feedback on correctness, readability, maintainability, and
  best practices without refactoring. Use when the user invokes /code-review,
  asks for a code review, or wants feedback on .vue or .ts files.
---

# Goal

Analyze existing Vue 3 and TypeScript code and provide practical, balanced feedback that helps improve maintainability, readability, and long-term code quality.

**This is a review skill, not a refactor skill.** Do not rewrite code or apply changes unless the user explicitly asks.

# When to use

- User invokes `/code-review` or asks for a code review
- User wants feedback on a `.vue` or `.ts` file before merging or refactoring
- User asks whether code is maintainable, readable, or follows Vue/TS best practices

**Out of scope unless requested:** automatic refactoring, rewriting entire files, implementing fixes, or nitpicking style preferences.

# Review Workflow

1. **Read the full file** — understand data flow, API calls, template bindings, and side effects
2. **Identify context** — new feature, bug fix, refactor, or API integration; adjust focus accordingly
3. **Review systematically** — apply each perspective below; skip sections with nothing meaningful to say
4. **Prioritize findings** — bugs and behavioral risks first; optional suggestions last
5. Identify strengths before weaknesses to provide balanced feedback.
6. **Present feedback** — use the output format below; explain trade-offs when multiple approaches exist

# Review Perspectives

## Correctness

- Does the code appear logically correct?
- Are there edge cases or potential bugs?
- Are there unnecessary assumptions?
- Verify that behavior is supported by the actual implementation before reporting an issue.

## Readability

- Is the intent immediately understandable?
- Are names descriptive?
- Is the code easy for teammates to follow?

## Simplicity

- Is there unnecessary complexity?
- Is there over-engineering?
- Is there premature abstraction?
- Would a simpler implementation be easier to maintain?

## Maintainability

- Is duplicated logic acceptable or should it be extracted?
- Are responsibilities clearly separated?
- Is the file becoming too difficult to navigate?

## Vue Best Practices

Evaluate usage of:

- ref/reactive
- computed
- watch
- composables
- template readability
- component organization

## TypeScript

Review:

- type safety
- unnecessary annotations
- duplicated types
- type inference opportunities

## Performance

Only mention realistic performance issues.
Do not suggest micro-optimizations.

## API Design

Review API usage only when relevant.
Avoid unnecessary mapping or abstraction.

# Severity Levels

## Must Fix
- May introduce bugs
- May break behavior
- Significant maintainability issue

## Should Fix
- Clear readability or maintainability improvement

## Nice to Have
- Minor cleanup
- Personal productivity improvements
- Non-critical simplifications

# Output Style

Do not rewrite the entire file unless explicitly requested.

Instead, organize the review into:

### 👍 Strengths

Things that are already well implemented.

### ⚠️ Issues

Problems that should be fixed.

For every issue:

- Explain why.
- Explain the trade-offs.
- Estimate the impact (Must Fix / Should Fix / Nice to Have).
- Reference specific locations (function names, line ranges, or code patterns) when possible.

### 💡 Suggestions

Optional improvements or alternative approaches.

For suggestions, note they are optional and include trade-offs when relevant.

# Review Principles

- **Avoid nitpicking** — skip feedback that only reflects personal preference
- **Be balanced** — acknowledge what works well, not only problems
- **Be practical** — prioritize advice that improves real-world maintainability
- **Explain trade-offs** — when multiple solutions exist, compare them instead of insisting on one "correct" answer
- **Acceptable duplication** — not all repetition needs extraction; flag only when abstraction clearly wins
- **Distinguish severity** — separate must-fix issues from nice-to-have suggestions
- Support every issue with concrete evidence from the code.
- Avoid hypothetical or speculative criticism.
- Prefer consistency with the existing project over introducing a different style or pattern.
- When identifying an issue, explain the reasoning rather than simply citing a rule.
- Focus on helping the developer understand why a change is valuable.
- Do not recommend changes solely to satisfy a best practice if the current implementation is already clear, maintainable, and consistent with the project.

# Relationship to /refactor

| | `/code-review` | `/refactor` |
|---|---|---|
| Purpose | Analyze and advise | Improve code in place |
| Output | Feedback report | Modified code |
| Behavior changes | Never | Never (unless fixing a requested bug) |

If the user wants both, review first; refactor only when explicitly requested afterward.

# Quick Checklist

Use as a mental model during review — not every item applies to every file.

- [ ] Async/loading states handled correctly (especially `finally` for loading flags)
- [ ] Watchers vs event handlers — is `watch` justified?
- [ ] Template complexity — are repeated conditions extracted where it helps?
- [ ] API field names match response DTOs (no unnecessary mapping layers)
- [ ] Types derived from API functions where possible (`Parameters<>`, `ReturnType<>`)
- [ ] Parallel API calls use `Promise.all` when independent
- [ ] Edge cases: empty data, null/undefined, race conditions on rapid user input
- [ ] File size and section organization — is navigation reasonable?

# Overall Assessment

Use one of:

- Excellent: Clean, maintainable, no meaningful issues.
- Good: Mostly solid with a few worthwhile improvements.
- Fair: Several maintainability concerns that should be addressed.
- Needs Improvement: Significant issues affecting correctness or maintainability.

# After the review

Finish with:

- Highest priority issue
- Biggest maintainability opportunity
- Overall assessment