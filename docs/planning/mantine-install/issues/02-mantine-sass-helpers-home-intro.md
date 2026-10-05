# 02: Mantine Sass helpers in every SCSS file, shown on Home's intro

**Status:** ready-for-agent

**Blocked by:** 01 (Mantine across the app, with Home rebuilt as the demo)

**Spec:** `docs/planning/mantine-install/spec.md` · **ADR:** ADR-0002

**What to build:** Every SCSS file can use Mantine's Sass helpers (`mantine.rem()`, the breakpoint variables and the `hover`, `smaller-than`, `larger-than`, `light`, `dark`, `rtl` and `ltr` mixins) under the `mantine` namespace, without an import, following Mantine's "Usage with Sass" guide. Home's intro line demonstrates it: it's still dimmed and italic, but now styled from its SCSS module through Mantine's CSS variables and helpers instead of a hard-coded color. The project's Code conventions explain how to use Mantine, so reviewers can check against them.

- [x] A partial in the styles area, next to the global stylesheet, is a verbatim copy of `_mantine.scss` from Mantine's "Usage with Sass" guide (`sass:math` use, the five default breakpoint variables, `rem`, and the `light`, `dark`, `hover`, `smaller-than`, `larger-than`, `rtl` and `ltr` mixins)
- [x] The Vite config's `css.preprocessorOptions.scss.additionalData` prepends a `@use` of that partial `as mantine` to every SCSS file, with an absolute path resolved like the existing `@` alias and the guide's backslash-to-slash replacement
- [x] The guide's `api: 'modern-compiler'` key is left out (Vite 8 has no `api` option)
- [x] Home's `.intro` uses `var(--mantine-color-dimmed)` instead of `#555`, stays italic, and uses `mantine.rem()` for any size it sets
- [x] `CLAUDE.md` Code conventions gets one bullet, pointing to ADR-0002, saying that:
  - UI components come from `@mantine/core`, imported directly
  - custom styles go in the Page's or component's SCSS module, using Mantine's CSS variables and the injected `mantine` helpers
  - Mantine docs examples written for `postcss-preset-mantine` are translated to the Sass form (`mantine.rem(…)`, `@include mantine.<mixin>`, `mantine.$mantine-breakpoint-*`)
- [x] `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start all pass with the developer's pnpm and Node. The build compiles every SCSS file through the injected helpers
- [ ] Manual check on `/`: the intro line is dimmed and italic, styled from Home's SCSS module

## Comments

- 2026-10-05: Implemented. `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start pass with pnpm 10.34.5 and Node 22.23.3. The dev server served Home's SCSS module compiled through the injected helpers. Code review (Standards + Spec) was clean on round 1. `.intro` sets no size, so it has no `mantine.rem()` call. The manual check on `/` is left to the developer.
