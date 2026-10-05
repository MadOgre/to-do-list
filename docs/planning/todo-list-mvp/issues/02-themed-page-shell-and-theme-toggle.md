# 02: Themed page shell and light/dark toggle

**Status:** ready-for-agent

**Blocked by:** 01

**Spec:** `docs/planning/todo-list-mvp/spec.md` · **ADR:** ADR-0002

**What to build:** The page looks like the design around the list. The style guide's colours and Josefin Sans come from the Mantine theme. The "TODO" header sits over the design's background image, which changes with light/dark and mobile/desktop. The list from ticket 01 sits in the centred, responsive card column. A sun/moon toggle switches the theme. The app starts in the OS setting, remembers the choice, and doesn't flash the wrong theme on load. The browser tab shows the design's favicon and "Todo app".

- [x] The theme carries the style guide:
  - Blue 500 as the primary colour, as a custom colour tuple, replacing green.
  - Josefin Sans as the font family.
  - The light and dark page, card, text, dimmed, Completed and divider colours from the spec, through custom colours and a CSS variables resolver.
  - `defaultRadius` and breakpoints unchanged.
- [x] Josefin Sans 400 and 700 load from Google Fonts `<link>`s (with preconnect) in the HTML entry page
- [x] `MantineProvider` uses `defaultColorScheme="auto"`, with Mantine's default `localStorage` color scheme manager. `ColorSchemeScript` (or its equivalent) is in the HTML entry page, so there's no flash of the wrong theme
- [x] A theme toggle Shared Component, typed `FC` (or `FC<ThemeToggleProps>` if it takes props):
  - A Mantine `ActionIcon` showing the design's moon icon in light and sun icon in dark.
  - It uses `useMantineColorScheme`.
  - Its aria-label is "Switch to dark theme" or "Switch to light theme".
- [x] The components barrel is created with this first Shared Component, per the code conventions
- [x] Home shows the bold, white, widely letter-spaced "TODO" header with the theme toggle, over a full-width background image at the top of the page:
  - light/dark × mobile/desktop images from the images area
  - switched with `@include mantine.light` / `mantine.dark` and the `sm` breakpoint mixins
  - the page colour below the image
- [x] Layout is centred, with typography from the design's text presets (18px body on desktop, -0.25px letter spacing, smaller on mobile). There is no horizontal scroll from 320px up
- [x] SCSS modules use only Mantine CSS variables and the injected `mantine` helpers, with no hard-coded colours
- [x] The favicon is the design's 32×32 PNG, served from the public folder and replacing the SVG. The page title is "Todo app"
- [x] The untracked Figma screenshots and `STYLEGUIDE.md` move into a `design` folder in this feature's planning folder, and the empty root folder is removed
- [x] `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start all pass with the developer's pnpm and Node
- [ ] Manual check on `/`:
  - The theme starts from the OS setting.
  - The toggle switches the colours, icon and background image, and the choice survives a reload with no flash.
  - Check at 320px, 375px, just below and above 768px, and 1440px: the mobile and desktop images show, with no horizontal scroll.
  - Josefin Sans, the favicon and the title are in place.

## Comments

- 2026-10-05: Implemented. `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start pass with pnpm 10.34.5 and Node 22.23.3. Code review (Standards + Spec) is clean after round 3.
  - The theme's `body` colour is the card colour, because Mantine's Paper, Card and Modal use it. The page background is our own `--mantine-color-page`, set on `body` in `global.scss`.
  - `index.html` inlines what Mantine's `ColorSchemeScript` renders for `defaultColorScheme="auto"`, because the entry page is static HTML.
  - Review found that `main.tsx` imported the routes, and so the Pages' SCSS modules, before Mantine's styles. In the production CSS, Mantine's equal-specificity rules then beat ours. `main.tsx` now imports Mantine's styles and `global.scss` first.
  - The rows from ticket 01 sit in one card with the theme's divider colour.
  - `icon-check.svg` and `icon-cross.svg` are committed with the other images, for tickets 03 and 04.
  - The manual check on `/` is left to the developer.
