## Agent skills

### Issue tracker

Issues and specs are local markdown files under `docs/planning/`, one folder per feature, each starting from an `INTENT.md`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Working rules

### Workflow

A feature moves through `INTENT.md` → `/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement`, one stage at a time. The developer starts each stage; finish the current one and wait for them to start the next. `/implement` reviews with `/code-review`, and its commit follows Review until clean below. Prompt the developer to clear the context and to review the spec and tickets manually when running implement.

Whenever you ask the developer for a manual check (a ticket's closing check under `/implement`, or any other), write its steps out in chat as a numbered checklist: where to go, what to do and what they should see at each step, including any setup (starting `pnpm dev`, opening devtools, switching the theme or the window width). Base them on the ticket's or spec's manual check, so the developer can follow along without opening the ticket. Take every URL, port, path, storage key and command in them from the project's config, scripts and code, never from a tool's default.

### Keep the build green

Before every commit, run `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start with the same `pnpm` and Node the developer uses. Commit only when all of them pass: chain the checks and the commit with `&&`.

- A check that passes only through a workaround (another binary, an env var, a manual step) has failed. Report it and agree the fix with the developer before committing. Version bumps to dependencies or tooling must run with the developer's existing tools.
- Every failure seen while verifying is real, including a one-off that looks environmental. Resolve it with the developer before calling the work done.
- Ask the developer to stop their `pnpm dev` before installing or removing dependencies. Start a test dev server only while theirs is stopped: every Vite server shares `node_modules/.vite/deps`. Start it as `env -u CLAUDECODE -u AI_AGENT pnpm dev`, which runs Vite as the developer's own `pnpm dev` does (not a workaround): Vite changes its config when it detects an agent, and the deps would be rebuilt each time the two servers alternate. Stop it by its process IDs, never with `pkill -f`.

### Review until clean

After `/code-review`, repeat: fix the findings, verify as above, then have both the Standards and the Spec agents review again. Commit once both report nothing to fix. When the only fixes are wording changes, a re-review is usually unnecessary: use judgment, and re-review when a wording fix changes a fact, an instruction or the meaning. Tell the developer which round a change is on.

### Code conventions

Lint enforces style (`eslint.config.js`): double quotes, trailing commas, semicolons, 2-space indent, arrow functions wherever possible, object destructuring, named exports only (default exports only in tool config files), and the import and export order below. Review also checks the conventions lint can't:

- **Components are typed with `FC`.** Use `FC` for components without props and `FC<ComponentNameProps>` for components with props. Props interfaces are named `<ComponentName>Props`, never a bare `Props`, because barrels re-export with `export *` and bare names would collide. Import `FC` as a type-only import. The one exception is generic components, which annotate their props parameter instead.
- **No generics without a reason.** Add a generic type parameter only when it actually links or constrains types that callers rely on. If a type would be erased downstream, or only inferred from the argument and never checked, use `unknown` or a concrete type instead.
- **Imports** use the `@/` alias for `src/`. They sit in up to three sections, in this order, with one blank line between sections and empty sections left out:
  1. Packages: `"react"`, `"@mantine/core"`, `"node:url"`.
  2. The `@/` alias.
  3. Relative files: `"./…"` and `"../…"`.

  Within a section, sort the imports by their module path, alphabetically: lowercase both paths, then compare them character by character (so `"eslint-plugin-x"` comes before `"eslint/config"`). Sort the names inside braces the same way, ignoring any `type` keyword: `import { alpha, beta, type Gamma } from "lib";`. Re-exports (`export … from`, as in barrels) follow the same order. An `import type` from a module goes right after the value import from the same module. Side-effect imports (`import "./styles.css";`) follow the same rules: `"./styles.css"` sorts into the relative section. When their order matters, comment why it holds, as `main.tsx` does for loading Mantine's styles before ours. Lint enforces this order (`eslint-plugin-perfectionist`), except the `import type` placement, which review checks.
- **Readable over clever.** Write the plainest code that does the job, so a reader understands it at first glance: an `if` over a dense one-liner, a named variable over a nested expression, a plain comparison over a `reduce` or a chained ternary, and the obvious language feature over a trick. When code still isn't obvious, add a comment saying what it does and why.
- **Barrels:** each area of `src/` has an `index.ts` barrel, except `styles`, and `components` until its first Shared Component. Page and component folders don't get their own barrels. A Page that should be lazy-loaded must be imported from its own file, never through the `@/pages` barrel.
- **Pages** live one per folder under `src/pages/`, with their SCSS module next to them.
- **Shared types** go in `src/interfaces/`, one file per type, with the types derived from it in the same file.
- **Mantine** (ADR-0002): UI components come from `@mantine/core`, imported directly. Custom styles go in the Page's or component's SCSS module, using Mantine's CSS variables and the `mantine` helpers that Vite injects into every SCSS file. Translate Mantine docs examples written for `postcss-preset-mantine` to the Sass form: `mantine.rem(…)`, `@include mantine.<mixin>`, `mantine.$mantine-breakpoint-*`.
- **Environment variables** go in `.env` (committed, safe defaults), are typed in `src/vite-env.d.ts`, and are overridden in the gitignored `.env.local`.

### Grilling sessions

Start from the feature's `INTENT.md`, following `docs/agents/issue-tracker.md` for the feature slug and when the folder or `INTENT.md` is missing. Write each round's questions to `docs/planning/<feature-slug>/round_<N>_questions.md`, with an empty **Answer:** under each question, and give only a short pointer in chat. A grilling session produces documents only (the round files, `CONTEXT.md`, ADRs) and ends with the shared-understanding summary; implementation starts separately.
