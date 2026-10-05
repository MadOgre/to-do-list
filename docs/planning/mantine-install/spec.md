Status: ready-for-agent

# Spec: Mantine install

Derived from `INTENT.md` and grilling rounds 1–3 in this folder. The styling decision is recorded in ADR-0002 (Mantine provides the components; custom styles stay in SCSS modules).

## Problem Statement

The app has no component library. Every Page is built from plain HTML elements styled by hand, so building the to-do UI means writing buttons, cards, inputs, loaders and alerts from scratch, each with its own SCSS. The developer wants a ready-made, well-documented component library, installed and configured once with sensible defaults, so that any Page or Shared Component can use it straight away. The library must fit the project's existing SCSS-module styling rather than replace it.

## Solution

Install Mantine (core components and hooks) and configure it once at the app root with a small theme: green primary color, medium radius, light color scheme. Mantine's base stylesheet loads before the app's own global styles. Mantine's Sass helpers (a `rem` function, breakpoint variables, and the `hover`, `smaller-than`, `larger-than`, `light`, `dark`, `rtl` and `ltr` mixins) are available in every SCSS file under a `mantine` namespace, following Mantine's own "Usage with Sass" guide. The Home Page is rebuilt with Mantine components to show the library working with real data: the Item list appears as cards, with a Mantine loader while loading and a Mantine alert on error. Its intro line stays styled from Home's SCSS module using Mantine's CSS variables, which shows the two styling systems working together.

## User Stories

