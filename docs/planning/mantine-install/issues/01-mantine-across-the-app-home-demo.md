# 01: Mantine across the app, with Home rebuilt as the demo

**Status:** ready-for-agent

**Blocked by:** None (can start immediately)

**Spec:** `docs/planning/mantine-install/spec.md` · **ADR:** ADR-0002

**What to build:** Mantine is installed and configured once for the whole app, so any Page can import its components directly. The Home Page is rebuilt with Mantine to demonstrate it on real data: opening `/` shows a Mantine loader while the Items load, then one green-themed card per Item in Mantine's typography, inside a centered container. If loading fails, a Mantine alert shows the existing error message.

- [x] Ask the developer to stop their `pnpm dev` before installing dependencies
- [x] `@mantine/core` and `@mantine/hooks` are runtime dependencies at `^9.6.3`. No other Mantine packages, and no PostCSS preset or PostCSS config
- [x] A theme module next to the query client module exports a named `theme` from `createTheme`, setting only `primaryColor: "green"` and `defaultRadius: "md"`
- [x] The entry module wraps the app in `MantineProvider` with that theme, inside `StrictMode`, around the existing Query Client provider and router. Color scheme stays at the default (light), and the HTML entry page is unchanged
- [x] Mantine's base stylesheet is imported before the global stylesheet
- [x] The global stylesheet keeps its import and header comment, but loses the font-stack variable, the box-sizing reset and both `body` rules. The comment is reworded if it no longer fits
- [x] Home uses a `Container` rendered as `main` (keeping the main landmark), `Title` for the heading, and `Text` for the intro line with its existing `.intro` class from Home's SCSS module (unchanged in this ticket)
- [x] While Items are pending, Home shows a Mantine `Loader`
- [x] On error, Home shows a Mantine `Alert` in the error color, with a short title and the existing "Could not load Items." message
- [x] When loaded, Home shows a `Stack` of `Card`s, one per Item and keyed by `id`, with `name` as title-weight text and `description` as dimmed `Text`
- [x] Home is still typed `FC` with a named export, and still gets its data from the `useItems` API Hook
- [x] Mantine components are imported directly from `@mantine/core`, and nothing is added to a `@/components` barrel
- [x] `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start all pass with the developer's pnpm and Node
- [x] Manual check on `/`: loader during the mock delay, then green-themed cards with `md` corners and Mantine's font. The error branch is verified by reading the code, since the mock adapter can't fail

## Comments

- 2026-10-05: Implemented. `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start pass with pnpm 10.34.5 and Node 22.23.3. Code review (Standards + Spec) is clean after round 1, whose only fix was a GUIDE.md wording change. The developer did the manual check on `/`: the page loads, and the theme's primary color resolves to green.
