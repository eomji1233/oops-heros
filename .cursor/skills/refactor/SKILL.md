---
name: refactor
description: >-
  Safely refactor existing Vue and TypeScript code without changing behavior.
  Use when the user asks to refactor, clean up, simplify, or improve readability
  of .vue or .ts files, or mentions /refactor.
---

# Goal

Improve maintainability and readability of existing Vue/TypeScript code while preserving behavior, business logic, and type safety. Refactoring is a quality pass—not a feature change.

# When to use

Apply this skill whenever refactoring existing Vue or TypeScript code in place:

- User invokes `/refactor` or asks to refactor, clean up, or simplify a file
- Code works but is hard to read, repetitive, or over-abstracted
- Scope is a single file unless the user explicitly expands it

**Out of scope unless requested:** new features, behavior changes, splitting files, or creating new composables/components/stores.

# Core Principles

- **Preserve behavior** — same conditions, branches, API call order, and UI outcomes
- **Preserve business logic** — do not "fix" bugs or change product rules during refactor
- **Preserve type safety** — keep existing types; prefer inference and API-derived types
- **Stay in the current file** — no new files, composables, components, or stores
- **Avoid over-engineering** — skip abstractions that teammates cannot read at a glance
- **Prefer readability over DRY** — if deduplication adds complexity, leave the duplication
- **Apply selectively** — not every checklist item applies to every file; use judgment
- Do not refactor solely to eliminate duplication.
- Small, obvious duplication is often preferable to complex abstractions.
- If a change provides only stylistic benefit while increasing the diff size, prefer leaving the original code unchanged.
- Prefer existing project patterns over introducing new patterns.

When multiple approaches are valid, choose the simplest one teammates can understand immediately.

# Stop Conditions

Stop refactoring when:

- readability no longer improves
- abstraction starts hiding intent
- changes become unrelated to the original request

# Refactoring Workflow

1. **Read the entire file** — understand data flow, API calls, template bindings, and side effects before editing
2. **List improvement targets** — duplication, unnecessary refs/computed, long functions, repeated template expressions
3. **Prioritize safe wins** — constants, naming, dead code, unused imports, obvious repetition
4. **Refactor incrementally** — one meaningful improvement at a time; avoid large unrelated rewrites
5. Validate each change before continuing — avoid stacking multiple unrelated refactors at once.
6. **Reorganize if helpful** — group script setup sections: types → constants → helpers → state → computed → API → handlers → watch/lifecycle
7. **Verify behavior unchanged** — confirm conditions, async flow, loading states, and template output match the original

# Refactoring Checklist

Use as a guide, not a mandate. Skip items that do not clearly improve the file.

## Constants

- [ ] Immutable arrays/objects → `const`, not `ref`/`reactive`
- [ ] Repeated literals (labels, colors, magic numbers) → named constants
- [ ] Group related constants near the top (`// ─── 상수` or `// ─── Constants`)

## Types

- [ ] Omit annotations where TypeScript infers correctly
- [ ] Extract `interface`/`type` only when reused in multiple places
- [ ] Derive API types: `Parameters<typeof fn>[0]`, `Awaited<ReturnType<typeof fn>>`
- [ ] Avoid duplicate payload/response types that mirror API definitions

## ref / reactive / computed

- [ ] Remove `computed` that only pass through a single value
- [ ] Prefer `ref` over `reactive` (destructuring safety)
- [ ] Derive values in `computed`, not inside `watch` callbacks
- [ ] Merge N parallel refs with the same shape into `Record<Key, T>` when it reduces noise
- [ ] Collapse single-use computed chains into one computed

## watch

- [ ] Short callbacks (≤3 lines) → inline; do not create watch-only wrapper functions
- [ ] Multi-line callbacks → readable blocks, not one-line compression
- [ ] Extract to a named function only when reused elsewhere
- [ ] Remove unnecessary `immediate: true`
- [ ] Prefer event handlers over `watch` for simple open/close/reset on user action

## Functions

- [ ] No 1–3 line wrappers — inline at the call site or inside the caller
- [ ] Split functions longer than ~30 lines by meaning
- [ ] Use early returns to flatten nested `if`
- [ ] Merge N similar functions into one parameterized function + `Record` map (e.g. `API_BY_PANEL`)

## Duplicated code

- [ ] Unify repeated ref initialization via spread from defaults (`[...DEFAULT_ITEMS]`)
- [ ] Extract shared payload builders (date formatting, filter params)
- [ ] Prefer `Record` + single function over copy-pasted fetch/handler variants
- [ ] **Stop if dedup hurts clarity** — duplication is acceptable when abstraction costs more

## Expressions

- [ ] Extract repeated conditions to variables or small helpers
- [ ] Nested ternaries → max 2 levels
- [ ] Use `?.` only when value can actually be undefined
- [ ] Empty checks via `.length`, not mixed `=== 0` / `> 0` styles

## async / await

- [ ] Use `async/await` only when flow control needs it
- [ ] Independent API calls → `Promise.all`, not sequential awaits
- [ ] Release loading in `try/finally`; avoid nested `try/catch`

## Loading / error handling

- [ ] Loading flags always cleared in `finally`
- [ ] Remove `console.log` / `console.error` from production code
- [ ] Keep `catch` only where error handling is meaningful

## Template

- [ ] Move complex expressions to script (`computed` or helpers)
- [ ] Repeated conditions in the same dialog/component → script helper functions
- [ ] Simple badge/tag logic can stay inline with a ternary
- [ ] Combine related `v-if`/`v-else-if` when it reads clearer

## Imports

- [ ] Remove unused imports
- [ ] Remove obvious/redundant comments; keep comments that explain non-obvious business logic

## Naming

| Kind | Convention |
|------|------------|
| Lists | `items`, `list`, `rows` |
| Loading | `isLoading`, `isFetching` |
| Booleans | `isOpen`, `hasSearched`, `canSubmit` |
| Handlers | `handleSubmit`, `onSelect` |
| Fetchers | `fetchList`, `loadData` |
| Constants | `UPPER_SNAKE_CASE` |
| API maps | `API_BY_PANEL`, `FETCHERS_BY_TYPE` |

# Decision guide

| Situation | Prefer |
|-----------|--------|
| 3 similar fetch functions | One `fetchX(id)` + API map |
| 3-line wrapper used once | Inline |
| Wrapper used in 3+ places | Named function |
| Computed used only by one other computed | Merge into one |
| Template condition repeated 2+ times in same block | Script helper |
| Deduplication needs generics + indirection | Keep duplication |
| Existing code follows the project convention | Keep the convention instead of introducing a different pattern |

# Success Criteria

A successful refactor should:

- Preserve behavior.
- Reduce cognitive load.
- Improve readability.
- Avoid unnecessary abstractions.
- Produce a review-friendly diff.

# After refactoring

Briefly summarize what changed and why. Focus on maintainability wins—not a line-by-line changelog.