1. As a developer, I want Mantine's core components installed, so that I can build UI from ready-made components instead of raw HTML.
2. As a developer, I want Mantine's hooks package installed, so that I can use its utility hooks and so that the core package's peer dependency is satisfied.
3. As a developer, I want to import any Mantine component directly from the Mantine package in any file, so that I don't have to go through a wrapper or barrel of our own.
4. As a developer, I want Mantine's provider set up once at the app root, so that every Page and Shared Component gets the theme without extra setup.
5. As a developer, I want the theme defined in its own module, so that future customisation has one obvious place to go.
6. As a developer, I want the theme's primary color set to green, so that buttons, links, loaders and other accent elements use the app's chosen color.
7. As a developer, I want the default radius set to medium, so that cards, buttons and inputs share consistently softened corners.
8. As a developer, I want the theme to set only what we deliberately chose, so that everything else follows Mantine's documented defaults.
9. As a developer, I want the app to use the light color scheme only, so that there is no dark-mode handling or flash-of-wrong-theme logic to maintain yet.
10. As a developer, I want Mantine's base stylesheet loaded before our global styles, so that our global rules win when they overlap.
11. As a developer, I want the global stylesheet stripped of rules Mantine already provides (the box-sizing reset, the font stack, the line height and the body padding), so that the two don't fight.
12. As a developer, I want the global stylesheet to stay in place with only its header comment, so that there is an established home for future global rules, already imported in the right order.
13. As a developer, I want Mantine's Sass helpers available in every SCSS file without writing an import, so that using them is as easy as using a CSS variable.
14. As a developer, I want those helpers under a `mantine` namespace, so that they never clash with Sass built-ins (Sass's own `rem()`) or with our own names.
15. As a developer, I want `mantine.rem()` to convert pixel values to rem, so that sizes scale with the user's font size.
16. As a developer, I want `mantine.$mantine-breakpoint-*` variables and the `smaller-than` / `larger-than` mixins, so that responsive styles use the same breakpoints as Mantine's components.
17. As a developer, I want the `hover` mixin, so that hover styles apply only on devices that can hover and fall back to the active state on touch.
18. As a developer, I want the helpers file to be a verbatim copy of Mantine's guide, so that a Mantine upgrade means copying the new version and diffing.
19. As a developer, I want the helpers file in the styles area next to the global stylesheet, so that every style file lives in one place.
20. As a developer, I want the helpers' breakpoint values to match the theme's breakpoints, so that SCSS media queries and Mantine's responsive props agree.
21. As a developer, I want Pages to keep their SCSS module next to them, so that the project's styling convention is unchanged.
22. As a developer, I want SCSS modules to be able to read Mantine's CSS variables (spacing, colors, the dimmed text color), so that custom styles follow the theme.
23. As a developer, I want the Home Page in a Mantine Container, so that it has consistent page padding and a sensible max width.
24. As a developer, I want Home's heading rendered with Mantine's Title, so that headings follow the theme's typography.
25. As a developer, I want Home's intro line rendered with Mantine's Text but styled from Home's SCSS module using Mantine's dimmed color variable, so that the demo shows SCSS and Mantine together.
26. As a user, I want to see a loading indicator while Items are loading, so that I know the app is working.
27. As a user, I want to see a clearly styled error message if Items fail to load, so that I know something went wrong.
28. As a user, I want each Item shown as a card with its name as the title and its description as dimmed text underneath, so that the list is easy to scan.
29. As a user, I want the cards evenly spaced in a vertical stack, so that the page looks tidy.
30. As a developer, I want the Home demo to use the existing Item data and API Hook, so that no fake demo content is added and the demo shows Mantine with real data access.
31. As a developer, I want the project's Code conventions to state how Mantine is used, so that reviewers check new code against it.
32. As a developer, I want the conventions to tell me how to translate Mantine docs examples written for the PostCSS preset (`rem(…)` → `mantine.rem(…)`, `@mixin hover` → `@include mantine.hover`), so that I don't paste syntax Sass silently drops or rejects.
33. As a developer, I want the Mantine and SCSS decision recorded as an ADR, so that the reasons for skipping the PostCSS preset aren't lost.
34. As a developer, I want the install, lint, build and dev-server checks to pass with my existing pnpm and Node, so that the build stays green.
35. As a developer, I want to be asked to stop my dev server before dependencies are installed, so that the shared Vite dependency cache isn't corrupted.

## Implementation Decisions

- **Dependencies.** Add `@mantine/core` and `@mantine/hooks` as runtime dependencies, both at `^9.6.3`, the current release. It requires React and React DOM `^19.2.0`, which the project already meets. No other Mantine packages (form, notifications, dates, modals): add them when a feature needs them. No PostCSS preset and no PostCSS config.
- **Theme module.** A new module at the `src` root, next to the query client module, exports a named `theme` built with Mantine's `createTheme`. It sets exactly two values: `primaryColor: "green"` and `defaultRadius: "md"`. Breakpoints stay at Mantine's defaults.
- **App root.** The entry module wraps the app in `MantineProvider` with that theme, inside `StrictMode`, around the existing Query Client provider and router. The color scheme stays at Mantine's default, light. Nothing changes in the HTML entry page: no color-scheme script is needed while the app is light-only.
- **Stylesheet order.** The entry module imports Mantine's base stylesheet (`@mantine/core/styles.css`) before the app's global stylesheet.
- **Global stylesheet.** Remove the font-stack variable, the box-sizing reset and both `body` rules (padding and font/line height). Keep the file, its import and its header comment. Update the comment if it no longer describes the contents.
- **Mantine Sass helpers.** A new partial in the styles area holds a verbatim copy of the `_mantine.scss` file from Mantine's "Usage with Sass" guide: the `sass:math` use, the five breakpoint variables, the `rem` function and the `light`, `dark`, `hover`, `smaller-than`, `larger-than`, `rtl` and `ltr` mixins. The leading underscore marks it as a partial, so it never compiles on its own.
- **Sass injection.** The Vite config adds `css.preprocessorOptions.scss.additionalData`, which prepends a `@use` of that partial `as mantine` to every SCSS file. The path is absolute and resolved the same way as the existing `@` alias. The guide's Windows backslash replacement is kept so the path works on every Host. The guide's `api: 'modern-compiler'` key is left out: Vite 8's Sass options no longer have `api` (the modern compiler is the only one), and the key would fail the type check.
- **No `light-dark()`.** It needs the PostCSS preset. The Sass variant is `@include mantine.light` / `@include mantine.dark`.
- **Home Page.** Rebuilt with Mantine, keeping its data access (`useItems`) and its states:
  - `Container` as the outer layout, replacing the bare `main` padding that `body` used to give. Keep a `main` landmark (e.g. `Container component="main"`).
  - `Title` for the "to-do-list" heading.
  - `Text` for the intro line, with its class from Home's SCSS module.
  - `Loader` while pending.
  - `Alert` (in the theme's red/error color, with a short title) on error, keeping the existing "Could not load Items." message.
  - A `Stack` of `Card`s when loaded, one per Item, keyed by `id`. Each card shows `name` as its title-weight text and `description` as dimmed `Text`.
  - Typed `FC`, named export, as before.
- **Home's SCSS module.** Stays. `.intro` uses `var(--mantine-color-dimmed)` for its color, keeps italic, and uses `mantine.rem()` for any size it sets. It no longer hard-codes `#555`.
- **Imports.** Mantine components are imported directly from `@mantine/core` wherever they're used. Nothing Mantine-related goes into the `@/components` barrel, which stays absent until the first Shared Component.
- **Code conventions.** Add one bullet to `CLAUDE.md`'s Code conventions saying that:
  - UI components come from `@mantine/core`, imported directly
  - custom styles go in the Page's or component's SCSS module, using Mantine's CSS variables and the injected `mantine` helpers
  - Mantine docs examples written for `postcss-preset-mantine` are translated to the Sass form (`mantine.rem(…)`, `@include mantine.<mixin>`, `mantine.$mantine-breakpoint-*`)

  Point to ADR-0002.
- **ADR.** ADR-0002 is already written. Implementation follows it and doesn't need to change it.
- **Domain glossary.** No change. Mantine is tooling, not a domain term. The existing terms (Page, Item, API Hook) are used as defined.

## Testing Decisions

- **No test runner exists**, and this feature doesn't add one. Agreed with the developer.
- **Seam 1: the Keep the build green checks** (`pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start). `pnpm build` type-checks the app and the Vite config, and compiles every SCSS file through the injected Sass helpers. That makes it the automated check for:
  - the config (including the dropped `api` key)
  - the helpers partial's path and namespace
  - correct use of `mantine.rem()` and `@include mantine.*`
  - Mantine component props

  The short `pnpm dev` start proves the dev server boots with the Sass injection.
- **Seam 2: the Home Page in the running app.** Open `/` and confirm:
  - the loader appears during the mock API's 500 ms delay
  - one card per Item appears afterwards, with corners and spacing from the theme
  - accent color is green wherever Mantine uses the primary color
  - the intro line is dimmed and italic, styled from the SCSS module
  - Mantine's font and base styles apply

  This tests external behavior only: what the developer sees.
- **The error state is checked by reading the code.** The mock adapter always succeeds and has no failure switch, so the `Alert` branch can't be triggered without changing code.
- **Prior art:** none. There are no tests in the repo. The verification follows the project's existing Keep the build green rule.

## Out of Scope

- A test runner (Vitest, Testing Library, Playwright) and automated tests. That's a feature of its own.
- `postcss-preset-mantine`, `postcss-simple-vars` and any `.module.css` files (ADR-0002).
- Dark mode, an `auto` color scheme, a color-scheme toggle, and the `index.html` color-scheme script.
- Optional Mantine packages: form, notifications, dates, modals, code highlight, and so on.
- Wrapping or re-exporting Mantine components, and any Shared Components.
- Theme customisation beyond `primaryColor` and `defaultRadius`: fonts, custom palettes, breakpoints, component default props.
- Restyling the NotFound Page or adding Pages. The demo is Home only.
- Right-to-left support. The `rtl`/`ltr` mixins come with the verbatim helpers file but aren't used.

## Further Notes

- Installing dependencies requires the developer's `pnpm dev` to be stopped first (Keep the build green rule).
- Mantine's documentation examples use PostCSS-preset syntax. In `.scss` files, `@mixin hover { … }` is silently swallowed as a Sass mixin definition, and bare `rem()` hits Sass's built-in modulo function and fails the build. Both were confirmed with the project's `sass-embedded` 1.105.0 during grilling. Always use the namespaced forms.
- If dark mode is added later, `light-dark()` stays unavailable (no preset). Use `@include mantine.light` / `@include mantine.dark`, and add the color-scheme script to the HTML entry page.
- If the theme's breakpoints are ever customised, update the helpers partial's breakpoint variables to match.
