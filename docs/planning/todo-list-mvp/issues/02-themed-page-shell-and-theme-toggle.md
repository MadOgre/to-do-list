# 02: Themed page shell and light/dark toggle

**Status:** ready-for-agent

**Blocked by:** 01

**Spec:** `docs/planning/todo-list-mvp/spec.md` · **ADR:** ADR-0002

**What to build:** The page looks like the design around the list. The style guide's colors and Josefin Sans come from the Mantine theme. The "TODO" header sits over the design's background image, which changes with light/dark and mobile/desktop. The list from ticket 01 sits in the centered, responsive card column. A sun/moon toggle switches the theme. The app starts in the OS setting, remembers the choice, and doesn't flash the wrong theme on load. The browser tab shows the design's favicon and "Todo app".

- [x] The theme carries the style guide:
  - Blue 500 as the primary color, as a custom color tuple, replacing green.
  - Josefin Sans as the font family.
  - The light and dark page, card, text, dimmed, Completed and divider colors from the spec, through custom colors and a CSS variables resolver.
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
  - the page color below the image
- [x] Layout is centered, with typography from the design's text presets (18px body on desktop, -0.25px letter spacing, smaller on mobile). There is no horizontal scroll from 320px up
- [x] SCSS modules use only Mantine CSS variables and the injected `mantine` helpers, with no hard-coded colors
- [x] The favicon is the design's 32×32 PNG, served from the public folder and replacing the SVG. The page title is "Todo app"
- [x] The untracked Figma screenshots and `STYLEGUIDE.md` move into a `design` folder in this feature's planning folder, and the empty root folder is removed
- [x] `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start all pass with the developer's pnpm and Node
- [ ] Manual check on `/`:
  - The theme starts from the OS setting.
  - The toggle switches the colors, icon and background image, and the choice survives a reload with no flash.
  - Check at 320px, 375px, just below and above 768px, and 1440px: the mobile and desktop images show, with no horizontal scroll.
  - Josefin Sans, the favicon and the title are in place.

## Comments

- 2026-10-05: Implemented. `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start pass with pnpm 10.34.5 and Node 22.23.3. Code review (Standards + Spec) is clean after round 3.
  - The theme's `body` color is the card color, because Mantine's Paper, Card and Modal use it. The page background is our own `--mantine-color-page`, set on `body` in `global.scss`.
  - `index.html` inlines what Mantine's `ColorSchemeScript` renders for `defaultColorScheme="auto"`, because the entry page is static HTML.
  - Review found that `main.tsx` imported the routes, and so the Pages' SCSS modules, before Mantine's styles. In the production CSS, Mantine's equal-specificity rules then beat ours. `main.tsx` now imports Mantine's styles and `global.scss` first.
  - The rows from ticket 01 sit in one card with the theme's divider color.
  - `icon-check.svg` and `icon-cross.svg` are committed with the other images, for tickets 03 and 04.
  - The manual check on `/` is left to the developer.
- 2026-10-05: The developer connected the Figma file and asked for every mismatch with the design to be fixed. Measured from the Desktop - Dark (`82139:237`) and Mobile - Light (`82139:335`) frames. Where Figma and the spec disagree, Figma wins:
  - Light dividers are Purple 300, not Gray 300. Dark Todo text is Purple 100, not Purple 300. The dark placeholder is Gray 600.
  - Cards have 5px corners, so `defaultRadius` is now 5, which overrides the spec's "unchanged". Their shadow is `0 35px 25px`, in `rgba(194, 195, 214, 0.5)` for light and `rgba(0, 0, 0, 0.5)` for dark, through `shadow="card"`.
  - Text has a line height of 1. The top padding is 48px at every width. Rows are padded 24px on desktop and 16 × 20px on mobile.
  - "TODO" is an image in the design. Josefin Sans Bold's glyph metrics put it at 40px text with 15px letter spacing on desktop, and 26.6px with 10px on mobile.
  - Other review-driven changes, made at the developer's request: the row dividers are drawn in SCSS instead of with `withBorder`; the dead `min-height` is gone; the letter spacing is in px.
